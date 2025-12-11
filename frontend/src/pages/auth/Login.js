import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isEmployee: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password, formData.isEmployee);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError('');
    setForgotPasswordSuccess('');

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      setForgotPasswordLoading(false);
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE_URL}/api/ucv/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordData.email,
          currentPassword: forgotPasswordData.currentPassword,
          newPassword: forgotPasswordData.newPassword,
          confirmPassword: forgotPasswordData.confirmPassword,
          isEmployee: formData.isEmployee
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error al cambiar la contraseña');
      }

      setForgotPasswordSuccess('¡Contraseña cambiada exitosamente! Ahora puedes iniciar sesión con tu nueva contraseña.');
      
      setForgotPasswordData({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
      
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 3000);

    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    if (formData.email) {
      setForgotPasswordData(prev => ({
        ...prev,
        email: formData.email
      }));
    }
    setShowForgotPassword(true);
    setError('');
    setForgotPasswordSuccess('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        // Ruta CORREGIDA: public/fondo-login.png
        backgroundImage: 'url(/fondo-login.png)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Contenedor del formulario con fondo blanco */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            {/* Logo/Imagen arriba del título */}
            <div className="flex justify-center">
              <img 
                src="/ucv.png" // Ruta CORREGIDA: public/ucv
                alt="UCV Logo" 
                className="h-18 w-auto mb-1 mt-5"
                onError={(e) => {
                  e.target.onerror = null;
                  // Si la imagen no carga, intentamos con extensiones comunes
                  if (e.target.src === '/ucv') {
                    e.target.src = '/ucv.png';
                  } else if (e.target.src === '/ucv.png') {
                    e.target.src = '/ucv.jpg';
                  } else if (e.target.src === '/ucv.jpg') {
                    e.target.src = '/ucv.jpeg';
                  } else {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233B82F6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' /%3E%3C/svg%3E"
                  }
                }}
              />
            </div>
            
            <div>
              <h5 className="mt-2 text-center text-2xl font-extrabold text-gray-900">
                Bienvenido al Sistema de Incidencias
              </h5>
              <p className="mt-2 text-center text-sm text-gray-600">
                {showForgotPassword ? 'Cambiar Contraseña' : 'Inicia sesión en tu cuenta'}
              </p>
            </div>
          </div>
          
          {showForgotPassword && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          )}

          <div className="mt-8">
            {showForgotPassword ? (
              <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {forgotPasswordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {forgotPasswordSuccess}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="usuario@ucv.edu.pe"
                  />
                </div>

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                    value={forgotPasswordData.currentPassword}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="••••••••"
                    minLength="6"
                  />
                  <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="isEmployeeForgot"
                    name="isEmployee"
                    type="checkbox"
                    checked={formData.isEmployee}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isEmployeeForgot" className="ml-2 block text-sm text-gray-900">
                    Soy empleado/admin
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cambiando contraseña...
                      </span>
                    ) : 'Cambiar Contraseña'}
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="usuario@ucv.edu.pe"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="isEmployee"
                      name="isEmployee"
                      type="checkbox"
                      checked={formData.isEmployee}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isEmployee" className="ml-2 block text-sm text-gray-900">
                      Soy empleado/admin
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando sesión...
                      </span>
                    ) : 'Iniciar sesión'}
                  </button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <Link 
                    to="/register" 
                    className="font-medium text-blue-600 hover:text-blue-500 text-sm"
                  >
                    ¿No tienes cuenta? Regístrate aquí
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;