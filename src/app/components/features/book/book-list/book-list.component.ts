import {Component, OnInit} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {Author, Book, Page} from "../../../../model";
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {AuthorService, AuthService, BookService, NotificationService} from "../../../../services";
import {HttpParams} from "@angular/common/http";
import {catchError, finalize, map, tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  public today: Date;

  public books$!: Observable<Book[]>;
  public currentPage: number;
  public booksLoading: boolean;
  public totalBooks: number;

  public selectedBookId?: number;

  public authors$!: Observable<Author[]>;
  public bookActions$: Observable<MenuItem[]>;
  private bookIsDeleting: boolean;
  private lastLazyLoadEvent?: LazyLoadEvent;

  constructor(private bookService: BookService,
              private authorService: AuthorService,
              private notificationService: NotificationService,
              public router: Router,
              authService: AuthService) {
    this.today = new Date();
    this.currentPage = 0;
    this.booksLoading = false;
    this.totalBooks = 0;
    this.bookIsDeleting = false;

    this.bookActions$ = authService.isUserAdmin$.pipe(map((isAdmin: boolean) => {
      return [
        {
          label: 'Uredi knjigu',
          icon: 'pi pi-pencil',
          disabled: !isAdmin,
          command: () => {
            this.router.navigate([`/book/edit/${this.selectedBookId}`])
          }
        },
        {
          label: 'Izbriši knjigu',
          icon: 'pi pi-trash',
          disabled: !isAdmin,
          command: () => {
            this.deleteBook(this.selectedBookId)
          }
        }
      ];
    }));
  }

  ngOnInit(): void {
    this.authors$ = this.authorService.getAllAuthors();
  }

  public loadBooks(event: LazyLoadEvent): void {
    this.lastLazyLoadEvent = event;
    this.booksLoading = true;
    let httpParams = new HttpParams().append('page', String(event.first! / event.rows!))
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

    this.books$ = this.bookService.getPagedBooks(this.currentPage, httpParams).pipe(
      finalize(() => this.booksLoading = false),
      tap((page: Page<Book>) => {
        this.currentPage = page.pageable.pageNumber;
        this.totalBooks = page.totalElements;
      }, () => {
        this.currentPage = 0;
        this.totalBooks = 0;
        this.notificationService.error('Došlo je do greške prilikom dohvata knjiga');
      }),
      map((page: Page<Book>) => page.content)
    );
  }

  private deleteBook(selectedBookId: number | undefined): void {
    if (!selectedBookId) {
      return;
    }

    this.bookIsDeleting = true;
    this.bookService.deleteBook(selectedBookId).pipe(finalize(() => this.bookIsDeleting = false),
      catchError((error: Error) => {
        this.notificationService.error('Greška prilikom brisanja knjige');
        return throwError(() => error);
      })).subscribe(() => {
      this.loadBooks(this.lastLazyLoadEvent!);
    });
  }

  public newBook(): void {
    this.router.navigate(['/book']);
  }
}
