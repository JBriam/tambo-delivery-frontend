import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
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

        <!-- Formulario de registro -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="max-w-md w-full space-y-8">
            <div>
              <h2
                class="mt-6 text-center text-3xl font-extrabold text-gray-900"
              >
                Crear Cuenta
              </h2>
            </div>
            <form
              class="mt-8 space-y-6"
              [formGroup]="registerForm"
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
                    for="firstName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Nombres
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    formControlName="firstName"
                    required
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    for="lastName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Apellidos
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    formControlName="lastName"
                    required
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Tu apellido"
                  />
                </div>

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
                </div>

                <div>
                  <label
                    for="phoneNumber"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Teléfono (opcional)
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    formControlName="phoneNumber"
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="+51 999 999 999"
                  />
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
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    formControlName="confirmPassword"
                    required
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirma tu contraseña"
                  />
                  @if (registerForm.get('confirmPassword')?.invalid &&
                  registerForm.get('confirmPassword')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Las contraseñas no coinciden
                  </p>
                  }
                </div>
              </div>

              <!-- Botón de envío -->
              <button
                type="submit"
                class="bg-[#667eea] inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-[#3353e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full cursor-pointer"
                [disabled]="isLoading || registerForm.invalid"
              >
                <span *ngIf="!isLoading">Crear cuenta</span>
                <span *ngIf="isLoading">Cargando...</span>
              </button>

              <!-- Separador -->
              <div class="flex items-center">
                <div class="flex-grow border-t border-gray-300"></div>
                <span class="mx-4 text-gray-400 text-sm">o</span>
                <div class="flex-grow border-t border-gray-300"></div>
              </div>

              <!-- Login con Google -->
              <button
                type="button"
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
                  ¿Ya tienes una cuenta?
                  <a
                    (click)="navigateToLogin()"
                    class="text-[#667eea] text-sm text-decoration-none cursor-pointer hover:text-[#3353e4]"
                    >Inicia sesión</a
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (error: any) => {
          this.errorMessage =
            error.error?.message || 'Error al crear la cuenta';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/inicio']);
  }
}
