import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

export const routes: Routes = [
  // Ruta principal - redirige a productos
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  
  // Ruta del home (lazy loading)
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.routes').then(r => r.HOME_ROUTES)
  },

  // Rutas de autenticación (sin header/footer)
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/pages/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/pages/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'auth/verify',
    loadComponent: () => import('./features/auth/pages/verify.component').then(c => c.VerifyComponent)
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full'
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
    //canActivate: [AuthGuard]
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

  // Rutas de administración
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES),
    canActivate: [AuthGuard]
  },

  // Rutas de about-us (dual loading para URLs limpias)
  {
    path: 'about-us',
    loadChildren: () => import('./features/about-us/about-us.routes').then(r => r.ABOUT_US_ROUTES)
  },

  // Rutas directas para páginas del footer (acceso directo con URLs limpias)
  {
    path: 'legals',
    loadComponent: () => import('./features/about-us/pages/legales.component').then(c => c.LegalesComponent)
  },
  // TODO: Agregar estas rutas cuando crees los componentes:
  // {
  //   path: 'terminos',
  //   loadComponent: () => import('./features/about-us/pages/terminos.component').then(c => c.TerminosComponent)
  // },
  // {
  //   path: 'zonas-despacho',
  //   loadComponent: () => import('./features/about-us/pages/zonas-despacho.component').then(c => c.ZonasDespachoComponent)
  // },
  // {
  //   path: 'comprobantes',
  //   loadComponent: () => import('./features/about-us/pages/comprobantes.component').then(c => c.ComprobantesComponent)
  // },
  // {
  //   path: 'privacidad',
  //   loadComponent: () => import('./features/about-us/pages/privacidad.component').then(c => c.PrivacidadComponent)
  // },
  // {
  //   path: 'contacto',
  //   loadComponent: () => import('./features/about-us/pages/contacto.component').then(c => c.ContactoComponent)
  // },
  
  // Ruta 404
  {
    path: '**',
    redirectTo: '/productos'
  }
];
