package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Report;
import java.util.List;
import java.util.Optional;

public interface ReportRepository {
    List<Report> findAll();
    Optional<Report> findById(Long id);
    Report save(Report report);
    void deleteById(Long id);
    List<Report> findByAssignStaffId(Long assignStaffId);
    List<Report> findByUserId(Long userId);
    List<Report> findByStatus(String status);
}