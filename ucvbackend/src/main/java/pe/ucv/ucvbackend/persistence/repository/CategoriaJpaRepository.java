package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoriaJpaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByCategory(String category);
    boolean existsByCategory(String category);
}