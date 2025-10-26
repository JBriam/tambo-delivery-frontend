import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!this.authService.isAdmin) {
      this.router.navigate(['/products']);
      return false;
    }

    return true;
  }
}