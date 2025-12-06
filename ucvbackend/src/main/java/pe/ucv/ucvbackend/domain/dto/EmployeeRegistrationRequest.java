package pe.ucv.ucvbackend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EmployeeRegistrationRequest {
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato del email no es válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @NotBlank(message = "El nombre es obligatorio")
    private String firstName;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String lastName;

    private String phone;
    private String specialty;

    @NotNull(message = "La fecha de contratación es obligatoria")
    private LocalDate hireDate;

    @NotBlank(message = "El rol es obligatorio")
    private String role;

    public EmployeeRegistrationRequest(@JsonProperty("email") String email,
                                       @JsonProperty("password") String password,
                                       @JsonProperty("firstName") String firstName,
                                       @JsonProperty("lastName") String lastName,
                                       @JsonProperty("phone") String phone,
                                       @JsonProperty("specialty") String specialty,
                                       @JsonProperty("hireDate") LocalDate hireDate,
                                       @JsonProperty("role") String role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.specialty = specialty;
        this.hireDate = hireDate;
        this.role = role;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }

    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}