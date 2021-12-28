import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Genre, Page} from "../model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/genre`;
  }

  public getAllGenres(): Observable<Genre[]> {
    return this.httpClient.get<Genre[]>(`${this.backendEndpoint}/all`);
  }

  public saveGenre(genre: Genre, id: number | undefined): Observable<Genre> {
    if (id) {
      return this.updateGenre(genre, id);
    }
    return this.saveNewGenre(genre);
  }

  public getPagedGenres(pageNumber: number, httpParams: HttpParams): Observable<Page<Genre>> {
    return this.httpClient.get<Page<Genre>>(this.backendEndpoint, {params: httpParams});
  }

  public getGenreById(id: number): Observable<Genre> {
    return this.httpClient.get<Genre>(`${this.backendEndpoint}/${id}`);
  }

  public deleteGenre(genreId: number): Observable<Object> {
    return this.httpClient.delete(`${this.backendEndpoint}/${genreId}`);
  }

  private updateGenre(genre: any, id: number) {
    return this.httpClient.patch<Genre>(`${this.backendEndpoint}/${id}`, genre);
  }

  private saveNewGenre(genre: Genre) {
    return this.httpClient.post<Genre>(this.backendEndpoint, genre);
  }
}
