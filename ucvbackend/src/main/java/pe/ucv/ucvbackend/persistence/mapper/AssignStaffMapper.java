package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.AssignStaff;
import pe.ucv.ucvbackend.persistence.entity.AsignacionPersonal;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AssignStaffMapper {

    AssignStaffMapper INSTANCE = Mappers.getMapper(AssignStaffMapper.class);

    // ✅ Entity → Domain
    @Mapping(source = "id", target = "assignStaffId")
    @Mapping(source = "usuarioAsignado", target = "assignedUser")
    @Mapping(source = "fechaSolucion", target = "dateSolution")
    @Mapping(source = "descripcion", target = "description")
    @Mapping(source = "fechaRegistro", target = "registeredDate")
    @Mapping(source = "estado", target = "status")
    @Mapping(source = "incidente.id", target = "incidentId")
    @Mapping(source = "usuario.id", target = "userId")
    AssignStaff toAssignStaff(AsignacionPersonal asignacionPersonal);

    // ✅ Domain → Entity
    @Mapping(source = "assignStaffId", target = "id")
    @Mapping(source = "assignedUser", target = "usuarioAsignado")
    @Mapping(source = "dateSolution", target = "fechaSolucion")
    @Mapping(source = "description", target = "descripcion")
    @Mapping(source = "registeredDate", target = "fechaRegistro")
    @Mapping(source = "status", target = "estado")
    @Mapping(target = "incidente", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "reportes", ignore = true)
    AsignacionPersonal toAsignacionPersonal(AssignStaff assignStaff);

    // ✅ Método helper
    default AsignacionPersonal toAsignacionPersonalWithRelations(AssignStaff assignStaff,
                                                                 Incidencia incidente,
                                                                 Usuario usuario) {
        AsignacionPersonal asignacionPersonal = toAsignacionPersonal(assignStaff);
        asignacionPersonal.setIncidente(incidente);
        asignacionPersonal.setUsuario(usuario);
        return asignacionPersonal;
    }
}