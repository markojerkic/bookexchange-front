import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, throwError} from "rxjs";
import {Advert, LoggedInUser} from "../../../../model";
import {AdvertService, AuthService, NotificationService} from "../../../../services";
import {catchError, finalize, map, tap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageUtil} from "../../../../util";

@Component({
  selector: 'app-advert-view',
  templateUrl: './advert-view.component.html',
  styleUrls: ['./advert-view.component.scss']
})
export class AdvertViewComponent implements OnInit {

  public advert$!: Observable<Advert>;
  public loading: boolean;
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
              private authService: AuthService) {
    this.loading = false;
    this.advertIsDeleting = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
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

  public editAdvert(advertId: number): void {
    this.router.navigate([`/advert/edit/${advertId}`]);
  }

  public deleteAdvert(advertId: number): void {
    this.advertIsDeleting = true;
    this.advertService.deleteAdvert(advertId).pipe(finalize(() => this.advertIsDeleting = false),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
         this.notificationService.warn('Nemate pravo izbrisati ovaj oglas');
        } else {
          this.notificationService.error('Greška prilikom brisanja oglasa');
        }
        return throwError(() => error);
      })).subscribe();
  }
}
