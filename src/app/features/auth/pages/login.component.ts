import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100"
    >
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <!-- Contenedor principal -->
      <div class="relative z-10 w-full max-w-md mx-4">
        <!-- Logo de Tambo -->
        <div class="text-center mb-8">
          <img
            src="/assets/logo/logo-tambo-800.webp"
            alt="Tambo Logo"
            class="h-16 mx-auto mb-4"
          />
          <h1 class="text-2xl font-bold text-gray-800">Tambo Delivery</h1>
          <p class="text-gray-600">Tu tienda de conveniencia favorita</p>
        </div>

        <!-- Formulario de login -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="max-w-md w-full space-y-8">
            <div>
              <h2
                class="mt-6 text-center text-3xl font-extrabold text-gray-900"
              >
                Iniciar Sesión
              </h2>
            </div>
            <form
              class="mt-8 space-y-6"
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
            >
              @if (errorMessage) {
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              >
                {{ errorMessage }}
              </div>
              }

              <div class="space-y-4">
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    formControlName="email"
                    required
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="tu@email.com"
                  />
                  @if (loginForm.get('email')?.invalid &&
                  loginForm.get('email')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Ingresa un email válido
                  </p>
                  }
                </div>

                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    formControlName="password"
                    required
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                  />
                  @if (loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    La contraseña es requerida
                  </p>
                  }
                </div>
              </div>

              <!-- Botón de envío -->
              <button
                type="submit"
                class="bg-[#667eea] inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-[#3353e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full cursor-pointer"
                [disabled]="isLoading || loginForm.invalid"
              >
                <span *ngIf="!isLoading">Iniciar Sesión</span>
                <span *ngIf="isLoading">Cargando...</span>
              </button>

              <!-- Opciones adicionales -->
              <div class="text-center m-0">
                <a
                  (click)="navigateToForgotPassword()"
                  class="text-[#667eea] text-decoration-none cursor-pointer text-sm text-center hover:text-[#3353e4]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <!-- Separador -->
              <div class="flex items-center my-6">
                <div class="flex-grow border-t border-gray-300"></div>
                <span class="mx-4 text-gray-400 text-sm">o</span>
                <div class="flex-grow border-t border-gray-300"></div>
              </div>

              <!-- Login con Google -->
              <button
                type="button"
                (click)="loginWithGoogle()"
                class="text-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                [disabled]="isLoading"
              >
                <img
                  src="/assets/icons/Google.png"
                  alt="Google Logo"
                  class="w-4 h-4 mr-2"
                />
                <span>Continuar con Google</span>
              </button>

              <!-- Registro -->
              <div class="text-center mt-4 text-[#6b7280] text-sm m-0">
                <p>
                  ¿No tienes una cuenta?
                  <a
                    (click)="navigateToRegister()"
                    class="text-[#667eea] text-sm text-decoration-none cursor-pointer hover:text-[#3353e4]"
                    >Regístrate aquí</a
                  >
                </p>
              </div>
              <div class="text-center mt-4 text-[#6b7280] text-sm m-0">
                  <u><a (click)="navigateToHome()"
                    class="text-[#667eea] text-sm text-decoration-none cursor-pointer hover:text-[#3353e4]"
                    >Volver al inicio</a
                  ></u>
              </div>
            </form>
          </div>
          <!-- Cierre de space-y-8 -->
        </div>
        <!-- Cierre de bg-white rounded-2xl -->

        <!-- Footer mínimo para auth -->
        <div class="text-center mt-8 mb-8 px-4">
          <p class="text-sm text-gray-500 leading-relaxed">
            © 2025 Tambo Delivery. Todos los derechos reservados.
          </p>
        </div>
      </div>
      <!-- Cierre de contenedor principal -->

      <!-- Elementos decorativos -->
      <div
        class="absolute top-10 left-10 w-20 h-20 bg-[#a81b8d]/20 rounded-full blur-xl"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-xl"
      ></div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/registro']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  loginWithGoogle(): void {
    // Redirigir al endpoint de OAuth2 de Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  navigateToHome(): void {
    this.router.navigate(['/inicio']);
  }
}
