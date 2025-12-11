import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, reportService } from '../../services/api';

// Iconos SVG para SupportDashboard
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
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Folder: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

const SupportDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const generateReportFor = searchParams.get('generateReport');
  
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    withReport: 0,
    withoutReport: 0,
    resolved: 0,
    inProgress: 0,
    unresolved: 0
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [reportForm, setReportForm] = useState({
    description: '',
    actions: '',
    incidentStatus: 'RESOLVED'
  });

  // 🔥 FUNCIÓN MEJORADA PARA OBTENER EL ID DEL EMPLEADO
  const getEmployeeId = () => {
    // Prioridad de campos para obtener el ID del empleado
    if (user?.employeeId) return user.employeeId;
    if (user?.id) return user.id;
    if (user?.userId) return user.userId;
    
    console.warn('⚠️ No se pudo obtener employeeId del usuario:', user);
    return null;
  };

  // 🔥 FUNCIÓN PRINCIPAL PARA CARGAR DATOS
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const employeeId = getEmployeeId();
      
      if (!employeeId) {
        const errorMsg = 'No se pudo identificar el ID del empleado. Verifica tu sesión.';
        setError(errorMsg);
        setLoading(false);
        return;
      }

      console.log('🔍 Obteniendo datos para employeeId:', employeeId);

      // 🔥 OBTENER INCIDENCIAS ASIGNADAS (CON FALLBACKS)
      let incidentsData = [];
      try {
        // Intenta con el endpoint principal
        const response = await incidentService.getByEmployee(employeeId);
        incidentsData = response.success ? response.data || [] : [];
        
        // Si no hay datos, prueba con endpoint alternativo
        if (incidentsData.length === 0) {
          console.log('🔄 Intentando endpoint alternativo...');
          const altResponse = await incidentService.getAssignedToEmployee(employeeId);
          if (altResponse.success) {
            incidentsData = altResponse.data || [];
          }
        }
        
        // Fallback final: obtener todas y filtrar
        if (incidentsData.length === 0) {
          console.log('🔄 Usando fallback de filtrado...');
          const allResponse = await incidentService.getAll();
          if (allResponse.success) {
            incidentsData = (allResponse.data || []).filter(incident => 
              incident.employeeId == employeeId || 
              incident.assignedTo == employeeId
            );
          }
        }
      } catch (incidentError) {
        console.error('❌ Error obteniendo incidencias:', incidentError);
        setError(`Error al cargar incidencias: ${incidentError.message}`);
        setLoading(false);
        return;
      }

      // 🔥 OBTENER REPORTES DEL EMPLEADO
      let reportsData = [];
      try {
        const reportsResponse = await reportService.getByEmployee(employeeId);
        reportsData = reportsResponse.success ? reportsResponse.data || [] : [];
      } catch (reportError) {
        console.error('⚠️ Error obteniendo reportes:', reportError);
        // Continuamos sin reportes si hay error
      }

      // 🔥 COMBINAR Y ENRIQUECER DATOS
      if (incidentsData.length > 0) {
        // Crear mapa de reportes por incidentId
        const reportsMap = {};
        reportsData.forEach(report => {
          if (report.incidentId) {
            reportsMap[report.incidentId] = report;
          }
        });

        // Enriquecer incidencias con reportes y estados
        incidentsData = incidentsData.map(incident => {
          const report = reportsMap[incident.incidentId];
          let status = 'PENDING';
          
          if (report) {
            status = report.incidentStatus || report.estadoIncidencia || 'IN_PROGRESS';
          } else if (incident.employeeId || incident.assignedTo) {
            status = 'IN_PROGRESS';
          }
          
          return {
            ...incident,
            report: report || null,
            status: status.toUpperCase(),
            employeeId: incident.employeeId || incident.assignedTo || employeeId
          };
        });
      }

      // 🔥 CALCULAR ESTADÍSTICAS
      const total = incidentsData.length;
      const withReport = incidentsData.filter(inc => inc.report).length;
      const withoutReport = total - withReport;
      const resolved = incidentsData.filter(inc => 
        ['RESOLVED', 'RESUELTO'].includes(inc.status)
      ).length;
      const inProgress = incidentsData.filter(inc => 
        ['IN_PROGRESS', 'EN_PROGRESO', 'EN_CURSO'].includes(inc.status)
      ).length;
      const unresolved = incidentsData.filter(inc => 
        ['UNRESOLVED', 'NO_RESUELTO'].includes(inc.status)
      ).length;

      console.log(`✅ Datos cargados: ${incidentsData.length} incidencias, ${reportsData.length} reportes`);

      // Mostrar solo las primeras 5 incidencias y reportes
      setIncidents(incidentsData.slice(0, 5));
      setReports(reportsData.slice(0, 5));
      setStats({
        total,
        withReport,
        withoutReport,
        resolved,
        inProgress,
        unresolved
      });

    } catch (error) {
      console.error('❌ Error general al cargar datos:', error);
      setError(`Error al cargar el dashboard: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 🔥 EFFECTS
  useEffect(() => {
    if (user) {
      console.log('👤 Usuario autenticado:', user);
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  useEffect(() => {
    if (generateReportFor && incidents.length > 0) {
      const incident = incidents.find(inc => inc.incidentId == generateReportFor);
      if (incident) {
        handleCreateReport(incident);
      }
    }
  }, [generateReportFor, incidents]);

  // 🔥 FUNCIONES AUXILIARES
  const getStatusBadge = (incident) => {
    const status = incident.status;
    
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
          Resuelto
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
      'EN_PROGRESO': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'EN_CURSO': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Wrench className="w-3 h-3 mr-1" />
      },
      'RESOLVED': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelto',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'RESUELTO': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelto',
        icon: <Icons.CheckCircle className="w-3 h-3 mr-1" />
      },
      'UNRESOLVED': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelto',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      },
      'NO_RESUELTO': { 
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

  const getPriorityBadge = (priority) => {
    if (!priority || priority === 'null') {
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Sin asignar</span>;
    }
    
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
    
    const priorityInfo = priorities[priority] || { 
      color: 'bg-gray-100 text-gray-800 border border-gray-200', 
      text: 'Sin asignar',
      icon: <span className="w-2 h-2 rounded-full bg-gray-500 mr-1"></span>
    };
    return (
      <span className={`${priorityInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {priorityInfo.icon}
        {priorityInfo.text}
      </span>
    );
  };

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

  const getAreaIcon = (area) => {
    const areaMap = {
      'LABORATORIO': Icons.Beaker,
      'AULA': Icons.BookOpen,
      'OFICINA': Icons.BuildingOffice,
      'BIBLIOTECA': Icons.BookOpen,
      'SISTEMAS': Icons.ComputerDesktop,
      'REDES': Icons.Wrench,
      'SOFTWARE': Icons.ComputerDesktop,
      'HARDWARE': Icons.Wrench
    };
    
    const IconComponent = areaMap[area] || Icons.BuildingOffice;
    return <IconComponent className="w-4 h-4 text-gray-500" />;
  };

  const handleCreateReport = (incident) => {
    if (incident.report) {
      const reportStatus = incident.report.incidentStatus?.toUpperCase();
      
      if (reportStatus === 'RESOLVED' || reportStatus === 'RESUELTO') {
        alert('⚠️ Esta incidencia ya fue marcada como RESUELTA. No puedes generar otro reporte.');
        return;
      }
      
      if (reportStatus === 'UNRESOLVED' || reportStatus === 'NO_RESUELTO') {
        alert('⚠️ Esta incidencia ya fue marcada como NO RESUELTA. No puedes generar otro reporte.');
        return;
      }
      
      if (window.confirm('Esta incidencia ya tiene un reporte. ¿Deseas reemplazarlo?')) {
        setSelectedIncident(incident);
        setReportForm({
          description: '',
          actions: '',
          incidentStatus: 'RESOLVED'
        });
        setShowReportModal(true);
      }
    } else {
      setSelectedIncident(incident);
      setReportForm({
        description: '',
        actions: '',
        incidentStatus: 'RESOLVED'
      });
      setShowReportModal(true);
    }
  };

  const handleReportSubmit = async () => {
    try {
      if (!reportForm.description.trim() || !reportForm.actions.trim()) {
        alert('Por favor completa la descripción y las acciones tomadas');
        return;
      }

      const employeeId = getEmployeeId();
      
      if (!employeeId) {
        alert('Error: No se pudo identificar tu ID de empleado');
        return;
      }

      const reportData = {
        description: reportForm.description,
        actions: reportForm.actions,
        incidentStatus: reportForm.incidentStatus,
        employeeId: employeeId,
        incidentId: selectedIncident.incidentId
      };

      console.log('📤 Enviando reporte:', reportData);
      const response = await reportService.create(reportData);
      
      if (response.success) {
        setShowReportModal(false);
        setSelectedIncident(null);
        fetchDashboardData();
        alert('✅ Reporte creado exitosamente');
      } else {
        alert('❌ Error al crear reporte: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating report:', error);
      const errorMsg = error.response?.data?.message || error.message;
      alert(`❌ Error al crear reporte: ${errorMsg}`);
    }
  };

  // 🔥 RENDERIZADO
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue mb-4"></div>
          <div className="text-ucv-blue">Cargando dashboard de soporte...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="text-red-600 text-lg font-semibold">⚠️ Error al cargar el dashboard</div>
        <div className="text-gray-600 text-sm max-w-md text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          ID de empleado detectado: {getEmployeeId() || 'No disponible'}
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
        <Link 
          to="/support/assigned"
          className="text-ucv-blue hover:underline text-sm"
        >
          Ver incidencias asignadas directamente →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center mr-4">
            <Icons.Wrench className="w-6 h-6 text-ucv-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ucv-blue">
              Bienvenido, {user?.fullName || user?.firstName || 'Soporte'}
            </h1>
            <p className="text-gray-600 mt-1">
              Panel de Soporte Técnico - Universidad César Vallejo
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <p className="text-sm text-ucv-red font-medium flex items-center">
                <Icons.User className="w-4 h-4 mr-1" />
                Rol: {user?.role}
              </p>
              {user?.employeeId && (
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-1">ID:</span> {user.employeeId}
                </p>
              )}
              {user?.specialty && (
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="mr-1">Especialidad:</span> {user.specialty}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-ucv-blue bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
              <Icons.Document className="w-5 h-5 text-ucv-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Asignadas</p>
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
              <p className="text-sm font-medium text-gray-600">Sin Reporte</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{stats.withoutReport}</p>
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/support/assigned"
          className="bg-ucv-red hover:bg-red-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Icons.Document className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Incidencias Asignadas</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Ver todas mis incidencias asignadas
              </p>
            </div>
          </div>
        </Link>

        <Link 
          to="/support/generate-reports"
          className="bg-ucv-blue hover:bg-blue-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Icons.Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Generar Reportes</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Incidencias pendientes de reporte
              </p>
            </div>
          </div>
        </Link>

        <Link 
          to="/support/my-reports"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Icons.Folder className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mis Reportes</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Ver todos mis reportes generados
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Dos columnas: Incidencias y Reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Incidencias Recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Incidencias Recientes</h2>
            <Link 
              to="/support/assigned"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todas
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.Document className="w-12 h-12 inline-block text-gray-400 mb-2" />
              <p>No tienes incidencias asignadas</p>
              <p className="text-sm mt-2">Las incidencias que te asignen aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-ucv-blue text-sm">{incident.area}</span>
                        {getPriorityBadge(incident.priorityLevel)}
                      </div>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{incident.description}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        <span>ID: #{incident.incidentId}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(incident)}
                      {!incident.report && (
                        <button
                          onClick={() => handleCreateReport(incident)}
                          className="bg-ucv-red text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                        >
                          Generar Reporte
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mis Reportes Recientes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Reportes Recientes</h2>
            <Link 
              to="/support/my-reports"
              className="text-ucv-red hover:text-red-700 font-medium flex items-center text-sm"
            >
              Ver todos
              <Icons.ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Icons.Folder className="w-12 h-12 inline-block text-gray-400 mb-2" />
              <p>No has generado reportes aún</p>
              <p className="text-sm mt-2">Los reportes que generes aparecerán aquí</p>
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
                        <span>Incidencia: #{report.incidentId}</span>
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(report.registrationDate || report.fechaRegistro).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para Reportes */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              Generar Reporte - {selectedIncident?.area}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Incidencia ID: {selectedIncident?.incidentId}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Descripción del Trabajo *
                </label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  rows={3}
                  placeholder="Describe el trabajo realizado..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Acciones Tomadas *
                </label>
                <textarea
                  value={reportForm.actions}
                  onChange={(e) => setReportForm(prev => ({ ...prev, actions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  rows={3}
                  placeholder="Describe las acciones específicas realizadas..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Estado Final *
                </label>
                <select
                  value={reportForm.incidentStatus}
                  onChange={(e) => setReportForm(prev => ({ ...prev, incidentStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="RESOLVED">Resuelto</option>
                  <option value="UNRESOLVED">No Resuelto</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ⚠️ Al marcar como "Resuelto" o "No Resuelto", la incidencia ya no permitirá más reportes
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700"
              >
                Generar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboard;