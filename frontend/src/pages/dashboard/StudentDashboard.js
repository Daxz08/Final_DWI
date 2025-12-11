import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, reportService } from '../../services/api';

// Iconos SVG profesionales
const Icons = {
  Document: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Wrench: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  CheckCircle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  List: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  User: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Exclamation: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  BuildingOffice: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  ComputerDesktop: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  BookOpen: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Beaker: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  Wifi: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  )
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    unresolved: 0
  });

  useEffect(() => {
    fetchIncidents();
  }, [user]);

  const fetchIncidents = async () => {
    try {
      const response = await incidentService.getByUser(user.userId);
      let userIncidents = response.data || [];

      // Obtener reportes para estas incidencias
      try {
        const reportsResponse = await reportService.getAll();
        if (reportsResponse.success) {
          const allReports = reportsResponse.data || [];
          const reportsMap = {};
          allReports.forEach(report => {
            reportsMap[report.incidentId] = report;
          });

          // Combinar con estado actualizado
          userIncidents = userIncidents.map(incident => ({
            ...incident,
            report: reportsMap[incident.incidentId] || null,
            status: reportsMap[incident.incidentId] 
              ? reportsMap[incident.incidentId].incidentStatus 
              : (incident.employeeId ? 'IN_PROGRESS' : 'PENDING')
          }));
        }
      } catch (reportError) {
        console.error('Error obteniendo reportes:', reportError);
      }

      // Actualizar stats usando el estado real
      const stats = {
        total: userIncidents.length,
        pending: userIncidents.filter(inc => 
          inc.status === 'PENDING' || (!inc.employeeId && !inc.status)
        ).length,
        inProgress: userIncidents.filter(inc => 
          inc.status === 'IN_PROGRESS' || (inc.employeeId && !inc.report && !inc.status)
        ).length,
        resolved: userIncidents.filter(inc => 
          inc.status === 'RESOLVED' || inc.status === 'CLOSED'
        ).length,
        unresolved: userIncidents.filter(inc => inc.status === 'UNRESOLVED').length
      };

      setStats(stats);
      setIncidents(userIncidents.slice(0, 5));
    } catch (error) {
      console.error("❌ Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (incident) => {
    const status = incident.status || 
                  (incident.report ? incident.report.incidentStatus : null);
    
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
        text: 'Resuelta',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'UNRESOLVED': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelta',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
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
    const priorities = {
      'LOW': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Baja',
        icon: <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
      },
      'MEDIUM': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Media',
        icon: <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
      },
      'HIGH': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'Alta',
        icon: <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
      }
    };
    
    const priorityInfo = priorities[priority] || priorities.MEDIUM;
    return (
      <span className={`${priorityInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {priorityInfo.icon}
        {priorityInfo.text}
      </span>
    );
  };

  const getAreaIcon = (area) => {
    const areaMap = {
      'LABORATORIO': Icons.Beaker,
      'AULA': Icons.BookOpen,
      'OFICINA': Icons.BuildingOffice,
      'BIBLIOTECA': Icons.BookOpen,
      'SISTEMAS': Icons.ComputerDesktop,
      'REDES': Icons.Wifi,
      'SOFTWARE': Icons.ComputerDesktop,
      'HARDWARE': Icons.Wrench
    };
    
    const IconComponent = areaMap[area] || Icons.BuildingOffice;
    return <IconComponent className="w-5 h-5 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue"></div>
        <div className="text-ucv-blue text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del usuario */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ucv-blue">
              Bienvenido, <span className="text-ucv-red">{user.firstName}</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Sistema de Gestión de Incidencias - Universidad César Vallejo
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <div className="w-12 h-12 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center mr-3">
              <Icons.User className="w-6 h-6 text-ucv-blue" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">Estudiante</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards con diseño mejorado */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-ucv-blue bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <Icons.Document className="w-5 h-5 text-ucv-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Resueltas</p>
              <p className="text-xl font-bold text-green-600 mt-1">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <Icons.Exclamation className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">No Resueltas</p>
              <p className="text-xl font-bold text-red-600 mt-1">{stats.unresolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/student/report"
          className="bg-gradient-to-r from-ucv-red to-red-600 hover:from-red-700 hover:to-red-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Icons.Plus className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Reportar Nueva Incidencia</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Reporta un problema técnico para que el equipo de soporte lo resuelva
              </p>
            </div>
            <Icons.ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <Link 
          to="/student/incidents"
          className="bg-gradient-to-r from-ucv-blue to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Icons.List className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Ver Mis Incidencias</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Revisa el estado y detalles de todas tus incidencias reportadas
              </p>
            </div>
            <Icons.ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>
      </div>

      {/* Recent Incidences con diseño mejorado */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-ucv-blue">Incidencias Recientes</h2>
            <Link 
              to="/student/incidents"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todas
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Icons.Document className="w-16 h-16 inline-block" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay incidencias reportadas</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Comienza reportando tu primera incidencia para que nuestro equipo de soporte te ayude
            </p>
            <Link 
              to="/student/report"
              className="inline-flex items-center px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <Icons.Plus className="w-4 h-4 mr-2" />
              Reportar primera incidencia
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {incidents.map((incident) => (
              <div key={incident.incidentId} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getAreaIcon(incident.area)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{incident.area}</h3>
                        {getPriorityBadge(incident.priorityLevel)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {incident.description || 'Sin descripción'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        <span>ID: #{incident.incidentId}</span>
                        {incident.report && (
                          <span className="text-green-600 font-medium flex items-center">
                            <Icons.CheckCircle className="w-3 h-3 mr-1" />
                            Con reporte
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(incident)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-gradient-to-r from-ucv-blue to-blue-600 rounded-xl shadow-sm p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold mb-2">¿Necesitas ayuda?</h3>
            <p className="text-blue-100">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier problema técnico.
              Reporta tus incidencias y seguiremos el proceso hasta su resolución.
            </p>
          </div>
          <Link 
            to="/student/report"
            className="bg-white text-ucv-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <Icons.Plus className="w-4 h-4 inline-block mr-2" />
            Reportar incidencia
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;