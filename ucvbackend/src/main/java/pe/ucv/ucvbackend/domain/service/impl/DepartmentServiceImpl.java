package pe.ucv.ucvbackend.domain.service.impl;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.domain.service.DepartmentService;
import pe.ucv.ucvbackend.domain.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public Department createDepartment(Department department) {
        if (departmentRepository.existsByCode(department.getCode())) {
            throw new RuntimeException("Ya existe un departamento con el código: " + department.getCode());
        }
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(Long departmentId, Department department) {
        Department existingDepartment = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado con ID: " + departmentId));

        // Verificar si el nuevo código ya existe (excluyendo el departamento actual)
        if (!existingDepartment.getCode().equals(department.getCode()) &&
                departmentRepository.existsByCode(department.getCode())) {
            throw new RuntimeException("Ya existe un departamento con el código: " + department.getCode());
        }

        existingDepartment.setName(department.getName());
        existingDepartment.setCode(department.getCode());
        existingDepartment.setFloor(department.getFloor());
        existingDepartment.setClassroom(department.getClassroom());
        existingDepartment.setTower(department.getTower());

        return departmentRepository.save(existingDepartment);
    }

    @Override
    public void deleteDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado con ID: " + departmentId));

        // Verificar si el departamento tiene incidencias asociadas
        // Esto requeriría una consulta adicional para contar las incidencias por departamento

        departmentRepository.deleteById(departmentId);
    }

    @Override
    public Optional<Department> getDepartmentById(Long departmentId) {
        return departmentRepository.findById(departmentId);
    }

    @Override
    public Optional<Department> getDepartmentByCode(String code) {
        return departmentRepository.findByCode(code);
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Override
    public List<Department> getDepartmentsByFloor(String floor) {
        return departmentRepository.findByFloor(floor);
    }

    @Override
    public List<Department> getDepartmentsByTower(String tower) {
        return departmentRepository.findByTower(tower);
    }

    @Override
    public List<Department> getDepartmentsByFloorAndTower(String floor, String tower) {
        return departmentRepository.findByFloorAndTower(floor, tower);
    }

    @Override
    public List<Department> searchDepartmentsByName(String name) {
        return departmentRepository.findByNameContaining(name);
    }

    @Override
    public List<Department> searchDepartmentsByCode(String code) {
        return departmentRepository.findByCodeContaining(code);
    }

    @Override
    public boolean existsByCode(String code) {
        return departmentRepository.existsByCode(code);
    }
}