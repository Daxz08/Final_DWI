import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportService, incidentService } from '../services/api';

const MyReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState({}); // Para almacenar datos de incidencias

  useEffect(() => {
    console.log('🔍 [MyReports] Usuario:', {
      id: user.userId,
      employeeId: user.employeeId,
      role: user.role,
      completo: user
    });
    fetchMyReports();
  }, [user]);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      console.log('🔍 [MyReports] Iniciando carga...');
      console.log('👤 Employee ID del usuario:', user.employeeId);
      console.log('👤 User ID del usuario:', user.userId);

      // 🔥 ESTRATEGIA 1: Obtener reportes por empleado
      console.log('📞 Intentando endpoint getByEmployee...');
      let response;
      
      try {
        // Primero intenta con employeeId
        if (user.employeeId) {
          response = await reportService.getByEmployee(user.employeeId);
          console.log('📊 Respuesta de getByEmployee:', response);
        } else {
          console.log('⚠️ No hay employeeId, intentando con userId...');
          response = await reportService.getByEmployee(user.userId);
        }
      } catch (error) {
        console.error('❌ Error en getByEmployee:', error);
        response = null;
      }

      let reportsData = [];

      if (response && response.success) {
        // Procesar respuesta exitosa
        if (Array.isArray(response.data)) {
          reportsData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          reportsData = response.data.data;
        } else if (response.data && Array.isArray(response.data.reports)) {
          reportsData = response.data.reports;
        }
        console.log(`✅ [Estrategia 1] ${reportsData.length} reportes encontrados`);
      }

      // 🔥 ESTRATEGIA 2: Si no hay datos, obtener todos y filtrar
      if (reportsData.length === 0) {
        console.log('🔄 Intentando estrategia 2: obtener todos los reportes...');
        try {
          const allReportsResponse = await reportService.getAll();
          console.log('📊 Respuesta de getAll:', allReportsResponse);

          if (allReportsResponse && allReportsResponse.success) {
            let allReports = [];
            
            if (Array.isArray(allReportsResponse.data)) {
              allReports = allReportsResponse.data;
            } else if (allReportsResponse.data && Array.isArray(allReportsResponse.data.data)) {
              allReports = allReportsResponse.data.data;
            }

            // Filtrar por employeeId o userId
            reportsData = allReports.filter(report => {
              // Verificar múltiples campos posibles
              const matchesEmployeeId = report.employeeId === user.employeeId || 
                                       report.employeeId === user.userId ||
                                       (report.employee && report.employee.employeeId === user.employeeId) ||
                                       (report.employee && report.employee.id === user.employeeId);
              
              const matchesAssignedEmployee = report.assignedEmployeeId === user.employeeId ||
                                             report.assignedEmployeeId === user.userId;

              return matchesEmployeeId || matchesAssignedEmployee;
            });

            console.log(`✅ [Estrategia 2] ${reportsData.length} reportes filtrados`);
          }
        } catch (error) {
          console.error('❌ Error en estrategia 2:', error);
        }
      }

      // 🔥 ESTRATEGIA 3: Obtener incidencias asignadas y buscar sus reportes
      if (reportsData.length === 0) {
        console.log('🔄 Intentando estrategia 3: buscar a través de incidencias...');
        try {
          // Obtener incidencias asignadas a este empleado
          const incidentsResponse = await incidentService.getAssignedToEmployee(user.employeeId || user.userId);
          console.log('📊 Incidencias asignadas:', incidentsResponse);

          if (incidentsResponse && incidentsResponse.success) {
            const assignedIncidents = Array.isArray(incidentsResponse.data) ? 
              incidentsResponse.data : 
              (incidentsResponse.data && Array.isArray(incidentsResponse.data.data) ? 
                incidentsResponse.data.data : []);

            // Para cada incidencia asignada, buscar su reporte
            const reportsPromises = assignedIncidents.map(async (incident) => {
              try {
                const reportResponse = await reportService.getByIncidentId(incident.incidentId);
                if (reportResponse && reportResponse.success && reportResponse.data) {
                  return {
                    ...reportResponse.data,
                    incidentId: incident.incidentId,
                    incidentArea: incident.area,
                    incidentDescription: incident.description
                  };
                }
              } catch (err) {
                console.warn(`⚠️ No se encontró reporte para incidencia ${incident.incidentId}`);
              }
              return null;
            });

            const reportsFromIncidents = (await Promise.all(reportsPromises)).filter(Boolean);
            reportsData = [...reportsData, ...reportsFromIncidents];
            console.log(`✅ [Estrategia 3] ${reportsFromIncidents.length} reportes adicionales`);
          }
        } catch (error) {
          console.error('❌ Error en estrategia 3:', error);
        }
      }

      // 🔥 Enriquecer datos con información de incidencias si es necesario
      if (reportsData.length > 0) {
        const incidentsMap = {};
        
        // Obtener detalles de las incidencias para los reportes
        for (const report of reportsData) {
          if (report.incidentId && !incidentsMap[report.incidentId]) {
            try {
              const incidentResponse = await incidentService.getById(report.incidentId);
              if (incidentResponse && incidentResponse.success && incidentResponse.data) {
                incidentsMap[report.incidentId] = incidentResponse.data;
              }
            } catch (err) {
              console.warn(`⚠️ No se pudo obtener detalle de incidencia ${report.incidentId}`);
            }
          }
        }
        
        setIncidents(incidentsMap);
      }

      console.log(`📋 Total final de reportes: ${reportsData.length}`);
      console.log('📊 Reportes finales:', reportsData);
      setReports(reportsData);

    } catch (error) {
      console.error('❌ [MyReports] Error general:', error);
      console.error('📝 Detalles del error:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      'IN_PROGRESS': { color: 'bg-blue-100 text-blue-800', text: 'En Progreso' },
      'RESOLVED': { color: 'bg-green-100 text-green-800', text: 'Resuelto' },
      'UNRESOLVED': { color: 'bg-red-100 text-red-800', text: 'No Resuelto' },
      'CLOSED': { color: 'bg-gray-100 text-gray-800', text: 'Cerrado' }
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;
    return <span className={`${statusInfo.color} px-2 py-1 rounded-full text-xs`}>{statusInfo.text}</span>;
  };

  const getIncidentInfo = (incidentId) => {
    if (incidents[incidentId]) {
      return incidents[incidentId];
    }
    return { area: 'No disponible', description: 'No disponible' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ucv-blue mb-2"></div>
          Cargando reportes...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ucv-blue">Mis Reportes</h1>
            <p className="text-gray-600 mt-1">
              Reportes generados como personal de soporte
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {reports.length} reporte{reports.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={fetchMyReports}
              className="bg-ucv-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 text-sm"
            >
              Actualizar
            </button>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg mb-2">No has generado reportes aún</p>
            <p className="text-sm text-gray-400 mb-4">
              Los reportes aparecerán aquí cuando generes uno para una incidencia asignada.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left max-w-md mx-auto">
              <p className="text-sm font-medium text-blue-800 mb-2">¿Qué puedes hacer?</p>
              <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                <li>Ve a "Incidencias Asignadas" para ver las incidencias que te han asignado</li>
                <li>Genera un reporte desde el detalle de una incidencia</li>
                <li>Asegúrate de estar logeado con la cuenta correcta</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const incidentInfo = getIncidentInfo(report.incidentId);
              
              return (
                <div key={report.reportId || report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-ucv-blue">
                          Reporte #{report.reportId || report.id}
                        </h3>
                        {getStatusBadge(report.incidentStatus || report.status)}
                        <span className="text-xs text-gray-500">
                          {incidentInfo.area}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Incidencia:</strong> {incidentInfo.description}
                      </p>

                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Descripción del reporte:</strong> {report.description || 'Sin descripción'}
                      </p>

                      <p className="text-gray-600 text-sm mb-2">
                        <strong>Acciones tomadas:</strong> {report.actions || report.acciones || 'No especificadas'}
                      </p>

                      <div className="text-xs text-gray-500 flex space-x-4">
                        <span>Fecha: {new Date(report.registrationDate || report.createdAt).toLocaleDateString()}</span>
                        <span>Incidencia ID: {report.incidentId || 'N/A'}</span>
                        {report.employeeId && (
                          <span>Empleado ID: {report.employeeId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;