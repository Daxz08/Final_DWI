package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.User;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
    Optional<User> findById(Long id);
}