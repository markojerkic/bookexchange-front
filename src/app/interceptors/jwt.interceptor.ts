import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService, NotificationService} from "../services";
import {Observable, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import {LoggedInUser} from "../model";
import {Router} from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.authService.curretLoggedInUser;
    if (currentUser && currentUser.accessToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
    }

    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        return this.authService.refreshToken().pipe(switchMap((loggedInUser: LoggedInUser) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${loggedInUser.accessToken}`
            }
          });
          return next.handle(request);
        }), catchError((err) => {
          this.authService.logout();
          this.notificationService.error('Vaš token je istekao');
          this.router.navigate(['/login']);
          return throwError(err);
        }));
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
