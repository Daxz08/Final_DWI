package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.persistence.entity.Reporte;
import pe.ucv.ucvbackend.persistence.entity.AsignacionPersonal;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.repository.ReporteJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.AsignacionPersonalJpaRepository;
import pe.ucv.ucvbackend.persistence.repository.UsuarioJpaRepository;
import pe.ucv.ucvbackend.persistence.mapper.ReportMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReportServiceImpl implements ReportService {

    private static final Logger logger = LoggerFactory.getLogger(ReportServiceImpl.class);
    private final ReporteJpaRepository reporteRepository;
    private final AsignacionPersonalJpaRepository asignacionPersonalRepository;
    private final UsuarioJpaRepository usuarioRepository;
    private final ReportMapper reportMapper;

    public ReportServiceImpl(ReporteJpaRepository reporteRepository,
                             AsignacionPersonalJpaRepository asignacionPersonalRepository,
                             UsuarioJpaRepository usuarioRepository,
                             ReportMapper reportMapper) {
        this.reporteRepository = reporteRepository;
        this.asignacionPersonalRepository = asignacionPersonalRepository;
        this.usuarioRepository = usuarioRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Report> getAllReports() {
        logger.info("Getting all reports");
        return reporteRepository.findAll()
                .stream()
                .map(reportMapper::toReport)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Report> getReportById(Long id) {
        logger.info("Getting report by ID: {}", id);
        return reporteRepository.findById(id)
                .map(reportMapper::toReport);
    }

    @Override
    public Report createReport(Report report) {
        logger.info("Creating new report for assign staff ID: {}", report.getAssignStaffId());

        // Validaciones
        if (report.getAssignStaffId() == null) {
            throw new IllegalArgumentException("El ID de asignación de personal es obligatorio");
        }
        if (report.getUserId() == null) {
            throw new IllegalArgumentException("El ID de usuario es obligatorio");
        }

        // ✅ BUSCAR ENTIDADES RELACIONADAS
        AsignacionPersonal asignacionPersonal = asignacionPersonalRepository.findById(report.getAssignStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Asignación de personal no encontrada con ID: " + report.getAssignStaffId()));

        Usuario usuario = usuarioRepository.findById(report.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + report.getUserId()));

        // ✅ USAR MÉTODO HELPER CON RELACIONES
        Reporte reporte = reportMapper.toReporteWithRelations(report, asignacionPersonal, usuario);

        // Establecer fecha de resolución si no viene
        if (reporte.getFechaResolucion() == null) {
            reporte.setFechaResolucion(java.time.LocalDate.now());
        }

        // Establecer estado por defecto si no viene
        if (reporte.getStatus() == null) {
            reporte.setStatus("Completado");
        }

        Reporte saved = reporteRepository.save(reporte);
        return reportMapper.toReport(saved);
    }

    @Override
    public Report updateReport(Long id, Report report) {
        logger.info("Updating report with ID: {}", id);

        // Verificar que el reporte exista
        Reporte reporteExistente = reporteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte no encontrado con ID: " + id));

        // ✅ BUSCAR NUEVAS ENTIDADES RELACIONADAS
        AsignacionPersonal asignacionPersonal = asignacionPersonalRepository.findById(report.getAssignStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Asignación de personal no encontrada con ID: " + report.getAssignStaffId()));

        Usuario usuario = usuarioRepository.findById(report.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + report.getUserId()));

        // ✅ ACTUALIZAR CAMPOS
        reporteExistente.setActions(report.getActions());
        reporteExistente.setDescripcion(report.getDescripcion());
        reporteExistente.setFechaResolucion(report.getResolutionDate());
        reporteExistente.setStatus(report.getStatus());

        // ✅ ACTUALIZAR RELACIONES
        reporteExistente.setAsignacionPersonal(asignacionPersonal);
        reporteExistente.setUsuario(usuario);

        Reporte updated = reporteRepository.save(reporteExistente);
        return reportMapper.toReport(updated);
    }

    @Override
    public void deleteReport(Long id) {
        logger.info("Deleting report with ID: {}", id);

        // Verificar que el reporte exista
        if (!reporteRepository.existsById(id)) {
            throw new RuntimeException("Reporte no encontrado con ID: " + id);
        }

        reporteRepository.deleteById(id);
    }

    // ✅ MÉTODOS DE FILTROS (se mantienen igual)
    @Override
    @Transactional(readOnly = true)
    public List<Report> getReportsByAssignStaffId(Long assignStaffId) {
        logger.info("Getting reports by assign staff ID: {}", assignStaffId);
        return reporteRepository.findByAsignacionPersonalId(assignStaffId)
                .stream()
                .map(reportMapper::toReport)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Report> getReportsByUserId(Long userId) {
        logger.info("Getting reports by user ID: {}", userId);
        return reporteRepository.findByUsuarioId(userId)
                .stream()
                .map(reportMapper::toReport)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Report> getReportsByStatus(String status) {
        logger.info("Getting reports by status: {}", status);
        return reporteRepository.findByStatus(status)
                .stream()
                .map(reportMapper::toReport)
                .toList();
    }
}