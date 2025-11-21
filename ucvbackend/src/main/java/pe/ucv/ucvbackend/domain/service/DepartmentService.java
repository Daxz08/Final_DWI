package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    List<Department> getAllDepartments();
    Optional<Department> getDepartmentById(Long id);
    Department createDepartment(Department department);
    Department updateDepartment(Long id, Department department);
    void deleteDepartment(Long id);
    boolean existsByName(String name);
    boolean existsByCode(String code);
}