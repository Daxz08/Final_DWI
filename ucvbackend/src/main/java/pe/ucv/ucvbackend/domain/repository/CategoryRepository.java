package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Category;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository {
    List<Category> findAll();
    Optional<Category> findById(Long id);
    Category save(Category category);
    void deleteById(Long id);
    boolean existsByName(String name);
    boolean existsById(Long id);
}