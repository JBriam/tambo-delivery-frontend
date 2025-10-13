import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shopping-cart.component').then(c => c.ShoppingCartComponent)
  },
  {
    path: 'direccion',
    loadComponent: () => import('./pages/delivery-address.component').then(c => c.DeliveryAddressComponent),
    canActivate: [AuthGuard] // Requiere autenticación
  },
  {
    path: 'pago',
    loadComponent: () => import('./pages/payment-method.component').then(c => c.PaymentMethodComponent),
    canActivate: [AuthGuard] // Requiere autenticación
  },
  {
    path: 'confirmacion',
    loadComponent: () => import('./pages/order-confirmation.component').then(c => c.OrderConfirmationComponent),
    canActivate: [AuthGuard] // Requiere autenticación
  },
  {
    path: 'resumen',
    loadComponent: () => import('./pages/order-summary.component').then(c => c.OrderSummaryComponent),
    canActivate: [AuthGuard] // Requiere autenticación
  }
];
