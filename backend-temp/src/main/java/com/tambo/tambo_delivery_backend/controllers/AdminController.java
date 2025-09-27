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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tambo.tambo_delivery_backend.auth.dto.CreateRoleDto;
import com.tambo.tambo_delivery_backend.auth.dto.ResponseDto;
import com.tambo.tambo_delivery_backend.auth.dto.UserDetailsDto;
import com.tambo.tambo_delivery_backend.auth.entities.Authority;
import com.tambo.tambo_delivery_backend.auth.entities.User;
import com.tambo.tambo_delivery_backend.auth.services.AuthorityService;
import com.tambo.tambo_delivery_backend.auth.services.UserService;
import com.tambo.tambo_delivery_backend.dto.BrandDTO;
import com.tambo.tambo_delivery_backend.dto.BrandRequest;
import com.tambo.tambo_delivery_backend.dto.CategoryButtonDTO;
import com.tambo.tambo_delivery_backend.dto.CategoryDTO;
import com.tambo.tambo_delivery_backend.dto.CategoryRequestDTO;
import com.tambo.tambo_delivery_backend.dto.CreateProductDtoAdmin;
import com.tambo.tambo_delivery_backend.dto.DiscountDTO;
import com.tambo.tambo_delivery_backend.dto.DiscountRequestDTO;
import com.tambo.tambo_delivery_backend.dto.ProductDTO;
import com.tambo.tambo_delivery_backend.dto.ProductSectionDTO;
import com.tambo.tambo_delivery_backend.dto.SliderImageDTO;
import com.tambo.tambo_delivery_backend.dto.UserRequestDtoAdmin;
import com.tambo.tambo_delivery_backend.services.AppConfigService;
import com.tambo.tambo_delivery_backend.services.BrandService;
import com.tambo.tambo_delivery_backend.services.CategoryService;
import com.tambo.tambo_delivery_backend.services.DiscountService;
import com.tambo.tambo_delivery_backend.services.ProductService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AppConfigService configService;

    // ------------------------------ BRAND -----------------------------

    // Obtener a todos las marcas
    @GetMapping("/brand/get-all")
    public ResponseEntity<?> getAllBrands() {

        try {
            List<BrandDTO> brands = brandService.getAllBrands();
            return new ResponseEntity<>(brands, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener las marcas: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Obtener una marca por id
    @GetMapping("/brand/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable UUID id) {

        try {
            BrandDTO brand = brandService.getBrandById(id);
            return new ResponseEntity<>(brand, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener la marca: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Crear un nueva marca
    @PostMapping("brand/create")
    public ResponseEntity<ResponseDto> createBrand(@RequestBody BrandRequest request) {

        try {
            BrandDTO brand = brandService.createBrand(request);
            ResponseDto res = ResponseDto.builder()
                    .message("Marca creado: " + brand.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear la marca: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar una marca
    @PutMapping("/brand/update/{id}")
    public ResponseEntity<ResponseDto> updateBrand(@PathVariable UUID id, @RequestBody BrandRequest request) {

        try {
            BrandDTO brand = brandService.updateBrand(id, request);

            ResponseDto res = ResponseDto.builder()
                    .message("Marca actualizado: " + brand.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar la marca: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Eliminar una marca
    @DeleteMapping("/brand/delete/{id}")
    public ResponseEntity<ResponseDto> deleteBrand(@PathVariable UUID id) {

        try {
            brandService.deleteBrand(id);

            ResponseDto res = ResponseDto.builder()
                    .message("Marca eliminada: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al eliminar la marca: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // ------------------------------ CATEGORY -----------------------------

    // Obtener a todos las categorias
    @GetMapping("/category/get-all")
    public ResponseEntity<?> getAllCategories() {

        try {
            List<CategoryDTO> categories = categoryService.getAllCategories();
            return new ResponseEntity<>(categories, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener a las categorias: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Obtener una categoria por id
    @GetMapping("/category/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable UUID id) {

        try {
            CategoryDTO category = categoryService.getCategoryById(id);
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener la categoria: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Crear un nueva categoria
    @PostMapping("/category/create")
    public ResponseEntity<ResponseDto> createCategory(@RequestBody CategoryRequestDTO request) {

        try {
            CategoryDTO category = categoryService.createCategory(request);
            ResponseDto res = ResponseDto.builder()
                    .message("Categoria creado: " + category.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear la categoria: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar una categoria
    @PutMapping("/category/update/{id}")
    public ResponseEntity<ResponseDto> updateCategory(@PathVariable UUID id, @RequestBody CategoryRequestDTO request) {

        try {
            CategoryDTO category = categoryService.updateCategory(id, request);

            ResponseDto res = ResponseDto.builder()
                    .message("Categoria actualizado: " + category.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar la categoria: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Eliminar una categoria
    @DeleteMapping("/category/delete/{id}")
    public ResponseEntity<ResponseDto> deleteCategory(@PathVariable UUID id) {

        try {
            categoryService.deleteCategory(id);

            ResponseDto res = ResponseDto.builder()
                    .message("Categoria eliminada: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al eliminar la categoria: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // ------------------------------ DISCOUNTS -----------------------------

    // Obtener a todos los descuentos
    @GetMapping("/discount/get-all")
    public ResponseEntity<?> getAllDiscounts() {

        try {
            List<DiscountDTO> discounts = discountService.getAllDiscounts();
            return new ResponseEntity<>(discounts, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener los descuentos: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Obtener un descuento por id
    @GetMapping("/discount/{id}")
    public ResponseEntity<?> getDiscountById(@PathVariable UUID id) {

        try {
            DiscountDTO discount = discountService.getDiscountById(id);
            return new ResponseEntity<>(discount, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener el descuento: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Crear un nuevo descuento
    @PostMapping("/discount/create")
    public ResponseEntity<ResponseDto> createDiscount(@RequestBody DiscountRequestDTO request) {

        try {
            DiscountDTO discount = discountService.createDiscount(request);
            ResponseDto res = ResponseDto.builder()
                    .message("Descuento creado: " + discount.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear el descuento: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar un descuento
    @PutMapping("/discount/update/{id}")
    public ResponseEntity<ResponseDto> updateDiscount(@PathVariable UUID id, @RequestBody DiscountRequestDTO request) {

        try {
            DiscountDTO discount = discountService.updateDiscount(id, request);

            ResponseDto res = ResponseDto.builder()
                    .message("Descuento actualizado: " + discount.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar el descuento: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Eliminar un descuento
    @DeleteMapping("/discount/delete/{id}")
    public ResponseEntity<ResponseDto> deleteDiscount(@PathVariable UUID id) {

        try {
            discountService.deleteDiscount(id);

            ResponseDto res = ResponseDto.builder()
                    .message("Descuento eliminado: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al eliminar el descuento: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

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
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Boolean newArrival,
            HttpServletResponse response) {

        try {
            List<ProductDTO> productList = new ArrayList<>();

            if (StringUtils.isNotBlank(slug)) {
                ProductDTO productDto = productService.getProductBySlug(slug);
                productList.add(productDto);
            } else {
                productList = productService.getAllProducts(categoryId, typeId, name, minPrice, maxPrice, active,
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

    // Obtener un producto por id
    @GetMapping("/product/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {

        try {
            ProductDTO product = productService.getProductById(id);
            return new ResponseEntity<>(product, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener el producto: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Crear un nuevo producto
    @PostMapping("/product/create")
    public ResponseEntity<ResponseDto> createProduct(@RequestBody CreateProductDtoAdmin productDto) {

        try {
            ProductDTO product = productService.createProduct(productDto);
            ResponseDto res = ResponseDto.builder()
                    .message("Producto creado: " + product.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear el producto: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar un producto
    @PutMapping("/product/update/{id}")
    public ResponseEntity<ResponseDto> updateProduct(@PathVariable UUID id,
            @RequestBody CreateProductDtoAdmin request) {

        try {
            ProductDTO product = productService.updateProduct(id, request);

            ResponseDto res = ResponseDto.builder()
                    .message("Producto actualizado: " + product.getName())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar el producto: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Eliminar un producto
    @DeleteMapping("/product/delete/{id}")
    public ResponseEntity<ResponseDto> deleteProduct(@PathVariable UUID id) {

        try {
            productService.deleteProduct(id);

            ResponseDto res = ResponseDto.builder()
                    .message("Producto eliminado: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al eliminar el producto: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // --------------------------ROL ------------------------------------

    // Obtener a todos los roles
    @GetMapping("/role")
    public ResponseEntity<?> getAllRoles() {

        try {
            List<Authority> roles = authorityService.getAllRoles();
            return new ResponseEntity<>(roles, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener a los roles: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    // Obtener un rol por id
    @GetMapping("/role/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable UUID id) {

        try {
            Authority role = authorityService.getRoleById(id);
            return new ResponseEntity<>(role, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener el rol: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Crear un rol de usuario
    @PostMapping("/role/create")
    public ResponseEntity<ResponseDto> createRole(@RequestBody CreateRoleDto request) {

        try {
            Authority newRole = authorityService.createAuthority(request.getCode(), request.getDescription());

            ResponseDto res = ResponseDto.builder()
                    .message("Rol creado: " + newRole.getRoleCode())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear rol: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar un rol
    @PutMapping("/role/update/{id}")
    public ResponseEntity<ResponseDto> updateRole(@PathVariable UUID id,
            @RequestBody CreateRoleDto request) {

        try {
            Authority role = authorityService.updateRole(id, request.getCode(), request.getDescription());

            ResponseDto res = ResponseDto.builder()
                    .message("Rol actualizado: " + role.getRoleCode())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar el rol: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Eliminar un rol
    @DeleteMapping("/role/delete/{id}")
    public ResponseEntity<ResponseDto> deleteRole(@PathVariable UUID id) {

        try {
            authorityService.deleteRole(id);

            ResponseDto res = ResponseDto.builder()
                    .message("Rol eliminado: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al eliminar el rol: " + e.getMessage())
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

    // Crear una seccion de categorias
    @PostMapping("/product-sections/create")
    public ResponseEntity<ResponseDto> createProductSection(@RequestBody ProductSectionDTO request) {

        try {
            ProductSectionDTO newRole = configService.saveProductSection(request);

            ResponseDto res = ResponseDto.builder()
                    .message("Sección creado: " + newRole.getId())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear la sección: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar una secciión de categorias
    @PutMapping("/product-sections/update/{id}")
    public ResponseEntity<ResponseDto> updateProductSection(@PathVariable UUID id,
            @RequestBody ProductSectionDTO request) {

        try {
            configService.updateProductSection(id, request);

            ResponseDto res = ResponseDto.builder()
                    .message("Sección actualizado: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar la sección: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Eliminar una seccion de la pagina principal
    @DeleteMapping("/product-sections/delete/{id}")
    public ResponseEntity<ResponseDto> deleteProductSection(@PathVariable UUID id) {

        try {
            configService.deleteProductSection(id);

            ResponseDto res = ResponseDto.builder()
                    .message("Sección eliminada: " + id)
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al eliminar la sección: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // ------------------------------ USERS ----------------------------

    // Obtener a todos los usuarios
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {

        try {
            List<User> users = userService.getAllUsers();

            List<UserDetailsDto> userDetailsDtos = users.stream().map(u -> UserDetailsDto.builder()
                    .firstName(u.getFirstName().trim())
                    .lastName(u.getLastName().trim())
                    .email(u.getEmail().trim())
                    .profileImageUrl(u.getProfileImageUrl())
                    .phoneNumber(u.getPhoneNumber())
                    .authorityList(u.getAuthorities().stream()
                            .map(auth -> auth.getAuthority()).toList())
                    .build()).toList();

            return new ResponseEntity<>(userDetailsDtos, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener a los usuarios: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }
    }

    // Obtener un usuario por email
    @GetMapping("/users/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {

        try {
            User user = userService.getUserFindByEmail(email);

            UserDetailsDto response = UserDetailsDto.builder()
                    .firstName(user.getFirstName().trim())
                    .lastName(user.getLastName().trim())
                    .email(user.getEmail().trim())
                    .profileImageUrl(user.getProfileImageUrl())
                    .phoneNumber(user.getPhoneNumber())
                    .authorityList(user.getAuthorities().stream()
                            .map(auth -> auth.getAuthority()).toList())
                    .build();

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al obtener el rol: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Crear un usuario
    @PostMapping("/users/create")
    public ResponseEntity<ResponseDto> createUser(@RequestBody UserRequestDtoAdmin request) {

        try {
            User created = userService.createUserByAdmin(request);

            ResponseDto res = ResponseDto.builder()
                    .message("Usuario creado: " + created.getEmail())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al crear usuario: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // Actualizar un usuario
    @PutMapping("/users/update/{email}")
    public ResponseEntity<ResponseDto> updateUsers(@PathVariable String email,
            @RequestBody UserRequestDtoAdmin request) {

        try {

            User user = userService.UpdateUserByAdmin(email, request);

            ResponseDto res = ResponseDto.builder()
                    .message("Usuario actualizado: " + user.getEmail())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (RuntimeException e) {
            ResponseDto res = ResponseDto.builder()
                    .message("Error al actualizar el usuario: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
        }

    }

    // -------------- SLIDER ------------------------------------

    // Slider
    @GetMapping("/slider")
    public List<SliderImageDTO> listSlider() {
        return configService.getSliderImages();
    }

    @PostMapping("/slider")
    public SliderImageDTO createSlider(@RequestBody SliderImageDTO dto) {
        return configService.saveSlider(dto);
    }

    @DeleteMapping("/slider/{id}")
    public void deleteSlider(@PathVariable UUID id) {
        configService.deleteSlider(id);
    }

    // -------------- CATEGORY BUTTONS ------------------------------------

    // Categorías visibles
    @GetMapping("/categories-buttons")
    public List<CategoryButtonDTO> listCategoryButtons() {
        return configService.getCategoryButtons();
    }

    @PostMapping("/categories-buttons")
    public CategoryButtonDTO createCategoryButton(@RequestBody CategoryButtonDTO dto) {
        return configService.saveCategoryButton(dto);
    }

    @DeleteMapping("/categories-buttons/{id}")
    public void deleteCategoryButton(@PathVariable UUID id) {
        configService.deleteCategoryButton(id);
    }
}
