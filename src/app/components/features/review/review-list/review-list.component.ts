import {Component, Input, OnChanges} from '@angular/core';
import {Review, ReviewPage, ReviewType} from "../../../../model";
import {NotificationService, ReviewService} from "../../../../services";
import {catchError, finalize, map, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnChanges {
  public reviewType!: ReviewType;
  @Input()
  public loadReviewsEvent!: boolean;
  @Input()
  public advertId!: number;

  public totalReviews: number;
  public currentPage?: number;
  public reviewsLoading: boolean;
  public reviews$!: Observable<Review[]>;
  public averageReview?: number;

  constructor(private reviewService: ReviewService,
              private notificationService: NotificationService) {
    this.reviewsLoading = false;
    this.totalReviews = 0;
  }

  ngOnChanges(): void {
    this.loadReviews(0);
  }

  private loadReviews(page: number): void {
    this.reviewsLoading = true;
    const httpParams = new HttpParams().append('page', page).append('size', '10');
    this.reviews$ = this.reviewService.getReviews(this.advertId, this.reviewType, httpParams).pipe(
      finalize(() => this.reviewsLoading = false),
      catchError((error: Error) => {
        this.notificationService.error('Greška prilikom dohvata recenzija');
        return throwError(() => error);
      }), tap((reviewPage: ReviewPage) => {
        this.averageReview = reviewPage.averageReviewGrade;
        this.currentPage = reviewPage.reviews.pageable.pageNumber;
        this.totalReviews = reviewPage.reviews.totalElements;
      }), map(this.mapReviews));
  }

  @Input('reviewType')
  public set setReviewType(reviewType: string) {
    switch (reviewType) {
      case 'ADVERT':
        this.reviewType = ReviewType.ADVERT;
        break;
      case 'AUTHOR':
        this.reviewType = ReviewType.AUTHOR;
        break;
      case 'USER':
        this.reviewType = ReviewType.USER;
        break;
      case 'BOOK':
        this.reviewType = ReviewType.BOOK;
        break;
    }
  }

  private mapReviews(reviewPage: ReviewPage): Review[] {
    return reviewPage.reviews.content;
  }

  loadReviewPage(pageRequest: { page: number, rows: number }) {
    this.loadReviews(pageRequest.page);
  }
}
