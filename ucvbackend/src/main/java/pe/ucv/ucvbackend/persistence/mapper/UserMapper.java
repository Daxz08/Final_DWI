package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.entity.Rol;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "userId", target = "id")
    @Mapping(source = "firstName", target = "nombres")
    @Mapping(source = "lastName", target = "apellidos")
    @Mapping(source = "email", target = "correo")
    @Mapping(source = "phone", target = "telefono")
    @Mapping(source = "passwordHash", target = "contraseñaHash")
    @Mapping(source = "role", target = "rol", qualifiedByName = "roleToRol")
    @Mapping(target = "incidencias", ignore = true)
    Usuario toUsuario(User user);

    @Mapping(source = "id", target = "userId")
    @Mapping(source = "nombres", target = "firstName")
    @Mapping(source = "apellidos", target = "lastName")
    @Mapping(source = "correo", target = "email")
    @Mapping(source = "telefono", target = "phone")
    @Mapping(source = "contraseñaHash", target = "passwordHash")
    @Mapping(source = "rol", target = "role", qualifiedByName = "rolToRole")
    @Mapping(target = "authorities", ignore = true)
    User toUser(Usuario usuario);

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
}