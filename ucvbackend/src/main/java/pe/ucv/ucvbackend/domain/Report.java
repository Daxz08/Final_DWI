package pe.ucv.ucvbackend.domain;

import java.time.LocalDateTime;

public class Report {
    private Long reportId;
    private String description;
    private String actions;
    private IncidentStatus incidentStatus;
    private LocalDateTime registrationDate;
    private Long employeeId;
    private Long incidentId;

    public enum IncidentStatus {
        PENDING, IN_PROGRESS, RESOLVED, UNRESOLVED
    }

    // Constructors
    public Report() {}

    public Report(Long reportId, String description, String actions, IncidentStatus incidentStatus,
                  LocalDateTime registrationDate, Long employeeId, Long incidentId) {
        this.reportId = reportId;
        this.description = description;
        this.actions = actions;
        this.incidentStatus = incidentStatus;
        this.registrationDate = registrationDate;
        this.employeeId = employeeId;
        this.incidentId = incidentId;
    }

    // Getters and Setters
    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getActions() { return actions; }
    public void setActions(String actions) { this.actions = actions; }

    public IncidentStatus getIncidentStatus() { return incidentStatus; }
    public void setIncidentStatus(IncidentStatus incidentStatus) { this.incidentStatus = incidentStatus; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }
}