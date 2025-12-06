package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository {
    Employee save(Employee employee);
    Optional<Employee> findById(Long id);
    Optional<Employee> findByEmail(String email);
    List<Employee> findAll();
    List<Employee> findByRole(pe.ucv.ucvbackend.domain.Role role);
    List<Employee> findByAvailabilityStatus(Employee.AvailabilityStatus status);
    List<Employee> findBySpecialtyContaining(String specialty);
    List<Employee> findByFirstNameContaining(String firstName);
    List<Employee> findByLastNameContaining(String lastName);
    List<Employee> findByActiveIncidentsGreaterThanEqual(Integer minIncidents);
    List<Employee> findByActiveIncidentsLessThan(Integer maxIncidents);
    boolean existsByEmail(String email);
    List<Employee> findByRoleAndAvailabilityStatus(pe.ucv.ucvbackend.domain.Role role, Employee.AvailabilityStatus status);
    void deleteById(Long id);
}