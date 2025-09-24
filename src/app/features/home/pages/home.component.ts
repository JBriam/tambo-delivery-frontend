import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface SliderImage {
  desktop: string;
  mobile: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <!-- Slider -->
      <div class="relative w-full overflow-hidden">
        <!-- Contenedor de slider -->
        <div class="relative w-full">
          <!-- Slides -->
          <div
            class="flex transition-transform duration-500 ease-in-out"
            [style.transform]="'translateX(-' + currentSlide * 100 + '%)'"
          >
            <div
              *ngFor="let image of sliderImages; let i = index"
              class="w-full flex-shrink-0 bg-gray-100"
            >
              <!-- Desktop -->
              <img
                [src]="image.desktop"
                [alt]="image.alt"
                class="w-full h-auto object-contain hidden md:block"
                [loading]="i === 0 ? 'eager' : 'lazy'"
              />
              <!-- Mobile -->
              <img
                [src]="image.mobile"
                [alt]="image.alt"
                class="w-full h-auto object-contain block md:hidden"
                [loading]="i === 0 ? 'eager' : 'lazy'"
              />
            </div>
          </div>

          <!-- Flechas de navegación -->
          <button
            (click)="previousSlide()"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 border-2 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white text-gray-700 p-2 rounded-full transition-all duration-500 z-10 cursor-pointer shadow-lg backdrop-blur-sm"
            aria-label="Imagen anterior"
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            (click)="nextSlide()"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 border-2 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white text-gray-700 p-2 rounded-full transition-all duration-500 z-10 cursor-pointer shadow-lg backdrop-blur-sm"
            aria-label="Siguiente imagen"
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
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          <!-- Indicadores (puntos) -->
          <div
            class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2"
          >
            <button
              *ngFor="let image of sliderImages; let i = index"
              (click)="goToSlide(i)"
              [class]="
                'w-3 h-3 rounded-full transition-all duration-500 cursor-pointer border-2 ' +
                (currentSlide === i
                  ? 'bg-[#a81b8d] border-[#a81b8d] shadow-lg shadow-[#a81b8d]/50 scale-125'
                  : 'bg-white/90 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d]/20 hover:scale-110')
              "
              [attr.aria-label]="'Ir a imagen ' + (i + 1)"
            ></button>
          </div>

          <!-- Controles de auto-reproducción (pause/stop) -->
          <button
            (click)="toggleAutoPlay()"
            class="absolute top-4 right-4 bg-white/90 border-2 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white text-gray-700 p-2 rounded-full transition-all duration-500 z-10 cursor-pointer shadow-lg backdrop-blur-sm"
            [attr.aria-label]="
              isAutoPlaying ? 'Pausar slider' : 'Reproducir slider'
            "
          >
            <svg
              *ngIf="isAutoPlaying"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 9v6m4-6v6"
              ></path>
            </svg>
            <svg
              *ngIf="!isAutoPlaying"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-6a1 1 0 011-1h4a1 1 0 011 1v6"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Sección de Productos Destacados -->
      <div class="py-16 lg:py-20">
        <div class="container mx-auto px-4">
          <!-- Header de la sección -->
          <div class="text-center mb-12">
            <h2 class="font-bold text-3xl lg:text-4xl text-center mb-4">
              Nuestros <span class="text-[#a81b8d]">productos</span>
            </h2>
            <p class="text-gray-600 mt-2 max-w-2xl mx-auto text-center text-lg">
              Descubre la mejor calidad y nuestras ofertas disponibles
            </p>
          </div>
          <!-- Aquí puedes agregar un componente o código para mostrar productos destacados -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12"
          ></div>
        </div>
      </div>
      <!-- Features Section -->
      <div class="py-16 lg:py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="font-bold text-3xl lg:text-4xl text-center">
              ¿Qué nos hace <span class="text-yellow-500">diferentes</span>?
            </h2>
            <p class="text-gray-500 mt-2 max-w-2xl mx-auto text-center">
              Descubre las ventajas que hacen de nuestra tienda tu mejor opción
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div
                class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 scale-up"
              >
                <svg
                  class="w-10 h-10 text-blue-600"
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
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Entrega Rápida
              </h3>
              <p class="text-gray-500">
                Recibe tus pedidos en tiempo récord con nuestro sistema de
                entrega optimizado.
              </p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 scale-up"
              >
                <svg
                  class="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Calidad Garantizada
              </h3>
              <p class="text-gray-500">
                Productos frescos y de la mejor calidad, seleccionados
                especialmente para ti.
              </p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 scale-up"
              >
                <svg
                  class="w-10 h-10 text-purple-600"
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
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Mejores Precios
              </h3>
              <p class="text-gray-500">
                Ofertas competitivas y descuentos especiales para nuestros
                clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Animación de scale-up */
      .scale-up {
        transition: transform 1.2s ease;
      }
      .scale-up:hover {
        transform: scale(1.2);
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  isAutoPlaying = true;
  private autoPlayInterval: any;
  private readonly autoPlayDelay = 4000; // 4 segundos

  sliderImages: SliderImage[] = [
    {
      desktop: 'assets/slider/banner-01-desktop.webp',
      mobile: 'assets/slider/banner-01-mobile.webp',
      alt: 'Banner promocional 1',
    },
    {
      desktop: 'assets/slider/banner-02-desktop.webp',
      mobile: 'assets/slider/banner-02-mobile.webp',
      alt: 'Banner promocional 2',
    },
    {
      desktop: 'assets/slider/banner-03-desktop.webp',
      mobile: 'assets/slider/banner-03-mobile.webp',
      alt: 'Banner promocional 3',
    },
    {
      desktop: 'assets/slider/banner-04-desktop.webp',
      mobile: 'assets/slider/banner-04-mobile.webp',
      alt: 'Banner promocional 4',
    },
    {
      desktop: 'assets/slider/banner-05-desktop.webp',
      mobile: 'assets/slider/banner-05-mobile.webp',
      alt: 'Banner promocional 5',
    },
    {
      desktop: 'assets/slider/banner-06-desktop.webp',
      mobile: 'assets/slider/banner-06-mobile.webp',
      alt: 'Banner promocional 6',
    },
  ];

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
  }

  previousSlide(): void {
    this.currentSlide =
      this.currentSlide === 0
        ? this.sliderImages.length - 1
        : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  toggleAutoPlay(): void {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
    this.isAutoPlaying = !this.isAutoPlaying;
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}
