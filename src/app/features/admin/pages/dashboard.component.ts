import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProductService } from '../../products/services/product.service';
import { OrderService } from '../../orders/services/order.service';
import { AdminService } from '../services/admin.service';
import { User } from '../../../models/user.model';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <!-- Welcome Message -->
      @if (currentUser) {
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido, {{ currentUser.firstName }}!</h1>
          <p class="text-gray-600">Aquí tienes un resumen de la actividad de Tambo Delivery</p>
        </div>
      }

      <!-- Loading state -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else {

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.ordersToday }}</p>
              <p class="text-gray-600 text-sm">Pedidos Hoy</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 mr-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">S/. {{ stats.salesToday.toLocaleString() }}</p>
              <p class="text-gray-600 text-sm">Ventas Hoy</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 mr-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.totalUsers.toLocaleString() }}</p>
              <p class="text-gray-600 text-sm">Clientes</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 mr-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ stats.totalProducts }}</p>
              <p class="text-gray-600 text-sm">Productos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button (click)="navigateToProducts()" class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#a81b8d] transition-all duration-200">
                <div class="text-2xl mb-2">📦</div>
                <p class="text-sm font-medium text-gray-700">Gestionar Productos</p>
              </button>
              <button (click)="navigateToOrders()" class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#a81b8d] transition-all duration-200">
                <div class="text-2xl mb-2">📋</div>
                <p class="text-sm font-medium text-gray-700">Ver Pedidos</p>
              </button>
              <button (click)="navigateToUsers()" class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#a81b8d] transition-all duration-200">
                <div class="text-2xl mb-2">👥</div>
                <p class="text-sm font-medium text-gray-700">Gestionar Usuarios</p>
              </button>
              <button class="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#a81b8d] transition-all duration-200">
                <div class="text-2xl mb-2">📊</div>
                <p class="text-sm font-medium text-gray-700">Reportes</p>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Pedidos Recientes</h2>
            @if (recentOrders.length > 0) {
              <div class="space-y-3">
                @for (order of recentOrders; track order.id) {
                  <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p class="font-medium text-gray-800">#{{ order.id }}</p>
                      <p class="text-sm text-gray-600">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
                    </div>
                    <span 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="getOrderStatusClass(order.orderStatus)"
                    >
                      {{ getOrderStatusText(order.orderStatus) }}
                    </span>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center text-gray-500 py-4">
                <p>No hay pedidos recientes</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
        <div class="space-y-3">
          <div class="flex items-start p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r">
            <div class="mr-3 mt-1">
              <span class="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
            </div>
            <div>
              <p class="text-sm text-gray-800"><strong>Nuevo pedido:</strong> Juan Pérez realizó un pedido por S/. 85.50</p>
              <p class="text-xs text-gray-500 mt-1">Hace 5 minutos</p>
            </div>
          </div>
          <div class="flex items-start p-4 border-l-4 border-green-500 bg-green-50 rounded-r">
            <div class="mr-3 mt-1">
              <span class="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            </div>
            <div>
              <p class="text-sm text-gray-800"><strong>Producto añadido:</strong> "Leche Deslactosada 1L" fue agregado al catálogo</p>
              <p class="text-xs text-gray-500 mt-1">Hace 15 minutos</p>
            </div>
          </div>
          <div class="flex items-start p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r">
            <div class="mr-3 mt-1">
              <span class="w-2 h-2 bg-yellow-500 rounded-full inline-block"></span>
            </div>
            <div>
              <p class="text-sm text-gray-800"><strong>Stock bajo:</strong> "Pan Integral" tiene menos de 10 unidades</p>
              <p class="text-xs text-gray-500 mt-1">Hace 30 minutos</p>
            </div>
          </div>
        </div>
      </div>
      } <!-- Cierre del @else -->
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading = false;
  
  // Dashboard statistics
  stats = {
    ordersToday: 0,
    salesToday: 0,
    totalProducts: 0,
    totalUsers: 0
  };

  // Pedidos recientes
  recentOrders: Order[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  private checkAdminAccess(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        
        // Verificar si el usuario es admin
        if (!user || !user.authorities?.some(auth => auth.authority === 'ADMIN')) {
          this.router.navigate(['/']);
        }
      })
    );
  }

  /**
   * Carga los datos del dashboard
   */
  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Cargar todas las estadísticas en paralelo
    forkJoin({
      orderStats: this.adminService.getOrderStatistics(),
      totalProducts: this.adminService.getTotalProducts(),
      totalUsers: this.adminService.getTotalUsers(),
      allOrders: this.orderService.getAllOrders()
    }).subscribe({
      next: (data) => {
        // Actualizar estadísticas
        this.stats = {
          ordersToday: data.orderStats.ordersToday || 0,
          salesToday: data.orderStats.salesToday || 0,
          totalProducts: data.totalProducts || 0,
          totalUsers: data.totalUsers || 0
        };

        // Obtener los 3 pedidos más recientes
        this.recentOrders = data.allOrders
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 3);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Obtiene la clase CSS para el estado del pedido
   */
  getOrderStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'CONFIRMED': 'bg-blue-100 text-blue-700',
      'PREPARING': 'bg-purple-100 text-purple-700',
      'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-700',
      'DELIVERED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-700';
  }

  /**
   * Obtiene el texto del estado del pedido
   */
  getOrderStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmado',
      'PREPARING': 'En Preparación',
      'OUT_FOR_DELIVERY': 'En Camino',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return statusTexts[status] || status;
  }

  /**
   * Navega a la gestión de productos
   */
  navigateToProducts(): void {
    this.router.navigate(['/admin/products']);
  }

  /**
   * Navega a la gestión de marcas
   */
  navigateToBrands(): void {
    this.router.navigate(['/admin/brands']);
  }

  /**
   * Navega a la gestión de órdenes
   */
  navigateToOrders(): void {
    this.router.navigate(['/admin/orders']);
  }

  /**
   * Navega a la gestión de usuarios
   */
  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }
}
