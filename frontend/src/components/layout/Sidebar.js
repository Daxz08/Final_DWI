import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getRoleName = (role) => {
    const roles = {
      'STUDENT': 'Estudiante',
      'TEACHER': 'Docente',
      'SUPPORT': 'Personal de Soporte', 
      'ADMIN': 'Administrador'
    };
    return roles[role] || role;
  };

  // ACTUALIZAR studentMenu - línea 25 aproximadamente
  const studentMenu = [
    { name: 'Dashboard', path: '/student', icon: '📊' },
    { name: 'Reportar Incidencia', path: '/student/report', icon: '📝' },
    { name: 'Mis Incidencias', path: '/student/incidents', icon: '📋' },
    { name: 'Reportes', path: '/student/reports', icon: '📄' }, // 🔥 NUEVO
  ];

  const teacherMenu = [
    { name: 'Dashboard', path: '/teacher', icon: '📊' },
    { name: 'Reportar Incidencia', path: '/teacher/report', icon: '📝' },
    { name: 'Mis Incidencias', path: '/teacher/incidents', icon: '📋' },
  ];

  // ACTUALIZAR supportMenu - línea 32 aproximadamente
  const supportMenu = [
    { name: 'Dashboard', path: '/support', icon: '📊' },
    { name: 'Incidencias Asignadas', path: '/support/assigned', icon: '📋' },
    { name: 'Generar Reportes', path: '/support/generate-reports', icon: '📝' }, // 🔥 NUEVO
    { name: 'Mis Reportes', path: '/support/my-reports', icon: '📄' }, // 🔥 NUEVO
    // ELIMINAR "Todas las Incidencias"
  ];

  const adminMenu = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Gestión de Incidencias', path: '/admin/incidents', icon: '📑' },
    { name: 'Gestión de Empleados', path: '/admin/employees', icon: '👥' },
    { name: 'Gestión de Usuarios', path: '/admin/users', icon: '👤' },
    { name: 'Departamentos & Categorías', path: '/admin/departments-categories', icon: '🏷️' },
    { name: 'Reportes', path: '/admin/reports', icon: '📈' },
  ];

  let menu = [];
  switch (user?.role) {
    case 'STUDENT':
      menu = studentMenu;
      break;
    case 'TEACHER':
      menu = teacherMenu;
      break;
    case 'SUPPORT':
      menu = supportMenu;
      break;
    case 'ADMIN':
      menu = adminMenu;
      break;
    default:
      menu = [];
  }

  return (
    <div className="bg-ucv-blue text-ucv-white w-64 min-h-screen py-6 px-4">
      {/* User Info */}
      <div className="mb-8 p-4 bg-ucv-blue bg-opacity-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-ucv-red rounded-full flex items-center justify-center">
            <span className="font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-ucv-white text-opacity-80 text-sm">
              {getRoleName(user?.role)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-ucv-red text-ucv-white shadow-md'
                  : 'text-ucv-white text-opacity-80 hover:bg-ucv-blue hover:bg-opacity-50 hover:text-opacity-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;