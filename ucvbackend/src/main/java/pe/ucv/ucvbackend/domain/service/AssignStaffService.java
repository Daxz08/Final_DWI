package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.AssignStaff;
import java.util.List;
import java.util.Optional;

public interface AssignStaffService {
    List<AssignStaff> getAllAssignments();
    Optional<AssignStaff> getAssignmentById(Long id);
    AssignStaff createAssignment(AssignStaff assignStaff);
    AssignStaff updateAssignment(Long id, AssignStaff assignStaff);
    void deleteAssignment(Long id);
    List<AssignStaff> getAssignmentsByIncidentId(Long incidentId);
    List<AssignStaff> getAssignmentsByUserId(Long userId);
    List<AssignStaff> getAssignmentsByStatus(String status);
    List<AssignStaff> getAssignmentsByAssignedUser(String assignedUser);
    AssignStaff updateAssignmentStatus(Long id, String status, String description);
    boolean hasActiveAssignmentForIncident(Long incidentId);
}