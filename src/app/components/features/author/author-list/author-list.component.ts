import {Component, OnInit} from '@angular/core';
import {AuthorService, NotificationService} from "../../../../services";
import {Observable} from "rxjs";
import {Author, Page} from "../../../../model";
import {HttpParams} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {LazyLoadEvent, MenuItem} from "primeng/api";

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.scss']
})
export class AuthorListComponent implements OnInit {

  public today: Date;

  public authors$!: Observable<Author[]>;
  public currentPage: number;
  public authorsLoading: boolean;
  public totalAuthors: number;
  public authorActions: MenuItem[];

  constructor(private authorService: AuthorService,
              private notificationService: NotificationService) {
    this.today = new Date();
    this.currentPage = 0;
    this.authorsLoading = false;
    this.totalAuthors = 0;

    this.authorActions = [
      {
        label: 'Izbriši autora',
        icon: 'pi pi-trash',
        command: () => {}
      }
    ];
  }

  ngOnInit(): void {
  }

  public loadAuthors(event: LazyLoadEvent): void {
    this.authorsLoading = true;
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', String(event.first! / event.rows!))
      .append('size', event.rows!);
    if (event.sortField) {
      httpParams = httpParams.append('sort', `${event.sortField},${event.sortOrder === -1? 'ASC': 'DESC'}`);
    }
    Object.keys(event.filters!).filter(key => event.filters![key].value).forEach(key => {
      if (event.filters![key].value instanceof Date) {
        httpParams = httpParams.append(key, (event.filters![key].value as Date).valueOf());
      } else {
        httpParams = httpParams.append(key, event.filters![key].value);
      }
    });

    this.authors$ = this.authorService.getPagedAuthors(this.currentPage, httpParams).pipe(
      tap((page: Page<Author>) => {
        this.authorsLoading = false;
        this.currentPage = page.pageable.pageNumber;
        this.totalAuthors = page.totalElements;
      }, () => {
        this.currentPage = 0;
        this.totalAuthors = 0;
        this.authorsLoading = false;
        this.notificationService.error('Došlo je do greške prilikom dohvata autora');
      }),
      map((page: Page<Author>) => page.content)
    );
  }
}
