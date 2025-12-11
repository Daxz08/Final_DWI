import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const getRoleName = (role) => {
    const roles = {
      'STUDENT': 'Estudiante',
      'TEACHER': 'Docente', 
      'SUPPORT': 'Soporte',
      'ADMIN': 'Administrador'
    };
    return roles[role] || role;
  };

  return (
<header className="bg-ucv-blue text-ucv-white shadow-lg">
  <div className="flex justify-between items-center px-6 py-4">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        {/* Logo en lugar del texto UCV */}
        <div className="w-15 h-15 bg-ucv rounded-full flex items-center justify-center overflow-hidden">
          <img
            src="/logo-ucv.png"   // ruta de tu logo
            alt="Logo UCV"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold">Sistema de Incidencias</h1>
          <p className="text-ucv-white text-opacity-80 text-sm">
            Universidad César Vallejo
          </p>
        </div>
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
        <p className="text-ucv-white text-opacity-80 text-sm">
          {getRoleName(user?.role)}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-ucv-red hover:bg-red-700 text-ucv-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        Cerrar Sesión
      </button>
    </div>
  </div>
</header>
  );
};

export default Header;