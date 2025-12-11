import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';

// Iconos SVG profesionales
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  UserAdd: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-11.75A8.25 8.25 0 0012 2.25a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" />
    </svg>
  ),
  Student: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
  Teacher: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Support: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
};

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'STUDENT'
  });
  
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    teachers: 0,
    support: 0,
    admins: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    role: 'all'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    calculateStats();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 [UserManagement] Cargando usuarios...');
      const response = await userService.getAll();
      
      if (response.success) {
        setUsers(response.data || []);
        console.log(`✅ [UserManagement] ${response.data?.length} usuarios cargados`);
      } else {
        console.error('❌ [UserManagement] Error:', response.message);
      }
    } catch (error) {
      console.error('❌ [UserManagement] Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.firstName?.toLowerCase().includes(searchTerm) ||
        u.lastName?.toLowerCase().includes(searchTerm) ||
        u.email?.toLowerCase().includes(searchTerm) ||
        u.userId?.toString().includes(searchTerm)
      );
    }

    // Filtro por rol
    if (filters.role !== 'all') {
      filtered = filtered.filter(u => u.role === filters.role);
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const total = users.length;
    const students = users.filter(u => u.role === 'STUDENT').length;
    const teachers = users.filter(u => u.role === 'TEACHER').length;
    const support = users.filter(u => u.role === 'SUPPORT').length;
    const admins = users.filter(u => u.role === 'ADMIN').length;

    setStats({ total, students, teachers, support, admins });
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.update(selectedUser.userId, editForm);
      
      if (response.success) {
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
        alert('✅ Usuario actualizado exitosamente');
      } else {
        alert('❌ Error al actualizar usuario: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('❌ Error al actualizar usuario: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm('¿Estás seguro de que quieres cambiar el rol de este usuario?')) {
      try {
        const response = await userService.changeUserRole(userId, newRole);
        
        if (response.success) {
          fetchUsers();
          alert('✅ Rol actualizado exitosamente');
        } else {
          alert('❌ Error al actualizar rol: ' + response.message);
        }
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('❌ Error al actualizar rol: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        const response = await userService.deleteUser(userId);
        
        if (response.success) {
          fetchUsers();
          alert('✅ Usuario eliminado exitosamente');
        } else {
          alert('❌ Error al eliminar usuario: ' + response.message);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('❌ Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'STUDENT': { 
        color: 'bg-blue-50 text-blue-800 border border-blue-200', 
        text: 'Estudiante',
        icon: <Icons.Student className="w-3 h-3 mr-1" />
      },
      'TEACHER': { 
        color: 'bg-purple-50 text-purple-800 border border-purple-200', 
        text: 'Docente',
        icon: <Icons.Teacher className="w-3 h-3 mr-1" />
      },
      'SUPPORT': { 
        color: 'bg-orange-50 text-orange-800 border border-orange-200', 
        text: 'Soporte',
        icon: <Icons.Support className="w-3 h-3 mr-1" />
      },
      'ADMIN': { 
        color: 'bg-red-50 text-red-800 border border-red-200', 
        text: 'Administrador',
        icon: <Icons.Admin className="w-3 h-3 mr-1" />
      }
    };
    
    const config = roleConfig[role] || roleConfig.STUDENT;
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
        {config.icon}
        {config.text}
      </span>
    );
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: 'all'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ucv-blue"></div>
        <div className="text-ucv-blue text-lg">Cargando usuarios...</div>
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
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 mt-1">
              Administra todos los usuarios del sistema
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="bg-ucv-blue text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center"
          >
            <Icons.Refresh />
            <span className="ml-2">Actualizar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-ucv-blue">
          <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
          <p className="text-xl font-bold text-ucv-blue mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-600">Estudiantes</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{stats.students}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-600">Docentes</p>
          <p className="text-xl font-bold text-purple-600 mt-1">{stats.teachers}</p>
        </div>
      </div>

      {/* Filtros */}
<div className="bg-white rounded-xl shadow-sm p-6">
  <div className="flex flex-col md:flex-row md:items-end gap-4">
    <div className="flex-1">
      <label className="block text-sm font-medium text-ucv-blue mb-1">
        <Icons.Search className="inline w-4 h-4 mr-1" />
        Buscar usuarios
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Nombre, apellido, email o ID..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Icons.Search />
        </div>
      </div>
    </div>
    
    <div className="flex-1">
      <label className="block text-sm font-medium text-ucv-blue mb-1">
        Filtrar por rol
      </label>
      <select
        value={filters.role}
        onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-blue"
      >
        <option value="all">Todos los roles</option>
        <option value="STUDENT">Estudiantes</option>
        <option value="TEACHER">Docentes</option>
        <option value="SUPPORT">Soporte</option>
        <option value="ADMIN">Administradores</option>
      </select>
    </div>
    
    <div className="flex-1">
      <label className="block text-sm font-medium text-ucv-blue mb-1 invisible">
        Acción
      </label>
      <button
        onClick={handleClearFilters}
        className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center"
      >
        <Icons.X className="w-4 h-4 mr-2" />
        Limpiar filtros
      </button>
    </div>
  </div>
  
  <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
    <span>Mostrando {filteredUsers.length} de {stats.total} usuarios</span>
    {(filters.search || filters.role !== 'all') && (
      <button
        onClick={handleClearFilters}
        className="text-ucv-blue hover:text-blue-800 text-sm flex items-center"
      >
        <Icons.X className="w-3 h-3 mr-1" />
        Limpiar filtros
      </button>
    )}
  </div>
</div>
      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Icons.Users className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No se encontraron usuarios</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filters.search || filters.role !== 'all'
                          ? 'Intenta con otros términos de búsqueda'
                          : 'No hay usuarios registrados'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-ucv-blue bg-opacity-10 rounded-full flex items-center justify-center">
                          <span className="text-ucv-blue font-semibold">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {user.userId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">{user.phone || 'Sin teléfono'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Icons.Check className="w-3 h-3 mr-1" />
                        Activo
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-ucv-blue hover:text-blue-800"
                          title="Editar"
                        >
                          <Icons.Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                        >
                          <Icons.Trash className="w-5 h-5" />
                        </button>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ucv-blue"
                          title="Cambiar rol"
                        >
                          <option value="STUDENT">Estudiante</option>
                          <option value="TEACHER">Docente</option>
                          <option value="SUPPORT">Soporte</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-ucv-blue">
                Editar Usuario: {selectedUser?.firstName} {selectedUser?.lastName}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icons.X />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Nombres *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.firstName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Apellidos *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.lastName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Rol *
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="STUDENT">Estudiante</option>
                  <option value="TEACHER">Docente</option>
                  <option value="SUPPORT">Soporte</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <Icons.Check />
                  <span className="ml-2">Actualizar Usuario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;