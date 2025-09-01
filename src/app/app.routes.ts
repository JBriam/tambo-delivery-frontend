import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta principal - redirige a productos
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  
  // Rutas de autenticación (lazy loading)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  
  // Rutas de productos (lazy loading)
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(r => r.PRODUCTS_ROUTES)
  },
  
  // Rutas de carrito de compras
  {
    path: 'cart',
    loadChildren: () => import('./features/shopping-cart/shopping-cart.routes').then(r => r.CART_ROUTES),
    canActivate: [AuthGuard]
  },
  
  // Rutas de pedidos
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then(r => r.ORDERS_ROUTES),
    canActivate: [AuthGuard]
  },
  
  // Rutas de perfil de usuario
  {
    path: 'profile',
    loadChildren: () => import('./features/user-profile/user-profile.routes').then(r => r.PROFILE_ROUTES),
    canActivate: [AuthGuard]
  },
  
  // Ruta 404
  {
    path: '**',
    redirectTo: '/products'
  }
];
