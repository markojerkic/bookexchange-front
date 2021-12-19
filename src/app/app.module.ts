import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {
  AdvertComponent,
  AdvertListComponent,
  AdvertPreviewComponent,
  AuthorComponent,
  BookComponent,
  GenreComponent,
  HomeComponent,
  LoginComponent,
  ProfileComponent,
  RegisterComponent
} from './components';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {CardModule} from "primeng/card";
import {SplitButtonModule} from "primeng/splitbutton";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {MenuModule} from 'primeng/menu';
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputNumberModule} from "primeng/inputnumber";
import {PaginatorModule} from "primeng/paginator";
import {DividerModule} from "primeng/divider";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {MultiSelectModule} from "primeng/multiselect";
import {ImageModule} from "primeng/image";
import {CalendarModule} from "primeng/calendar";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AdvertComponent,
    AdvertListComponent,
    AdvertPreviewComponent,
    BookComponent,
    AuthorComponent,
    GenreComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        MenubarModule,
        ButtonModule,
        CardModule,
        SplitButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        MenuModule,
        DropdownModule,
        InputTextareaModule,
        InputNumberModule,
        PaginatorModule,
        DividerModule,
        ProgressSpinnerModule,
        RippleModule,
        TooltipModule,
        DynamicDialogModule,
        MultiSelectModule,
        ImageModule,
        CalendarModule
    ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  entryComponents: [BookComponent, AuthorComponent, GenreComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
