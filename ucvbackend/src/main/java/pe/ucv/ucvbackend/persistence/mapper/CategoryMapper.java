package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Category;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "categoryId", target = "id")
    @Mapping(source = "name", target = "nombre")
    @Mapping(source = "description", target = "descripcion")
    @Mapping(source = "type", target = "tipo")
    @Mapping(target = "incidencias", ignore = true)
    Categoria toCategoria(Category category);

    @Mapping(source = "id", target = "categoryId")
    @Mapping(source = "nombre", target = "name")
    @Mapping(source = "descripcion", target = "description")
    @Mapping(source = "tipo", target = "type")
    Category toCategory(Categoria categoria);
}