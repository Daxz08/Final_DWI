package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Incident;
import pe.ucv.ucvbackend.persistence.entity.Incidencia;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface IncidentMapper {

    IncidentMapper INSTANCE = Mappers.getMapper(IncidentMapper.class);

    // ✅ Entity → Domain
    @Mapping(source = "id", target = "incidentId")
    @Mapping(source = "area", target = "area")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "fechaIncidencia", target = "incidentDate")
    @Mapping(source = "nivelPrioridad", target = "priorityLevel")
    @Mapping(source = "fechaRegistro", target = "registeredDate")
    @Mapping(source = "usuarioRegistro", target = "registeredUser")
    @Mapping(source = "categoria.id", target = "categoryId")
    @Mapping(source = "departamento.id", target = "departmentId")
    @Mapping(source = "usuario.id", target = "userId")
    Incident toIncident(Incidencia incidencia);

    // ✅ Domain → Entity
    @Mapping(source = "incidentId", target = "id")
    @Mapping(source = "area", target = "area")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "incidentDate", target = "fechaIncidencia")
    @Mapping(source = "priorityLevel", target = "nivelPrioridad")
    @Mapping(source = "registeredDate", target = "fechaRegistro")
    @Mapping(source = "registeredUser", target = "usuarioRegistro")
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "departamento", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Incidencia toIncidencia(Incident incident);

    // ✅ Método helper
    default Incidencia toIncidenciaWithRelations(Incident incident,
                                                 Categoria categoria,
                                                 Departamento departamento,
                                                 Usuario usuario) {
        Incidencia incidencia = toIncidencia(incident);
        incidencia.setCategoria(categoria);
        incidencia.setDepartamento(departamento);
        incidencia.setUsuario(usuario);
        return incidencia;
    }
}