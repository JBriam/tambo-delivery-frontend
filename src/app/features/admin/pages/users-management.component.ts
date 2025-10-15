import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
        <p class="text-gray-600">Administra los usuarios registrados en la plataforma</p>
      </div>

      <!-- Placeholder Content -->
      <div class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div class="max-w-md mx-auto">
          <div class="text-6xl mb-4">👥</div>
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Gestión de Usuarios</h2>
          <p class="text-gray-600 mb-4">
            Esta sección permitirá administrar todos los usuarios registrados, 
            incluyendo clientes y administradores.
          </p>
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-700">
              <strong>Próximamente:</strong> Lista de usuarios, edición de perfiles, 
              gestión de roles y permisos.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UsersManagementComponent {
  
}