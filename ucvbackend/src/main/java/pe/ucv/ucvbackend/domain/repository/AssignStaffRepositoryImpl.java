package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.AssignStaff;
import pe.ucv.ucvbackend.persistence.entity.AsignacionPersonal;
import pe.ucv.ucvbackend.persistence.mapper.AssignStaffMapper;
import pe.ucv.ucvbackend.persistence.repository.AsignacionPersonalJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AssignStaffRepositoryImpl implements AssignStaffRepository {

    private final AsignacionPersonalJpaRepository asignacionPersonalJpaRepository;
    private final AssignStaffMapper assignStaffMapper;

    public AssignStaffRepositoryImpl(AsignacionPersonalJpaRepository asignacionPersonalJpaRepository,
                                     AssignStaffMapper assignStaffMapper) {
        this.asignacionPersonalJpaRepository = asignacionPersonalJpaRepository;
        this.assignStaffMapper = assignStaffMapper;
    }

    @Override
    public List<AssignStaff> findAll() {
        List<AsignacionPersonal> asignaciones = asignacionPersonalJpaRepository.findAll();
        return asignaciones.stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    public Optional<AssignStaff> findById(Long id) {
        return asignacionPersonalJpaRepository.findById(id)
                .map(assignStaffMapper::toAssignStaff);
    }

    @Override
    public AssignStaff save(AssignStaff assignStaff) {
        AsignacionPersonal asignacionPersonal = assignStaffMapper.toAsignacionPersonal(assignStaff);
        AsignacionPersonal savedAsignacion = asignacionPersonalJpaRepository.save(asignacionPersonal);
        return assignStaffMapper.toAssignStaff(savedAsignacion);
    }

    @Override
    public void deleteById(Long id) {
        asignacionPersonalJpaRepository.deleteById(id);
    }

    @Override
    public List<AssignStaff> findByIncidentId(Long incidentId) {
        List<AsignacionPersonal> asignaciones = asignacionPersonalJpaRepository.findByIncidenteId(incidentId);
        return asignaciones.stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    public List<AssignStaff> findByUserId(Long userId) {
        List<AsignacionPersonal> asignaciones = asignacionPersonalJpaRepository.findByUsuarioId(userId);
        return asignaciones.stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    public List<AssignStaff> findByStatus(String status) {
        List<AsignacionPersonal> asignaciones = asignacionPersonalJpaRepository.findByEstado(status);
        return asignaciones.stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    public List<AssignStaff> findByAssignedUserContainingIgnoreCase(String assignedUser) {
        List<AsignacionPersonal> asignaciones = asignacionPersonalJpaRepository.findByUsuarioAsignadoContainingIgnoreCase(assignedUser);
        return asignaciones.stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    public boolean existsByIncidentIdAndStatus(Long incidentId, String status) {
        return asignacionPersonalJpaRepository.findByIncidenteId(incidentId).stream()
                .anyMatch(asignacion -> status.equals(asignacion.getEstado()));
    }
}