package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.domain.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentServiceImpl.class);
    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<Department> getAllDepartments() {
        logger.info("Getting all departments");
        return departmentRepository.findAll();
    }

    @Override
    public Optional<Department> getDepartmentById(Long id) {
        logger.info("Getting department by ID: {}", id);
        return departmentRepository.findById(id);
    }

    @Override
    public Department createDepartment(Department department) {
        logger.info("Creating new department: {}", department.getName());

        // Validar que no exista un departamento con el mismo nombre
        if (departmentRepository.existsByName(department.getName())) {
            throw new IllegalArgumentException("Ya existe un departamento con el nombre: " + department.getName());
        }

        // Validar que no exista un departamento con el mismo código
        if (departmentRepository.existsByCode(department.getCode())) {
            throw new IllegalArgumentException("Ya existe un departamento con el código: " + department.getCode());
        }

        // Establecer fecha de registro si no viene
        if (department.getRegisteredDate() == null) {
            department.setRegisteredDate(java.time.LocalDateTime.now());
        }

        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Long id, Department department) {
        logger.info("Updating department with ID: {}", id);

        // Verificar que el departamento exista
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado con ID: " + id));

        // Validar nombre único (si cambió el nombre)
        if (!existingDepartment.getName().equals(department.getName()) &&
                departmentRepository.existsByName(department.getName())) {
            throw new IllegalArgumentException("Ya existe un departamento con el nombre: " + department.getName());
        }

        // Validar código único (si cambió el código)
        if (!existingDepartment.getCode().equals(department.getCode()) &&
                departmentRepository.existsByCode(department.getCode())) {
            throw new IllegalArgumentException("Ya existe un departamento con el código: " + department.getCode());
        }

        // Actualizar campos
        existingDepartment.setName(department.getName());
        existingDepartment.setCode(department.getCode());
        existingDepartment.setClassroom(department.getClassroom());
        existingDepartment.setFloor(department.getFloor());
        existingDepartment.setTower(department.getTower());
        existingDepartment.setRegisteredUser(department.getRegisteredUser());

        return departmentRepository.save(existingDepartment);
    }

    @Override
    public void deleteDepartment(Long id) {
        logger.info("Deleting department with ID: {}", id);

        // Verificar que el departamento exista
        if (!departmentRepository.findById(id).isPresent()) {
            throw new RuntimeException("Departamento no encontrado con ID: " + id);
        }

        departmentRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return departmentRepository.existsByName(name);
    }

    @Override
    public boolean existsByCode(String code) {
        return departmentRepository.existsByCode(code);
    }
}