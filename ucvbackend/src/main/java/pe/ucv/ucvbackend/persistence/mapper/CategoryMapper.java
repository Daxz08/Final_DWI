package pe.ucv.ucvbackend.persistence.mapper;

import pe.ucv.ucvbackend.domain.Category;
import pe.ucv.ucvbackend.persistence.entity.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    // ✅ Entity → Domain (AJUSTADO A TU CLASE CATEGORY)
    @Mapping(source = "id", target = "categoryId")
    @Mapping(source = "category", target = "name") // ✅ category (entity) → name (domain)
    @Mapping(source = "description", target = "description")
    @Mapping(source = "priorityLevel", target = "priorityLevel")
    @Mapping(source = "registeredDate", target = "registeredDate")
    @Mapping(source = "type", target = "type")
    Category toCategory(Categoria categoria);

    // ✅ Domain → Entity (AJUSTADO A TU CLASE CATEGORY)
    @Mapping(source = "categoryId", target = "id")
    @Mapping(source = "name", target = "category") // ✅ name (domain) → category (entity)
    @Mapping(source = "description", target = "description")
    @Mapping(source = "priorityLevel", target = "priorityLevel")
    @Mapping(source = "registeredDate", target = "registeredDate")
    @Mapping(source = "type", target = "type")
    @Mapping(target = "incidencias", ignore = true)
    Categoria toCategoria(Category category);
}