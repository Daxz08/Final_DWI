package pe.ucv.ucvbackend.domain.repository.impl;

import org.springframework.transaction.annotation.Transactional;
import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.repository.UserRepository;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.mapper.UserMapper;
import pe.ucv.ucvbackend.persistence.repository.UsuarioJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@Repository
public class UserRepositoryImpl implements UserRepository {

    private final UsuarioJpaRepository usuarioJpaRepository;
    private final UserMapper userMapper;

    public UserRepositoryImpl(UsuarioJpaRepository usuarioJpaRepository, UserMapper userMapper) {
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.userMapper = userMapper;
    }

    @Override
    public User save(User user) {
        Usuario usuario = userMapper.toUsuario(user);
        Usuario savedUsuario = usuarioJpaRepository.save(usuario);
        return userMapper.toUser(savedUsuario);
    }

    @Override
    public Optional<User> findById(Long id) {
        return usuarioJpaRepository.findById(id)
                .map(userMapper::toUser);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return usuarioJpaRepository.findByCorreo(email)
                .map(userMapper::toUser);
    }

    @Override
    public List<User> findAll() {
        return usuarioJpaRepository.findAll()
                .stream()
                .map(userMapper::toUser)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByRole(pe.ucv.ucvbackend.domain.Role role) {
        // Convertir Role domain a ID (asumiendo que los IDs coinciden con el ordinal + 1)
        Long roleId = (long) (role.ordinal() + 1);
        return usuarioJpaRepository.findByRolId(roleId)
                .stream()
                .map(userMapper::toUser)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByFirstNameContaining(String firstName) {
        return usuarioJpaRepository.findByNombresContainingIgnoreCase(firstName)
                .stream()
                .map(userMapper::toUser)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByLastNameContaining(String lastName) {
        return usuarioJpaRepository.findByApellidosContainingIgnoreCase(lastName)
                .stream()
                .map(userMapper::toUser)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return usuarioJpaRepository.existsByCorreo(email);
    }

    @Override
    public void deleteById(Long id) {
        usuarioJpaRepository.deleteById(id);
    }

    @Override
    public List<User> findByPhone(String phone) {
        return usuarioJpaRepository.findByTelefono(phone)
                .stream()
                .map(userMapper::toUser)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByFirstNameAndLastName(String firstName, String lastName) {
        return usuarioJpaRepository.findByNombresAndApellidos(firstName, lastName)
                .stream()
                .map(userMapper::toUser)
                .collect(Collectors.toList());
    }
}