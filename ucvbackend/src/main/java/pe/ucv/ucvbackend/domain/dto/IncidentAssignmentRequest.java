package pe.ucv.ucvbackend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public class IncidentAssignmentRequest {
    @NotNull(message = "El ID del empleado es obligatorio")
    private Long employeeId;

    @NotNull(message = "El nivel de prioridad es obligatorio")
    private String priorityLevel;

    public IncidentAssignmentRequest(@JsonProperty("employeeId") Long employeeId,
                                     @JsonProperty("priorityLevel") String priorityLevel) {
        this.employeeId = employeeId;
        this.priorityLevel = priorityLevel;
    }

    // Getters and Setters
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
}