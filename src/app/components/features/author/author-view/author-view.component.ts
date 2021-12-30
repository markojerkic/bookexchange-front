import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, tap, throwError} from "rxjs";
import {Author, Review} from "../../../../model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthorService, AuthService, NotificationService, ReviewService} from "../../../../services";
import {catchError, finalize, takeUntil} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {ImageUtil} from "../../../../util";

@Component({
  selector: 'app-author-view',
  templateUrl: './author-view.component.html',
  styleUrls: ['./author-view.component.scss']
})
export class AuthorViewComponent implements OnInit, OnDestroy {

  public reviewSubmitLoading: boolean;
  public loadReviews$: Subject<number>;
  public clearReviewForm$: Subject<void>;

  private onDestroy$: Subject<void>;

  public author$!: Observable<Author>;
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
              private authorService: AuthorService,
              private notificationService: NotificationService,
              public authService: AuthService,
              private reviewService: ReviewService,
              private router: Router) {
    this.loading = false;

    this.clearReviewForm$ = new Subject();
    this.loadReviews$ = new Subject();
    this.reviewSubmitLoading = false;

    this.onDestroy$ = new Subject();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.setAuthor();
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
    this.loadReviews$.unsubscribe();
    this.clearReviewForm$.unsubscribe();
  }

  public editAuthor(authorId: number): void {
    this.router.navigate([`/author/edit/${authorId}`]);
  }

  private setAuthor(): void {
    this.loading = true;
    this.author$ = this.authorService.getAuthorById(this.id).pipe(
      finalize(() => this.loading = false),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.notificationService.error(`Knjiga s id-om ${this.id} ne postoji`);
        } else {
          this.notificationService.error('Greška prilikom dohvata oglasa');
        }
        return throwError(() => error);
      }), tap((author: Author) => {
        this.loadReviews$.next(author.id!);
        this.images = author.authorImages.map(ImageUtil.getImageUrl);
      }));
  }

  public submitReview(review: Review, bookId: number): void {
    this.reviewSubmitLoading = true;
    this.reviewService.addAuthorReview(review, bookId).pipe(finalize(() => this.reviewSubmitLoading = false),
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
