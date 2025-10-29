# 🎨 Diagramas Visuales - CRUD de Productos

Este documento contiene representaciones visuales del sistema CRUD de productos en 3 fases.

---

## 📊 Flujo General del Sistema

```
                    ┌─────────────────────────────┐
                    │   USUARIO ADMINISTRADOR     │
                    └──────────┬──────────────────┘
                               │
                               ▼
                    ┌─────────────────────────────┐
                    │  Gestión de Productos Page  │
                    │  [Crear Producto] Button    │
                    └──────────┬──────────────────┘
                               │
                               ▼
        ╔══════════════════════════════════════════════════════╗
        ║           FASE 1: INFORMACIÓN BÁSICA                 ║
        ╠══════════════════════════════════════════════════════╣
        ║  • Nombre del producto                               ║
        ║  • Slug (auto-generado)                             ║
        ║  • Descripción                                       ║
        ║  • Precio y Stock                                    ║
        ║  • Marca (dropdown)                                  ║
        ║  • Categoría (dropdown)                              ║
        ║  • Tipo de Categoría (dropdown dinámico)            ║
        ║  • ☑ Nuevo Ingreso  ☑ Activo                       ║
        ║                                                      ║
        ║  [Cancelar]                  [Continuar a Fase 2 →] ║
        ╚══════════════════════════════════════════════════════╝
                               │
                               ▼
                    Backend: POST /api/admin/products
                    Response: { id: "uuid-producto" }
                               │
                               ▼
        ╔══════════════════════════════════════════════════════╗
        ║         FASE 2: IMÁGENES Y RECURSOS                  ║
        ╠══════════════════════════════════════════════════════╣
        ║  IMAGEN PRINCIPAL (Obligatoria)                      ║
        ║  ┌────────────────────────────────────────┐          ║
        ║  │ Nombre: [_________________]            │          ║
        ║  │ URL: [_____________________]           │          ║
        ║  │ Tipo: [▼ IMAGE]                        │          ║
        ║  │ [Vista previa de imagen]               │          ║
        ║  └────────────────────────────────────────┘          ║
        ║                                                      ║
        ║  IMÁGENES ADICIONALES        [+ Agregar Imagen]     ║
        ║  ┌─ Imagen 1 ──────────────────── [Eliminar]        ║
        ║  │ URL: [_____________________]                      ║
        ║  │ [Vista previa]                                    ║
        ║  └──────────────────────────────────────             ║
        ║                                                      ║
        ║  [Omitir]                    [Continuar a Fase 3 →] ║
        ╚══════════════════════════════════════════════════════╝
                               │
                               ▼
        Backend: POST /api/admin/products/{id}/resources
        Response: Product actualizado
                               │
                               ▼
        ╔══════════════════════════════════════════════════════╗
        ║           FASE 3: ASIGNAR DESCUENTOS                 ║
        ╠══════════════════════════════════════════════════════╣
        ║  Descuentos disponibles (2 seleccionados)           ║
        ║                                                      ║
        ║  ☑ Descuento Verano                        -15%     ║
        ║    📅 01 Dic - 31 Mar  ● Activo                    ║
        ║                                                      ║
        ║  □ Black Friday                            -30%     ║
        ║    📅 24 Nov - 27 Nov  ● Activo                    ║
        ║                                                      ║
        ║  ☑ Promo 2x1                               -50%     ║
        ║    📅 Todo el año  ● Activo                        ║
        ║                                                      ║
        ║  [Omitir]                           [Finalizar ✓]   ║
        ╚══════════════════════════════════════════════════════╝
                               │
                               ▼
        Backend: POST /api/admin/products/{id}/discounts
        Response: Product completo
                               │
                               ▼
                    ┌─────────────────────────────┐
                    │  ✅ PRODUCTO CREADO          │
                    │  Recargar lista de productos│
                    └─────────────────────────────┘
```

---

## 🏗️ Arquitectura de Componentes

```
┌────────────────────────────────────────────────────────────┐
│                 ProductsManagementComponent                 │
│  (products-management.component.ts)                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Header                                           │     │
│  │  • Título: "Gestión de Productos"               │     │
│  │  • Botón: [Crear Producto]                      │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Filtros                                          │     │
│  │  • Búsqueda por texto                            │     │
│  │  • Filtrar por categoría                         │     │
│  │  • Filtrar por estado (Activo/Inactivo)         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Tabla de Productos                               │     │
│  │  ┌──────┬──────┬──────┬──────┬──────┬────────┐  │     │
│  │  │ Img  │ Cat  │ $    │ Stock│ Est  │ Acciones│  │     │
│  │  ├──────┼──────┼──────┼──────┼──────┼────────┤  │     │
│  │  │ [🖼] │ Beb  │ 3.50 │ 100  │ Act  │ Edit|X │  │     │
│  │  └──────┴──────┴──────┴──────┴──────┴────────┘  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │  Modal States                                     │     │
│  │  • isPhase1ModalOpen: boolean                    │     │
│  │  • isPhase2ModalOpen: boolean                    │     │
│  │  • isPhase3ModalOpen: boolean                    │     │
│  │  • newProductId: string                          │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
                           │
                           │ imports/uses
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Phase1Modal  │  │ Phase2Modal  │  │ Phase3Modal  │
│  Component   │  │  Component   │  │  Component   │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Inputs:      │  │ Inputs:      │  │ Inputs:      │
│ • isOpen     │  │ • isOpen     │  │ • isOpen     │
│              │  │ • productId  │  │ • productId  │
│ Outputs:     │  │              │  │              │
│ • closeModal │  │ Outputs:     │  │ Outputs:     │
│ • phase1Done │  │ • closeModal │  │ • closeModal │
│   (prodId)   │  │ • phase2Done │  │ • phase3Done │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                           │ uses
                           ▼
                  ┌──────────────────┐
                  │  ProductService  │
                  ├──────────────────┤
                  │ • createBasic()  │
                  │ • addResources() │
                  │ • assignDisc()   │
                  └──────────────────┘
                           │
                           │ HTTP calls
                           ▼
                  ┌──────────────────┐
                  │  Backend API     │
                  │  Spring Boot     │
                  └──────────────────┘
```

---

## 📦 Estructura de Datos

```
┌───────────────────────────────────────────────────────────┐
│                     PRODUCT (Entity)                       │
├───────────────────────────────────────────────────────────┤
│  id: UUID                                                  │
│  slug: string (unique)                                     │
│  name: string                                              │
│  description: text                                         │
│  price: BigDecimal                                         │
│  stock: integer                                            │
│  isNewArrival: boolean                                     │
│  isActive: boolean                                         │
│  createdAt: timestamp                                      │
│  updatedAt: timestamp                                      │
│                                                            │
│  ┌─────────────────┐                                      │
│  │ brand ──────────┼────► Brand (ManyToOne)              │
│  └─────────────────┘                                      │
│                                                            │
│  ┌─────────────────┐                                      │
│  │ category ───────┼────► Category (ManyToOne)           │
│  └─────────────────┘                                      │
│                                                            │
│  ┌─────────────────┐                                      │
│  │ categoryType ───┼────► CategoryType (ManyToOne)       │
│  └─────────────────┘                                      │
│                                                            │
│  ┌─────────────────┐                                      │
│  │ resources ──────┼────► List<Resource> (OneToMany)     │
│  └─────────────────┘       │                              │
│                             ▼                              │
│                    ┌────────────────┐                     │
│                    │   Resource     │                     │
│                    ├────────────────┤                     │
│                    │ id: UUID       │                     │
│                    │ name: string   │                     │
│                    │ url: string    │                     │
│                    │ isPrimary: bool│                     │
│                    │ type: string   │                     │
│                    └────────────────┘                     │
│                                                            │
│  ┌─────────────────┐                                      │
│  │ discounts ──────┼────► List<Discount> (ManyToMany)   │
│  └─────────────────┘       │                              │
│                             ▼                              │
│                    ┌────────────────┐                     │
│                    │   Discount     │                     │
│                    ├────────────────┤                     │
│                    │ id: UUID       │                     │
│                    │ name: string   │                     │
│                    │ percentage: #  │                     │
│                    │ startDate: date│                     │
│                    │ endDate: date  │                     │
│                    │ isActive: bool │                     │
│                    └────────────────┘                     │
└───────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Estados (State Machine)

```
                        ┌─────────────┐
                        │   INITIAL   │
                        │   STATE     │
                        └──────┬──────┘
                               │
                      [Click "Crear Producto"]
                               │
                               ▼
        ╔═══════════════════════════════════════════╗
        ║  isPhase1ModalOpen = true                 ║
        ║  isPhase2ModalOpen = false                ║
        ║  isPhase3ModalOpen = false                ║
        ║  newProductId = ''                        ║
        ╚═══════════════════════════════════════════╝
                               │
                    [Usuario llena formulario]
                               │
                     [Click "Continuar"]
                               │
                               ▼
                    Backend: createProductBasic()
                    Response: { id: "uuid" }
                               │
                               ▼
        ╔═══════════════════════════════════════════╗
        ║  isPhase1ModalOpen = false                ║
        ║  isPhase2ModalOpen = true   ◄─────────┐  ║
        ║  isPhase3ModalOpen = false             │  ║
        ║  newProductId = "uuid"                 │  ║
        ╚═══════════════════════════════════════════╝
                               │                  │
                    [Usuario agrega imágenes]    │
                               │                  │
              [Click "Continuar" o "Omitir"] ────┘
                               │
                               ▼
                Backend: addProductResources()
                    (o skip si omite)
                               │
                               ▼
        ╔═══════════════════════════════════════════╗
        ║  isPhase1ModalOpen = false                ║
        ║  isPhase2ModalOpen = false                ║
        ║  isPhase3ModalOpen = true   ◄─────────┐  ║
        ║  newProductId = "uuid"                 │  ║
        ╚═══════════════════════════════════════════╝
                               │                  │
                [Usuario selecciona descuentos]  │
                               │                  │
            [Click "Finalizar" o "Omitir"] ──────┘
                               │
                               ▼
              Backend: assignProductDiscounts()
                    (o skip si omite)
                               │
                               ▼
        ╔═══════════════════════════════════════════╗
        ║  isPhase1ModalOpen = false                ║
        ║  isPhase2ModalOpen = false                ║
        ║  isPhase3ModalOpen = false                ║
        ║  newProductId = ''                        ║
        ╚═══════════════════════════════════════════╝
                               │
                               ▼
                    ✅ PRODUCTO CREADO
                    Mostrar mensaje éxito
                    Recargar lista productos
                               │
                               ▼
                        ┌─────────────┐
                        │   INITIAL   │
                        │   STATE     │
                        └─────────────┘
```

---

## 🌐 Comunicación Frontend-Backend

```
┌──────────────────┐                              ┌──────────────────┐
│    FRONTEND      │                              │     BACKEND      │
│   (Angular 18)   │                              │  (Spring Boot)   │
└────────┬─────────┘                              └────────┬─────────┘
         │                                                  │
         │ FASE 1: POST /api/admin/products                │
         │ ─────────────────────────────────────────────►  │
         │ Body: {                                          │
         │   name: "Coca Cola",                            │
         │   price: 3.50,                                  │
         │   stock: 100,                                   │
         │   brandId: "uuid",                              │
         │   categoryId: "uuid",                           │
         │   ...                                           │
         │ }                                               │
         │                                                  │
         │  ◄─────────────────────────────────────────────  │
         │ Response: 201 Created                           │
         │ Body: {                                          │
         │   id: "product-uuid",                           │
         │   name: "Coca Cola",                            │
         │   ...                                           │
         │ }                                               │
         │                                                  │
         ├──────────────────────────────────────────────────┤
         │                                                  │
         │ FASE 2: POST /api/admin/products/{id}/resources │
         │ ─────────────────────────────────────────────►  │
         │ Body: {                                          │
         │   resources: [                                  │
         │     {                                           │
         │       name: "Principal",                        │
         │       url: "https://...",                       │
         │       isPrimary: true,                          │
         │       type: "IMAGE"                             │
         │     },                                          │
         │     {...}                                       │
         │   ]                                             │
         │ }                                               │
         │                                                  │
         │  ◄─────────────────────────────────────────────  │
         │ Response: 200 OK                                │
         │ Body: Product actualizado con recursos          │
         │                                                  │
         ├──────────────────────────────────────────────────┤
         │                                                  │
         │ FASE 3: POST /api/admin/products/{id}/discounts │
         │ ─────────────────────────────────────────────►  │
         │ Body: {                                          │
         │   discountIds: [                                │
         │     "discount-uuid-1",                          │
         │     "discount-uuid-2"                           │
         │   ]                                             │
         │ }                                               │
         │                                                  │
         │  ◄─────────────────────────────────────────────  │
         │ Response: 200 OK                                │
         │ Body: Product completo con descuentos           │
         │                                                  │
         └──────────────────────────────────────────────────┘
```

---

## 📊 Diagrama de Secuencia Detallado

```
Usuario    Phase1Modal    Phase2Modal    Phase3Modal    ProductService    Backend
  │            │              │              │               │              │
  │ Click      │              │              │               │              │
  │ "Crear"    │              │              │               │              │
  ├──────────► │              │              │               │              │
  │            │              │              │               │              │
  │ Llena      │              │              │               │              │
  │ Formulario │              │              │               │              │
  ├──────────► │              │              │               │              │
  │            │              │              │               │              │
  │            │ Valida datos │              │               │              │
  │            ├───────────►  │              │               │              │
  │            │              │              │               │              │
  │            │ createProductBasic()        │               │              │
  │            ├─────────────────────────────┼──────────────►│              │
  │            │              │              │               │              │
  │            │              │              │     POST /products           │
  │            │              │              │               ├────────────► │
  │            │              │              │               │              │
  │            │              │              │               │ Validar      │
  │            │              │              │               │ Guardar      │
  │            │              │              │               │ en DB        │
  │            │              │              │               │              │
  │            │              │              │     { id: "uuid" }           │
  │            │              │              │               │◄───────────── │
  │            │              │              │               │              │
  │            │ Product con ID              │               │              │
  │            │◄────────────────────────────┼───────────────┤              │
  │            │              │              │               │              │
  │  Cerrar    │              │              │               │              │
  │  Fase 1    │              │              │               │              │
  │◄─────────── │              │              │               │              │
  │            │              │              │               │              │
  │  Abrir     │              │              │               │              │
  │  Fase 2    ├──────────────►│              │               │              │
  │            │              │              │               │              │
  │ Agrega     │              │              │               │              │
  │ Imágenes   │              │              │               │              │
  ├────────────┼──────────────►│              │               │              │
  │            │              │              │               │              │
  │            │              │ addProductResources()        │              │
  │            │              ├──────────────┼───────────────►│              │
  │            │              │              │               │              │
  │            │              │              │     POST /{id}/resources     │
  │            │              │              │               ├────────────► │
  │            │              │              │               │              │
  │            │              │              │               │ Guardar      │
  │            │              │              │               │ Resources    │
  │            │              │              │               │              │
  │            │              │              │     Product actualizado      │
  │            │              │              │               │◄───────────── │
  │            │              │              │               │              │
  │            │              │ Product actualizado          │              │
  │            │              │◄─────────────┼───────────────┤              │
  │            │              │              │               │              │
  │  Cerrar    │              │              │               │              │
  │  Fase 2    │              │              │               │              │
  │◄───────────┼──────────────┤              │               │              │
  │            │              │              │               │              │
  │  Abrir     │              │              │               │              │
  │  Fase 3    ├──────────────┼──────────────►│               │              │
  │            │              │              │               │              │
  │ Selecciona │              │              │               │              │
  │ Descuentos │              │              │               │              │
  ├────────────┼──────────────┼──────────────►│               │              │
  │            │              │              │               │              │
  │            │              │              │ assignProductDiscounts()     │
  │            │              │              ├───────────────►│              │
  │            │              │              │               │              │
  │            │              │              │     POST /{id}/discounts     │
  │            │              │              │               ├────────────► │
  │            │              │              │               │              │
  │            │              │              │               │ Asignar      │
  │            │              │              │               │ Descuentos   │
  │            │              │              │               │              │
  │            │              │              │     Product completo         │
  │            │              │              │               │◄───────────── │
  │            │              │              │               │              │
  │            │              │              │ Product completo             │
  │            │              │              │◄──────────────┤              │
  │            │              │              │               │              │
  │  Cerrar    │              │              │               │              │
  │  Fase 3    │              │              │               │              │
  │◄───────────┼──────────────┼──────────────┤               │              │
  │            │              │              │               │              │
  │  Mensaje   │              │              │               │              │
  │  Éxito     │              │              │               │              │
  │◄───────────┤              │              │               │              │
  │            │              │              │               │              │
  │  Recargar  │              │              │               │              │
  │  Lista     │              │              │               │              │
  ├────────────┼──────────────┼──────────────┼───────────────►│              │
  │            │              │              │               │              │
```

---

## 🎯 Estados de los Botones

```
                    FASE 1 MODAL
┌─────────────────────────────────────────────────┐
│                                                  │
│  Estados de los botones:                        │
│                                                  │
│  [Cancelar]          [Continuar a Fase 2 →]    │
│   ↓ click                ↓ click                │
│  Cerrar modal         Si form válido:           │
│  Reset datos          - Enviar al backend       │
│                       - Si success: Fase 2      │
│                       - Si error: Mostrar msg   │
└─────────────────────────────────────────────────┘


                    FASE 2 MODAL
┌─────────────────────────────────────────────────┐
│                                                  │
│  Estados de los botones:                        │
│                                                  │
│  [Omitir]            [Continuar a Fase 3 →]     │
│   ↓ click                ↓ click                │
│  Saltar fase          Si hay imagen principal:  │
│  Ir a Fase 3          - Enviar al backend       │
│                       - Si success: Fase 3      │
│                       - Si error: Mostrar msg   │
└─────────────────────────────────────────────────┘


                    FASE 3 MODAL
┌─────────────────────────────────────────────────┐
│                                                  │
│  Estados de los botones:                        │
│                                                  │
│  [Omitir]                 [Finalizar ✓]         │
│   ↓ click                  ↓ click              │
│  Finalizar sin          Si hay descuentos:      │
│  descuentos             - Enviar al backend     │
│  Cerrar todo            - Si success: Completar │
│                         Si no: Solo completar   │
└─────────────────────────────────────────────────┘
```

---

## 📱 Responsive Design

```
                    DESKTOP (1024px+)
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐ │
│  │  Header + Button                                   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Filters (Search, Category, Status) en 1 fila     │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Table (6 columnas visibles)                       │ │
│  │  Img | Category | Price | Stock | Status | Actions│ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘


                    TABLET (768px - 1023px)
┌─────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────┐ │
│  │  Header + Button                          │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  Filters en 2 filas                       │ │
│  │  Search                                   │ │
│  │  Category | Status                        │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  Table (scroll horizontal)                │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘


                    MOBILE (320px - 767px)
┌────────────────────────────────────┐
│  ┌──────────────────────────────┐ │
│  │  Header (Stack vertical)     │ │
│  │  Título                      │ │
│  │  [Crear Producto]            │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │  Filters (Stack vertical)    │ │
│  │  [Search_____________]       │ │
│  │  [▼ Categoría_____]          │ │
│  │  [▼ Estado________]          │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │  Cards (en lugar de tabla)   │ │
│  │  ┌────────────────────────┐  │ │
│  │  │ [Img] Coca Cola        │  │ │
│  │  │ Bebidas | S/ 3.50      │  │ │
│  │  │ Stock: 100 | Activo    │  │ │
│  │  │ [Editar] [Desactivar]  │  │ │
│  │  └────────────────────────┘  │ │
│  └──────────────────────────────┘ │
└────────────────────────────────────┘
```

---

**Nota**: Estos diagramas son representaciones visuales ASCII del sistema. Para diagramas más detallados, se recomienda usar herramientas como draw.io, Lucidchart o PlantUML.
