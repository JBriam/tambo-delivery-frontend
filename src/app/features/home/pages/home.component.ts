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
      <div class="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
        <!-- Contenedor de slider -->
        <div class="relative w-full h-full">
          <!-- Slides -->
          <div 
            class="flex transition-transform duration-500 ease-in-out h-full"
            [style.transform]="'translateX(-' + (currentSlide * 100) + '%)'"
          >
            <div 
              *ngFor="let image of sliderImages; let i = index" 
              class="w-full h-full flex-shrink-0"
            >
              <!-- Desktop -->
              <img 
                [src]="image.desktop"
                [alt]="image.alt"
                class="w-full h-full object-cover hidden md:block"
                loading="lazy"
              >
              <!-- Mobile -->
              <img 
                [src]="image.mobile"
                [alt]="image.alt"
                class="w-full h-full object-cover block md:hidden"
                loading="lazy"
              >
            </div>
          </div>

          <!-- Flechas de navegación -->
          <button 
            (click)="previousSlide()"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10 cursor-pointer"
            aria-label="Imagen anterior"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button 
            (click)="nextSlide()"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10 cursor-pointer"
            aria-label="Siguiente imagen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Indicadores -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
              *ngFor="let image of sliderImages; let i = index"
              (click)="goToSlide(i)"
              [class]="'w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ' + (currentSlide === i ? 'bg-gray-800' : '')"
              [style.backgroundColor]="currentSlide !== i ? 'rgba(236,239,244, 0.4)' : ''"
              [style.hover]="currentSlide !== i ? 'background-color: rgba(107, 114, 128, 0.8)' : ''"
              [attr.aria-label]="'Ir a imagen ' + (i + 1)"
            ></button>
          </div>

          <!-- Controles de auto-reproducción -->
            <button
            (click)="toggleAutoPlay()"
            class="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300 z-10 cursor-pointer"
            [attr.aria-label]="isAutoPlaying ? 'Pausar slider' : 'Reproducir slider'"
          >
            <svg *ngIf="isAutoPlaying" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"></path>
            </svg>
            <svg *ngIf="!isAutoPlaying" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-6a1 1 0 011-1h4a1 1 0 011 1v6"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-white py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué elegir Tambo Delivery?
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Entrega Rápida</h3>
              <p class="text-gray-600">Recibe tus pedidos en tiempo récord con nuestro sistema de entrega optimizado.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Calidad Garantizada</h3>
              <p class="text-gray-600">Productos frescos y de la mejor calidad, seleccionados especialmente para ti.</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Mejores Precios</h3>
              <p class="text-gray-600">Ofertas competitivas y descuentos especiales para nuestros clientes.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-blue-600 py-16">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">
            ¿Listo para hacer tu primer pedido?
          </h2>
          <p class="text-blue-100 mb-8 text-lg">
            Únete a miles de clientes satisfechos y descubre la comodidad de Tambo Delivery.
          </p>
          <a 
            routerLink="/auth/login" 
            class="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition duration-300 inline-block font-semibold"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
  `,
  styles: []
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
      alt: 'Banner promocional 1'
    },
    {
      desktop: 'assets/slider/banner-02-desktop.webp',
      mobile: 'assets/slider/banner-02-mobile.webp',
      alt: 'Banner promocional 2'
    },
    {
      desktop: 'assets/slider/banner-03-desktop.webp',
      mobile: 'assets/slider/banner-03-mobile.webp',
      alt: 'Banner promocional 3'
    },
    {
      desktop: 'assets/slider/banner-04-desktop.webp',
      mobile: 'assets/slider/banner-04-mobile.webp',
      alt: 'Banner promocional 4'
    },
    {
      desktop: 'assets/slider/banner-05-desktop.webp',
      mobile: 'assets/slider/banner-05-mobile.webp',
      alt: 'Banner promocional 5'
    },
    {
      desktop: 'assets/slider/banner-06-desktop.webp',
      mobile: 'assets/slider/banner-06-mobile.webp',
      alt: 'Banner promocional 6'
    },
    {
      desktop: 'assets/slider/banner-07-desktop.webp',
      mobile: 'assets/slider/banner-07-mobile.webp',
      alt: 'Banner promocional 7'
    },
    {
      desktop: 'assets/slider/banner-08-desktop.webp',
      mobile: 'assets/slider/banner-08-mobile.webp',
      alt: 'Banner promocional 8'
    },
    {
      desktop: 'assets/slider/banner-09-desktop.webp',
      mobile: 'assets/slider/banner-09-mobile.webp',
      alt: 'Banner promocional 9'
    }
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
    this.currentSlide = this.currentSlide === 0 
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
