package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "assign_staff")
public class AsignacionPersonal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assigned_user")
    private String usuarioAsignado;

    @Column(name = "date_solution")
    private LocalDate fechaSolucion;

    private String descripcion;

    @Column(name = "registered_date")
    private LocalDateTime fechaRegistro;

    private String estado;

    // ✅ RELACIONES JPA (REEMPLAZAN LOS IDs)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id")
    private Incidencia incidente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "asignacionPersonal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reporte> reportes = new ArrayList<>();

    // Constructores
    public AsignacionPersonal() {}

    public AsignacionPersonal(Long id, String usuarioAsignado, LocalDate fechaSolucion,
                              String descripcion, LocalDateTime fechaRegistro, String estado) {
        this.id = id;
        this.usuarioAsignado = usuarioAsignado;
        this.fechaSolucion = fechaSolucion;
        this.descripcion = descripcion;
        this.fechaRegistro = fechaRegistro;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsuarioAsignado() { return usuarioAsignado; }
    public void setUsuarioAsignado(String usuarioAsignado) { this.usuarioAsignado = usuarioAsignado; }
    public LocalDate getFechaSolucion() { return fechaSolucion; }
    public void setFechaSolucion(LocalDate fechaSolucion) { this.fechaSolucion = fechaSolucion; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    // ✅ NUEVOS GETTERS/SETTERS PARA RELACIONES
    public Incidencia getIncidente() { return incidente; }
    public void setIncidente(Incidencia incidente) { this.incidente = incidente; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public List<Reporte> getReportes() { return reportes; }
    public void setReportes(List<Reporte> reportes) { this.reportes = reportes; }
}