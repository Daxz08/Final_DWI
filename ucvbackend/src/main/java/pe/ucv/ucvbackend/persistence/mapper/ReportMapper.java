package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.persistence.entity.Reporte;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    @Mapping(source = "reportId", target = "id")
    @Mapping(source = "description", target = "descripcion")
    @Mapping(source = "actions", target = "acciones")
    @Mapping(source = "incidentStatus", target = "estadoIncidencia", qualifiedByName = "statusToEstado")
    @Mapping(source = "registrationDate", target = "fechaRegistro")
    @Mapping(source = "employeeId", target = "empleado.id")
    @Mapping(source = "incidentId", target = "incidencia.id")
    Reporte toReporte(Report report);

    @Mapping(source = "id", target = "reportId")
    @Mapping(source = "descripcion", target = "description")
    @Mapping(source = "acciones", target = "actions")
    @Mapping(source = "estadoIncidencia", target = "incidentStatus", qualifiedByName = "estadoToStatus")
    @Mapping(source = "fechaRegistro", target = "registrationDate")
    @Mapping(source = "empleado.id", target = "employeeId")
    @Mapping(source = "incidencia.id", target = "incidentId")
    Report toReport(Reporte reporte);

    @Named("statusToEstado")
    default Reporte.EstadoIncidencia statusToEstado(Report.IncidentStatus incidentStatus) {
        if (incidentStatus == null) return Reporte.EstadoIncidencia.pendiente;
        return switch (incidentStatus) {
            case PENDING -> Reporte.EstadoIncidencia.pendiente;
            case IN_PROGRESS -> Reporte.EstadoIncidencia.en_progreso;
            case RESOLVED -> Reporte.EstadoIncidencia.resuelto;
            case UNRESOLVED -> Reporte.EstadoIncidencia.no_resuelto;
        };
    }

    @Named("estadoToStatus")
    default Report.IncidentStatus estadoToStatus(Reporte.EstadoIncidencia estadoIncidencia) {
        if (estadoIncidencia == null) return Report.IncidentStatus.PENDING;
        return switch (estadoIncidencia) {
            case pendiente -> Report.IncidentStatus.PENDING;
            case en_progreso -> Report.IncidentStatus.IN_PROGRESS;
            case resuelto -> Report.IncidentStatus.RESOLVED;
            case no_resuelto -> Report.IncidentStatus.UNRESOLVED;
        };
    }
}