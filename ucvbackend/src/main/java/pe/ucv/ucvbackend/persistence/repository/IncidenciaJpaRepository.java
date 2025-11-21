package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidenciaJpaRepository extends JpaRepository<Incidencia, Long> {
    List<Incidencia> findByAreaContainingIgnoreCase(String area);
    List<Incidencia> findByNivelPrioridad(String nivelPrioridad);

    // ✅ NUEVOS MÉTODOS USANDO RELACIONES
    List<Incidencia> findByUsuarioId(Long usuarioId);
    List<Incidencia> findByCategoriaId(Long categoriaId);
    List<Incidencia> findByDepartamentoId(Long departamentoId);

    // ✅ OPCIONAL: Métodos usando objetos de relación
    List<Incidencia> findByCategoria_Id(Long categoriaId);
    List<Incidencia> findByDepartamento_Id(Long departamentoId);
    List<Incidencia> findByUsuario_Id(Long usuarioId);
}