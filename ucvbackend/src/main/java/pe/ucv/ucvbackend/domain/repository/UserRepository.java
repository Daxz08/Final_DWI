package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    List<User> findAll();
    List<User> findByRole(pe.ucv.ucvbackend.domain.Role role);
    List<User> findByFirstNameContaining(String firstName);
    List<User> findByLastNameContaining(String lastName);
    boolean existsByEmail(String email);
    void deleteById(Long id);
    List<User> findByPhone(String phone);
    List<User> findByFirstNameAndLastName(String firstName, String lastName);
}