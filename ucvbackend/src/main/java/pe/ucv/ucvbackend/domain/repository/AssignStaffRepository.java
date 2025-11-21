package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.AssignStaff;
import java.util.List;
import java.util.Optional;

public interface AssignStaffRepository {
    List<AssignStaff> findAll();
    Optional<AssignStaff> findById(Long id);
    AssignStaff save(AssignStaff assignStaff);
    void deleteById(Long id);
    List<AssignStaff> findByIncidentId(Long incidentId);
    List<AssignStaff> findByUserId(Long userId);
    List<AssignStaff> findByStatus(String status);
    List<AssignStaff> findByAssignedUserContainingIgnoreCase(String assignedUser);
    boolean existsByIncidentIdAndStatus(Long incidentId, String status);
}