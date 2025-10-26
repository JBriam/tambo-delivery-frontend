import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { Utils } from '../../../utils/common.utils';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#a81b8d]/20">
      <!-- Badge de stock bajo -->
      @if (product.stock > 0 && product.stock <= 10) {
        <div class="absolute top-3 left-3 z-10">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            ¡Solo {{ product.stock }}!
          </span>
        </div>
      }
      
      <!-- Badge de agotado -->
      @if (!product.isActive || product.stock === 0) {
        <div class="absolute top-3 left-3 z-10">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Agotado
          </span>
        </div>
        <div class="absolute inset-0 bg-gray-900/20 z-5"></div>
      }

      <!-- Imagen del producto -->
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <a [routerLink]="['/products', product.id]" class="block">
          <img 
            [src]="product.thumbnail" 
            [alt]="product.name"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </a>
        
        <!-- Overlay con botón de vista rápida -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="absolute bottom-4 left-4 right-4">
            <button
              (click)="onQuickView()"
              class="w-full bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-white transition-colors"
            >
              Vista Rápida
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido de la tarjeta -->
      <div class="p-4 space-y-3">
        <!-- Categoría -->
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#a81b8d]/10 text-[#a81b8d]">
            {{ product.category.name }}
          </span>
          @if (product.isActive && product.stock > 0) {
            <div class="flex items-center text-xs text-green-600">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Disponible
            </div>
          }
        </div>

        <!-- Título del producto -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-[#a81b8d] transition-colors">
            <a [routerLink]="['/products', product.id]">
              {{ product.name }}
            </a>
          </h3>
        </div>

        <!-- Descripción -->
        <p class="text-sm text-gray-600 line-clamp-2">
          {{ product.description }}
        </p>

        <!-- Precio y rating -->
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-[#a81b8d]">
                {{ formatCurrency(product.price) }}
              </span>
            </div>
          </div>
          
          <!-- Rating placeholder -->
          <div class="flex items-center space-x-1">
            @for (star of [1,2,3,4,5]; track star) {
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            }
            <span class="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center gap-2 pt-2">
          @if (product.isActive && product.stock > 0) {
            <app-button
              [config]="{
                text: 'Agregar',
                type: 'primary',
                size: 'sm'
              }"
              (buttonClick)="onAddToCart()"
              class="flex-1"
            />
            <button
              (click)="onAddToWishlist()"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Agregar a favoritos"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          } @else {
            <div class="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
              @if (!product.isActive) {
                No Disponible
              } @else {
                Agotado
              }
            </div>
          }
        </div>

        <!-- Stock indicator bar -->
        @if (product.isActive && product.stock > 0 && product.stock <= 20) {
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-gray-500">Stock:</span>
              <span class="font-medium text-gray-700">{{ product.stock }} unidades</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                class="h-1.5 rounded-full transition-all duration-300"
                [class]="getStockBarClass()"
                [style.width.%]="getStockPercentage()"
              ></div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() quickView = new EventEmitter<Product>();

  formatCurrency(price: number): string {
    return Utils.formatCurrency(price);
  }

  onAddToCart(): void {
    console.log('🛒 ProductCard: Emitting addToCart event for product:', this.product);
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }

  onQuickView(): void {
    this.quickView.emit(this.product);
  }

  getStockBarClass(): string {
    const percentage = this.getStockPercentage();
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-orange-500';
    return 'bg-green-500';
  }

  getStockPercentage(): number {
    // Asumimos un stock máximo de 100 para el cálculo del porcentaje
    const maxStock = 100;
    return Math.min((this.product.stock / maxStock) * 100, 100);
  }
}