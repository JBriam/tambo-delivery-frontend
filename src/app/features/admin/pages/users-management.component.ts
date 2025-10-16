import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../users/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../models/user.model';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
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

      <!-- Filters and Search -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Buscar usuarios..."
              class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
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
export class UsersManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedStatus = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserAuth();
    this.loadUsers();
  }

  /**
   * Verifica si el usuario está autenticado y tiene permisos de admin
   */
  private checkUserAuth(): void {
    const token = this.authService.token;
    const currentUser = this.authService.currentUser;
    
    console.log('🔐 [UsersManagement] Verificando autenticación...');
    console.log('🔐 [UsersManagement] Token exists:', !!token);
    console.log('🔐 [UsersManagement] Current user:', currentUser);
    
    if (token) {
      console.log('🔐 [UsersManagement] Token preview:', token.substring(0, 30) + '...');
      console.log('🔐 [UsersManagement] Full token length:', token.length);
      
      // Decodificar el JWT para ver su contenido (solo para debugging)
      try {
        const payload = this.decodeJWT(token);
        console.log('🔐 [UsersManagement] JWT Payload:', payload);
        console.log('🔐 [UsersManagement] JWT Authorities in token:', payload.authorities || payload.roles || 'No authorities found');
      } catch (e) {
        console.error('🔐 [UsersManagement] Error decoding JWT:', e);
      }
    }
    
    if (currentUser) {
      console.log('🔐 [UsersManagement] User authorities:', currentUser.authorities);
      const isAdmin = currentUser.authorities?.some(auth => auth.authority === 'ADMIN');
      console.log('🔐 [UsersManagement] Is admin:', isAdmin);
    }
    
    // Verificar si está autenticado
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        if (!user) {
          console.warn('⚠️ [UsersManagement] Usuario no autenticado, redirigiendo...');
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
  
  /**
   * Decodifica un JWT para ver su contenido (solo para debugging)
   */
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Carga todos los usuarios
   */
  loadUsers(): void {
    console.log('🔄 [UsersManagement] Iniciando carga de usuarios...');
    this.isLoading = true;
    
    this.subscriptions.push(
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.users = users || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ [UsersManagement] Error loading users:', error);
          console.error('❌ [UsersManagement] Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url
          });
          
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Aplica los filtros a la lista de usuarios
   */
  applyFilters(): void {
    let filtered = [...this.users];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (this.selectedStatus) {
      const isActive = this.selectedStatus === 'active';
      filtered = filtered.filter(user => user.enabled === isActive);
    }

    this.filteredUsers = filtered;
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openCreateUserModal(): void {
    // TODO: Implementar modal de creación de usuario
    alert('Funcionalidad de crear usuario en desarrollo');
  }

  /**
   * Edita un usuario existente
   */
  editUser(user: User): void {
    // TODO: Implementar modal de edición de usuario
    alert(`Editar usuario: ${user.firstName} ${user.lastName}`);
  }

  /**
   * Cambia el estado activo/inactivo de un usuario
   */
  toggleUserStatus(user: User): void {
    const action = user.enabled ? 'desactivar' : 'activar';
    if (confirm(`¿Estás seguro de que quieres ${action} el usuario "${user.firstName} ${user.lastName}"?`)) {
      // TODO: Implementar llamada al backend para actualizar estado
      user.enabled = !user.enabled;
      console.log(`Usuario ${user.firstName} ${user.lastName} ${user.enabled ? 'activado' : 'desactivado'}`);
    }
  }
  
    /**
     * Vuelve al dashboard
     */
    goBack(): void {
      this.router.navigate(['/admin']);
    }
  
}