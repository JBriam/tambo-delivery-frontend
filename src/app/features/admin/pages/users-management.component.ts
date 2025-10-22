import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserAdminService } from '../../../services/user-admin.service';
import { 
  UserDetailsDto, 
  UserRequestDtoAdmin, 
  UserTableData, 
  AVAILABLE_ROLES
} from '../../../models/user-admin.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
          <p class="text-gray-600">Administra los usuarios registrados en la plataforma</p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Añadir Usuario',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateUserModal()"
          />
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="mb-6 flex justify-between items-center">
        <div class="flex space-x-4">
          <button 
            (click)="refreshUsers()"
            [disabled]="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ loading ? 'Cargando...' : 'Actualizar' }}
          </button>
          <button 
            (click)="openCreateModal()"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            + Crear Usuario
          </button>
        </div>
        <div class="text-sm text-gray-600">
          Total: {{ totalUsers }} usuarios
        </div>
      </div>

      <!-- Error/Success Messages -->
      <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>
      <div *ngIf="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let user of usersTableData" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img 
                        [src]="user.profileImageUrl || '/assets/icons/user-placeholder.svg'" 
                        [alt]="user.firstName + ' ' + user.lastName"
                        class="h-10 w-10 rounded-full object-cover"
                        (error)="onImageError($event)">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.phoneNumber || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ user.roles }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    (click)="viewUser(user.email)"
                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                    Ver
                  </button>
                  <button 
                    (click)="editUser(user.email)"
                    class="text-blue-600 hover:text-blue-900 mr-3">
                    Editar
                  </button>
                  <button 
                    (click)="deleteUser(user.email)"
                    class="text-red-600 hover:text-red-900">
                    Eliminar
                  </button>
                </td>
              </tr>
              <tr *ngIf="usersTableData.length === 0 && !loading">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                  Cargando usuarios...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ modalMode === 'create' ? 'Crear Usuario' : modalMode === 'edit' ? 'Editar Usuario' : 'Detalles del Usuario' }}
            </h3>
            
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" *ngIf="modalMode !== 'view'">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nombre</label>
                  <input 
                    type="text" 
                    formControlName="firstName"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched">
                  <div *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    El nombre es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Apellido</label>
                  <input 
                    type="text" 
                    formControlName="lastName"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched">
                  <div *ngIf="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    El apellido es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    formControlName="email"
                    [readonly]="modalMode === 'edit'"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    [class.border-red-500]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
                    [class.bg-gray-100]="modalMode === 'edit'">
                  <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" 
                       class="text-red-500 text-xs mt-1">
                    Email válido es requerido
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input 
                    type="tel" 
                    formControlName="phoneNumber"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">URL de Imagen de Perfil</label>
                  <input 
                    type="url" 
                    formControlName="profileImageUrl"
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                  <div class="space-y-2">
                    <div *ngFor="let role of availableRoles; let i = index" class="flex items-center">
                      <input 
                        type="checkbox" 
                        [id]="'role-' + i"
                        [value]="role.value"
                        (change)="onRoleChange($event)"
                        [checked]="isRoleSelected(role.value)"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                      <label [for]="'role-' + i" class="ml-2 block text-sm text-gray-900">
                        {{ role.label }}
                      </label>
                    </div>
                  </div>
                  <div *ngIf="selectedRoles.length === 0 && userForm.touched" 
                       class="text-red-500 text-xs mt-1">
                    Debe seleccionar al menos un rol
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  [disabled]="userForm.invalid || selectedRoles.length === 0 || submitting"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {{ submitting ? 'Guardando...' : (modalMode === 'create' ? 'Crear' : 'Actualizar') }}
                </button>
              </div>
            </form>

            <!-- View Mode -->
            <div *ngIf="modalMode === 'view' && selectedUser" class="space-y-4">
              <div class="text-center mb-4">
                <img 
                  [src]="selectedUser.profileImageUrl || '/assets/icons/user-placeholder.svg'" 
                  [alt]="selectedUser.firstName + ' ' + selectedUser.lastName"
                  class="h-20 w-20 rounded-full object-cover mx-auto mb-2"
                  (error)="onImageError($event)">
                <h4 class="text-lg font-medium text-gray-900">
                  {{ selectedUser.firstName }} {{ selectedUser.lastName }}
                </h4>
              </div>
              
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <span class="font-medium text-gray-700">Email:</span>
                  <span class="ml-2 text-gray-900">{{ selectedUser.email }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Teléfono:</span>
                  <span class="ml-2 text-gray-900">{{ selectedUser.phoneNumber || 'N/A' }}</span>
                </div>
                <div>
                  <span class="font-medium text-gray-700">Roles:</span>
                  <div class="ml-2 mt-1">
                    <span *ngFor="let role of selectedUser.authorityList" 
                          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                      {{ role }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  (click)="closeModal()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Cerrar
                </button>
                <button 
                  type="button" 
                  (click)="editUser(selectedUser.email)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else {
        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N°
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombres completos
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo electrónico
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
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
                @if (filteredUsers.length === 0) {
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                      @if (searchTerm || selectedStatus) {
                        No se encontraron usuarios que coincidan con los filtros
                      } @else {
                        No hay usuarios disponibles
                      }
                    </td>
                  </tr>
                } @else {
                  @for (user of filteredUsers; track user.email; let i = $index) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ i + 1 }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ user.email }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ user.phoneNumber || 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          [class]="user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        >
                          {{ user.enabled ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          (click)="editUser(user)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          (click)="toggleUserStatus(user)"
                          [class]="user.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        >
                          {{ user.enabled ? 'Desactivar' : 'Activar' }}
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
  `,
  styles: []
})
export class UsersManagementComponent implements OnInit {
  
  // Data properties
  usersTableData: UserTableData[] = [];
  selectedUser: UserDetailsDto | null = null;
  totalUsers = 0;
  availableRoles = AVAILABLE_ROLES;
  selectedRoles: string[] = [];

  // Form properties
  userForm: FormGroup;

  // UI state properties
  loading = false;
  submitting = false;
  showModal = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly userAdminService: UserAdminService,
    private readonly fb: FormBuilder
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Crea el formulario reactivo para usuarios
   */
  private createUserForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      profileImageUrl: ['']
    });
  }

  /**
   * Carga todos los usuarios del sistema
   */
  loadUsers(): void {
    this.loading = true;
    this.clearMessages();

    this.userAdminService.getAllUsers().subscribe({
      next: (users) => {
        this.usersTableData = this.userAdminService.mapToTableData(users);
        this.totalUsers = users.length;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar los usuarios';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  /**
   * Refresca la lista de usuarios
   */
  refreshUsers(): void {
    this.loadUsers();
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedUser = null;
    this.selectedRoles = [];
    this.userForm.reset();
    this.userForm.get('email')?.enable();
    this.showModal = true;
    this.clearMessages();
  }

  /**
   * Abre el modal para ver los detalles de un usuario
   */
  viewUser(email: string): void {
    this.loading = true;
    this.userAdminService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.selectedUser = user;
        this.modalMode = 'view';
        this.showModal = true;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar el usuario';
        this.loading = false;
      }
    });
  }

  /**
   * Abre el modal para editar un usuario
   */
  editUser(email: string): void {
    this.loading = true;
    this.clearMessages();
    this.userAdminService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.selectedUser = user;
        this.modalMode = 'edit';
        this.selectedRoles = [...user.authorityList];
        
        // Llenar el formulario con los datos del usuario
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber || '',
          profileImageUrl: user.profileImageUrl || ''
        });
        
        this.userForm.get('email')?.disable();
        this.showModal = true;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al cargar el usuario';
        this.loading = false;
      }
    });
  }

  /**
   * Elimina un usuario (funcionalidad pendiente en backend)
   */
  deleteUser(email: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el usuario ${email}?`)) {
      // TODO: Implementar cuando el backend tenga el endpoint DELETE
      this.errorMessage = 'La funcionalidad de eliminar usuarios aún no está disponible en el backend. Contacta al desarrollador del backend para agregar el endpoint DELETE /api/admin/users/{email}';
    }
  }

  /**
   * Maneja el cambio de selección de roles
   */
  /**
   * Maneja el cambio de selección de roles
   */
  onRoleChange(event: any): void {
    const role = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!this.selectedRoles.includes(role)) {
        this.selectedRoles.push(role);
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    }
  }

  /**
   * Verifica si un rol está seleccionado
   */
  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.userForm.invalid || this.selectedRoles.length === 0) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor complete todos los campos requeridos y seleccione al menos un rol';
      return;
    }

    this.submitting = true;
    this.clearMessages();

    // Usar getRawValue() para obtener también los campos deshabilitados
    const formValue = this.userForm.getRawValue();
    
    // Para edición, usar el email del usuario seleccionado si el campo está deshabilitado
    const email = this.modalMode === 'edit' ? this.selectedUser!.email : formValue.email;
    
    // Validar que los campos requeridos no estén vacíos
    if (!formValue.firstName || !formValue.lastName || !email) {
      this.errorMessage = 'Los campos Nombre, Apellido y Email son obligatorios';
      this.submitting = false;
      return;
    }

    const userData: UserRequestDtoAdmin = {
      firstName: (formValue.firstName || '').trim(),
      lastName: (formValue.lastName || '').trim(),
      email: (email || '').trim(),
      phoneNumber: (formValue.phoneNumber || '').trim(),
      profileImageUrl: (formValue.profileImageUrl || '').trim(),
      roles: this.selectedRoles
    };



    const operation = this.modalMode === 'create' 
      ? this.userAdminService.createUser(userData)
      : this.userAdminService.updateUser(this.selectedUser!.email, userData);

    operation.subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.submitting = false;
        
        // Cerrar modal y recargar después de un breve delay para asegurar que el backend procese
        setTimeout(() => {
          this.closeModal();
          this.loadUsers(); // Recargar la lista para ver los cambios
        }, 500);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al procesar la solicitud';
        this.submitting = false;
      }
    });
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

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
    this.selectedRoles = [];
    this.userForm.reset();
    this.modalMode = 'create';
    this.clearMessages();
  }

  /**
   * Marca todos los campos del formulario como tocados
   */
  private markFormGroupTouched(): void {
    for (const key of Object.keys(this.userForm.controls)) {
      this.userForm.get(key)?.markAsTouched();
    }
  }

  /**
   * Limpia los mensajes de error y éxito
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}