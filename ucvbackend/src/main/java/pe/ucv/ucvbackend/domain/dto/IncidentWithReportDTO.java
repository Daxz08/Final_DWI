package pe.ucv.ucvbackend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class IncidentWithReportDTO {
    private Long incidentId;
    private String area;
    private String description;
    private LocalDate incidentDate;
    private LocalDateTime registrationDate;
    private String priorityLevel;

    // Información del reporte (si existe)
    private boolean hasReport;
    private String reportDescription;
    private String reportActions;
    private String reportStatus;
    private LocalDateTime reportDate;

    public IncidentWithReportDTO(@JsonProperty("incidentId") Long incidentId,
                                 @JsonProperty("area") String area,
                                 @JsonProperty("description") String description,
                                 @JsonProperty("incidentDate") LocalDate incidentDate,
                                 @JsonProperty("registrationDate") LocalDateTime registrationDate,
                                 @JsonProperty("priorityLevel") String priorityLevel,
                                 @JsonProperty("hasReport") boolean hasReport,
                                 @JsonProperty("reportDescription") String reportDescription,
                                 @JsonProperty("reportActions") String reportActions,
                                 @JsonProperty("reportStatus") String reportStatus,
                                 @JsonProperty("reportDate") LocalDateTime reportDate) {
        this.incidentId = incidentId;
        this.area = area;
        this.description = description;
        this.incidentDate = incidentDate;
        this.registrationDate = registrationDate;
        this.priorityLevel = priorityLevel;
        this.hasReport = hasReport;
        this.reportDescription = reportDescription;
        this.reportActions = reportActions;
        this.reportStatus = reportStatus;
        this.reportDate = reportDate;
    }

    // Getters y Setters
    // ... (generar todos los getters y setters)
}