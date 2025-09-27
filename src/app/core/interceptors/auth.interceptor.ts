import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token; // Usar el getter actualizado
    
    // No agregar token a endpoints públicos
    const isPublicEndpoint = req.url.includes('/api/public') || 
                            req.url.includes('/auth/login') || 
                            req.url.includes('/auth/register');
    
    if (token && !isPublicEndpoint) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // Si el token expiró, limpiar datos de autenticación
          if (error.status === 401) {
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
    }
    
    return next.handle(req);
  }
}
