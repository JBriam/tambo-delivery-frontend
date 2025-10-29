import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserAdminService } from '../../../services/user-admin.service';
import { UserDetailsDto } from '../../../models/user-admin.model';
import {
  UserModalComponent,
  UserFormData,
} from '../components/user-modal.component';
import { RolesModalComponent } from '../components/roles-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserModalComponent,
    RolesModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p class="text-gray-600">Administra los usuarios de Tambo Delivery</p>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            (click)="openRolesModal()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline-block mr-2 -mt-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
              />
            </svg>
            Gestionar Roles
          </button>
          <button
            type="button"
            (click)="openCreateModal()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline-block mr-2 -mt-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
              />
            </svg>
            Crear Usuario
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 bg-white rounded-lg shadow p-4">
        <div class="flex gap-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Buscar por nombre, email o teléfono..."
              class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
          <div class="flex items-center gap-2">
            <select
              [(ngModel)]="roleFilter"
              (change)="applyFilters()"
              class="w-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] cursor-pointer"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN" class="text-gray-900">Administrador</option>
              <option value="USER" class="text-gray-900">Usuario</option>
            </select>
            <select
              [(ngModel)]="statusFilter"
              (change)="applyFilters()"
              class="w-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="true" class="text-gray-900">Activo</option>
              <option value="false" class="text-gray-900">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
      </div>

      <!-- Users Table -->
      <div
        *ngIf="!isLoading"
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Usuario
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contacto
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Roles
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
              <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img
                        [src]="
                          user.profileImageUrl ||
                          '/assets/icons/user-placeholder.svg'
                        "
                        [alt]="user.firstName + ' ' + user.lastName"
                        class="h-10 w-10 rounded-full object-cover"
                        (error)="onImageError($event)"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ user.phoneNumber || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <span
                      *ngFor="let role of user.authorityList"
                      [ngClass]="{
                        'bg-purple-100 text-purple-800': role === 'ADMIN',
                        'bg-blue-100 text-blue-800': role === 'USER'
                      }"
                      class="px-2 py-1 text-xs font-semibold rounded-full"
                    >
                      {{ role === 'ADMIN' ? 'Admin' : 'Usuario' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [ngClass]="{
                      'bg-green-100 text-green-800': user.enabled,
                      'bg-red-100 text-red-800': !user.enabled
                    }"
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ user.enabled ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    (click)="editUser(user)"
                    class="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 inline"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                    Editar
                  </button>
                  <button
                    (click)="confirmDelete(user)"
                    class="text-red-600 hover:text-red-900 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 inline"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Eliminar
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 mx-auto text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  No se encontraron usuarios
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Results Info -->
      <div
        *ngIf="!isLoading && filteredUsers.length > 0"
        class="mt-4 text-sm text-gray-600 text-center"
      >
        Mostrando {{ filteredUsers.length }} de {{ users.length }} usuarios
      </div>
    </div>

    <!-- User Modal -->
    <app-user-modal
      *ngIf="isModalOpen"
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [user]="selectedUser"
      (closeModal)="closeModal()"
      (saveUser)="handleSave($event)"
    />

    <!-- Roles Modal -->
    <app-roles-modal
      *ngIf="isRolesModalOpen"
      [isOpen]="isRolesModalOpen"
      (closeModal)="closeRolesModal()"
    />

    <!-- Confirm Delete Modal -->
    <app-confirm-modal
      *ngIf="isDeleteModalOpen"
      [isOpen]="isDeleteModalOpen"
      title="Eliminar Usuario"
      [message]="
        '¿Estás seguro de que deseas eliminar al usuario ' +
        userToDelete?.firstName +
        ' ' +
        userToDelete?.lastName +
        '? Esta acción no se puede deshacer.'
      "
      confirmText="Eliminar"
      cancelText="Cancelar"
      type="danger"
      (confirm)="deleteUser()"
      (cancel)="closeDeleteModal()"
    />

    <!-- Toast Notifications -->
    <app-toast />
  `,
  styles: [],
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  users: UserDetailsDto[] = [];
  filteredUsers: UserDetailsDto[] = [];

  searchTerm = '';
  roleFilter = '';
  statusFilter = '';

  isLoading = false;
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedUser: UserDetailsDto | null = null;

  isRolesModalOpen = false;

  isDeleteModalOpen = false;
  userToDelete: UserDetailsDto | null = null;

  private destroy$ = new Subscription();

  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  /**
   * Carga todos los usuarios del sistema
   */
  loadUsers(): void {
    this.isLoading = true;

    const sub = this.userAdminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.show('Error al cargar los usuarios', 'error');
        console.error('Error loading users:', error);
        this.isLoading = false;
      },
    });

    this.destroy$.add(sub);
  }

  /**
   * Aplica los filtros de búsqueda
   */
  applyFilters(): void {
    let filtered = [...this.users];

    // Filtro de búsqueda por texto
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.phoneNumber && user.phoneNumber.toLowerCase().includes(term))
      );
    }

    // Filtro por rol
    if (this.roleFilter) {
      filtered = filtered.filter((user) =>
        user.authorityList.includes(this.roleFilter)
      );
    }

    // Filtro por estado
    if (this.statusFilter !== '') {
      const enabled = this.statusFilter === 'true';
      filtered = filtered.filter((user) => user.enabled === enabled);
    }

    this.filteredUsers = filtered;
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  /**
   * Abre el modal de gestión de roles
   */
  openRolesModal(): void {
    this.isRolesModalOpen = true;
  }

  /**
   * Cierra el modal de gestión de roles
   */
  closeRolesModal(): void {
    this.isRolesModalOpen = false;
  }

  /**
   * Abre el modal para editar un usuario
   */
  editUser(user: UserDetailsDto): void {
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  /**
   * Maneja el guardado desde el modal
   */
  handleSave(formData: UserFormData): void {
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber || '',
      profileImageUrl: formData.profileImageUrl || '',
      roles: formData.roles,
    };

    const operation =
      this.modalMode === 'create'
        ? this.userAdminService.createUser(userData)
        : this.userAdminService.updateUser(this.selectedUser!.email, userData);

    const sub = operation.subscribe({
      next: () => {
        this.toastService.show(
          `Usuario ${
            this.modalMode === 'create' ? 'creado' : 'actualizado'
          } exitosamente`,
          'success'
        );
        this.closeModal();
        this.loadUsers();
      },
      error: (error) => {
        // Verificar si el error es en realidad un éxito (backend devolviendo 400 pero usuario creado)
        if (error.isActuallySuccess) {
          console.warn('Usuario creado a pesar del error 400 del backend');
          this.toastService.show(
            error.successMessage ||
              `Usuario ${
                this.modalMode === 'create' ? 'creado' : 'actualizado'
              } exitosamente`,
            'success'
          );
          this.closeModal();
          this.loadUsers();
        } else {
          this.toastService.show(
            error.message || 'Error al guardar el usuario',
            'error'
          );
        }
      },
    });

    this.destroy$.add(sub);
  }

  /**
   * Abre el modal de confirmación para eliminar
   */
  confirmDelete(user: UserDetailsDto): void {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  /**
   * Cierra el modal de confirmación
   */
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  /**
   * Elimina un usuario
   */
  deleteUser(): void {
    if (!this.userToDelete) return;

    // TODO: Implementar cuando el backend tenga el endpoint DELETE
    this.toastService.show(
      'La funcionalidad de eliminar usuarios aún no está disponible en el backend',
      'warning'
    );
    this.closeDeleteModal();
  }

  /**
   * Maneja errores de carga de imágenes
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/icons/user-placeholder.svg';
    }
  }
}
