package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoJpaRepository extends JpaRepository<Empleado, Long> {

    // Query methods derivados - sin @Query
    Optional<Empleado> findByCorreo(String correo);
    List<Empleado> findByRolId(Long rolId);
    List<Empleado> findByEstadoDisponibilidad(Empleado.EstadoDisponibilidad estado);
    List<Empleado> findByEspecialidadContainingIgnoreCase(String especialidad);
    List<Empleado> findByNombreContainingIgnoreCase(String nombre);
    List<Empleado> findByApellidosContainingIgnoreCase(String apellidos);
    List<Empleado> findByIncidenciasActivasGreaterThanEqual(Integer minIncidencias);
    List<Empleado> findByIncidenciasActivasLessThan(Integer maxIncidencias);
    boolean existsByCorreo(String correo);
    List<Empleado> findByRolIdAndEstadoDisponibilidad(Long rolId, Empleado.EstadoDisponibilidad estado);
}