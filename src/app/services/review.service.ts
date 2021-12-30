import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Review} from "../model";
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

  public getAdvertReviews(advertId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.backendEndpoint}/advert/${advertId}`);
  }

  public addBookReview(review: Review, bookId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/book/${bookId}`, review);
  }

  public getBookReviews(bookId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.backendEndpoint}/book/${bookId}`);
  }

  public addAuthorReview(review: Review, authorId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/author/${authorId}`, review);
  }

  public getAuthorReviews(authorId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.backendEndpoint}/author/${authorId}`);
  }

  public addUserReview(review: Review, userId: number): Observable<Review> {
    return this.httpClient.post<Review>(`${this.backendEndpoint}/user/${userId}`, review);
  }

  public getUserReviews(userId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.backendEndpoint}/user/${userId}`);
  }
}
