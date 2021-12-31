import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  AdvertComponent,
  AdvertListComponent,
  AdvertViewComponent,
  AuthorComponent,
  AuthorListComponent,
  AuthorViewComponent,
  BookComponent,
  BookListComponent,
  BookViewComponent,
  GenreComponent,
  GenreListComponent,
  GenreViewComponent,
  LoginComponent,
  ProfileComponent,
  RegisterComponent
} from "./components";
import {AuthGuard} from "./util";

const routes: Routes = [
  {
    path: '',
    component: AdvertListComponent
  },
  {
    path: 'advert',
    component: AdvertComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'advert/:id',
    component: AdvertViewComponent
  },
  {
    path: 'advert/edit/:id',
    component: AdvertComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adverts',
    component: AdvertListComponent
  },
  {
    path: 'author',
    component: AuthorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'author/:id',
    component: AuthorViewComponent
  },
  {
    path: 'author/edit/:id',
    component: AuthorComponent,
    canActivate: [AuthGuard],
    data: {
      adminRequired: true
    }
  },
  {
    path: 'authors',
    component: AuthorListComponent
  },
  {
    path: 'book',
    component: BookComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'book/:id',
    component: BookViewComponent
  },
  {
    path: 'book/edit/:id',
    component: BookComponent,
    canActivate: [AuthGuard],
    data: {
      adminRequired: true
    }
  },
  {
    path: 'books',
    component: BookListComponent
  },
  {
    path: 'genre',
    component: GenreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'genre/edit/:id',
    component: GenreComponent,
    canActivate: [AuthGuard],
    data: {
      adminRequired: true
    }
  },
  {
    path: 'genre/:id',
    component: GenreViewComponent
  },
  {
    path: 'genres',
    component: GenreListComponent
  },
  {
    path: 'user/:username',
    component: ProfileComponent
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
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
