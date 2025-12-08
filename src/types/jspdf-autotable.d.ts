// Type definitions for jspdf-autotable
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  export interface RowInput {
    [key: string]: any;
  }

  export interface CellDef {
    content?: string | number;
    colSpan?: number;
    rowSpan?: number;
    styles?: Partial<Styles>;
  }

  export interface Styles {
    font?: string;
    fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    fontSize?: number;
    cellPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
    lineColor?: number | number[];
    lineWidth?: number | { top?: number; right?: number; bottom?: number; left?: number };
    fillColor?: number | number[] | false;
    textColor?: number | number[];
    halign?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    cellWidth?: 'auto' | 'wrap' | number;
    minCellHeight?: number;
    minCellWidth?: number;
  }

  export interface UserOptions {
    // Content
    head?: RowInput[];
    body?: RowInput[];
    foot?: RowInput[];
    
    // Positioning
    startY?: number | false;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number; horizontal?: number; vertical?: number };
    pageBreak?: 'auto' | 'avoid' | 'always';
    
    // Styling
    styles?: Partial<Styles>;
    headStyles?: Partial<Styles>;
    bodyStyles?: Partial<Styles>;
    footStyles?: Partial<Styles>;
    alternateRowStyles?: Partial<Styles>;
    columnStyles?: { [key: string]: Partial<Styles> };
    
    // Hooks
    didParseCell?: (data: CellHookData) => void;
    willDrawCell?: (data: CellHookData) => void;
    didDrawCell?: (data: CellHookData) => void;
    didDrawPage?: (data: HookData) => void;
    
    // Other
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    theme?: 'striped' | 'grid' | 'plain';
    tableWidth?: 'auto' | 'wrap' | number;
    tableLineColor?: number | number[];
    tableLineWidth?: number;
  }

  export interface HookData {
    table: Table;
    pageNumber: number;
    pageCount: number;
    settings: UserOptions;
    doc: jsPDF;
    cursor: { x: number; y: number };
  }

  export interface CellHookData extends HookData {
    cell: Cell;
    row: Row;
    column: Column;
    section: 'head' | 'body' | 'foot';
  }

  export interface Table {
    columns: Column[];
    head: Row[];
    body: Row[];
    foot: Row[];
  }

  export interface Column {
    dataKey: string | number;
    index: number;
  }

  export interface Row {
    cells: { [key: string]: Cell };
    section: 'head' | 'body' | 'foot';
    index: number;
  }

  export interface Cell {
    raw: string | number | null;
    text: string[];
    styles: Styles;
    section: 'head' | 'body' | 'foot';
    colSpan: number;
    rowSpan: number;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): jsPDF;
}
