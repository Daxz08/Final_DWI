package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reportes")
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "acciones", length = 255)
    private String acciones;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_incidencia")
    private EstadoIncidencia estadoIncidencia;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incidencia_id")
    private Incidencia incidencia;

    public enum EstadoIncidencia {
        pendiente, en_progreso, resuelto, no_resuelto
    }

    // Constructors
    public Reporte() {}

    public Reporte(Long id, String descripcion, String acciones, EstadoIncidencia estadoIncidencia,
                   LocalDateTime fechaRegistro, Empleado empleado, Incidencia incidencia) {
        this.id = id;
        this.descripcion = descripcion;
        this.acciones = acciones;
        this.estadoIncidencia = estadoIncidencia;
        this.fechaRegistro = fechaRegistro;
        this.empleado = empleado;
        this.incidencia = incidencia;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getAcciones() { return acciones; }
    public void setAcciones(String acciones) { this.acciones = acciones; }

    public EstadoIncidencia getEstadoIncidencia() { return estadoIncidencia; }
    public void setEstadoIncidencia(EstadoIncidencia estadoIncidencia) { this.estadoIncidencia = estadoIncidencia; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public Empleado getEmpleado() { return empleado; }
    public void setEmpleado(Empleado empleado) { this.empleado = empleado; }

    public Incidencia getIncidencia() { return incidencia; }
    public void setIncidencia(Incidencia incidencia) { this.incidencia = incidencia; }
}