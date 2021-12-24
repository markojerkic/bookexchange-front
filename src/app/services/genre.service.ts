import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Genre} from "../model";
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

  public saveGenre(genre: Genre): Observable<Genre> {
    return this.httpClient.post<Genre>(this.backendEndpoint, genre);

  }
}
