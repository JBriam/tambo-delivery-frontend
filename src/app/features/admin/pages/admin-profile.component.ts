import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserAdminService } from '../../../services/user-admin.service';
import { User } from '../../../models/user.model';
import { UserDetailsDto } from '../../../models/user-admin.model';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
        <p class="text-gray-600">Administra tu información personal</p>
      </div>

      <!-- Loading state -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else {
        <!-- Profile Info Card -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-[#a81b8d] to-[#8d1575] p-6 text-white">
            <div class="flex items-center gap-6">
              <div class="relative">
                @if (userDetails?.profileImageUrl) {
                  <img 
                    [src]="userDetails!.profileImageUrl" 
                    alt="Profile" 
                    class="w-24 h-24 rounded-full border-4 border-white object-cover"
                  />
                } @else {
                  <div class="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center">
                    <span class="text-[#a81b8d] text-3xl font-bold">
                      {{ getInitials() }}
                    </span>
                  </div>
                }
                <button 
                  (click)="toggleEditMode()"
                  class="absolute bottom-0 right-0 bg-white text-[#a81b8d] rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ userDetails?.firstName }} {{ userDetails?.lastName }}</h2>
                <p class="text-white/90">{{ userDetails?.email }}</p>
                <div class="flex gap-2 mt-2">
                  @for (role of userDetails?.authorityList; track role) {
                    <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                      {{ role }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="p-6">
            @if (!isEditMode) {
              <!-- View Mode -->
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p class="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{{ userDetails?.firstName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <p class="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{{ userDetails?.lastName }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <p class="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{{ userDetails?.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <p class="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{{ userDetails?.phoneNumber || 'No especificado' }}</p>
                  </div>
                </div>

                <div class="pt-4 border-t">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado de la Cuenta</label>
                  <div class="flex items-center gap-2">
                    @if (userDetails?.enabled) {
                      <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Activa
                      </span>
                    } @else {
                      <span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Inactiva
                      </span>
                    }
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button
                    (click)="toggleEditMode()"
                    class="px-6 py-2 bg-[#a81b8d] text-white rounded-lg hover:bg-[#8d1575] transition-colors"
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            } @else {
              <!-- Edit Mode -->
              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="firstName"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                        placeholder="Ingresa tu nombre"
                      />
                      @if (profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched) {
                        <p class="text-red-500 text-sm mt-1">El nombre es requerido</p>
                      }
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Apellido <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="lastName"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                        placeholder="Ingresa tu apellido"
                      />
                      @if (profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched) {
                        <p class="text-red-500 text-sm mt-1">El apellido es requerido</p>
                      }
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        formControlName="email"
                        [disabled]="true"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        placeholder="correo@ejemplo.com"
                      />
                      <p class="text-gray-500 text-xs mt-1">El correo no se puede modificar</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        formControlName="phoneNumber"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                        placeholder="999 999 999"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        URL de Imagen de Perfil
                      </label>
                      <input
                        type="url"
                        formControlName="profileImageUrl"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                  </div>

                  @if (errorMessage) {
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {{ errorMessage }}
                    </div>
                  }

                  @if (successMessage) {
                    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      {{ successMessage }}
                    </div>
                  }

                  <div class="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      (click)="cancelEdit()"
                      class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      [disabled]="profileForm.invalid || isSaving"
                      class="px-6 py-2 bg-[#a81b8d] text-white rounded-lg hover:bg-[#8d1575] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      @if (isSaving) {
                        <span class="flex items-center gap-2">
                          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </span>
                      } @else {
                        Guardar Cambios
                      }
                    </button>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class AdminProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userDetails: UserDetailsDto | null = null;
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  isEditMode = false;
  errorMessage = '';
  successMessage = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private userAdminService: UserAdminService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: [''],
      profileImageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Carga el perfil del usuario actual
   */
  private loadUserProfile(): void {
    this.isLoading = true;
    
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      if (user?.email) {
        // Cargar detalles completos del usuario desde el servicio de admin
        const detailsSub = this.userAdminService.getUserByEmail(user.email).subscribe({
          next: (details) => {
            this.userDetails = details;
            this.populateForm(details);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading user details:', error);
            this.errorMessage = 'Error al cargar el perfil del usuario';
            this.isLoading = false;
          }
        });
        
        this.subscriptions.push(detailsSub);
      } else {
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(userSub);
  }

  /**
   * Rellena el formulario con los datos del usuario
   */
  private populateForm(details: UserDetailsDto): void {
    this.profileForm.patchValue({
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      phoneNumber: details.phoneNumber || '',
      profileImageUrl: details.profileImageUrl || ''
    });
  }

  /**
   * Obtiene las iniciales del usuario
   */
  getInitials(): string {
    if (this.userDetails) {
      const first = this.userDetails.firstName?.charAt(0).toUpperCase() || '';
      const last = this.userDetails.lastName?.charAt(0).toUpperCase() || '';
      return `${first}${last}`;
    }
    return 'AD';
  }

  /**
   * Activa/desactiva el modo de edición
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.isEditMode && this.userDetails) {
      // Restaurar los valores originales si se cancela
      this.populateForm(this.userDetails);
    }
  }

  /**
   * Cancela la edición
   */
  cancelEdit(): void {
    this.toggleEditMode();
  }

  /**
   * Guarda los cambios del perfil
   */
  saveProfile(): void {
    if (this.profileForm.invalid || !this.userDetails) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updatedData = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.userDetails.email,
      phoneNumber: this.profileForm.value.phoneNumber || undefined,
      profileImageUrl: this.profileForm.value.profileImageUrl || undefined,
      roles: this.userDetails.authorityList
    };

    const saveSub = this.userAdminService.updateUser(this.userDetails.email, updatedData).subscribe({
      next: (response) => {
        this.successMessage = 'Perfil actualizado correctamente';
        this.isSaving = false;
        
        // Recargar los datos del perfil
        setTimeout(() => {
          this.loadUserProfile();
          this.isEditMode = false;
          this.successMessage = '';
        }, 2000);
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = error.message || 'Error al actualizar el perfil';
        this.isSaving = false;
      }
    });

    this.subscriptions.push(saveSub);
  }
}
