package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.AssignStaff;
import pe.ucv.ucvbackend.persistence.entity.AsignacionPersonal;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.repository.AsignacionPersonalJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.IncidenciaJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.UsuarioJpaRepository;
import pe.ucv.ucvbackend.persistence.mapper.AssignStaffMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AssignStaffServiceImpl implements AssignStaffService {

    private static final Logger logger = LoggerFactory.getLogger(AssignStaffServiceImpl.class);
    private final AsignacionPersonalJpaRepository asignacionPersonalRepository;
    private final IncidenciaJpaRepository incidenciaRepository;
    private final UsuarioJpaRepository usuarioRepository;
    private final AssignStaffMapper assignStaffMapper;

    public AssignStaffServiceImpl(AsignacionPersonalJpaRepository asignacionPersonalRepository,
                                  IncidenciaJpaRepository incidenciaRepository,
                                  UsuarioJpaRepository usuarioRepository,
                                  AssignStaffMapper assignStaffMapper) {
        this.asignacionPersonalRepository = asignacionPersonalRepository;
        this.incidenciaRepository = incidenciaRepository;
        this.usuarioRepository = usuarioRepository;
        this.assignStaffMapper = assignStaffMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignStaff> getAllAssignments() {
        logger.info("Getting all staff assignments");
        return asignacionPersonalRepository.findAll()
                .stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AssignStaff> getAssignmentById(Long id) {
        logger.info("Getting assignment by ID: {}", id);
        return asignacionPersonalRepository.findById(id)
                .map(assignStaffMapper::toAssignStaff);
    }

    @Override
    public AssignStaff createAssignment(AssignStaff assignStaff) {
        logger.info("Creating new assignment for incident: {}", assignStaff.getIncidentId());

        // Validaciones
        if (assignStaff.getIncidentId() == null) {
            throw new IllegalArgumentException("El ID de incidencia es obligatorio");
        }
        if (assignStaff.getUserId() == null) {
            throw new IllegalArgumentException("El ID de usuario es obligatorio");
        }

        // Verificar si ya existe una asignación activa para esta incidencia
        if (hasActiveAssignmentForIncident(assignStaff.getIncidentId())) {
            throw new IllegalArgumentException("Ya existe una asignación activa para esta incidencia");
        }

        Incidencia incidente = incidenciaRepository.findById(assignStaff.getIncidentId())
                .orElseThrow(() -> new IllegalArgumentException("Incidencia no encontrada con ID: " + assignStaff.getIncidentId()));

        Usuario usuario = usuarioRepository.findById(assignStaff.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + assignStaff.getUserId()));

        AsignacionPersonal asignacionPersonal = assignStaffMapper.toAsignacionPersonalWithRelations(
                assignStaff, incidente, usuario);

        // Establecer fecha de registro si no viene
        if (asignacionPersonal.getFechaRegistro() == null) {
            asignacionPersonal.setFechaRegistro(java.time.LocalDateTime.now());
        }

        // Establecer estado por defecto si no viene
        if (asignacionPersonal.getEstado() == null) {
            asignacionPersonal.setEstado("Pendiente");
        }

        AsignacionPersonal saved = asignacionPersonalRepository.save(asignacionPersonal);
        return assignStaffMapper.toAssignStaff(saved);
    }

    @Override
    public AssignStaff updateAssignment(Long id, AssignStaff assignStaff) {
        logger.info("Updating assignment with ID: {}", id);

        // Verificar que la asignación exista
        AsignacionPersonal asignacionExistente = asignacionPersonalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));

        Incidencia incidente = incidenciaRepository.findById(assignStaff.getIncidentId())
                .orElseThrow(() -> new IllegalArgumentException("Incidencia no encontrada con ID: " + assignStaff.getIncidentId()));

        Usuario usuario = usuarioRepository.findById(assignStaff.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + assignStaff.getUserId()));

        asignacionExistente.setUsuarioAsignado(assignStaff.getAssignedUser());
        asignacionExistente.setFechaSolucion(assignStaff.getDateSolution());
        asignacionExistente.setDescripcion(assignStaff.getDescription());
        asignacionExistente.setEstado(assignStaff.getStatus());

        asignacionExistente.setIncidente(incidente);
        asignacionExistente.setUsuario(usuario);

        AsignacionPersonal updated = asignacionPersonalRepository.save(asignacionExistente);
        return assignStaffMapper.toAssignStaff(updated);
    }

    @Override
    public AssignStaff updateAssignmentStatus(Long id, String status, String description) {
        logger.info("Updating assignment status to: {} for ID: {}", status, id);

        AsignacionPersonal asignacion = asignacionPersonalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));

        asignacion.setEstado(status);
        if (description != null) {
            asignacion.setDescripcion(description);
        }

        // Si el estado es "Resuelto", establecer fecha de solución
        if ("Resuelto".equals(status)) {
            asignacion.setFechaSolucion(java.time.LocalDate.now());
        }

        AsignacionPersonal updated = asignacionPersonalRepository.save(asignacion);
        return assignStaffMapper.toAssignStaff(updated);
    }

    @Override
    public void deleteAssignment(Long id) {
        logger.info("Deleting assignment with ID: {}", id);

        // Verificar que la asignación exista
        if (!asignacionPersonalRepository.existsById(id)) {
            throw new RuntimeException("Asignación no encontrada con ID: " + id);
        }

        asignacionPersonalRepository.deleteById(id);
    }


    @Override
    @Transactional(readOnly = true)
    public List<AssignStaff> getAssignmentsByIncidentId(Long incidentId) {
        logger.info("Getting assignments by incident ID: {}", incidentId);
        return asignacionPersonalRepository.findByIncidenteId(incidentId)
                .stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignStaff> getAssignmentsByUserId(Long userId) {
        logger.info("Getting assignments by user ID: {}", userId);
        return asignacionPersonalRepository.findByUsuarioId(userId)
                .stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignStaff> getAssignmentsByStatus(String status) {
        logger.info("Getting assignments by status: {}", status);
        return asignacionPersonalRepository.findByEstado(status)
                .stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignStaff> getAssignmentsByAssignedUser(String assignedUser) {
        logger.info("Getting assignments by assigned user: {}", assignedUser);
        return asignacionPersonalRepository.findByUsuarioAsignadoContainingIgnoreCase(assignedUser)
                .stream()
                .map(assignStaffMapper::toAssignStaff)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveAssignmentForIncident(Long incidentId) {
        return asignacionPersonalRepository.existsByIncidenteIdAndEstado(incidentId, "Pendiente") ||
                asignacionPersonalRepository.existsByIncidenteIdAndEstado(incidentId, "En Proceso");
    }
}