package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RolJpaRepository extends JpaRepository<Rol, Long> {

    // Query methods derivados - sin @Query
    Optional<Rol> findByNombre(String nombre);
    List<Rol> findByNombreContainingIgnoreCase(String nombre);
    List<Rol> findByDescripcionContainingIgnoreCase(String descripcion);
    boolean existsByNombre(String nombre);
}