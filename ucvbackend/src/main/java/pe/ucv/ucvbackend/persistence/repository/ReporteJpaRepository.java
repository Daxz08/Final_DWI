package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReporteJpaRepository extends JpaRepository<Reporte, Long> {

    // Query methods derivados - sin @Query
    Optional<Reporte> findByIncidenciaId(Long incidenciaId);
    List<Reporte> findByEmpleadoId(Long empleadoId);
    List<Reporte> findByEstadoIncidencia(Reporte.EstadoIncidencia estado);
    List<Reporte> findByFechaRegistroBetween(LocalDateTime start, LocalDateTime end);
    List<Reporte> findByEmpleadoIdAndEstadoIncidencia(Long empleadoId, Reporte.EstadoIncidencia estado);
    List<Reporte> findByFechaRegistroAfter(LocalDateTime fecha);
    List<Reporte> findByFechaRegistroBefore(LocalDateTime fecha);
    List<Reporte> findByDescripcionContainingIgnoreCase(String descripcion);
    List<Reporte> findByAccionesContainingIgnoreCase(String acciones);
    List<Reporte> findByEmpleadoIdAndFechaRegistroBetween(Long empleadoId, LocalDateTime start, LocalDateTime end);
    boolean existsByIncidenciaId(Long incidenciaId);
}