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
import { Category } from '../../../models/category.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-category-modal',
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
        [formGroup]="categoryForm"
        (ngSubmit)="onSubmit()"
        class="space-y-5"
      >

        <!-- Category Name -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre de la Categoría <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="Ej: Bebidas, Lácteos, etc."
            class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            [class.border-red-500]="
              categoryForm.get('name')?.invalid &&
              categoryForm.get('name')?.touched
            "
          />
          @if (categoryForm.get('name')?.invalid &&
          categoryForm.get('name')?.touched) {
          <p class="mt-1 text-sm text-red-600">
            @if (categoryForm.get('name')?.errors?.['required']) { El nombre es
            requerido } @if (categoryForm.get('name')?.errors?.['minlength']) {
            El nombre debe tener al menos 2 caracteres }
          </p>
          }
        </div>

        <!-- Description -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Descripción
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            placeholder="Descripción de la categoría (opcional)"
            class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
          ></textarea>
        </div>

        <!-- Image URL -->
        <div>
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
            URL de la Imagen
          </label>
          <input
            type="url"
            id="imageUrl"
            formControlName="imageUrl"
            placeholder="https://ejemplo.com/imagen.jpg"
            class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            [class.border-red-500]="categoryForm.get('imageUrl')?.invalid && categoryForm.get('imageUrl')?.touched"
          />
          @if (categoryForm.get('imageUrl')?.invalid && categoryForm.get('imageUrl')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              Ingresa una URL válida
            </p>
          }
        </div>

        <!-- Image Preview -->
        @if (categoryForm.get('imageUrl')?.value) {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vista Previa
            </label>
            <div class="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <img
                [src]="categoryForm.get('imageUrl')?.value"
                alt="Preview"
                class="h-24 w-24 object-contain rounded-lg"
                (error)="onImageError($event)"
              />
            </div>
          </div>
        }

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
              text: mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios',
              type: 'primary',
              size: 'md',
              disabled: categoryForm.invalid || isSubmitting
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `,
})
export class CategoryModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() category: Category | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCategory = new EventEmitter<Category>();

  categoryForm!: FormGroup;
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
    this.categoryForm = this.fb.group({
      name: [
        this.category?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      description: [this.category?.description || ''],
      imageUrl: [
        this.category?.imageUrl || '',
        [Validators.required, Validators.pattern('https?://.+')]
      ]
    });
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Nueva Categoría'
      : 'Editar Categoría';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Completa la información para agregar una nueva categoría'
      : 'Actualiza la información de la categoría';
  }

  onSubmit(): void {
    if (this.categoryForm.invalid || this.isSubmitting) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const categoryData: Category = {
      id: this.category?.id || '',
      name: this.categoryForm.value.name.trim(),
      description: this.categoryForm.value.description?.trim() || undefined,
      imageUrl: this.categoryForm.value.imageUrl?.trim() || undefined,
    };

    this.saveCategory.emit(categoryData);
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.categoryForm.reset();
      this.isSubmitting = false;
      this.closeModal.emit();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/categories/category-default.png';
  }
}
