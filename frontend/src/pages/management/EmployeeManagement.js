import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { employeeService, categoryService } from '../../services/api';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: 'password123',
    specialty: '',
    hireDate: new Date().toISOString().split('T')[0],
    role: 'SUPPORT'
  });

  useEffect(() => {
    fetchEmployees();
    fetchCategories();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('🔍 [EmployeeManagement] Cargando empleados...');
      const response = await employeeService.getAll();
      
      if (response.success) {
        setEmployees(response.data || []);
        console.log(`✅ [EmployeeManagement] ${response.data?.length} empleados cargados`);
      } else {
        console.error('❌ [EmployeeManagement] Error:', response.message);
      }
    } catch (error) {
      console.error('❌ [EmployeeManagement] Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔍 [EmployeeManagement] Cargando categorías...');
      const response = await categoryService.getAll();
      
      if (response.success) {
        setCategories(response.data || []);
        console.log(`✅ [EmployeeManagement] ${response.data?.length} categorías cargadas`);
      } else {
        console.error('❌ [EmployeeManagement] Error en categorías:', response.message);
      }
    } catch (error) {
      console.error('❌ [EmployeeManagement] Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📤 [EmployeeManagement] Datos del formulario:', formData);
      
      // 🔥 CORRECCIÓN: Enviar passwordHash en lugar de password
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        passwordHash: formData.password, // 🔥 CAMBIO AQUÍ
        specialty: formData.specialty,
        hireDate: formData.hireDate,
        role: formData.role
      };

      console.log('🚀 [EmployeeManagement] Enviando datos:', employeeData);
      
      const response = await employeeService.create(employeeData);
      
      console.log('📥 [EmployeeManagement] Respuesta del backend:', response);
      
      if (response.success) {
        setShowForm(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: 'password123',
          specialty: '',
          hireDate: new Date().toISOString().split('T')[0],
          role: 'SUPPORT'
        });
        fetchEmployees();
        alert('Empleado creado exitosamente');
      } else {
        alert('Error al crear empleado: ' + response.message);
      }
    } catch (error) {
      console.error('❌ [EmployeeManagement] Error creando empleado:', error);
      alert('Error al crear empleado: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getRoleName = (role) => {
    const roles = {
      'ADMIN': 'Administrador',
      'SUPPORT': 'Soporte Técnico'
    };
    return roles[role] || role;
  };

  const getStatusBadge = (employee) => {
    return employee.availabilityStatus === 'AVAILABLE' 
      ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Disponible</span>
      : <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Ocupado</span>;
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        const response = await employeeService.deleteEmployee(employeeId);
        if (response.success) {
          fetchEmployees();
          alert('Empleado eliminado exitosamente');
        } else {
          alert('Error al eliminar empleado: ' + response.message);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error al eliminar empleado: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-ucv-blue">Gestión de Empleados</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            + Nuevo Empleado
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-ucv-blue">Nombre</th>
                <th className="text-left py-3 text-ucv-blue">Email</th>
                <th className="text-left py-3 text-ucv-blue">Especialidad</th>
                <th className="text-left py-3 text-ucv-blue">Rol</th>
                <th className="text-left py-3 text-ucv-blue">Estado</th>
                <th className="text-left py-3 text-ucv-blue">Incidencias Activas</th>
                <th className="text-left py-3 text-ucv-blue">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.employeeId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="py-3">{employee.email}</td>
                  <td className="py-3">{employee.specialty}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      employee.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleName(employee.role)}
                    </span>
                  </td>
                  <td className="py-3">{getStatusBadge(employee)}</td>
                  <td className="py-3 text-center">{employee.activeIncidents || 0}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(employee.employeeId)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay empleados registrados
          </div>
        )}
      </div>

      {/* Modal de Nuevo Empleado */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">
              Nuevo Empleado
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ucv-blue mb-1">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ucv-blue mb-1">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Contraseña *
                </label>
                <input
                  type="text"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                  placeholder="password123"
                />
                <p className="text-xs text-gray-500 mt-1">Contraseña por defecto: "password123"</p>
              </div>

              {/* 🔥 SELECTOR DINÁMICO DE ESPECIALIDAD */}
              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Especialidad *
                </label>
                <select
                  name="specialty"
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="">Seleccionar especialidad</option>
                  {categories.map(cat => (
                    <option key={cat.categoryId} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {categories.length} categorías disponibles
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Rol *
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                >
                  <option value="SUPPORT">Soporte Técnico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ucv-blue mb-1">
                  Fecha de Contratación *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  required
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700"
                >
                  Crear Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;