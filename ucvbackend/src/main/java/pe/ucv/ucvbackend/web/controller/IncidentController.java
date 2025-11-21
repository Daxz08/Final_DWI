package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.domain.service.IncidentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ucv")
public class IncidentController {

    private static final Logger logger = LoggerFactory.getLogger(IncidentController.class);
    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping("/incidentList")
    public ResponseEntity<List<Incident>> getAllIncidents() {
        logger.info("******************************************");
        logger.info("Incident list request accepted successfully.");
        logger.info("******************************************");
        try {
            List<Incident> incidents = incidentService.getAllIncidents();
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            logger.error("Error getting incidents: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/incident/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        logger.info("******************************************");
        logger.info("Incident by ID request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            return incidentService.getIncidentById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error getting incident by ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/incidentSave")
    public ResponseEntity<Incident> saveIncident(@RequestBody Incident incident) {
        logger.info("******************************************");
        logger.info("Incident save request accepted successfully.");
        logger.info("******************************************");
        try {
            Incident savedIncident = incidentService.createIncident(incident);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedIncident);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error creating incident: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            logger.warn("Business error creating incident: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Error creating incident: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/incidentUpdate/{id}")
    public ResponseEntity<Incident> updateIncident(@PathVariable Long id, @RequestBody Incident incident) {
        logger.info("******************************************");
        logger.info("Incident update request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            Incident updatedIncident = incidentService.updateIncident(id, incident);
            return ResponseEntity.ok(updatedIncident);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error updating incident: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            logger.warn("Incident not found for update with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating incident with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/incidentDelete/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        logger.info("******************************************");
        logger.info("Incident delete request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            incidentService.deleteIncident(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.warn("Incident not found for deletion with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting incident with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoints adicionales para filtros - Actualizados con ResponseEntity
    @GetMapping("/incidentsByArea")
    public ResponseEntity<List<Incident>> getIncidentsByArea(@RequestParam String area) {
        logger.info("Getting incidents by area: {}", area);
        try {
            List<Incident> incidents = incidentService.getIncidentsByArea(area);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            logger.error("Error getting incidents by area {}: {}", area, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/incidentsByPriority")
    public ResponseEntity<List<Incident>> getIncidentsByPriority(@RequestParam String priorityLevel) {
        logger.info("Getting incidents by priority level: {}", priorityLevel);
        try {
            List<Incident> incidents = incidentService.getIncidentsByPriorityLevel(priorityLevel);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            logger.error("Error getting incidents by priority {}: {}", priorityLevel, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/incidentsByUser/{userId}")
    public ResponseEntity<List<Incident>> getIncidentsByUser(@PathVariable Long userId) {
        logger.info("Getting incidents by user ID: {}", userId);
        try {
            List<Incident> incidents = incidentService.getIncidentsByUserId(userId);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            logger.error("Error getting incidents by user ID {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/incidentsByCategory/{categoryId}")
    public ResponseEntity<List<Incident>> getIncidentsByCategory(@PathVariable Long categoryId) {
        logger.info("Getting incidents by category ID: {}", categoryId);
        try {
            List<Incident> incidents = incidentService.getIncidentsByCategoryId(categoryId);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            logger.error("Error getting incidents by category ID {}: {}", categoryId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/incidentsByDepartment/{departmentId}")
    public ResponseEntity<List<Incident>> getIncidentsByDepartment(@PathVariable Long departmentId) {
        logger.info("Getting incidents by department ID: {}", departmentId);
        try {
            List<Incident> incidents = incidentService.getIncidentsByDepartmentId(departmentId);
            return ResponseEntity.ok(incidents);
        } catch (Exception e) {
            logger.error("Error getting incidents by department ID {}: {}", departmentId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}