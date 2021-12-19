import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Observable } from 'rxjs';
import { LoggedInUser } from './model';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public menuItems!: MenuItem[];
  public authModelItems!: MenuItem[];
  public loginItems!: MenuItem[];

  public userToken$!: Observable<LoggedInUser | undefined>;
  public isAuthenticated$!: Observable<boolean>;

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.menuItems= [
      {
        label: 'Oglasi',
        icon:'pi pi-book',
        items: [
          {
            label: 'Pregledaj sve oglase',
            icon: 'pi pi-list',
            command: () => {this.router.navigate(['/adverts'])}
          },
          {
            label: 'Novi oglas',
            icon: 'pi pi-plus',
            command: () => {this.router.navigate(['/advert'])}
          }
        ]
      },
      {
        label: 'Autori',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Novi autor',
            icon: 'pi pi-plus',
            command: () => {this.router.navigate(['/author'])}
          }
        ]
      },
      {
        label: 'Knjige',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Nova knjiga',
            icon: 'pi pi-plus',
            command: () => {this.router.navigate(['/book'])}
          }
        ]
      },
      {
        label: 'Žanrovi',
        icon: 'pi pi-th-large',
        items: [
          {
            label: 'Novi žanr',
            icon: 'pi pi-plus',
            command: () => {this.router.navigate(['/genre'])}
          }
        ]
      },
    ];
    this.authModelItems = [
      {
        label: 'Moj profil',
        icon: 'pi pi-user',
        command: () => {this.router.navigate(['/auth/profile'])}
      },

      {
        label: 'Odjavi se',
        icon: 'pi pi-user-minus',
        command: () => {this.authService.logout()}
      }
    ];
    this.loginItems = [{
      label: 'Registracija',
      icon: 'pi pi-user-plus',
      command: () => {this.router.navigate(['/auth/register'])}
    }];


    this.userToken$ = this.authService.userToken$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;

  }

  public navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
