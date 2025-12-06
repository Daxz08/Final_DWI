import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/ucv';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de forma consistente
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.config.url}:`, {
      status: response.status,
      data: response.data,
      structure: 'success' in response.data ? 'standard' : 'direct'
    });
    
    // Estructura consistente para todas las respuestas
    return {
      ...response,
      data: response.data
    };
  },
  (error) => {
    console.error(`❌ [API Error] ${error.config?.url}:`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 🔥 NUEVO: Helper para procesar respuestas consistentemente
export const processApiResponse = (response, context = '') => {
  console.log(`🔄 [Processing Response] ${context}:`, response?.data);
  
  if (!response || !response.data) {
    console.warn(`⚠️ [${context}] Respuesta vacía o indefinida`);
    return { success: false, data: null, message: 'Respuesta vacía del servidor' };
  }

  const { data } = response;
  
  // Caso 1: Estructura estándar { success: true, data: ..., message: ... }
  if (data.success !== undefined && data.data !== undefined) {
    console.log(`✅ [${context}] Estructura estándar detectada`);
    return data;
  }
  
  // Caso 2: Array directo (sin estructura de éxito)
  if (Array.isArray(data)) {
    console.log(`✅ [${context}] Array directo detectado`);
    return { success: true, data, message: 'Operación exitosa' };
  }
  
  // Caso 3: Objeto con propiedad data (pero sin success)
  if (data.data && Array.isArray(data.data)) {
    console.log(`✅ [${context}] Estructura con data array detectada`);
    return { success: true, data: data.data, message: 'Operación exitosa' };
  }
  
  // Caso 4: Respuesta directa (para operaciones CRUD)
  console.log(`✅ [${context}] Respuesta directa detectada`);
  return { success: true, data, message: 'Operación exitosa' };
};

// Servicios de autenticación - ACTUALIZADOS
export const authService = {
  loginUser: (credentials) => api.post('/auth/user/login', credentials),
  registerUser: (userData) => api.post('/auth/user/register', userData),
  loginEmployee: (credentials) => api.post('/auth/employee/login', credentials),
  validateToken: (token) => api.get('/auth/validate', {
    headers: { Authorization: `Bearer ${token}` },
  }),
};

// 🔥 NUEVO: Servicios de incidencias con procesamiento consistente
export const incidentService = {
  getAll: async () => {
    try {
      console.log('🔍 [IncidentService] Obteniendo todas las incidencias...');
      const response = await api.get('/incidents');
      return processApiResponse(response, 'GET_ALL_INCIDENTS');
    } catch (error) {
      console.error('❌ [IncidentService] Error obteniendo incidencias:', error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/incidents/${id}`);
      return processApiResponse(response, `GET_INCIDENT_${id}`);
    } catch (error) {
      console.error(`❌ [IncidentService] Error obteniendo incidencia ${id}:`, error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  create: async (data) => {
    try {
      console.log('📤 [IncidentService] Creando incidencia:', data);
      const response = await api.post('/incidents', data);
      return processApiResponse(response, 'CREATE_INCIDENT');
    } catch (error) {
      console.error('❌ [IncidentService] Error creando incidencia:', error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  getByUser: async (userId) => {
    try {
      console.log(`🔍 [IncidentService] Obteniendo incidencias del usuario ${userId}...`);
      const response = await api.get(`/incidents/user/${userId}`);
      return processApiResponse(response, `GET_USER_INCIDENTS_${userId}`);
    } catch (error) {
      console.error(`❌ [IncidentService] Error obteniendo incidencias del usuario ${userId}:`, error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  assignIncidentToEmployee: async (incidentId, employeeId, priorityLevel) => {
    try {
      const response = await api.put(`/incidents/${incidentId}/assign`, { 
        employeeId, 
        priorityLevel 
      });
      return processApiResponse(response, `ASSIGN_INCIDENT_${incidentId}`);
    } catch (error) {
      console.error(`❌ [IncidentService] Error asignando incidencia:`, error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  }
};

// 🔥 NUEVO: Servicios de empleados con procesamiento consistente
export const employeeService = {
  getAll: async () => {
    try {
      console.log('🔍 [EmployeeService] Obteniendo todos los empleados...');
      const response = await api.get('/employees');
      return processApiResponse(response, 'GET_ALL_EMPLOYEES');
    } catch (error) {
      console.error('❌ [EmployeeService] Error obteniendo empleados:', error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  getAvailable: async () => {
    try {
      console.log('🔍 [EmployeeService] Obteniendo empleados disponibles...');
      const response = await api.get('/employees/available');
      return processApiResponse(response, 'GET_AVAILABLE_EMPLOYEES');
    } catch (error) {
      console.error('❌ [EmployeeService] Error obteniendo empleados disponibles:', error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  create: async (employeeData) => {
    try {
      console.log('📤 [EmployeeService] Creando empleado:', employeeData);
      
      // 🔥 CORRECCIÓN: Asegurar que enviamos passwordHash
      const dataToSend = {
        ...employeeData,
        // Asegurar que el backend reciba passwordHash en lugar de password
        passwordHash: employeeData.passwordHash || employeeData.password
      };
      
      const response = await api.post('/employees', dataToSend);
      return processApiResponse(response, 'CREATE_EMPLOYEE');
    } catch (error) {
      console.error('❌ [EmployeeService] Error creando empleado:', error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.delete(`/employees/${employeeId}`);
      return processApiResponse(response, `DELETE_EMPLOYEE_${employeeId}`);
    } catch (error) {
      console.error(`❌ [EmployeeService] Error eliminando empleado ${employeeId}:`, error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  },
  update: async (employeeId, data) => {
  try {
    const response = await api.put(`/employees/${employeeId}`, data);
    return processApiResponse(response, `UPDATE_EMPLOYEE_${employeeId}`);
  } catch (error) {
    console.error(`❌ [EmployeeService] Error actualizando empleado ${employeeId}:`, error);
    return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
  }
  }  
};

// 🔥 NUEVO: Servicios de usuarios con procesamiento consistente
export const userService = {
  getAll: async () => {
    try {
      console.log('🔍 [UserService] Obteniendo todos los usuarios...');
      const response = await api.get('/users');
      return processApiResponse(response, 'GET_ALL_USERS');
    } catch (error) {
      console.error('❌ [UserService] Error obteniendo usuarios:', error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  changeUserRole: async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, null, {
        params: { newRole }
      });
      return processApiResponse(response, `CHANGE_USER_ROLE_${userId}`);
    } catch (error) {
      console.error(`❌ [UserService] Error cambiando rol del usuario ${userId}:`, error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return processApiResponse(response, `DELETE_USER_${userId}`);
    } catch (error) {
      console.error(`❌ [UserService] Error eliminando usuario ${userId}:`, error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  },
  update: async (userId, data) => {
  try {
    const response = await api.put(`/users/${userId}`, data);
    return processApiResponse(response, `UPDATE_USER_${userId}`);
  } catch (error) {
    console.error(`❌ [UserService] Error actualizando usuario ${userId}:`, error);
    return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
  }
  }
};

// Servicios de departamentos y categorías (actualizados de forma similar)
export const departmentService = {
  getAll: async () => {
    try {
      const response = await api.get('/departments');
      return processApiResponse(response, 'GET_ALL_DEPARTMENTS');
    } catch (error) {
      console.error('❌ [DepartmentService] Error obteniendo departamentos:', error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },
  create: (data) => api.post('/departments', data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`)
};

export const categoryService = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return processApiResponse(response, 'GET_ALL_CATEGORIES');
    } catch (error) {
      console.error('❌ [CategoryService] Error obteniendo categorías:', error);
      return { success: false, data: [], message: error.response?.data?.message || 'Error del servidor' };
    }
  },
  create: (data) => api.post('/categories', data),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

// 🔥 AGREGAR: Servicio de reportes
export const reportService = {
  create: async (data) => {
    try {
      console.log('📤 [ReportService] Creando reporte:', data);
      const response = await api.post('/reports', data);
      return processApiResponse(response, 'CREATE_REPORT');
    } catch (error) {
      console.error('❌ [ReportService] Error creando reporte:', error);
      return { success: false, data: null, message: error.response?.data?.message || 'Error del servidor' };
    }
  }
};


export default api;