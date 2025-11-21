package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DepartamentoJpaRepository extends JpaRepository<Departamento, Long> {
    Optional<Departamento> findByName(String name);
    Optional<Departamento> findByCode(String code);
    boolean existsByName(String name);
    boolean existsByCode(String code);
}
