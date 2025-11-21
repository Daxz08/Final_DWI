package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.persistence.entity.Reporte;
import pe.ucv.ucvbackend.persistence.mapper.ReportMapper;
import pe.ucv.ucvbackend.persistence.repository.ReporteJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ReportRepositoryImpl implements ReportRepository {

    private final ReporteJpaRepository reporteJpaRepository;
    private final ReportMapper reportMapper;

    public ReportRepositoryImpl(ReporteJpaRepository reporteJpaRepository,
                                ReportMapper reportMapper) {
        this.reporteJpaRepository = reporteJpaRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    public List<Report> findAll() {
        List<Reporte> reportes = reporteJpaRepository.findAll();
        return reportes.stream()
                .map(reportMapper::toReport)
                .toList();
    }

    @Override
    public Optional<Report> findById(Long id) {
        return reporteJpaRepository.findById(id)
                .map(reportMapper::toReport);
    }

    @Override
    public Report save(Report report) {
        Reporte reporte = reportMapper.toReporte(report);
        Reporte savedReporte = reporteJpaRepository.save(reporte);
        return reportMapper.toReport(savedReporte);
    }

    @Override
    public void deleteById(Long id) {
        reporteJpaRepository.deleteById(id);
    }

    @Override
    public List<Report> findByAssignStaffId(Long assignStaffId) {
        List<Reporte> reportes = reporteJpaRepository.findByAsignacionPersonalId(assignStaffId);
        return reportes.stream()
                .map(reportMapper::toReport)
                .toList();
    }

    @Override
    public List<Report> findByUserId(Long userId) {
        List<Reporte> reportes = reporteJpaRepository.findByUsuarioId(userId);
        return reportes.stream()
                .map(reportMapper::toReport)
                .toList();
    }

    @Override
    public List<Report> findByStatus(String status) {
        List<Reporte> reportes = reporteJpaRepository.findByStatus(status);
        return reportes.stream()
                .map(reportMapper::toReport)
                .toList();
    }
}
