import { useState } from "react";
import { loginUser } from "../../services/authService";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";


const vacio = { email: "", password: "" };

export default function LoginForm() {
  const [credentials, setCredentials] = useState(vacio);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(credentials);

      localStorage.setItem("token", data.token);

      alert("Autenticación exitosa 🔐\nToken guardado en localStorage");

      setCredentials(vacio);

      // 🔹 REDIRIGE AL PANEL / NAVBAR
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ width: 400, margin: "auto" }}>
        <h2>Inicio de Sesión</h2>
        <TextField
          name="email"
          label="Correo"
          value={credentials.email}
          onChange={onChange}
          required
          type="email"
        />
        <TextField
          name="password"
          label="Contraseña"
          value={credentials.password}
          onChange={onChange}
          type="password"
          required
        />
        <Button variant="contained" endIcon={<LoginIcon />} type="submit">
          Ingresar
        </Button>
      </Stack>
    </form>
  );
}
