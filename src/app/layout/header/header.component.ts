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
        <div
          class="grid grid-cols-1 sm:grid-cols-2 justify-items-center items-center h-20 sm:h-12"
        >
          <h1 class="text-md text-white">
            ¡Sobrin&#64; entregamos tu pedido en 30 minutos!
          </h1>
          <h1 class="text-md text-white border-b-1 border-dotted"> <!-- border-dashed si se quiere líneas discontinuas -->
            Trabaja con nosotros
          </h1>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-22">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <img
                  src="assets/logo/logo-tambo-1000.webp"
                  alt="Logo Tambo"
                  class="h-12 w-auto mr-3"
                />
              </div>
            </a>
          </div>

          <!-- Nav -->
          <nav class="hidden md:flex space-x-8">
            <a
              routerLink="/products"
              routerLinkActive="text-indigo-600"
              class="flex items-center gap-2 text-[#a81b8d] px-3 py-2 text-sm font-medium border-1 border-[#c23faa] hover:bg-[#c23faa] hover:text-white rounded-lg transition-colors"
            >
              <!-- Ícono de categorías (grid) -->
              <svg
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              Categorías
              <!-- Ícono de chevron-down -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </a>
            <a
              routerLink="/products"
              routerLinkActive="text-indigo-600"
              class="flex items-center gap-2 text-[#a81b8d] px-3 py-2 text-sm font-medium border-1 border-[#c23faa] hover:bg-[#c23faa] hover:text-white rounded-lg transition-colors"
            >
              <!-- Ícono de ubicación (location pin) -->
              <svg
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              ¿Dónde quieres pedir?
              <!-- Ícono de chevron-down -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
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
            <!-- Botón menú móvil -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#a81b8d]"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>

            @if (!isAuthenticated) {
            <a
              routerLink="/auth/login"
              class="text-gray-900 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium"
            >
              Iniciar Sesión
            </a>
            <a
              routerLink="/auth/register"
              class="bg-[#c23faa] text-white hover:bg-[#a81b8d] hover:text-white px-4 py-2 rounded-md text-sm font-medium"
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

        <!-- Menú móvil -->
        @if (isMobileMenuOpen) {
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            <a
              routerLink="/products"
              (click)="closeMobileMenu()"
              class="flex items-center gap-2 text-[#a81b8d] px-3 py-2 text-sm font-medium border-1 border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white rounded-lg transition-colors mb-2"
            >
              <!-- Ícono de categorías (grid) -->
              <svg
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              Categorías
            </a>
            <a
              routerLink="/products"
              (click)="closeMobileMenu()"
              class="flex items-center gap-2 text-[#a81b8d] px-3 py-2 text-sm font-medium border-1 border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white rounded-lg transition-colors mb-2"
            >
              <!-- Ícono de ubicación (location pin) -->
              <svg
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              ¿Dónde quieres pedir?
            </a>
            @if (isAuthenticated) {
            <a
              routerLink="/cart"
              (click)="closeMobileMenu()"
              class="text-gray-900 hover:text-indigo-600 block px-3 py-2 text-sm font-medium"
            >
              Carrito
            </a>
            <a
              routerLink="/orders"
              (click)="closeMobileMenu()"
              class="text-gray-900 hover:text-indigo-600 block px-3 py-2 text-sm font-medium"
            >
              Pedidos
            </a>
            <a
              routerLink="/profile"
              (click)="closeMobileMenu()"
              class="text-gray-900 hover:text-indigo-600 block px-3 py-2 text-sm font-medium"
            >
              Perfil
            </a>
            }
          </div>
        </div>
        }
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  currentUser: any = null;
  isAuthenticated = false;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/products';
  }
}
