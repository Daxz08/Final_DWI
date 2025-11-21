package pe.ucv.ucvbackend.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Incident {
    private Long incidentId;
    private String area;
    private String description;
    private LocalDate incidentDate;
    private String priorityLevel;
    private LocalDateTime registeredDate;
    private String registeredUser;

    // Relaciones
    private Long categoryId;
    private Long departmentId;
    private Long userId;

    // Constructores
    public Incident() {}

    public Incident(Long incidentId, String area, String description, LocalDate incidentDate,
                    String priorityLevel, LocalDateTime registeredDate, String registeredUser,
                    Long categoryId, Long departmentId, Long userId) {
        this.incidentId = incidentId;
        this.area = area;
        this.description = description;
        this.incidentDate = incidentDate;
        this.priorityLevel = priorityLevel;
        this.registeredDate = registeredDate;
        this.registeredUser = registeredUser;
        this.categoryId = categoryId;
        this.departmentId = departmentId;
        this.userId = userId;
    }

    // Getters y Setters
    public Long getIncidentId() { return incidentId; }
    public void setIncidentId(Long incidentId) { this.incidentId = incidentId; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }
    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
    public String getRegisteredUser() { return registeredUser; }
    public void setRegisteredUser(String registeredUser) { this.registeredUser = registeredUser; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}