package pe.ucv.ucvbackend.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Incident {
    private Long incidentId;
    private String area;
    private String description;
    private LocalDate incidentDate;
    private LocalDateTime registrationDate;
    private Long userId;
    private Long categoryId;
    private Long departmentId;
    private Long employeeId;
    private PriorityLevel priorityLevel;

    public enum PriorityLevel {
        LOW, MEDIUM, HIGH
    }

    // Constructors
    public Incident() {}

    public Incident(Long incidentId, String area, String description, LocalDate incidentDate,
                    LocalDateTime registrationDate, Long userId, Long categoryId,
                    Long departmentId, Long employeeId, PriorityLevel priorityLevel) {
        this.incidentId = incidentId;
        this.area = area;
        this.description = description;
        this.incidentDate = incidentDate;
        this.registrationDate = registrationDate;
        this.userId = userId;
        this.categoryId = categoryId;
        this.departmentId = departmentId;
        this.employeeId = employeeId;
        this.priorityLevel = priorityLevel;
    }

    // Getters and Setters
    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public PriorityLevel getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(PriorityLevel priorityLevel) { this.priorityLevel = priorityLevel; }
}