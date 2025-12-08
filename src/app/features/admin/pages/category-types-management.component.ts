import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { Category, CategoryType } from '../../../models/category.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CategoryTypeModalComponent } from '../components/category-type-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-category-types-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CategoryTypeModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header con breadcrumb -->
      <div class="mb-6">
        <nav class="flex items-center text-sm text-gray-600 mb-4">
          <button 
            (click)="goBackToCategories()"
            class="hover:text-[#a81b8d] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Categorías
          </button>
          <span class="mx-2">/</span>
          <span class="text-gray-900 font-medium">{{ category?.name || 'Cargando...' }}</span>
        </nav>

        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Tipos de {{ category?.name }}
            </h1>
            <p class="text-gray-600 mt-1">
              Gestiona los tipos asociados a esta categoría
            </p>
          </div>
          <app-button
            [config]="{
              text: 'Crear Tipo',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateTypeModal()"
          />
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex-1 min-w-64">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="Buscar tipo..."
            class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
          />
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else {
        <!-- Tabla de tipos -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @if (filteredTypes.length === 0) {
                  <tr>
                    <td colspan="3" class="px-6 py-12 text-center text-gray-500">
                      @if (searchTerm) {
                        No se encontraron tipos que coincidan con los filtros
                      } @else {
                        No hay tipos asociados a esta categoría
                      }
                    </td>
                  </tr>
                } @else {
                  @for (type of filteredTypes; track type.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                          {{ type.name }}
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-sm text-gray-500">
                          {{ type.description || 'Sin descripción' }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          (click)="editType(type)"
                          type="button"
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Editar tipo"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          (click)="onDeleteType(type.id)"
                          type="button"
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Eliminar tipo"
                        >
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

    <!-- Category Type Modal -->
    <app-category-type-modal
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [categoryType]="selectedType"
      (closeModal)="closeModal()"
      (saveType)="onSaveType($event)"
    />

    <!-- Delete Confirmation Modal -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen"
      type="danger"
      [title]="'¿Eliminar tipo?'"
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
export class CategoryTypesManagementComponent implements OnInit, OnDestroy {
  categoryId: string = '';
  category: Category | null = null;
  types: CategoryType[] = [];
  filteredTypes: CategoryType[] = [];
  isLoading = false;

  // Filtros
  searchTerm = '';

  // Modal
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedType: CategoryType | null = null;

  // Delete Modal
  isDeleteModalOpen = false;
  typeToDelete: CategoryType | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la categoría desde la ruta
    this.categoryId = this.route.snapshot.params['id'];
    if (this.categoryId) {
      this.loadCategory();
      this.loadTypes();
    } else {
      this.toastService.error('ID de categoría no válido');
      this.goBackToCategories();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Carga la información de la categoría
   */
  private loadCategory(): void {
    this.subscriptions.push(
      this.productService.getAllCategories().subscribe({
        next: (categories) => {
          this.category = categories.find((c) => c.id === this.categoryId) || null;
          if (!this.category) {
            this.toastService.error('Categoría no encontrada');
            this.goBackToCategories();
          }
        },
        error: (error) => {
          console.error('Error loading category:', error);
          this.toastService.error('Error al cargar la categoría');
          this.goBackToCategories();
        },
      })
    );
  }

  /**
   * Carga todos los tipos de esta categoría
   */
  private loadTypes(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getAllCategoryTypesByCategory(this.categoryId).subscribe({
        next: (types) => {
          this.types = types || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading types:', error);
          this.toastService.error('Error al cargar los tipos');
          this.isLoading = false;
        },
      })
    );
  }

  /**
   * Aplica los filtros a la lista de tipos
   */
  applyFilters(): void {
    let filtered = [...this.types];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (type) =>
          type.name.toLowerCase().includes(term) ||
          type.description?.toLowerCase().includes(term)
      );
    }

    this.filteredTypes = filtered;
  }

  /**
   * Abre el modal para crear un nuevo tipo
   */
  openCreateTypeModal(): void {
    this.modalMode = 'create';
    this.selectedType = null;
    this.isModalOpen = true;
  }

  /**
   * Edita un tipo existente
   */
  editType(type: CategoryType): void {
    this.modalMode = 'edit';
    this.selectedType = { ...type };
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedType = null;
  }

  /**
   * Guarda o actualiza un tipo
   */
  onSaveType(type: CategoryType): void {
    if (this.modalMode === 'create') {
      this.createType(type);
    } else {
      this.updateType(type);
    }
  }

  /**
   * Crea un nuevo tipo
   */
  private createType(type: CategoryType): void {
    const typeData = {
      name: type.name,
      description: type.description || '',
      categoryId: this.categoryId,
    };

    this.subscriptions.push(
      this.productService.createCategoryType(typeData).subscribe({
        next: () => {
          this.closeModal();
          this.toastService.success(`Tipo "${type.name}" creado exitosamente`);
          this.loadTypes();
        },
        error: (error) => {
          console.error('Error al crear tipo:', error);
          this.toastService.error('Error al crear el tipo. Por favor, intenta nuevamente.');
        },
      })
    );
  }

  /**
   * Actualiza un tipo existente
   */
  private updateType(type: CategoryType): void {
    const typeData = {
      name: type.name,
      description: type.description || '',
      categoryId: this.categoryId,
    };

    this.subscriptions.push(
      this.productService.updateCategoryType(type.id, typeData).subscribe({
        next: () => {
          this.closeModal();
          this.toastService.success(`Tipo "${type.name}" actualizado exitosamente`);
          this.loadTypes();
        },
        error: (error) => {
          console.error('Error al actualizar tipo:', error);
          this.toastService.error('Error al actualizar el tipo. Por favor, intenta nuevamente.');
        },
      })
    );
  }

  /**
   * Abre el modal de confirmación de eliminación
   */
  onDeleteType(typeId: string): void {
    const type = this.types.find((t) => t.id === typeId);
    if (type) {
      this.typeToDelete = type;
      this.isDeleteModalOpen = true;
    }
  }

  /**
   * Confirma la eliminación del tipo
   */
  confirmDelete(): void {
    if (!this.typeToDelete) return;

    const typeId = this.typeToDelete.id;
    const typeName = this.typeToDelete.name;

    this.subscriptions.push(
      this.productService.deleteCategoryType(typeId).subscribe({
        next: () => {
          this.types = this.types.filter((t) => t.id !== typeId);
          this.applyFilters();
          this.cancelDelete();
          this.toastService.success(`Tipo "${typeName}" eliminado exitosamente`);
        },
        error: (error) => {
          console.error('Error al eliminar tipo:', error);
          this.toastService.error('Error al eliminar el tipo. Por favor, intenta nuevamente.');
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
    this.typeToDelete = null;
  }

  /**
   * Obtiene el mensaje del modal de eliminación
   */
  getDeleteMessage(): string {
    if (this.typeToDelete) {
      return `¿Estás seguro de que deseas eliminar el tipo "${this.typeToDelete.name}"? Esta acción no se puede deshacer.`;
    }
    return 'Esta acción no se puede deshacer.';
  }

  /**
   * Vuelve a la gestión de categorías
   */
  goBackToCategories(): void {
    this.router.navigate(['/admin/categories']);
  }
}
