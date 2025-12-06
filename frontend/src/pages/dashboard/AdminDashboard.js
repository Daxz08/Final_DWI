import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService, userService } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    unassignedIncidents: 0,
    totalEmployees: 0,
    totalUsers: 0,
    availableEmployees: 0,
    busyEmployees: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [AdminDashboard] Cargando datos de admin...');
      
      // Usar Promise.all para cargar en paralelo
      const [incidentsRes, employeesRes, usersRes] = await Promise.all([
        incidentService.getAll(),
        employeeService.getAll(),
        userService.getAll()
      ]);

      console.log('📥 [AdminDashboard] Respuestas completas:', {
        incidents: incidentsRes,
        employees: employeesRes,
        users: usersRes
      });

      // 🔥 CORRECCIÓN: Manejo simplificado con el servicio mejorado
      let incidentsData = [];
      let employeesData = [];
      let usersData = [];

      if (incidentsRes.success) {
        incidentsData = incidentsRes.data || [];
        console.log(`✅ [AdminDashboard] ${incidentsData.length} incidencias cargadas`);
      } else {
        console.error('❌ [AdminDashboard] Error en incidencias:', incidentsRes.message);
        setError(`Incidencias: ${incidentsRes.message}`);
      }

      if (employeesRes.success) {
        employeesData = employeesRes.data || [];
        console.log(`✅ [AdminDashboard] ${employeesData.length} empleados cargados`);
      } else {
        console.error('❌ [AdminDashboard] Error en empleados:', employeesRes.message);
        setError(prev => prev ? `${prev} | Empleados: ${employeesRes.message}` : `Empleados: ${employeesRes.message}`);
      }

      if (usersRes.success) {
        usersData = usersRes.data || [];
        console.log(`✅ [AdminDashboard] ${usersData.length} usuarios cargados`);
      } else {
        console.error('❌ [AdminDashboard] Error en usuarios:', usersRes.message);
        setError(prev => prev ? `${prev} | Usuarios: ${usersRes.message}` : `Usuarios: ${usersRes.message}`);
      }

      setIncidents(incidentsData.slice(0, 5));
      setEmployees(employeesData.slice(0, 5));
      setUsers(usersData.slice(0, 5));

      // Calcular estadísticas
      const newStats = {
        totalIncidents: incidentsData.length,
        unassignedIncidents: incidentsData.filter(inc => !inc.employeeId).length,
        totalEmployees: employeesData.length,
        totalUsers: usersData.length,
        availableEmployees: employeesData.filter(emp => 
          emp.availabilityStatus === 'AVAILABLE' || emp.estadoDisponibilidad === 'disponible'
        ).length,
        busyEmployees: employeesData.filter(emp => 
          emp.availabilityStatus === 'BUSY' || emp.estadoDisponibilidad === 'ocupado'
        ).length
      };
      
      setStats(newStats);
      console.log('📊 [AdminDashboard] Estadísticas calculadas:', newStats);
      
    } catch (error) {
      console.error('❌ [AdminDashboard] Error inesperado:', error);
      setError('Error inesperado al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NUEVO: Función para reintentar
  const retryLoadData = () => {
    fetchDashboardData();
  };

  // 🔥 CORREGIDO: Funciones de badges que SÍ se usan
  const getStatusBadge = (incident) => {
    if (!incident.employeeId) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendiente</span>;
    }
    // Verificar si tiene reporte (para determinar si está resuelta)
    const hasReport = incident.reporte || incident.report;
    if (incident.employeeId && !hasReport) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En Progreso</span>;
    }
    return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Resuelta</span>;
  };

  const getEmployeeStatusBadge = (employee) => {
    const isAvailable = employee.availabilityStatus === 'AVAILABLE' || 
                       employee.estadoDisponibilidad === 'disponible';
    
    return isAvailable 
      ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Disponible</span>
      : <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Ocupado</span>;
  };

  const getUserRoleBadge = (user) => {
    const roles = {
      'STUDENT': { color: 'bg-blue-100 text-blue-800', text: 'Estudiante' },
      'TEACHER': { color: 'bg-purple-100 text-purple-800', text: 'Docente' },
      'SUPPORT': { color: 'bg-orange-100 text-orange-800', text: 'Soporte' },
      'ADMIN': { color: 'bg-red-100 text-red-800', text: 'Admin' }
    };
    const roleInfo = roles[user.role] || roles.STUDENT;
    return <span className={`${roleInfo.color} px-2 py-1 rounded-full text-xs`}>{roleInfo.text}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue"></div>
        <div className="text-ucv-blue text-lg">Cargando dashboard...</div>
        <div className="text-gray-500 text-sm">Esto puede tomar unos segundos</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="text-red-600 text-lg">Error al cargar los datos</div>
        <div className="text-gray-600 text-sm max-w-md text-center">{error}</div>
        <button
          onClick={retryLoadData}
          className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-ucv-blue">
          Panel de Administración 👑
        </h1>
        <p className="text-gray-600 mt-1">
          Sistema de Gestión de Incidencias - Universidad César Vallejo
        </p>
        <p className="text-sm text-ucv-red mt-2 font-medium">
          Administrador: {user.firstName} {user.lastName}
        </p>
        
        {/* 🔥 NUEVO: Debug info */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Debug Info:</strong> {incidents.length} incidencias, {employees.length} empleados, {users.length} usuarios cargados
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidencias</p>
              <p className="text-2xl font-bold text-ucv-blue mt-1">{stats.totalIncidents}</p>
            </div>
            <div className="w-12 h-12 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center">
              <span className="text-ucv-blue text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Asignar</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.unassignedIncidents}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Empleados</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.availableEmployees} disp. / {stats.busyEmployees} ocup.
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          to="/admin/incidents"
          className="bg-ucv-red hover:bg-red-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📑</span>
            </div>
            <h3 className="font-semibold">Incidencias</h3>
            <p className="text-white text-opacity-90 mt-1 text-sm">
              Gestión completa
            </p>
          </div>
        </Link>

        <Link 
          to="/admin/employees"
          className="bg-ucv-blue hover:bg-blue-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold">Empleados</h3>
            <p className="text-white text-opacity-90 mt-1 text-sm">
              Gestión de personal
            </p>
          </div>
        </Link>

        <Link 
          to="/admin/users"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">Usuarios</h3>
            <p className="text-white text-opacity-90 mt-1 text-sm">
              Gestión de usuarios
            </p>
          </div>
        </Link>

        <Link 
          to="/admin/reports"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold">Reportes</h3>
            <p className="text-white text-opacity-90 mt-1 text-sm">
              Estadísticas y reportes
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Incidencias Recientes</h2>
            <Link 
              to="/admin/incidents"
              className="text-ucv-red hover:text-red-700 font-medium"
            >
              Ver todas →
            </Link>
          </div>

          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay incidencias</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ucv-blue text-sm">{incident.area}</h3>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{incident.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(incident)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Employees */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Empleados</h2>
            <Link 
              to="/admin/employees"
              className="text-ucv-red hover:text-red-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay empleados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.employeeId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ucv-blue text-sm">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-gray-600 text-xs mt-1">{employee.specialty}</p>
                      <p className="text-gray-500 text-xs mt-1">{employee.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getEmployeeStatusBadge(employee)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Usuarios</h2>
            <Link 
              to="/admin/users"
              className="text-ucv-red hover:text-red-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay usuarios</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.userId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ucv-blue text-sm">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getUserRoleBadge(user)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;