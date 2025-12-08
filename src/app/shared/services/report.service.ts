import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportColumn {
  header: string;
  field: string;
  width?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor() { }

  /**
   * Exporta datos a formato Excel (.xlsx)
   * @param data Array de objetos con los datos a exportar
   * @param columns Configuración de columnas (encabezados y campos)
   * @param fileName Nombre del archivo sin extensión
   */
  exportToExcel(data: any[], columns: ReportColumn[], fileName: string): void {
    // Mapear los datos según las columnas especificadas
    const mappedData = data.map(item => {
      const row: any = {};
      columns.forEach(col => {
        row[col.header] = this.getNestedValue(item, col.field);
      });
      return row;
    });

    // Crear worksheet y workbook
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    // Ajustar ancho de columnas
    const colWidths = columns.map(col => ({
      wch: col.width || 15
    }));
    ws['!cols'] = colWidths;

    // Descargar archivo
    XLSX.writeFile(wb, `${fileName}_${this.getDateString()}.xlsx`);
  }

  /**
   * Exporta datos a formato PDF
   * @param data Array de objetos con los datos a exportar
   * @param columns Configuración de columnas
   * @param fileName Nombre del archivo sin extensión
   * @param title Título del reporte
   */
  exportToPDF(data: any[], columns: ReportColumn[], fileName: string, title: string): void {
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' = landscape (horizontal)
    
    // Agregar título
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Agregar fecha de generación
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${this.getDateTimeString()}`, 14, 28);

    // Preparar encabezados y datos
    const headers = columns.map(col => col.header);
    const rows = data.map(item => 
      columns.map(col => this.formatCellValue(this.getNestedValue(item, col.field)))
    );

    // Generar tabla
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 35,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, right: 14, bottom: 14, left: 14 },
    });

    // Descargar archivo
    doc.save(`${fileName}_${this.getDateString()}.pdf`);
  }

  /**
   * Obtiene un valor anidado de un objeto usando notación de punto
   * Ejemplo: 'user.name' obtiene el nombre del usuario
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => 
      current?.[prop] !== undefined ? current[prop] : '', obj
    );
  }

  /**
   * Formatea el valor de una celda para mostrar en PDF
   */
  private formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString('es-ES');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   */
  private getDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Obtiene la fecha y hora actual formateada
   */
  private getDateTimeString(): string {
    const now = new Date();
    return now.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
