package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentRepository {
    Department save(Department department);
    Optional<Department> findById(Long id);
    Optional<Department> findByCode(String code);
    List<Department> findAll();
    List<Department> findByNameContaining(String name);
    List<Department> findByFloor(String floor);
    List<Department> findByClassroom(String classroom);
    List<Department> findByTower(String tower);
    List<Department> findByFloorAndTower(String floor, String tower);
    List<Department> findByCodeContaining(String code);
    boolean existsByCode(String code);
    List<Department> findByNameAndFloor(String name, String floor);
    void deleteById(Long id);
}