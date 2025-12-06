package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Incident;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IncidentRepository {
    Incident save(Incident incident);
    Optional<Incident> findById(Long id);
    List<Incident> findAll();
    List<Incident> findByUserId(Long userId);
    List<Incident> findByEmployeeId(Long employeeId);
    List<Incident> findByCategoryId(Long categoryId);
    List<Incident> findByDepartmentId(Long departmentId);
    List<Incident> findByPriorityLevel(Incident.PriorityLevel priority);
    List<Incident> findByIncidentDate(LocalDate date);
    List<Incident> findByIncidentDateBetween(LocalDate start, LocalDate end);
    List<Incident> findByRegistrationDateBetween(LocalDateTime start, LocalDateTime end);
    List<Incident> findByAreaContaining(String area);
    List<Incident> findByDescriptionContaining(String description);
    List<Incident> findByUserIdAndIncidentDateBetween(Long userId, LocalDate start, LocalDate end);
    List<Incident> findByEmployeeIdAndPriorityLevel(Long employeeId, Incident.PriorityLevel priority);
    List<Incident> findByUserIdAndCategoryId(Long userId, Long categoryId);
    long countByEmployeeIdAndIncidentDateBetween(Long employeeId, LocalDate start, LocalDate end);
    void deleteById(Long id);
}