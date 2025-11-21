package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Category;
import pe.ucv.ucvbackend.domain.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        logger.info("Getting all categories");
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        logger.info("Getting category by ID: {}", id);
        return categoryRepository.findById(id);
    }

    @Override
    public Category createCategory(Category category) {
        logger.info("Creating new category: {}", category.getName());

        // Validar que no exista una categoría con el mismo nombre
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + category.getName());
        }
        if (category.getRegisteredDate() == null) {
            category.setRegisteredDate(java.time.LocalDateTime.now());
        }

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        logger.info("Updating category with ID: {}", id);

        // Verificar que la categoría exista
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        // Validar nombre único
        if (!existingCategory.getName().equals(category.getName()) &&
                categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + category.getName());
        }
        // Actualizar campos
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setPriorityLevel(category.getPriorityLevel());
        existingCategory.setType(category.getType());

        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        logger.info("Deleting category with ID: {}", id);

        // Verificar que la categoría exista
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + id);
        }

        categoryRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}