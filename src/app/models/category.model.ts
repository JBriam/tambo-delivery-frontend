export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  categoryId: string; // ID de la categoría a la que pertenece
}