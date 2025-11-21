package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Department;
import java.util.List;
import java.util.Optional;

public interface DepartmentRepository {
    List<Department> findAll();
    Optional<Department> findById(Long id);
    Department save(Department department);
    void deleteById(Long id);
    boolean existsByName(String name);
    boolean existsByCode(String code);
}