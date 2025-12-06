package pe.ucv.ucvbackend.domain;

public class Department {
    private Long departmentId;
    private String name;
    private String code;
    private String floor;
    private String classroom;
    private String tower;

    // Constructors
    public Department() {}

    public Department(Long departmentId, String name, String code, String floor,
                      String classroom, String tower) {
        this.departmentId = departmentId;
        this.name = name;
        this.code = code;
        this.floor = floor;
        this.classroom = classroom;
        this.tower = tower;
    }

    // Getters and Setters
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getClassroom() { return classroom; }
    public void setClassroom(String classroom) { this.classroom = classroom; }

    public String getTower() { return tower; }
    public void setTower(String tower) { this.tower = tower; }
}