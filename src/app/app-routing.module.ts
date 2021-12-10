import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  HomeComponent,
  LoginComponent,
  ProfileComponent,
  RegisterComponent,
  AdvertComponent,
  AdvertListComponent
} from "./components";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'adverts',
    component: AdvertListComponent
  },
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }
    ]
  },
  {
    path: 'advert',
    component: AdvertComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
