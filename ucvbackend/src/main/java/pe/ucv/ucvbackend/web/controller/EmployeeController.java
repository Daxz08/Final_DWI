package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.domain.dto.ApiResponse;
import pe.ucv.ucvbackend.domain.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ucv/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@Valid @RequestBody Employee employee) {
        try {
            Employee createdEmployee = employeeService.createEmployee(employee);
            return ResponseEntity.ok(ApiResponse.success("Empleado creado exitosamente", createdEmployee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable Long employeeId) {
        try {
            Employee employee = employeeService.getEmployeeById(employeeId)
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            return ResponseEntity.ok(ApiResponse.success(employee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeByEmail(@PathVariable String email) {
        try {
            Employee employee = employeeService.getEmployeeByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            return ResponseEntity.ok(ApiResponse.success(employee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<Employee>>> getEmployeesByRole(@PathVariable String role) {
        try {
            Role employeeRole = Role.valueOf(role.toUpperCase());
            List<Employee> employees = employeeService.getEmployeesByRole(employeeRole);
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Employee>>> getAvailableEmployees() {
        try {
            List<Employee> employees = employeeService.getAvailableEmployees();
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/busy")
    public ResponseEntity<ApiResponse<List<Employee>>> getBusyEmployees() {
        try {
            List<Employee> employees = employeeService.getBusyEmployees();
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/specialty/{specialty}")
    public ResponseEntity<ApiResponse<List<Employee>>> getEmployeesBySpecialty(@PathVariable String specialty) {
        try {
            List<Employee> employees = employeeService.getEmployeesBySpecialty(specialty);
            return ResponseEntity.ok(ApiResponse.success(employees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(@PathVariable Long employeeId, @Valid @RequestBody Employee employee) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(employeeId, employee);
            return ResponseEntity.ok(ApiResponse.success("Empleado actualizado exitosamente", updatedEmployee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{employeeId}/availability")
    public ResponseEntity<ApiResponse<Employee>> updateEmployeeAvailability(
            @PathVariable Long employeeId,
            @RequestParam String status) {
        try {
            Employee.AvailabilityStatus availabilityStatus =
                    Employee.AvailabilityStatus.valueOf(status.toUpperCase());
            Employee updatedEmployee = employeeService.updateEmployeeAvailability(employeeId, availabilityStatus);
            return ResponseEntity.ok(ApiResponse.success("Disponibilidad actualizada exitosamente", updatedEmployee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{employeeId}/update-incidents")
    public ResponseEntity<ApiResponse<Void>> updateEmployeeIncidentsCount(@PathVariable Long employeeId) {
        try {
            employeeService.updateActiveIncidentsCount(employeeId);
            return ResponseEntity.ok(ApiResponse.success("Conteo de incidencias actualizado", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long employeeId) {
        try {
            employeeService.deleteEmployee(employeeId);
            return ResponseEntity.ok(ApiResponse.success("Empleado eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}