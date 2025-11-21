package pe.ucv.ucvbackend.domain.dto;

public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String nickname;
    private String password;
    private String cargo;

    // Constructores, getters y setters


    public RegisterRequest(String firstname, String cargo, String password, String nickname, String phone, String email, String lastname) {
        this.firstname = firstname;
        this.cargo = cargo;
        this.password = password;
        this.nickname = nickname;
        this.phone = phone;
        this.email = email;
        this.lastname = lastname;
    }

    public RegisterRequest() {
    }


    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }
}