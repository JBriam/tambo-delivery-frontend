# 📊 Ejemplos Visuales de Reportes

Este documento muestra ejemplos de cómo se ven los reportes generados en ambos formatos.

## 📁 Formato Excel (.xlsx)

### Ejemplo: Reporte de Productos

```
┌──────┬─────────────────────┬──────────────────────────┬──────────────┬────────────┬─────────┬──────────────┬──────────────┬───────┬────────┐
│  ID  │      Nombre        │      Descripción         │  Categoría   │   Marca    │ Precio  │ Precio Final │ Descuento(%) │ Stock │ Activo │
├──────┼─────────────────────┼──────────────────────────┼──────────────┼────────────┼─────────┼──────────────┼──────────────┼───────┼────────┤
│  1   │ Coca Cola 500ml    │ Bebida gaseosa sabor...  │ Bebidas      │ Coca Cola  │  3.50   │    2.80      │      20      │  150  │   Sí   │
│  2   │ Arroz Superior 1kg │ Arroz extra superior...  │ Abarrotes    │ Paisana    │  4.20   │    4.20      │       0      │   80  │   Sí   │
│  3   │ Leche Gloria 1L    │ Leche evaporada entera   │ Lácteos      │ Gloria     │  5.80   │    5.22      │      10      │  200  │   Sí   │
│  4   │ Pan Blanco 500g    │ Pan de molde blanco      │ Panadería    │ Bimbo      │  6.50   │    6.50      │       0      │   45  │   Sí   │
└──────┴─────────────────────┴──────────────────────────┴──────────────┴────────────┴─────────┴──────────────┴──────────────┴───────┴────────┘
```

**Características:**
- ✅ Columnas con anchos ajustados
- ✅ Encabezados en negrita
- ✅ Datos listos para ordenar y filtrar
- ✅ Fácil importación a otras herramientas

---

### Ejemplo: Reporte de Pedidos

```
┌───────────────┬────────────┬─────────────┬────────────────────────────┬──────────────┬─────────┬─────────────────────┬──────────────────────────────┐
│ Nº de Orden  │  Cliente   │  Apellido   │          Email            │    Estado    │  Total  │       Fecha         │          Dirección           │
├───────────────┼────────────┼─────────────┼────────────────────────────┼──────────────┼─────────┼─────────────────────┼──────────────────────────────┤
│ ORD-20251208 │   Juan     │   Pérez     │ juan.perez@email.com      │ DELIVERED    │  45.80  │ 2025-12-08 10:30   │ Av. Larco 1234, Miraflores   │
│ ORD-20251207 │   María    │   García    │ maria.garcia@email.com    │ PREPARING    │  32.50  │ 2025-12-07 15:45   │ Jr. Lima 567, San Isidro     │
│ ORD-20251207 │   Carlos   │   Rodríguez │ carlos.rod@email.com      │ PENDING      │  28.90  │ 2025-12-07 18:20   │ Calle Real 890, Surco        │
└───────────────┴────────────┴─────────────┴────────────────────────────┴──────────────┴─────────┴─────────────────────┴──────────────────────────────┘
```

---

### Ejemplo: Reporte de Usuarios

```
┌────┬───────────┬────────────┬─────────────────────────┬──────────────┬───────────────────────────┬────────┬─────────────────────┐
│ ID │  Nombre   │  Apellido  │         Email           │  Teléfono    │         Roles             │ Activo │   Fecha Creación    │
├────┼───────────┼────────────┼─────────────────────────┼──────────────┼───────────────────────────┼────────┼─────────────────────┤
│ 1  │  Admin    │  Sistema   │ admin@tambo.com         │ 999-888-777  │ ADMIN, SUPER_ADMIN        │   Sí   │ 2025-01-15 09:00   │
│ 2  │  Juan     │  Vendedor  │ juan.vend@tambo.com     │ 999-777-666  │ VENDEDOR                  │   Sí   │ 2025-02-20 10:30   │
│ 3  │  María    │  Cliente   │ maria@email.com         │ 999-666-555  │ CLIENTE                   │   Sí   │ 2025-03-10 14:15   │
└────┴───────────┴────────────┴─────────────────────────┴──────────────┴───────────────────────────┴────────┴─────────────────────┘
```

---

## 📄 Formato PDF

### Vista General del PDF

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                       ║
║                     Reporte de Productos - Tambo Delivery                            ║
║                                                                                       ║
║                     Fecha de generación: 08/12/2025 14:30                           ║
║                                                                                       ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                       ║
║  ┌─────┬──────────────────┬──────────────┬────────────┬────────┬──────────────┐    ║
║  │ ID  │     Nombre       │  Categoría   │   Marca    │ Precio │ Precio Final │    ║
║  ├─────┼──────────────────┼──────────────┼────────────┼────────┼──────────────┤    ║
║  │  1  │ Coca Cola 500ml  │   Bebidas    │ Coca Cola  │  3.50  │     2.80     │    ║
║  ├─────┼──────────────────┼──────────────┼────────────┼────────┼──────────────┤    ║
║  │  2  │ Arroz Superior   │  Abarrotes   │  Paisana   │  4.20  │     4.20     │    ║
║  ├─────┼──────────────────┼──────────────┼────────────┼────────┼──────────────┤    ║
║  │  3  │ Leche Gloria 1L  │   Lácteos    │   Gloria   │  5.80  │     5.22     │    ║
║  ├─────┼──────────────────┼──────────────┼────────────┼────────┼──────────────┤    ║
║  │  4  │ Pan Blanco 500g  │  Panadería   │    Bimbo   │  6.50  │     6.50     │    ║
║  └─────┴──────────────────┴──────────────┴────────────┴────────┴──────────────┘    ║
║                                                                                       ║
║                                                             Página 1 de 1             ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
```

**Características del PDF:**
- ✅ Encabezado azul (#2980B9)
- ✅ Filas alternas en gris claro
- ✅ Título grande y visible
- ✅ Fecha de generación
- ✅ Orientación horizontal (más espacio para columnas)
- ✅ Formato A4 profesional

---

### Ejemplo: PDF de Pedidos

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                       ║
║                      Reporte de Pedidos - Tambo Delivery                             ║
║                                                                                       ║
║                     Fecha de generación: 08/12/2025 14:35                           ║
║                                                                                       ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                       ║
║  ┌────────────────┬──────────┬──────────────┬────────┬─────────────────┬─────────┐ ║
║  │   Nº Orden     │ Cliente  │   Estado     │  Total │     Fecha       │ Ciudad  │ ║
║  ├────────────────┼──────────┼──────────────┼────────┼─────────────────┼─────────┤ ║
║  │ ORD-20251208   │   Juan   │  DELIVERED   │ 45.80  │ 08/12/25 10:30 │ Lima    │ ║
║  ├────────────────┼──────────┼──────────────┼────────┼─────────────────┼─────────┤ ║
║  │ ORD-20251207   │   María  │  PREPARING   │ 32.50  │ 07/12/25 15:45 │ Lima    │ ║
║  ├────────────────┼──────────┼──────────────┼────────┼─────────────────┼─────────┤ ║
║  │ ORD-20251207   │  Carlos  │   PENDING    │ 28.90  │ 07/12/25 18:20 │ Lima    │ ║
║  └────────────────┴──────────┴──────────────┴────────┴─────────────────┴─────────┘ ║
║                                                                                       ║
║                                                             Página 1 de 1             ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Personalización de Colores en PDF

Los PDFs utilizan una paleta de colores profesional:

### Encabezados de Tabla
```
Color: Azul (#2980B9)
RGB: (41, 128, 185)
Texto: Blanco (#FFFFFF)
Fuente: Negrita
```

### Filas Alternas
```
Color Base: Blanco (#FFFFFF)
Color Alterno: Gris Claro (#F5F5F5)
RGB Alterno: (245, 245, 245)
```

### Bordes
```
Color: Gris (#DDDDDD)
Ancho: 0.1mm
```

---

## 📊 Comparación de Formatos

### ¿Cuándo usar Excel?

✅ **Úsalo para:**
- Análisis de datos detallado
- Crear gráficos propios
- Filtrar y ordenar datos
- Realizar cálculos adicionales
- Importar a otros sistemas
- Reportes con muchas columnas (>10)

**Ejemplo de caso de uso:**
```
"Necesito analizar las ventas del mes y crear un gráfico de 
tendencias en Excel para la presentación mensual."
→ Usar EXCEL
```

---

### ¿Cuándo usar PDF?

✅ **Úsalo para:**
- Presentaciones oficiales
- Documentos para imprimir
- Compartir con stakeholders
- Archivos que no deben modificarse
- Reportes visuales profesionales
- Documentación formal

**Ejemplo de caso de uso:**
```
"El gerente necesita un reporte impreso de los pedidos del día 
para la reunión de esta tarde."
→ Usar PDF
```

---

## 🔍 Ejemplos de Uso Real

### Caso 1: Análisis de Inventario

**Objetivo:** Identificar productos con bajo stock

**Pasos:**
1. Ir a Gestión de Productos
2. Ordenar por stock (menor a mayor)
3. Exportar a Excel
4. En Excel: Filtrar productos con stock < 10
5. Crear lista de reposición

---

### Caso 2: Reporte Mensual para Gerencia

**Objetivo:** Presentar resumen de ventas del mes

**Pasos:**
1. Ir a Gestión de Pedidos
2. Filtrar por fecha (último mes)
3. Filtrar por estado: DELIVERED
4. Exportar a PDF
5. Imprimir y presentar

---

### Caso 3: Auditoría de Usuarios

**Objetivo:** Revisar usuarios activos y sus roles

**Pasos:**
1. Ir a Gestión de Usuarios
2. Filtrar por estado: Activo
3. Exportar a Excel
4. Revisar roles asignados
5. Verificar permisos

---

## 📏 Especificaciones Técnicas

### Excel (.xlsx)

**Formato:**
- Tipo: OpenXML Spreadsheet
- Versión: Excel 2007+
- Codificación: UTF-8
- Extensión: .xlsx

**Límites:**
- Máximo filas: 1,048,576
- Máximo columnas: 16,384
- Tamaño recomendado: < 10 MB

**Anchos de columna:**
- Automático según contenido
- Personalizable por columna
- Unidad: Caracteres

---

### PDF

**Formato:**
- Tipo: Portable Document Format
- Versión: PDF 1.3+
- Codificación: UTF-8
- Extensión: .pdf

**Configuración de página:**
- Tamaño: A4 (210mm × 297mm)
- Orientación: Horizontal (Landscape)
- Márgenes: 14mm (todos los lados)

**Tipografía:**
- Título: 18pt
- Subtítulo: 10pt
- Tabla encabezado: 8pt negrita
- Tabla contenido: 8pt regular

---

## 💡 Tips para Reportes Efectivos

### Para Excel

1. **Usa nombres descriptivos:**
   ```
   ✅ Reporte_Productos_Stock_Bajo_2025-12-08.xlsx
   ❌ reporte.xlsx
   ```

2. **Aplica filtros antes de exportar:**
   ```
   Solo exporta los datos que necesitas
   ```

3. **Considera el tamaño:**
   ```
   > 1000 filas: Considera dividir por períodos
   ```

---

### Para PDF

1. **Menos columnas = Mejor legibilidad:**
   ```
   ✅ 6-8 columnas principales
   ❌ 15 columnas que no caben
   ```

2. **Usa para documentos finales:**
   ```
   PDF = Versión para presentar
   Excel = Versión para trabajar
   ```

3. **Nombres profesionales:**
   ```
   ✅ Reporte_Mensual_Ventas_Diciembre_2025.pdf
   ❌ ventas.pdf
   ```

---

## 🎯 Resumen Visual

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Dashboard Admin → [Sección]                            │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 📊 Exportar  │  │ 📄 Exportar  │  │ ➕ Crear     │  │
│  │    Excel     │  │     PDF      │  │    Nuevo     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ↓ Click en botón                                       │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  🔄 Procesando datos...                        │    │
│  │  ✅ Generando archivo...                       │    │
│  │  💾 Descargando...                             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  📁 Archivo guardado en carpeta de descargas            │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  ✅ Reporte exportado exitosamente             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📚 Referencias Adicionales

- Ver [REPORTS-GUIDE.md](./REPORTS-GUIDE.md) para la guía completa
- Ver [HOW-TO-ADD-REPORTS.md](./HOW-TO-ADD-REPORTS.md) para implementación
- Ver [REPORTS-IMPLEMENTATION-SUMMARY.md](./REPORTS-IMPLEMENTATION-SUMMARY.md) para resumen técnico
