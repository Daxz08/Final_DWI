package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.AsignacionPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionPersonalJpaRepository extends JpaRepository<AsignacionPersonal, Long> {

    // Métodos existentes
    List<AsignacionPersonal> findByEstado(String estado);
    List<AsignacionPersonal> findByUsuarioAsignadoContainingIgnoreCase(String usuarioAsignado);

    // ✅ NUEVOS MÉTODOS USANDO RELACIONES
    List<AsignacionPersonal> findByIncidenteId(Long incidenteId);
    List<AsignacionPersonal> findByUsuarioId(Long usuarioId);

    // ✅ MÉTODO QUE FALTA PARA hasActiveAssignmentForIncident
    boolean existsByIncidenteIdAndEstado(Long incidenteId, String estado);

    // ✅ OPCIONAL: Métodos usando objetos de relación
    List<AsignacionPersonal> findByIncidente_Id(Long incidenteId);
    List<AsignacionPersonal> findByUsuario_Id(Long usuarioId);
}