import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ProductService,
  UpdateProductRequest,
} from '../../../features/products/services/product.service';
import { 
  Product, 
  CreateProductCompleteDto, 
  ProductPhase1Data, 
  ProductResource 
} from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { Brand } from '../../../models/brand.model';
import { Discount } from '../../../models/discount.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { ProductCreatePhase1ModalComponent } from '../components/product-create-phase1-modal.component';
import { ProductCreatePhase2ModalComponent } from '../components/product-create-phase2-modal.component';
import { ProductCreatePhase3ModalComponent } from '../components/product-create-phase3-modal.component';
import { ProductCreateSummaryModalComponent } from '../../products/components/product-create-summary-modal/product-create-summary-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    ProductCreatePhase1ModalComponent,
    ProductCreatePhase2ModalComponent,
    ProductCreatePhase3ModalComponent,
    ProductCreateSummaryModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
          <p class="text-gray-600">
            Administra el catálogo de productos de Tambo Delivery
          </p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Crear Producto',
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
              class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
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
              class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
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
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"
        ></div>
      </div>
      } @else {
      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Producto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Categoría
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Precio
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @if (filteredProducts.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  @if (searchTerm || selectedCategoryId || selectedStatus) { No
                  se encontraron productos que coincidan con los filtros } @else
                  { No hay productos disponibles }
                </td>
              </tr>
              } @else { @for (product of filteredProducts; track product.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      [src]="
                        product.thumbnail || '/assets/images/product-default.png'
                      "
                      [alt]="product.name"
                      class="h-12 w-12 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ product.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ product.brand.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                  >
                    {{ product.category.name }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  S/ {{ product.price.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [class]="
                      product.stock <= 10
                        ? 'bg-red-100 text-red-800'
                        : product.stock <= 50
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    "
                  >
                    {{ product.stock }} unidades
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [class]="
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ product.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                >
                  <button
                    (click)="openEditProductModal(product)"
                    type="button"
                    class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="Editar tipo"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    (click)="confirmDeleteProduct(product)"
                    type="button"
                    class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Eliminar tipo"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>
      </div>
      }
    </div>

    <!-- Modales para crear/editar producto en 3 fases -->
    <app-product-create-phase1-modal
      [isOpen]="isPhase1ModalOpen"
      [mode]="modalMode"
      [initialData]="getPhase1Data()"
      (closeModal)="closePhase1Modal()"
      (phase1Completed)="onPhase1Completed($event)"
    />

    <app-product-create-phase2-modal
      [isOpen]="isPhase2ModalOpen"
      [mode]="modalMode"
      [initialResources]="getPhase2Resources()"
      (closeModal)="closePhase2Modal()"
      (phase2Completed)="onPhase2Completed($event)"
      (skipPhase)="onPhase2Skipped()"
    />

    <app-product-create-phase3-modal
      [isOpen]="isPhase3ModalOpen"
      [mode]="modalMode"
      [initialDiscountIds]="getPhase3DiscountIds()"
      (closeModal)="closePhase3Modal()"
      (phase3Completed)="onPhase3Completed($event)"
      (skipPhase)="onPhase3Skipped()"
    />

    <app-product-create-summary-modal
      *ngIf="isSummaryModalOpen && isProductDraftComplete()"
      [isOpen]="isSummaryModalOpen"
      [productData]="getCompleteProductDraft()"
      [brands]="brands"
      [categories]="categories"
      [discounts]="discounts"
      [isSubmitting]="isSubmitting"
      [mode]="modalMode"
      (closeModal)="closeSummaryModal()"
      (confirmCreation)="modalMode === 'create' ? onConfirmCreation() : onConfirmUpdate()"
      (backToEdit)="onBackToEdit($event)"
    />

    <!-- Modal de Confirmación para Eliminación -->
    <app-confirm-modal
      [isOpen]="isConfirmDeleteModalOpen"
      [title]="'Eliminar Producto'"
      [message]="'¿Estás seguro de que deseas eliminar el producto &quot;' + (productToDelete?.name || '') + '&quot;? Esta acción no se puede deshacer.'"
      [confirmText]="'Eliminar'"
      [cancelText]="'Cancelar'"
      (confirm)="onConfirmDelete()"
      (cancel)="closeConfirmDeleteModal()"
    />

    <!-- Toast Component -->
    <app-toast />
  `,
})
export class ProductsManagementComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];
  discounts: Discount[] = [];
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedCategoryId = '';
  selectedStatus = '';

  // Modal states for 3-phase product creation/edit
  isPhase1ModalOpen = false;
  isPhase2ModalOpen = false;
  isPhase3ModalOpen = false;
  isSummaryModalOpen = false;
  
  // Modo de operación: 'create' o 'edit'
  modalMode: 'create' | 'edit' = 'create';
  
  // Modal states for product delete
  isConfirmDeleteModalOpen = false;
  selectedProduct: Product | null = null;
  productToDelete: Product | null = null;
  
  // Datos acumulados del producto (se van llenando en cada fase)
  productDraft: Partial<CreateProductCompleteDto> = {};
  
  isSubmitting = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadBrands();
    this.loadDiscounts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
        },
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
        },
      })
    );
  }

  /**
   * Carga todas las marcas
   */
  private loadBrands(): void {
    this.subscriptions.push(
      this.productService.getAllBrands().subscribe({
        next: (brands) => {
          this.brands = brands || [];
        },
        error: (error) => {
          console.error('Error loading brands:', error);
        },
      })
    );
  }

  /**
   * Carga todos los descuentos
   */
  private loadDiscounts(): void {
    this.subscriptions.push(
      this.productService.getAllDiscounts().subscribe({
        next: (discounts) => {
          this.discounts = discounts || [];
        },
        error: (error) => {
          console.error('Error loading discounts:', error);
        },
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
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.brand.name.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (this.selectedCategoryId) {
      filtered = filtered.filter(
        (product) => product.category.id === this.selectedCategoryId
      );
    }

    // Filtro por estado
    if (this.selectedStatus) {
      const isActive = this.selectedStatus === 'active';
      filtered = filtered.filter((product) => product.isActive === isActive);
    }

    this.filteredProducts = filtered;
  }

  // ==================== MODAL METHODS - 3 PHASE CREATION ====================

  /**
   * Abre el modal de creación - Fase 1
   */
  openCreateProductModal(): void {
    this.productDraft = {}; // Reiniciar el borrador
    this.isPhase1ModalOpen = true;
  }

  /**
   * Cierra el modal de Fase 1
   */
  closePhase1Modal(): void {
    this.isPhase1ModalOpen = false;
  }

  /**
   * Cuando se completa la Fase 1, guarda datos y abre la Fase 2
   */
  onPhase1Completed(data: ProductPhase1Data): void {
    // ✅ MERGE: Conservar resources y discountIds si ya existen (modo edición)
    this.productDraft = { 
      ...this.productDraft, // Mantener datos existentes (resources, discountIds)
      ...data               // Sobrescribir con nuevos datos de Phase 1
    };
    
    // console.log('✅ [ProductsManagement] Phase 1 completada. productDraft:', {
    //   name: this.productDraft.name,
    //   hasResources: !!this.productDraft.resources,
    //   resourcesCount: this.productDraft.resources?.length || 0,
    //   hasDiscounts: !!this.productDraft.discountIds,
    //   discountsCount: this.productDraft.discountIds?.length || 0
    // });
    
    this.isPhase1ModalOpen = false;
    this.isPhase2ModalOpen = true;
  }

  /**
   * Cierra el modal de Fase 2
   */
  closePhase2Modal(): void {
    this.isPhase2ModalOpen = false;
  }

  /**
   * Cuando se completa la Fase 2, guarda recursos y abre la Fase 3
   */
  onPhase2Completed(resources: ProductResource[]): void {
    // Acumular recursos en productDraft
    this.productDraft.resources = resources;
    
    // console.log('✅ [ProductsManagement] Phase 2 completada. Resources:', {
    //   count: resources.length,
    //   resources: resources
    // });
    
    this.isPhase2ModalOpen = false;
    this.isPhase3ModalOpen = true;
  }

  /**
   * Cuando se omite la Fase 2
   */
  onPhase2Skipped(): void {
    this.productDraft.resources = [];
    this.isPhase2ModalOpen = false;
    this.isPhase3ModalOpen = true;
  }

  /**
   * Cierra el modal de Fase 3
   */
  closePhase3Modal(): void {
    this.isPhase3ModalOpen = false;
  }

  /**
   * Cuando se completa la Fase 3, guarda descuentos y abre resumen
   */
  onPhase3Completed(discountIds: string[]): void {
    // Acumular descuentos en productDraft
    this.productDraft.discountIds = discountIds;
    
    // console.log('✅ [ProductsManagement] Phase 3 completada. Descuentos:', {
    //   count: discountIds.length,
    //   discountIds: discountIds
    // });
    
    this.isPhase3ModalOpen = false;
    this.isSummaryModalOpen = true;
  }

  /**
   * Cuando se omite la Fase 3
   */
  onPhase3Skipped(): void {
    this.productDraft.discountIds = [];
    this.isPhase3ModalOpen = false;
    this.isSummaryModalOpen = true;
  }

  /**
   * Cierra el modal de resumen
   */
  closeSummaryModal(): void {
    this.isSummaryModalOpen = false;
    this.productDraft = {}; // Limpiar borrador
  }

  /**
   * Cuando el usuario confirma crear el producto desde el resumen
   */
  onConfirmCreation(): void {
    this.isSubmitting = true;
    const productData = this.productDraft as CreateProductCompleteDto;
    
    // Enviar datos completos en una sola petición
    this.productService.createProductComplete(productData).subscribe({
      next: (createdProduct) => {
        this.isSubmitting = false;
        this.isSummaryModalOpen = false;
        this.productDraft = {};
        this.toastService.success(
          `Producto "${productData.name}" creado exitosamente`
        );
        this.loadProducts(); // Recargar la lista
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creando producto:', err);
        this.toastService.error(
          'Error al crear el producto. Por favor, intenta nuevamente.'
        );
      },
    });
  }

  /**
   * Cuando el usuario quiere volver a editar desde el resumen
   */
  onBackToEdit(phase: 'phase1' | 'phase2' | 'phase3'): void {
    this.isSummaryModalOpen = false;
    
    // Abrir la fase indicada
    switch (phase) {
      case 'phase1':
        this.isPhase1ModalOpen = true;
        break;
      case 'phase2':
        this.isPhase2ModalOpen = true;
        break;
      case 'phase3':
        this.isPhase3ModalOpen = true;
        break;
    }
  }

  /**
   * Verifica si el borrador del producto está completo
   */
  isProductDraftComplete(): boolean {
    return !!(
      this.productDraft.slug &&
      this.productDraft.name &&
      this.productDraft.description &&
      this.productDraft.price !== undefined &&
      this.productDraft.stock !== undefined &&
      this.productDraft.brandId &&
      this.productDraft.categoryId
    );
  }

  /**
   * Obtiene el borrador completo del producto
   */
  getCompleteProductDraft(): CreateProductCompleteDto {
    return this.productDraft as CreateProductCompleteDto;
  }

  /**
   * Obtiene los datos de Fase 1 del productDraft
   */
  getPhase1Data(): ProductPhase1Data | undefined {
    if (!this.productDraft.name) return undefined;
    
    return {
      slug: this.productDraft.slug || '',
      name: this.productDraft.name || '',
      description: this.productDraft.description || '',
      price: this.productDraft.price || 0,
      stock: this.productDraft.stock || 0,
      brandId: this.productDraft.brandId || '',
      categoryId: this.productDraft.categoryId || '',
      categoryTypeId: this.productDraft.categoryTypeId,
      isNewArrival: this.productDraft.isNewArrival || false,
      isActive: this.productDraft.isActive ?? true
    };
  }

  /**
   * Obtiene los recursos (imágenes) de Fase 2 del productDraft
   */
  getPhase2Resources(): ProductResource[] | undefined {
    // Solo retornar si realmente hay datos, evitar undefined loops
    const resources = this.productDraft.resources;
    if (resources && resources.length > 0) {
      // console.log('🔍 [ProductsManagement] getPhase2Resources retorna:', resources);
    }
    return resources;
  }

  /**
   * Obtiene los IDs de descuentos de Fase 3 del productDraft
   */
  getPhase3DiscountIds(): string[] | undefined {
    // Solo retornar si realmente hay datos, evitar undefined loops
    const discountIds = this.productDraft.discountIds;
    if (discountIds && discountIds.length > 0) {
      // console.log('🔍 [ProductsManagement] getPhase3DiscountIds retorna:', discountIds);
    }
    return discountIds;
  }

  // ==================== EDIT PRODUCT METHODS ====================

  /**
   * Abre el flujo de edición de producto en 3 fases
   */
  openEditProductModal(product: Product): void {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    
    // Convertir Product a CreateProductCompleteDto para reutilizar los modales de fase
    this.productDraft = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      brandId: product.brand.id,
      categoryId: product.category.id,
      categoryTypeId: product.categoryType?.id,
      isNewArrival: product.isNewArrival || false,
      isActive: product.isActive,
      resources: product.resources ? product.resources.map(r => ({
        id: r.id,
        name: r.name,
        url: r.url,
        isPrimary: r.isPrimary,
        type: r.type
      })) : [],
      discountIds: product.discounts?.map(d => d.id) || []
    };
    
    // console.log('📝 [ProductsManagement] Datos cargados para edición:', {
    //   productName: product.name,
    //   resources: this.productDraft.resources,
    //   discounts: this.productDraft.discountIds
    // });
    
    // Abrir el primer modal con los datos pre-cargados
    this.isPhase1ModalOpen = true;
  }

  /**
   * Cierra el flujo de creación/edición y resetea el estado
   */
  closeProductFlow(): void {
    this.modalMode = 'create';
    this.selectedProduct = null;
    this.productDraft = {};
    this.isPhase1ModalOpen = false;
    this.isPhase2ModalOpen = false;
    this.isPhase3ModalOpen = false;
    this.isSummaryModalOpen = false;
  }

  /**
   * Confirma la actualización del producto (llamado desde el modal de resumen)
   */
  onConfirmUpdate(): void {
    if (!this.selectedProduct || !this.isProductDraftComplete()) {
      console.error('❌ Producto seleccionado o datos incompletos');
      return;
    }

    this.isSubmitting = true;
    const completeProductData = this.getCompleteProductDraft();

    // Convertir CreateProductCompleteDto a UpdateProductRequest
    // Ahora incluimos resources y discountIds (backend actualizado para soportarlos)
    const updateRequest: any = {
      id: this.selectedProduct.id,
      slug: completeProductData.slug,
      name: completeProductData.name,
      description: completeProductData.description,
      price: completeProductData.price,
      stock: completeProductData.stock,
      brandId: completeProductData.brandId,
      categoryId: completeProductData.categoryId,
      categoryTypeId: completeProductData.categoryTypeId || '',
      isNewArrival: completeProductData.isNewArrival,
      isActive: completeProductData.isActive,
      resources: completeProductData.resources || [],
      discountIds: completeProductData.discountIds || []
    };

    // console.log('📤 [ProductsManagement] Enviando actualización:', {
    //   productId: this.selectedProduct.id,
    //   name: updateRequest.name,
    //   resourcesCount: updateRequest.resources?.length || 0,
    //   discountsCount: updateRequest.discountIds?.length || 0,
    //   updateRequest
    // });

    this.subscriptions.push(
      this.productService.updateProduct(this.selectedProduct.id, updateRequest).subscribe({
        next: (updatedProduct) => {
          this.isSubmitting = false;
          this.closeSummaryModal();
          this.closeProductFlow();
          // console.log('✅ [ProductsManagement] Producto actualizado:', updatedProduct);
          this.toastService.success(
            `Producto "${completeProductData.name}" actualizado exitosamente`
          );
          this.loadProducts();
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('❌ Error al actualizar producto:', error);
          this.toastService.error(
            'Error al actualizar el producto. Por favor, intenta nuevamente.'
          );
        },
      })
    );
  }

  // ==================== DELETE PRODUCT METHODS ====================

  /**
   * Abre el modal de confirmación para eliminar producto
   */
  confirmDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.isConfirmDeleteModalOpen = true;
  }

  /**
   * Cierra el modal de confirmación de eliminación
   */
  closeConfirmDeleteModal(): void {
    this.productToDelete = null;
    this.isConfirmDeleteModalOpen = false;
  }

  /**
   * Elimina el producto confirmado
   */
  onConfirmDelete(): void {
    if (!this.productToDelete) return;

    const productName = this.productToDelete.name;
    const productId = this.productToDelete.id;

    this.subscriptions.push(
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.closeConfirmDeleteModal();
          this.toastService.success(
            `Producto "${productName}" eliminado exitosamente`
          );
          this.loadProducts();
        },
        error: (error) => {
          console.error('❌ Error al eliminar producto:', error);
          this.toastService.error(
            'Error al eliminar el producto. Por favor, intenta nuevamente.'
          );
          this.closeConfirmDeleteModal();
        },
      })
    );
  }
}
