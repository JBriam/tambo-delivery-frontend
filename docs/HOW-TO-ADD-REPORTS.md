# Cómo Agregar Reportes a Nuevas Secciones

Esta guía te ayudará a agregar funcionalidad de exportación (Excel y PDF) a cualquier componente de gestión.

## 📋 Pasos Rápidos

### 1. Importar el ReportService

```typescript
import { ReportService } from '../../../shared/services/report.service';
```

### 2. Inyectar el servicio en el constructor

```typescript
constructor(
  // ... otros servicios
  private reportService: ReportService
) {}
```

### 3. Agregar botones de exportación en el template

```typescript
<div class="flex gap-3">
  <app-button
    [config]="{
      text: 'Exportar Excel',
      type: 'secondary',
      size: 'md'
    }"
    (buttonClick)="exportToExcel()"
  />
  <app-button
    [config]="{
      text: 'Exportar PDF',
      type: 'secondary',
      size: 'md'
    }"
    (buttonClick)="exportToPDF()"
  />
  <!-- Otros botones... -->
</div>
```

### 4. Implementar los métodos de exportación

```typescript
// ==================== EXPORT METHODS ====================

/**
 * Exporta los datos filtrados a Excel
 */
exportToExcel(): void {
  const columns = [
    { header: 'ID', field: 'id', width: 10 },
    { header: 'Nombre', field: 'name', width: 30 },
    { header: 'Descripción', field: 'description', width: 40 },
    // Agregar más columnas según necesites
  ];

  this.reportService.exportToExcel(
    this.filteredData,  // Tu array de datos filtrados
    columns,
    'Reporte_NombreSeccion'
  );
  
  // Opcional: mostrar toast de éxito
  this.toastService.success('Reporte exportado exitosamente');
}

/**
 * Exporta los datos filtrados a PDF
 */
exportToPDF(): void {
  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Nombre', field: 'name' },
    { header: 'Descripción', field: 'description' },
    // Nota: Para PDF, considera menos columnas para mejor visualización
  ];

  this.reportService.exportToPDF(
    this.filteredData,  // Tu array de datos filtrados
    columns,
    'Reporte_NombreSeccion',
    'Reporte de [Nombre] - Tambo Delivery'  // Título del PDF
  );
  
  // Opcional: mostrar toast de éxito
  this.toastService.success('Reporte exportado exitosamente');
}
```

## 🎯 Configuración de Columnas

### Estructura de ReportColumn

```typescript
interface ReportColumn {
  header: string;  // Texto que aparece en el encabezado
  field: string;   // Campo del objeto a exportar
  width?: number;  // Ancho en caracteres (solo para Excel)
}
```

### Ejemplos de Configuración

#### Columnas Simples
```typescript
{ header: 'ID', field: 'id', width: 10 }
{ header: 'Nombre', field: 'name', width: 30 }
```

#### Columnas Anidadas (notación de punto)
```typescript
{ header: 'Categoría', field: 'category.name', width: 20 }
{ header: 'Email Usuario', field: 'user.email', width: 30 }
{ header: 'Ciudad', field: 'address.city', width: 20 }
```

#### Ejemplo Completo para Productos
```typescript
const columns = [
  { header: 'ID', field: 'id', width: 10 },
  { header: 'Nombre', field: 'name', width: 30 },
  { header: 'Descripción', field: 'description', width: 40 },
  { header: 'Categoría', field: 'category.name', width: 20 },
  { header: 'Marca', field: 'brand.name', width: 20 },
  { header: 'Precio', field: 'price', width: 12 },
  { header: 'Stock', field: 'stock', width: 10 },
  { header: 'Activo', field: 'isActive', width: 10 },
];
```

## 💡 Tips y Buenas Prácticas

### 1. Excel vs PDF

**Excel:**
- Usa para datos detallados con muchas columnas
- Perfecto para análisis posterior
- Incluye todas las columnas relevantes
- Especifica anchos apropiados

**PDF:**
- Usa para presentaciones y documentación
- Limita a 6-8 columnas para mejor visualización
- Prioriza las columnas más importantes
- No necesitas especificar anchos

### 2. Nombres de Archivos

Los archivos se generan automáticamente con el formato:
```
NombreBase_YYYY-MM-DD.extension
```

Ejemplo:
```typescript
'Reporte_Productos'  →  'Reporte_Productos_2025-12-08.xlsx'
```

### 3. Datos Filtrados

Siempre exporta los datos que el usuario está viendo:

```typescript
// ✅ CORRECTO - Exporta datos filtrados
this.reportService.exportToExcel(
  this.filteredProducts,
  columns,
  'Reporte_Productos'
);

// ❌ INCORRECTO - Exporta todos los datos
this.reportService.exportToExcel(
  this.products,  // Sin filtrar
  columns,
  'Reporte_Productos'
);
```

### 4. Formateo de Datos Especiales

Si necesitas formatear datos antes de exportar:

```typescript
// Ejemplo: Formatear roles de usuarios
const usersForExport = this.filteredUsers.map(user => ({
  ...user,
  roles: user.roles?.map(r => r.name).join(', ') || 'Sin roles'
}));

this.reportService.exportToExcel(
  usersForExport,
  columns,
  'Reporte_Usuarios'
);
```

### 5. Manejo de Arrays y Objetos Complejos

El servicio convierte automáticamente:
- **Booleanos:** `true` → "Sí", `false` → "No"
- **Fechas:** Se formatean según locale español
- **null/undefined:** Se muestran como vacío
- **Objetos:** Se convierten a JSON string

Si necesitas un formato específico, transfórmalos antes de exportar.

## 📊 Ejemplos Completos

### Ejemplo 1: Sección de Ventas

```typescript
exportToExcel(): void {
  const columns = [
    { header: 'ID Venta', field: 'id', width: 10 },
    { header: 'Fecha', field: 'date', width: 15 },
    { header: 'Cliente', field: 'customer.name', width: 25 },
    { header: 'Total', field: 'total', width: 12 },
    { header: 'Estado', field: 'status', width: 15 },
    { header: 'Método Pago', field: 'paymentMethod', width: 15 },
  ];

  this.reportService.exportToExcel(
    this.filteredSales,
    columns,
    'Reporte_Ventas'
  );
  
  this.toastService.success('Reporte de ventas exportado');
}

exportToPDF(): void {
  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Fecha', field: 'date' },
    { header: 'Cliente', field: 'customer.name' },
    { header: 'Total', field: 'total' },
    { header: 'Estado', field: 'status' },
  ];

  this.reportService.exportToPDF(
    this.filteredSales,
    columns,
    'Reporte_Ventas',
    'Reporte de Ventas - Tambo Delivery'
  );
  
  this.toastService.success('Reporte de ventas exportado');
}
```

### Ejemplo 2: Sección de Inventario

```typescript
exportToExcel(): void {
  const columns = [
    { header: 'SKU', field: 'sku', width: 15 },
    { header: 'Producto', field: 'product.name', width: 30 },
    { header: 'Stock Actual', field: 'currentStock', width: 12 },
    { header: 'Stock Mínimo', field: 'minStock', width: 12 },
    { header: 'Stock Máximo', field: 'maxStock', width: 12 },
    { header: 'Ubicación', field: 'location', width: 20 },
    { header: 'Última Actualización', field: 'lastUpdated', width: 18 },
  ];

  this.reportService.exportToExcel(
    this.filteredInventory,
    columns,
    'Reporte_Inventario'
  );
  
  this.toastService.success('Reporte de inventario exportado');
}
```

## 🔧 Personalización Avanzada

### Modificar Estilos del PDF

Edita `report.service.ts` para cambiar colores y estilos:

```typescript
autoTable(doc, {
  head: [headers],
  body: rows,
  startY: 35,
  styles: { 
    fontSize: 8,
    cellPadding: 2,
  },
  headStyles: {
    fillColor: [41, 128, 185],  // Azul [R, G, B]
    textColor: 255,              // Blanco
    fontStyle: 'bold'
  },
  alternateRowStyles: {
    fillColor: [245, 245, 245]  // Gris claro
  },
});
```

### Agregar Logos o Imágenes al PDF

```typescript
exportToPDF(): void {
  const doc = new jsPDF('l', 'mm', 'a4');
  
  // Agregar logo
  doc.addImage('/assets/logo/logo.png', 'PNG', 10, 10, 30, 30);
  
  // Continuar con el título y tabla...
}
```

## 🐛 Solución de Problemas

### Error: "Property does not exist"
- Verifica que el campo exista en tus datos
- Usa notación de punto correctamente para objetos anidados
- Verifica que `filteredData` no sea undefined

### El reporte está vacío
- Asegúrate de que `filteredData` contenga elementos
- Verifica que los filtros no estén excluyendo todos los datos
- Revisa la consola para errores

### PDF se ve cortado
- Reduce el número de columnas
- Usa nombres de encabezado más cortos
- Considera cambiar a formato Excel para datos extensos

## 📚 Recursos Adicionales

- [Documentación completa de reportes](./REPORTS-GUIDE.md)
- [API de jsPDF](https://github.com/parallax/jsPDF)
- [API de xlsx](https://github.com/SheetJS/sheetjs)

## ✅ Checklist de Implementación

- [ ] Importar ReportService
- [ ] Inyectar en constructor
- [ ] Agregar botones en template
- [ ] Implementar método exportToExcel()
- [ ] Implementar método exportToPDF()
- [ ] Configurar columnas apropiadas
- [ ] Probar con datos reales
- [ ] Verificar filtros funcionen correctamente
- [ ] Agregar mensajes de éxito (opcional)
- [ ] Documentar columnas especiales si las hay
