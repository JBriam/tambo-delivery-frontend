import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_ENDPOINTS } from '../../../constants/app.constants';

// Interfaces para las estadísticas del dashboard
export interface DashboardStats {
  ordersToday: number;
  salesToday: number;
  totalProducts: number;
  totalUsers: number;
}

export interface OrderStatistics {
  pending: number;
  confirmed: number;
  preparing: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  salesToday: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'user' | 'alert';
  message: string;
  timestamp: Date;
  severity?: 'info' | 'warning' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly baseUrl = API_ENDPOINTS.BASE_URL;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las estadísticas generales del dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    // Usar el método de OrderService que ahora calcula estadísticas en el frontend
    return this.http.get<any>(`${this.baseUrl}/admin/orders`)
      .pipe(
        map((orders: any[]) => {
          const today = new Date().toDateString();
          const todayOrders = orders.filter((order: any) => 
            new Date(order.orderDate).toDateString() === today
          );
          
          return {
            ordersToday: todayOrders.length,
            salesToday: todayOrders
              .filter((o: any) => o.orderStatus === 'DELIVERED')
              .reduce((sum: number, order: any) => sum + order.totalAmount, 0),
            totalProducts: 0, // Se llenará con el servicio de productos
            totalUsers: 0 // Se llenará con el servicio de usuarios
          };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene las estadísticas detalladas de pedidos
   * Nota: Calculado en el frontend ya que el backend no tiene este endpoint
   */
  getOrderStatistics(): Observable<OrderStatistics> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders`)
      .pipe(
        map((orders: any[]) => {
          const today = new Date().toDateString();
          const todayOrders = orders.filter((order: any) => 
            new Date(order.orderDate).toDateString() === today
          );
          
          return {
            pending: orders.filter(o => o.orderStatus === 'PENDING').length,
            confirmed: orders.filter(o => o.orderStatus === 'CONFIRMED').length,
            preparing: orders.filter(o => o.orderStatus === 'PREPARING').length,
            outForDelivery: orders.filter(o => o.orderStatus === 'OUT_FOR_DELIVERY').length,
            delivered: orders.filter(o => o.orderStatus === 'DELIVERED').length,
            cancelled: orders.filter(o => o.orderStatus === 'CANCELLED').length,
            totalOrders: orders.length,
            totalRevenue: orders
              .filter(o => o.orderStatus === 'DELIVERED')
              .reduce((sum, order) => sum + order.totalAmount, 0),
            ordersToday: todayOrders.length,
            salesToday: todayOrders
              .filter(o => o.orderStatus === 'DELIVERED')
              .reduce((sum, order) => sum + order.totalAmount, 0)
          };
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el número total de productos
   */
  getTotalProducts(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.PRODUCTS}`)
      .pipe(
        map(products => products.length),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el número total de usuarios
   */
  getTotalUsers(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS}`)
      .pipe(
        map(users => users.length),
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor';
    } else if (error.status === 401) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.status === 403) {
      errorMessage = 'Acceso denegado';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    console.error('Admin Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
