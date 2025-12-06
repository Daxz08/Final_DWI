package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Role;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    User updateUser(Long userId, User user);
    void deleteUser(Long userId);
    Optional<User> getUserById(Long userId);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();
    List<User> getUsersByRole(Role role);
    List<User> searchUsersByName(String name);
    List<User> searchUsersByLastName(String lastName);
    boolean existsByEmail(String email);
    User changeUserRole(Long userId, Role newRole);
}