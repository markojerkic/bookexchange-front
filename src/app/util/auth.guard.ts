import {ActivatedRouteSnapshot, CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService, NotificationService} from "../services";
import {Observable} from "rxjs";
import {LoggedInUser} from "../model";
import {map} from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate {

  public constructor(private authService: AuthService,
                     private router: Router,
                     private notificationService: NotificationService) {
  }


  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    const adminRequired = route.data.adminRequired;

    return this.authService.userToken$.pipe(map((token: LoggedInUser | undefined) => {
      const isAuthenticated = !!token;
      const isAdmin = !!token ? token.roles.includes('ROLE_ADMIN') : false;
      if (!isAuthenticated || (adminRequired && !isAdmin)) {
        if (!isAuthenticated) {
          this.notificationService.warn('Morate biti prijavljeni da pristupite toj ruti');
          this.router.navigate(['/auth/login']);
        } else {
          this.notificationService.warn('Nemate potrebna prava da pristupite toj ruti');
        }
        return false;
      }
      return true;
    }));
  }

}
