package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidencias")
public class Incidencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "area", length = 255)
    private String area;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    @Column(name = "fecha_incidencia")
    private LocalDate fechaIncidencia;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_prioridad")
    private NivelPrioridad nivelPrioridad;

    @OneToOne(mappedBy = "incidencia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Reporte reporte;

    public enum NivelPrioridad {
        baja, media, alta
    }

    // Constructors
    public Incidencia() {}

    public Incidencia(Long id, String area, String descripcion, LocalDate fechaIncidencia,
                      LocalDateTime fechaRegistro, Usuario usuario, Categoria categoria,
                      Departamento departamento, Empleado empleado, NivelPrioridad nivelPrioridad) {
        this.id = id;
        this.area = area;
        this.descripcion = descripcion;
        this.fechaIncidencia = fechaIncidencia;
        this.fechaRegistro = fechaRegistro;
        this.usuario = usuario;
        this.categoria = categoria;
        this.departamento = departamento;
        this.empleado = empleado;
        this.nivelPrioridad = nivelPrioridad;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFechaIncidencia() { return fechaIncidencia; }
    public void setFechaIncidencia(LocalDate fechaIncidencia) { this.fechaIncidencia = fechaIncidencia; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public Departamento getDepartamento() { return departamento; }
    public void setDepartamento(Departamento departamento) { this.departamento = departamento; }

    public Empleado getEmpleado() { return empleado; }
    public void setEmpleado(Empleado empleado) { this.empleado = empleado; }

    public NivelPrioridad getNivelPrioridad() { return nivelPrioridad; }
    public void setNivelPrioridad(NivelPrioridad nivelPrioridad) { this.nivelPrioridad = nivelPrioridad; }

    public Reporte getReporte() { return reporte; }
    public void setReporte(Reporte reporte) { this.reporte = reporte; }
}