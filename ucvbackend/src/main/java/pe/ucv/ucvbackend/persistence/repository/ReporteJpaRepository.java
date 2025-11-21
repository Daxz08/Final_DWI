package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Reporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReporteJpaRepository extends JpaRepository<Reporte, Long> {
    List<Reporte> findByStatus(String status);

    // ✅ NUEVOS MÉTODOS USANDO RELACIONES
    List<Reporte> findByAsignacionPersonalId(Long asignacionPersonalId);
    List<Reporte> findByUsuarioId(Long usuarioId);

    // ✅ OPCIONAL: Métodos usando objetos de relación
    List<Reporte> findByAsignacionPersonal_Id(Long asignacionPersonalId);
    List<Reporte> findByUsuario_Id(Long usuarioId);
}