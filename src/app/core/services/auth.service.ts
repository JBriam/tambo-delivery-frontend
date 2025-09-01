import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { API_ENDPOINTS, APP_CONSTANTS } from '../../constants/app.constants';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    ).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      userData
    ).pipe(
      tap(response => this.setAuthData(response))
    );
  }

  logout(): void {
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.REFRESH_TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.USER_KEY);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, authResponse.token);
    localStorage.setItem(APP_CONSTANTS.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(APP_CONSTANTS.USER_KEY);
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }
}
