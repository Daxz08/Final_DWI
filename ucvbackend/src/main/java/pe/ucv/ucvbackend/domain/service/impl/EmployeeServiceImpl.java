package pe.ucv.ucvbackend.domain.service.impl;

import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.Role;
import pe.ucv.ucvbackend.domain.service.EmployeeService;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import pe.ucv.ucvbackend.domain.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final IncidentRepository incidentRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               IncidentRepository incidentRepository) {
        this.employeeRepository = employeeRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("El correo ya está registrado: " + employee.getEmail());
        }

        // Establecer valores por defecto
        if (employee.getActiveIncidents() == null) {
            employee.setActiveIncidents(0);
        }
        if (employee.getAvailabilityStatus() == null) {
            employee.setAvailabilityStatus(Employee.AvailabilityStatus.AVAILABLE);
        }

        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(Long employeeId, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + employeeId));

        // Actualizar campos permitidos
        existingEmployee.setFirstName(employee.getFirstName());
        existingEmployee.setLastName(employee.getLastName());
        existingEmployee.setPhone(employee.getPhone());
        existingEmployee.setSpecialty(employee.getSpecialty());

        // Solo actualizar email si es diferente y no existe otro empleado con ese email
        if (!existingEmployee.getEmail().equals(employee.getEmail()) &&
                employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("El correo ya está en uso: " + employee.getEmail());
        }
        existingEmployee.setEmail(employee.getEmail());

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        if (!employeeRepository.findById(employeeId).isPresent()) {
            throw new RuntimeException("Empleado no encontrado con ID: " + employeeId);
        }

        // Verificar si el empleado tiene incidencias asignadas
        List<pe.ucv.ucvbackend.domain.Incident> assignedIncidents =
                incidentRepository.findByEmployeeId(employeeId);
        if (!assignedIncidents.isEmpty()) {
            throw new RuntimeException("No se puede eliminar el empleado. Tiene incidencias asignadas.");
        }

        employeeRepository.deleteById(employeeId);
    }

    @Override
    public Optional<Employee> getEmployeeById(Long employeeId) {
        return employeeRepository.findById(employeeId);
    }

    @Override
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public List<Employee> getEmployeesByRole(Role role) {
        return employeeRepository.findByRole(role);
    }

    @Override
    public List<Employee> getAvailableEmployees() {
        return employeeRepository.findByAvailabilityStatus(Employee.AvailabilityStatus.AVAILABLE);
    }

    @Override
    public List<Employee> getBusyEmployees() {
        return employeeRepository.findByAvailabilityStatus(Employee.AvailabilityStatus.BUSY);
    }

    @Override
    public List<Employee> getEmployeesBySpecialty(String specialty) {
        return employeeRepository.findBySpecialtyContaining(specialty);
    }

    @Override
    public Employee updateEmployeeAvailability(Long employeeId, Employee.AvailabilityStatus status) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + employeeId));

        employee.setAvailabilityStatus(status);
        return employeeRepository.save(employee);
    }

    @Override
    public void updateActiveIncidentsCount(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + employeeId));

        // Contar incidencias activas del último mes
        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now();
        long activeIncidentsCount = incidentRepository.countByEmployeeIdAndIncidentDateBetween(
                employeeId, startDate, endDate);

        employee.setActiveIncidents((int) activeIncidentsCount);

        // Actualizar disponibilidad automáticamente
        if (activeIncidentsCount >= 5) {
            employee.setAvailabilityStatus(Employee.AvailabilityStatus.BUSY);
        } else {
            employee.setAvailabilityStatus(Employee.AvailabilityStatus.AVAILABLE);
        }

        employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getEmployeesWithHighWorkload(int minActiveIncidents) {
        return employeeRepository.findByActiveIncidentsGreaterThanEqual(minActiveIncidents);
    }

    @Override
    public boolean existsByEmail(String email) {
        return employeeRepository.existsByEmail(email);
    }
}