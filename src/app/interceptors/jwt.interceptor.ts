import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {empty, Observable, throwError} from "rxjs";
import {catchError, switchMap} from "rxjs/operators";
import {LoggedInUser} from "../model";
import {AuthService, NotificationService} from "../services";
import {Router} from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              private authService: AuthService,
              private notificationService: NotificationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let currentUser = this.authService.userToken;
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
        if (!this.authService.isAuthenticated) {
          this.notificationService.error('Niste prijavljeni');
          this.router.navigate(['/auth/login']);
        }
        return this.authService.refreshToken().pipe(switchMap((loggedInUser: LoggedInUser) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${loggedInUser.accessToken}`
            }
          });
          return next.handle(request);
        }), catchError((err) => {
          this.notificationService.error('Vaš token je istekao');
          this.router.navigate(['/auth/login']);
          return throwError(err);
        }));
      } else if (err.status === 403) {
        this.notificationService.warn('Nemate prava za tu akciju');
        return empty();
      }

      return throwError(err);
    }));
  }
}
