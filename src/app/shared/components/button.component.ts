import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ButtonConfig {
  text: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-button',
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="config.disabled || config.loading"
      (click)="onClick()"
    >
      @if (config.loading) {
        <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
      }
      @if (config.icon && !config.loading) {
        <span [class]="config.icon + ' mr-2'"></span>
      }
      {{ config.text }}
    </button>
  `,
  standalone: true
})
export class ButtonComponent {
  @Input() config!: ButtonConfig;
  @Output() buttonClick = new EventEmitter<void>();

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const typeClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    };

    const disabledClasses = (this.config.disabled || this.config.loading) 
      ? 'opacity-50 cursor-not-allowed' 
      : '';

    return [
      baseClasses,
      sizeClasses[this.config.size || 'md'],
      typeClasses[this.config.type || 'primary'],
      disabledClasses
    ].join(' ');
  }

  onClick(): void {
    if (!this.config.disabled && !this.config.loading) {
      this.buttonClick.emit();
    }
  }
}
