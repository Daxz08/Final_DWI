package pe.ucv.ucvbackend.domain.repository.impl;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.domain.repository.ReportRepository;
import pe.ucv.ucvbackend.persistence.entity.Reporte;
import pe.ucv.ucvbackend.persistence.mapper.ReportMapper;
import pe.ucv.ucvbackend.persistence.repository.ReporteJpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ReportRepositoryImpl implements ReportRepository {

    private final ReporteJpaRepository reporteJpaRepository;
    private final ReportMapper reportMapper;

    public ReportRepositoryImpl(ReporteJpaRepository reporteJpaRepository, ReportMapper reportMapper) {
        this.reporteJpaRepository = reporteJpaRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    public Report save(Report report) {
        Reporte reporte = reportMapper.toReporte(report);
        Reporte savedReporte = reporteJpaRepository.save(reporte);
        return reportMapper.toReport(savedReporte);
    }

    @Override
    public Optional<Report> findById(Long id) {
        return reporteJpaRepository.findById(id)
                .map(reportMapper::toReport);
    }

    @Override
    public Optional<Report> findByIncidentId(Long incidentId) {
        return reporteJpaRepository.findByIncidenciaId(incidentId)
                .map(reportMapper::toReport);
    }

    @Override
    public List<Report> findAll() {
        return reporteJpaRepository.findAll()
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByEmployeeId(Long employeeId) {
        return reporteJpaRepository.findByEmpleadoId(employeeId)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByIncidentStatus(Report.IncidentStatus status) {
        Reporte.EstadoIncidencia estado = mapToEntityStatus(status);
        return reporteJpaRepository.findByEstadoIncidencia(estado)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByRegistrationDateBetween(LocalDateTime start, LocalDateTime end) {
        return reporteJpaRepository.findByFechaRegistroBetween(start, end)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByEmployeeIdAndIncidentStatus(Long employeeId, Report.IncidentStatus status) {
        Reporte.EstadoIncidencia estado = mapToEntityStatus(status);
        return reporteJpaRepository.findByEmpleadoIdAndEstadoIncidencia(employeeId, estado)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByRegistrationDateAfter(LocalDateTime date) {
        return reporteJpaRepository.findByFechaRegistroAfter(date)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByRegistrationDateBefore(LocalDateTime date) {
        return reporteJpaRepository.findByFechaRegistroBefore(date)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByDescriptionContaining(String description) {
        return reporteJpaRepository.findByDescripcionContainingIgnoreCase(description)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByActionsContaining(String actions) {
        return reporteJpaRepository.findByAccionesContainingIgnoreCase(actions)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public List<Report> findByEmployeeIdAndRegistrationDateBetween(Long employeeId, LocalDateTime start, LocalDateTime end) {
        return reporteJpaRepository.findByEmpleadoIdAndFechaRegistroBetween(employeeId, start, end)
                .stream()
                .map(reportMapper::toReport)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByIncidentId(Long incidentId) {
        return reporteJpaRepository.existsByIncidenciaId(incidentId);
    }

    @Override
    public void deleteById(Long id) {
        reporteJpaRepository.deleteById(id);
    }

    private Reporte.EstadoIncidencia mapToEntityStatus(Report.IncidentStatus status) {
        return switch (status) {
            case PENDING -> Reporte.EstadoIncidencia.pendiente;
            case IN_PROGRESS -> Reporte.EstadoIncidencia.en_progreso;
            case RESOLVED -> Reporte.EstadoIncidencia.resuelto;
            case UNRESOLVED -> Reporte.EstadoIncidencia.no_resuelto;
        };
    }
}