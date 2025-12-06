import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
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
        alert('Usuario actualizado exitosamente');
      } else {
        alert('Error al actualizar usuario: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error al actualizar usuario: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await userService.changeUserRole(userId, newRole);
      
      if (response.success) {
        fetchUsers();
        alert('Rol actualizado exitosamente');
      } else {
        alert('Error al actualizar rol: ' + response.message);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error al actualizar rol: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await userService.deleteUser(userId);
        
        if (response.success) {
          fetchUsers();
          alert('Usuario eliminado exitosamente');
        } else {
          alert('Error al eliminar usuario: ' + response.message);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar usuario: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getRoleName = (role) => {
    const roles = {
      'STUDENT': 'Estudiante',
      'TEACHER': 'Docente',
      'SUPPORT': 'Soporte',
      'ADMIN': 'Administrador'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-ucv-blue">Gestión de Usuarios</h1>
          <span className="text-gray-600">{users.length} usuarios</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-ucv-blue">Nombre</th>
                <th className="text-left py-3 text-ucv-blue">Email</th>
                <th className="text-left py-3 text-ucv-blue">Teléfono</th>
                <th className="text-left py-3 text-ucv-blue">Rol</th>
                <th className="text-left py-3 text-ucv-blue">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.userId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.phone || 'No especificado'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      user.role === 'SUPPORT' ? 'bg-orange-100 text-orange-800' :
                      user.role === 'TEACHER' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 border border-blue-300 rounded"
                      >
                        Editar
                      </button>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ucv-red"
                      >
                        <option value="STUDENT">Estudiante</option>
                        <option value="TEACHER">Docente</option>
                        <option value="SUPPORT">Soporte</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 border border-red-300 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay usuarios registrados
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              Editar Usuario: {selectedUser?.firstName} {selectedUser?.lastName}
            </h3>
            
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

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700"
                >
                  Actualizar
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