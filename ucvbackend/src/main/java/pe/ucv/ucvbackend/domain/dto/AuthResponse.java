package pe.ucv.ucvbackend.domain.dto;

public class AuthResponse {
    private String token;

    // Constructor vacío
    public AuthResponse() {}

    // Constructor con token
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    // MÉTODO ESTÁTICO SIMPLE para crear instancia
    public static AuthResponse create(String token) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        return response;
    }
}