import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, reportService } from '../../services/api';

const StudentReports = () => {
  const { user } = useAuth();
  const [incidentsWithReports, setIncidentsWithReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentReports();
  }, [user]);

  const fetchStudentReports = async () => {
    try {
      console.log('🔍 [StudentReports] Cargando reportes para estudiante:', user.userId);
      setLoading(true);
      setError(null);

      // 🔥 PASO 1: Obtener incidencias del estudiante
      const incidentsResponse = await incidentService.getByUser(user.userId);
      
      if (!incidentsResponse.success) {
        throw new Error(incidentsResponse.message || 'Error al cargar incidencias');
      }

      const allIncidents = incidentsResponse.data || [];
      console.log(`📋 [StudentReports] ${allIncidents.length} incidencias encontradas`);

      // 🔥 PASO 2: Para cada incidencia, obtener su reporte
      const incidentsWithReportsData = [];
      
      for (const incident of allIncidents) {
        try {
          // Verificar si ya trae el reporte en la respuesta
          if (incident.reporte || incident.report) {
            incidentsWithReportsData.push({
              ...incident,
              report: incident.reporte || incident.report
            });
          } else {
            // Intentar obtener el reporte por separado
            const reportResponse = await reportService.getByIncidentId(incident.incidentId);
            
            if (reportResponse.success && reportResponse.data) {
              incidentsWithReportsData.push({
                ...incident,
                report: reportResponse.data
              });
            }
          }
        } catch (err) {
          console.warn(`⚠️ [StudentReports] Error con incidencia ${incident.incidentId}:`, err);
          // Continuar con las demás
        }
      }

      console.log(`✅ [StudentReports] ${incidentsWithReportsData.length} incidencias con reportes`);
      setIncidentsWithReports(incidentsWithReportsData);

    } catch (error) {
      console.error('❌ [StudentReports] Error crítico:', error);
      setError(error.message || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (report) => {
    if (!report) return null;
    
    const status = report.incidentStatus || report.estadoIncidencia;
    
    const statusMap = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Pendiente' },
      'IN_PROGRESS': { color: 'bg-blue-100 text-blue-800', text: 'En Progreso' },
      'RESOLVED': { color: 'bg-green-100 text-green-800', text: 'Resuelto' },
      'UNRESOLVED': { color: 'bg-red-100 text-red-800', text: 'No Resuelto' }
    };

    const statusInfo = statusMap[status] || statusMap.PENDING;
    return <span className={`${statusInfo.color} px-3 py-1 rounded-full text-sm`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando reportes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-ucv-blue mb-6">Mis Reportes</h1>

        {incidentsWithReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay reportes disponibles para tus incidencias</p>
            <p className="text-sm mt-2">
              Los reportes aparecerán aquí cuando el personal de soporte genere un reporte.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {incidentsWithReports.map((item) => (
              <div key={item.incidentId} className="border border-gray-200 rounded-lg p-6 hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ucv-blue mb-2">{item.area}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Fecha incidencia:</span>
                        <span className="ml-2">{formatDate(item.incidentDate)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Estado:</span>
                        <span className="ml-2">{getStatusBadge(item.report)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del reporte */}
                {item.report && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-ucv-blue mb-2">Detalles del Reporte</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2">
                        <strong>Descripción:</strong> {item.report.description || item.report.descripcion}
                      </p>
                      <p className="mb-2">
                        <strong>Acciones tomadas:</strong> {item.report.actions || item.report.acciones}
                      </p>
                      <p className="text-sm text-gray-500">
                        Generado el: {formatDate(item.report.registrationDate || item.report.fechaRegistro)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReports;