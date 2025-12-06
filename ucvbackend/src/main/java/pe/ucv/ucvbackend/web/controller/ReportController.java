package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.domain.Report.IncidentStatus;
import pe.ucv.ucvbackend.domain.dto.ApiResponse;
import pe.ucv.ucvbackend.domain.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ucv/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Report>> createReport(@Valid @RequestBody Report report) {
        try {
            Report createdReport = reportService.createReport(report);
            return ResponseEntity.ok(ApiResponse.success("Reporte creado exitosamente", createdReport));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Report>>> getAllReports() {
        try {
            List<Report> reports = reportService.getAllReports();
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<Report>> getReportById(@PathVariable Long reportId) {
        try {
            Report report = reportService.getReportById(reportId)
                    .orElseThrow(() -> new RuntimeException("Reporte no encontrado"));
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<ApiResponse<Report>> getReportByIncidentId(@PathVariable Long incidentId) {
        try {
            Report report = reportService.getReportByIncidentId(incidentId)
                    .orElseThrow(() -> new RuntimeException("Reporte no encontrado para esta incidencia"));
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<Report>>> getReportsByEmployee(@PathVariable Long employeeId) {
        try {
            List<Report> reports = reportService.getReportsByEmployeeId(employeeId);
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Report>>> getReportsByStatus(@PathVariable String status) {
        try {
            IncidentStatus incidentStatus = IncidentStatus.valueOf(status.toUpperCase());
            List<Report> reports = reportService.getReportsByStatus(incidentStatus);
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<Report>>> getReportsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            List<Report> reports = reportService.getReportsByDateRange(start, end);
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/employee-status")
    public ResponseEntity<ApiResponse<List<Report>>> getReportsByEmployeeAndStatus(
            @RequestParam Long employeeId,
            @RequestParam String status) {
        try {
            IncidentStatus incidentStatus = IncidentStatus.valueOf(status.toUpperCase());
            List<Report> reports = reportService.getReportsByEmployeeAndStatus(employeeId, incidentStatus);
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<ApiResponse<Report>> updateReport(
            @PathVariable Long reportId,
            @Valid @RequestBody Report report) {
        try {
            Report updatedReport = reportService.updateReport(reportId, report);
            return ResponseEntity.ok(ApiResponse.success("Reporte actualizado exitosamente", updatedReport));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<ApiResponse<Report>> updateReportStatus(
            @PathVariable Long reportId,
            @RequestParam String status) {
        try {
            IncidentStatus incidentStatus = IncidentStatus.valueOf(status.toUpperCase());
            Report updatedReport = reportService.updateReportStatus(reportId, incidentStatus);
            return ResponseEntity.ok(ApiResponse.success("Estado del reporte actualizado exitosamente", updatedReport));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long reportId) {
        try {
            reportService.deleteReport(reportId);
            return ResponseEntity.ok(ApiResponse.success("Reporte eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search/description")
    public ResponseEntity<ApiResponse<List<Report>>> searchReportsByDescription(@RequestParam String description) {
        try {
            List<Report> reports = reportService.searchReportsByDescription(description);
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search/actions")
    public ResponseEntity<ApiResponse<List<Report>>> searchReportsByActions(@RequestParam String actions) {
        try {
            List<Report> reports = reportService.searchReportsByActions(actions);
            return ResponseEntity.ok(ApiResponse.success(reports));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}