# Estructura de Carpetas - Tambo Delivery Frontend

## 📁 Estructura Completa del Proyecto

```
src/
├── app/
│   ├── core/                           # Servicios singleton y funcionalidad central
│   │   ├── guards/                     # Guardas de ruta
│   │   │   └── auth.guard.ts          # Protección de rutas autenticadas
│   │   ├── interceptors/               # Interceptores HTTP
│   │   │   └── auth.interceptor.ts    # Interceptor de autenticación
│   │   └── services/                   # Servicios principales
│   │       └── auth.service.ts        # Servicio de autenticación
│   │
│   ├── shared/                         # Componentes, pipes y directivas reutilizables
│   │   ├── components/                 # Componentes compartidos
│   │   │   └── button.component.ts    # Componente de botón reutilizable
│   │   ├── pipes/                      # Pipes personalizados
│   │   └── directives/                 # Directivas personalizadas
│   │
│   ├── features/                       # Módulos de funcionalidades por dominio
│   │   ├── auth/                       # Autenticación y autorización
│   │   │   ├── pages/                  # Páginas de login, registro
│   │   │   │   ├── login.component.ts        # Página de inicio de sesión
│   │   │   │   └── register.component.ts     # Página de registro
│   │   │   ├── components/             # Componentes específicos de auth
│   │   │   └── services/               # Servicios específicos de auth
│   │   │
│   │   ├── products/                   # Gestión de productos
│   │   │   ├── pages/                  # Lista, detalle de productos
│   │   │   │   ├── products-list.component.ts    # Catálogo de productos
│   │   │   │   └── product-detail.component.ts   # Detalle del producto
│   │   │   ├── components/             # Tarjetas de producto, filtros
│   │   │   └── services/               # Servicio de productos
│   │   │
│   │   ├── orders/                     # Gestión de pedidos
│   │   │   ├── pages/                  # Lista, detalle, historial de pedidos
│   │   │   │   ├── orders-list.component.ts   # Historial de pedidos
│   │   │   │   └── order-detail.component.ts  # Detalle del pedido
│   │   │   ├── components/             # Componentes de pedidos
│   │   │   └── services/               # Servicio de pedidos
│   │   │
│   │   ├── shopping-cart/              # Carrito de compras
│   │   │   ├── pages/                  # Página del carrito
│   │   │   │   └── shopping-cart.component.ts # Página principal del carrito
│   │   │   ├── components/             # Componentes del carrito
│   │   │   └── services/               # Servicio del carrito
│   │   │
│   │   └── user-profile/               # Perfil de usuario
│   │       ├── pages/                  # Páginas de perfil, configuración
│   │       │   └── user-profile.component.ts  # Página de perfil
│   │       ├── components/             # Componentes de perfil
│   │       └── services/               # Servicios de perfil
│   │
│   ├── layout/                         # Componentes de estructura de la app
│   │   ├── header/                     # Componente de encabezado
│   │   │   └── header.component.ts    # Barra de navegación superior
│   │   ├── footer/                     # Componente de pie de página
│   │   └── sidebar/                    # Componente de barra lateral
│   │
│   ├── models/                         # Interfaces y modelos TypeScript
│   │   ├── user.model.ts              # Modelo de usuario (User, Address, UserRole)
│   │   ├── product.model.ts           # Modelo de producto (Product, Category, CartItem)
│   │   └── order.model.ts             # Modelo de pedido (Order, OrderStatus, PaymentMethod)
│   │
│   ├── services/                       # Servicios globales de la aplicación
│   │
│   ├── utils/                          # Utilidades y funciones helper
│   │   └── common.utils.ts            # Utilidades comunes (formateo, validaciones)
│   │
│   └── constants/                      # Constantes de la aplicación
│       └── app.constants.ts           # URLs de API, configuraciones, colores
│
└── assets/                             # Recursos estáticos
    ├── images/                         # Imágenes de la aplicación
    ├── icons/                          # Iconos personalizados
    └── styles/                         # Archivos de estilo globales
```

## 📁 **Explicación Detallada de Cada Carpeta y Subcarpeta**

### 🎯 **1. `/src/app/core/` - El Núcleo de la Aplicación**
Esta carpeta contiene la funcionalidad central que debe cargarse una sola vez al inicio de la aplicación.

#### **`/core/guards/`**
- **Propósito**: Proteger rutas y controlar acceso a páginas específicas
- **Ejemplo**: `auth.guard.ts` - Verifica si el usuario está autenticado antes de permitir acceso a páginas protegidas
- **Uso**: Se aplican automáticamente a las rutas definidas en `app.routes.ts`
- **Funcionalidad**: Redirige al login si el usuario no está autenticado

#### **`/core/interceptors/`**
- **Propósito**: Interceptar todas las peticiones HTTP para agregar funcionalidad común
- **Ejemplo**: `auth.interceptor.ts` - Agrega automáticamente el token JWT a todas las peticiones
- **Ventaja**: No tienes que recordar agregar headers de autorización en cada petición HTTP
- **Uso**: Se configura globalmente en `app.config.ts`

#### **`/core/services/`**
- **Propósito**: Servicios singleton que se usan en toda la aplicación
- **Ejemplo**: `auth.service.ts` - Maneja login, logout, registro y estado de autenticación
- **Características**: 
  - Se crean una sola vez y se comparten en toda la app
  - Manejan estado global de autenticación
  - Incluyen métodos para comunicación con backend

---

### 🔄 **2. `/src/app/shared/` - Componentes Reutilizables**
Elementos que puedes usar en múltiples partes de la aplicación.

#### **`/shared/components/`**
- **Propósito**: Componentes que se reutilizan en diferentes funcionalidades
- **Implementados**:
  - `button.component.ts` - Botón estilizado con diferentes tipos y estados
- **Ejemplos futuros**:
  - `modal.component.ts` - Ventana modal reutilizable
  - `loading-spinner.component.ts` - Indicador de carga
  - `card.component.ts` - Tarjeta base para productos, pedidos, etc.

#### **`/shared/pipes/`**
- **Propósito**: Transformar datos en las plantillas HTML
- **Ejemplos futuros**:
  - `currency.pipe.ts` - Formatear precios (S/. 4.50)
  - `date-ago.pipe.ts` - Mostrar "hace 2 horas" en lugar de fecha completa
  - `truncate.pipe.ts` - Recortar texto largo

#### **`/shared/directives/`**
- **Propósito**: Agregar funcionalidad personalizada a elementos HTML
- **Ejemplos futuros**:
  - `click-outside.directive.ts` - Cerrar modales al hacer clic fuera
  - `auto-focus.directive.ts` - Enfocar automáticamente inputs
  - `lazy-load.directive.ts` - Carga lazy de imágenes

---

### 🏢 **3. `/src/app/features/` - Funcionalidades por Dominio**
Cada subcarpeta representa una funcionalidad específica del negocio siguiendo el patrón de arquitectura por características.

#### **`/features/auth/` - Autenticación y Autorización**
- **`/pages/`**: 
  - `login.component.ts` - Página completa de inicio de sesión con formulario
  - `register.component.ts` - Página completa de registro de nuevos usuarios
  - **Funcionalidad**: Formularios reactivos, validaciones, manejo de errores
- **`/components/`** (futuro):
  - `login-form.component.ts` - Formulario de login reutilizable
  - `social-login.component.ts` - Botones de login con Google/Facebook
- **`/services/`** (opcional):
  - Servicios específicos de auth (el principal está en core)

#### **`/features/products/` - Gestión de Productos**
- **`/pages/`**:
  - `products-list.component.ts` - Catálogo completo con filtros y paginación
  - `product-detail.component.ts` - Página de detalle con imágenes, descripción y botón agregar al carrito
  - **Funcionalidad**: Navegación, filtros, selección de cantidad
- **`/components/`** (futuro):
  - `product-card.component.ts` - Tarjeta individual de producto para listas
  - `product-filter.component.ts` - Filtros por categoría, precio, disponibilidad
  - `product-gallery.component.ts` - Galería de imágenes con zoom
- **`/services/`** (futuro):
  - `products.service.ts` - Comunicación con API para obtener productos

#### **`/features/shopping-cart/` - Carrito de Compras**
- **`/pages/`**:
  - `shopping-cart.component.ts` - Página principal del carrito (actualmente placeholder)
  - **Funcionalidad futura**: Lista de items, cantidades, totales, botón checkout
- **`/components/`** (futuro):
  - `cart-item.component.ts` - Item individual con imagen, cantidad, precio
  - `cart-summary.component.ts` - Resumen con subtotal, delivery, total
  - `quantity-selector.component.ts` - Selector de cantidad con + y -
- **`/services/`** (futuro):
  - `cart.service.ts` - Agregar, quitar items, calcular totales, persistencia

#### **`/features/orders/` - Gestión de Pedidos**
- **`/pages/`**:
  - `orders-list.component.ts` - Historial de pedidos del usuario (actualmente placeholder)
  - `order-detail.component.ts` - Detalle específico de un pedido (actualmente placeholder)
- **`/components/`** (futuro):
  - `order-card.component.ts` - Tarjeta de pedido en el historial
  - `order-status.component.ts` - Indicador visual del estado (preparando, enviando, etc.)
  - `order-timeline.component.ts` - Timeline del proceso del pedido
- **`/services/`** (futuro):
  - `orders.service.ts` - Crear pedidos, obtener historial, actualizar estado

#### **`/features/user-profile/` - Perfil de Usuario**
- **`/pages/`**:
  - `user-profile.component.ts` - Página de perfil personal (actualmente placeholder)
- **`/components/`** (futuro):
  - `profile-form.component.ts` - Formulario de datos personales
  - `address-form.component.ts` - Formulario para gestionar direcciones
  - `password-change.component.ts` - Cambio de contraseña
- **`/services/`** (futuro):
  - `user.service.ts` - Actualizar perfil, gestionar direcciones

---

### 🏗️ **4. `/src/app/layout/` - Estructura Visual de la Aplicación**
Componentes que definen la estructura general y se muestran en todas las páginas.

#### **`/layout/header/`**
- **Implementado**: `header.component.ts` - Barra superior con navegación
- **Funcionalidad**: 
  - Logo de Tambo Delivery
  - Menú de navegación (Productos, Carrito, Pedidos, Perfil)
  - Botones de login/registro o saludo al usuario autenticado
  - Responsive design para móvil y desktop

#### **`/layout/footer/`** (futuro)
- **Propósito**: Pie de página consistente
- **Contenido**: Links legales, redes sociales, información de contacto

#### **`/layout/sidebar/`** (futuro)
- **Propósito**: Menú lateral para versión móvil o panel de admin
- **Uso**: Navegación alternativa en pantallas pequeñas

---

### 📊 **5. `/src/app/models/` - Definiciones de Datos TypeScript**
Interfaces que definen la estructura de todos los datos de la aplicación.

#### **`user.model.ts`**
- **Interfaces**: `User`, `Address`, `UserRole`
- **Propósito**: Definir estructura de usuarios, direcciones y roles
- **Campos**: id, email, firstName, lastName, phoneNumber, address, role, timestamps

#### **`product.model.ts`**
- **Interfaces**: `Product`, `ProductCategory`, `CartItem`
- **Propósito**: Estructura de productos y items del carrito
- **Campos**: id, name, description, price, imageUrl, category, stock, availability

#### **`order.model.ts`**
- **Interfaces**: `Order`, `OrderItem`, `OrderStatus`, `PaymentMethod`
- **Propósito**: Estructura completa de pedidos y su estado
- **Campos**: id, user, items, totalAmount, status, deliveryAddress, dates, payment

---

### 🛠️ **6. `/src/app/services/` - Servicios Globales**
Servicios que no pertenecen a una funcionalidad específica pero se usan globalmente.

**Ejemplos futuros**:
- `notification.service.ts` - Mostrar mensajes de éxito/error/información
- `loading.service.ts` - Controlar indicadores de carga globales
- `storage.service.ts` - Wrapper para localStorage/sessionStorage
- `theme.service.ts` - Manejo de tema claro/oscuro

---

### 🧰 **7. `/src/app/utils/` - Funciones de Utilidad**
Funciones auxiliares puras que no dependen de servicios de Angular.

#### **`common.utils.ts`** (implementado)
- **Funciones disponibles**:
  - `formatCurrency()` - Formatear precios en soles peruanos
  - `formatDate()` - Formatear fechas al formato local
  - `formatDateTime()` - Formatear fecha y hora
  - `generateId()` - Generar IDs únicos
  - `isValidEmail()` - Validar formato de email
  - `isValidPhoneNumber()` - Validar teléfonos peruanos
  - `truncateText()` - Recortar texto con puntos suspensivos

**Ejemplos futuros**:
- `validators.utils.ts` - Validadores personalizados para formularios
- `date.utils.ts` - Funciones específicas para manejo de fechas
- `string.utils.ts` - Manipulación de strings

---

### 🎯 **8. `/src/app/constants/` - Configuraciones y Constantes**
Valores constantes centralizados para evitar hardcoding.

#### **`app.constants.ts`** (implementado)
- **API_ENDPOINTS**: URLs completas para todas las rutas del backend
  - Autenticación: login, register, refresh, logout
  - Usuarios: profile, addresses
  - Productos: list, categories, search
  - Pedidos: create, list, details, status
  - Carrito: get, add, update, remove, clear
- **APP_CONSTANTS**: Configuraciones de la aplicación
  - Keys para localStorage
  - Paginación, límites del carrito
  - Costos de delivery
- **ORDER_STATUS_COLORS**: Clases CSS para cada estado de pedido

---

### 🎨 **9. `/src/assets/` - Recursos Estáticos**

#### **`/images/`**
- Logos de la empresa y partners
- Banners promocionales
- Imágenes placeholder para productos
- Ilustraciones para estados vacíos

#### **`/icons/`**
- Iconos SVG personalizados de la marca
- Iconos de categorías de productos
- Iconos de estado de pedidos
- Favicon de la aplicación

#### **`/styles/`**
- Variables CSS globales personalizadas
- Extensiones y customizaciones de TailwindCSS
- Estilos para componentes de terceros

---

## 🔄 **Flujo de Trabajo Típico de Usuario**

1. **Usuario accede** → `header.component.ts` se carga automáticamente
2. **Navega a productos** → `products-list.component.ts` muestra catálogo usando `product.model.ts`
3. **Ve detalle** → `product-detail.component.ts` con opción de agregar al carrito
4. **Se autentica** → `login.component.ts` → `auth.guard.ts` verifica → `auth.interceptor.ts` agrega token
5. **Agrega al carrito** → `cart.service.ts` actualiza estado usando `cart.model.ts`
6. **Realiza pedido** → `orders.service.ts` comunica con backend usando `order.model.ts`
7. **Ve historial** → `orders-list.component.ts` muestra pedidos previos

## 🎯 **Ventajas de esta Estructura**

- ✅ **Escalable**: Fácil agregar nuevas funcionalidades sin afectar las existentes
- ✅ **Mantenible**: Código organizado por responsabilidad, fácil de encontrar y modificar
- ✅ **Reutilizable**: Componentes compartidos evitan duplicación de código
- ✅ **Testeable**: Lógica separada facilita pruebas unitarias e integración
- ✅ **Profesional**: Sigue estándares y mejores prácticas de Angular
- ✅ **Colaborativa**: Múltiples desarrolladores pueden trabajar sin conflictos
- ✅ **Performante**: Lazy loading reduce el tamaño del bundle inicial

## 🚀 **Estado Actual vs. Planificado**

### ✅ **Ya Implementado:**
- Estructura base completa de carpetas
- Sistema de rutas con lazy loading
- Componentes de autenticación (login/registro)
- Componentes de productos (lista/detalle)
- Modelos TypeScript completos
- Servicios de autenticación
- Guards e interceptors
- Header de navegación
- Utilidades comunes
- Constantes de configuración

### 🔄 **En Desarrollo/Próximo:**
- Servicios específicos de cada feature
- Componentes reutilizables adicionales
- Funcionalidad completa del carrito
- Sistema de pedidos
- Perfil de usuario completo
- Footer y sidebar
- Pipes personalizados
- Directivas personalizadas

## 📋 Próximos Pasos Recomendados

### 🔄 **Fase 1: Funcionalidad Básica**
1. **Completar servicios HTTP**
   - `products.service.ts` - Comunicación con API de productos
   - `cart.service.ts` - Gestión del estado del carrito
   - `orders.service.ts` - Creación y gestión de pedidos

2. **Implementar carrito funcional**
   - Agregar/quitar productos
   - Calcular totales
   - Persistir en localStorage

3. **Sistema de notificaciones**
   - `notification.service.ts` - Mensajes toast
   - Confirmaciones de acciones

### 🔄 **Fase 2: Experiencia de Usuario**
4. **Crear componentes reutilizables**
   - Modales
   - Spinners de carga
   - Cards de producto
   - Formularios base

5. **Implementar responsive design**
   - Mobile-first approach
   - Sidebar para navegación móvil

6. **Agregar animaciones y transiciones**
   - Estados de carga
   - Transiciones entre páginas

### 🔄 **Fase 3: Funcionalidades Avanzadas**
7. **Sistema completo de pedidos**
   - Checkout process
   - Confirmación de pedidos
   - Seguimiento en tiempo real

8. **Perfil de usuario completo**
   - Gestión de direcciones
   - Historial de pedidos
   - Preferencias

9. **Optimizaciones**
   - Lazy loading de imágenes
   - PWA capabilities
   - Caché de datos

## 🔧 Herramientas y Tecnologías Utilizadas

- **Framework**: Angular 19.2
- **Styling**: TailwindCSS 4.1
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router con lazy loading
- **Forms**: Reactive Forms
- **Authentication**: JWT tokens
- **State Management**: Services con BehaviorSubject
- **Build Tool**: Angular CLI
- **TypeScript**: Fuerte tipado y interfaces

## 🔧 Beneficios de esta Estructura

- **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar las existentes
- **Mantenibilidad**: Código organizado por responsabilidad, fácil de encontrar y modificar  
- **Reutilización**: Componentes y servicios compartidos evitan duplicación de código
- **Separación de responsabilidades**: Cada carpeta tiene un propósito específico y bien definido
- **Consistencia**: Estructura predecible que facilita el trabajo en equipo
- **Testabilidad**: Lógica separada facilita pruebas unitarias e integración
- **Performance**: Lazy loading reduce el tamaño del bundle inicial
- **Profesionalismo**: Sigue estándares y mejores prácticas de la industria

## 🎯 Convenciones de Nomenclatura

### **Archivos y Carpetas**
- Carpetas: `kebab-case` (shopping-cart, user-profile)
- Componentes: `nombre.component.ts`
- Servicios: `nombre.service.ts`
- Modelos: `nombre.model.ts`
- Guards: `nombre.guard.ts`
- Interceptors: `nombre.interceptor.ts`

### **Clases y Interfaces**
- Componentes: `PascalCase` + `Component` (LoginComponent)
- Servicios: `PascalCase` + `Service` (AuthService)  
- Interfaces: `PascalCase` (User, Product, Order)
- Enums: `PascalCase` (UserRole, OrderStatus)

### **Variables y Métodos**
- Variables: `camelCase` (currentUser, isLoading)
- Métodos: `camelCase` (login, addToCart, formatCurrency)
- Constantes: `UPPER_SNAKE_CASE` (API_ENDPOINTS, APP_CONSTANTS)

## 📱 Responsive Design y Accesibilidad

La estructura está preparada para:
- **Mobile First**: Diseño pensado primero para móviles
- **Progressive Enhancement**: Funcionalidades que se mejoran en pantallas más grandes
- **Accesibilidad**: Componentes preparados para screen readers
- **Performance**: Optimizado para conexiones lentas

## 🔒 Seguridad

Consideraciones implementadas:
- **JWT Authentication**: Tokens seguros para autenticación
- **Route Guards**: Protección de rutas sensibles
- **HTTP Interceptors**: Manejo automático de tokens
- **Input Validation**: Validaciones en frontend y preparado para backend
- **XSS Protection**: Sanitización automática de Angular

---

*Estructura creada siguiendo las mejores prácticas de Angular y patrones de arquitectura escalable para aplicaciones enterprise.*
