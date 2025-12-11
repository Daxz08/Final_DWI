import React, { useState, useEffect } from 'react';
import { reportService, incidentService, employeeService } from '../../services/api';

// Iconos SVG profesionales
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Report: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.801 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.801 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    unresolved: 0,
    last30Days: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
    employeeId: 'all'
  });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchAllReports();
    fetchEmployees();
  }, []);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      console.log('🔍 [AdminReports] Cargando todos los reportes...');
      const response = await reportService.getAll();
      
      if (response.success) {
        const reportsData = response.data || [];
        setReports(reportsData);
        
        // Calcular estadísticas
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const statsData = {
          total: reportsData.length,
          pending: reportsData.filter(r => 
            r.incidentStatus === 'PENDING' || r.estadoIncidencia === 'pendiente'
          ).length,
          inProgress: reportsData.filter(r => 
            r.incidentStatus === 'IN_PROGRESS' || r.estadoIncidencia === 'en_progreso'
          ).length,
          resolved: reportsData.filter(r => 
            r.incidentStatus === 'RESOLVED' || r.estadoIncidencia === 'resuelto'
          ).length,
          unresolved: reportsData.filter(r => 
            r.incidentStatus === 'UNRESOLVED' || r.estadoIncidencia === 'no_resuelto'
          ).length,
          last30Days: reportsData.filter(r => {
            const reportDate = new Date(r.registrationDate || r.fechaRegistro);
            return reportDate >= thirtyDaysAgo;
          }).length
        };
        
        setStats(statsData);
        console.log(`✅ [AdminReports] ${reportsData.length} reportes cargados`);
      } else {
        console.error('❌ [AdminReports] Error:', response.message);
      }
    } catch (error) {
      console.error('❌ [AdminReports] Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.success) {
        setEmployees(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const filteredReports = reports.filter(report => {
    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        report.reportId?.toString().includes(searchTerm) ||
        report.incidentId?.toString().includes(searchTerm) ||
        report.description?.toLowerCase().includes(searchTerm) ||
        report.employeeId?.toString().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Filtro por estado
    if (filters.status !== 'all') {
      const status = report.incidentStatus || report.estadoIncidencia;
      if (status !== filters.status) {
        return false;
      }
    }
    
    // Filtro por fecha
    if (filters.startDate) {
      const reportDate = new Date(report.registrationDate || report.fechaRegistro);
      const startDate = new Date(filters.startDate);
      if (reportDate < startDate) return false;
    }
    
    if (filters.endDate) {
      const reportDate = new Date(report.registrationDate || report.fechaRegistro);
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999); // Incluir todo el día
      if (reportDate > endDate) return false;
    }
    
    // Filtro por empleado
    if (filters.employeeId !== 'all' && report.employeeId !== parseInt(filters.employeeId)) {
      return false;
    }
    
    return true;
  });

  const getStatusBadge = (report) => {
    const status = report.incidentStatus || report.estadoIncidencia;
    
    const statusMap = {
      'PENDING': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'pendiente': { 
        color: 'bg-yellow-50 text-yellow-800 border border-yellow-200', 
        text: 'Pendiente',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'IN_PROGRESS': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'en_progreso': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'En Progreso',
        icon: <Icons.Clock className="w-3 h-3 mr-1" />
      },
      'RESOLVED': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelto',
        icon: <Icons.Check className="w-3 h-3 mr-1" />
      },
      'resuelto': { 
        color: 'bg-green-50 text-green-800 border border-green-200', 
        text: 'Resuelto',
        icon: <Icons.Check className="w-3 h-3 mr-1" />
      },
      'UNRESOLVED': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelto',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      },
      'no_resuelto': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'No Resuelto',
        icon: <Icons.Exclamation className="w-3 h-3 mr-1" />
      }
    };
    
    const statusInfo = statusMap[status] || statusMap.PENDING;
    return (
      <span className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {statusInfo.icon}
        {statusInfo.text}
      </span>
    );
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : `ID: ${employeeId}`;
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      startDate: '',
      endDate: '',
      employeeId: 'all'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue"></div>
        <div className="text-ucv-blue text-lg">Cargando reportes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-ucv-blue">
              Reportes del Sistema
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión y análisis de todos los reportes generados
            </p>
          </div>
          <button
            onClick={fetchAllReports}
            className="bg-ucv-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
          >
            <Icons.Refresh />
            <span className="ml-2">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <p className="text-sm font-medium text-gray-600">Total Reportes</p>
          <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-600">Pendientes</p>
          <p className="text-xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">En Progreso</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-600">Resueltos</p>
          <p className="text-xl font-bold text-green-600 mt-1">{stats.resolved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-600">No Resueltos</p>
          <p className="text-xl font-bold text-red-600 mt-1">{stats.unresolved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-600">Últimos 30 días</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{stats.last30Days}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-ucv-blue mb-1">
              <Icons.Search className="inline w-4 h-4 mr-1" />
              Buscar
            </label>
            <input
              type="text"
              placeholder="ID, descripción, empleado..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ucv-blue mb-1">
              <Icons.Filter className="inline w-4 h-4 mr-1" />
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="RESOLVED">Resuelto</option>
              <option value="UNRESOLVED">No Resuelto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ucv-blue mb-1">
              <Icons.User className="inline w-4 h-4 mr-1" />
              Empleado
            </label>
            <select
              value={filters.employeeId}
              onChange={(e) => setFilters(prev => ({ ...prev, employeeId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
            >
              <option value="all">Todos los empleados</option>
              {employees.map(employee => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ucv-blue mb-1">
              <Icons.Calendar className="inline w-4 h-4 mr-1" />
              Desde
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ucv-blue mb-1">
              <Icons.Calendar className="inline w-4 h-4 mr-1" />
              Hasta
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Mostrando {filteredReports.length} de {reports.length} reportes
          </div>
          <button
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-gray-800 text-sm flex items-center"
          >
            <Icons.X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de Reportes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incidencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Icons.Report className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No se encontraron reportes</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filters.search || filters.status !== 'all' || filters.startDate || filters.endDate || filters.employeeId !== 'all'
                          ? 'Intenta con otros filtros'
                          : 'No hay reportes registrados'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-ucv-blue">
                          #{report.reportId}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {report.reportId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{report.incidentId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2">
                          {report.description || report.descripcion || 'Sin descripción'}
                        </p>
                        {report.actions && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {report.actions}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(report)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Icons.User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {getEmployeeName(report.employeeId)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {report.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>
                          {new Date(report.registrationDate || report.fechaRegistro).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(report.registrationDate || report.fechaRegistro).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;