import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { Utils } from '../../../utils/common.utils';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Nuestros Productos</h1>
        <div class="flex items-center space-x-4">
          <select class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Todas las categorías</option>
            <option value="bebidas">Bebidas</option>
            <option value="lacteos">Lácteos</option>
            <option value="panaderia">Panadería</option>
            <option value="carnes">Carnes</option>
          </select>
        </div>
      </div>

      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (product of products; track product.id) {
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                <img 
                  [src]="product.imageUrl || ''" 
                  [alt]="product.name"
                  class="h-48 w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900 mb-2">
                  <a [routerLink]="['/products', product.id]" class="hover:text-indigo-600">
                    {{ product.name }}
                  </a>
                </h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                  {{ product.description }}
                </p>
                <div class="flex items-center justify-between">
                  <p class="text-xl font-bold text-indigo-600">
                    {{ formatCurrency(product.price) }}
                  </p>
                  @if (product.isAvailable && product.stock > 0) {
                    <app-button
                      [config]="{
                        text: 'Agregar',
                        type: 'primary',
                        size: 'sm'
                      }"
                      (buttonClick)="addToCart(product)"
                    />
                  } @else {
                    <span class="text-sm text-red-600 font-medium">Agotado</span>
                  }
                </div>
                @if (product.stock > 0 && product.stock <= 10) {
                  <p class="text-xs text-orange-600 mt-2">
                    ¡Solo quedan {{ product.stock }} unidades!
                  </p>
                }
              </div>
            </div>
          }
        </div>
      }

      @if (products.length === 0 && !isLoading) {
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2m-2 0H6m0 0H4m2 0v5a2 2 0 002 2h8a2 2 0 002-2v-5"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
          <p class="text-gray-600">Vuelve más tarde para ver nuestros productos.</p>
        </div>
      }
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  // Datos de ejemplo - en producción estos vendrían del servicio
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Leche Gloria Entera',
      description: 'Leche entera fresca, rica en calcio y proteínas',
      price: 4.50,
      imageUrl: '',
      category: { id: 1, name: 'Lácteos' },
      stock: 25,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Pan Integral',
      description: 'Pan integral casero, perfecto para el desayuno',
      price: 3.20,
      imageUrl: '',
      category: { id: 2, name: 'Panadería' },
      stock: 15,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: 'Coca Cola 500ml',
      description: 'Bebida gaseosa refrescante',
      price: 2.80,
      imageUrl: '',
      category: { id: 3, name: 'Bebidas' },
      stock: 0,
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Simular carga desde API
    setTimeout(() => {
      this.products = this.mockProducts;
      this.isLoading = false;
    }, 1000);
  }

  addToCart(product: Product): void {
    // TODO: Implementar lógica del carrito
    console.log('Agregando al carrito:', product);
    alert(`${product.name} agregado al carrito`);
  }

  formatCurrency(amount: number): string {
    return Utils.formatCurrency(amount);
  }
}
