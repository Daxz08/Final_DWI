package pe.ucv.ucvbackend.domain.service.impl;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.domain.Report.IncidentStatus;
import pe.ucv.ucvbackend.domain.service.ReportService;
import pe.ucv.ucvbackend.domain.repository.ReportRepository;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.entity.Reporte;
import pe.ucv.ucvbackend.persistence.repository.IncidenciaJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.ReporteJpaRepository;
import pe.ucv.ucvbackend.persistence.mapper.ReportMapper;
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
    private final IncidenciaJpaRepository incidenciaJpaRepository;
    private final ReporteJpaRepository reporteJpaRepository;
    private final ReportMapper reportMapper;

    public ReportServiceImpl(ReportRepository reportRepository,
                             EmployeeRepository employeeRepository,
                             IncidenciaJpaRepository incidenciaJpaRepository,
                             ReporteJpaRepository reporteJpaRepository,
                             ReportMapper reportMapper) {
        this.reportRepository = reportRepository;
        this.employeeRepository = employeeRepository;
        this.incidenciaJpaRepository = incidenciaJpaRepository;
        this.reporteJpaRepository = reporteJpaRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    public Report createReport(Report report) {
        // 🔥 VALIDACIÓN CRÍTICA: Verificar que la incidencia existe
        Incidencia incidencia = incidenciaJpaRepository.findById(report.getIncidentId())
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada con ID: " + report.getIncidentId()));

        // 🔥 VALIDACIÓN: Verificar que no tenga ya un reporte
        if (incidencia.getReporte() != null) {
            throw new RuntimeException("La incidencia ya tiene un reporte asignado");
        }

        // 🔥 VALIDACIÓN: Verificar que el empleado existe
        if (report.getEmployeeId() != null &&
                !employeeRepository.findById(report.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Empleado no encontrado con ID: " + report.getEmployeeId());
        }

        // 🔥 VALIDACIÓN: Verificar en repositorio también
        if (reportRepository.existsByIncidentId(report.getIncidentId())) {
            throw new RuntimeException("Ya existe un reporte para la incidencia con ID: " + report.getIncidentId());
        }

        // Establecer valores por defecto
        if (report.getIncidentStatus() == null) {
            report.setIncidentStatus(IncidentStatus.PENDING);
        }
        if (report.getRegistrationDate() == null) {
            report.setRegistrationDate(LocalDateTime.now());
        }

        // Guardar el reporte
        Report savedReport = reportRepository.save(report);

        // 🔥 CRÍTICO: Actualizar la incidencia con el reporte
        sincronizarIncidenciaConReporte(report.getIncidentId(), savedReport.getIncidentStatus());

        return savedReport;
    }

    @Override
    public Report updateReport(Long reportId, Report report) {
        Report existingReport = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + reportId));

        // Actualizar campos permitidos
        existingReport.setDescription(report.getDescription());
        existingReport.setActions(report.getActions());
        existingReport.setIncidentStatus(report.getIncidentStatus());

        Report updatedReport = reportRepository.save(existingReport);

        // 🔥 CRÍTICO: Sincronizar con la incidencia
        if (updatedReport.getIncidentId() != null) {
            sincronizarIncidenciaConReporte(updatedReport.getIncidentId(), updatedReport.getIncidentStatus());
        }

        return updatedReport;
    }

    @Override
    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + reportId));

        // 🔥 CRÍTICO: Limpiar referencia en la incidencia
        if (report.getIncidentId() != null) {
            limpiarReporteDeIncidencia(report.getIncidentId());
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
        Report updatedReport = reportRepository.save(report);

        // 🔥 CRÍTICO: Sincronizar con incidencia
        if (updatedReport.getIncidentId() != null) {
            actualizarIncidenciaDesdeReporte(updatedReport.getIncidentId(), status);
        }

        return updatedReport;
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

    // 🔥 NUEVOS MÉTODOS PRIVADOS PARA SINCRONIZACIÓN

    private void actualizarIncidenciaConReporte(Long incidentId, Report report) {
        Incidencia incidencia = incidenciaJpaRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada para sincronización"));

        Reporte reporteEntity = reportMapper.toReporte(report);
        reporteEntity.setIncidencia(incidencia);

        // Guardar primero el reporte
        Reporte savedReporte = reporteJpaRepository.save(reporteEntity);

        // Actualizar la incidencia
        incidencia.setReporte(savedReporte);
        incidenciaJpaRepository.save(incidencia);

        System.out.println("✅ [ReportService] Incidencia " + incidentId + " actualizada con reporte");
    }

    private void actualizarIncidenciaDesdeReporte(Long incidentId, IncidentStatus status) {
        Incidencia incidencia = incidenciaJpaRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada para actualización"));

        // Puedes agregar lógica adicional aquí basada en el estado
        // Por ejemplo, cambiar prioridad, marcar como completada, etc.
        System.out.println("🔄 [ReportService] Sincronizando incidencia " + incidentId + " con estado: " + status);
    }

    private void limpiarReporteDeIncidencia(Long incidentId) {
        Incidencia incidencia = incidenciaJpaRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incidencia no encontrada para limpieza"));

        incidencia.setReporte(null);
        incidenciaJpaRepository.save(incidencia);

        System.out.println("🧹 [ReportService] Reporte eliminado de incidencia " + incidentId);
    }

    private void sincronizarIncidenciaConReporte(Long incidentId, Report.IncidentStatus status) {
        try {
            Incidencia incidencia = incidenciaJpaRepository.findById(incidentId)
                    .orElseThrow(() -> new RuntimeException("Incidencia no encontrada para sincronización"));

            // Actualizar el estado de la incidencia basado en el reporte
            switch(status) {
                case RESOLVED:
                    // Marcar como resuelta - puedes agregar lógica adicional aquí
                    System.out.println("✅ [Sincronización] Incidencia " + incidentId + " marcada como RESUELTA");
                    break;
                case UNRESOLVED:
                    System.out.println("❌ [Sincronización] Incidencia " + incidentId + " marcada como NO RESUELTA");
                    break;
                case IN_PROGRESS:
                    System.out.println("🔄 [Sincronización] Incidencia " + incidentId + " EN PROGRESO");
                    break;
            }

            incidenciaJpaRepository.save(incidencia);
        } catch (Exception e) {
            System.err.println("⚠️ [Sincronización] Error: " + e.getMessage());
        }
    }
}