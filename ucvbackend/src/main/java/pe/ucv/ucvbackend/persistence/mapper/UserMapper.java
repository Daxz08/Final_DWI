package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    // ✅ Entity → Domain (AJUSTADO A TU CLASE USER)
    @Mapping(source = "id", target = "userId")
    @Mapping(source = "firstname", target = "firstName")
    @Mapping(source = "lastname", target = "lastName")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "nickname", target = "username")
    @Mapping(source = "password", target = "password")
    @Mapping(source = "role", target = "userRole")  // ✅ role → userRole
    @Mapping(source = "cargo", target = "position")
    @Mapping(source = "active", target = "isActive")
    @Mapping(target = "authorities", ignore = true) // ✅ Se calcula automáticamente en UserDetails
    User toUser(Usuario usuario);

    // ✅ Domain → Entity (AJUSTADO A TU CLASE USER)
    @Mapping(source = "userId", target = "id")
    @Mapping(source = "firstName", target = "firstname")
    @Mapping(source = "lastName", target = "lastname")
    @Mapping(source = "email", target = "email")
    @Mapping(source = "phone", target = "phone")
    @Mapping(source = "username", target = "nickname")
    @Mapping(source = "password", target = "password")
    @Mapping(source = "userRole", target = "role")  // ✅ userRole → role
    @Mapping(source = "position", target = "cargo")
    @Mapping(source = "isActive", target = "active")
    @Mapping(target = "incidencias", ignore = true)
    @Mapping(target = "asignaciones", ignore = true)
    @Mapping(target = "reportes", ignore = true)
    Usuario toUsuario(User user);
}