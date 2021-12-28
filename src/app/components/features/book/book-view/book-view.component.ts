import {Component, OnInit} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {Book} from "../../../../model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService, BookService, NotificationService} from "../../../../services";
import {catchError, finalize} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit {

  private id!: number;
  public book$!: Observable<Book>;
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

  constructor(private activatedRoute: ActivatedRoute,
              private bookService: BookService,
              private notificationService: NotificationService,
              public authService: AuthService,
              private router: Router) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.setBook();
    });
  }

  private setBook(): void {
    this.loading = true;
    this.book$ = this.bookService.getBookById(this.id).pipe(
      finalize(() => this.loading = false),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.notificationService.error(`Knjiga s id-om ${this.id} ne postoji`);
        } else {
          this.notificationService.error('Greška prilikom dohvata oglasa');
        }
        return throwError(() => error);
      }));
  }

  public editBook(bookId: number): void {
    this.router.navigate([`/book/edit/${bookId}`]);
  }
}
