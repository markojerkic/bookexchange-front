import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Advert, Page} from "../model";
import {Observable} from "rxjs";
import {AuthorService} from "./author.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdvertService {
  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient,
              private authorService: AuthorService) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/advert`;
  }

  public saveAdvert(advert: Advert): Observable<Advert> {
    return this.httpClient.post<Advert>(this.backendEndpoint, advert);
  }

  public getAdvertPage(pageNumber: number, httpParams?: HttpParams): Observable<Page<Advert>> {
    if (!httpParams) {
      httpParams = new HttpParams();
    }
    httpParams = httpParams.append('page', String(pageNumber)).append('size', '10');

    return this.httpClient.get<Page<Advert>>(this.backendEndpoint, {params: httpParams});
  }

  public getAdvertById(id: number): Observable<Advert> {
    return this.httpClient.get<Advert>(`${this.backendEndpoint}/${id}`).pipe(map((advert: Advert) => {
      advert.advertisedBook!.bookAuthor = this.authorService.mapAuthor(advert.advertisedBook!.bookAuthor!);
      return advert;
    }));
  }
}
