import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {Book, Review} from "../../../../model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService, BookService, NotificationService, ReviewService} from "../../../../services";
import {catchError, finalize, takeUntil, tap} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageUtil} from "../../../../util";

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.scss']
})
export class BookViewComponent implements OnInit, OnDestroy {

  public reviewSubmitLoading: boolean;
  public loadReviews$: Subject<number>;
  public clearReviewForm$: Subject<void>;

  private onDestroy$: Subject<void>;

  public book$!: Observable<Book>;
  public loading: boolean;
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

  constructor(private activatedRoute: ActivatedRoute,
              private bookService: BookService,
              private notificationService: NotificationService,
              public authService: AuthService,
              private router: Router,
              private reviewService: ReviewService) {
    this.loading = false;

    this.clearReviewForm$ = new Subject();
    this.loadReviews$ = new Subject();
    this.reviewSubmitLoading = false;

    this.onDestroy$ = new Subject();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.setBook();
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
    this.loadReviews$.unsubscribe();
    this.clearReviewForm$.unsubscribe();
  }

  public editBook(bookId: number): void {
    this.router.navigate([`/book/edit/${bookId}`]);
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
      }), tap((book: Book) => {
        this.images = book.bookImages.map(ImageUtil.getImageUrl);
        this.loadReviews$.next(book.id!);
      }));
  }

  public submitReview(review: Review, bookId: number): void {
    this.reviewSubmitLoading = true;
    this.reviewService.addBookReview(review, bookId).pipe(finalize(() => this.reviewSubmitLoading = false),
      takeUntil(this.onDestroy$),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.error('Greška prilikom dodavanja recenzije');
        return throwError(() => error);
      })).subscribe((review: Review) => {
      this.clearReviewForm$.next();
      this.loadReviews$.next(review.id!);
    });
  }
}
