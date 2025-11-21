package pe.ucv.ucvbackend.domain;

import java.time.LocalDateTime;

public class Department {
    private Long departmentId;
    private String name;
    private String code;
    private String classroom;
    private String floor;
    private String tower;
    private LocalDateTime registeredDate;
    private String registeredUser;

    // Constructores
    public Department() {}

    public Department(Long departmentId, String name, String code, String classroom,
                      String floor, String tower, LocalDateTime registeredDate, String registeredUser) {
        this.departmentId = departmentId;
        this.name = name;
        this.code = code;
        this.classroom = classroom;
        this.floor = floor;
        this.tower = tower;
        this.registeredDate = registeredDate;
        this.registeredUser = registeredUser;
    }

    // Getters y Setters
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

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
}