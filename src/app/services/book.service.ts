import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Book, Page} from "../model";
import {map} from "rxjs/operators";
import {AuthorService} from '.';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient,
              private authorService: AuthorService) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/book`;
  }

  public getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.backendEndpoint}/all`).pipe(map((books: Book[]) => {
      return books.map((book: Book) => {
        book.displayName = `${book.title} - ${book.bookAuthor!.firstName} ${book.bookAuthor!.lastName}`;
        book.bookAuthor = this.authorService.mapAuthor(book.bookAuthor!);
        return book;
      })
    }));
  }

  public getPagedBooks(pageNumber: number, httpParams: HttpParams): Observable<Page<Book>> {
    return this.httpClient.get<Page<Book>>(this.backendEndpoint, {params: httpParams}).pipe(
      map((books: Page<Book>) => {
        books.content = books.content.map(this.mapBook);
        return books;
      })
    );
  }

  public mapBook(book: Book): Book {
    book.bookAuthor!.displayName = `${book.bookAuthor!.lastName}, ${book.bookAuthor!.firstName}`;
    return book;
  }

  public saveBook(book: Book, id: number | undefined): Observable<Book> {
    if (id) {
      return this.updateBook(book, id);
    }
    return this.saveNewBook(book);
  }

  public getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.backendEndpoint}/${id}`).pipe(map((book: Book) => {
      book.bookAuthor = this.authorService.mapAuthor(book.bookAuthor!);
      return book;
    }));
  }

  public deleteBook(bookId: number): Observable<Object> {
    return this.httpClient.delete(`${this.backendEndpoint}/${bookId}`);
  }

  private updateBook(book: any, id: number): Observable<Book> {
    return this.httpClient.patch<Book>(`${this.backendEndpoint}/${id}`, book);
  }

  private saveNewBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(this.backendEndpoint, book);
  }

}
