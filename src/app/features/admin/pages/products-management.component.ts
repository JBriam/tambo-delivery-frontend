import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, CreateProductRequest, UpdateProductRequest } from '../../../features/products/services/product.service';
import { Product, Category } from '../../../models/product.model';
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

      <!-- Filtros -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Buscar productos..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
          <div>
            <select
              [(ngModel)]="selectedCategoryId"
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
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
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
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
        <!-- Tabla de Productos -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @if (filteredProducts.length === 0) {
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                      No hay productos disponibles o no coinciden con los filtros
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
                            <div class="text-sm text-gray-500">{{ product.brand?.name }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">{{ product.category?.name }}</td>
                      <td class="px-6 py-4">S/ {{ product.price.toFixed(2) }}</td>
                      <td class="px-6 py-4">{{ product.stock }} unidades</td>
                      <td class="px-6 py-4">
                        <span [class]="product.isActive ? 'text-green-600' : 'text-red-600'">
                          {{ product.isActive ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 space-x-2">
                        <button (click)="editProduct(product)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
                        <button (click)="deleteProduct(product)" class="text-red-600 hover:text-red-900">Eliminar</button>
                        <button (click)="toggleProductStatus(product)" class="text-gray-600 hover:text-gray-900">
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
  
  searchTerm = '';
  selectedCategoryId = '';
  selectedStatus = '';
  private subscriptions: Subscription[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getAllProductsAdmin().subscribe({
        next: (products) => {
          this.products = products || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando productos:', error);
          this.isLoading = false;
        }
      })
    );
  }

  private loadCategories(): void {
    this.subscriptions.push(
      this.productService.getAllCategories().subscribe({
        next: (categories) => (this.categories = categories || []),
        error: (error) => console.error('Error cargando categorías:', error)
      })
    );
  }

  applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.brand?.name.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategoryId) {
      filtered = filtered.filter((p) => p.category?.id === this.selectedCategoryId);
    }

    if (this.selectedStatus) {
      const isActive = this.selectedStatus === 'active';
      filtered = filtered.filter((p) => p.isActive === isActive);
    }

    this.filteredProducts = filtered;
  }

  // ✅ Crear producto
  openCreateProductModal(): void {
    const name = prompt('Nombre del producto:');
    const description = prompt('Descripción:');
    const price = Number(prompt('Precio:'));
    const stock = Number(prompt('Stock:'));
    const categoryId = prompt('ID de la categoría:');
    const brandId = prompt('ID de la marca:');

    if (name && categoryId && brandId) {
      const newProduct: CreateProductRequest = {
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        description: description || '',
        price,
        stock,
        brandId,
        categoryId,
        categoryTypeId: '',
        isNewArrival: false,
        isActive: true
      };

      this.productService.createProduct(newProduct).subscribe({
        next: (created) => {
          alert('✅ Producto creado correctamente');
          this.products.push(created);
          this.applyFilters();
        },
        error: (err) => alert('❌ Error al crear producto: ' + err.message)
      });
    }
  }

  // ✅ Editar producto
  editProduct(product: Product): void {
  const price = Number(prompt('Nuevo precio:', product.price.toString()));
  const stock = Number(prompt('Nuevo stock:', product.stock.toString()));

  if (!isNaN(price) && !isNaN(stock)) {
    const updated = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description || '',
      price,
      stock,
      brandId: product.brand.id,           // ✅ necesario
      categoryId: product.category.id,     // ✅ necesario
      categoryTypeId: product.categoryType?.id || product.category.id, // ✅ fallback por seguridad
      thumbnail: product.thumbnail,
      isNewArrival: product.isNewArrival,
      isActive: product.isActive
    };

    this.productService.updateProduct(product.id, updated).subscribe({
      next: (res) => {
        product.price = res.price;
        product.stock = res.stock;
        alert(`✅ Producto "${product.name}" actualizado correctamente.`);
      },
      error: (err) => {
        console.error('❌ Error actualizando producto:', err);
        alert('Error actualizando producto');
      }
    });
  }
}



  // ✅ Eliminar producto
  deleteProduct(product: Product): void {
    if (confirm(`¿Eliminar el producto "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          alert('🗑️ Producto eliminado');
          this.products = this.products.filter((p) => p.id !== product.id);
          this.applyFilters();
        },
        error: (err) => alert('❌ Error al eliminar: ' + err.message)
      });
    }
  }

  // ✅ Activar / Desactivar
  toggleProductStatus(product: Product): void {
    const action = product.isActive ? 'desactivar' : 'activar';
    if (confirm(`¿Deseas ${action} el producto "${product.name}"?`)) {
      const updated: UpdateProductRequest = {
        ...product,
        id: product.id,
        isActive: !product.isActive,
        brandId: product.brand?.id,
        categoryId: product.category?.id,
        categoryTypeId: product.categoryType?.id || ''
      };

      this.productService.updateProduct(product.id, updated).subscribe({
        next: () => {
          product.isActive = !product.isActive;
          alert(`✅ Producto ${product.isActive ? 'activado' : 'desactivado'}`);
        },
        error: (err) => alert('❌ Error al cambiar estado: ' + err.message)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
