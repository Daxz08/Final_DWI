package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface IncidentMapper {

    @Mapping(source = "incidentId", target = "id")
    @Mapping(source = "area", target = "area")
    @Mapping(source = "description", target = "descripcion")
    @Mapping(source = "incidentDate", target = "fechaIncidencia")
    @Mapping(source = "registrationDate", target = "fechaRegistro")
    @Mapping(source = "userId", target = "usuario.id")
    @Mapping(source = "categoryId", target = "categoria.id")
    @Mapping(source = "departmentId", target = "departamento.id")
    @Mapping(source = "employeeId", target = "empleado.id")
    @Mapping(source = "priorityLevel", target = "nivelPrioridad", qualifiedByName = "priorityToNivel")
    @Mapping(target = "reporte", ignore = true)
    Incidencia toIncidencia(Incident incident);

    @Mapping(source = "id", target = "incidentId")
    @Mapping(source = "area", target = "area")
    @Mapping(source = "descripcion", target = "description")
    @Mapping(source = "fechaIncidencia", target = "incidentDate")
    @Mapping(source = "fechaRegistro", target = "registrationDate")
    @Mapping(source = "usuario.id", target = "userId")
    @Mapping(source = "categoria.id", target = "categoryId")
    @Mapping(source = "departamento.id", target = "departmentId")
    @Mapping(source = "empleado.id", target = "employeeId")
    @Mapping(source = "nivelPrioridad", target = "priorityLevel", qualifiedByName = "nivelToPriority")
    Incident toIncident(Incidencia incidencia);

    @Named("priorityToNivel")
    default Incidencia.NivelPrioridad priorityToNivel(Incident.PriorityLevel priorityLevel) {
        if (priorityLevel == null) return Incidencia.NivelPrioridad.media;
        return switch (priorityLevel) {
            case LOW -> Incidencia.NivelPrioridad.baja;
            case MEDIUM -> Incidencia.NivelPrioridad.media;
            case HIGH -> Incidencia.NivelPrioridad.alta;
        };
    }

    @Named("nivelToPriority")
    default Incident.PriorityLevel nivelToPriority(Incidencia.NivelPrioridad nivelPrioridad) {
        if (nivelPrioridad == null) return Incident.PriorityLevel.MEDIUM;
        return switch (nivelPrioridad) {
            case baja -> Incident.PriorityLevel.LOW;
            case media -> Incident.PriorityLevel.MEDIUM;
            case alta -> Incident.PriorityLevel.HIGH;
        };
    }
}