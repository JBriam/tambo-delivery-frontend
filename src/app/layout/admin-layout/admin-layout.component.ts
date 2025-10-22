import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg">
        <!-- Logo/Brand -->
        <div class="flex items-center justify-center h-16 bg-[#a81b8d] text-white">
          <h1 class="text-xl font-bold">Tambo Admin</h1>
        </div>
        
        <!-- User Info -->
        @if (currentUser) {
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-[#a81b8d] rounded-full flex items-center justify-center text-white font-semibold">
              {{ getUserInitials() }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
              <p class="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
        }
        
        <!-- Navigation Menu -->
        <nav class="mt-4">
          <ul class="space-y-1 px-3">
            <li>
              <a 
                (click)="navigateTo('/admin/dashboard')"
                [class]="getNavItemClass('/admin/dashboard')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
                </svg>
                Dashboard
              </a>
            </li>
            
            <li>
              <a 
                (click)="navigateTo('/admin/users')"
                [class]="getNavItemClass('/admin/users')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197V9a3 3 0 00-6 0v4.5M21 15a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Usuarios
              </a>
            </li>

            <li>
              <a 
                (click)="navigateTo('/admin/brands')"
                [class]="getNavItemClass('/admin/brands')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                Marcas
              </a>
            </li>
            
            <li>
              <a 
                (click)="navigateTo('/admin/products')"
                [class]="getNavItemClass('/admin/products')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                Productos
              </a>
            </li>
            
            <li>
              <a 
                (click)="navigateTo('/admin/orders')"
                [class]="getNavItemClass('/admin/orders')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Pedidos
              </a>
            </li>
            
            <li>
              <a 
                (click)="navigateTo('/perfil')"
                [class]="getNavItemClass('/perfil')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Perfil
              </a>
            </li>
          </ul>
          
          <!-- Logout Button -->
          <div class="absolute bottom-4 left-3 right-3">
            <button 
              (click)="logout()"
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
      
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Bar (opcional) -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="flex items-center justify-between px-6 py-3">
            <h2 class="text-lg font-semibold text-gray-900">{{ getCurrentPageTitle() }}</h2>
            <div class="flex items-center space-x-4">
              <!-- Notificaciones o controles adicionales -->
              <button class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AdminLayoutComponent implements OnInit {
  currentUser: User | null = null;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Obtener ruta inicial
    this.currentRoute = this.router.url;
    
    // Suscribirse a cambios de ruta
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'A';
    
    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';
    
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'A';
  }

  /**
   * Obtiene las clases CSS para los elementos de navegación
   */
  getNavItemClass(route: string): string {
    const isActive = this.currentRoute === route || this.currentRoute.startsWith(route + '/');
    
    return isActive 
      ? 'bg-[#a81b8d] text-white' 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
  }

  /**
   * Navega a una ruta específica
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Obtiene el título de la página actual
   */
  getCurrentPageTitle(): string {
    const routeMap: { [key: string]: string } = {
      '/admin': 'Dashboard',
      '/admin/dashboard': 'Dashboard',
      '/admin/users': 'Gestión de Usuarios',
      '/admin/brands': 'Gestión de Marcas',
      '/admin/products': 'Gestión de Productos',
      '/admin/orders': 'Gestión de Pedidos',
      '/perfil': 'Mi Perfil'
    };

    return routeMap[this.currentRoute] || 'Panel de Administración';
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}