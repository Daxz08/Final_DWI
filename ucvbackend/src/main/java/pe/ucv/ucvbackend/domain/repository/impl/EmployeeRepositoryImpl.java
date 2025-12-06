package pe.ucv.ucvbackend.domain.repository.impl;

import org.springframework.transaction.annotation.Transactional;
import pe.ucv.ucvbackend.domain.Employee;
import pe.ucv.ucvbackend.domain.repository.EmployeeRepository;
import pe.ucv.ucvbackend.persistence.entity.Empleado;
import pe.ucv.ucvbackend.persistence.mapper.EmployeeMapper;
import pe.ucv.ucvbackend.persistence.repository.EmpleadoJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Transactional
@Repository
public class EmployeeRepositoryImpl implements EmployeeRepository {

    private final EmpleadoJpaRepository empleadoJpaRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeRepositoryImpl(EmpleadoJpaRepository empleadoJpaRepository, EmployeeMapper employeeMapper) {
        this.empleadoJpaRepository = empleadoJpaRepository;
        this.employeeMapper = employeeMapper;
    }

    @Override
    public Employee save(Employee employee) {
        Empleado empleado = employeeMapper.toEmpleado(employee);
        Empleado savedEmpleado = empleadoJpaRepository.save(empleado);
        return employeeMapper.toEmployee(savedEmpleado);
    }

    @Override
    public Optional<Employee> findById(Long id) {
        return empleadoJpaRepository.findById(id)
                .map(employeeMapper::toEmployee);
    }

    @Override
    public Optional<Employee> findByEmail(String email) {
        return empleadoJpaRepository.findByCorreo(email)
                .map(employeeMapper::toEmployee);
    }

    @Override
    public List<Employee> findAll() {
        return empleadoJpaRepository.findAll()
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findByRole(pe.ucv.ucvbackend.domain.Role role) {
        Long roleId = (long) (role.ordinal() + 1);
        return empleadoJpaRepository.findByRolId(roleId)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findByAvailabilityStatus(Employee.AvailabilityStatus status) {
        Empleado.EstadoDisponibilidad estado = mapToEntityAvailabilityStatus(status);
        return empleadoJpaRepository.findByEstadoDisponibilidad(estado)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findBySpecialtyContaining(String specialty) {
        return empleadoJpaRepository.findByEspecialidadContainingIgnoreCase(specialty)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findByFirstNameContaining(String firstName) {
        return empleadoJpaRepository.findByNombreContainingIgnoreCase(firstName)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findByLastNameContaining(String lastName) {
        return empleadoJpaRepository.findByApellidosContainingIgnoreCase(lastName)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findByActiveIncidentsGreaterThanEqual(Integer minIncidents) {
        return empleadoJpaRepository.findByIncidenciasActivasGreaterThanEqual(minIncidents)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public List<Employee> findByActiveIncidentsLessThan(Integer maxIncidents) {
        return empleadoJpaRepository.findByIncidenciasActivasLessThan(maxIncidents)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return empleadoJpaRepository.existsByCorreo(email);
    }

    @Override
    public List<Employee> findByRoleAndAvailabilityStatus(pe.ucv.ucvbackend.domain.Role role, Employee.AvailabilityStatus status) {
        Long roleId = (long) (role.ordinal() + 1);
        Empleado.EstadoDisponibilidad estado = mapToEntityAvailabilityStatus(status);
        return empleadoJpaRepository.findByRolIdAndEstadoDisponibilidad(roleId, estado)
                .stream()
                .map(employeeMapper::toEmployee)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        empleadoJpaRepository.deleteById(id);
    }

    private Empleado.EstadoDisponibilidad mapToEntityAvailabilityStatus(Employee.AvailabilityStatus status) {
        return status == Employee.AvailabilityStatus.AVAILABLE ?
                Empleado.EstadoDisponibilidad.disponible :
                Empleado.EstadoDisponibilidad.ocupado;
    }
}