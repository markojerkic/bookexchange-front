import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {LoggedInUser, LoginRequest} from "../../../model";
import {AuthService, NotificationService} from "../../../services";
import {HttpErrorResponse} from "@angular/common/http";
import {finalize} from "rxjs/operators";

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
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.logout();
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public submitLogin(): void {
    this.isAuthLoading = true;
    const loginRequest: LoginRequest = this.form.value;
    this.authService.login(loginRequest).pipe(finalize(() => this.isAuthLoading = false))
      .subscribe((user: LoggedInUser) => {
        this.notificationService.success(`Korisnik ${user.username} je uspješno prijavljen`);
        this.router.navigate(['/auth/profile']);
      }, (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.notificationService.error(error.error.message);
        } else {
          this.notificationService.error('Došlo je do greške');
        }
      });

  }
}
