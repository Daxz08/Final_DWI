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

  const login = async (email, password, isEmployee = false) => {
    try {
      console.log(`🔐 [AuthContext] Login attempt: ${email}, employee: ${isEmployee}`);
      
      const response = isEmployee 
        ? await authService.loginEmployee({ email, password })
        : await authService.loginUser({ email, password });

      console.log('📥 [AuthContext] Respuesta login:', response.data);

      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        
        // 🔥 CORRECCIÓN: Normalizar datos del usuario
        const normalizedUser = {
          ...userData,
          userId: userData.userId || userData.id,
          employeeId: userData.employeeId,
          id: userData.userId || userData.id || userData.employeeId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        };
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        
        console.log('✅ [AuthContext] Login exitoso:', normalizedUser);
        return { success: true };
      } else {
        console.warn('⚠️ [AuthContext] Login fallido:', response.data.message);
        return { 
          success: false, 
          error: response.data.message || 'Error en el login' 
        };
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error de conexión' 
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