package pe.ucv.ucvbackend.domain.repository.impl;

import pe.ucv.ucvbackend.domain.repository.RoleRepository;
import pe.ucv.ucvbackend.persistence.repository.RolJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class RoleRepositoryImpl implements RoleRepository {

    private final RolJpaRepository rolJpaRepository;

    public RoleRepositoryImpl(RolJpaRepository rolJpaRepository) {
        this.rolJpaRepository = rolJpaRepository;
    }

    @Override
    public Optional<pe.ucv.ucvbackend.persistence.entity.Rol> findById(Long id) {
        return rolJpaRepository.findById(id);
    }

    @Override
    public List<pe.ucv.ucvbackend.persistence.entity.Rol> findAll() {
        return rolJpaRepository.findAll();
    }

    @Override
    public Optional<pe.ucv.ucvbackend.persistence.entity.Rol> findByName(String name) {
        return rolJpaRepository.findByNombre(name);
    }

    @Override
    public List<pe.ucv.ucvbackend.persistence.entity.Rol> findByNameContaining(String name) {
        return rolJpaRepository.findByNombreContainingIgnoreCase(name);
    }

    @Override
    public boolean existsByName(String name) {
        return rolJpaRepository.existsByNombre(name);
    }
}