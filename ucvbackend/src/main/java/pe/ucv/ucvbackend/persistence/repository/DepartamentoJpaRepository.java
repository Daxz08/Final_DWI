package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DepartamentoJpaRepository extends JpaRepository<Departamento, Long> {

    // Query methods derivados - sin @Query
    Optional<Departamento> findByCodigo(String codigo);
    List<Departamento> findByNombreContainingIgnoreCase(String nombre);
    List<Departamento> findByPiso(String piso);
    List<Departamento> findByAula(String aula);
    List<Departamento> findByTorre(String torre);
    List<Departamento> findByPisoAndTorre(String piso, String torre);
    List<Departamento> findByCodigoContainingIgnoreCase(String codigo);
    boolean existsByCodigo(String codigo);
    List<Departamento> findByNombreAndPiso(String nombre, String piso);
}