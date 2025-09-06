import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
      
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
        <p class="text-gray-600 mb-6">Agrega algunos productos para comenzar tu pedido.</p>
        <app-button
          [config]="{
            text: 'Ver Productos',
            type: 'primary',
            size: 'md'
          }"
          (buttonClick)="goToProducts()"
        />
      </div>
    </div>
  `
})
export class ShoppingCartComponent {
  goToProducts(): void {
    // TODO: Navegar a productos
    window.location.href = '/products';
  }
}
