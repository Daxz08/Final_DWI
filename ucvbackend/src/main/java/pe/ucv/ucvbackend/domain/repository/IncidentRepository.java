package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Incident;
import java.util.List;
import java.util.Optional;

public interface IncidentRepository {
    List<Incident> findAll();
    Optional<Incident> findById(Long id);
    Incident save(Incident incident);
    void deleteById(Long id);
    List<Incident> findByAreaContainingIgnoreCase(String area);
    List<Incident> findByPriorityLevel(String priorityLevel);
    List<Incident> findByUserId(Long userId);
    List<Incident> findByCategoryId(Long categoryId);
    List<Incident> findByDepartmentId(Long departmentId);
}