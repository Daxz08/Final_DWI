import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, reportService } from '../../services/api';

const SupportDashboard = () => {
  const { user } = useAuth();
  const [assignedIncidents, setAssignedIncidents] = useState([]);
  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assigned: 0,
    unassigned: 0,
    inProgress: 0,
    resolved: 0
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [reportForm, setReportForm] = useState({
    description: '',
    actions: '',
    incidentStatus: 'RESOLVED'
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      console.log('🔍 Cargando datos para soporte...');
      
      // Obtener todas las incidencias
      const allResponse = await incidentService.getAll();
      console.log('📥 Todas las incidencias:', allResponse);
      
      let allIncidentsData = [];
      if (allResponse.success && allResponse.data) {
        allIncidentsData = allResponse.data;
      }

      // 🔥 CORREGIDO: Filtrar incidencias asignadas a este empleado
      const employeeId = user.employeeId || user.id;
      const assigned = allIncidentsData.filter(incident => 
        incident.employeeId === employeeId
      );
      
      console.log('👤 Incidencias asignadas a mí:', assigned);
      
      setAssignedIncidents(assigned.slice(0, 5));
      setAllIncidents(allIncidentsData.slice(0, 5));
      
      // Calcular estadísticas
      const stats = {
        assigned: assigned.length,
        unassigned: allIncidentsData.filter(inc => !inc.employeeId).length,
        inProgress: assigned.filter(inc => inc.employeeId && !inc.report).length,
        resolved: assigned.filter(inc => inc.report).length
      };
      setStats(stats);
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = (incident) => {
    setSelectedIncident(incident);
    setReportForm({
      description: '',
      actions: '',
      incidentStatus: 'RESOLVED'
    });
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    try {
      const reportData = {
        description: reportForm.description,
        actions: reportForm.actions,
        incidentStatus: reportForm.incidentStatus,
        employeeId: user.employeeId || user.id,
        incidentId: selectedIncident.incidentId
      };

      const response = await reportService.create(reportData);
      if (response.success) {
        setShowReportModal(false);
        setSelectedIncident(null);
        fetchDashboardData();
        alert('Reporte creado exitosamente');
      } else {
        alert('Error al crear reporte: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Error al crear reporte');
    }
  };

  const getStatusBadge = (incident) => {
    if (!incident.employeeId) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pendiente</span>;
    }
    if (incident.employeeId && !incident.report) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En Progreso</span>;
    }
    return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Resuelta</span>;
  };

  const getPriorityBadge = (priority) => {
    if (!priority || priority === 'null') {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-ucv-blue">
          Bienvenido, {user.firstName} 🔧
        </h1>
        <p className="text-gray-600 mt-1">
          Panel de Soporte Técnico - Universidad César Vallejo
        </p>
        <p className="text-sm text-ucv-red mt-2 font-medium">
          Especialidad: {user.specialty || 'Soporte General'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Asignadas a Mí</p>
              <p className="text-2xl font-bold text-ucv-blue mt-1">{stats.assigned}</p>
            </div>
            <div className="w-12 h-12 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center">
              <span className="text-ucv-blue text-xl">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sin Asignar</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.unassigned}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">🔄</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resueltas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
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
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mis Asignadas</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Incidencias asignadas a mí
              </p>
            </div>
          </div>
        </Link>

        <Link 
          to="/support/incidents"
          className="bg-ucv-blue hover:bg-blue-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📑</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Todas</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Ver todas las incidencias
              </p>
            </div>
          </div>
        </Link>

        <Link 
          to="/support/reports"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Reportes</h3>
              <p className="text-white text-opacity-90 mt-1 text-sm">
                Generar reportes
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Incidents */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Mis Incidencias Asignadas</h2>
            <Link 
              to="/support/assigned"
              className="text-ucv-red hover:text-red-700 font-medium"
            >
              Ver todas →
            </Link>
          </div>

          {assignedIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tienes incidencias asignadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedIncidents.map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ucv-blue">{incident.area}</h3>
                      <p className="text-gray-600 text-sm mt-1">{incident.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        {getPriorityBadge(incident.priorityLevel)}
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

        {/* All Incidents */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-ucv-blue">Todas las Incidencias</h2>
            <Link 
              to="/support/incidents"
              className="text-ucv-red hover:text-red-700 font-medium"
            >
              Ver todas →
            </Link>
          </div>

          {allIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay incidencias en el sistema</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allIncidents.map((incident) => (
                <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-ucv-blue">{incident.area}</h3>
                      <p className="text-gray-600 text-sm mt-1">{incident.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(incident.incidentDate).toLocaleDateString()}
                        </span>
                        {getPriorityBadge(incident.priorityLevel)}
                        {!incident.employeeId && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Sin asignar</span>
                        )}
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

      {/* Modal para Reportes */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              Generar Reporte - {selectedIncident?.area}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Descripción del Trabajo
                </label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  rows={3}
                  placeholder="Describe el trabajo realizado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Acciones Tomadas
                </label>
                <textarea
                  value={reportForm.actions}
                  onChange={(e) => setReportForm(prev => ({ ...prev, actions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  rows={3}
                  placeholder="Describe las acciones específicas realizadas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Estado Final
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