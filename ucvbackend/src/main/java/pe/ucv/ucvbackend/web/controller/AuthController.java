package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.User;
import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.domain.dto.ApiResponse;
import pe.ucv.ucvbackend.domain.dto.AuthResponse;
import pe.ucv.ucvbackend.domain.dto.AuthenticationRequest;
import pe.ucv.ucvbackend.domain.dto.RegisterRequest;
import pe.ucv.ucvbackend.domain.dto.EmployeeRegistrationRequest;
import pe.ucv.ucvbackend.domain.service.AuthService;
import pe.ucv.ucvbackend.domain.service.UserService;
import pe.ucv.ucvbackend.domain.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/ucv/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final EmployeeService employeeService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthService authService, UserService userService,
                          EmployeeService employeeService, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.userService = userService;
        this.employeeService = employeeService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/user/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(@Valid @RequestBody RegisterRequest request) {
        try {
            // Convertir RegisterRequest a User domain
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPasswordHash(request.getPassword());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhone(request.getPhone());

            // Asignar rol
            if (request.getRole() != null) {
                user.setRole(Role.valueOf(request.getRole().toUpperCase()));
            } else {
                user.setRole(Role.STUDENT);
            }

            User registeredUser = authService.registerUser(user);
            String token = authService.authenticateUser(request.getEmail(), request.getPassword());

            AuthResponse authResponse = new AuthResponse(
                    token,
                    registeredUser.getEmail(),
                    registeredUser.getRole().name(),
                    registeredUser.getUserId(),
                    registeredUser.getFirstName() + " " + registeredUser.getLastName()
            );

            return ResponseEntity.ok(ApiResponse.success("Usuario registrado exitosamente", authResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/employee/register")
    public ResponseEntity<ApiResponse<AuthResponse>> registerEmployee(@Valid @RequestBody EmployeeRegistrationRequest request) {
        try {
            // Convertir EmployeeRegistrationRequest a Employee domain
            Employee employee = new Employee();
            employee.setEmail(request.getEmail());
            employee.setPasswordHash(request.getPassword());
            employee.setFirstName(request.getFirstName());
            employee.setLastName(request.getLastName());
            employee.setPhone(request.getPhone());
            employee.setSpecialty(request.getSpecialty());
            employee.setHireDate(request.getHireDate());
            employee.setRole(Role.valueOf(request.getRole().toUpperCase()));

            Employee registeredEmployee = authService.registerEmployee(employee);
            String token = authService.authenticateEmployee(request.getEmail(), request.getPassword());

            AuthResponse authResponse = new AuthResponse(
                    token,
                    registeredEmployee.getEmail(),
                    registeredEmployee.getRole().name(),
                    registeredEmployee.getEmployeeId(),
                    registeredEmployee.getFirstName() + " " + registeredEmployee.getLastName()
            );

            return ResponseEntity.ok(ApiResponse.success("Empleado registrado exitosamente", authResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/user/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody AuthenticationRequest request) {
        try {
            String token = authService.authenticateUser(request.getEmail(), request.getPassword());
            User user = authService.getCurrentUser(token);

            AuthResponse authResponse = new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getRole().name(),
                    user.getUserId(),
                    user.getFirstName() + " " + user.getLastName()
            );

            return ResponseEntity.ok(ApiResponse.success("Login exitoso", authResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/employee/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateEmployee(@Valid @RequestBody AuthenticationRequest request) {
        try {
            String token = authService.authenticateEmployee(request.getEmail(), request.getPassword());
            Employee employee = authService.getCurrentEmployee(token);

            AuthResponse authResponse = new AuthResponse(
                    token,
                    employee.getEmail(),
                    employee.getRole().name(),
                    employee.getEmployeeId(),
                    employee.getFirstName() + " " + employee.getLastName()
            );

            return ResponseEntity.ok(ApiResponse.success("Login exitoso", authResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            boolean isValid = authService.validateToken(token);
            return ResponseEntity.ok(ApiResponse.success("Token válido", isValid));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Token inválido"));
        }
    }
}