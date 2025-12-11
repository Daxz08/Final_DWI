package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.domain.Incident.PriorityLevel;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IncidentService {
    // ... métodos existentes ...

    Incident createIncident(Incident incident);
    Incident updateIncident(Long incidentId, Incident incident);
    void deleteIncident(Long incidentId);
    Optional<Incident> getIncidentById(Long incidentId);
    List<Incident> getAllIncidents();
    List<Incident> getIncidentsByUserId(Long userId);
    List<Incident> getIncidentsByEmployeeId(Long employeeId);
    List<Incident> getIncidentsByCategoryId(Long categoryId);
    List<Incident> getIncidentsByDepartmentId(Long departmentId);
    List<Incident> getIncidentsByPriority(PriorityLevel priority);
    List<Incident> getIncidentsByDateRange(LocalDate startDate, LocalDate endDate);
    Incident assignIncidentToEmployee(Long incidentId, Long employeeId, PriorityLevel priority);
    List<Incident> searchIncidentsByArea(String area);
    List<Incident> searchIncidentsByDescription(String description);
    long getIncidentCountByEmployeeAndDateRange(Long employeeId, LocalDate startDate, LocalDate endDate);
    List<Incident> getUnassignedIncidents();

    // 🔥 NUEVOS MÉTODOS PARA REPORTES
    List<Incident> getIncidentsWithReports();
    List<Incident> getIncidentsWithoutReports();
    List<Incident> getIncidentsByUserWithReports(Long userId);
}