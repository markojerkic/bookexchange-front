import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Advert, Page} from "../model";
import {Observable} from "rxjs";
import {AuthorService} from "./author.service";
import {map} from "rxjs/operators";
import {ImageUtil} from "../util";

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
    httpParams = httpParams.append('page', String(pageNumber)).append('size', '10')
      .append('sort', 'lastModified,DESC');

    return this.httpClient.get<Page<Advert>>(this.backendEndpoint, {params: httpParams}).pipe(map(this.mapAdvertImageUrl));
  }

  public getAdvertById(id: number): Observable<Advert> {
    return this.httpClient.get<Advert>(`${this.backendEndpoint}/${id}`).pipe(map((advert: Advert) => {
      advert.advertisedBook!.bookAuthor = this.authorService.mapAuthor(advert.advertisedBook!.bookAuthor!);
      return advert;
    }));
  }

  private mapAdvertImageUrl(advertPage: Page<Advert>): Page<Advert> {
    advertPage.content = advertPage.content.map((advert: Advert) => {
      advert.advertImages.map(ImageUtil.setImageUrl);
      return advert;
    });
    return advertPage;
  }

  public deleteAdvert(advertId: number): Observable<Object> {
    return this.httpClient.delete(`${this.backendEndpoint}/${advertId}`);
  }
}
