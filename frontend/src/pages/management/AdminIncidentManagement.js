import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService, userService, reportService } from '../../services/api';

// Importar iconos de Heroicons (o usar íconos SVG)
// Si usas @heroicons/react, necesitarías instalarlo: npm install @heroicons/react
import {
  EyeIcon,
  UserIcon,
  PencilIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  BookOpenIcon,
  BeakerIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

// Si no puedes usar Heroicons, aquí tienes una alternativa con SVG
const Iconos = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Add: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  View: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Assign: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  Report: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  )
};

const AdminIncidentManagement = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [assignmentFilter, setAssignmentFilter] = useState('ALL'); // NUEVO FILTRO
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    priorityLevel: 'MEDIUM'
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [incidentsRes, employeesRes, usersRes, reportsRes] = await Promise.allSettled([
        incidentService.getAll(),
        employeeService.getAll(),
        userService.getAll(),
        reportService.getAll()
      ]);

      const incidentsData = incidentsRes.status === 'fulfilled' 
        ? (incidentsRes.value?.data || []) 
        : [];
      const employeesData = employeesRes.status === 'fulfilled' 
        ? (employeesRes.value?.data || []) 
        : [];
      const usersData = usersRes.status === 'fulfilled' 
        ? (usersRes.value?.data || []) 
        : [];
      const reportsData = reportsRes.status === 'fulfilled' 
        ? (reportsRes.value?.data || []) 
        : [];

      const employeesMap = {};
      employeesData.forEach(emp => {
        if (emp.employeeId) employeesMap[emp.employeeId] = emp;
      });

      const reportsMap = {};
      reportsData.forEach(report => {
        if (report.incidentId) reportsMap[report.incidentId] = report;
      });

      const enrichedIncidents = incidentsData.map(incident => {
        const report = reportsMap[incident.incidentId];
        let status = 'PENDING';
        
        if (report) {
          status = report.incidentStatus || report.estadoIncidencia || 'IN_PROGRESS';
        } else if (incident.employeeId || incident.assignedTo) {
          status = 'IN_PROGRESS';
        }

        let assignedEmployee = null;
        const employeeId = incident.employeeId || incident.assignedTo;
        if (employeeId && employeesMap[employeeId]) {
          assignedEmployee = employeesMap[employeeId];
        }

        return {
          ...incident,
          report: report || null,
          status: status.toUpperCase(),
          hasReport: !!report,
          assignedEmployee,
          priorityLevel: incident.priorityLevel || 'MEDIUM',
          isAssigned: !!(incident.employeeId || incident.assignedTo) // NUEVO CAMPO
        };
      });

      enrichedIncidents.sort((a, b) => 
        new Date(b.incidentDate || b.createdAt) - new Date(a.incidentDate || a.createdAt)
      );

      setIncidents(enrichedIncidents);
      setEmployees(employeesData);
      setUsers(usersData);
      setReports(reportsData);

    } catch (globalError) {
      console.error('❌ Error cargando datos:', globalError);
      setError(`Error al cargar datos: ${globalError.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNCIONES PARA BADGES CON ICONOS PROFESIONALES
  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <ClockIcon className="w-3 h-3 mr-1" />
      },
      'PENDIENTE': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <ClockIcon className="w-3 h-3 mr-1" />
      },
      'IN_PROGRESS': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
      },
      'EN_PROGRESO': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
      },
      'RESOLVED': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelta',
        icon: <CheckCircleIcon className="w-3 h-3 mr-1" />
      },
      'RESUELTO': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelta',
        icon: <CheckCircleIcon className="w-3 h-3 mr-1" />
      },
      'UNRESOLVED': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelta',
        icon: <ExclamationCircleIcon className="w-3 h-3 mr-1" />
      },
      'NO_RESUELTO': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelta',
        icon: <ExclamationCircleIcon className="w-3 h-3 mr-1" />
      }
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;
    return (
      <span className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {statusInfo.icon}
        {statusInfo.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'LOW': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Baja',
        icon: <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
      },
      'BAJA': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Baja',
        icon: <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
      },
      'MEDIUM': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Media',
        icon: <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
      },
      'MEDIA': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Media',
        icon: <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
      },
      'HIGH': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'Alta',
        icon: <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
      },
      'ALTA': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'Alta',
        icon: <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
      }
    };

    const priorityInfo = priorityMap[priority] || priorityMap.MEDIUM;
    return (
      <span className={`${priorityInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {priorityInfo.icon}
        {priorityInfo.text}
      </span>
    );
  };

  const getAreaBadge = (area) => {
    const areaMap = {
      'LABORATORIO': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        icon: <BeakerIcon className="w-3 h-3 mr-1" />
      },
      'AULA': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        icon: <BookOpenIcon className="w-3 h-3 mr-1" />
      },
      'OFICINA': { 
        color: 'bg-purple-50 text-purple-800 border border-purple-200', 
        icon: <BuildingOfficeIcon className="w-3 h-3 mr-1" />
      },
      'BIBLIOTECA': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        icon: <BookOpenIcon className="w-3 h-3 mr-1" />
      },
      'SISTEMAS': { 
        color: 'bg-pink-50 text-pink-800 border border-pink-200', 
        icon: <ComputerDesktopIcon className="w-3 h-3 mr-1" />
      },
      'REDES': { 
        color: 'bg-gray-50 text-gray-800 border border-gray-200', 
        icon: <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
      },
      'SOFTWARE': { 
        color: 'bg-teal-50 text-teal-800 border border-teal-200', 
        icon: <ComputerDesktopIcon className="w-3 h-3 mr-1" />
      },
      'HARDWARE': { 
        color: 'bg-orange-50 text-orange-800 border border-orange-200', 
        icon: <WrenchScrewdriverIcon className="w-3 h-3 mr-1" />
      }
    };

    const areaInfo = areaMap[area] || { 
      color: 'bg-gray-50 text-gray-800 border border-gray-200', 
      icon: <BuildingOfficeIcon className="w-3 h-3 mr-1" />
    };
    
    return (
      <span className={`${areaInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {areaInfo.icon}
        {area}
      </span>
    );
  };

  const getReportBadge = (hasReport) => {
    return hasReport ? (
      <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200 flex items-center">
        <DocumentTextIcon className="w-3 h-3 mr-1" />
        Con Reporte
      </span>
    ) : (
      <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200 flex items-center">
        <ClockIcon className="w-3 h-3 mr-1" />
        Sin Reporte
      </span>
    );
  };

  const getEmployeeBadge = (employee) => {
    if (!employee) {
      return (
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 flex items-center">
          <UserIcon className="w-3 h-3 mr-1" />
          Sin asignar
        </span>
      );
    }

    const availability = employee.availabilityStatus || employee.estadoDisponibilidad;
    const isAvailable = availability === 'AVAILABLE' || availability === 'disponible';
    
    return (
      <span className={`${isAvailable ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        <UserIcon className="w-3 h-3 mr-1" />
        {employee.firstName} {employee.lastName}
      </span>
    );
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Usuario no encontrado';
  };

  const handleAssignClick = (incident) => {
    setSelectedIncident(incident);
    setAssignForm({
      employeeId: incident.employeeId || '',
      priorityLevel: incident.priorityLevel || 'MEDIUM'
    });
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    try {
      const response = await incidentService.assignIncidentToEmployee(
        selectedIncident.incidentId, 
        assignForm.employeeId, 
        assignForm.priorityLevel
      );
      
      if (response.success) {
        setShowAssignModal(false);
        setSelectedIncident(null);
        fetchData();
        alert('✅ Incidencia asignada exitosamente');
      } else {
        alert('❌ Error al asignar incidencia: ' + response.message);
      }
    } catch (error) {
      console.error('Error assigning incident:', error);
      alert('❌ Error al asignar la incidencia: ' + (error.response?.data?.message || error.message));
    }
  };

  // 🔥 FILTRADO DE INCIDENCIAS (INCLUYE NUEVO FILTRO)
  const filteredIncidents = incidents.filter(incident => {
    // Filtro por búsqueda
    const matchesSearch = searchTerm === '' || 
      incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.incidentId?.toString().includes(searchTerm) ||
      (incident.assignedEmployee?.firstName + ' ' + incident.assignedEmployee?.lastName)
        ?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por estado
    const matchesStatus = statusFilter === 'ALL' || 
      incident.status === statusFilter ||
      (statusFilter === 'PENDIENTE' && incident.status === 'PENDING') ||
      (statusFilter === 'EN_PROGRESO' && (incident.status === 'IN_PROGRESS' || incident.status === 'EN_CURSO')) ||
      (statusFilter === 'RESUELTO' && incident.status === 'RESOLVED') ||
      (statusFilter === 'NO_RESUELTO' && incident.status === 'UNRESOLVED');

    // Filtro por prioridad
    const matchesPriority = priorityFilter === 'ALL' || 
      incident.priorityLevel === priorityFilter ||
      (priorityFilter === 'BAJA' && incident.priorityLevel === 'LOW') ||
      (priorityFilter === 'MEDIA' && incident.priorityLevel === 'MEDIUM') ||
      (priorityFilter === 'ALTA' && incident.priorityLevel === 'HIGH');

    // 🔥 NUEVO FILTRO: POR ASIGNACIÓN
    const matchesAssignment = assignmentFilter === 'ALL' ||
      (assignmentFilter === 'ASSIGNED' && incident.isAssigned) ||
      (assignmentFilter === 'UNASSIGNED' && !incident.isAssigned);

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignment;
  });

  // 🔥 ESTADÍSTICAS RÁPIDAS
  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'PENDING' || i.status === 'PENDIENTE').length,
    inProgress: incidents.filter(i => 
      i.status === 'IN_PROGRESS' || i.status === 'EN_PROGRESO' || i.status === 'EN_CURSO'
    ).length,
    resolved: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'RESUELTO').length,
    withReport: incidents.filter(i => i.hasReport).length,
    withoutReport: incidents.filter(i => !i.hasReport).length,
    unassigned: incidents.filter(i => !i.employeeId && !i.assignedTo).length,
    assigned: incidents.filter(i => i.employeeId || i.assignedTo).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue"></div>
        <div className="text-ucv-blue text-lg">Cargando incidencias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="text-red-600 text-lg font-semibold">Error al cargar incidencias</div>
        <div className="text-gray-600 text-sm max-w-md text-center">{error}</div>
        <button
          onClick={fetchData}
          className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Reintentar
        </button>
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
              Gestión de Incidencias
            </h1>
            <p className="text-gray-600 mt-1">
              Administra todas las incidencias del sistema
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="text-ucv-blue hover:text-blue-800 font-medium flex items-center"
          >
            ← Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <p className="text-sm font-medium text-gray-600">Total</p>
          <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-600">Pendientes</p>
          <p className="text-xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">En Progreso</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Resueltas</p>
          <p className="text-xl font-bold text-green-600 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-600">Con Reporte</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{stats.withReport}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">Sin Reporte</p>
          <p className="text-xl font-bold text-red-600 mt-1">{stats.withoutReport}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
          <p className="text-sm font-medium text-gray-600">Asignadas</p>
          <p className="text-xl font-bold text-orange-600 mt-1">{stats.assigned}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-gray-500">
          <p className="text-sm font-medium text-gray-600">Sin Asignar</p>
          <p className="text-xl font-bold text-gray-600 mt-1">{stats.unassigned}</p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar incidencias por ID, descripción, área o empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <MagnifyingGlassIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue text-sm"
            >
              <option value="ALL">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="RESOLVED">Resuelta</option>
              <option value="UNRESOLVED">No Resuelta</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue text-sm"
            >
              <option value="ALL">Todas las prioridades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
            
            {/* 🔥 NUEVO FILTRO: ASIGNACIÓN */}
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue text-sm"
            >
              <option value="ALL">Todas las asignaciones</option>
              <option value="ASSIGNED">Con empleado asignado</option>
              <option value="UNASSIGNED">Sin empleado asignado</option>
            </select>
            
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setAssignmentFilter('ALL');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Incidencias */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No se encontraron incidencias</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || assignmentFilter !== 'ALL'
                          ? 'Intenta con otros términos de búsqueda'
                          : 'No hay incidencias registradas'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.incidentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-ucv-blue">
                          #{incident.incidentId}
                        </span>
                        <div className="mt-1">
                          {getAreaBadge(incident.area)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2">
                          {incident.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reportado por: {getUserName(incident.userId)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(incident.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(incident.priorityLevel)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEmployeeBadge(incident.assignedEmployee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getReportBadge(incident.hasReport)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          <CalendarDaysIcon className="w-3 h-3 mr-1" />
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(incident.incidentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleAssignClick(incident)}
                          className={`${incident.employeeId 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-ucv-blue hover:text-blue-800'}`}
                          title={incident.employeeId ? "Ya asignada" : "Asignar empleado"}
                          disabled={incident.employeeId}
                        >
                          <UserGroupIcon className="w-5 h-5" />
                        </button>
                        {incident.report && (
                          <a
                            href={`/admin/reports/view/${incident.report.reportId}`}
                            className="text-purple-600 hover:text-purple-800"
                            title="Ver reporte"
                          >
                            <DocumentTextIcon className="w-5 h-5" />
                          </a>
                        )}
                        <a
                          href={`/admin/incidents/edit/${incident.incidentId}`}
                          className="text-yellow-600 hover:text-yellow-800"
                          title="Editar incidencia"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </a>
                        <a
                          href={`/admin/incidents/${incident.incidentId}`}
                          className="text-green-600 hover:text-green-800"
                          title="Ver detalles"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación y Resumen */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-xl shadow-sm p-6">
        <div className="text-sm text-gray-600 mb-4 md:mb-0">
          Mostrando <span className="font-semibold">{filteredIncidents.length}</span> de{' '}
          <span className="font-semibold">{incidents.length}</span> incidencias
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-ucv-blue text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center text-sm"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <Link
            to="/admin/incidents/create"
            className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Nueva Incidencia
          </Link>
        </div>
      </div>

      {/* Modal de Asignación */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              Asignar Incidencia #{selectedIncident?.incidentId}
            </h3>
            <p className="text-gray-600 mb-4">
              <strong>Área:</strong> {selectedIncident?.area}
            </p>
            <p className="text-gray-600 mb-6">
              <strong>Descripción:</strong> {selectedIncident?.description}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Empleado *
                </label>
                <select
                  value={assignForm.employeeId}
                  onChange={(e) => setAssignForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="">Seleccionar empleado</option>
                  {employees
                    .filter(emp => emp.role === 'SUPPORT' || emp.role === 'ADMIN')
                    .map(emp => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} - {emp.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Prioridad *
                </label>
                <select
                  value={assignForm.priorityLevel}
                  onChange={(e) => setAssignForm(prev => ({ ...prev, priorityLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={!assignForm.employeeId}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                Asignar Incidencia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de ícono alternativo si no usas Heroicons
const CalendarDaysIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default AdminIncidentManagement;