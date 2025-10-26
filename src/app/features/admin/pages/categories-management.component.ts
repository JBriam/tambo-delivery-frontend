import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { Category } from '../../../models/category.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CategoryModalComponent } from '../components/category-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CategoryModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            Gestión de Categorías
          </h1>
          <p class="text-gray-600">
            Administra el catálogo de categorías de Tambo Delivery
          </p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Añadir Categoría',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateCategoryModal()"
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
              placeholder="Buscar categoría..."
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
      <!-- Categories Table -->
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
              @if (filteredCategories.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  @if (searchTerm) { No se encontraron categorías que coincidan
                  con los filtros } @else { No hay categorías disponibles }
                </td>
              </tr>
              } @else { @for (category of filteredCategories; track category.id)
              {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      [src]="
                        category.imageUrl ||
                        '/assets/categories/category-default.jpg'
                      "
                      [alt]="category.name"
                      class="h-10 w-10 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ category.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ category.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                >
                  <button
                    (click)="editCategory(category)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    (click)="onDeleteCategory(category.id)"
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

    <!-- Category Modal -->
    <app-category-modal
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [category]="selectedCategory"
      (closeModal)="closeModal()"
      (saveCategory)="onSaveCategory($event)"
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
export class CategoriesManagementComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedStatus = '';

  // Modal
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCategory: Category | null = null;

  // Delete Modal
  isDeleteModalOpen = false;
  categoryToDelete: Category | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Carga todas las categorías
   */
  private loadCategories(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getAllCategories().subscribe({
        next: (categories) => {
          this.categories = categories || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.isLoading = false;
        },
      })
    );
  }

  /**
   * Aplica los filtros a la lista de categorías
   */
  applyFilters(): void {
    let filtered = [...this.categories];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category.description?.toLowerCase().includes(term)
      );
    }

    this.filteredCategories = filtered;
  }

  /**
   * Abre el modal para crear una nueva categoría
   */
  openCreateCategoryModal(): void {
    this.modalMode = 'create';
    this.selectedCategory = null;
    this.isModalOpen = true;
  }

  /**
   * Edita una categoría existente
   */
  editCategory(category: Category): void {
    this.modalMode = 'edit';
    this.selectedCategory = { ...category };
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCategory = null;
  }

  /**
   * Guarda o actualiza una categoría
   */
  onSaveCategory(category: Category): void {
    if (this.modalMode === 'create') {
      this.createCategory(category);
    } else {
      this.updateCategory(category);
    }
  }

  /**
   * Crea una nueva categoría
   */
  private createCategory(category: Category): void {
    this.subscriptions.push(
      this.productService.createCategory(category).subscribe({
        next: (newCategory) => {
          this.closeModal();
          this.toastService.success(
            `Categoría "${category.name}" creada exitosamente`
          );
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.toastService.error(
            'Error al crear la categoría. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'create';
            this.selectedCategory = category;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Actualiza una categoría existente
   */
  private updateCategory(category: Category): void {
    this.subscriptions.push(
      this.productService.updateCategory(category.id, category).subscribe({
        next: (updatedCategory) => {
          this.closeModal();
          this.toastService.success(
            `Categoría "${category.name}" actualizada exitosamente`
          );
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al actualizar categoría:', error);
          this.toastService.error(
            'Error al actualizar la categoría. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'edit';
            this.selectedCategory = category;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Abre el modal de confirmación de eliminación
   */
  onDeleteCategory(categoryId: string): void {
    const category = this.categories.find((b) => b.id === categoryId);
    if (category) {
      this.categoryToDelete = category;
      this.isDeleteModalOpen = true;
    }
  }

  /**
   * Confirma la eliminación de la categoría
   */
  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    const categoryId = this.categoryToDelete.id;
    const categoryName = this.categoryToDelete.name;

    this.subscriptions.push(
      this.productService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c.id !== categoryId);
          this.applyFilters();
          this.cancelDelete();
          this.toastService.success(
            `Categoría "${categoryName}" eliminada exitosamente`
          );
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.toastService.error(
            'Error al eliminar la categoría. Por favor, intenta nuevamente.'
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
    this.categoryToDelete = null;
  }

  /**
   * Obtiene el título del modal de eliminación
   */
  getDeleteTitle(): string {
    return '¿Eliminar categoría?';
  }

  /**
   * Obtiene el mensaje del modal de eliminación
   */
  getDeleteMessage(): string {
    if (this.categoryToDelete) {
      return `¿Estás seguro de que deseas eliminar la categoría "${this.categoryToDelete.name}"? Esta acción no se puede deshacer.`;
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
