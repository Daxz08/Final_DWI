package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Role;
import java.util.List;
import java.util.Optional;

public interface RoleRepository {
    Optional<pe.ucv.ucvbackend.persistence.entity.Rol> findById(Long id);
    List<pe.ucv.ucvbackend.persistence.entity.Rol> findAll();
    Optional<pe.ucv.ucvbackend.persistence.entity.Rol> findByName(String name);
    List<pe.ucv.ucvbackend.persistence.entity.Rol> findByNameContaining(String name);
    boolean existsByName(String name);
}