import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor temporal para rutas públicas
 * 
 * Este interceptor elimina el token JWT de las peticiones a rutas públicas
 * para evitar errores 401 mientras se configura correctamente el backend
 */

// Rutas que deben ser públicas (sin JWT)
const publicRoutes = [
  '/api/public/product',        // Productos públicos
  '/api/public/category',       // Categorías públicas  
  '/api/public/test'            // Endpoint de prueba
];

export const publicApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Verificar si la URL contiene una ruta pública
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
  
  if (isPublicRoute) {
    console.log('🔓 [PublicApiInterceptor] Removiendo Authorization header de:', req.url);
    
    // Crear una nueva request sin el header Authorization
    const publicReq = req.clone({
      setHeaders: {
        // No incluir Authorization header
      }
    });
    
    // Eliminar el header Authorization si existe
    if (req.headers.has('Authorization')) {
      const headersToKeep: { [key: string]: string } = {};
      req.headers.keys().forEach(key => {
        if (key.toLowerCase() !== 'authorization') {
          const value = req.headers.get(key);
          if (value) {
            headersToKeep[key] = value;
          }
        }
      });
      
      const cleanReq = req.clone({
        setHeaders: headersToKeep
      });
      
      return next(cleanReq);
    }
    
    return next(publicReq);
  }
  
  // Para rutas no públicas, continuar normal
  return next(req);
};