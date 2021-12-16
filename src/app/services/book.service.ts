import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Book} from "../model";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/book`;
  }

  public getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.backendEndpoint}/all`);
  }

  public saveBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(this.backendEndpoint, book);
  }
}
