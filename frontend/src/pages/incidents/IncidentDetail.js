import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService, employeeService, reportService } from '../../services/api';

const IncidentDetail = () => {
  const { incidentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [assignForm, setAssignForm] = useState({
    employeeId: '',
    priorityLevel: 'MEDIUM'
  });
  const [reportForm, setReportForm] = useState({
    diagnosis: '',
    actionsTaken: '',
    incidentStatus: 'RESOLVED'
  });

  useEffect(() => {
    fetchIncidentDetails();
  }, [incidentId]);

  // 🔥 FUNCIÓN MEJORADA para manejar respuestas de la API
  const handleApiResponse = (response, context = '') => {
    console.log(`📥 [${context}] Respuesta:`, response);
    
    if (!response) {
      console.error(`❌ [${context}] Respuesta indefinida`);
      return null;
    }
    
    // Estructura estándar: { success, data, message }
    if (response.success !== undefined) {
      return response.data;
    }
    
    // Si es un array
    if (Array.isArray(response)) {
      return response;
    }
    
    // Si ya es el objeto de datos
    return response;
  };

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      console.log(`🔍 [IncidentDetail] Cargando detalles para incidencia ${incidentId}`);
      
      // 1. Obtener la incidencia
      const incidentResponse = await incidentService.getById(incidentId);
      console.log('📋 Respuesta de incidencia:', incidentResponse);
      
      if (incidentResponse && incidentResponse.success) {
        const incidentData = handleApiResponse(incidentResponse, 'GET_INCIDENT');
        console.log('📋 Datos procesados de incidencia:', incidentData);
        
        setIncident(incidentData);
        
        // 2. Buscar reporte para esta incidencia
        try {
          const reportsResponse = await reportService.getAll();
          console.log('📊 Respuesta de reportes:', reportsResponse);
          
          if (reportsResponse && reportsResponse.success) {
            const reportsData = handleApiResponse(reportsResponse, 'GET_REPORTS');
            
            if (Array.isArray(reportsData)) {
              const incidentReport = reportsData.find(
                r => r.incidentId === incidentId || r.incident?.incidentId === incidentId
              );
              console.log('📊 Reporte encontrado:', incidentReport);
              setReport(incidentReport || null);
            }
          }
        } catch (reportError) {
          console.error('❌ Error obteniendo reportes:', reportError);
          setReport(null);
        }
        
        // 3. Obtener datos del empleado si existe
        if (incidentData.employeeId) {
          console.log(`👷 Buscando empleado con ID: ${incidentData.employeeId}`);
          try {
            const employeeResponse = await employeeService.getAll();
            console.log('👤 Respuesta de empleados:', employeeResponse);
            
            if (employeeResponse && employeeResponse.success) {
              const employeesData = handleApiResponse(employeeResponse, 'GET_EMPLOYEES');
              
              if (Array.isArray(employeesData)) {
                const foundEmployee = employeesData.find(
                  emp => emp.employeeId === incidentData.employeeId || 
                         emp.id === incidentData.employeeId ||
                         emp._id === incidentData.employeeId
                );
                console.log('👤 Empleado encontrado:', foundEmployee);
                setEmployee(foundEmployee || null);
              }
            }
          } catch (empError) {
            console.error('❌ Error obteniendo empleado:', empError);
            setEmployee(null);
          }
        } else {
          setEmployee(null);
        }
      } else {
        alert(incidentResponse?.message || 'No se pudo cargar la incidencia');
        navigate('/incidents');
      }
      
      // 4. Cargar empleados disponibles para asignación
      if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
        try {
          const empResponse = await employeeService.getAvailable();
          console.log('👥 Empleados disponibles:', empResponse);
          
          if (empResponse && empResponse.success) {
            const availableEmployees = handleApiResponse(empResponse, 'GET_AVAILABLE_EMPLOYEES');
            setEmployees(Array.isArray(availableEmployees) ? availableEmployees : []);
          }
        } catch (empError) {
          console.error('❌ Error cargando empleados disponibles:', empError);
          setEmployees([]);
        }
      }
      
    } catch (error) {
      console.error('❌ [IncidentDetail] Error general:', error);
      alert(`Error al cargar detalles: ${error.message || 'Error desconocido'}`);
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FUNCIÓN MEJORADA para determinar estado
  const determineStatus = () => {
    if (report) {
      return report.incidentStatus || 'RESOLVED';
    }
    if (incident?.employeeId) {
      return 'IN_PROGRESS';
    }
    return 'PENDING';
  };

  const getStatusBadge = () => {
    const status = determineStatus();
    
    const statusMap = {
      'PENDING': { 
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-300', 
        text: '⏳ Pendiente',
        icon: '⏳'
      },
      'IN_PROGRESS': { 
        color: 'bg-blue-100 text-blue-800 border border-blue-300', 
        text: '🔧 En Progreso',
        icon: '🔧'
      },
      'RESOLVED': { 
        color: 'bg-green-100 text-green-800 border border-green-300', 
        text: '✅ Resuelta',
        icon: '✅'
      },
      'UNRESOLVED': { 
        color: 'bg-red-100 text-red-800 border border-red-300', 
        text: '❌ No Resuelta',
        icon: '❌'
      },
      'CLOSED': { 
        color: 'bg-gray-100 text-gray-800 border border-gray-300', 
        text: '🔒 Cerrada',
        icon: '🔒'
      }
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;
    return (
      <span className={`${statusInfo.color} px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2`}>
        <span>{statusInfo.icon}</span>
        <span>{statusInfo.text}</span>
      </span>
    );
  };

  const getPriorityBadge = () => {
    const priority = incident?.priorityLevel;
    
    if (!priority || priority === 'null' || priority === '') {
      return (
        <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2">
          <span>🏷️</span>
          <span>Sin asignar</span>
        </span>
      );
    }
    
    const priorities = {
      'LOW': { 
        color: 'bg-green-100 text-green-800 border border-green-300', 
        text: '⬇️ Baja',
        icon: '⬇️'
      },
      'MEDIUM': { 
        color: 'bg-yellow-100 text-yellow-800 border border-yellow-300', 
        text: '⏺️ Media',
        icon: '⏺️'
      },
      'HIGH': { 
        color: 'bg-red-100 text-red-800 border border-red-300', 
        text: '⬆️ Alta',
        icon: '⬆️'
      }
    };
    
    const priorityInfo = priorities[priority] || { 
      color: 'bg-gray-100 text-gray-800 border border-gray-300', 
      text: '🏷️ Sin asignar',
      icon: '🏷️'
    };
    
    return (
      <span className={`${priorityInfo.color} px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2`}>
        <span>{priorityInfo.icon}</span>
        <span>{priorityInfo.text}</span>
      </span>
    );
  };

  const handleAssignSubmit = async () => {
    try {
      console.log('📤 Asignando incidencia:', {
        incidentId,
        employeeId: assignForm.employeeId,
        priorityLevel: assignForm.priorityLevel
      });
      
      const response = await incidentService.assignIncidentToEmployee(
        incidentId,
        assignForm.employeeId,
        assignForm.priorityLevel
      );
      
      console.log('✅ Respuesta de asignación:', response);
      
      if (response && response.success) {
        setShowAssignModal(false);
        fetchIncidentDetails();
        alert('✅ Incidencia asignada exitosamente');
      } else {
        alert(response?.message || 'Error al asignar la incidencia');
      }
    } catch (error) {
      console.error('❌ Error asignando incidencia:', error);
      alert(`Error: ${error.message || 'Error al asignar la incidencia'}`);
    }
  };

  const handleReportSubmit = async () => {
    try {
      // Verificar permisos
      if (user.role === 'SUPPORT' && incident.employeeId !== user.employeeId) {
        alert('⚠️ Solo el empleado asignado puede crear reportes');
        return;
      }
      
      const reportData = {
        incidentId: incidentId,
        employeeId: incident.employeeId || user.employeeId,
        diagnosis: reportForm.diagnosis,
        actionsTaken: reportForm.actionsTaken,
        incidentStatus: reportForm.incidentStatus,
        reportDate: new Date().toISOString()
      };
      
      console.log('📤 Creando reporte:', reportData);
      
      const response = await reportService.create(reportData);
      console.log('✅ Respuesta de creación de reporte:', response);
      
      if (response && response.success) {
        setShowReportModal(false);
        setReportForm({ diagnosis: '', actionsTaken: '', incidentStatus: 'RESOLVED' });
        fetchIncidentDetails();
        alert('✅ Reporte creado exitosamente');
      } else {
        alert(response?.message || 'Error al crear el reporte');
      }
    } catch (error) {
      console.error('❌ Error creando reporte:', error);
      alert(`Error: ${error.message || 'Error al crear el reporte'}`);
    }
  };

  // Muestra de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ucv-blue mx-auto"></div>
          <p className="mt-4 text-ucv-blue">Cargando detalles de la incidencia...</p>
          <p className="text-sm text-gray-500">ID: {incidentId}</p>
        </div>
      </div>
    );
  }

  // Si no hay incidencia
  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-ucv-red mb-4">Incidencia no encontrada</h2>
          <p className="text-gray-600 mb-6">La incidencia que buscas no existe o fue eliminada.</p>
          <p className="text-sm text-gray-500 mb-4">ID buscado: {incidentId}</p>
          <Link 
            to="/incidents" 
            className="inline-flex items-center gap-2 bg-ucv-blue text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            ← Volver al listado de incidencias
          </Link>
        </div>
      </div>
    );
  }

  // 🔥 FUNCIÓN PARA OBTENER NOMBRE DEL EMPLEADO
  const getEmployeeName = () => {
    if (!employee) return 'No asignado';
    
    if (employee.firstName && employee.lastName) {
      return `${employee.firstName} ${employee.lastName}`;
    }
    
    if (employee.name) return employee.name;
    if (employee.fullName) return employee.fullName;
    
    return 'Empleado asignado';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/incidents" className="text-ucv-blue hover:underline inline-flex items-center gap-1">
              ← Volver al listado
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-ucv-blue">Detalles de Incidencia</h1>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              {getPriorityBadge()}
            </div>
          </div>
          <p className="text-gray-600 mt-2">ID: <span className="font-mono">{incident.incidentId || incident.id || incident._id || 'N/A'}</span></p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(user.role === 'ADMIN' || (user.role === 'SUPPORT' && !incident.employeeId)) && (
            <button
              onClick={() => {
                setShowAssignModal(true);
                setAssignForm({
                  employeeId: incident.employeeId || '',
                  priorityLevel: incident.priorityLevel || 'MEDIUM'
                });
              }}
              className="bg-ucv-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
            >
              <span>👨‍💼</span>
              {incident.employeeId ? 'Reasignar' : 'Asignar Empleado'}
            </button>
          )}
          
          {user.role === 'SUPPORT' && incident.employeeId === user.employeeId && !report && (
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <span>📝</span>
              Crear Reporte
            </button>
          )}
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        {/* Información básica */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-ucv-blue mb-4 flex items-center gap-2">
            <span>📋</span> Información General
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Área / Ubicación</h3>
              <p className="text-lg font-semibold text-gray-800">
                {incident.area || incident.location || 'No especificada'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Reporte</h3>
              <p className="text-lg font-semibold text-gray-800">
                {incident.incidentDate ? new Date(incident.incidentDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Fecha no disponible'}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Categoría</h3>
              <p className="text-lg font-semibold text-gray-800">
                {incident.category || incident.type || 'General'}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción del Problema</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 whitespace-pre-line">
                {incident.description || 'Sin descripción proporcionada'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Reportado por</h3>
              <p className="font-medium text-gray-800">
                {incident.userId || incident.userName || incident.user?.name || 'Usuario anónimo'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo de Usuario</h3>
              <p className="font-medium text-gray-800">
                {incident.userType || incident.user?.role || 'No especificado'}
              </p>
            </div>
          </div>
        </div>

        {/* Asignación */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-ucv-blue mb-4 flex items-center gap-2">
            <span>👨‍💼</span> Asignación y Responsable
          </h2>
          
          {incident.employeeId || employee ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-16 h-16 bg-ucv-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {employee ? 
                    (employee.firstName?.[0] || employee.name?.[0] || 'E') + 
                    (employee.lastName?.[0] || employee.surname?.[0] || 'M') 
                    : 'E M'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {getEmployeeName()}
                      </h3>
                      <p className="text-gray-600">
                        {employee?.specialty || employee?.position || 'Soporte Técnico'}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span className="text-sm text-gray-500">
                        ID: {incident.employeeId || employee?.employeeId || employee?.id}
                      </span>
                      <span className="text-sm text-gray-500">
                        Asignado desde: {incident.assignedDate ? 
                          new Date(incident.assignedDate).toLocaleDateString() : 
                          'Fecha desconocida'}
                      </span>
                    </div>
                  </div>
                  
                  {employee && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Contacto</h4>
                        <p className="text-gray-800">
                          <span className="font-medium">📧</span> {employee.email || 'No disponible'}
                        </p>
                        <p className="text-gray-800">
                          <span className="font-medium">📱</span> {employee.phone || employee.phoneNumber || 'No disponible'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Información</h4>
                        <p className="text-gray-800">
                          <span className="font-medium">🏢</span> {employee.department || employee.area || 'Soporte'}
                        </p>
                        <p className="text-gray-800">
                          <span className="font-medium">👤</span> {employee.role || employee.position || 'Técnico'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Sin empleado asignado</h3>
              <p className="text-gray-500 mb-4">Esta incidencia aún no ha sido asignada a un técnico.</p>
              {(user.role === 'ADMIN' || user.role === 'SUPPORT') && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="bg-ucv-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>➕</span> Asignar ahora
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reporte */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-ucv-blue mb-4 flex items-center gap-2">
            <span>📋</span> Reporte Técnico
          </h2>
          
          {report ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Reporte #{report.reportId || report.id || 'N/A'}
                  </h3>
                  <p className="text-gray-600">
                    Generado el {report.reportDate ? 
                      new Date(report.reportDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Fecha desconocida'}
                  </p>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${report.incidentStatus === 'RESOLVED' ? 'bg-green-100 text-green-800 border border-green-300' : 
                    report.incidentStatus === 'UNRESOLVED' ? 'bg-red-100 text-red-800 border border-red-300' :
                    'bg-blue-100 text-blue-800 border border-blue-300'}
                `}>
                  {report.incidentStatus === 'RESOLVED' ? '✅ Resuelto' :
                   report.incidentStatus === 'UNRESOLVED' ? '❌ No Resuelto' :
                   report.incidentStatus === 'IN_PROGRESS' ? '🔧 En Proceso' :
                   '📋 Registrado'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <span>🔍</span> Diagnóstico
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-line">
                      {report.diagnosis || 'Sin diagnóstico especificado'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <span>🛠️</span> Acciones Tomadas
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-line">
                      {report.actionsTaken || 'Sin acciones registradas'}
                    </p>
                  </div>
                </div>
              </div>
              
              {report.notes && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <span>📝</span> Notas Adicionales
                  </h4>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-line">{report.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="text-5xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Sin reporte técnico</h3>
              <p className="text-gray-500 mb-4">Esta incidencia aún no tiene un reporte técnico asociado.</p>
              
              {user.role === 'SUPPORT' && incident.employeeId === user.employeeId && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="bg-ucv-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
                >
                  <span>📝</span> Crear Reporte
                </button>
              )}
              
              {user.role === 'SUPPORT' && incident.employeeId !== user.employeeId && incident.employeeId && (
                <p className="text-sm text-yellow-600">
                  ⚠️ Solo el técnico asignado puede crear reportes
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Asignación */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              {incident.employeeId ? 'Reasignar' : 'Asignar'} Incidencia
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Seleccionar Empleado
                </label>
                <select
                  value={assignForm.employeeId}
                  onChange={(e) => setAssignForm(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="">Seleccionar empleado...</option>
                  {employees.map(emp => (
                    <option key={emp.employeeId || emp.id} value={emp.employeeId || emp.id}>
                      {emp.firstName || emp.name} {emp.lastName || emp.surname} 
                      {emp.specialty ? ` - ${emp.specialty}` : ''}
                      {emp.department ? ` (${emp.department})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Nivel de Prioridad
                </label>
                <select
                  value={assignForm.priorityLevel}
                  onChange={(e) => setAssignForm(prev => ({ ...prev, priorityLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="LOW">⬇️ Baja - Sin urgencia</option>
                  <option value="MEDIUM">⏺️ Media - Atención normal</option>
                  <option value="HIGH">⬆️ Alta - Urgente</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={!assignForm.employeeId}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {incident.employeeId ? 'Reasignar' : 'Asignar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reporte */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              📝 Crear Reporte Técnico
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  🔍 Diagnóstico
                </label>
                <textarea
                  value={reportForm.diagnosis}
                  onChange={(e) => setReportForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  rows="4"
                  placeholder="Describe el problema encontrado, causas raíz, análisis realizado..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  🛠️ Acciones Tomadas
                </label>
                <textarea
                  value={reportForm.actionsTaken}
                  onChange={(e) => setReportForm(prev => ({ ...prev, actionsTaken: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  rows="4"
                  placeholder="Describe las acciones realizadas para resolver la incidencia..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  📊 Estado Final
                </label>
                <select
                  value={reportForm.incidentStatus}
                  onChange={(e) => setReportForm(prev => ({ ...prev, incidentStatus: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="RESOLVED">✅ Resuelta - Problema solucionado</option>
                  <option value="UNRESOLVED">❌ No Resuelta - Requiere más atención</option>
                  <option value="CLOSED">🔒 Cerrada - Finalizado por otras razones</option>
                  <option value="IN_PROGRESS">🔧 En Proceso - Seguimiento necesario</option>
                </select>
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
                disabled={!reportForm.diagnosis.trim() || !reportForm.actionsTaken.trim()}
                className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Guardar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDetail;