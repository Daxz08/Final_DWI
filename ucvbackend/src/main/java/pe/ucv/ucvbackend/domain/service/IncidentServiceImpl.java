package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.repository.IncidenciaJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.CategoriaJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.DepartamentoJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.UsuarioJpaRepository;
import pe.ucv.ucvbackend.persistence.mapper.IncidentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IncidentServiceImpl implements IncidentService {

    private static final Logger logger = LoggerFactory.getLogger(IncidentServiceImpl.class);
    private final IncidenciaJpaRepository incidenciaRepository;
    private final CategoriaJpaRepository categoriaRepository;
    private final DepartamentoJpaRepository departamentoRepository;
    private final UsuarioJpaRepository usuarioRepository;
    private final IncidentMapper incidentMapper;

    public IncidentServiceImpl(IncidenciaJpaRepository incidenciaRepository,
                               CategoriaJpaRepository categoriaRepository,
                               DepartamentoJpaRepository departamentoRepository,
                               UsuarioJpaRepository usuarioRepository,
                               IncidentMapper incidentMapper) {
        this.incidenciaRepository = incidenciaRepository;
        this.categoriaRepository = categoriaRepository;
        this.departamentoRepository = departamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.incidentMapper = incidentMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getAllIncidents() {
        logger.info("Getting all incidents");
        return incidenciaRepository.findAll()
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Incident> getIncidentById(Long id) {
        logger.info("Getting incident by ID: {}", id);
        return incidenciaRepository.findById(id)
                .map(incidentMapper::toIncident);
    }

    @Override
    public Incident createIncident(Incident incident) {
        logger.info("Creating new incident in area: {}", incident.getArea());

        // Validaciones
        if (incident.getCategoryId() == null) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }
        if (incident.getDepartmentId() == null) {
            throw new IllegalArgumentException("El departamento es obligatorio");
        }
        if (incident.getUserId() == null) {
            throw new IllegalArgumentException("El usuario es obligatorio");
        }

        // ✅ BUSCAR ENTIDADES RELACIONADAS
        Categoria categoria = categoriaRepository.findById(incident.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + incident.getCategoryId()));

        Departamento departamento = departamentoRepository.findById(incident.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Departamento no encontrado con ID: " + incident.getDepartmentId()));

        Usuario usuario = usuarioRepository.findById(incident.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + incident.getUserId()));

        // ✅ USAR MÉTODO HELPER CON RELACIONES
        Incidencia incidencia = incidentMapper.toIncidenciaWithRelations(
                incident, categoria, departamento, usuario);

        // Establecer fecha de registro si no viene
        if (incidencia.getFechaRegistro() == null) {
            incidencia.setFechaRegistro(java.time.LocalDateTime.now());
        }

        // Establecer fecha de incidencia si no viene
        if (incidencia.getFechaIncidencia() == null) {
            incidencia.setFechaIncidencia(java.time.LocalDate.now());
        }

        Incidencia savedIncidencia = incidenciaRepository.save(incidencia);
        return incidentMapper.toIncident(savedIncidencia);
    }

    @Override
    public Incident updateIncident(Long id, Incident incident) {
        logger.info("Updating incident with ID: {}", id);

        // Verificar que la incidencia exista
        Incidencia incidenciaExistente = incidenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada con ID: " + id));

        // ✅ BUSCAR NUEVAS ENTIDADES RELACIONADAS (si cambiaron)
        Categoria categoria = categoriaRepository.findById(incident.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + incident.getCategoryId()));

        Departamento departamento = departamentoRepository.findById(incident.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Departamento no encontrado con ID: " + incident.getDepartmentId()));

        Usuario usuario = usuarioRepository.findById(incident.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + incident.getUserId()));

        // ✅ ACTUALIZAR CAMPOS
        incidenciaExistente.setArea(incident.getArea());
        incidenciaExistente.setDescription(incident.getDescription());
        incidenciaExistente.setFechaIncidencia(incident.getIncidentDate());
        incidenciaExistente.setNivelPrioridad(incident.getPriorityLevel());
        incidenciaExistente.setUsuarioRegistro(incident.getRegisteredUser());

        // ✅ ACTUALIZAR RELACIONES
        incidenciaExistente.setCategoria(categoria);
        incidenciaExistente.setDepartamento(departamento);
        incidenciaExistente.setUsuario(usuario);

        Incidencia updatedIncidencia = incidenciaRepository.save(incidenciaExistente);
        return incidentMapper.toIncident(updatedIncidencia);
    }

    @Override
    public void deleteIncident(Long id) {
        logger.info("Deleting incident with ID: {}", id);

        // Verificar que la incidencia exista
        if (!incidenciaRepository.existsById(id)) {
            throw new RuntimeException("Incidencia no encontrada con ID: " + id);
        }

        incidenciaRepository.deleteById(id);
    }

    // ✅ MÉTODOS DE FILTROS (se mantienen igual)
    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByArea(String area) {
        logger.info("Getting incidents by area: {}", area);
        return incidenciaRepository.findByAreaContainingIgnoreCase(area)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByPriorityLevel(String priorityLevel) {
        logger.info("Getting incidents by priority level: {}", priorityLevel);
        return incidenciaRepository.findByNivelPrioridad(priorityLevel)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByUserId(Long userId) {
        logger.info("Getting incidents by user ID: {}", userId);
        return incidenciaRepository.findByUsuarioId(userId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByCategoryId(Long categoryId) {
        logger.info("Getting incidents by category ID: {}", categoryId);
        return incidenciaRepository.findByCategoriaId(categoryId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByDepartmentId(Long departmentId) {
        logger.info("Getting incidents by department ID: {}", departmentId);
        return incidenciaRepository.findByDepartamentoId(departmentId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }
}