import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/shopping-cart.component').then(c => c.ShoppingCartComponent)
  }
];
