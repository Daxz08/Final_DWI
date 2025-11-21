package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "report")
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String actions;
    private String descripcion;

    @Column(name = "resolution_date")
    private LocalDate fechaResolucion;

    private String status;

    // ✅ RELACIONES JPA (REEMPLAZAN LOS IDs)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assign_staff_id")
    private AsignacionPersonal asignacionPersonal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Usuario usuario;

    // Constructores
    public Reporte() {}

    public Reporte(Long id, String actions, String descripcion, LocalDate fechaResolucion, String status) {
        this.id = id;
        this.actions = actions;
        this.descripcion = descripcion;
        this.fechaResolucion = fechaResolucion;
        this.status = status;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getActions() { return actions; }
    public void setActions(String actions) { this.actions = actions; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFechaResolucion() { return fechaResolucion; }
    public void setFechaResolucion(LocalDate fechaResolucion) { this.fechaResolucion = fechaResolucion; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // ✅ NUEVOS GETTERS/SETTERS PARA RELACIONES
    public AsignacionPersonal getAsignacionPersonal() { return asignacionPersonal; }
    public void setAsignacionPersonal(AsignacionPersonal asignacionPersonal) { this.asignacionPersonal = asignacionPersonal; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}