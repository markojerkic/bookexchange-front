import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Observable, throwError} from "rxjs";
import {Advert} from "../../../../model";
import {AdvertService, NotificationService} from "../../../../services";
import {catchError, finalize} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-advert-view',
  templateUrl: './advert-view.component.html',
  styleUrls: ['./advert-view.component.scss']
})
export class AdvertViewComponent implements OnInit {

  public advert$!: Observable<Advert>;
  public loading: boolean;
  public images = [
    'https://plchldr.co/i/500x250',
    'https://plchldr.co/i/500x250',
    'https://plchldr.co/i/500x250',
    'https://plchldr.co/i/500x250',
  ];
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

  constructor(private activatedRoute: ActivatedRoute,
              private advertService: AdvertService,
              private notificationService: NotificationService) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.setAdvert();
    });
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
      }));
  }
}
