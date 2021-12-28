import {Component, OnInit} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {Author, Book, Genre} from "../../../../model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthorService, AuthService, BookService, GenreService, NotificationService} from "../../../../services";
import {catchError, finalize, tap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.scss']
})
export class GenreViewComponent implements OnInit {

  public genre$!: Observable<Genre>;
  public authors$!: Observable<Author[]>;
  public books$!: Observable<Book[]>;
  public authorsLoaded: boolean;
  public booksLoaded: boolean;
  public loading: boolean;
  private id!: number;

  constructor(private activatedRoute: ActivatedRoute,
              private genreService: GenreService,
              private authorService: AuthorService,
              private bookService: BookService,
              private notificationService: NotificationService,
              public authService: AuthService,
              private router: Router) {
    this.loading = false;
    this.booksLoaded = false;
    this.authorsLoaded = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.setGenre();
    });
  }

  public editGenre(genreId: number): void {
    this.router.navigate([`/genre/edit/${genreId}`]);
  }

  private setGenre(): void {
    this.loading = true;
    this.genre$ = this.genreService.getGenreById(this.id).pipe(
      finalize(() => this.loading = false),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.notificationService.error(`Knjiga s id-om ${this.id} ne postoji`);
        } else {
          this.notificationService.error('Greška prilikom dohvata oglasa');
        }
        return throwError(() => error);
      }), tap((genre: Genre) => {
        this.books$ = this.bookService.getAllByGenreId(genre.id!).pipe(tap(() => this.booksLoaded = true));
        this.authors$ = this.authorService.getAllByGenreId(genre.id!).pipe(tap(() => this.authorsLoaded = true));
      }));
  }
}
