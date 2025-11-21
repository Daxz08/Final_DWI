package pe.ucv.ucvbackend.domain.repository;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import pe.ucv.ucvbackend.persistence.mapper.DepartmentMapper;
import pe.ucv.ucvbackend.persistence.repository.DepartamentoJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class DepartmentRepositoryImpl implements DepartmentRepository {

    private final DepartamentoJpaRepository departamentoJpaRepository;
    private final DepartmentMapper departmentMapper;

    public DepartmentRepositoryImpl(DepartamentoJpaRepository departamentoJpaRepository,
                                    DepartmentMapper departmentMapper) {
        this.departamentoJpaRepository = departamentoJpaRepository;
        this.departmentMapper = departmentMapper;
    }

    @Override
    public List<Department> findAll() {
        List<Departamento> departamentos = departamentoJpaRepository.findAll();
        return departamentos.stream()
                .map(departmentMapper::toDepartment)
                .toList();
    }

    @Override
    public Optional<Department> findById(Long id) {
        return departamentoJpaRepository.findById(id)
                .map(departmentMapper::toDepartment);
    }

    @Override
    public Department save(Department department) {
        Departamento departamento = departmentMapper.toDepartamento(department);
        Departamento savedDepartamento = departamentoJpaRepository.save(departamento);
        return departmentMapper.toDepartment(savedDepartamento);
    }

    @Override
    public void deleteById(Long id) {
        departamentoJpaRepository.deleteById(id);
    }

    @Override
    public boolean existsByName(String name) {
        return departamentoJpaRepository.existsByName(name);
    }

    @Override
    public boolean existsByCode(String code) {
        return departamentoJpaRepository.existsByCode(code);
    }
}