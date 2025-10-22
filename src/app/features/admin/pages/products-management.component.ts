import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../features/products/services/product.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
          <p class="text-gray-600">Administra el catálogo de productos de Tambo Delivery</p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Añadir Producto',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateProductModal()"
          />
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Buscar productos..."
              class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
          <div>
            <select
              [(ngModel)]="selectedCategoryId"
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            >
              <option value="">Todas las categorías</option>
              @for (category of categories; track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>
          <div>
            <select
              [(ngModel)]="selectedStatus"
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else {
        <!-- Products Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @if (filteredProducts.length === 0) {
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                      @if (searchTerm || selectedCategoryId || selectedStatus) {
                        No se encontraron productos que coincidan con los filtros
                      } @else {
                        No hay productos disponibles
                      }
                    </td>
                  </tr>
                } @else {
                  @for (product of filteredProducts; track product.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <img 
                            [src]="product.thumbnail || '/assets/products/placeholder.webp'" 
                            [alt]="product.name"
                            class="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                            <div class="text-sm text-gray-500">{{ product.brand.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {{ product.category.name }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        S/ {{ product.price.toFixed(2) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          [class]="product.stock <= 10 ? 'bg-red-100 text-red-800' : product.stock <= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'"
                        >
                          {{ product.stock }} unidades
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          [class]="product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        >
                          {{ product.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          (click)="editProduct(product)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          (click)="toggleProductStatus(product)"
                          [class]="product.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        >
                          {{ product.isActive ? 'Desactivar' : 'Activar' }}
                        </button>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductsManagementComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  
  // Filters
  searchTerm = '';
  selectedCategoryId = '';
  selectedStatus = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Carga todos los productos
   */
  private loadProducts(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getProducts().subscribe({
        next: (products) => {
          this.products = products || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Carga todas las categorías
   */
  private loadCategories(): void {
    this.subscriptions.push(
      this.productService.getAllCategories().subscribe({
        next: (categories) => {
          this.categories = categories || [];
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      })
    );
  }

  /**
   * Aplica los filtros a la lista de productos
   */
  applyFilters(): void {
    let filtered = [...this.products];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.brand.name.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (this.selectedCategoryId) {
      filtered = filtered.filter(product => product.category.id === this.selectedCategoryId);
    }

    // Filtro por estado
    if (this.selectedStatus) {
      const isActive = this.selectedStatus === 'active';
      filtered = filtered.filter(product => product.isActive === isActive);
    }

    this.filteredProducts = filtered;
  }

  /**
   * Abre el modal para crear un nuevo producto
   */
  openCreateProductModal(): void {
    // TODO: Implementar modal de creación de producto
    alert('Funcionalidad de crear producto en desarrollo');
  }

  /**
   * Edita un producto existente
   */
  editProduct(product: Product): void {
    // TODO: Implementar modal de edición de producto
    alert(`Editar producto: ${product.name}`);
  }

  /**
   * Cambia el estado activo/inactivo de un producto
   */
  toggleProductStatus(product: Product): void {
    const action = product.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que quieres ${action} el producto "${product.name}"?`)) {
      // TODO: Implementar llamada al backend para actualizar estado
      product.isActive = !product.isActive;
      console.log(`Producto ${product.name} ${product.isActive ? 'activado' : 'desactivado'}`);
    }
  }

  /**
   * Vuelve al dashboard
   */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}