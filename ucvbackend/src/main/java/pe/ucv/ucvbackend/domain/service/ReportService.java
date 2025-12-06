package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.domain.Report.IncidentStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReportService {
    Report createReport(Report report);
    Report updateReport(Long reportId, Report report);
    void deleteReport(Long reportId);
    Optional<Report> getReportById(Long reportId);
    Optional<Report> getReportByIncidentId(Long incidentId);
    List<Report> getAllReports();
    List<Report> getReportsByEmployeeId(Long employeeId);
    List<Report> getReportsByStatus(IncidentStatus status);
    List<Report> getReportsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    List<Report> getReportsByEmployeeAndStatus(Long employeeId, IncidentStatus status);
    Report updateReportStatus(Long reportId, IncidentStatus status);
    List<Report> searchReportsByDescription(String description);
    List<Report> searchReportsByActions(String actions);
    boolean existsByIncidentId(Long incidentId);
}