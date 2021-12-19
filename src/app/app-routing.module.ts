import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  HomeComponent,
  LoginComponent,
  ProfileComponent,
  RegisterComponent,
  AdvertComponent,
  AdvertListComponent, BookComponent, GenreComponent
} from "./components";
import {AuthorComponent} from "./components/features/author/author/author.component";

const routes: Routes = [
  {
    path: '',
    component: AdvertListComponent
  },
  {
    path: 'adverts',
    component: AdvertListComponent
  },
  {
    path: 'author',
    component: AuthorComponent
  },
  {
    path: 'book',
    component: BookComponent
  },
  {
    path: 'genre',
    component: GenreComponent
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
