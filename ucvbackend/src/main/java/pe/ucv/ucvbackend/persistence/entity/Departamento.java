package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "department")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String code;
    private String classroom;
    private String floor;
    private String tower;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;

    @Column(name = "registered_user")
    private String registeredUser;

    // ✅ RELACIÓN JPA COMPLETA
    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Incidencia> incidencias = new ArrayList<>();

    // Constructores
    public Departamento() {}

    public Departamento(Long id, String name, String code, String classroom,
                        String floor, String tower, LocalDateTime registeredDate, String registeredUser) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.classroom = classroom;
        this.floor = floor;
        this.tower = tower;
        this.registeredDate = registeredDate;
        this.registeredUser = registeredUser;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getClassroom() { return classroom; }
    public void setClassroom(String classroom) { this.classroom = classroom; }
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public String getTower() { return tower; }
    public void setTower(String tower) { this.tower = tower; }
    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
    public String getRegisteredUser() { return registeredUser; }
    public void setRegisteredUser(String registeredUser) { this.registeredUser = registeredUser; }
    public List<Incidencia> getIncidencias() { return incidencias; }
    public void setIncidencias(List<Incidencia> incidencias) { this.incidencias = incidencias; }
}