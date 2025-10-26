import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Discount } from '../../../models/discount.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-discount-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    ButtonComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      [subtitle]="modalSubtitle"
      size="lg"
      [showFooter]="false"
      (closeModal)="onClose()"
    >
      <form
        [formGroup]="discountForm"
        (ngSubmit)="onSubmit()"
        class="space-y-5"
      >
        
        <div class="grid grid-cols-2 gap-4">
          <!-- Discount Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Descuento <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              formControlName="name"
              placeholder="Ej: Descuento de Verano..."
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              [class.border-red-500]="
                discountForm.get('name')?.invalid &&
                discountForm.get('name')?.touched
              "
            />
            @if (discountForm.get('name')?.invalid &&
            discountForm.get('name')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (discountForm.get('name')?.errors?.['required']) { El nombre
              es requerido } @if
              (discountForm.get('name')?.errors?.['minlength']) { El nombre debe
              tener al menos 2 caracteres }
            </p>
            }
          </div>
          <!-- Discount Percentage -->
          <div>
            <label
              for="percentage"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Descuento (%) <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="percentage"
              formControlName="percentage"
              placeholder="Ej: 10, 25, etc."
              class="w-full px-3 py-2 placeholder-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              [class.border-red-500]="
                discountForm.get('percentage')?.invalid &&
                discountForm.get('percentage')?.touched
              "
            />
            @if (discountForm.get('percentage')?.invalid &&
            discountForm.get('percentage')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (discountForm.get('percentage')?.errors?.['required']) { El %
              es requerido } @if
              (discountForm.get('percentage')?.errors?.['minlength']) { El %
              debe tener al menos 1 carácter }
            </p>
            }
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Start Date -->
          <div>
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Fecha de Inicio <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              formControlName="startDate"
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
          <!-- End Date -->
          <div>
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Fecha de Fin <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              formControlName="endDate"
              class="w-full px-3 py-2 placeholder-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <app-button
            [config]="{
              text: 'Cancelar',
              type: 'secondary',
              size: 'md'
            }"
            (buttonClick)="onClose()"
          />

          <app-button
            [config]="{
              text: mode === 'create' ? 'Crear Descuento' : 'Guardar Cambios',
              type: 'primary',
              size: 'md',
              disabled: discountForm.invalid || isSubmitting
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `,
})
export class DiscountModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() discount: Discount | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveDiscount = new EventEmitter<Discount>();

  discountForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.initForm();
      this.isSubmitting = false; // ✅ Resetear cuando se abre el modal
    }
  }

  private initForm(): void {
    this.discountForm = this.fb.group({
      name: [
        this.discount?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      percentage: [
        this.discount?.percentage || '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      startDate: [this.discount?.startDate || null],
      endDate: [this.discount?.endDate || null],
      isActive: [this.discount?.isActive || false],
    });
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Nuevo Descuento'
      : 'Editar Descuento';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Completa la información para agregar un nuevo descuento'
      : 'Actualiza la información del descuento';
  }

  onSubmit(): void {
    if (this.discountForm.invalid || this.isSubmitting) {
      this.discountForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const discountData: Discount = {
      id: this.discount?.id || '',
      name: this.discountForm.value.name.trim(),
      percentage: this.discountForm.value.percentage,
      startDate: this.discountForm.value.startDate,
      endDate: this.discountForm.value.endDate,
      isActive: this.discountForm.value.isActive,
    };

    this.saveDiscount.emit(discountData);
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.discountForm.reset();
      this.isSubmitting = false;
      this.closeModal.emit();
    }
  }
}
