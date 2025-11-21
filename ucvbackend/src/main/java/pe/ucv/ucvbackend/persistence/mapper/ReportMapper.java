package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Report;
import pe.ucv.ucvbackend.persistence.entity.Reporte;
import pe.ucv.ucvbackend.persistence.entity.AsignacionPersonal;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ReportMapper {

    ReportMapper INSTANCE = Mappers.getMapper(ReportMapper.class);

    // ✅ Entity → Domain (AJUSTADO A TU CLASE REPORT)
    @Mapping(source = "id", target = "reportId")
    @Mapping(source = "actions", target = "actions")
    @Mapping(source = "descripcion", target = "descripcion") // ✅ descripcion → descripcion (igual en ambos)
    @Mapping(source = "fechaResolucion", target = "resolutionDate")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "asignacionPersonal.id", target = "assignStaffId")
    @Mapping(source = "usuario.id", target = "userId")
    Report toReport(Reporte reporte);

    // ✅ Domain → Entity (AJUSTADO A TU CLASE REPORT)
    @Mapping(source = "reportId", target = "id")
    @Mapping(source = "actions", target = "actions")
    @Mapping(source = "descripcion", target = "descripcion") // ✅ descripcion → descripcion (igual en ambos)
    @Mapping(source = "resolutionDate", target = "fechaResolucion")
    @Mapping(source = "status", target = "status")
    @Mapping(target = "asignacionPersonal", ignore = true)
    @Mapping(target = "usuario", ignore = true)
    Reporte toReporte(Report report);

    // ✅ Método helper
    default Reporte toReporteWithRelations(Report report,
                                           AsignacionPersonal asignacionPersonal,
                                           Usuario usuario) {
        Reporte reporte = toReporte(report);
        reporte.setAsignacionPersonal(asignacionPersonal);
        reporte.setUsuario(usuario);
        return reporte;
    }
}