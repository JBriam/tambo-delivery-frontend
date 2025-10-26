import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { Brand } from '../../../models/brand.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { BrandModalComponent } from '../components/brand-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-brands-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    BrandModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Marcas</h1>
          <p class="text-gray-600">
            Administra el catálogo de marcas de Tambo Delivery
          </p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Crear Marca',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateBrandModal()"
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
              placeholder="Buscar marca..."
              class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
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
      <!-- Brands Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @if (filteredBrands.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  @if (searchTerm) { No se encontraron marcas que coincidan con
                  los filtros } @else { No hay marcas disponibles }
                </td>
              </tr>
              } @else { @for (brand of filteredBrands; track brand.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      [src]="
                        brand.imageUrl || '/assets/brands/brand-default.png'
                      "
                      [alt]="brand.name"
                      class="h-12 w-12 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ brand.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ brand.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                >
                  <button
                    (click)="editBrand(brand)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    (click)="onDeleteBrand(brand.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Eliminar
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

    <!-- Brand Modal -->
    <app-brand-modal
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [brand]="selectedBrand"
      (closeModal)="closeModal()"
      (saveBrand)="onSaveBrand($event)"
    />

    <!-- Delete Confirmation Modal -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen"
      type="danger"
      [title]="getDeleteTitle()"
      [message]="getDeleteMessage()"
      confirmText="Sí, eliminar"
      cancelText="Cancelar"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()"
    />

    <!-- Toast Notifications -->
    <app-toast />
  `,
})
export class BrandsManagementComponent implements OnInit, OnDestroy {
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedStatus = '';

  // Modal
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedBrand: Brand | null = null;

  // Delete Modal
  isDeleteModalOpen = false;
  brandToDelete: Brand | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Carga todas las marcas
   */
  private loadBrands(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getAllBrands().subscribe({
        next: (brands) => {
          this.brands = brands || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading brands:', error);
          this.isLoading = false;
        },
      })
    );
  }

  /**
   * Aplica los filtros a la lista de marcas
   */
  applyFilters(): void {
    let filtered = [...this.brands];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (brand) =>
          brand.name.toLowerCase().includes(term) ||
          brand.description?.toLowerCase().includes(term)
      );
    }

    this.filteredBrands = filtered;
  }

  /**
   * Abre el modal para crear una nueva marca
   */
  openCreateBrandModal(): void {
    this.modalMode = 'create';
    this.selectedBrand = null;
    this.isModalOpen = true;
  }

  /**
   * Edita una marca existente
   */
  editBrand(brand: Brand): void {
    this.modalMode = 'edit';
    this.selectedBrand = { ...brand };
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedBrand = null;
  }

  /**
   * Guarda o actualiza una marca
   */
  onSaveBrand(brand: Brand): void {
    if (this.modalMode === 'create') {
      this.createBrand(brand);
    } else {
      this.updateBrand(brand);
    }
  }

  /**
   * Crea una nueva marca
   */
  private createBrand(brand: Brand): void {
    this.subscriptions.push(
      this.productService.createBrand(brand).subscribe({
        next: (newBrand) => {
          this.closeModal();
          this.toastService.success(
            `Marca "${brand.name}" creada exitosamente`
          );
          this.loadBrands();
        },
        error: (error) => {
          console.error('Error al crear marca:', error);
          this.toastService.error(
            'Error al crear la marca. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'create';
            this.selectedBrand = brand;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Actualiza una marca existente
   */
  private updateBrand(brand: Brand): void {
    this.subscriptions.push(
      this.productService.updateBrand(brand.id, brand).subscribe({
        next: (updatedBrand) => {
          this.closeModal();
          this.toastService.success(
            `Marca "${brand.name}" actualizada exitosamente`
          );
          this.loadBrands();
        },
        error: (error) => {
          console.error('Error al actualizar marca:', error);
          this.toastService.error(
            'Error al actualizar la marca. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'edit';
            this.selectedBrand = brand;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Abre el modal de confirmación de eliminación
   */
  onDeleteBrand(brandId: string): void {
    const brand = this.brands.find((b) => b.id === brandId);
    if (brand) {
      this.brandToDelete = brand;
      this.isDeleteModalOpen = true;
    }
  }

  /**
   * Confirma la eliminación de la marca
   */
  confirmDelete(): void {
    if (!this.brandToDelete) return;

    const brandId = this.brandToDelete.id;
    const brandName = this.brandToDelete.name;

    this.subscriptions.push(
      this.productService.deleteBrand(brandId).subscribe({
        next: () => {
          this.brands = this.brands.filter((b) => b.id !== brandId);
          this.applyFilters();
          this.cancelDelete();
          this.toastService.success(
            `Marca "${brandName}" eliminada exitosamente`
          );
        },
        error: (error) => {
          console.error('Error al eliminar marca:', error);
          this.toastService.error(
            'Error al eliminar la marca. Por favor, intenta nuevamente.'
          );
          this.cancelDelete();
        },
      })
    );
  }

  /**
   * Cancela la eliminación y cierra el modal
   */
  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.brandToDelete = null;
  }

  /**
   * Obtiene el título del modal de eliminación
   */
  getDeleteTitle(): string {
    return '¿Eliminar marca?';
  }

  /**
   * Obtiene el mensaje del modal de eliminación
   */
  getDeleteMessage(): string {
    if (this.brandToDelete) {
      return `¿Estás seguro de que deseas eliminar la marca "${this.brandToDelete.name}"? Esta acción no se puede deshacer.`;
    }
    return 'Esta acción no se puede deshacer.';
  }

  /**
   * Vuelve al dashboard
   */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
