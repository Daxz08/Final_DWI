import ChangePasswordForm from "../components/auth/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>Recuperar / Cambiar Contraseña</h1>
      <ChangePasswordForm />

      <p style={{ marginTop: 10 }}>
        <a href="/login">Volver al Login</a>
      </p>
    </div>
  );
}