import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Review, ReviewPage, ReviewType} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/review`;
  }

  public addAdvertReview(review: Review, advertId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/advert/${advertId}`, review);
  }

  public addBookReview(review: Review, bookId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/book/${bookId}`, review);
  }

  public addAuthorReview(review: Review, authorId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/author/${authorId}`, review);
  }

  public addUserReview(review: Review, userId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/user/${userId}`, review);
  }

  public getReviews(id: number | string, reviewType: ReviewType, httpParams: HttpParams): Observable<ReviewPage> {
    switch (reviewType) {
      case ReviewType.ADVERT:
        return this.getAdvertReviews(<number>id, reviewType, httpParams);
      case ReviewType.AUTHOR:
        return this.getAuthorReviews(<number>id, reviewType, httpParams);
      case ReviewType.BOOK:
        return this.getBookReviews(<number>id, reviewType, httpParams);
      case ReviewType.USER:
        return this.getUserReviews(<string>id, reviewType, httpParams);
    }
  }

  public getUserReviews(username: string, reviewType: ReviewType, httpParams: HttpParams): Observable<ReviewPage> {
    httpParams = httpParams.append('username', username).append('reviewType', reviewType);
    return this.httpClient.get<ReviewPage>(this.backendEndpoint, {params: httpParams});
  }

  public getBookReviews(bookId: number, reviewType: ReviewType, httpParams: HttpParams): Observable<ReviewPage> {
    httpParams = httpParams.append('bookId', bookId).append('reviewType', reviewType);
    return this.httpClient.get<ReviewPage>(this.backendEndpoint, {params: httpParams});
  }

  public getAuthorReviews(authorId: number, reviewType: ReviewType, httpParams: HttpParams): Observable<ReviewPage> {
    httpParams = httpParams.append('authorId', authorId).append('reviewType', reviewType);
    return this.httpClient.get<ReviewPage>(this.backendEndpoint, {params: httpParams});
  }

  public getAdvertReviews(advertId: number, reviewType: ReviewType, httpParams: HttpParams): Observable<ReviewPage> {
    httpParams = httpParams.append('advertId', advertId).append('reviewType', reviewType);
    return this.httpClient.get<ReviewPage>(this.backendEndpoint, {params: httpParams});
  }
}
