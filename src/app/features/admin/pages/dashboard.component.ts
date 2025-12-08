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
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50"
    >
      <div class="p-6 max-w-7xl mx-auto">
        <!-- Welcome Message with enhanced design -->
        @if (currentUser) {
        <div class="mb-8">
          <div
            class="bg-gradient-to-r from-[#a81b8d] to-[#8a1574] rounded-2xl p-8 text-white shadow-xl"
          >
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold mb-2">
                  ¡Bienvenido, {{ currentUser.firstName }}!
                </h1>
                <p class="text-white/90 text-lg">
                  Panel de control - Tambo Delivery
                </p>
              </div>
              <div class="hidden md:block">
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <svg
                    class="w-16 h-16 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        }

        <!-- Loading state -->
        @if (isLoading) {
        <div class="flex justify-center items-center py-20">
          <div class="text-center">
            <div
              class="animate-spin rounded-full h-16 w-16 border-4 border-[#a81b8d] border-t-transparent mx-auto mb-4"
            ></div>
            <p class="text-gray-600">Cargando datos...</p>
          </div>
        </div>
        } @else {

        <!-- Stats Cards with enhanced design -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-800 mb-1">
                {{ stats.ordersToday }}
              </p>
              <p class="text-gray-500 text-sm font-medium">Pedidos Hoy</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <span class="text-xs text-green-600 font-semibold">↑ Activo</span>
            </div>
          </div>

          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-800 mb-1">
                S/.
                {{
                  stats.salesToday.toLocaleString('es-PE', {
                    minimumFractionDigits: 2
                  })
                }}
              </p>
              <p class="text-gray-500 text-sm font-medium">Ventas Hoy</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <span class="text-xs text-green-600 font-semibold">↑ +12.5%</span>
            </div>
          </div>

          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-800 mb-1">
                {{ stats.totalUsers.toLocaleString() }}
              </p>
              <p class="text-gray-500 text-sm font-medium">Clientes Totales</p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <span class="text-xs text-blue-600 font-semibold"
                >↑ +8 nuevos</span
              >
            </div>
          </div>

          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                class="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg"
              >
                <svg
                  class="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
              </div>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-800 mb-1">
                {{ stats.totalProducts }}
              </p>
              <p class="text-gray-500 text-sm font-medium">
                Productos en Catálogo
              </p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <span class="flex gap-1 text-xs text-orange-600 font-semibold">
                <svg width="1em" height="1em" viewBox="0 0 2048 2048" class="mt-0.5">
                  <path
                    fill="currentColor"
                    d="m960 120l832 416v1040l-832 415l-832-415V536zm625 456L960 264L719 384l621 314zM960 888l238-118l-622-314l-241 120zM256 680v816l640 320v-816zm768 1136l640-320V680l-640 320z"
                  />
                </svg>
                En stock
              </span>
            </div>
          </div>
        </div>
        <!-- Quick Actions with enhanced design -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="lg:col-span-2">
            <div
              class="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div class="flex items-center mb-6">
                <div class="p-2 bg-[#a81b8d]/10 rounded-lg mr-3">
                  <svg
                    class="w-6 h-6 text-[#a81b8d]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800">
                  Acciones Rápidas
                </h2>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  (click)="navigateToProducts()"
                  class="group p-5 text-center bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#a81b8d] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    class="mb-3 p-3 bg-orange-100 rounded-xl mx-auto w-fit group-hover:bg-[#a81b8d] transition-colors duration-300"
                  >
                    <svg
                      class="w-7 h-7 text-orange-600 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      ></path>
                    </svg>
                  </div>
                  <p
                    class="text-sm font-semibold text-gray-700 group-hover:text-[#a81b8d] transition-colors duration-300"
                  >
                    Productos
                  </p>
                </button>
                <button
                  (click)="navigateToOrders()"
                  class="group p-5 text-center bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#a81b8d] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    class="mb-3 p-3 bg-blue-100 rounded-xl mx-auto w-fit group-hover:bg-[#a81b8d] transition-colors duration-300"
                  >
                    <svg
                      class="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <p
                    class="text-sm font-semibold text-gray-700 group-hover:text-[#a81b8d] transition-colors duration-300"
                  >
                    Pedidos
                  </p>
                </button>
                <button
                  (click)="navigateToUsers()"
                  class="group p-5 text-center bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#a81b8d] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    class="mb-3 p-3 bg-purple-100 rounded-xl mx-auto w-fit group-hover:bg-[#a81b8d] transition-colors duration-300"
                  >
                    <svg
                      class="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                  </div>
                  <p
                    class="text-sm font-semibold text-gray-700 group-hover:text-[#a81b8d] transition-colors duration-300"
                  >
                    Usuarios
                  </p>
                </button>
                <button
                  (click)="navigateToCategories()"
                  class="group p-5 text-center bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-[#a81b8d] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    class="mb-3 p-3 bg-green-100 rounded-xl mx-auto w-fit group-hover:bg-[#a81b8d] transition-colors duration-300"
                  >
                    <svg
                      class="w-7 h-7 text-green-600 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      ></path>
                    </svg>
                  </div>
                  <p
                    class="text-sm font-semibold text-gray-700 group-hover:text-[#a81b8d] transition-colors duration-300"
                  >
                    Categorías
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div>
            <div
              class="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg
                      class="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-bold text-gray-800">
                    Pedidos Recientes
                  </h2>
                </div>
                <button
                  (click)="navigateToOrders()"
                  class="text-[#a81b8d] hover:text-[#8a1574] text-sm font-semibold transition-colors duration-200 cursor-pointer"
                >
                  Ver todos →
                </button>
              </div>
              @if (recentOrders.length > 0) {
              <div class="space-y-3">
                @for (order of recentOrders; track order.id) {
                <div
                  class="group flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl hover:shadow-md hover:border-[#a81b8d]/30 transition-all duration-300"
                >
                  <div class="flex items-center space-x-4">
                    <div
                      class="w-12 h-12 bg-gradient-to-br from-[#a81b8d] to-[#8a1574] rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                    >
                      <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p
                        class="font-bold text-gray-800 group-hover:text-[#a81b8d] transition-colors duration-200"
                      >
                        #{{ order.id.substring(0, 8) }}...
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ order.user?.firstName }} {{ order.user?.lastName }}
                      </p>
                    </div>
                  </div>
                  <span
                    class="px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                    [ngClass]="getOrderStatusClass(order.orderStatus)"
                  >
                    {{ getOrderStatusText(order.orderStatus) }}
                  </span>
                </div>
                }
              </div>
              } @else {
              <div class="text-center py-12">
                <div
                  class="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <svg
                    class="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    ></path>
                  </svg>
                </div>
                <p class="text-gray-500 font-medium">
                  No hay pedidos recientes
                </p>
                <p class="text-sm text-gray-400 mt-1">
                  Los nuevos pedidos aparecerán aquí
                </p>
              </div>
              }
            </div>
          </div>
        </div>
        }
        <!-- Cierre del @else -->
      </div>
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading = false;

  // Dashboard statistics
  stats = {
    ordersToday: 0,
    salesToday: 0,
    totalProducts: 0,
    totalUsers: 0,
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
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Verifica si el usuario actual es administrador
   */
  private checkAdminAccess(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;

        // Verificar si el usuario es admin
        if (
          !user ||
          !user.authorities?.some((auth) => auth.authority === 'ADMIN')
        ) {
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
      allOrders: this.orderService.getAllOrders(),
    }).subscribe({
      next: (data) => {
        // Actualizar estadísticas
        this.stats = {
          ordersToday: data.orderStats.ordersToday || 0,
          salesToday: data.orderStats.salesToday || 0,
          totalProducts: data.totalProducts || 0,
          totalUsers: data.totalUsers || 0,
        };

        // Obtener los 3 pedidos más recientes
        this.recentOrders = data.allOrders
          .sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
          .slice(0, 3);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      },
    });
  }

  /**
   * Obtiene la clase CSS para el estado del pedido
   */
  getOrderStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      CONFIRMED: 'bg-blue-100 text-blue-800 border border-blue-200',
      PREPARING: 'bg-purple-100 text-purple-800 border border-purple-200',
      OUT_FOR_DELIVERY:
        'bg-orange-100 text-orange-800 border border-orange-200',
      DELIVERED: 'bg-green-100 text-green-800 border border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border border-red-200',
    };
    return (
      statusClasses[status] ||
      'bg-gray-100 text-gray-800 border border-gray-200'
    );
  }

  /**
   * Obtiene el texto del estado del pedido
   */
  getOrderStatusText(status: string): string {
    const statusTexts: Record<string, string> = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmado',
      PREPARING: 'En Preparación',
      OUT_FOR_DELIVERY: 'En Camino',
      DELIVERED: 'Entregado',
      CANCELLED: 'Cancelado',
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

  /**
   * Navega a la gestión de categorías
   */
  navigateToCategories(): void {
    this.router.navigate(['/admin/categories']);
  }
}
