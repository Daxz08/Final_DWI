package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Report;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReportRepository {
    Report save(Report report);
    Optional<Report> findById(Long id);
    Optional<Report> findByIncidentId(Long incidentId);
    List<Report> findAll();
    List<Report> findByEmployeeId(Long employeeId);
    List<Report> findByIncidentStatus(Report.IncidentStatus status);
    List<Report> findByRegistrationDateBetween(LocalDateTime start, LocalDateTime end);
    List<Report> findByEmployeeIdAndIncidentStatus(Long employeeId, Report.IncidentStatus status);
    List<Report> findByRegistrationDateAfter(LocalDateTime date);
    List<Report> findByRegistrationDateBefore(LocalDateTime date);
    List<Report> findByDescriptionContaining(String description);
    List<Report> findByActionsContaining(String actions);
    List<Report> findByEmployeeIdAndRegistrationDateBetween(Long employeeId, LocalDateTime start, LocalDateTime end);
    boolean existsByIncidentId(Long incidentId);
    void deleteById(Long id);
}