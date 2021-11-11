import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {User, LoggedInUser, LoginRequest} from "../model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInUser$: BehaviorSubject<LoggedInUser>;

  constructor(private http: HttpClient) {
    this.loggedInUser$ = new BehaviorSubject<LoggedInUser>(JSON.parse(<string>localStorage.getItem('user')));
  }

  public register(userData: User): Observable<User> {
    return this.http.post<User>(`${environment.BACKEND_ENDPOINT}/user`, userData);
  }

  public login(loginRequest: LoginRequest): Observable<LoggedInUser> {
    return this.http.put<LoggedInUser>(`${environment.BACKEND_ENDPOINT}/auth`, loginRequest)
      .pipe(tap(this.handleNewLogin));
  }

  public get curretLoggedInUser(): LoggedInUser {
    return JSON.parse(<string>localStorage.getItem('user'))
  }

  public refreshToken(): Observable<LoggedInUser> {
    return this.http.get<LoggedInUser>(`${environment.BACKEND_ENDPOINT}/auth/refresh/${this.curretLoggedInUser.refreshToken}`)
      .pipe(tap(this.handleNewLogin));
  }

  private handleNewLogin(user: LoggedInUser): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedInUser$.next(user);
  }

  public logout(): void {
    localStorage.removeItem('user');
  }
}
