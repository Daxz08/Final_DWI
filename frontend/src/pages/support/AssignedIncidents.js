import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, reportService } from '../../services/api';
import { Link } from 'react-router-dom';

// Iconos SVG profesionales (reemplazar emojis)
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  DocumentText: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Pencil: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
};

const AssignedIncidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [reportForm, setReportForm] = useState({
    description: '',
    actions: '',
    incidentStatus: 'RESOLVED'
  });

  // Nuevo estado para filtro de reportes
  const [filters, setFilters] = useState({
    reportFilter: 'all' // 'all', 'withReport', 'withoutReport'
  });

  // Función para obtener el ID del empleado
  const getEmployeeId = () => {
    if (user?.employeeId) return user.employeeId;
    if (user?.id) return user.id;
    if (user?.userId) return user.userId;
    console.warn('⚠️ No se pudo obtener employeeId del usuario:', user);
    return null;
  };

  useEffect(() => {
    fetchAssignedIncidents();
  }, [user]);

  useEffect(() => {
    filterIncidents();
  }, [incidents, filters]);

  const fetchAssignedIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 [AssignedIncidents] Iniciando carga...');
      console.log('👤 Rol del usuario:', user?.role);
      console.log('🆔 ID del empleado:', getEmployeeId());
      
      const employeeId = getEmployeeId();
      
      if (!employeeId) {
        setError('No se pudo identificar tu ID de empleado. Por favor, contacta al administrador.');
        setLoading(false);
        return;
      }

      let incidentsData = [];

      // 🔥 LÓGICA PARA OBTENER INCIDENCIAS ASIGNADAS
      console.log(`👷 Cargando incidencias del empleado ${employeeId}...`);
      try {
        const response = await incidentService.getByEmployee(employeeId);
        incidentsData = response.data || [];
      } catch (employeeError) {
        console.error('❌ Error obteniendo incidencias por empleado:', employeeError);
        
        // Fallback: obtener todas y filtrar
        try {
          const allResponse = await incidentService.getAll();
          if (allResponse.success) {
            incidentsData = (allResponse.data || []).filter(incident => 
              incident.employeeId === employeeId || 
              incident.assignedTo === employeeId
            );
          }
        } catch (fallbackError) {
          console.error('❌ Fallback también falló:', fallbackError);
          throw fallbackError;
        }
      }

      // 🔥 PASO CRÍTICO: Obtener reportes para cada incidencia
      if (incidentsData.length > 0) {
        console.log('📊 Obteniendo reportes para las incidencias...');
        
        try {
          const reportsResponse = await reportService.getAll();
          if (reportsResponse.success) {
            const allReports = reportsResponse.data || [];
            
            // Crear mapa de reportes por incidentId
            const reportsMap = {};
            allReports.forEach(report => {
              if (report.incidentId) {
                reportsMap[report.incidentId] = report;
              }
            });
            
            // Combinar incidencias con sus reportes
            incidentsData = incidentsData.map(incident => ({
              ...incident,
              report: reportsMap[incident.incidentId] || null,
              // Si hay reporte, usar el estado del reporte
              status: reportsMap[incident.incidentId] 
                ? reportsMap[incident.incidentId].incidentStatus 
                : (incident.employeeId ? 'IN_PROGRESS' : 'PENDING')
            }));
          }
        } catch (reportError) {
          console.error('❌ Error obteniendo reportes:', reportError);
          // Si falla, mantener la lógica original
          incidentsData = incidentsData.map(incident => ({
            ...incident,
            status: incident.employeeId 
              ? (incident.report ? 'RESOLVED' : 'IN_PROGRESS') 
              : 'PENDING'
          }));
        }
      }

      console.log(`✅ ${incidentsData.length} incidencias cargadas con estado actualizado`);
      console.log('📊 Muestra de incidencias:', incidentsData.slice(0, 3));
      
      setIncidents(incidentsData);

    } catch (error) {
      console.error('❌ [AssignedIncidents] Error general:', error);
      setError(`Error al cargar los datos: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = [...incidents];

    // Filtro por reporte
    if (filters.reportFilter === 'withReport') {
      filtered = filtered.filter(incident => incident.report);
    } else if (filters.reportFilter === 'withoutReport') {
      filtered = filtered.filter(incident => !incident.report);
    }

    setFilteredIncidents(filtered);
  };

  // 🔥 FUNCIONES PARA BADGES (iguales a IncidentList)
  const getStatusBadge = (incident) => {
    // LÓGICA ACTUALIZADA: Usar el estado del reporte si existe
    const status = incident.status || 
                  (incident.report ? incident.report.incidentStatus : null);
    
    // Si no hay estado definido, usar la lógica anterior
    if (!status) {
      if (!incident.employeeId) {
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendiente</span>;
      }
      if (incident.employeeId && !incident.report) {
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En Progreso</span>;
      }
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Resuelta</span>;
    }

    // USAR EL ESTADO DEL REPORTE
    const statusMap = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      'IN_PROGRESS': { color: 'bg-blue-100 text-blue-800', text: 'En Progreso' },
      'RESOLVED': { color: 'bg-green-100 text-green-800', text: 'Resuelta' },
      'UNRESOLVED': { color: 'bg-red-100 text-red-800', text: 'No Resuelta' },
      'CLOSED': { color: 'bg-gray-100 text-gray-800', text: 'Cerrada' }
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;
    return <span className={`${statusInfo.color} px-2 py-1 rounded-full text-xs`}>{statusInfo.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    if (priority === null || priority === undefined || priority === 'null' || priority === '') {
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Sin asignar</span>;
    }
    
    const priorities = {
      'LOW': { color: 'bg-green-100 text-green-800', text: 'Baja' },
      'MEDIUM': { color: 'bg-yellow-100 text-yellow-800', text: 'Media' },
      'HIGH': { color: 'bg-red-100 text-red-800', text: 'Alta' }
    };
    const priorityInfo = priorities[priority] || { color: 'bg-gray-100 text-gray-800', text: 'Sin asignar' };
    return <span className={`${priorityInfo.color} px-2 py-1 rounded-full text-xs`}>{priorityInfo.text}</span>;
  };

  // 🔥 MANEJO DE REPORTES
  const handleCreateReport = (incident) => {
    if (incident.report) {
      const reportStatus = incident.report.incidentStatus;
      
      if (reportStatus === 'RESOLVED' || reportStatus === 'resuelto') {
        alert('⚠️ Esta incidencia ya fue marcada como RESUELTA. No puedes generar otro reporte.');
        return;
      }
      
      if (reportStatus === 'UNRESOLVED' || reportStatus === 'no_resuelto') {
        alert('⚠️ Esta incidencia ya fue marcada como NO RESUELTA. No puedes generar otro reporte.');
        return;
      }
      
      if (window.confirm('Esta incidencia ya tiene un reporte. ¿Deseas reemplazarlo?')) {
        setSelectedIncident(incident);
        setReportForm({
          description: incident.report.description || '',
          actions: incident.report.actions || '',
          incidentStatus: incident.report.incidentStatus || 'RESOLVED'
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
        fetchAssignedIncidents(); // Refresh the list
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

  // Calcular estadísticas
  const stats = {
    total: incidents.length,
    withReport: incidents.filter(i => i.report).length,
    withoutReport: incidents.filter(i => !i.report).length,
    pending: incidents.filter(i => 
      i.status === 'PENDING' || 
      (i.report && i.report.incidentStatus === 'PENDING')
    ).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando incidencias asignadas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <span className="text-red-500 text-xl mr-2">⚠️</span>
            <h2 className="text-red-700 text-lg font-semibold">Error</h2>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex space-x-4">
            <Link 
              to="/support/dashboard"
              className="px-4 py-2 bg-ucv-blue text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              ← Volver al Dashboard
            </Link>
            <button
              onClick={fetchAssignedIncidents}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header con navegación */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to="/support/dashboard"
            className="flex items-center text-ucv-blue hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Volver al Dashboard
          </Link>
          <div className="text-sm text-gray-600">
          
            {user?.employeeId && (
              <span className="ml-4">
                ID Empleado: <span className="font-semibold">{user.employeeId}</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-ucv-blue">
                Mis Incidencias Asignadas
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona todas las incidencias que te han sido asignadas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">{incidents.length} incidencias</span>
              <button
                onClick={fetchAssignedIncidents}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
              >
                <Icons.Refresh className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue">
              <p className="text-sm font-medium text-gray-600">Total Asignadas</p>
              <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-600">Con Reporte</p>
              <p className="text-xl font-bold text-green-600 mt-1">{stats.withReport}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-600">Sin Reporte</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{stats.withoutReport}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  <Icons.Filter className="inline w-4 h-4 mr-1" />
                  Filtrar por reporte
                </label>
                <select
                  value={filters.reportFilter}
                  onChange={(e) => setFilters(prev => ({ ...prev, reportFilter: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
                >
                  <option value="all">Todas las incidencias</option>
                  <option value="withReport">Con reporte</option>
                  <option value="withoutReport">Sin reporte</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1 invisible">
                  &nbsp;
                </label>
                <div className="text-sm text-gray-600">
                  Mostrando {filteredIncidents.length} de {incidents.length} incidencias
                </div>
              </div>
            </div>
          </div>

          {/* Lista de incidencias */}
          <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-gray-400 text-6xl mb-4">
                  <Icons.DocumentText className="w-16 h-16 inline-block" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {filters.reportFilter === 'withoutReport' 
                    ? '¡No hay incidencias sin reporte!' 
                    : 'No tienes incidencias asignadas'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {filters.reportFilter === 'withoutReport'
                    ? 'Todas tus incidencias tienen reporte. ¡Excelente trabajo!'
                    : 'Las incidencias que te asignen aparecerán aquí.'}
                </p>
                {filters.reportFilter !== 'all' && (
                  <button
                    onClick={() => setFilters({ reportFilter: 'all' })}
                    className="inline-block mt-4 px-4 py-2 bg-ucv-blue text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    Ver todas las incidencias
                  </button>
                )}
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-ucv-blue">{incident.area || 'Sin área especificada'}</h3>
                        {getPriorityBadge(incident.priorityLevel)}
                        {getStatusBadge(incident)}
                        {incident.report && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center">
                            <Icons.DocumentText className="w-3 h-3 mr-1" />
                            Con Reporte
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {incident.description || 'Sin descripción'}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">#</span>{incident.incidentId}
                        </span>
                        {incident.userId && (
                          <span className="flex items-center">
                            <Icons.User className="w-3 h-3 mr-1" />
                            Reportado por: {incident.userId}
                          </span>
                        )}
                        {incident.report && (
                          <span className="text-green-600 font-medium flex items-center">
                            <Icons.Check className="w-3 h-3 mr-1" />
                            Estado: {incident.report.incidentStatus || 'Sin estado'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!incident.report && (
                        <button
                          onClick={() => handleCreateReport(incident)}
                          className="bg-ucv-red text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Icons.DocumentText className="w-3 h-3 mr-1" />
                          Generar Reporte
                        </button>
                      )}
                      {incident.report && (
                        <button
                          onClick={() => handleCreateReport(incident)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600 transition-colors flex items-center"
                        >
                          <Icons.Pencil className="w-3 h-3 mr-1" />
                          Editar Reporte
                        </button>
                      )}
                      <Link
                        to={`/incidents/${incident.incidentId}`}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300 transition-colors flex items-center"
                      >
                        <Icons.Eye className="w-3 h-3 mr-1" />
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal para Reportes */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              {selectedIncident?.report ? 'Editar Reporte' : 'Generar Reporte'} - {selectedIncident?.area}
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
                className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {selectedIncident?.report ? 'Actualizar Reporte' : 'Generar Reporte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedIncidents;