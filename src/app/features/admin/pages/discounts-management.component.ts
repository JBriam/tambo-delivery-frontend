import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { Discount } from '../../../models/discount.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { DiscountModalComponent } from '../components/discount-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-discount-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    DiscountModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            Gestión de Descuentos
          </h1>
          <p class="text-gray-600">
            Administra los descuentos de Tambo Delivery
          </p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Añadir Descuento',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateDiscountModal()"
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
              placeholder="Buscar descuento..."
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
                  Porcentaje (%)
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha de Inicio
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fecha de Fin
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
              @if (filteredDiscounts.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  @if (searchTerm) { No se encontraron descuentos que coincidan
                  con los filtros } @else { No hay descuentos disponibles }
                </td>
              </tr>
              } @else { @for (discount of filteredDiscounts; track discount.id)
              {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">
                      {{ discount.name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm text-gray-500">
                      {{ discount.percentage }}%
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {{ discount.startDate | date }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
                    >
                      {{ discount.endDate | date }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [class]="
                      discount.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    {{ discount.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                >
                  <button
                    (click)="editDiscount(discount)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    (click)="onDeleteDiscount(discount.id)"
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

      <!-- Discount Modal -->
      <app-discount-modal
        [isOpen]="isModalOpen"
        [mode]="modalMode"
        [discount]="selectedDiscount"
        (closeModal)="closeModal()"
        (saveDiscount)="onSaveDiscount($event)"
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
    </div>
  `,
})
export class DiscountsManagementComponent implements OnInit, OnDestroy {
  discounts: Discount[] = [];
  filteredDiscounts: Discount[] = [];
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedStatus = '';

  // Modal
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedDiscount: Discount | null = null;

  // Delete Modal
  isDeleteModalOpen = false;
  discountToDelete: Discount | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Carga todas los descuentos disponibles
   */
  private loadDiscounts(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getAllDiscounts().subscribe({
        next: (discounts) => {
          this.discounts = discounts || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading discounts:', error);
          this.isLoading = false;
        },
      })
    );
  }

  /**
   * Aplica los filtros a la lista de descuentos
   */
  applyFilters(): void {
    let filtered = [...this.discounts];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (discount) =>
          discount.name.toLowerCase().includes(term) ||
          discount.percentage.toString().includes(term)
      );
    }

    this.filteredDiscounts = filtered;
  }

  /**
   * Abre el modal para crear un nuevo descuento
   */
  openCreateDiscountModal(): void {
    this.modalMode = 'create';
    this.selectedDiscount = null;
    this.isModalOpen = true;
  }

  /**
   * Edita un descuento existente
   */
  editDiscount(discount: Discount): void {
    this.modalMode = 'edit';
    this.selectedDiscount = { ...discount };
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedDiscount = null;
  }

  /**
   * Guarda o actualiza un descuento
   */
  onSaveDiscount(discount: Discount): void {
    if (this.modalMode === 'create') {
      this.createDiscount(discount);
    } else {
      this.updateDiscount(discount);
    }
  }

  /**
   * Crea una nueva descuento
   */
  private createDiscount(discount: Discount): void {
    this.subscriptions.push(
      this.productService.createDiscount(discount).subscribe({
        next: (newDiscount) => {
          this.closeModal();
          this.toastService.success(
            `Descuento "${newDiscount.name}" creado exitosamente`
          );
          this.loadDiscounts();
        },
        error: (error) => {
          console.error('Error al crear descuento:', error);
          this.toastService.error(
            'Error al crear el descuento. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'create';
            this.selectedDiscount = discount;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Actualiza un descuento existente
   */
  private updateDiscount(discount: Discount): void {
    this.subscriptions.push(
      this.productService.updateDiscount(discount.id, discount).subscribe({
        next: (updatedDiscount) => {
          this.closeModal();
          this.toastService.success(
            `Descuento "${updatedDiscount.name}" actualizado exitosamente`
          );
          this.loadDiscounts();
        },
        error: (error) => {
          console.error('Error al actualizar descuento:', error);
          this.toastService.error(
            'Error al actualizar el descuento. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'edit';
            this.selectedDiscount = discount;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Abre el modal de confirmación de eliminación
   */
  onDeleteDiscount(discountId: string): void {
    const discount = this.discounts.find((b) => b.id === discountId);
    if (discount) {
      this.discountToDelete = discount;
      this.isDeleteModalOpen = true;
    }
  }

  /**
   * Confirma la eliminación del descuento
   */
  confirmDelete(): void {
    if (!this.discountToDelete) return;

    const discountId = this.discountToDelete.id;
    const discountName = this.discountToDelete.name;

    this.subscriptions.push(
      this.productService.deleteDiscount(discountId).subscribe({
        next: () => {
          this.discounts = this.discounts.filter((b) => b.id !== discountId);
          this.applyFilters();
          this.cancelDelete();
          this.toastService.success(
            `Descuento "${discountName}" eliminado exitosamente`
          );
        },
        error: (error) => {
          console.error('Error al eliminar descuento:', error);
          this.toastService.error(
            'Error al eliminar el descuento. Por favor, intenta nuevamente.'
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
    this.discountToDelete = null;
  }

  /**
   * Obtiene el título del modal de eliminación
   */
  getDeleteTitle(): string {
    return '¿Eliminar descuento?';
  }

  /**
   * Obtiene el mensaje del modal de eliminación
   */
  getDeleteMessage(): string {
    if (this.discountToDelete) {
      return `¿Estás seguro de que deseas eliminar el descuento "${this.discountToDelete.name}"? Esta acción no se puede deshacer.`;
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
