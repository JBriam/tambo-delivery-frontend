import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button.component';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'digital' | 'cash';
  icon: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-6">
        <ol class="flex items-center space-x-2">
          <li><a (click)="goToCart()" class="text-[#a81b8d] hover:underline cursor-pointer">Carrito</a></li>
          <li class="text-gray-400">/</li>
          <li><a (click)="goToAddress()" class="text-[#a81b8d] hover:underline cursor-pointer">Dirección de entrega</a></li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600 font-medium">Método de pago</li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-400">Confirmación</li>
        </ol>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">¿Cómo quieres pagar?</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda: Métodos de pago -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Métodos de pago disponibles -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Selecciona tu método de pago</h2>
            
            <div class="space-y-3">
              @for (method of paymentMethods; track method.id) {
                <div 
                  class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                  [class.border-[#a81b8d]]="selectedPaymentMethod === method.id && method.enabled"
                  [class.bg-purple-50]="selectedPaymentMethod === method.id && method.enabled"
                  [class.border-gray-200]="selectedPaymentMethod !== method.id || !method.enabled"
                  [class.opacity-50]="!method.enabled"
                  [class.cursor-not-allowed]="!method.enabled"
                  (click)="method.enabled ? selectPaymentMethod(method.id) : null"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        [checked]="selectedPaymentMethod === method.id"
                        [disabled]="!method.enabled"
                        class="text-[#a81b8d] focus:ring-[#a81b8d] disabled:opacity-50"
                        readonly
                      />
                      <img [src]="method.icon" [alt]="method.name" class="h-8 w-auto" />
                      <div>
                        <h3 class="font-medium text-gray-900">{{ method.name }}</h3>
                        <p class="text-sm text-gray-600">{{ method.description }}</p>
                      </div>
                    </div>
                    @if (!method.enabled) {
                      <span class="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">Próximamente</span>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
          
          <!-- Formulario de tarjeta (si se selecciona tarjeta) -->
          @if (selectedPaymentMethod === 'card') {
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de la tarjeta</h3>
              
              <form [formGroup]="cardForm" class="space-y-4">
                <!-- Número de tarjeta -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Número de tarjeta *
                  </label>
                  <input
                    type="text"
                    formControlName="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                    (input)="formatCardNumber($event)"
                  />
                  @if (cardForm.get('cardNumber')?.touched && cardForm.get('cardNumber')?.errors?.['required']) {
                    <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                  }
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Fecha de vencimiento -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Vencimiento *
                    </label>
                    <input
                      type="text"
                      formControlName="expiryDate"
                      placeholder="MM/YY"
                      maxlength="5"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                      (input)="formatExpiryDate($event)"
                    />
                    @if (cardForm.get('expiryDate')?.touched && cardForm.get('expiryDate')?.errors?.['required']) {
                      <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                    }
                  </div>
                  
                  <!-- CVV -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      formControlName="cvv"
                      placeholder="123"
                      maxlength="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                    />
                    @if (cardForm.get('cvv')?.touched && cardForm.get('cvv')?.errors?.['required']) {
                      <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                    }
                  </div>
                </div>
                
                <!-- Nombre del titular -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del titular *
                  </label>
                  <input
                    type="text"
                    formControlName="cardHolderName"
                    placeholder="Como aparece en la tarjeta"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                  />
                  @if (cardForm.get('cardHolderName')?.touched && cardForm.get('cardHolderName')?.errors?.['required']) {
                    <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                  }
                </div>
                
                <!-- Guardar tarjeta -->
                <div class="flex items-center">
                  <input
                    id="saveCard"
                    type="checkbox"
                    formControlName="saveCard"
                    class="rounded border-gray-300 text-[#a81b8d] focus:ring-[#a81b8d]"
                  />
                  <label for="saveCard" class="ml-2 text-sm text-gray-700">
                    Guardar esta tarjeta para futuras compras
                  </label>
                </div>
              </form>
            </div>
          }
          
          <!-- Información para pagos digitales -->
          @if (selectedPaymentMethod === 'yape' || selectedPaymentMethod === 'plin') {
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <h4 class="font-medium text-blue-900">Instrucciones de pago</h4>
                  <p class="text-sm text-blue-800 mt-1">
                    Al confirmar tu pedido, serás redirigido a la aplicación de {{ getPaymentMethodName(selectedPaymentMethod) }} 
                    para completar el pago de forma segura.
                  </p>
                </div>
              </div>
            </div>
          }
        </div>
        
        <!-- Columna derecha: Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
            
            <!-- Dirección de entrega -->
            <div class="mb-4 pb-4 border-b border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Dirección de entrega</h4>
              <p class="text-sm text-gray-600">Av. Javier Prado 1234</p>
              <p class="text-sm text-gray-600">San Isidro</p>
              <button (click)="goToAddress()" class="text-xs text-[#a81b8d] hover:underline mt-1">
                Cambiar dirección
              </button>
            </div>
            
            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">S/ 42.90</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Costo de envío</span>
                <span class="font-medium text-green-600">Gratis</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">IGV (18%)</span>
                <span class="font-medium">S/ 7.72</span>
              </div>
            </div>
            
            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-[#a81b8d]">S/ 50.62</span>
              </div>
            </div>
            
            <!-- Seguridad -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div class="flex items-center space-x-2">
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-green-800">Pago 100% seguro</p>
                  <p class="text-xs text-green-700">Protegemos tu información</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botones de navegación -->
      <div class="mt-8 flex justify-between">
        <app-button
          [config]="{
            text: 'Volver a dirección',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="goToAddress()"
        />
        
        <app-button
          [config]="{
            text: 'Confirmar pedido',
            type: 'primary',
            size: 'md'
          }"
          (buttonClick)="proceedToConfirmation()"
        />
      </div>
    </div>
  `
})
export class PaymentMethodComponent {
  paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Tarjeta de crédito/débito',
      type: 'card',
      icon: 'assets/icons/logo-tarjeta.png',
      description: 'Visa, MasterCard, American Express',
      enabled: true
    },
    {
      id: 'yape',
      name: 'Yape',
      type: 'digital',
      icon: 'assets/icons/logo-yape.webp',
      description: 'Paga con tu celular de forma rápida',
      enabled: true
    },
    {
      id: 'plin',
      name: 'Plin',
      type: 'digital',
      icon: 'assets/icons/logo-plin.png',
      description: 'Transferencia instantánea',
      enabled: true
    },
    {
      id: 'cash',
      name: 'Efectivo',
      type: 'cash',
      icon: 'assets/icons/logo-cash.png',
      description: 'Paga al recibir tu pedido',
      enabled: false // Deshabilitado por ahora
    }
  ];

  selectedPaymentMethod: string | null = null;
  cardForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required]],
      cardHolderName: ['', [Validators.required]],
      saveCard: [false]
    });
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
    
    // Resetear formulario si cambia de método
    if (methodId !== 'card') {
      this.cardForm.reset();
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
    this.cardForm.patchValue({ cardNumber: value });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.cardForm.patchValue({ expiryDate: value });
  }

  getPaymentMethodName(methodId: string): string {
    const method = this.paymentMethods.find(m => m.id === methodId);
    return method ? method.name : '';
  }

  canProceed(): boolean {
    if (!this.selectedPaymentMethod) {
      return false;
    }

    if (this.selectedPaymentMethod === 'card') {
      return this.cardForm.valid;
    }

    return true;
  }

  goToCart(): void {
    window.location.href = '/carrito';
  }

  goToAddress(): void {
    window.location.href = '/carrito/direccion';
  }

  proceedToConfirmation(): void {
    if (!this.canProceed()) {
      return;
    }

    if (this.selectedPaymentMethod === 'card' && this.cardForm.valid) {
      // TODO: Procesar información de tarjeta
      console.log('Información de tarjeta:', this.cardForm.value);
    }

    // Navegar a confirmación
    window.location.href = '/carrito/confirmacion';
  }
}