import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Book, Page} from "../model";
import {map} from "rxjs/operators";

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

  public getPagedBooks(pageNumber: number, httpParams: HttpParams): Observable<Page<Book>> {
    return this.httpClient.get<Page<Book>>(this.backendEndpoint, {params: httpParams}).pipe(
      map((books: Page<Book>) => {
        books.content = books.content.map((book: Book) => {
          book.bookAuthor!.displayName = `${book.bookAuthor!.lastName}, ${book.bookAuthor!.firstName}`;
          return book;
        });
        return books;
      })
    );
  }
  public saveBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(this.backendEndpoint, book);
  }
}
