import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Advert} from "../model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdvertService {
  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/advert`;
  }

  public saveAdvert(advert: Advert): Observable<Advert> {
    return this.httpClient.post<Advert>(this.backendEndpoint, advert);
  }
}
