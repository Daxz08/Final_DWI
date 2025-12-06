package pe.ucv.ucvbackend.domain.repository.impl;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.domain.repository.DepartmentRepository;
import pe.ucv.ucvbackend.persistence.entity.Departamento;
import pe.ucv.ucvbackend.persistence.mapper.DepartmentMapper;
import pe.ucv.ucvbackend.persistence.repository.DepartamentoJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class DepartmentRepositoryImpl implements DepartmentRepository {

    private final DepartamentoJpaRepository departamentoJpaRepository;
    private final DepartmentMapper departmentMapper;

    public DepartmentRepositoryImpl(DepartamentoJpaRepository departamentoJpaRepository, DepartmentMapper departmentMapper) {
        this.departamentoJpaRepository = departamentoJpaRepository;
        this.departmentMapper = departmentMapper;
    }

    @Override
    public Department save(Department department) {
        Departamento departamento = departmentMapper.toDepartamento(department);
        Departamento savedDepartamento = departamentoJpaRepository.save(departamento);
        return departmentMapper.toDepartment(savedDepartamento);
    }

    @Override
    public Optional<Department> findById(Long id) {
        return departamentoJpaRepository.findById(id)
                .map(departmentMapper::toDepartment);
    }

    @Override
    public Optional<Department> findByCode(String code) {
        return departamentoJpaRepository.findByCodigo(code)
                .map(departmentMapper::toDepartment);
    }

    @Override
    public List<Department> findAll() {
        return departamentoJpaRepository.findAll()
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public List<Department> findByNameContaining(String name) {
        return departamentoJpaRepository.findByNombreContainingIgnoreCase(name)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public List<Department> findByFloor(String floor) {
        return departamentoJpaRepository.findByPiso(floor)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public List<Department> findByClassroom(String classroom) {
        return departamentoJpaRepository.findByAula(classroom)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public List<Department> findByTower(String tower) {
        return departamentoJpaRepository.findByTorre(tower)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public List<Department> findByFloorAndTower(String floor, String tower) {
        return departamentoJpaRepository.findByPisoAndTorre(floor, tower)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public List<Department> findByCodeContaining(String code) {
        return departamentoJpaRepository.findByCodigoContainingIgnoreCase(code)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByCode(String code) {
        return departamentoJpaRepository.existsByCodigo(code);
    }

    @Override
    public List<Department> findByNameAndFloor(String name, String floor) {
        return departamentoJpaRepository.findByNombreAndPiso(name, floor)
                .stream()
                .map(departmentMapper::toDepartment)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        departamentoJpaRepository.deleteById(id);
    }
}