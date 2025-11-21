package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    DepartmentMapper INSTANCE = Mappers.getMapper(DepartmentMapper.class);

    // ✅ Entity → Domain
    @Mapping(source = "id", target = "departmentId")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "classroom", target = "classroom")
    @Mapping(source = "floor", target = "floor")
    @Mapping(source = "tower", target = "tower")
    @Mapping(source = "registeredDate", target = "registeredDate")
    @Mapping(source = "registeredUser", target = "registeredUser")
    Department toDepartment(Departamento departamento);

    // ✅ Domain → Entity
    @Mapping(source = "departmentId", target = "id")
    @Mapping(source = "name", target = "name")
    @Mapping(source = "code", target = "code")
    @Mapping(source = "classroom", target = "classroom")
    @Mapping(source = "floor", target = "floor")
    @Mapping(source = "tower", target = "tower")
    @Mapping(source = "registeredDate", target = "registeredDate")
    @Mapping(source = "registeredUser", target = "registeredUser")
    @Mapping(target = "incidencias", ignore = true)
    Departamento toDepartamento(Department department);
}