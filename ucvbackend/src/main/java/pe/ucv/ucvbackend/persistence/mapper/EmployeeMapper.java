package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.persistence.entity.Empleado;
import pe.ucv.ucvbackend.persistence.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {

    @Mapping(source = "employeeId", target = "id")
    @Mapping(source = "firstName", target = "nombre")
    @Mapping(source = "lastName", target = "apellidos")
    @Mapping(source = "phone", target = "telefono")
    @Mapping(source = "email", target = "correo")
    @Mapping(source = "passwordHash", target = "contraseñaHash")
    @Mapping(source = "role", target = "rol", qualifiedByName = "roleToRol")
    @Mapping(source = "availabilityStatus", target = "estadoDisponibilidad", qualifiedByName = "availabilityToEstado")
    @Mapping(source = "specialty", target = "especialidad")
    @Mapping(source = "hireDate", target = "fechaContratacion")
    @Mapping(source = "activeIncidents", target = "incidenciasActivas")
    @Mapping(target = "incidencias", ignore = true)
    @Mapping(target = "reportes", ignore = true)
    Empleado toEmpleado(Employee employee);

    @Mapping(source = "id", target = "employeeId")
    @Mapping(source = "nombre", target = "firstName")
    @Mapping(source = "apellidos", target = "lastName")
    @Mapping(source = "telefono", target = "phone")
    @Mapping(source = "correo", target = "email")
    @Mapping(source = "contraseñaHash", target = "passwordHash")
    @Mapping(source = "rol", target = "role", qualifiedByName = "rolToRole")
    @Mapping(source = "estadoDisponibilidad", target = "availabilityStatus", qualifiedByName = "estadoToAvailability")
    @Mapping(source = "especialidad", target = "specialty")
    @Mapping(source = "fechaContratacion", target = "hireDate")
    @Mapping(source = "incidenciasActivas", target = "activeIncidents")
    @Mapping(target = "authorities", ignore = true)
    Employee toEmployee(Empleado empleado);

    @Named("roleToRol")
    default Rol roleToRol(Role role) {
        if (role == null) return null;

        Rol rol = new Rol();
        // Asignar ID basado en el enum (esto debería venir de la BD)
        switch (role) {
            case ADMIN -> rol.setId(1L);
            case SUPPORT -> rol.setId(2L);
            case TEACHER -> rol.setId(3L);
            case STUDENT -> rol.setId(4L);
        }
        rol.setNombre(role.name());
        return rol;
    }

    @Named("rolToRole")
    default Role rolToRole(Rol rol) {
        if (rol == null) return null;
        return Role.valueOf(rol.getNombre());
    }

    @Named("availabilityToEstado")
    default Empleado.EstadoDisponibilidad availabilityToEstado(Employee.AvailabilityStatus status) {
        if (status == null) return Empleado.EstadoDisponibilidad.disponible;
        return status == Employee.AvailabilityStatus.AVAILABLE ?
                Empleado.EstadoDisponibilidad.disponible :
                Empleado.EstadoDisponibilidad.ocupado;
    }

    @Named("estadoToAvailability")
    default Employee.AvailabilityStatus estadoToAvailability(Empleado.EstadoDisponibilidad estado) {
        if (estado == null) return Employee.AvailabilityStatus.AVAILABLE;
        return estado == Empleado.EstadoDisponibilidad.disponible ?
                Employee.AvailabilityStatus.AVAILABLE :
                Employee.AvailabilityStatus.BUSY;
    }
}