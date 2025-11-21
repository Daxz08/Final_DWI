package pe.ucv.ucvbackend.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Report {
    private Long reportId;
    private String actions;
    private String descripcion;
    private LocalDate resolutionDate;
    private String status;
    private Long assignStaffId;
    private Long userId;

    // Constructores
    public Report() {}

    public Report(Long reportId, String actions, String descripcion, LocalDate resolutionDate,
                  String status, Long assignStaffId, Long userId) {
        this.reportId = reportId;
        this.actions = actions;
        this.descripcion = descripcion;
        this.resolutionDate = resolutionDate;
        this.status = status;
        this.assignStaffId = assignStaffId;
        this.userId = userId;
    }

    // Getters y Setters
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }
    public String getActions() { return actions; }
    public void setActions(String actions) { this.actions = actions; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getResolutionDate() { return resolutionDate; }
    public void setResolutionDate(LocalDate resolutionDate) { this.resolutionDate = resolutionDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getAssignStaffId() { return assignStaffId; }
    public void setAssignStaffId(Long assignStaffId) { this.assignStaffId = assignStaffId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}