import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      console.log('🔐 [AuthContext] Verificando autenticación...', {
        hasToken: !!token,
        hasUserData: !!userData
      });
      
      if (token && userData) {
        // Validar token con el backend
        const response = await authService.validateToken(token);
        console.log('✅ [AuthContext] Validación de token:', response.data);
        
        if (response.data.success) {
          const parsedUser = JSON.parse(userData);
          
          // 🔥 CORRECCIÓN: Normalizar estructura del usuario
          const normalizedUser = {
            ...parsedUser,
            // Asegurar que tenemos ambos IDs
            userId: parsedUser.userId || parsedUser.id,
            employeeId: parsedUser.employeeId,
            id: parsedUser.userId || parsedUser.id || parsedUser.employeeId,
            // Asegurar nombres consistentes
            firstName: parsedUser.firstName || parsedUser.nombre,
            lastName: parsedUser.lastName || parsedUser.apellidos,
            role: parsedUser.role
          };
          
          console.log('👤 [AuthContext] Usuario normalizado:', normalizedUser);
          setUser(normalizedUser);
        } else {
          console.warn('⚠️ [AuthContext] Token inválido, haciendo logout');
          logout();
        }
      } else {
        console.log('🔓 [AuthContext] No hay token o datos de usuario');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error validando autenticación:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

// context/AuthContext.js - Añade esto al login
const login = async (email, password, isEmployee) => {
  try {
    console.log('🔐 [AuthContext] Intentando login:', { email, isEmployee });
    
    let response;
    
    // 🔥 CORRECCIÓN: Usar isEmployee (booleano) en lugar de role
    if (isEmployee) {
      console.log('👷 [AuthContext] Login como empleado');
      response = await authService.loginEmployee({ email, password });
    } else {
      console.log('👤 [AuthContext] Login como usuario regular');
      response = await authService.loginUser({ email, password });
    }
    
    console.log('📥 [AuthContext] Respuesta del servidor:', response.data);
    
    if (response.data.success) {
      const userData = response.data.data;
      
      console.log('👤 [AuthContext] Datos del usuario recibidos:', userData);
      
      // 🔥 CORRECCIÓN CRÍTICA: Normalizar estructura del usuario
      const normalizedUser = {
        // Preservar todos los datos originales
        ...userData,
        
        // Asegurar campos consistentes
        userId: userData.userId || userData.id || userData.employeeId,
        employeeId: userData.employeeId || userData.id,
        id: userData.userId || userData.id || userData.employeeId,
        
        // Información personal
        firstName: userData.firstName || userData.nombre || '',
        lastName: userData.lastName || userData.apellidos || '',
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        
        // Credenciales
        email: userData.email,
        role: userData.role,
        
        // Token (si viene separado)
        token: userData.token || response.data.token
      };
      
      console.log('✅ [AuthContext] Usuario normalizado:', normalizedUser);
      
      // Guardar en localStorage
      localStorage.setItem('userData', JSON.stringify(normalizedUser));
      
      // Guardar token (si viene en data o en root)
      const token = normalizedUser.token || response.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        console.warn('⚠️ [AuthContext] No se recibió token en la respuesta');
      }
      
      setUser(normalizedUser);
      return { success: true };
    } else {
      console.error('❌ [AuthContext] Respuesta no exitosa:', response.data.message);
      return { 
        success: false, 
        error: response.data.message || 'Error en el servidor' 
      };
    }
  } catch (error) {
    console.error('❌ [AuthContext] Error en login:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Mensajes de error más específicos
    let errorMessage = 'Error de conexión';
    
    if (error.response?.status === 400) {
      errorMessage = error.response?.data?.message || 'Credenciales incorrectas';
    } else if (error.response?.status === 404) {
      errorMessage = 'Usuario no encontrado';
    } else if (error.response?.status === 401) {
      errorMessage = 'No autorizado. Verifica tus credenciales.';
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Error de red. Verifica tu conexión.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};
  // 🔥 AGREGADO: Función register que faltaba
  const register = async (userData) => {
    try {
      console.log('📝 [AuthContext] Registrando usuario:', userData);
      const response = await authService.registerUser(userData);
      
      if (response.data.success) {
        const { token, ...userInfo } = response.data.data;
        
        const normalizedUser = {
          ...userInfo,
          userId: userInfo.userId || userInfo.id,
          employeeId: userInfo.employeeId,
          id: userInfo.userId || userInfo.id || userInfo.employeeId,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          role: userInfo.role
        };  
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        
        console.log('✅ [AuthContext] Registro exitoso:', normalizedUser);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Error en el registro' 
        };
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error en registro:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error de conexión en registro' 
      };
    }
  };

  // 🔥 AGREGADO: Función logout que faltaba
  const logout = () => {
    console.log('🚪 [AuthContext] Cerrando sesión...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isSupport: user?.role === 'SUPPORT',
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    // 🔥 NUEVO: Helper para obtener ID consistente
    getUserId: () => user?.userId || user?.id,
    getEmployeeId: () => user?.employeeId || user?.id
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};