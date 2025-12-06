package pe.ucv.ucvbackend.domain.service;

import pe.ucv.ucvbackend.domain.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    Department createDepartment(Department department);
    Department updateDepartment(Long departmentId, Department department);
    void deleteDepartment(Long departmentId);
    Optional<Department> getDepartmentById(Long departmentId);
    Optional<Department> getDepartmentByCode(String code);
    List<Department> getAllDepartments();
    List<Department> getDepartmentsByFloor(String floor);
    List<Department> getDepartmentsByTower(String tower);
    List<Department> getDepartmentsByFloorAndTower(String floor, String tower);
    List<Department> searchDepartmentsByName(String name);
    List<Department> searchDepartmentsByCode(String code);
    boolean existsByCode(String code);
}