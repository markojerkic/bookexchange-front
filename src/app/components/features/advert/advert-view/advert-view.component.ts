import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subject, throwError} from "rxjs";
import {Advert, LoggedInUser, Review} from "../../../../model";
import {AdvertService, AuthService, NotificationService, ReviewService} from "../../../../services";
import {catchError, finalize, map, takeUntil, tap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageUtil} from "../../../../util";

@Component({
  selector: 'app-advert-view',
  templateUrl: './advert-view.component.html',
  styleUrls: ['./advert-view.component.scss']
})
export class AdvertViewComponent implements OnInit, OnDestroy {

  public reviewSubmitLoading: boolean;

  public advert$!: Observable<Advert>;
  public loading: boolean;
  public reviewsLoading: boolean;
  private ngDestroy$: Subject<void>;
  public advertIsDeleting: boolean;
  public images?: string[];
  public responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  private id!: number;
  public username$!: Observable<string | undefined>;

  constructor(private activatedRoute: ActivatedRoute,
              private advertService: AdvertService,
              private notificationService: NotificationService,
              private router: Router,
              private reviewService: ReviewService,
              public authService: AuthService) {
    this.loading = false;
    this.reviewsLoading = false;
    this.reviewSubmitLoading = false;
    this.advertIsDeleting = false;

    this.ngDestroy$ = new Subject();
  }

  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.ngDestroy$)).subscribe((params: Params) => {
      this.id = params['id'];
      this.setAdvert();
    });

    this.username$ = this.authService.userToken$.pipe(map((token: LoggedInUser | undefined) => {
      if (!token) {
        return undefined;
      }
      return token.username;
    }))
  }

  public editAdvert(advertId: number): void {
    this.router.navigate([`/advert/edit/${advertId}`]);
  }

  public deleteAdvert(advertId: number): void {
    this.advertIsDeleting = true;
    this.advertService.deleteAdvert(advertId).pipe(finalize(() => this.advertIsDeleting = false),
      takeUntil(this.ngDestroy$),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.notificationService.warn('Nemate pravo izbrisati ovaj oglas');
        } else {
          this.notificationService.error('Greška prilikom brisanja oglasa');
        }
        return throwError(() => error);
      })).subscribe(() => this.router.navigate(['/']));
  }

  private setAdvert(): void {
    this.loading = true;
    this.advert$ = this.advertService.getAdvertById(this.id).pipe(
      finalize(() => this.loading = false),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.notificationService.error(`Oglas s id-om ${this.id} ne postoji`);
        } else {
          this.notificationService.error('Greška prilikom dohvata oglasa');
        }
        return throwError(() => error);
      }), tap((advert: Advert) => this.images = advert.advertImages.map(ImageUtil.getImageUrl)));
  }

  public submitReview(review: Review, advertId: number): void {
    this.reviewSubmitLoading = true;
    this.reviewService.addAdvertReview(review, advertId).pipe(finalize(() => this.reviewSubmitLoading = false),
      takeUntil(this.ngDestroy$),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error('Greška prilikom dodavanja recenzije');
        return throwError(() => error);
      })).subscribe(console.log);
  }
}
