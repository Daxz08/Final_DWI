package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.AssignStaff;
import pe.ucv.ucvbackend.domain.service.AssignStaffService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ucv")
public class AssignStaffController {

    private static final Logger logger = LoggerFactory.getLogger(AssignStaffController.class);
    private final AssignStaffService assignStaffService;

    public AssignStaffController(AssignStaffService assignStaffService) {
        this.assignStaffService = assignStaffService;
    }

    @GetMapping("/assignStaffList")
    public ResponseEntity<List<AssignStaff>> getAllAssignments() {
        logger.info("******************************************");
        logger.info("AssignStaff list request accepted successfully.");
        logger.info("******************************************");
        try {
            List<AssignStaff> assignments = assignStaffService.getAllAssignments();
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error getting assignments: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assignStaff/{id}")
    public ResponseEntity<AssignStaff> getAssignmentById(@PathVariable Long id) {
        logger.info("******************************************");
        logger.info("AssignStaff by ID request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            return assignStaffService.getAssignmentById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error getting assignment by ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/assignStaffSave")
    public ResponseEntity<AssignStaff> saveAssignment(@RequestBody AssignStaff assignStaff) {
        logger.info("******************************************");
        logger.info("AssignStaff save request accepted successfully.");
        logger.info("******************************************");
        try {
            AssignStaff savedAssignment = assignStaffService.createAssignment(assignStaff);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAssignment);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error creating assignment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            logger.warn("Business error creating assignment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Error creating assignment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/assignStaffUpdate/{id}")
    public ResponseEntity<AssignStaff> updateAssignment(@PathVariable Long id, @RequestBody AssignStaff assignStaff) {
        logger.info("******************************************");
        logger.info("AssignStaff update request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            AssignStaff updatedAssignment = assignStaffService.updateAssignment(id, assignStaff);
            return ResponseEntity.ok(updatedAssignment);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error updating assignment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            logger.warn("Assignment not found for update with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating assignment with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/assignStaffUpdateStatus/{id}")
    public ResponseEntity<AssignStaff> updateAssignmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {

        String status = statusUpdate.get("status");
        String description = statusUpdate.get("description");

        logger.info("******************************************");
        logger.info("AssignStaff status update request accepted for ID: {} to status: {}", id, status);
        logger.info("******************************************");

        try {
            AssignStaff updatedAssignment = assignStaffService.updateAssignmentStatus(id, status, description);
            return ResponseEntity.ok(updatedAssignment);
        } catch (RuntimeException e) {
            logger.warn("Assignment not found for status update with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating assignment status with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/assignStaffDelete/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        logger.info("******************************************");
        logger.info("AssignStaff delete request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            assignStaffService.deleteAssignment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.warn("Assignment not found for deletion with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting assignment with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoints adicionales para filtros - Actualizados
    @GetMapping("/assignmentsByIncident/{incidentId}")
    public ResponseEntity<List<AssignStaff>> getAssignmentsByIncident(@PathVariable Long incidentId) {
        logger.info("Getting assignments by incident ID: {}", incidentId);
        try {
            List<AssignStaff> assignments = assignStaffService.getAssignmentsByIncidentId(incidentId);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error getting assignments by incident ID {}: {}", incidentId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assignmentsByUser/{userId}")
    public ResponseEntity<List<AssignStaff>> getAssignmentsByUser(@PathVariable Long userId) {
        logger.info("Getting assignments by user ID: {}", userId);
        try {
            List<AssignStaff> assignments = assignStaffService.getAssignmentsByUserId(userId);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error getting assignments by user ID {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assignmentsByStatus")
    public ResponseEntity<List<AssignStaff>> getAssignmentsByStatus(@RequestParam String status) {
        logger.info("Getting assignments by status: {}", status);
        try {
            List<AssignStaff> assignments = assignStaffService.getAssignmentsByStatus(status);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error getting assignments by status {}: {}", status, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/assignmentsByAssignedUser")
    public ResponseEntity<List<AssignStaff>> getAssignmentsByAssignedUser(@RequestParam String assignedUser) {
        logger.info("Getting assignments by assigned user: {}", assignedUser);
        try {
            List<AssignStaff> assignments = assignStaffService.getAssignmentsByAssignedUser(assignedUser);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            logger.error("Error getting assignments by assigned user {}: {}", assignedUser, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/hasActiveAssignment/{incidentId}")
    public ResponseEntity<Boolean> hasActiveAssignment(@PathVariable Long incidentId) {
        logger.info("Checking active assignment for incident ID: {}", incidentId);
        try {
            boolean hasActive = assignStaffService.hasActiveAssignmentForIncident(incidentId);
            return ResponseEntity.ok(hasActive);
        } catch (Exception e) {
            logger.error("Error checking active assignment for incident ID {}: {}", incidentId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}