package pe.ucv.ucvbackend.web.controller;

import pe.ucv.ucvbackend.domain.Department;
import pe.ucv.ucvbackend.domain.dto.ApiResponse;
import pe.ucv.ucvbackend.domain.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ucv/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Department>> createDepartment(@Valid @RequestBody Department department) {
        try {
            Department createdDepartment = departmentService.createDepartment(department);
            return ResponseEntity.ok(ApiResponse.success("Departamento creado exitosamente", createdDepartment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        try {
            List<Department> departments = departmentService.getAllDepartments();
            return ResponseEntity.ok(ApiResponse.success(departments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Long departmentId) {
        try {
            Department department = departmentService.getDepartmentById(departmentId)
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
            return ResponseEntity.ok(ApiResponse.success(department));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentByCode(@PathVariable String code) {
        try {
            Department department = departmentService.getDepartmentByCode(code)
                    .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
            return ResponseEntity.ok(ApiResponse.success(department));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/floor/{floor}")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartmentsByFloor(@PathVariable String floor) {
        try {
            List<Department> departments = departmentService.getDepartmentsByFloor(floor);
            return ResponseEntity.ok(ApiResponse.success(departments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/tower/{tower}")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartmentsByTower(@PathVariable String tower) {
        try {
            List<Department> departments = departmentService.getDepartmentsByTower(tower);
            return ResponseEntity.ok(ApiResponse.success(departments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/floor-tower")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartmentsByFloorAndTower(
            @RequestParam String floor,
            @RequestParam String tower) {
        try {
            List<Department> departments = departmentService.getDepartmentsByFloorAndTower(floor, tower);
            return ResponseEntity.ok(ApiResponse.success(departments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<Department>> updateDepartment(
            @PathVariable Long departmentId,
            @Valid @RequestBody Department department) {
        try {
            Department updatedDepartment = departmentService.updateDepartment(departmentId, department);
            return ResponseEntity.ok(ApiResponse.success("Departamento actualizado exitosamente", updatedDepartment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long departmentId) {
        try {
            departmentService.deleteDepartment(departmentId);
            return ResponseEntity.ok(ApiResponse.success("Departamento eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search/name")
    public ResponseEntity<ApiResponse<List<Department>>> searchDepartmentsByName(@RequestParam String name) {
        try {
            List<Department> departments = departmentService.searchDepartmentsByName(name);
            return ResponseEntity.ok(ApiResponse.success(departments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/search/code")
    public ResponseEntity<ApiResponse<List<Department>>> searchDepartmentsByCode(@RequestParam String code) {
        try {
            List<Department> departments = departmentService.searchDepartmentsByCode(code);
            return ResponseEntity.ok(ApiResponse.success(departments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}