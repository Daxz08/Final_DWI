package pe.ucv.ucvbackend.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AssignStaff {
    private Long assignStaffId;
    private String assignedUser;
    private LocalDate dateSolution;
    private String description;
    private LocalDateTime registeredDate;
    private String status; // Pendiente, En Proceso, Resuelto
    private Long incidentId;
    private Long userId;

    // Constructores
    public AssignStaff() {}

    public AssignStaff(Long assignStaffId, String assignedUser, LocalDate dateSolution,
                       String description, LocalDateTime registeredDate, String status,
                       Long incidentId, Long userId) {
        this.assignStaffId = assignStaffId;
        this.assignedUser = assignedUser;
        this.dateSolution = dateSolution;
        this.description = description;
        this.registeredDate = registeredDate;
        this.status = status;
        this.incidentId = incidentId;
        this.userId = userId;
    }

    // Getters y Setters
    public Long getAssignStaffId() { return assignStaffId; }
    public void setAssignStaffId(Long assignStaffId) { this.assignStaffId = assignStaffId; }
    public String getAssignedUser() { return assignedUser; }
    public void setAssignedUser(String assignedUser) { this.assignedUser = assignedUser; }
    public LocalDate getDateSolution() { return dateSolution; }
    public void setDateSolution(LocalDate dateSolution) { this.dateSolution = dateSolution; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}