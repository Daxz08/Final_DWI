package pe.ucv.ucvbackend.domain.service.impl;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.domain.Report.IncidentStatus;
import pe.ucv.ucvbackend.domain.service.ReportService;
import pe.ucv.ucvbackend.domain.repository.ReportRepository;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import pe.ucv.ucvbackend.domain.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final EmployeeRepository employeeRepository;
    private final IncidentRepository incidentRepository;

    public ReportServiceImpl(ReportRepository reportRepository,
                             EmployeeRepository employeeRepository,
                             IncidentRepository incidentRepository) {
        this.reportRepository = reportRepository;
        this.employeeRepository = employeeRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public Report createReport(Report report) {
        // Validar que el empleado existe
        if (report.getEmployeeId() != null &&
                !employeeRepository.findById(report.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Empleado no encontrado con ID: " + report.getEmployeeId());
        }

        // Validar que la incidencia existe
        if (report.getIncidentId() != null &&
                !incidentRepository.findById(report.getIncidentId()).isPresent()) {
            throw new RuntimeException("Incidencia no encontrada con ID: " + report.getIncidentId());
        }

        // Validar que no exista ya un reporte para esta incidencia
        if (report.getIncidentId() != null &&
                reportRepository.existsByIncidentId(report.getIncidentId())) {
            throw new RuntimeException("Ya existe un reporte para la incidencia con ID: " + report.getIncidentId());
        }

        // Establecer valores por defecto
        if (report.getIncidentStatus() == null) {
            report.setIncidentStatus(IncidentStatus.PENDING);
        }
        if (report.getRegistrationDate() == null) {
            report.setRegistrationDate(LocalDateTime.now());
        }

        return reportRepository.save(report);
    }

    @Override
    public Report updateReport(Long reportId, Report report) {
        Report existingReport = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + reportId));

        // Actualizar campos permitidos
        existingReport.setDescription(report.getDescription());
        existingReport.setActions(report.getActions());
        existingReport.setIncidentStatus(report.getIncidentStatus());

        return reportRepository.save(existingReport);
    }

    @Override
    public void deleteReport(Long reportId) {
        if (!reportRepository.findById(reportId).isPresent()) {
            throw new RuntimeException("Reporte no encontrado con ID: " + reportId);
        }
        reportRepository.deleteById(reportId);
    }

    @Override
    public Optional<Report> getReportById(Long reportId) {
        return reportRepository.findById(reportId);
    }

    @Override
    public Optional<Report> getReportByIncidentId(Long incidentId) {
        return reportRepository.findByIncidentId(incidentId);
    }

    @Override
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public List<Report> getReportsByEmployeeId(Long employeeId) {
        return reportRepository.findByEmployeeId(employeeId);
    }

    @Override
    public List<Report> getReportsByStatus(IncidentStatus status) {
        return reportRepository.findByIncidentStatus(status);
    }

    @Override
    public List<Report> getReportsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return reportRepository.findByRegistrationDateBetween(startDate, endDate);
    }

    @Override
    public List<Report> getReportsByEmployeeAndStatus(Long employeeId, IncidentStatus status) {
        return reportRepository.findByEmployeeIdAndIncidentStatus(employeeId, status);
    }

    @Override
    public Report updateReportStatus(Long reportId, IncidentStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + reportId));

        report.setIncidentStatus(status);
        return reportRepository.save(report);
    }

    @Override
    public List<Report> searchReportsByDescription(String description) {
        return reportRepository.findByDescriptionContaining(description);
    }

    @Override
    public List<Report> searchReportsByActions(String actions) {
        return reportRepository.findByActionsContaining(actions);
    }

    @Override
    public boolean existsByIncidentId(Long incidentId) {
        return reportRepository.existsByIncidentId(incidentId);
    }
}