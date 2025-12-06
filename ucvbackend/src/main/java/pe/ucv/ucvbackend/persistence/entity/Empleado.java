package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "empleados")
public class Empleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "correo", unique = true, nullable = false, length = 150)
    private String correo;

    @Column(name = "contraseña_hash", nullable = false, length = 255)
    private String contraseñaHash;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_disponibilidad")
    private EstadoDisponibilidad estadoDisponibilidad;

    @Column(name = "especialidad", length = 100)
    private String especialidad;

    @Column(name = "fecha_contratacion")
    private LocalDate fechaContratacion;

    @Column(name = "incidencias_activas")
    private Integer incidenciasActivas;

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Incidencia> incidencias;

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reporte> reportes;

    public enum EstadoDisponibilidad {
        disponible, ocupado
    }

    // Constructors
    public Empleado() {}

    public Empleado(Long id, String nombre, String apellidos, String telefono,
                    String correo, String contraseñaHash, Rol rol,
                    EstadoDisponibilidad estadoDisponibilidad, String especialidad,
                    LocalDate fechaContratacion, Integer incidenciasActivas) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.correo = correo;
        this.contraseñaHash = contraseñaHash;
        this.rol = rol;
        this.estadoDisponibilidad = estadoDisponibilidad;
        this.especialidad = especialidad;
        this.fechaContratacion = fechaContratacion;
        this.incidenciasActivas = incidenciasActivas;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContraseñaHash() { return contraseñaHash; }
    public void setContraseñaHash(String contraseñaHash) { this.contraseñaHash = contraseñaHash; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public EstadoDisponibilidad getEstadoDisponibilidad() { return estadoDisponibilidad; }
    public void setEstadoDisponibilidad(EstadoDisponibilidad estadoDisponibilidad) { this.estadoDisponibilidad = estadoDisponibilidad; }

    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

    public LocalDate getFechaContratacion() { return fechaContratacion; }
    public void setFechaContratacion(LocalDate fechaContratacion) { this.fechaContratacion = fechaContratacion; }

    public Integer getIncidenciasActivas() { return incidenciasActivas; }
    public void setIncidenciasActivas(Integer incidenciasActivas) { this.incidenciasActivas = incidenciasActivas; }

    public List<Incidencia> getIncidencias() { return incidencias; }
    public void setIncidencias(List<Incidencia> incidencias) { this.incidencias = incidencias; }

    public List<Reporte> getReportes() { return reportes; }
    public void setReportes(List<Reporte> reportes) { this.reportes = reportes; }
}