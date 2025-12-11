import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { employeeService, categoryService, incidentService, reportService } from '../../services/api';

// Iconos SVG (manteniendo los mismos)
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  UserAdd: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-11.75A8.25 8.25 0 0012 2.25a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" />
    </svg>
  ),
  Available: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Busy: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Support: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Wrench: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  )
};

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: 'password123',
    specialty: '',
    hireDate: new Date().toISOString().split('T')[0],
    role: 'SUPPORT'
  });
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  
  // Estadísticas
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    support: 0,
    available: 0,
    busy: 0,
    inProgressIncidents: 0,
    overloaded: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterEmployees();
    calculateStats();
  }, [employees, searchTerm, roleFilter, statusFilter, specialtyFilter]);

  // 🔥 FUNCIÓN CORREGIDA: Solo contar incidencias en progreso, no cerradas
  const getEmployeeIncidentsInProgress = async (employeeId) => {
    try {
      // 1. Obtener todas las incidencias del empleado
      const incidentsRes = await incidentService.getByEmployee(employeeId);
      if (!incidentsRes.success) return 0;
      
      const allIncidents = incidentsRes.data || [];
      
      // 2. Obtener reportes del empleado
      const reportsRes = await reportService.getByEmployee(employeeId);
      const reports = reportsRes.success ? reportsRes.data || [] : [];
      
      // 3. Crear mapa de reportes por incidentId
      const reportsMap = {};
      reports.forEach(report => {
        if (report.incidentId) {
          reportsMap[report.incidentId] = report;
        }
      });
      
      // 🔥 CORRECCIÓN: Solo contar incidencias en estado "EN PROGRESO"
      let inProgressCount = 0;
      
      allIncidents.forEach(incident => {
        const report = reportsMap[incident.incidentId];
        let status = 'PENDING';
        
        // Determinar el estado actual de la incidencia
        if (report) {
          // Si tiene reporte, usar el estado del reporte
          status = report.incidentStatus || report.estadoIncidencia || 'PENDING';
        } else if (incident.employeeId || incident.assignedTo) {
          // Si no tiene reporte pero está asignada, está en progreso
          status = 'IN_PROGRESS';
        }
        
        // Convertir a mayúsculas para consistencia
        status = status.toUpperCase();
        
        // 🔥 SOLO CONTAR SI ESTÁ EN PROGRESO, NO SI ESTÁ CERRADA/RESUELTA
        const IN_PROGRESS_STATUSES = [
          'IN_PROGRESS', 
          'EN_PROGRESO', 
          'EN_CURSO',
          'ASIGNADA',
          'ASIGNED'
        ];
        
        const CLOSED_STATUSES = [
          'RESOLVED',
          'RESUELTO',
          'UNRESOLVED',
          'NO_RESUELTO',
          'CLOSED',
          'CERRADO'
        ];
        
        // Solo contar si está en progreso Y no está cerrada
        if (IN_PROGRESS_STATUSES.includes(status) && !CLOSED_STATUSES.includes(status)) {
          inProgressCount++;
        }
      });
      
      return inProgressCount;
      
    } catch (error) {
      console.error(`Error obteniendo incidencias para empleado ${employeeId}:`, error);
      return 0;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [employeesRes, categoriesRes] = await Promise.all([
        employeeService.getAll(),
        categoryService.getAll()
      ]);

      if (employeesRes.success) {
        // 🔥 Obtener incidencias en progreso para cada empleado
        const employeesWithIncidents = await Promise.all(
          (employeesRes.data || []).map(async (employee) => {
            try {
              // Obtener incidencias en progreso usando la función corregida
              const inProgressIncidents = await getEmployeeIncidentsInProgress(employee.employeeId);
              
              // 🔥 REGLA ACTUALIZADA: Solo marcar como ocupado si tiene incidencias en progreso
              let calculatedStatus = 'AVAILABLE';
              
              // Si tiene más de 5 incidencias en progreso, marcar como BUSY (Sobrecargado)
              if (inProgressIncidents > 5) {
                calculatedStatus = 'BUSY';
              }
              // Si tiene entre 1 y 5 incidencias en progreso, marcar como BUSY (Ocupado)
              else if (inProgressIncidents > 0) {
                calculatedStatus = 'BUSY';
              }
              // Si no tiene incidencias en progreso, está disponible
              else {
                calculatedStatus = 'AVAILABLE';
              }
              
              return { 
                ...employee, 
                inProgressIncidents,
                calculatedStatus
              };
            } catch (error) {
              console.error(`Error procesando empleado ${employee.employeeId}:`, error);
              return { 
                ...employee, 
                inProgressIncidents: 0,
                calculatedStatus: 'AVAILABLE'
              };
            }
          })
        );
        
        setEmployees(employeesWithIncidents);
        console.log('✅ Empleados cargados:', employeesWithIncidents);
      }
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.firstName?.toLowerCase().includes(term) ||
        emp.lastName?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        emp.specialty?.toLowerCase().includes(term)
      );
    }

    // Filtro por rol
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    // Filtro por estado calculado
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(emp => {
        const status = emp.calculatedStatus?.toUpperCase();
        return status === statusFilter;
      });
    }

    // Filtro por especialidad
    if (specialtyFilter !== 'ALL') {
      filtered = filtered.filter(emp => emp.specialty === specialtyFilter);
    }

    setFilteredEmployees(filtered);
  };

  const calculateStats = () => {
    const total = employees.length;
    const admin = employees.filter(emp => emp.role === 'ADMIN').length;
    const support = employees.filter(emp => emp.role === 'SUPPORT').length;
    
    // Calcular estados basados en reglas
    let available = 0;
    let busy = 0;
    let overloaded = 0;
    let totalInProgress = 0;
    
    employees.forEach(emp => {
      const inProgress = emp.inProgressIncidents || 0;
      totalInProgress += inProgress;
      
      if (emp.calculatedStatus === 'AVAILABLE') {
        available++;
      } else {
        busy++;
      }
      
      // Contar empleados con más de 5 incidencias en progreso
      if (inProgress > 5) {
        overloaded++;
      }
    });
    
    setStats({ 
      total, 
      admin, 
      support, 
      available, 
      busy, 
      inProgressIncidents: totalInProgress, 
      overloaded 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        passwordHash: formData.password,
        specialty: formData.specialty,
        hireDate: formData.hireDate,
        role: formData.role
      };

      let response;
      if (modalMode === 'create') {
        response = await employeeService.create(employeeData);
      } else {
        response = await employeeService.updateEmployee(currentEmployee.employeeId, employeeData);
      }
      
      if (response.success) {
        setShowModal(false);
        resetForm();
        fetchData();
        alert(`Empleado ${modalMode === 'create' ? 'creado' : 'actualizado'} exitosamente`);
      } else {
        alert(`Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} empleado: ${response.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setModalMode('edit');
    setFormData({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      password: '',
      specialty: employee.specialty || '',
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      role: employee.role || 'SUPPORT'
    });
    setShowModal(true);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        const response = await employeeService.deleteEmployee(employeeId);
        if (response.success) {
          fetchData();
          alert('Empleado eliminado exitosamente');
        } else {
          alert('Error al eliminar empleado: ' + response.message);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error al eliminar empleado: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: 'password123',
      specialty: '',
      hireDate: new Date().toISOString().split('T')[0],
      role: 'SUPPORT'
    });
    setCurrentEmployee(null);
    setModalMode('create');
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'ADMIN': { color: 'bg-red-100 text-red-800 border border-red-200', text: 'Admin', icon: <Icons.Admin /> },
      'SUPPORT': { color: 'bg-blue-100 text-blue-800 border border-blue-200', text: 'Soporte', icon: <Icons.Support /> }
    };
    const config = roleConfig[role] || roleConfig.SUPPORT;
    
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (employee) => {
    const status = employee.calculatedStatus?.toUpperCase() || 'AVAILABLE';
    const inProgressCount = employee.inProgressIncidents || 0;
    const isOverloaded = inProgressCount > 5;
    
    if (status === 'AVAILABLE') {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200 flex items-center">
          <Icons.Available />
          <span className="ml-1">Disponible</span>
        </span>
      );
    } else {
      return (
        <span className={`${isOverloaded ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
          {isOverloaded ? <Icons.Busy /> : <Icons.Clock />}
          <span className="ml-1">
            {isOverloaded ? 'Sobrecargado' : 'Ocupado'}
          </span>
        </span>
      );
    }
  };

  const getIncidentIndicator = (count) => {
    if (count === 0) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {count}
        </span>
      );
    } else if (count <= 2) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Icons.Check className="w-3 h-3 mr-1" />
          {count}
        </span>
      );
    } else if (count <= 5) {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Icons.Clock className="w-3 h-3 mr-1" />
          {count}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Icons.Busy className="w-3 h-3 mr-1" />
          {count}
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-ucv-blue">
              Gestión de Empleados
            </h1>
            <p className="text-gray-600 mt-1">
              Administra el personal de soporte técnico
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setModalMode('create');
              setShowModal(true);
            }}
            className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Icons.UserAdd />
            <span className="ml-2">Nuevo Empleado</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Actualizadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <p className="text-sm font-medium text-gray-600">Total Empleados</p>
          <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Administradores</p>
          <p className="text-xl font-bold text-red-600 mt-1">{stats.admin}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Soporte Técnico</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{stats.support}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Disponibles</p>
          <p className="text-xl font-bold text-green-600 mt-1">{stats.available}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-600">Ocupados</p>
          <p className="text-xl font-bold text-yellow-600 mt-1">{stats.busy}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-600">En Progreso</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{stats.inProgressIncidents}</p>
          <p className="text-xs text-gray-500 mt-1">Incidencias activas</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Sobrecargados</p>
          <p className="text-xl font-bold text-red-600 mt-1">{stats.overloaded}</p>
          <p className="text-xs text-gray-500 mt-1">Más de 5 incidencias</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Icons.Search />
            </div>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
          >
            <option value="ALL">Todos los roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="SUPPORT">Soporte Técnico</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
          >
            <option value="ALL">Todos los estados</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="BUSY">Ocupado</option>
          </select>
          
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
          >
            <option value="ALL">Todas las especialidades</option>
            {[...new Set(employees.map(emp => emp.specialty).filter(Boolean))].map((spec, index) => (
              <option key={index} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        
        {/* Información de depuración */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Mostrando {filteredEmployees.length} empleados de {stats.total}</p>
          {filteredEmployees.length > 0 && (
            <p>Máximo de incidencias en progreso: {Math.max(...filteredEmployees.map(e => e.inProgressIncidents || 0))}</p>
          )}
        </div>
      </div>

      {/* Tabla de Empleados */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  En Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Icons.Users className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No se encontraron empleados</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay empleados registrados'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.employeeId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          (employee.inProgressIncidents || 0) > 5 ? 'bg-red-100 text-red-800' : 
                          (employee.inProgressIncidents || 0) > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-ucv-blue bg-opacity-10 text-ucv-blue'
                        }`}>
                          <span className="font-semibold">
                            {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                            {(employee.inProgressIncidents || 0) > 5 && (
                              <span className="ml-2 text-xs text-red-600">⚠️ Sobrecargado</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                      <div className="text-xs text-gray-500">{employee.phone || 'Sin teléfono'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(employee.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{employee.specialty || 'Sin especialidad'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(employee)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <div className="text-center">
                          {getIncidentIndicator(employee.inProgressIncidents || 0)}
                        </div>
                        {(employee.inProgressIncidents || 0) > 0 && (
                          <div className="text-xs text-gray-500 text-center">
                            {employee.inProgressIncidents} activa(s)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-ucv-blue hover:text-blue-800"
                          title="Editar"
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          onClick={() => handleDelete(employee.employeeId)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear/Editar Empleado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-ucv-blue">
                {modalMode === 'create' ? 'Nuevo Empleado' : 'Editar Empleado'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icons.X />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ucv-blue mb-1">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ucv-blue mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              {modalMode === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-ucv-blue mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="text"
                    name="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                    placeholder="password123"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Contraseña por defecto: "password123"
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Especialidad *
                </label>
                <select
                  name="specialty"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="">Seleccionar especialidad</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Rol *
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="SUPPORT">Soporte Técnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Fecha de Contratación *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  required
                  value={formData.hireDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <Icons.Check />
                  <span className="ml-2">
                    {modalMode === 'create' ? 'Crear Empleado' : 'Actualizar Empleado'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;