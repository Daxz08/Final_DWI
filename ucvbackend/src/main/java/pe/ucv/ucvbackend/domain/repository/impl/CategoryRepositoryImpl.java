package pe.ucv.ucvbackend.domain.repository.impl;

import pe.ucv.ucvbackend.domain.Category;
import pe.ucv.ucvbackend.domain.repository.CategoryRepository;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import pe.ucv.ucvbackend.persistence.mapper.CategoryMapper;
import pe.ucv.ucvbackend.persistence.repository.CategoriaJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class CategoryRepositoryImpl implements CategoryRepository {

    private final CategoriaJpaRepository categoriaJpaRepository;
    private final CategoryMapper categoryMapper;

    public CategoryRepositoryImpl(CategoriaJpaRepository categoriaJpaRepository, CategoryMapper categoryMapper) {
        this.categoriaJpaRepository = categoriaJpaRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public Category save(Category category) {
        Categoria categoria = categoryMapper.toCategoria(category);
        Categoria savedCategoria = categoriaJpaRepository.save(categoria);
        return categoryMapper.toCategory(savedCategoria);
    }

    @Override
    public Optional<Category> findById(Long id) {
        return categoriaJpaRepository.findById(id)
                .map(categoryMapper::toCategory);
    }

    @Override
    public Optional<Category> findByName(String name) {
        return categoriaJpaRepository.findByNombre(name)
                .map(categoryMapper::toCategory);
    }

    @Override
    public List<Category> findAll() {
        return categoriaJpaRepository.findAll()
                .stream()
                .map(categoryMapper::toCategory)
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> findByType(String type) {
        return categoriaJpaRepository.findByTipo(type)
                .stream()
                .map(categoryMapper::toCategory)
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> findByNameContaining(String name) {
        return categoriaJpaRepository.findByNombreContainingIgnoreCase(name)
                .stream()
                .map(categoryMapper::toCategory)
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> findByDescriptionContaining(String description) {
        return categoriaJpaRepository.findByDescripcionContainingIgnoreCase(description)
                .stream()
                .map(categoryMapper::toCategory)
                .collect(Collectors.toList());
    }

    @Override
    public List<Category> findByTypeContaining(String type) {
        return categoriaJpaRepository.findByTipoContainingIgnoreCase(type)
                .stream()
                .map(categoryMapper::toCategory)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return categoriaJpaRepository.existsByNombre(name);
    }

    @Override
    public List<Category> findByNameAndType(String name, String type) {
        return categoriaJpaRepository.findByNombreAndTipo(name, type)
                .stream()
                .map(categoryMapper::toCategory)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        categoriaJpaRepository.deleteById(id);
    }
}