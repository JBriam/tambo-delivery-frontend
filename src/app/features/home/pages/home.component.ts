import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <!-- Hero Section -->
      <div class="container mx-auto px-4 py-16">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-800 mb-6">
            Bienvenido a Tambo Delivery
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tu plataforma favorita para pedidos en línea. 
            Descubre productos frescos y disfruta de entregas rápidas directamente en tu puerta.
          </p>
          <div class="space-x-4">
            <a 
              routerLink="/products" 
              class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-block"
            >
              Ver Productos
            </a>
            <a 
              routerLink="/auth/register" 
              class="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition duration-300 inline-block"
            >
              Registrarse
            </a>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-white py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué elegir Tambo Delivery?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Entrega Rápida</h3>
              <p class="text-gray-600">Recibe tus pedidos en tiempo récord con nuestro sistema de entrega optimizado.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Calidad Garantizada</h3>
              <p class="text-gray-600">Productos frescos y de la mejor calidad, seleccionados especialmente para ti.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Mejores Precios</h3>
              <p class="text-gray-600">Ofertas competitivas y descuentos especiales para nuestros clientes.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-blue-600 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            ¿Listo para hacer tu primer pedido?
          </h2>
          <p class="text-blue-100 mb-8 text-lg">
            Únete a miles de clientes satisfechos y descubre la comodidad de Tambo Delivery.
          </p>
          <a 
            routerLink="/auth/login" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 inline-block font-semibold"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent { }
