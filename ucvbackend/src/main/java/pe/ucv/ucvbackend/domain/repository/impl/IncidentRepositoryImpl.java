package pe.ucv.ucvbackend.domain.repository.impl;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.domain.repository.IncidentRepository;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.mapper.IncidentMapper;
import pe.ucv.ucvbackend.persistence.repository.IncidenciaJpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class IncidentRepositoryImpl implements IncidentRepository {

    private final IncidenciaJpaRepository incidenciaJpaRepository;
    private final IncidentMapper incidentMapper;

    public IncidentRepositoryImpl(IncidenciaJpaRepository incidenciaJpaRepository, IncidentMapper incidentMapper) {
        this.incidenciaJpaRepository = incidenciaJpaRepository;
        this.incidentMapper = incidentMapper;
    }

    @Override
    public Incident save(Incident incident) {
        Incidencia incidencia = incidentMapper.toIncidencia(incident);
        Incidencia savedIncidencia = incidenciaJpaRepository.save(incidencia);
        return incidentMapper.toIncident(savedIncidencia);
    }

    @Override
    public Optional<Incident> findById(Long id) {
        return incidenciaJpaRepository.findById(id)
                .map(incidentMapper::toIncident);
    }

    @Override
    public List<Incident> findAll() {
        return incidenciaJpaRepository.findAll()
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByUserId(Long userId) {
        return incidenciaJpaRepository.findByUsuarioId(userId)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByEmployeeId(Long employeeId) {
        return incidenciaJpaRepository.findByEmpleadoId(employeeId)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByCategoryId(Long categoryId) {
        return incidenciaJpaRepository.findByCategoriaId(categoryId)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByDepartmentId(Long departmentId) {
        return incidenciaJpaRepository.findByDepartamentoId(departmentId)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByPriorityLevel(Incident.PriorityLevel priority) {
        Incidencia.NivelPrioridad nivel = mapToEntityPriority(priority);
        return incidenciaJpaRepository.findByNivelPrioridad(nivel)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByIncidentDate(LocalDate date) {
        return incidenciaJpaRepository.findByFechaIncidencia(date)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByIncidentDateBetween(LocalDate start, LocalDate end) {
        return incidenciaJpaRepository.findByFechaIncidenciaBetween(start, end)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByRegistrationDateBetween(LocalDateTime start, LocalDateTime end) {
        return incidenciaJpaRepository.findByFechaRegistroBetween(start, end)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByAreaContaining(String area) {
        return incidenciaJpaRepository.findByAreaContainingIgnoreCase(area)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByDescriptionContaining(String description) {
        return incidenciaJpaRepository.findByDescripcionContainingIgnoreCase(description)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByUserIdAndIncidentDateBetween(Long userId, LocalDate start, LocalDate end) {
        return incidenciaJpaRepository.findByUsuarioIdAndFechaIncidenciaBetween(userId, start, end)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByEmployeeIdAndPriorityLevel(Long employeeId, Incident.PriorityLevel priority) {
        Incidencia.NivelPrioridad nivel = mapToEntityPriority(priority);
        return incidenciaJpaRepository.findByEmpleadoIdAndNivelPrioridad(employeeId, nivel)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public List<Incident> findByUserIdAndCategoryId(Long userId, Long categoryId) {
        return incidenciaJpaRepository.findByUsuarioIdAndCategoriaId(userId, categoryId)
                .stream()
                .map(incidentMapper::toIncident)
                .collect(Collectors.toList());
    }

    @Override
    public long countByEmployeeIdAndIncidentDateBetween(Long employeeId, LocalDate start, LocalDate end) {
        return incidenciaJpaRepository.countByEmpleadoIdAndFechaIncidenciaBetween(employeeId, start, end);
    }

    @Override
    public void deleteById(Long id) {
        incidenciaJpaRepository.deleteById(id);
    }

    private Incidencia.NivelPrioridad mapToEntityPriority(Incident.PriorityLevel priority) {
        return switch (priority) {
            case LOW -> Incidencia.NivelPrioridad.baja;
            case MEDIUM -> Incidencia.NivelPrioridad.media;
            case HIGH -> Incidencia.NivelPrioridad.alta;
        };
    }
}