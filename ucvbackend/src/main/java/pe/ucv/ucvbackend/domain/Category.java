package pe.ucv.ucvbackend.domain;

import java.time.LocalDateTime;

public class Category {
    private Long categoryId;
    private String name;
    private String description;
    private String priorityLevel;
    private LocalDateTime registeredDate;
    private String type;

    // Constructores
    public Category() {}

    public Category(Long categoryId, String name, String description, String priorityLevel,
                    LocalDateTime registeredDate, String type) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.priorityLevel = priorityLevel;
        this.registeredDate = registeredDate;
        this.type = type;
    }

    //getter and setters
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}