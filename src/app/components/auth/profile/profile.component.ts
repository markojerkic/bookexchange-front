import {Component, OnInit} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {User} from "../../../model";
import {AuthService, NotificationService} from "../../../services";
import {catchError, finalize} from "rxjs/operators";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$!: Observable<User>;
  public userDataIsLoading!: boolean;

  constructor(private authService: AuthService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.userDataIsLoading = true;
    this.user$ = this.authService.getCurrentUser().pipe(finalize(() => this.userDataIsLoading = false),
      catchError((error: Error) => {
        this.notificationService.error('Greška prilikom dohvata podataka o korisniku');
        return throwError(error);
      }));
  }

}
