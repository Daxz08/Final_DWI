import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, reportService } from '../../services/api';
import { Link } from 'react-router-dom';

// Iconos SVG profesionales
const Icons = {
  DocumentText: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Exclamation: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
  )
};

const SupportGenerateReports = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    oldestDays: 0
  });

  const [filters, setFilters] = useState({
    priority: 'all',
    daysOld: 'all'
  });

  useEffect(() => {
    fetchUnreportedIncidents();
  }, [user]);

  useEffect(() => {
    filterIncidents();
    calculateStats();
  }, [incidents, filters]);

  const fetchUnreportedIncidents = async () => {
    try {
      setLoading(true);
      console.log('🔍 [SupportGenerateReports] Buscando incidencias sin reporte...');
      
      const employeeId = user.employeeId || user.id;
      
      if (!employeeId) {
        console.error('❌ No se pudo obtener employeeId');
        setLoading(false);
        return;
      }

      // Obtener todas las incidencias
      const response = await incidentService.getAll();
      
      if (response.success) {
        // Obtener todos los reportes
        const reportsResponse = await reportService.getAll();
        const allReports = reportsResponse.success ? reportsResponse.data : [];
        
        // Crear mapa de incidencias con reporte
        const reportedIncidentIds = new Set(allReports.map(report => report.incidentId));
        
        // Filtrar incidencias asignadas a este empleado SIN reporte
        const unreported = response.data.filter(incident => 
          (incident.employeeId === employeeId || incident.assignedTo === employeeId) && 
          !reportedIncidentIds.has(incident.incidentId)
        );
        
        setIncidents(unreported);
        console.log(`✅ [SupportGenerateReports] ${unreported.length} incidencias sin reporte`);
      }
    } catch (error) {
      console.error('❌ [SupportGenerateReports] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = [...incidents];

    // Filtro por prioridad
    if (filters.priority !== 'all') {
      filtered = filtered.filter(incident => incident.priorityLevel === filters.priority);
    }

    // Filtro por antigüedad
    if (filters.daysOld !== 'all') {
      const days = parseInt(filters.daysOld);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(incident => {
        const incidentDate = new Date(incident.incidentDate);
        return incidentDate < cutoffDate;
      });
    }

    setFilteredIncidents(filtered);
  };

  const calculateStats = () => {
    const highPriority = incidents.filter(i => i.priorityLevel === 'HIGH').length;
    const mediumPriority = incidents.filter(i => i.priorityLevel === 'MEDIUM').length;
    const lowPriority = incidents.filter(i => i.priorityLevel === 'LOW').length;
    
    // Calcular la incidencia más antigua en días
    let oldestDays = 0;
    if (incidents.length > 0) {
      const now = new Date();
      const oldest = incidents.reduce((oldest, incident) => {
        const incidentDate = new Date(incident.incidentDate);
        return incidentDate < oldest ? incidentDate : oldest;
      }, new Date());
      
      const diffTime = Math.abs(now - oldest);
      oldestDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    setStats({
      total: incidents.length,
      highPriority,
      mediumPriority,
      lowPriority,
      oldestDays
    });
  };

  const getPriorityBadge = (priority) => {
    if (!priority || priority === 'null') {
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Sin prioridad</span>;
    }
    
    const priorities = {
      'LOW': { color: 'bg-green-100 text-green-800', text: 'Baja' },
      'MEDIUM': { color: 'bg-yellow-100 text-yellow-800', text: 'Media' },
      'HIGH': { color: 'bg-red-100 text-red-800', text: 'Alta' }
    };
    const priorityInfo = priorities[priority] || { color: 'bg-gray-100 text-gray-800', text: 'Sin asignar' };
    return <span className={`${priorityInfo.color} px-2 py-1 rounded-full text-xs`}>{priorityInfo.text}</span>;
  };

  const getDaysOldBadge = (date) => {
    const incidentDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - incidentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">{diffDays} días</span>;
    } else if (diffDays > 3) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">{diffDays} días</span>;
    } else {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{diffDays} días</span>;
    }
  };

  const handleGenerateReport = (incidentId) => {
    // Redirigir a la página de incidencias asignadas para generar el reporte
    window.location.href = `/support/assigned?generateReport=${incidentId}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando incidencias...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/support/dashboard"
          className="flex items-center text-ucv-blue hover:text-blue-800 transition-colors mb-6"
        >
          <Icons.ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-ucv-blue">Generar Reportes Pendientes</h1>
              <p className="text-gray-600 mt-1">Incidencias asignadas que aún no tienen reporte</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">{incidents.length} pendientes</span>
              <button
                onClick={fetchUnreportedIncidents}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
              >
                <Icons.Refresh className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue">
              <p className="text-sm font-medium text-gray-600">Total Pendientes</p>
              <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
              <p className="text-sm font-medium text-gray-600">Alta Prioridad</p>
              <p className="text-xl font-bold text-red-600 mt-1">{stats.highPriority}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-600">Media Prioridad</p>
              <p className="text-xl font-bold text-yellow-600 mt-1">{stats.mediumPriority}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-600">Baja Prioridad</p>
              <p className="text-xl font-bold text-green-600 mt-1">{stats.lowPriority}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  <Icons.Filter className="inline w-4 h-4 mr-1" />
                  Filtrar por prioridad
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="HIGH">Alta prioridad</option>
                  <option value="MEDIUM">Media prioridad</option>
                  <option value="LOW">Baja prioridad</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  <Icons.Clock className="inline w-4 h-4 mr-1" />
                  Filtrar por antigüedad
                </label>
                <select
                  value={filters.daysOld}
                  onChange={(e) => setFilters(prev => ({ ...prev, daysOld: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
                >
                  <option value="all">Todas las fechas</option>
                  <option value="3">Más de 3 días</option>
                  <option value="7">Más de 7 días</option>
                  <option value="14">Más de 14 días</option>
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
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <Icons.DocumentText className="w-16 h-16 inline-block" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {incidents.length === 0 ? '¡No hay incidencias pendientes!' : 'No hay resultados'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                {incidents.length === 0 
                  ? '¡Excelente trabajo! Todas tus incidencias asignadas tienen reporte.'
                  : 'Intenta con otros filtros para ver más resultados.'}
              </p>
              {incidents.length === 0 ? (
                <Link 
                  to="/support/dashboard"
                  className="inline-block px-4 py-2 bg-ucv-blue text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Volver al Dashboard
                </Link>
              ) : (
                <button
                  onClick={() => setFilters({ priority: 'all', daysOld: 'all' })}
                  className="inline-block px-4 py-2 bg-ucv-blue text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-ucv-blue">{incident.area}</h3>
                        {getPriorityBadge(incident.priorityLevel)}
                        {getDaysOldBadge(incident.incidentDate)}
                        {incident.priorityLevel === 'HIGH' && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
                            <Icons.Exclamation className="w-3 h-3 mr-1" />
                            Urgente
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Icons.Calendar className="w-3 h-3 mr-1" />
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        <span>ID: #{incident.incidentId}</span>
                        <span>Reportado por: {incident.userId}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleGenerateReport(incident.incidentId)}
                      className="ml-4 bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm flex items-center whitespace-nowrap"
                    >
                      <Icons.DocumentText className="w-4 h-4 mr-2" />
                      Generar Reporte
                    </button>
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

export default SupportGenerateReports;