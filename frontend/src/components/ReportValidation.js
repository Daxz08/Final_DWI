import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';

const ReportValidation = ({ incidentId, onValidationChange }) => {
  const [hasReport, setHasReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    checkReportStatus();
  }, [incidentId]);

  const checkReportStatus = async () => {
    try {
      setLoading(true);
      
      // Verificar si ya tiene reporte
      const hasReportResponse = await reportService.hasReportForIncident(incidentId);
      
      if (hasReportResponse.success) {
        setHasReport(hasReportResponse.data);
        
        // Si tiene reporte, obtener detalles
        if (hasReportResponse.data) {
          const reportResponse = await reportService.getByIncidentId(incidentId);
          if (reportResponse.success) {
            setReportDetails(reportResponse.data);
          }
        }
      }
      
      // Notificar al componente padre
      if (onValidationChange) {
        onValidationChange(hasReportResponse.data, reportDetails);
      }
      
    } catch (error) {
      console.error('❌ [ReportValidation] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = () => {
    if (!reportDetails) return null;
    
    const status = reportDetails.incidentStatus || reportDetails.estadoIncidencia;
    
    if (status === 'RESOLVED' || status === 'resuelto') {
      return {
        message: '✅ Esta incidencia ya fue resuelta',
        canCreateNew: false,
        color: 'text-green-600'
      };
    } else if (status === 'UNRESOLVED' || status === 'no_resuelto') {
      return {
        message: '❌ Esta incidencia no pudo ser resuelta',
        canCreateNew: false,
        color: 'text-red-600'
      };
    } else if (hasReport) {
      return {
        message: '⚠️ Esta incidencia ya tiene un reporte en progreso',
        canCreateNew: false,
        color: 'text-yellow-600'
      };
    }
    
    return {
      message: '📝 Puedes generar un reporte para esta incidencia',
      canCreateNew: true,
      color: 'text-blue-600'
    };
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Verificando estado del reporte...
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-lg border ${hasReport ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className={`font-medium ${statusInfo?.color}`}>
        {statusInfo?.message}
      </div>
      
      {reportDetails && (
        <div className="mt-2 text-sm text-gray-600">
          <p><strong>Último reporte:</strong> {reportDetails.description?.substring(0, 50)}...</p>
          <p><strong>Estado:</strong> {reportDetails.incidentStatus || reportDetails.estadoIncidencia}</p>
          <p><strong>Fecha:</strong> {new Date(reportDetails.registrationDate || reportDetails.fechaRegistro).toLocaleDateString()}</p>
        </div>
      )}
      
      <button
        onClick={checkReportStatus}
        className="mt-2 text-sm text-ucv-blue hover:text-ucv-red"
      >
        Actualizar verificación
      </button>
    </div>
  );
};

export default ReportValidation;