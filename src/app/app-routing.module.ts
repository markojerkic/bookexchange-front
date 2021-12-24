import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  AdvertComponent,
  AdvertListComponent,
  AuthorComponent,
  AuthorListComponent,
  BookComponent,
  BookListComponent,
  GenreComponent,
  GenreListComponent,
  LoginComponent,
  ProfileComponent,
  RegisterComponent
} from "./components";

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
    path: 'authors',
    component: AuthorListComponent
  },
  {
    path: 'book',
    component: BookComponent
  },
  {
    path: 'books',
    component: BookListComponent
  },
  {
    path: 'genre',
    component: GenreComponent
  },
  {
    path: 'genres',
    component: GenreListComponent
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
