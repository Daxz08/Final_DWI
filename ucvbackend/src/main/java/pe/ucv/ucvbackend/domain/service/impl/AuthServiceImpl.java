package pe.ucv.ucvbackend.domain.service.impl;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.domain.service.AuthService;
import pe.ucv.ucvbackend.domain.repository.UserRepository;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import pe.ucv.ucvbackend.domain.config.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, EmployeeRepository employeeRepository,
                           JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // Asignar rol por defecto si no viene especificado
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }

        return userRepository.save(user);
    }

    @Override
    public Employee registerEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 🔥 CORRECCIÓN CRÍTICA: El employee viene del mapper con passwordHash = password (texto plano)
        // Necesitamos hashear la contraseña que viene en passwordHash
        String plainPassword = employee.getPasswordHash(); // En realidad es la contraseña en texto plano

        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }

        // Hashear la contraseña
        String hashedPassword = passwordEncoder.encode(plainPassword);
        employee.setPasswordHash(hashedPassword);

        // Asignar rol por defecto si no viene especificado
        if (employee.getRole() == null) {
            employee.setRole(Role.SUPPORT);
        }

        // Establecer disponibilidad inicial
        employee.setAvailabilityStatus(Employee.AvailabilityStatus.AVAILABLE);
        employee.setActiveIncidents(0);

        return employeeRepository.save(employee);
    }

    @Override
    public String authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return jwtService.generateToken(user);
    }

    @Override
    public String authenticateEmployee(String email, String password) {
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);
        if (employeeOpt.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado");
        }

        Employee employee = employeeOpt.get();
        if (!passwordEncoder.matches(password, employee.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return jwtService.generateToken(employee);
    }

    @Override
    public boolean validateToken(String token) {
        try {
            return jwtService.isTokenValid(token, null);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public User getCurrentUser(String token) {
        String email = jwtService.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public Employee getCurrentEmployee(String token) {
        String email = jwtService.extractUsername(token);
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
    }

    @Override
    public boolean resetUserPassword(String email, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }

        User user = userOpt.get();

        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Verificar que la nueva contraseña sea diferente
        if (passwordEncoder.matches(newPassword, user.getPasswordHash())) {
            throw new RuntimeException("La nueva contraseña debe ser diferente a la actual");
        }

        // Actualizar contraseña
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    @Override
    public boolean resetEmployeePassword(String email, String currentPassword, String newPassword) {
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

        if (employeeOpt.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado");
        }

        Employee employee = employeeOpt.get();

        // Verificar contraseña actual
        if (!passwordEncoder.matches(currentPassword, employee.getPasswordHash())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        // Verificar que la nueva contraseña sea diferente
        if (passwordEncoder.matches(newPassword, employee.getPasswordHash())) {
            throw new RuntimeException("La nueva contraseña debe ser diferente a la actual");
        }

        // Actualizar contraseña
        employee.setPasswordHash(passwordEncoder.encode(newPassword));
        employeeRepository.save(employee);
        return true;
    }
}