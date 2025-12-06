package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Category createCategory(Category category);
    Category updateCategory(Long categoryId, Category category);
    void deleteCategory(Long categoryId);
    Optional<Category> getCategoryById(Long categoryId);
    Optional<Category> getCategoryByName(String name);
    List<Category> getAllCategories();
    List<Category> getCategoriesByType(String type);
    List<Category> searchCategoriesByName(String name);
    List<Category> searchCategoriesByDescription(String description);
    boolean existsByName(String name);
}