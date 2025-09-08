import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-white shadow-lg">
      <!-- Encabezado -->
      <div class="mx-auto px-4 sm:px-6 lg:px-8 bg-[#a81b8d]">
        <div class="grid grid-cols-1 sm:grid-cols-2 justify-items-center items-center h-20 sm:h-12">
          <h1 class="text-md text-white">
            ¡Sobrin&#64; entregamos tu pedido en 30 minutos!
          </h1>
          <h1 class="text-md text-white underline decoration-dotted">
            Trabaja con nosotros
          </h1>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <img
                  src="assets/logo/logo-tambo-800.webp"
                  alt="Logo Tambo"
                  class="h-10 w-auto mr-3"
                />
              </div>
            </a>
          </div>

          <!-- Nav -->
          <nav class="hidden md:flex space-x-8">
            <a
              routerLink="/products"
              routerLinkActive="text-indigo-600"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Productos
            </a>
            @if (isAuthenticated) {
            <a
              routerLink="/cart"
              routerLinkActive="text-indigo-600"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Carrito
            </a>
            <a
              routerLink="/orders"
              routerLinkActive="text-indigo-600"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Pedidos
            </a>
            <a
              routerLink="/profile"
              routerLinkActive="text-indigo-600"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Perfil
            </a>
            }
          </nav>

          <!-- Menú usuario -->
          <div class="flex items-center space-x-4">
            @if (!isAuthenticated) {
            <a
              routerLink="/auth/login"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Iniciar Sesión
            </a>
            <a
              routerLink="/auth/register"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Registrarse
            </a>
            } @else {
            <span class="text-gray-700 text-sm">
              Hola, {{ currentUser?.firstName }}
            </span>
            <button
              (click)="logout()"
              class="text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
            >
              Cerrar Sesión
            </button>
            }
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  currentUser: any = null;
  isAuthenticated = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/products';
  }
}
