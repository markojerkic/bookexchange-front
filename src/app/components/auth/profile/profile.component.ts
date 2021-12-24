import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../../model";
import {AuthService, NotificationService} from "../../../services";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$!: Observable<User>;

  constructor(private authService: AuthService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser();
  }

}
