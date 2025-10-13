import { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONSTANTS } from '../../constants/app.constants';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Rutas públicas que NO deben llevar JWT
  const publicRoutes = [
    '/api/public/product',        // Productos públicos
    '/api/public/category',       // Categorías públicas
    '/api/public/product-sections', // Secciones de productos
    '/api/public/test'            // Endpoint de prueba
  ];
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
  
  // Obtener el token del localStorage
  const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  
  console.log('🔑 JwtInterceptor: Intercepting request to:', req.url);
  console.log('🔑 JwtInterceptor: Token exists:', !!token);
  console.log('🔑 JwtInterceptor: Is API request:', req.url.includes('/api/'));
  console.log('🔑 JwtInterceptor: Is public route:', isPublicRoute);
  
  // Si es una ruta pública, NO agregar token
  if (isPublicRoute) {
    console.log('🔓 JwtInterceptor: Skipping JWT for public route:', req.url);
    return next(req);
  }
  
  // Si existe un token y la petición es hacia nuestro backend (y no es pública), agregarlo
  if (token && req.url.includes('/api/')) {
    console.log('🔑 JwtInterceptor: Adding JWT token to request:', req.url);
    console.log('🔑 JwtInterceptor: Token preview:', token.substring(0, 20) + '...');
    
    // Clonar la petición y agregar el header de Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('🔑 JwtInterceptor: Request headers after adding token:', authReq.headers.get('Authorization')?.substring(0, 30) + '...');
    return next(authReq);
  } else {
    console.log('🔑 JwtInterceptor: Not adding token - missing token or not API request');
  }
  
  return next(req);
};