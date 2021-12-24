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
      map(authors => authors.map(author => {
        author.displayName = `${author.lastName}, ${author.firstName}`;
        return author;
      }))
    );
  }

  public getPagedAuthors(pageNumber: number, httpParams: HttpParams): Observable<Page<Author>> {
    return this.httpClient.get<Page<Author>>(this.backendEndpoint, {params: httpParams});
  }

  public saveAuthor(author: Author): Observable<Author> {
    return this.httpClient.post<Author>(this.backendEndpoint, author).pipe(
      map((author: Author) => {
        author.displayName = `${author.lastName}, ${author.firstName}`;
        return author;
      })
    );
  }
}
