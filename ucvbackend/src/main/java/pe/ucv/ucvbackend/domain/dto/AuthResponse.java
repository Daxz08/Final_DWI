package pe.ucv.ucvbackend.domain.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private Long userId;
    private String fullName;

    public AuthResponse(@JsonProperty("token") String token,
                        @JsonProperty("email") String email,
                        @JsonProperty("role") String role,
                        @JsonProperty("userId") Long userId,
                        @JsonProperty("fullName") String fullName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.fullName = fullName;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}