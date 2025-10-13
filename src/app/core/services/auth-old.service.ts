import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { API_ENDPOINTS, APP_CONSTANTS } from '../../constants/app.constants';

// DTOs basados en el backend Spring Boot
export interface LoginRequest {
  userName: string; // El backend usa userName en lugar de email
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface UserResponseDto {
  code: number;
  message: string;
  user?: User;
}

export interface VerifyRequest {
  userName: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
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

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    ).pipe(
      tap(response => {
        if (response.code === 200 && response.token) {
          this.setAuthToken(response.token);
          // Después de login exitoso, obtener datos del usuario
          this.loadCurrentUser().subscribe();
        }
      }),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterRequest): Observable<UserResponseDto> {
    return this.http.post<UserResponseDto>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      userData
    ).pipe(
      tap(response => {
        if (response.code === 200 && response.user) {
          // El registro puede requerir verificación
        }
      }),
      catchError(this.handleError)
    );
  }

  verifyAccount(verifyData: VerifyRequest): Observable<any> {
    return this.http.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.VERIFY}`,
      verifyData
    ).pipe(
      catchError(this.handleError)
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      { email }
    ).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    return this.http.post(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      resetData
    ).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearAuthData();
  }

  // Obtener el usuario actual desde el backend
  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.USERS.PROFILE}`
    ).pipe(
      tap(user => {
        this.setCurrentUser(user);
      }),
      catchError(this.handleError)
    );
  }

  // Métodos auxiliares
  private setAuthToken(token: string): void {
    localStorage.setItem(APP_CONSTANTS.TOKEN_KEY, token);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
    localStorage.removeItem(APP_CONSTANTS.USER_KEY);
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
    const userStr = localStorage.getItem(APP_CONSTANTS.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  // Getters públicos
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.token && !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.authorities?.some(auth => auth.authority === 'ADMIN') || false;
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Auth Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
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
