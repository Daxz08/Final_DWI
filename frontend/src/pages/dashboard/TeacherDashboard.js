import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incidentService } from '../../services/api';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchIncidents();
  }, [user]);

  const fetchIncidents = async () => {
    try {
      const response = await incidentService.getByUser(user.userId);
      if (response.data.success) {
        const userIncidents = response.data.data;
        setIncidents(userIncidents.slice(0, 5)); // Últimas 5 incidencias
        
        // Calcular estadísticas
        const stats = {
          total: userIncidents.length,
          pending: userIncidents.filter(inc => !inc.employeeId).length,
          inProgress: userIncidents.filter(inc => inc.employeeId && !inc.report).length,
          resolved: userIncidents.filter(inc => inc.report).length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
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
    const priorities = {
      'LOW': { color: 'bg-green-100 text-green-800', text: 'Baja' },
      'MEDIUM': { color: 'bg-yellow-100 text-yellow-800', text: 'Media' },
      'HIGH': { color: 'bg-red-100 text-red-800', text: 'Alta' }
    };
    const priorityInfo = priorities[priority] || priorities.MEDIUM;
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
          Bienvenido, Prof. {user.firstName} 👨‍🏫
        </h1>
        <p className="text-gray-600 mt-1">
          Sistema de Gestión de Incidencias - Universidad César Vallejo
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Incidencias</p>
              <p className="text-2xl font-bold text-ucv-blue mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center">
              <span className="text-ucv-blue text-xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
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
              <span className="text-blue-600 text-xl">🔧</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/teacher/report"
          className="bg-ucv-red hover:bg-red-700 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Reportar Incidencia</h3>
              <p className="text-white text-opacity-90 mt-1">
                Reporta un problema técnico en tu aula
              </p>
            </div>
          </div>
        </Link>

        <Link 
          to="/teacher/incidents"
          className="bg-ucv-blue hover:bg-blue-800 text-white p-6 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Mis Incidencias</h3>
              <p className="text-white text-opacity-90 mt-1">
                Ver el estado de todas mis incidencias
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-ucv-blue">Incidencias Recientes</h2>
          <Link 
            to="/teacher/incidents"
            className="text-ucv-red hover:text-red-700 font-medium"
          >
            Ver todas →
          </Link>
        </div>

        {incidents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay incidencias reportadas</p>
            <Link 
              to="/teacher/report"
              className="text-ucv-red hover:text-red-700 font-medium mt-2 inline-block"
            >
              Reporta tu primera incidencia
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
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
  );
};

export default TeacherDashboard;