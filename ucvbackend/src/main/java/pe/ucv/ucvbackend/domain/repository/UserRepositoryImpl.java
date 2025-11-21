package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.persistence.entity.Usuario;
import pe.ucv.ucvbackend.persistence.mapper.UserMapper;
import pe.ucv.ucvbackend.persistence.repository.UsuarioJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final UsuarioJpaRepository usuarioJpaRepository;
    private final UserMapper userMapper;

    public UserRepositoryImpl(UsuarioJpaRepository usuarioJpaRepository, UserMapper userMapper) {
        this.usuarioJpaRepository = usuarioJpaRepository;
        this.userMapper = userMapper;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return usuarioJpaRepository.findByEmail(email)
                .map(userMapper::toUser);
    }

    @Override
    public User save(User user) {
        Usuario usuarioEntity = userMapper.toUsuario(user);
        Usuario savedUsuario = usuarioJpaRepository.save(usuarioEntity);
        return userMapper.toUser(savedUsuario);
    }

    @Override
    public Optional<User> findById(Long id) {
        return usuarioJpaRepository.findById(id)
                .map(userMapper::toUser);
    }
}