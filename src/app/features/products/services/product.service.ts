import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, ProductFilter, Brand, Category, CategoryType, ProductSection } from '../../../models/product.model';
import { API_ENDPOINTS } from '../../../constants/app.constants';

// DTOs para el backend Spring Boot
export interface CreateProductRequest {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryId: string;
  categoryTypeId: string;
  thumbnail?: string;
  isNewArrival?: boolean;
  isActive?: boolean;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  // ============================== PRODUCTOS PÚBLICOS ==============================

  /**
   * Obtener productos con filtros (público)
   */
  getProducts(filter: ProductFilter = {}): Observable<Product[]> {
    let params = new HttpParams();

    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.typeId) params = params.set('typeId', filter.typeId);
    if (filter.slug) params = params.set('slug', filter.slug);
    if (filter.name) params = params.set('name', filter.name);
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.newArrival !== undefined) params = params.set('newArrival', filter.newArrival.toString());

    return this.http.get<Product[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.PRODUCTS}`,
      { params }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un producto por slug (público)
   */
  getProductBySlug(slug: string): Observable<Product> {
    return this.getProducts({ slug }).pipe(
      map(products => {
        if (products.length === 0) {
          throw new Error('Producto no encontrado');
        }
        return products[0];
      })
    );
  }

  /**
   * Buscar productos por nombre (público)
   */
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.getProducts({ name: searchTerm });
  }

  /**
   * Obtener secciones de productos (público)
   */
  getProductSections(): Observable<ProductSection[]> {
    return this.http.get<ProductSection[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.PRODUCT_SECTIONS}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener categorías públicas (para mostrar en header/navegación)
   */
  getPublicCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.CATEGORIES}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - PRODUCTOS ==============================

  /**
   * Obtener todos los productos (admin)
   */
  getAllProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCTS_ALL}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear producto (admin)
   */
  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCTS}`,
      productData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar producto (admin)
   */
  updateProduct(productId: string, productData: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCTS}/${productId}`,
      productData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar producto (admin)
   */
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCTS}/${productId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - MARCAS ==============================

  /**
   * Obtener todas las marcas (admin)
   */
  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRANDS_ALL}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear marca (admin)
   */
  createBrand(brandData: { name: string; description?: string; imageUrl?: string }): Observable<Brand> {
    return this.http.post<Brand>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRANDS}`,
      brandData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar marca (admin)
   */
  updateBrand(brandId: string, brandData: { name: string; description?: string; imageUrl?: string }): Observable<Brand> {
    return this.http.put<Brand>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRANDS}/${brandId}`,
      brandData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar marca (admin)
   */
  deleteBrand(brandId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRANDS}/${brandId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - CATEGORÍAS ==============================

  /**
   * Obtener todas las categorías (admin)
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORIES_ALL}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear categoría (admin)
   */
  createCategory(categoryData: { name: string; description?: string; imageUrl?: string }): Observable<Category> {
    return this.http.post<Category>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORIES}`,
      categoryData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar categoría (admin)
   */
  updateCategory(categoryId: string, categoryData: { name: string; description?: string; imageUrl?: string }): Observable<Category> {
    return this.http.put<Category>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORIES}/${categoryId}`,
      categoryData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar categoría (admin)
   */
  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORIES}/${categoryId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== MANEJO DE ERRORES ==============================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    console.error('Product Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}