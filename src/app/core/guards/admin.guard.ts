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
    console.log('🔐 AdminGuard: Checking admin access');
    console.log('🔐 AdminGuard: Current user:', this.authService.currentUser);
    console.log('🔐 AdminGuard: Is authenticated:', this.authService.isAuthenticated);
    console.log('🔐 AdminGuard: Is admin:', this.authService.isAdmin);
    
    if (!this.authService.isAuthenticated) {
      console.log('🔐 AdminGuard: User not authenticated, redirecting to login');
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (!this.authService.isAdmin) {
      console.log('🔐 AdminGuard: User is not admin, redirecting to home');
      this.router.navigate(['/productos']);
      return false;
    }

    console.log('🔐 AdminGuard: Admin access granted');
    return true;
  }
}