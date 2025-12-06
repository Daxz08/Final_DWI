package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.domain.Incident.PriorityLevel;
import pe.ucv.ucvbackend.domain.dto.ApiResponse;
import pe.ucv.ucvbackend.domain.dto.IncidentAssignmentRequest;
import pe.ucv.ucvbackend.domain.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ucv/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Incident>> createIncident(@Valid @RequestBody Incident incident) {
        try {
            Incident createdIncident = incidentService.createIncident(incident);
            return ResponseEntity.ok(ApiResponse.success("Incidencia creada exitosamente", createdIncident));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Incident>>> getAllIncidents() {
        try {
            List<Incident> incidents = incidentService.getAllIncidents();
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<ApiResponse<Incident>> getIncidentById(@PathVariable Long incidentId) {
        try {
            Incident incident = incidentService.getIncidentById(incidentId)
                    .orElseThrow(() -> new RuntimeException("Incidencia no encontrada"));
            return ResponseEntity.ok(ApiResponse.success(incident));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Incident>>> getIncidentsByUser(@PathVariable Long userId) {
        try {
            List<Incident> incidents = incidentService.getIncidentsByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<Incident>>> getIncidentsByEmployee(@PathVariable Long employeeId) {
        try {
            List<Incident> incidents = incidentService.getIncidentsByEmployeeId(employeeId);
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/unassigned")
    public ResponseEntity<ApiResponse<List<Incident>>> getUnassignedIncidents() {
        try {
            List<Incident> incidents = incidentService.getUnassignedIncidents();
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<ApiResponse<List<Incident>>> getIncidentsByPriority(@PathVariable String priority) {
        try {
            PriorityLevel priorityLevel = PriorityLevel.valueOf(priority.toUpperCase());
            List<Incident> incidents = incidentService.getIncidentsByPriority(priorityLevel);
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<Incident>>> getIncidentsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            List<Incident> incidents = incidentService.getIncidentsByDateRange(start, end);
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{incidentId}/assign")
    public ResponseEntity<ApiResponse<Incident>> assignIncidentToEmployee(
            @PathVariable Long incidentId,
            @Valid @RequestBody IncidentAssignmentRequest request) {
        try {
            PriorityLevel priority = PriorityLevel.valueOf(request.getPriorityLevel().toUpperCase());
            Incident assignedIncident = incidentService.assignIncidentToEmployee(
                    incidentId, request.getEmployeeId(), priority);
            return ResponseEntity.ok(ApiResponse.success("Incidencia asignada exitosamente", assignedIncident));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{incidentId}")
    public ResponseEntity<ApiResponse<Incident>> updateIncident(
            @PathVariable Long incidentId,
            @Valid @RequestBody Incident incident) {
        try {
            Incident updatedIncident = incidentService.updateIncident(incidentId, incident);
            return ResponseEntity.ok(ApiResponse.success("Incidencia actualizada exitosamente", updatedIncident));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{incidentId}")
    public ResponseEntity<ApiResponse<Void>> deleteIncident(@PathVariable Long incidentId) {
        try {
            incidentService.deleteIncident(incidentId);
            return ResponseEntity.ok(ApiResponse.success("Incidencia eliminada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search/area")
    public ResponseEntity<ApiResponse<List<Incident>>> searchIncidentsByArea(@RequestParam String area) {
        try {
            List<Incident> incidents = incidentService.searchIncidentsByArea(area);
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search/description")
    public ResponseEntity<ApiResponse<List<Incident>>> searchIncidentsByDescription(@RequestParam String description) {
        try {
            List<Incident> incidents = incidentService.searchIncidentsByDescription(description);
            return ResponseEntity.ok(ApiResponse.success(incidents));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}