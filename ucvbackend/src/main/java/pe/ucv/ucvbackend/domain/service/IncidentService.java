package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Incident;
import java.util.List;
import java.util.Optional;

public interface IncidentService {
    List<Incident> getAllIncidents();
    Optional<Incident> getIncidentById(Long id);
    Incident createIncident(Incident incident);
    Incident updateIncident(Long id, Incident incident);
    void deleteIncident(Long id);
    List<Incident> getIncidentsByArea(String area);
    List<Incident> getIncidentsByPriorityLevel(String priorityLevel);
    List<Incident> getIncidentsByUserId(Long userId);
    List<Incident> getIncidentsByCategoryId(Long categoryId);
    List<Incident> getIncidentsByDepartmentId(Long departmentId);
}