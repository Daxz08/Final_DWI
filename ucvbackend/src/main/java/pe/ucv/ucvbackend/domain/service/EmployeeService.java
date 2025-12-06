package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.Role;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    Employee createEmployee(Employee employee);
    Employee updateEmployee(Long employeeId, Employee employee);
    void deleteEmployee(Long employeeId);
    Optional<Employee> getEmployeeById(Long employeeId);
    Optional<Employee> getEmployeeByEmail(String email);
    List<Employee> getAllEmployees();
    List<Employee> getEmployeesByRole(Role role);
    List<Employee> getAvailableEmployees();
    List<Employee> getBusyEmployees();
    List<Employee> getEmployeesBySpecialty(String specialty);
    Employee updateEmployeeAvailability(Long employeeId, Employee.AvailabilityStatus status);
    void updateActiveIncidentsCount(Long employeeId);
    List<Employee> getEmployeesWithHighWorkload(int minActiveIncidents);
    boolean existsByEmail(String email);
}