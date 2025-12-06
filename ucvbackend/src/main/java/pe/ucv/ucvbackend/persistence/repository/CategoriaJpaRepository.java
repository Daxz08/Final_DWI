package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaJpaRepository extends JpaRepository<Categoria, Long> {

    // Query methods derivados - sin @Query
    Optional<Categoria> findByNombre(String nombre);
    List<Categoria> findByTipo(String tipo);
    List<Categoria> findByNombreContainingIgnoreCase(String nombre);
    List<Categoria> findByDescripcionContainingIgnoreCase(String descripcion);
    List<Categoria> findByTipoContainingIgnoreCase(String tipo);
    boolean existsByNombre(String nombre);
    List<Categoria> findByNombreAndTipo(String nombre, String tipo);
}