package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.domain.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ucv")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reportList")
    public ResponseEntity<List<Report>> getAllReports() {
        logger.info("******************************************");
        logger.info("Report list request accepted successfully.");
        logger.info("******************************************");
        try {
            List<Report> reports = reportService.getAllReports();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Error getting reports: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/report/{id}")
    public ResponseEntity<Report> getReportById(@PathVariable Long id) {
        logger.info("******************************************");
        logger.info("Report by ID request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            return reportService.getReportById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error getting report by ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/reportSave")
    public ResponseEntity<Report> saveReport(@RequestBody Report report) {
        logger.info("******************************************");
        logger.info("Report save request accepted successfully.");
        logger.info("******************************************");
        try {
            Report savedReport = reportService.createReport(report);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error creating report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            logger.warn("Business error creating report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Error creating report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/reportUpdate/{id}")
    public ResponseEntity<Report> updateReport(@PathVariable Long id, @RequestBody Report report) {
        logger.info("******************************************");
        logger.info("Report update request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            Report updatedReport = reportService.updateReport(id, report);
            return ResponseEntity.ok(updatedReport);
        } catch (IllegalArgumentException e) {
            logger.warn("Validation error updating report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (RuntimeException e) {
            logger.warn("Report not found for update with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating report with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/reportDelete/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        logger.info("******************************************");
        logger.info("Report delete request accepted successfully for ID: {}", id);
        logger.info("******************************************");
        try {
            reportService.deleteReport(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.warn("Report not found for deletion with ID {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting report with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Endpoints adicionales para filtros - Actualizados
    @GetMapping("/reportsByAssignStaff/{assignStaffId}")
    public ResponseEntity<List<Report>> getReportsByAssignStaff(@PathVariable Long assignStaffId) {
        logger.info("Getting reports by assign staff ID: {}", assignStaffId);
        try {
            List<Report> reports = reportService.getReportsByAssignStaffId(assignStaffId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Error getting reports by assign staff ID {}: {}", assignStaffId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/reportsByUser/{userId}")
    public ResponseEntity<List<Report>> getReportsByUser(@PathVariable Long userId) {
        logger.info("Getting reports by user ID: {}", userId);
        try {
            List<Report> reports = reportService.getReportsByUserId(userId);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Error getting reports by user ID {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/reportsByStatus")
    public ResponseEntity<List<Report>> getReportsByStatus(@RequestParam String status) {
        logger.info("Getting reports by status: {}", status);
        try {
            List<Report> reports = reportService.getReportsByStatus(status);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            logger.error("Error getting reports by status {}: {}", status, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}