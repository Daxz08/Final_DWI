package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category")
    private String category;

    private String description;

    @Column(name = "prioritylevel")
    private String priorityLevel;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;

    private String type;

    // ✅ RELACIÓN JPA COMPLETA
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Incidencia> incidencias = new ArrayList<>();

    // Constructores
    public Categoria() {}

    public Categoria(Long id, String category, String description, String priorityLevel,
                     LocalDateTime registeredDate, String type) {
        this.id = id;
        this.category = category;
        this.description = description;
        this.priorityLevel = priorityLevel;
        this.registeredDate = registeredDate;
        this.type = type;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public List<Incidencia> getIncidencias() { return incidencias; }
    public void setIncidencias(List<Incidencia> incidencias) { this.incidencias = incidencias; }
}