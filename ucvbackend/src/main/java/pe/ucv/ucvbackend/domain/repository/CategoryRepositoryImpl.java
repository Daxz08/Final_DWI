package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Category;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import pe.ucv.ucvbackend.persistence.mapper.CategoryMapper;
import pe.ucv.ucvbackend.persistence.repository.CategoriaJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    private final CategoriaJpaRepository categoriaJpaRepository;
    private final CategoryMapper categoryMapper;

    public CategoryRepositoryImpl(CategoriaJpaRepository categoriaJpaRepository, CategoryMapper categoryMapper) {
        this.categoriaJpaRepository = categoriaJpaRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<Category> findAll() {
        List<Categoria> categorias = categoriaJpaRepository.findAll();
        return categorias.stream()
                .map(categoryMapper::toCategory)
                .toList();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoriaJpaRepository.findById(id)
                .map(categoryMapper::toCategory);
    }

    @Override
    public Category save(Category category) {
        Categoria categoria = categoryMapper.toCategoria(category);
        Categoria savedCategoria = categoriaJpaRepository.save(categoria);
        return categoryMapper.toCategory(savedCategoria);
    }

    @Override
    public void deleteById(Long id) {
        categoriaJpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return categoriaJpaRepository.existsByCategory(name);
    }

    @Override
    public boolean existsById(Long id) {
        return categoriaJpaRepository.existsById(id);
    }
}