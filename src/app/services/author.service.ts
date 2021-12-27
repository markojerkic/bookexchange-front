import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Author, Page} from "../model";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/author`;
  }

  public getAllAuthors(): Observable<Author[]> {
    return this.httpClient.get<Author[]>(`${this.backendEndpoint}/all`).pipe(
      map(authors => authors.map(this.mapAuthor))
    );
  }

  public getPagedAuthors(pageNumber: number, httpParams: HttpParams): Observable<Page<Author>> {
    return this.httpClient.get<Page<Author>>(this.backendEndpoint, {params: httpParams});
  }

  public saveAuthor(author: Author, id: number | undefined): Observable<Author> {
    if (id) {
      return this.updateAuthor(author, id);
    }
    return this.saveNewAuthor(author);
  }

  private saveNewAuthor(author: Author): Observable<Author> {
    return this.httpClient.post<Author>(this.backendEndpoint, author).pipe(map(this.mapAuthor));
  }

  private updateAuthor(author: Author, id: number): Observable<Author> {
    return this.httpClient.patch<Author>(`${this.backendEndpoint}/${id}`, author).pipe(map(this.mapAuthor));
  }

  public getAuthorById(id: number): Observable<Author> {
    return this.httpClient.get<Author>(`${this.backendEndpoint}/${id}`).pipe(map(this.mapAuthor));
  }

  private mapAuthor(author: Author): Author {
    author.yearOfBirth = new Date(author.yearOfBirth);
    if (author.yearOfDeath) {
      author.yearOfDeath = new Date(author.yearOfDeath);
    }
    author.displayName = `${author.lastName}, ${author.firstName}`;
    return author;
  }

  public deleteAuthor(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.backendEndpoint}/${id}`);
  }
}
