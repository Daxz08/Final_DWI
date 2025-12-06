package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    Category save(Category category);
    Optional<Category> findById(Long id);
    Optional<Category> findByName(String name);
    List<Category> findAll();
    List<Category> findByType(String type);
    List<Category> findByNameContaining(String name);
    List<Category> findByDescriptionContaining(String description);
    List<Category> findByTypeContaining(String type);
    boolean existsByName(String name);
    List<Category> findByNameAndType(String name, String type);
    void deleteById(Long id);
}