package pe.ucv.ucvbackend.domain.service.impl;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.domain.Incident.PriorityLevel;
import pe.ucv.ucvbackend.domain.service.IncidentService;
import pe.ucv.ucvbackend.domain.repository.IncidentRepository;
import pe.ucv.ucvbackend.domain.repository.UserRepository;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import pe.ucv.ucvbackend.domain.repository.CategoryRepository;
import pe.ucv.ucvbackend.domain.repository.DepartmentRepository;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import pe.ucv.ucvbackend.persistence.entity.Empleado;
import pe.ucv.ucvbackend.persistence.repository.IncidenciaJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.UsuarioJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.CategoriaJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.DepartamentoJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.EmpleadoJpaRepository;
import pe.ucv.ucvbackend.persistence.mapper.IncidentMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;

    // Nuevos: Repositorios de persistencia para cargar entidades completas
    private final IncidenciaJpaRepository incidenciaJpaRepository;
    private final UsuarioJpaRepository usuarioJpaRepository;
    private final CategoriaJpaRepository categoriaJpaRepository;
    private final DepartamentoJpaRepository departamentoJpaRepository;
    private final EmpleadoJpaRepository empleadoJpaRepository;

    private final IncidentMapper incidentMapper;

    public IncidentServiceImpl(IncidentRepository incidentRepository,
                               UserRepository userRepository,
                               EmployeeRepository employeeRepository,
                               CategoryRepository categoryRepository,
                               DepartmentRepository departmentRepository,
                               IncidenciaJpaRepository incidenciaJpaRepository,
                               UsuarioJpaRepository usuarioJpaRepository,
                               CategoriaJpaRepository categoriaJpaRepository,
                               DepartamentoJpaRepository departamentoJpaRepository,
                               EmpleadoJpaRepository empleadoJpaRepository,
                               IncidentMapper incidentMapper) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.categoryRepository = categoryRepository;
        this.departmentRepository = departmentRepository;
        this.incidenciaJpaRepository = incidenciaJpaRepository;
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.categoriaJpaRepository = categoriaJpaRepository;
        this.departamentoJpaRepository = departamentoJpaRepository;
        this.empleadoJpaRepository = empleadoJpaRepository;
        this.incidentMapper = incidentMapper;
    }

    @Override
    public Incident createIncident(Incident incident) {
        // Validar y cargar entidades COMPLETAS desde la base de datos
        Usuario usuarioEntity = null;
        if (incident.getUserId() != null) {
            usuarioEntity = usuarioJpaRepository.findById(incident.getUserId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + incident.getUserId()));
        }

        Categoria categoriaEntity = null;
        if (incident.getCategoryId() != null) {
            categoriaEntity = categoriaJpaRepository.findById(incident.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + incident.getCategoryId()));
        }

        Departamento departamentoEntity = null;
        if (incident.getDepartmentId() != null) {
            departamentoEntity = departamentoJpaRepository.findById(incident.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado con ID: " + incident.getDepartmentId()));
        }

        Empleado empleadoEntity = null;
        if (incident.getEmployeeId() != null) {
            empleadoEntity = empleadoJpaRepository.findById(incident.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + incident.getEmployeeId()));
        }

        // Establecer fechas por defecto
        if (incident.getIncidentDate() == null) {
            incident.setIncidentDate(LocalDate.now());
        }
        if (incident.getRegistrationDate() == null) {
            incident.setRegistrationDate(LocalDateTime.now());
        }
        // Convertir a entidad JPA
        Incidencia incidenciaEntity = incidentMapper.toIncidencia(incident);

        // Asignar las entidades COMPLETAS (managed)
        incidenciaEntity.setUsuario(usuarioEntity);
        incidenciaEntity.setCategoria(categoriaEntity);
        incidenciaEntity.setDepartamento(departamentoEntity);
        incidenciaEntity.setEmpleado(empleadoEntity);

        // 🔥 NUEVO: Asignar prioridad como NULL o valor por defecto
        incidenciaEntity.setNivelPrioridad(null); // O un valor por defecto como "pendiente"

        // Guardar
        Incidencia savedIncidencia = incidenciaJpaRepository.save(incidenciaEntity);

        return incidentMapper.toIncident(savedIncidencia);
    }

    @Override
    public Incident updateIncident(Long incidentId, Incident incident) {
        // Primero obtener la entidad existente de persistencia
        Incidencia existingIncidencia = incidenciaJpaRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada con ID: " + incidentId));

        // Actualizar campos básicos
        existingIncidencia.setArea(incident.getArea());
        existingIncidencia.setDescripcion(incident.getDescription());
        existingIncidencia.setFechaIncidencia(incident.getIncidentDate());

        // Validar y actualizar relaciones con entidades COMPLETAS
        if (incident.getCategoryId() != null) {
            Categoria categoriaEntity = categoriaJpaRepository.findById(incident.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + incident.getCategoryId()));
            existingIncidencia.setCategoria(categoriaEntity);
        }

        if (incident.getDepartmentId() != null) {
            Departamento departamentoEntity = departamentoJpaRepository.findById(incident.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado con ID: " + incident.getDepartmentId()));
            existingIncidencia.setDepartamento(departamentoEntity);
        }

        if (incident.getEmployeeId() != null) {
            Empleado empleadoEntity = empleadoJpaRepository.findById(incident.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + incident.getEmployeeId()));
            existingIncidencia.setEmpleado(empleadoEntity);
        }

        // Guardar cambios
        Incidencia updatedIncidencia = incidenciaJpaRepository.save(existingIncidencia);

        return incidentMapper.toIncident(updatedIncidencia);
    }

    @Override
    public void deleteIncident(Long incidentId) {
        if (!incidenciaJpaRepository.existsById(incidentId)) {
            throw new RuntimeException("Incidencia no encontrada con ID: " + incidentId);
        }
        incidenciaJpaRepository.deleteById(incidentId);
    }

    @Override
    public Optional<Incident> getIncidentById(Long incidentId) {
        return incidenciaJpaRepository.findById(incidentId)
                .map(incidentMapper::toIncident);
    }

    @Override
    public List<Incident> getAllIncidents() {
        return incidenciaJpaRepository.findAll()
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> getIncidentsByUserId(Long userId) {
        return incidenciaJpaRepository.findByUsuarioId(userId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> getIncidentsByEmployeeId(Long employeeId) {
        return incidenciaJpaRepository.findByEmpleadoId(employeeId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> getIncidentsByCategoryId(Long categoryId) {
        return incidenciaJpaRepository.findByCategoriaId(categoryId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> getIncidentsByDepartmentId(Long departmentId) {
        return incidenciaJpaRepository.findByDepartamentoId(departmentId)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> getIncidentsByPriority(PriorityLevel priority) {
        // Convertir PriorityLevel domain a NivelPrioridad persistence
        Incidencia.NivelPrioridad nivelPrioridad = convertPriorityToNivel(priority);
        return incidenciaJpaRepository.findByNivelPrioridad(nivelPrioridad)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> getIncidentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return incidenciaJpaRepository.findByFechaIncidenciaBetween(startDate, endDate)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public Incident assignIncidentToEmployee(Long incidentId, Long employeeId, PriorityLevel priority) {
        Incidencia incidencia = incidenciaJpaRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada con ID: " + incidentId));

        Empleado empleadoEntity = empleadoJpaRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + employeeId));

        incidencia.setEmpleado(empleadoEntity);

        if (priority != null) {
            Incidencia.NivelPrioridad nivelPrioridad = convertPriorityToNivel(priority);
            incidencia.setNivelPrioridad(nivelPrioridad);
        }

        Incidencia savedIncidencia = incidenciaJpaRepository.save(incidencia);
        return incidentMapper.toIncident(savedIncidencia);
    }

    @Override
    public List<Incident> searchIncidentsByArea(String area) {
        return incidenciaJpaRepository.findByAreaContainingIgnoreCase(area)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> searchIncidentsByDescription(String description) {
        return incidenciaJpaRepository.findByDescripcionContainingIgnoreCase(description)
                .stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public long getIncidentCountByEmployeeAndDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return incidenciaJpaRepository.countByEmpleadoIdAndFechaIncidenciaBetween(employeeId, startDate, endDate);
    }

    @Override
    public List<Incident> getUnassignedIncidents() {
        return incidenciaJpaRepository.findAll()
                .stream()
                .filter(incidencia -> incidencia.getEmpleado() == null)
                .map(incidentMapper::toIncident)
                .toList();
    }

    // Método auxiliar para convertir PriorityLevel a NivelPrioridad
    private Incidencia.NivelPrioridad convertPriorityToNivel(PriorityLevel priorityLevel) {
        if (priorityLevel == null) return Incidencia.NivelPrioridad.media;
        return switch (priorityLevel) {
            case LOW -> Incidencia.NivelPrioridad.baja;
            case MEDIUM -> Incidencia.NivelPrioridad.media;
            case HIGH -> Incidencia.NivelPrioridad.alta;
        };
    }
}