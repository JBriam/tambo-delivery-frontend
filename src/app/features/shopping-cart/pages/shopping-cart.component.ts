import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button.component';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>
      
      <!-- Si el carrito está vacío -->
      @if (cartItems.length === 0) {
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
      } @else {
        <!-- Layout con productos y resumen -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Columna izquierda: Lista de productos -->
          <div class="lg:col-span-2 space-y-4">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Productos en tu carrito ({{ getTotalItems() }})
            </h2>
            
            @for (item of cartItems; track item.id) {
              <div class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start space-x-4">
                  
                  <!-- Imagen del producto -->
                  <div class="flex-shrink-0">
                    <img 
                      [src]="item.image" 
                      [alt]="item.name"
                      class="h-20 w-20 object-cover rounded-md border"
                      onerror="this.src='assets/images/placeholder-product.webp'"
                    />
                  </div>
                  
                  <!-- Información del producto -->
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-medium text-gray-900 mb-1">{{ item.name }}</h3>
                    @if (item.description) {
                      <p class="text-sm text-gray-600 mb-2">{{ item.description }}</p>
                    }
                    <p class="text-lg font-semibold text-[#a81b8d]">S/ {{ item.price.toFixed(2) }}</p>
                  </div>
                  
                  <!-- Controles de cantidad y eliminación -->
                  <div class="flex flex-col items-end space-y-2">
                    
                    <!-- Botón eliminar -->
                    <button 
                      (click)="removeItem(item.id)"
                      class="text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar producto"
                    >
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                    
                    <!-- Controles de cantidad -->
                    <div class="flex items-center space-x-2">
                      <button 
                        (click)="decreaseQuantity(item.id)"
                        [disabled]="item.quantity <= 1"
                        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      
                      <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                      
                      <button 
                        (click)="increaseQuantity(item.id)"
                        class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Subtotal del producto -->
                    <p class="text-lg font-semibold text-gray-900">
                      S/ {{ (item.price * item.quantity).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            }
            
            <!-- Botón continuar comprando -->
            <div class="pt-4 border-t">
              <button
                (click)="goToProducts()"
                class="text-[#a81b8d] hover:text-[#8a1676] font-medium flex items-center space-x-2"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <span>Continuar comprando</span>
              </button>
            </div>
          </div>
          
          <!-- Columna derecha: Resumen del pedido -->
          <div class="lg:col-span-1">
            <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
              
              <!-- Desglose de costos -->
              <div class="space-y-3 mb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal ({{ getTotalItems() }} productos)</span>
                  <span class="font-medium">S/ {{ getSubtotal().toFixed(2) }}</span>
                </div>
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Costo de envío</span>
                  <span class="font-medium">
                    @if (getSubtotal() >= deliveryFreeThreshold) {
                      <span class="text-green-600">Gratis</span>
                    } @else {
                      <span>S/ {{ deliveryCost.toFixed(2) }}</span>
                    }
                  </span>
                </div>
                
                @if (discount > 0) {
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Descuento</span>
                    <span class="font-medium text-green-600">-S/ {{ discount.toFixed(2) }}</span>
                  </div>
                }
                
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">IGV (18%)</span>
                  <span class="font-medium">S/ {{ getIGV().toFixed(2) }}</span>
                </div>
              </div>
              
              <!-- Total -->
              <div class="border-t pt-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900">Total a pagar</span>
                  <span class="text-2xl font-bold text-[#a81b8d]">S/ {{ getTotal().toFixed(2) }}</span>
                </div>
              </div>
              
              <!-- Información de envío gratis -->
              @if (getSubtotal() < deliveryFreeThreshold) {
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p class="text-xs text-blue-800">
                    <span class="font-medium">¡Envío gratis!</span> 
                    Agrega S/ {{ (deliveryFreeThreshold - getSubtotal()).toFixed(2) }} más para obtener envío gratuito
                  </p>
                </div>
              } @else {
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p class="text-xs text-green-800 font-medium">
                    ✅ ¡Felicidades! Tienes envío gratis
                  </p>
                </div>
              }
              
              <!-- Botón continuar compra -->
              <app-button
                [config]="{
                  text: 'Continuar con la compra',
                  type: 'primary',
                  size: 'lg'
                }"
                (buttonClick)="proceedToCheckout()"
                class="mb-3 w-full"
              />
              
              <!-- Métodos de pago aceptados -->
              <div class="text-center">
                <p class="text-xs text-gray-500 mb-2">Métodos de pago aceptados</p>
                <div class="flex justify-center space-x-2">
                  <img src="assets/icons/visa.webp" alt="Visa" class="h-6" onerror="this.style.display='none'">
                  <img src="assets/icons/mastercard.webp" alt="Mastercard" class="h-6" onerror="this.style.display='none'">
                  <img src="assets/icons/yape.webp" alt="Yape" class="h-6" onerror="this.style.display='none'">
                  <img src="assets/icons/plin.webp" alt="Plin" class="h-6" onerror="this.style.display='none'">
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ShoppingCartComponent {
  // Datos de ejemplo - en producción vendrían del servicio
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Coca Cola 3L',
      price: 8.50,
      quantity: 2,
      image: 'assets/products/coca-cola-500ml.webp',
      description: 'Bebida gaseosa sabor original'
    },
    {
      id: 2,
      name: 'Pan Integral Bimbo',
      price: 4.20,
      quantity: 1,
      image: 'assets/products/pan-integral.webp',
      description: 'Pan de molde integral, 500g'
    },
    {
      id: 3,
      name: 'Leche Evaporada Gloria',
      price: 3.80,
      quantity: 3,
      image: 'assets/products/leche-gloria-entera.webp',
      description: 'Leche evaporada entera, 400g'
    }
  ];

  deliveryCost = 5.00;
  deliveryFreeThreshold = 50.00;
  discount = 0; // Descuentos aplicados
  igvRate = 0.18; // 18% IGV

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    return this.getSubtotal() >= this.deliveryFreeThreshold ? 0 : this.deliveryCost;
  }

  getIGV(): number {
    const subtotalWithShipping = this.getSubtotal() + this.getShippingCost() - this.discount;
    return subtotalWithShipping * this.igvRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() - this.discount + this.getIGV();
  }

  increaseQuantity(itemId: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item) {
      item.quantity++;
    }
  }

  decreaseQuantity(itemId: number): void {
    const item = this.cartItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(itemId: number): void {
    const index = this.cartItems.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  goToProducts(): void {
    window.location.href = '/productos';
  }

  proceedToCheckout(): void {
    // Navegará a la página de dirección de entrega
    window.location.href = '/carrito/direccion';
  }
}
