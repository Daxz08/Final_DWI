import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LockResetIcon from "@mui/icons-material/LockReset";
import { changePassword } from "../../services/authServicepasword";
import { jwtDecode } from "jwt-decode";



const vacio = {
  email: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
};

export default function ChangePasswordForm() {
  const [data, setData] = useState(vacio);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }

    // 🟦 Obtener userId desde el token si existe en localStorage
    let userId = null;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.id; // depende de tu JWT, puede ser "sub" o "userId"
      }
    } catch (err) {
      console.log("No se pudo decodificar token:", err);
    }

    try {
      const response = await changePassword({
        userId: userId,         // ✔ ahora sí se envía
        email: data.email,      // ✔ opcional
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      alert("Contraseña cambiada exitosamente 🔐");
      setData(vacio);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ width: 400, margin: "auto" }}>
        <h2>Cambiar Contraseña</h2>

        <TextField
          name="email"
          label="Correo"
          value={data.email}
          onChange={onChange}
          required
          type="email"
        />

        <TextField
          name="oldPassword"
          label="Contraseña Actual"
          value={data.oldPassword}
          onChange={onChange}
          type="password"
          required
        />

        <TextField
          name="newPassword"
          label="Nueva Contraseña"
          value={data.newPassword}
          onChange={onChange}
          type="password"
          required
        />

        <TextField
          name="confirmPassword"
          label="Confirmar Contraseña"
          value={data.confirmPassword}
          onChange={onChange}
          type="password"
          required
        />

        <Button variant="contained" endIcon={<LockResetIcon />} type="submit">
          Cambiar Contraseña
        </Button>
      </Stack>
    </form>
  );
}
