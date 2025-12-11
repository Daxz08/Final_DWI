import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService, reportService } from '../../services/api';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const IncidentList = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
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
    console.log('🔍 [IncidentList] Iniciando carga...');
    console.log('👤 Rol del usuario:', user.role);
    console.log('🆔 ID del empleado:', user.employeeId);
    
    let incidentsData = [];
    let employeesData = [];

    // 🔥 LÓGICA CORREGIDA SEGÚN ROL DEL USUARIO
    if (user.role === 'STUDENT' || user.role === 'TEACHER') {
      // Para estudiantes y docentes: SOLO sus incidencias
      console.log(`📋 Cargando incidencias del usuario ${user.userId}...`);
      const response = await incidentService.getByUser(user.userId);
      incidentsData = response.data || [];
      
    } else if (user.role === 'SUPPORT') {
      // 🔥 CORRECCIÓN: Usar getByEmployee en lugar de getAssignedToEmployee
      console.log(`👷 Cargando incidencias del empleado ${user.employeeId}...`);
      try {
        const response = await incidentService.getByEmployee(user.employeeId);
        incidentsData = response.data || [];
      } catch (employeeError) {
        console.error('❌ Error obteniendo incidencias por empleado:', employeeError);
        
        // Fallback: obtener todas y filtrar
        try {
          const allResponse = await incidentService.getAll();
          if (allResponse.success) {
            incidentsData = (allResponse.data || []).filter(incident => 
              incident.employeeId === user.employeeId
            );
          }
        } catch (fallbackError) {
          console.error('❌ Fallback también falló:', fallbackError);
        }
      }
      
    } else if (user.role === 'ADMIN') {
      // Para admin: TODAS las incidencias
      console.log('📋 Cargando TODAS las incidencias...');
      const response = await incidentService.getAll();
      incidentsData = response.data || [];
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

    // 🔥 Cargar empleados solo para ADMIN/SUPPORT
    if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
      try {
        const response = await employeeService.getAvailable();
        if (response.success) {
          employeesData = response.data || [];
        }
      } catch (employeeError) {
        console.error('❌ Error cargando empleados:', employeeError);
      }
    }

    console.log(`✅ ${incidentsData.length} incidencias cargadas con estado actualizado`);
    console.log('📊 Muestra de incidencias:', incidentsData.slice(0, 3));
    
    setIncidents(incidentsData);
    setEmployees(employeesData);

  } catch (error) {
    console.error('❌ [IncidentList] Error general:', error);
    alert(`Error al cargar los datos: ${error.message || 'Error desconocido'}`);
  } finally {
    setLoading(false);
  }
};

  const getStatusBadge = (incident) => {
    // 🔥 LÓGICA ACTUALIZADA: Usar el estado del reporte si existe
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

    // 🔥 USAR EL ESTADO DEL REPORTE
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

  const handleAssignClick = (incident) => {
    setSelectedIncident(incident);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    try {
      await incidentService.assignIncidentToEmployee(
        selectedIncident.incidentId, 
        assignForm.employeeId, 
        assignForm.priorityLevel
      );
      setShowAssignModal(false);
      setSelectedIncident(null);
      fetchData(); // Refresh the list
      alert('Incidencia asignada exitosamente');
    } catch (error) {
      console.error('Error assigning incident:', error);
      alert('Error al asignar la incidencia');
    }
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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-ucv-blue">
            {user.role === 'ADMIN' ? 'Todas las Incidencias' : 'Incidencias Asignadas'}
          </h1>
          <span className="text-gray-600">{incidents.length} incidencias</span>
        </div>

        <div className="space-y-4">
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay incidencias para mostrar</p>
            </div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-ucv-blue">{incident.area}</h3>
                      {getPriorityBadge(incident.priorityLevel)}
                      {getStatusBadge(incident)}
                      {incident.report && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          Con Reporte
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Fecha: {new Date(incident.incidentDate).toLocaleDateString()}</span>
                      {incident.userId && (
                        <span>Reportado por: {incident.userId}</span>
                      )}
                      {incident.employeeId && (
                        <span>Asignado a: {incident.employeeId}</span>
                      )}
                      {incident.report && (
                        <span className="text-green-600">
                          Estado: {incident.report.incidentStatus || 'Sin estado'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {(user.role === 'ADMIN' || user.role === 'SUPPORT') && !incident.employeeId && (
                      <button
                        onClick={() => handleAssignClick(incident)}
                        className="bg-ucv-blue text-white px-3 py-1 rounded text-xs hover:bg-blue-800 transition-colors"
                      >
                        Asignar
                      </button>
                    )}
                    <Link
  to={`/${user.role.toLowerCase()}/incidents/${incident.incidentId}`}
  className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-300 transition-colors"
>
  Ver Detalle
</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Asignación */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              Asignar Incidencia: {selectedIncident?.area}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Empleado
                </label>
                <select
                  value={assignForm.employeeId}
                  onChange={(e) => setAssignForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="">Seleccionar empleado</option>
                  {employees.map(emp => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} - {emp.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Prioridad
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
                className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={!assignForm.employeeId}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentList;