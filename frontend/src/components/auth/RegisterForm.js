import { useState } from "react";
import { registerUser } from "../../services/authService";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";

const vacio = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  nickname: "",
  password: "",
  cargo: "",
};

export default function RegisterForm() {
  const [user, setUser] = useState(vacio);

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(user);
      alert("Usuario registrado con éxito ✅\nToken: " + data.token);
      setUser(vacio);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ width: 400, margin: "auto" }}>
        <h2>Registro de Usuario</h2>
        <TextField name="firstname" label="Nombre" value={user.firstname} onChange={onChange} required />
        <TextField name="lastname" label="Apellido" value={user.lastname} onChange={onChange} required />
        <TextField name="email" label="Correo" value={user.email} onChange={onChange} required type="email" />
        <TextField name="phone" label="Teléfono" value={user.phone} onChange={onChange} />
        <TextField name="nickname" label="Usuario" value={user.nickname} onChange={onChange} />
        <TextField name="password" label="Contraseña" value={user.password} onChange={onChange} type="password" required />
        <TextField name="cargo" label="Cargo" value={user.cargo} onChange={onChange} placeholder="Ej: Estudiante o Administrador" />
        <Button variant="contained" endIcon={<SendIcon />} type="submit">Registrar</Button>
      </Stack>
    </form>
  );
}