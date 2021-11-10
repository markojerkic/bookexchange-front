import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../model/user.model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public register(userData: User): Observable<User> {
    return this.http.put<User>(`${environment.BACKEND_ENDPOINT}/users`, userData);
  }
}
