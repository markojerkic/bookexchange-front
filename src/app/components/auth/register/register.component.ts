import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../../model";
import { AuthService, NotificationService } from '../../../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form!: FormGroup;
  public isAuthLoading!: boolean;

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.isAuthLoading = false;
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public submitRegistration(): void {
    this.authService.register(this.form.value).subscribe((user: User) => {
      this.notificationService.success(`Uspješno registriran korisnik ${user.username}`);
      this.router.navigate(['/auth/login']);
    }, (error: Error) => {
      this.notificationService.error('Greška prilikom registracije');
    });
  }
}
