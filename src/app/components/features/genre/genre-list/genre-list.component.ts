import {Component, OnInit} from '@angular/core';
import {Genre, Page} from "../../../../model";
import {Observable, throwError} from "rxjs";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {AuthService, GenreService, NotificationService} from "../../../../services";
import {Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {catchError, finalize, map, tap} from "rxjs/operators";

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
  public genreActions$: Observable<MenuItem[]>;

  public selectedGenreId?: number;
  private genreIsDeleting: boolean;
  private lastLazyLoadEvent?: LazyLoadEvent;

  constructor(private genreService: GenreService,
              private notificationService: NotificationService,
              public router: Router,
              authService: AuthService) {
    this.today = new Date();
    this.currentPage = 0;
    this.genresLoading = false;
    this.totalGenres = 0;
    this.genreIsDeleting = false;


    this.genreActions$ = authService.isUserAdmin$.pipe(map((isAdmin: boolean) => {
      return [
        {
          label: 'Uredi žanr',
          icon: 'pi pi-pencil',
          disabled: !isAdmin,
          command: () => {
            this.router.navigate([`/genre/edit/${this.selectedGenreId}`])
          }
        },
        {
          label: 'Izbriši žanr',
          icon: 'pi pi-trash',
          disabled: !isAdmin,
          command: () => {
            this.deleteGenre(this.selectedGenreId)
          }
        }
      ];
    }));
  }

  ngOnInit(): void {
  }

  public loadGenres(event: LazyLoadEvent): void {
    this.lastLazyLoadEvent = event;

    this.genresLoading = true;
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', String(event.first! / event.rows!))
      .append('size', event.rows!);
    if (event.sortField) {
      httpParams = httpParams.append('sort', `${event.sortField},${event.sortOrder === -1 ? 'ASC' : 'DESC'}`);
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

  public newGenre(): void {
    this.router.navigate(['/genre']);
  }

  private deleteGenre(selectedGenreId: number | undefined) {
    if (!selectedGenreId) {
      return;
    }

    this.genreIsDeleting = true;
    this.genreService.deleteGenre(selectedGenreId).pipe(finalize(() => this.genreIsDeleting = false),
      catchError((error: Error) => {
        this.notificationService.error('Greška prilikom brisanja žanra');
        return throwError(() => error);
      })).subscribe(() => {
      this.loadGenres(this.lastLazyLoadEvent!);
    });

  }
}
