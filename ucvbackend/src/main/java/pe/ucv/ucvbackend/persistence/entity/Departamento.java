package pe.ucv.ucvbackend.persistence.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "departamentos")
public class Departamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", length = 255)
    private String nombre;

    @Column(name = "codigo", length = 50)
    private String codigo;

    @Column(name = "piso", length = 50)
    private String piso;

    @Column(name = "aula", length = 50)
    private String aula;

    @Column(name = "torre", length = 50)
    private String torre;

    @OneToMany(mappedBy = "departamento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Incidencia> incidencias;

    // Constructors
    public Departamento() {}

    public Departamento(Long id, String nombre, String codigo, String piso,
                        String aula, String torre) {
        this.id = id;
        this.nombre = nombre;
        this.codigo = codigo;
        this.piso = piso;
        this.aula = aula;
        this.torre = torre;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getPiso() { return piso; }
    public void setPiso(String piso) { this.piso = piso; }

    public String getAula() { return aula; }
    public void setAula(String aula) { this.aula = aula; }

    public String getTorre() { return torre; }
    public void setTorre(String torre) { this.torre = torre; }

    public List<Incidencia> getIncidencias() { return incidencias; }
    public void setIncidencias(List<Incidencia> incidencias) { this.incidencias = incidencias; }
}