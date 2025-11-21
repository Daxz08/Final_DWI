package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Report;
import java.util.List;
import java.util.Optional;

public interface ReportService {
    List<Report> getAllReports();
    Optional<Report> getReportById(Long id);
    Report createReport(Report report);
    Report updateReport(Long id, Report report);
    void deleteReport(Long id);
    List<Report> getReportsByAssignStaffId(Long assignStaffId);
    List<Report> getReportsByUserId(Long userId);
    List<Report> getReportsByStatus(String status);
}