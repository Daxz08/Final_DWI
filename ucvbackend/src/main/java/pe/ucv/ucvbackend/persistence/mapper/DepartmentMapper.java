package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {

    @Mapping(source = "departmentId", target = "id")
    @Mapping(source = "name", target = "nombre")
    @Mapping(source = "code", target = "codigo")
    @Mapping(source = "floor", target = "piso")
    @Mapping(source = "classroom", target = "aula")
    @Mapping(source = "tower", target = "torre")  // Cambiado de "tower" a "tower"
    @Mapping(target = "incidencias", ignore = true)
    Departamento toDepartamento(Department department);

    @Mapping(source = "id", target = "departmentId")
    @Mapping(source = "nombre", target = "name")
    @Mapping(source = "codigo", target = "code")
    @Mapping(source = "piso", target = "floor")
    @Mapping(source = "aula", target = "classroom")
    @Mapping(source = "torre", target = "tower")  // Cambiado de "torre" a "tower"
    Department toDepartment(Departamento departamento);
}