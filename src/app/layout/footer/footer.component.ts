import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-xl font-semibold mb-4">Tambo Delivery</h3>
            <p class="text-gray-300">
              Tu plataforma confiable para pedidos en línea con entregas rápidas y seguras.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Enlaces</h4>
            <ul class="space-y-2">
              <li><a routerLink="/home" class="text-gray-300 hover:text-white">Inicio</a></li>
              <li><a routerLink="/products" class="text-gray-300 hover:text-white">Productos</a></li>
              <li><a routerLink="/auth/register" class="text-gray-300 hover:text-white">Registro</a></li>
            </ul>
          </div>
          
          <!-- Customer Service -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Atención al Cliente</h4>
            <ul class="space-y-2">
              <li class="text-gray-300">📞 (01) 123-4567</li>
              <li class="text-gray-300">✉️ info@tambodelivery.com</li>
              <li class="text-gray-300">🕒 Lun-Dom: 8:00-22:00</li>
            </ul>
          </div>
          
          <!-- Social Media -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Síguenos</h4>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" class="text-gray-300 hover:text-white">Instagram</a>
              <a href="#" class="text-gray-300 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Tambo Delivery. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent { }
