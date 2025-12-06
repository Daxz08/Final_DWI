import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService } from '../../services/api';
import { Link } from 'react-router-dom';

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
    console.log('🔍 Iniciando carga de datos...');
    
    // Cargar incidencias
    const incidentsRes = await incidentService.getAll();
    console.log('📥 Respuesta de incidencias:', incidentsRes);
    
    let incidentsData = [];
    if (incidentsRes.data) {
      if (incidentsRes.data.success && incidentsRes.data.data) {
        incidentsData = incidentsRes.data.data;
      } else if (Array.isArray(incidentsRes.data)) {
        incidentsData = incidentsRes.data;
      } else if (incidentsRes.data.data && Array.isArray(incidentsRes.data.data)) {
        incidentsData = incidentsRes.data.data;
      }
    }
    
    console.log('📊 Incidencias cargadas:', incidentsData);
    setIncidents(incidentsData);

    // Solo cargar empleados si es admin/support
    if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
      const employeesRes = await employeeService.getAvailable();
      console.log('📥 Respuesta de empleados:', employeesRes);
      
      let employeesData = [];
      if (employeesRes.data) {
        if (employeesRes.data.success && employeesRes.data.data) {
          employeesData = employeesRes.data.data;
        } else if (Array.isArray(employeesRes.data)) {
          employeesData = employeesRes.data;
        } else if (employeesRes.data.data && Array.isArray(employeesRes.data.data)) {
          employeesData = employeesRes.data.data;
        }
      }
      
      console.log('👥 Empleados cargados:', employeesData);
      setEmployees(employeesData);
    }
  } catch (error) {
    console.error('❌ Error fetching data:', error);
    console.error('📝 Detalles del error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    alert('Error al cargar los datos. Verifica la consola para más detalles.');
  } finally {
    setLoading(false);
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
  // 🔥 CORRECCIÓN DEFINITIVA: Verificar si es null, undefined o string vacío
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
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Fecha: {new Date(incident.incidentDate).toLocaleDateString()}</span>
                      {incident.userId && (
                        <span>Reportado por usuario: {incident.userId}</span>
                      )}
                      {incident.employeeId && (
                        <span>Asignado a empleado: {incident.employeeId}</span>
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
                      to={`/incidents/${incident.incidentId}`}
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