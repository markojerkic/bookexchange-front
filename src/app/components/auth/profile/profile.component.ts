import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, tap, throwError} from "rxjs";
import {Review, User} from "../../../model";
import {AuthService, NotificationService, ReviewService} from "../../../services";
import {catchError, finalize, takeUntil} from "rxjs/operators";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public reviewSubmitLoading: boolean;
  public loadReviews$: Subject<number>;
  public clearReviewForm$: Subject<void>;

  private onDestroy$: Subject<void>;

  public username?: string;

  public user$!: Observable<User>;
  public userDataIsLoading!: boolean;

  constructor(public authService: AuthService,
              private notificationService: NotificationService,
              private reviewService: ReviewService,
              private activatedRoute: ActivatedRoute) {
    this.clearReviewForm$ = new Subject();
    this.loadReviews$ = new Subject();
    this.reviewSubmitLoading = false;

    this.onDestroy$ = new Subject();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
    this.loadReviews$.unsubscribe();
    this.clearReviewForm$.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const username = params['username'];
      if (username) {
        this.username = username;
        this.getUserInfo();
      } else {
        this.getSignedInInfo();
      }
    });
  }

  private getSignedInInfo(): void {
    this.userDataIsLoading = true;
    this.user$ = this.authService.getCurrentUser().pipe(finalize(() => this.userDataIsLoading = false),
      catchError((error: Error) => {
        this.notificationService.error('Greška prilikom dohvata podataka o korisniku');
        return throwError(() => error);
      }), tap((user: User) => this.loadReviews$.next(user.id!)));
  }

  private getUserInfo(): void {
    this.userDataIsLoading = true;
    this.user$ = this.authService.getUserByUsername(this.username!)
      .pipe(finalize(() => this.userDataIsLoading = false),
      catchError((error: Error) => {
        this.notificationService.error(`Greška prilikom dohvata podataka o korisniku ${this.username!}`);
        return throwError(() => error);
      }), tap((user: User) => this.loadReviews$.next(user.id!)));
  }

  public submitReview(review: Review, userId: number): void {
    this.reviewSubmitLoading = true;
    this.reviewService.addUserReview(review, userId).pipe(finalize(() => this.reviewSubmitLoading = false),
      takeUntil(this.onDestroy$),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error('Greška prilikom dodavanja recenzije');
        return throwError(() => error);
      })).subscribe((review: Review) => {
      this.clearReviewForm$.next();
      this.loadReviews$.next(review.id!);
    });
  }
}
