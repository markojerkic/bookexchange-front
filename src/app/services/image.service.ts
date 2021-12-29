import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Image} from "../model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private readonly backendEndpoint: string;

  constructor(private httpClient: HttpClient) {
    this.backendEndpoint = `${environment.BACKEND_ENDPOINT}/image`;
  }

  public uploadImages(imagesEvent: any): Observable<Image[]> {
    const images: File[] = imagesEvent.files;
    const formData = new FormData();
    images.forEach((image: File) => {
      formData.append('images', image, image.name);
    });
    return this.httpClient.post<Image[]>(this.backendEndpoint, formData);
  }
}
