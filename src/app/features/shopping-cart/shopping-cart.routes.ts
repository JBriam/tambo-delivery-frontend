import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shopping-cart.component').then(c => c.ShoppingCartComponent)
  },
  {
    path: 'direccion',
    loadComponent: () => import('./pages/delivery-address.component').then(c => c.DeliveryAddressComponent)
  },
  {
    path: 'pago',
    loadComponent: () => import('./pages/payment-method.component').then(c => c.PaymentMethodComponent)
  },
  {
    path: 'confirmacion',
    loadComponent: () => import('./pages/order-confirmation.component').then(c => c.OrderConfirmationComponent)
  },
  {
    path: 'resumen',
    loadComponent: () => import('./pages/order-summary.component').then(c => c.OrderSummaryComponent)
  }
];
