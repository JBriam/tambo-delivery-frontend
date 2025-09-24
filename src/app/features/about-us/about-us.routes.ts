import { Routes } from '@angular/router';

export const ABOUT_US_ROUTES: Routes = [
  {
    path: 'legales',
    loadComponent: () => import('./pages/legales.component').then(c => c.LegalesComponent)
  },
  // TODO: Crear estos componentes según necesites
  // {
  //   path: 'terminos',
  //   loadComponent: () => import('./pages/terminos.component').then(c => c.TerminosComponent)
  // },
  // {
  //   path: 'zonas-despacho',
  //   loadComponent: () => import('./pages/zonas-despacho.component').then(c => c.ZonasDespachoComponent)
  // },
  // {
  //   path: 'comprobantes',
  //   loadComponent: () => import('./pages/comprobantes.component').then(c => c.ComprobantesComponent)
  // },
  // {
  //   path: 'privacidad',
  //   loadComponent: () => import('./pages/privacidad.component').then(c => c.PrivacidadComponent)
  // },
  // {
  //   path: 'contacto',
  //   loadComponent: () => import('./pages/contacto.component').then(c => c.ContactoComponent)
  // },
  // Ruta por defecto para /about-us
  {
    path: '',
    redirectTo: 'legales',
    pathMatch: 'full'
  }
];
