# Guía de Generación de Reportes - Dashboard Admin

## 📊 Descripción General

El sistema de reportes del Dashboard de Administración permite exportar datos de todas las secciones en dos formatos:
- **Excel (.xlsx)** - Ideal para análisis de datos y hojas de cálculo
- **PDF** - Perfecto para documentación y presentaciones

## 🎯 Secciones con Reportes

### 1. Gestión de Productos
**Ubicación:** `/admin/products`

**Datos exportados:**
- ID del producto
- Nombre y descripción
- Categoría y marca
- Precios (original y final)
- Porcentaje de descuento
- Stock disponible
- Estados (activo, nuevo)

**Filtros aplicables:**
- Los reportes respetan los filtros de búsqueda, categoría y estado activos
- Solo se exportan los productos filtrados

### 2. Gestión de Pedidos
**Ubicación:** `/admin/orders`

**Datos exportados:**
- Número de orden
- Información del cliente (nombre, apellido, email)
- Estado del pedido
- Total del pedido
- Fecha de creación
- Dirección de entrega y ciudad

**Filtros aplicables:**
- Búsqueda por ID o cliente
- Filtro por estado (pendiente, confirmado, etc.)
- Filtro por fecha

### 3. Gestión de Descuentos
**Ubicación:** `/admin/discounts`

**Datos exportados:**
- ID del descuento
- Nombre del descuento
- Porcentaje
- Fechas de inicio y fin
- Estado activo/inactivo

**Filtros aplicables:**
- Búsqueda por nombre

### 4. Gestión de Categorías
**Ubicación:** `/admin/categories`

**Datos exportados:**
- ID de categoría
- Nombre y descripción
- Tipo de categoría
- Estado activo/inactivo

**Filtros aplicables:**
- Búsqueda por nombre

### 5. Gestión de Marcas
**Ubicación:** `/admin/brands`

**Datos exportados:**
- ID de marca
- Nombre y descripción
- Estado activo/inactivo

**Filtros aplicables:**
- Búsqueda por nombre

### 6. Gestión de Usuarios
**Ubicación:** `/admin/users`

**Datos exportados:**
- ID de usuario
- Nombre y apellido
- Email y teléfono
- Roles asignados
- Estado activo/inactivo
- Fecha de creación

**Filtros aplicables:**
- Búsqueda por nombre, email
- Filtro por rol
- Filtro por estado

## 🚀 Cómo Usar los Reportes

### Paso 1: Navegar a la Sección
1. Inicia sesión como administrador
2. Ve a la sección deseada (Productos, Pedidos, etc.)

### Paso 2: Aplicar Filtros (Opcional)
- Usa los campos de búsqueda y filtros disponibles
- El reporte solo incluirá los datos que ves en pantalla

### Paso 3: Exportar
1. Haz clic en **"Exportar Excel"** o **"Exportar PDF"**
2. El archivo se descargará automáticamente con:
   - Nombre descriptivo (ej: `Reporte_Productos_2025-12-08.xlsx`)
   - Fecha de generación incluida

## 📁 Formatos de Archivo

### Formato Excel (.xlsx)
**Características:**
- Columnas con anchos optimizados
- Encabezados claros
- Formato tabular fácil de manipular
- Perfecto para:
  - Análisis de datos
  - Creación de gráficos
  - Importación a otros sistemas

### Formato PDF
**Características:**
- Diseño profesional con:
  - Título del reporte
  - Fecha y hora de generación
  - Tabla con encabezados azules
  - Filas alternadas para mejor legibilidad
- Orientación horizontal (landscape) para más columnas
- Perfecto para:
  - Presentaciones
  - Documentación impresa
  - Archivos compartidos

## 🛠️ Implementación Técnica

### Servicio de Reportes
**Archivo:** `src/app/shared/services/report.service.ts`

**Métodos principales:**
```typescript
exportToExcel(data, columns, fileName)
exportToPDF(data, columns, fileName, title)
```

**Librerías utilizadas:**
- `xlsx` - Generación de archivos Excel
- `jspdf` - Generación de archivos PDF
- `jspdf-autotable` - Tablas automáticas en PDF

### Estructura de Columnas
```typescript
interface ReportColumn {
  header: string;      // Texto del encabezado
  field: string;       // Campo del objeto (soporta notación punto)
  width?: number;      // Ancho (solo para Excel)
}
```

### Ejemplo de Uso en Componente
```typescript
exportToExcel(): void {
  const columns = [
    { header: 'ID', field: 'id', width: 10 },
    { header: 'Nombre', field: 'name', width: 30 },
    { header: 'Categoría', field: 'category.name', width: 20 },
  ];

  this.reportService.exportToExcel(
    this.filteredData,
    columns,
    'Reporte_Nombre'
  );
}
```

## 🎨 Características Especiales

### 1. Valores Anidados
El servicio soporta notación de punto para acceder a propiedades anidadas:
```typescript
field: 'category.name'  // Accede a product.category.name
field: 'user.email'     // Accede a order.user.email
```

### 2. Formateo Automático
- **Booleanos:** Se convierten a "Sí" / "No"
- **Fechas:** Se formatean según locale español
- **Objetos:** Se convierten a JSON string
- **null/undefined:** Se muestran como vacío

### 3. Nombres de Archivo
Los archivos se generan con el formato:
```
NombreReporte_YYYY-MM-DD.extension
```
Ejemplo: `Reporte_Productos_2025-12-08.xlsx`

## 📊 Ejemplos de Reportes

### Reporte de Productos con Descuentos
1. Ve a Gestión de Productos
2. Filtra por productos activos
3. Exporta a Excel
4. Resultado: Lista completa con precios originales, descuentos y precios finales

### Reporte de Pedidos del Día
1. Ve a Gestión de Pedidos
2. Selecciona la fecha de hoy
3. Filtra por estado "Entregados"
4. Exporta a PDF para documentación

### Reporte de Usuarios Activos
1. Ve a Gestión de Usuarios
2. Filtra por estado "Activo"
3. Exporta a Excel para análisis

## 🔧 Personalización

### Agregar Nuevas Columnas
Edita el método de exportación en el componente:
```typescript
const columns = [
  // Columnas existentes...
  { header: 'Nueva Columna', field: 'nuevoCampo', width: 15 }
];
```

### Cambiar Estilos de PDF
Edita el servicio `report.service.ts`:
```typescript
headStyles: {
  fillColor: [41, 128, 185],  // Color del encabezado
  textColor: 255,              // Color del texto
}
```

## 📝 Notas Importantes

1. **Rendimiento:** Los reportes grandes (>1000 filas) pueden tardar unos segundos
2. **Navegadores:** Asegúrate de permitir descargas automáticas
3. **Filtros:** Los reportes siempre respetan los filtros activos
4. **Permisos:** Solo disponible para usuarios con rol de administrador

## 🆘 Solución de Problemas

### El archivo no se descarga
- Verifica que tu navegador permite descargas
- Revisa la consola del navegador para errores
- Intenta con menos datos aplicando filtros

### Datos incorrectos en el reporte
- Verifica que los filtros estén correctamente aplicados
- Revisa que los campos en la configuración de columnas sean correctos
- Comprueba que los datos estén cargados en la tabla

### PDF se ve cortado
- El formato está optimizado para A4 horizontal
- Si hay demasiadas columnas, considera exportar a Excel
- O reduce el número de columnas en la configuración

## 🔄 Actualizaciones Futuras

Posibles mejoras:
- [ ] Exportación a CSV
- [ ] Reportes programados
- [ ] Gráficos incluidos en PDF
- [ ] Plantillas personalizables
- [ ] Envío por email automático

## 📞 Soporte

Para más información o reportar problemas, contacta al equipo de desarrollo.
