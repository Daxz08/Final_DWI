package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.mapper.IncidentMapper;
import pe.ucv.ucvbackend.persistence.repository.IncidenciaJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class IncidentRepositoryImpl implements IncidentRepository {

    private final IncidenciaJpaRepository incidenciaJpaRepository;
    private final IncidentMapper incidentMapper;

    public IncidentRepositoryImpl(IncidenciaJpaRepository incidenciaJpaRepository,
                                  IncidentMapper incidentMapper) {
        this.incidenciaJpaRepository = incidenciaJpaRepository;
        this.incidentMapper = incidentMapper;
    }

    @Override
    public List<Incident> findAll() {
        List<Incidencia> incidencias = incidenciaJpaRepository.findAll();
        return incidencias.stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public Optional<Incident> findById(Long id) {
        return incidenciaJpaRepository.findById(id)
                .map(incidentMapper::toIncident);
    }

    @Override
    public Incident save(Incident incident) {
        Incidencia incidencia = incidentMapper.toIncidencia(incident);
        Incidencia savedIncidencia = incidenciaJpaRepository.save(incidencia);
        return incidentMapper.toIncident(savedIncidencia);
    }

    @Override
    public void deleteById(Long id) {
        incidenciaJpaRepository.deleteById(id);
    }

    @Override
    public List<Incident> findByAreaContainingIgnoreCase(String area) {
        List<Incidencia> incidencias = incidenciaJpaRepository.findByAreaContainingIgnoreCase(area);
        return incidencias.stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> findByPriorityLevel(String priorityLevel) {
        List<Incidencia> incidencias = incidenciaJpaRepository.findByNivelPrioridad(priorityLevel);
        return incidencias.stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> findByUserId(Long userId) {
        List<Incidencia> incidencias = incidenciaJpaRepository.findByUsuarioId(userId);
        return incidencias.stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> findByCategoryId(Long categoryId) {
        List<Incidencia> incidencias = incidenciaJpaRepository.findByCategoriaId(categoryId);
        return incidencias.stream()
                .map(incidentMapper::toIncident)
                .toList();
    }

    @Override
    public List<Incident> findByDepartmentId(Long departmentId) {
        List<Incidencia> incidencias = incidenciaJpaRepository.findByDepartamentoId(departmentId);
        return incidencias.stream()
                .map(incidentMapper::toIncident)
                .toList();
    }
}