import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, NotificationService} from "../../../services";
import {LoggedInUser, LoginRequest} from "../../../model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form!: FormGroup;
  public isAuthLoading!: boolean;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public submitLogin(): void {
    this.isAuthLoading = true;
    const loginRequest: LoginRequest = this.form.value;
    this.authService.login(loginRequest).subscribe((user: LoggedInUser) => {
      this.notificationService.success(`Korisnik ${user.username} je uspješno prijavljen`);
      this.isAuthLoading = false;
    }, (error: Error) => {
      this.notificationService.error('Došlo je do greške');
      this.isAuthLoading = false;
      console.log(error);
    });

  }
}
