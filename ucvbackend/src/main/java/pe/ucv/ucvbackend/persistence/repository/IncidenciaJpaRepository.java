package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidenciaJpaRepository extends JpaRepository<Incidencia, Long> {

    // Query methods derivados - sin @Query
    List<Incidencia> findByUsuarioId(Long usuarioId);
    List<Incidencia> findByEmpleadoId(Long empleadoId);
    List<Incidencia> findByCategoriaId(Long categoriaId);
    List<Incidencia> findByDepartamentoId(Long departamentoId);
    List<Incidencia> findByNivelPrioridad(Incidencia.NivelPrioridad prioridad);
    List<Incidencia> findByFechaIncidencia(LocalDate fecha);
    List<Incidencia> findByFechaIncidenciaBetween(LocalDate start, LocalDate end);
    List<Incidencia> findByFechaRegistroBetween(LocalDateTime start, LocalDateTime end);
    List<Incidencia> findByAreaContainingIgnoreCase(String area);
    List<Incidencia> findByDescripcionContainingIgnoreCase(String descripcion);
    List<Incidencia> findByUsuarioIdAndFechaIncidenciaBetween(Long usuarioId, LocalDate start, LocalDate end);
    List<Incidencia> findByEmpleadoIdAndNivelPrioridad(Long empleadoId, Incidencia.NivelPrioridad prioridad);
    List<Incidencia> findByUsuarioIdAndCategoriaId(Long usuarioId, Long categoriaId);
    long countByEmpleadoIdAndFechaIncidenciaBetween(Long empleadoId, LocalDate start, LocalDate end);
}