import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService, userService, reportService } from '../../services/api';

// Iconos SVG profesionales para AdminDashboard
const Icons = {
  Document: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Wrench: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Folder: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-11.75A8.25 8.25 0 0012 2.25a8.25 8.25 0 000 16.5 8.25 8.25 0 000-16.5z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  ChartBar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  UserGroup: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Crown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Exclamation: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  BuildingOffice: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  ComputerDesktop: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Beaker: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    unassignedIncidents: 0,
    totalEmployees: 0,
    totalUsers: 0,
    availableEmployees: 0,
    busyEmployees: 0,
    totalReports: 0,
    resolvedReports: 0,
    pendingReports: 0,
    incidentsWithReports: 0,
    incidentsWithoutReports: 0,
    incidentsResolved: 0,
    incidentsInProgress: 0,
    incidentsUnresolved: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [AdminDashboard] Iniciando carga de datos...');
      
      // 🔥 ESTRATEGIA MEJORADA: Cargar y combinar datos
      const [incidentsResponse, employeesResponse, usersResponse, reportsResponse] = await Promise.allSettled([
        incidentService.getAll(),
        employeeService.getAll(),
        userService.getAll(),
        reportService.getAll()
      ]);

      // Procesar respuestas
      const incidentsData = incidentsResponse.status === 'fulfilled' ? 
        (incidentsResponse.value?.data || []) : [];
      const employeesData = employeesResponse.status === 'fulfilled' ? 
        (employeesResponse.value?.data || []) : [];
      const usersData = usersResponse.status === 'fulfilled' ? 
        (usersResponse.value?.data || []) : [];
      const reportsData = reportsResponse.status === 'fulfilled' ? 
        (reportsResponse.value?.data || []) : [];

      console.log('📊 Datos cargados:', {
        incidencias: incidentsData.length,
        empleados: employeesData.length,
        usuarios: usersData.length,
        reportes: reportsData.length
      });

      // 🔥 COMBINAR INCIDENCIAS CON REPORTES
      let incidentsWithReportsData = [];
      if (incidentsData.length > 0 && reportsData.length > 0) {
        // Crear mapa de reportes por incidentId
        const reportsMap = {};
        reportsData.forEach(report => {
          if (report.incidentId) {
            reportsMap[report.incidentId] = report;
          }
        });

        // Combinar incidencias con sus reportes
        incidentsWithReportsData = incidentsData.map(incident => {
          const report = reportsMap[incident.incidentId];
          let status = 'PENDING';
          
          if (report) {
            // Usar estado del reporte
            status = report.incidentStatus || report.estadoIncidencia || 'IN_PROGRESS';
          } else if (incident.employeeId) {
            // Si tiene empleado asignado pero no reporte
            status = 'IN_PROGRESS';
          } else {
            // Sin empleado asignado
            status = 'PENDING';
          }

          return {
            ...incident,
            report: report || null,
            status: status,
            hasReport: !!report
          };
        });
      } else {
        incidentsWithReportsData = incidentsData.map(incident => ({
          ...incident,
          report: null,
          status: incident.employeeId ? 'IN_PROGRESS' : 'PENDING',
          hasReport: false
        }));
      }

      // Limitar a 5 para mostrar
      const validatedIncidents = Array.isArray(incidentsWithReportsData) ? 
        incidentsWithReportsData.slice(0, 5) : [];
      const validatedEmployees = Array.isArray(employeesData) ? 
        employeesData.slice(0, 5) : [];
      const validatedUsers = Array.isArray(usersData) ? 
        usersData.slice(0, 5) : [];
      const validatedReports = Array.isArray(reportsData) ? 
        reportsData.slice(0, 5) : [];

      setIncidents(validatedIncidents);
      setEmployees(validatedEmployees);
      setUsers(validatedUsers);
      setReports(validatedReports);

      // 🔥 CÁLCULO MEJORADO DE ESTADÍSTICAS
      const statusCounts = {
        RESOLVED: incidentsWithReportsData.filter(inc => inc.status === 'RESOLVED' || inc.status === 'resuelto').length,
        UNRESOLVED: incidentsWithReportsData.filter(inc => inc.status === 'UNRESOLVED' || inc.status === 'no_resuelto').length,
        IN_PROGRESS: incidentsWithReportsData.filter(inc => inc.status === 'IN_PROGRESS' || inc.status === 'en_progreso').length,
        PENDING: incidentsWithReportsData.filter(inc => inc.status === 'PENDING' || inc.status === 'pendiente').length
      };

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
        ).length,
        totalReports: reportsData.length,
        resolvedReports: reportsData.filter(report => 
          report.incidentStatus === 'RESOLVED' || report.estadoIncidencia === 'resuelto'
        ).length,
        pendingReports: reportsData.filter(report => 
          report.incidentStatus === 'PENDING' || report.estadoIncidencia === 'pendiente'
        ).length,
        incidentsWithReports: incidentsWithReportsData.filter(inc => inc.hasReport).length,
        incidentsWithoutReports: incidentsWithReportsData.filter(inc => !inc.hasReport).length,
        incidentsResolved: statusCounts.RESOLVED,
        incidentsInProgress: statusCounts.IN_PROGRESS,
        incidentsUnresolved: statusCounts.UNRESOLVED,
        incidentsPending: statusCounts.PENDING
      };

      console.log('📊 Estadísticas actualizadas:', newStats);
      setStats(newStats);

    } catch (globalError) {
      console.error('❌ [AdminDashboard] Error global:', globalError);
      setError(`Error al cargar datos: ${globalError.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNCIÓN MEJORADA PARA ESTADO DE INCIDENCIAS
  const getStatusBadge = (incident) => {
    const status = incident.status || 
                  (incident.report ? incident.report.incidentStatus || incident.report.estadoIncidencia : null);
    
    const statusMap = {
      'PENDING': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'pendiente': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'IN_PROGRESS': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'en_progreso': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'RESOLVED': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelta',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'resuelto': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelta',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'UNRESOLVED': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelta',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      },
      'no_resuelto': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelta',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      },
      'CLOSED': { 
        color: 'bg-gray-50 text-gray-800 border border-gray-200', 
        text: 'Cerrada',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      }
    };

    // Si no hay estado definido, usar lógica basada en asignación
    if (!status) {
      if (!incident.employeeId) {
        return (
          <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium border border-yellow-200 flex items-center">
            <Icons.Clock className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        );
      }
      if (incident.employeeId && !incident.report) {
        return (
          <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 flex items-center">
            <Icons.Wrench className="w-3 h-3 mr-1" />
            En Progreso
          </span>
        );
      }
      return (
        <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200 flex items-center">
          <Icons.CheckCircle className="w-3 h-3 mr-1" />
          Resuelta
        </span>
      );
    }

    const statusInfo = statusMap[status] || statusMap.PENDING;
    return (
      <span className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {statusInfo.icon}
        {statusInfo.text}
      </span>
    );
  };

  // 🔥 FUNCIÓN PARA ESTADO DE EMPLEADOS
  const getEmployeeStatusBadge = (employee) => {
    const isAvailable = employee.availabilityStatus === 'AVAILABLE' || 
                       employee.estadoDisponibilidad === 'disponible';
    
    return isAvailable 
      ? (
        <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-200 flex items-center">
          <Icons.CheckCircle className="w-3 h-3 mr-1" />
          Disponible
        </span>
      )
      : (
        <span className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-xs font-medium border border-red-200 flex items-center">
          <Icons.Exclamation className="w-3 h-3 mr-1" />
          Ocupado
        </span>
      );
  };

  // 🔥 FUNCIÓN PARA BADGE DE ROL DE USUARIO
  const getUserRoleBadge = (user) => {
    const roles = {
      'STUDENT': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'Estudiante',
        icon: <Icons.User className="w-3 h-3 mr-1" />
      },
      'TEACHER': { 
        color: 'bg-purple-50 text-purple-800 border border-purple-200', 
        text: 'Docente',
        icon: <Icons.User className="w-3 h-3 mr-1" />
      },
      'SUPPORT': { 
        color: 'bg-orange-50 text-orange-800 border border-orange-200', 
        text: 'Soporte',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'ADMIN': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'Admin',
        icon: <Icons.Crown className="w-3 h-3 mr-1" />
      }
    };
    const roleInfo = roles[user.role] || roles.STUDENT;
    return (
      <span className={`${roleInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {roleInfo.icon}
        {roleInfo.text}
      </span>
    );
  };

  // 🔥 FUNCIÓN FALTANTE: PARA BADGE DE ESTADO DE REPORTE
  const getReportStatusBadge = (report) => {
    const status = report.incidentStatus || report.estadoIncidencia;
    const statusMap = {
      'PENDING': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'IN_PROGRESS': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'RESOLVED': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelto',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'UNRESOLVED': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelto',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      },
      'pendiente': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'en_progreso': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'resuelto': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelto',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'no_resuelto': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelto',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      }
    };
    
    const statusInfo = statusMap[status] || { 
      color: 'bg-gray-50 text-gray-800 border border-gray-200', 
      text: 'Desconocido',
      icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
    };
    return (
      <span className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {statusInfo.icon}
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue"></div>
        <div className="text-ucv-blue text-lg">Cargando dashboard admin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="text-red-600 text-lg">Error al cargar los datos</div>
        <div className="text-gray-600 text-sm max-w-md text-center">{error}</div>
        <button
          onClick={fetchDashboardData}
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
        <div className="flex items-center">
          <div className="w-12 h-12 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center mr-4">
            <Icons.Crown className="w-6 h-6 text-ucv-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ucv-blue">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-1">
              Sistema de Gestión de Incidencias - Universidad César Vallejo
            </p>
            <p className="text-sm text-ucv-red mt-2 font-medium">
              Administrador: {user.firstName} {user.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards - AÑADIDAS ESTADÍSTICAS DE REPORTES */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-ucv-blue bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <Icons.Document className="w-5 h-5 text-ucv-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidencias</p>
              <p className="text-xl font-bold text-ucv-blue mt-1">{stats.totalIncidents}</p>
              <p className="text-xs text-gray-500">
                {stats.incidentsWithReports} con reporte
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Asignar</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{stats.unassignedIncidents}</p>
              <p className="text-xs text-gray-500">
                {stats.incidentsWithoutReports} sin reporte
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.Folder className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Reportes</p>
              <p className="text-xl font-bold text-purple-600 mt-1">{stats.totalReports}</p>
              <p className="text-xs text-gray-500">
                {stats.resolvedReports} resueltos
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Empleados</p>
              <p className="text-xl font-bold text-green-600 mt-1">{stats.totalEmployees}</p>
              <p className="text-xs text-gray-500">
                {stats.availableEmployees} disp. / {stats.busyEmployees} ocup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - AÑADIDO BOTÓN DE REPORTES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link 
          to="/admin/incidents"
          className="bg-ucv-red hover:bg-red-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icons.Document className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm">Incidencias</h3>
            <p className="text-white text-opacity-90 mt-1 text-xs">
              Gestión completa
            </p>
          </div>
        </Link>

        <Link 
          to="/admin/reports"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icons.ChartBar className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm">Reportes</h3>
            <p className="text-white text-opacity-90 mt-1 text-xs">
              Ver todos los reportes
            </p>
          </div>
        </Link>

        <Link 
          to="/admin/employees"
          className="bg-ucv-blue hover:bg-blue-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icons.UserGroup className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm">Empleados</h3>
            <p className="text-white text-opacity-90 mt-1 text-xs">
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
              <Icons.Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-sm">Usuarios</h3>
            <p className="text-white text-opacity-90 mt-1 text-xs">
              Gestión de usuarios
            </p>
          </div>
        </Link>
      </div>

      {/* Sección de Reportes Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reportes Recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Reportes Recientes</h2>
            <Link 
              to="/admin/reports"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todos
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.Folder className="w-12 h-12 inline-block text-gray-400 mb-2" />
              <p>No hay reportes generados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.reportId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-ucv-blue">Reporte #{report.reportId}</span>
                        {getReportStatusBadge(report)}
                      </div>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {report.description || report.descripcion || 'Sin descripción'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(report.registrationDate || report.fechaRegistro).toLocaleDateString()}
                        </span>
                        <span>Incidencia: #{report.incidentId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incidencias Recientes con Reporte */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Incidencias con Reporte</h2>
            <Link 
              to="/admin/incidents"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todas
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {incidents.filter(inc => inc.reporte || inc.report).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.Document className="w-12 h-12 inline-block text-gray-400 mb-2" />
              <p>No hay incidencias con reporte</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents
                .filter(inc => inc.reporte || inc.report)
                .slice(0, 5)
                .map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ucv-blue text-sm">{incident.area}</h3>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{incident.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        <span>ID: #{incident.incidentId}</span>
                      </div>
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
      </div>

      {/* Sección inferior con Empleados y Usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empleados */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Empleados</h2>
            <Link 
              to="/admin/employees"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todos
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.UserGroup className="w-12 h-12 inline-block text-gray-400 mb-2" />
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

        {/* Usuarios */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Usuarios</h2>
            <Link 
              to="/admin/users"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todos
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.Users className="w-12 h-12 inline-block text-gray-400 mb-2" />
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