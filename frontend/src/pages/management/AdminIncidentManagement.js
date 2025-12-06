import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService, userService } from '../../services/api';

const AdminIncidentManagement = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    priorityLevel: 'MEDIUM'
  });
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [incidentsRes, employeesRes, usersRes] = await Promise.all([
        incidentService.getAll(),
        employeeService.getAll(),
        userService.getAll()
      ]);

      if (incidentsRes.success) setIncidents(incidentsRes.data || []);
      if (employeesRes.success) setEmployees(employeesRes.data || []);
      if (usersRes.success) setUsers(usersRes.data || []);

    } catch (error) {
      console.error('Error fetching data:', error);
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

  const getUserName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Usuario no encontrado';
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Sin asignar';
  };

  const handleAssignClick = (incident) => {
    setSelectedIncident(incident);
    setAssignForm({
      employeeId: '',
      priorityLevel: 'MEDIUM'
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
        alert('Incidencia asignada exitosamente');
      } else {
        alert('Error al asignar incidencia: ' + response.message);
      }
    } catch (error) {
      console.error('Error assigning incident:', error);
      alert('Error al asignar la incidencia: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filters.status === 'unassigned' && incident.employeeId) return false;
    if (filters.status === 'assigned' && !incident.employeeId) return false;
    if (filters.status === 'in-progress' && (!incident.employeeId || incident.report)) return false;
    if (filters.status === 'resolved' && !incident.report) return false;
    
    if (filters.priority !== 'all' && incident.priorityLevel !== filters.priority) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando incidencias...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-ucv-blue">Gestión de Incidencias</h1>
          <div className="flex space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
            >
              <option value="all">Todas las incidencias</option>
              <option value="unassigned">Sin asignar</option>
              <option value="assigned">Asignadas</option>
              <option value="in-progress">En progreso</option>
              <option value="resolved">Resueltas</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
            >
              <option value="all">Todas las prioridades</option>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
        </div>

        <div className="mb-4 text-gray-600">
          Mostrando {filteredIncidents.length} de {incidents.length} incidencias
        </div>

        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay incidencias que coincidan con los filtros</p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <div key={incident.incidentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-ucv-blue text-lg">{incident.area}</h3>
                      {getPriorityBadge(incident.priorityLevel)}
                      {getStatusBadge(incident)}
                    </div>
                    
                    <p className="text-gray-600 mb-2">{incident.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <strong>Reportado por:</strong> {getUserName(incident.userId)}
                      </div>
                      <div>
                        <strong>Asignado a:</strong> {getEmployeeName(incident.employeeId)}
                      </div>
                      <div>
                        <strong>Fecha:</strong> {new Date(incident.incidentDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Registro:</strong> {new Date(incident.registrationDate).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {!incident.employeeId && (
                      <button
                        onClick={() => handleAssignClick(incident)}
                        className="bg-ucv-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
                      >
                        Asignar
                      </button>
                    )}
                    {incident.employeeId && (
                      <span className="text-sm text-gray-500">
                        Asignada
                      </span>
                    )}
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
              Asignar Incidencia
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
                className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={!assignForm.employeeId}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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

export default AdminIncidentManagement;