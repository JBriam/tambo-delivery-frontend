package com.tambo.tambo_delivery_backend.controllers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tambo.tambo_delivery_backend.auth.dto.ResponseDto;
import com.tambo.tambo_delivery_backend.dto.ProductDTO;
import com.tambo.tambo_delivery_backend.dto.ProductSectionDTO;
import com.tambo.tambo_delivery_backend.services.AppConfigService;
import com.tambo.tambo_delivery_backend.services.ProductService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/public")
@CrossOrigin
public class PublicController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AppConfigService configService;

    // ------------------------------ PRODUCT -----------------------------

    // Obtener todos los productos por filtros
    @GetMapping("/product")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID typeId,
            @RequestParam(required = false) String slug,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean newArrival,
            HttpServletResponse response) {

        try {
            List<ProductDTO> productList = new ArrayList<>();

            if (StringUtils.isNotBlank(slug)) {
                ProductDTO productDto = productService.getProductBySlug(slug);
                productList.add(productDto);
            } else {
                productList = productService.getAllProducts(categoryId, typeId, name, minPrice, maxPrice, true,
                        newArrival);
            }
            return new ResponseEntity<>(productList, HttpStatus.OK);

        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener los productos: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // ------------------------------ PRODUCT SECTIONS ----------------------------

    // Obtener las secciones de categorias
    @GetMapping("/product-sections")
    public ResponseEntity<?> getAllProductSections() {

        try {
            List<ProductSectionDTO> prod = configService.getProductSections();
            return new ResponseEntity<>(prod, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener a las secciones de los productos: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    /**
     * Obtener categorías públicas para mostrar en el frontend
     */
    @GetMapping("/category/get-all")
    public ResponseEntity<List<CategoryDTO>> getPublicCategories() {
        try {
            List<CategoryDTO> categories = new ArrayList<>();
            
            // Categorías de ejemplo
            categories.add(new CategoryDTO("1", "Bebidas", "Refrescos, jugos y más", "assets/categories/bebidas.webp"));
            categories.add(new CategoryDTO("2", "Comidas", "Snacks y comidas preparadas", "assets/categories/comidas.webp"));
            categories.add(new CategoryDTO("3", "Despensa", "Productos de despensa", "assets/categories/despensa.webp"));
            categories.add(new CategoryDTO("4", "Helados", "Helados y postres fríos", "assets/categories/helados.webp"));
            categories.add(new CategoryDTO("5", "Antojos", "Dulces, chocolates y snacks", "assets/categories/antojos.webp"));
            categories.add(new CategoryDTO("6", "Cervezas", "Cervezas nacionales e importadas", "assets/categories/cervezas.webp"));
            categories.add(new CategoryDTO("7", "Licores", "Licores, vinos y pisco", "assets/categories/licores.webp"));
            categories.add(new CategoryDTO("8", "Cigarros y Vapes", "Cigarrillos y cigarrillos electrónicos", "assets/categories/cigarros-vapes.webp"));

            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("Error al obtener categorías públicas: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DTO para categorías
    public static class CategoryDTO {
        private String id;
        private String name;
        private String description;
        private String imageUrl;

        public CategoryDTO() {}

        public CategoryDTO(String id, String name, String description, String imageUrl) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.imageUrl = imageUrl;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}
