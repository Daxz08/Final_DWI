package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Employee;

public interface AuthService {
    User registerUser(User user);
    Employee registerEmployee(Employee employee);
    String authenticateUser(String email, String password);
    String authenticateEmployee(String email, String password);
    boolean validateToken(String token);
    User getCurrentUser(String token);
    Employee getCurrentEmployee(String token);
    boolean resetUserPassword(String email, String currentPassword, String newPassword);
    boolean resetEmployeePassword(String email, String currentPassword, String newPassword);
}