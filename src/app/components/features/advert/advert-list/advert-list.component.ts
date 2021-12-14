import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Advert, Page} from "../../../../model";
import {AdvertService, NotificationService} from "../../../../services";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-advert-list',
  templateUrl: './advert-list.component.html',
  styleUrls: ['./advert-list.component.scss']
})
export class AdvertListComponent implements OnInit {

  public adverts$!: Observable<Advert[]>;
  public currentPage: number;
  public advertLoading: boolean;
  public totalAdverts: number;

  constructor(private advertService: AdvertService,
              private notificationService: NotificationService) {
    this.currentPage = 0;
    this.advertLoading = true;
    this.totalAdverts = 0;
  }

  ngOnInit(): void {
    this.loadAdvertPage({page: this.currentPage, rows: 10});
  }

  public loadAdvertPage(pageRequest: {page: number, rows: number}): void {
    this.adverts$ = this.advertService.getAdvertPage(pageRequest.page).pipe(
      tap((page: Page<Advert>) => {
        this.advertLoading = false;
        this.currentPage = page.pageable.pageNumber;
        this.totalAdverts = page.totalElements;
      }, () => {
        this.currentPage = 0;
        this.totalAdverts = 0;
        this.advertLoading = false;
        this.notificationService.error('Došlo je do greške prilikom dohvata pitanja');
      }),
      map((page: Page<Advert>) => page.content)
    );

  }
}
