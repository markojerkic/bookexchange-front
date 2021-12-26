import {Component, OnInit} from '@angular/core';
import {Genre, Page} from "../../../../model";
import {Observable} from "rxjs";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {GenreService, NotificationService} from "../../../../services";
import {Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {finalize, map, tap} from "rxjs/operators";

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.component.html',
  styleUrls: ['./genre-list.component.scss']
})
export class GenreListComponent implements OnInit {

  public today: Date;

  public genres$!: Observable<Genre[]>;
  public currentPage: number;
  public genresLoading: boolean;
  public totalGenres: number;
  public genreActions: MenuItem[];

  public selectedGenreId?: number;

  constructor(private genreService: GenreService,
              private notificationService: NotificationService,
              public router: Router) {
    this.today = new Date();
    this.currentPage = 0;
    this.genresLoading = false;
    this.totalGenres = 0;

    this.genreActions = [
      {
        label: 'Uredi žanr',
        icon: 'pi pi-pencil',
        command: () => {this.router.navigate([`/genre/edit/${this.selectedGenreId}`])}
      },
      {
        label: 'Izbriši žanr',
        icon: 'pi pi-trash',
        command: () => {this.deleteGenre(this.selectedGenreId)}
      }
    ];
  }

  ngOnInit(): void {
  }

  public loadGenres(event: LazyLoadEvent): void {
    this.genresLoading = true;
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

    this.genres$ = this.genreService.getPagedGenres(this.currentPage, httpParams).pipe(
      finalize(() => this.genresLoading = false),
      tap((page: Page<Genre>) => {
        this.currentPage = page.pageable.pageNumber;
        this.totalGenres = page.totalElements;
      }, () => {
        this.currentPage = 0;
        this.totalGenres = 0;
        this.notificationService.error('Došlo je do greške prilikom dohvata žanra');
      }),
      map((page: Page<Genre>) => page.content)
    );
  }

  private deleteGenre(genreId: number | undefined) {

  }

  public newGenre(): void {
    this.router.navigate(['/genre']);
  }
}
