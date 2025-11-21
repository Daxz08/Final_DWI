import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>UCV Backend - Registro</h1>
      <RegisterForm />
      <p style={{ marginTop: 10 }}>
        ¿Ya tienes cuenta? <a href="/login">Iniciar Sesión</a>
      </p>
    </div>
  );
};

export default RegisterPage;