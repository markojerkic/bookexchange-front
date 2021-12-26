import {HttpClient} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {map, tap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {LoggedInUser, LoginRequest, User} from "../model";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loggedInUser$!: Subject<LoggedInUser | undefined>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.loggedInUser$ = new BehaviorSubject<LoggedInUser | undefined>(JSON.parse(<string>localStorage.getItem('user')));
  }

  public register(userData: User): Observable<User> {
    return this.http.post<User>(`${environment.BACKEND_ENDPOINT}/user`, userData);
  }

  public login(loginRequest: LoginRequest): Observable<LoggedInUser> {
    return this.http.put<LoggedInUser>(`${environment.BACKEND_ENDPOINT}/auth`, loginRequest)
      .pipe(tap((user: LoggedInUser) => this.handleNewLogin(user)));
  }

  public get userToken(): LoggedInUser {
    return JSON.parse(<string>localStorage.getItem('user'));
  }

  public get userToken$(): Observable<LoggedInUser | undefined> {
    return this.loggedInUser$;
  }

  public get isUserAdmin$(): Observable<boolean> {
    return this.loggedInUser$.pipe(map((userToken: LoggedInUser | undefined) =>
      userToken? userToken.roles.includes('ROLE_ADMIN'): false));
  }

  public get isAuthenticated$(): Observable<boolean> {
    return this.loggedInUser$.pipe(map((loggedInUser?: LoggedInUser) => !!loggedInUser));
  }

  public get isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  public refreshToken(): Observable<LoggedInUser> {
    if (!this.isAuthenticated) {
      return throwError('Token je istekao');
    }
    return this.http.get<LoggedInUser>(`${environment.BACKEND_ENDPOINT}/auth/refresh/${this.userToken.refreshToken}`)
      .pipe(tap((user: LoggedInUser) => this.handleNewLogin(user)));
  }

  private handleNewLogin(user: LoggedInUser): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedInUser$.next(user);
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.loggedInUser$.next(undefined);
    this.router.navigate(['/auth/login']);
  }

  public getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.BACKEND_ENDPOINT}/auth`);
  }
}
