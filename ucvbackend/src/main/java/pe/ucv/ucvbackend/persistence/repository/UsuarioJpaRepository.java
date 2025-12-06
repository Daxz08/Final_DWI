package pe.ucv.ucvbackend.persistence.repository;

import pe.ucv.ucvbackend.persistence.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioJpaRepository extends JpaRepository<Usuario, Long> {

    // Query methods derivados - sin @Query
    Optional<Usuario> findByCorreo(String correo);
    List<Usuario> findByRolId(Long rolId);
    List<Usuario> findByNombresContainingIgnoreCase(String nombres);
    List<Usuario> findByApellidosContainingIgnoreCase(String apellidos);
    List<Usuario> findByCorreoContainingIgnoreCase(String correo);
    boolean existsByCorreo(String correo);
    List<Usuario> findByTelefono(String telefono);
    List<Usuario> findByNombresAndApellidos(String nombres, String apellidos);
}