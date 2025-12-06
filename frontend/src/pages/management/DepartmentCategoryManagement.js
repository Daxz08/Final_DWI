import React, { useState, useEffect } from 'react';
import { departmentService, categoryService } from '../../services/api';

const DepartmentCategoryManagement = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    floor: '',
    classroom: '',
    tower: ''
  });
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    type: 'Técnico'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, catRes] = await Promise.all([
        departmentService.getAll(),
        categoryService.getAll()
      ]);

      if (deptRes.success) setDepartments(deptRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await departmentService.create(deptForm);
      if (response.success) {
        setShowDeptForm(false);
        setDeptForm({ name: '', code: '', floor: '', classroom: '', tower: '' });
        fetchData();
        alert('Departamento creado exitosamente');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await categoryService.create(catForm);
      if (response.success) {
        setShowCatForm(false);
        setCatForm({ name: '', description: '', type: 'Técnico' });
        fetchData();
        alert('Categoría creada exitosamente');
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('¿Estás seguro de eliminar este departamento?')) {
      try {
        const response = await departmentService.deleteDepartment(departmentId);
        if (response.success) {
          fetchData();
          alert('Departamento eliminado exitosamente');
        } else {
          alert('Error: ' + response.message);
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        const response = await categoryService.deleteCategory(categoryId);
        if (response.success) {
          fetchData();
          alert('Categoría eliminada exitosamente');
        } else {
          alert('Error: ' + response.message);
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-ucv-blue">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'departments'
                ? 'text-ucv-red border-b-2 border-ucv-red'
                : 'text-gray-600 hover:text-ucv-blue'
            }`}
          >
            Departamentos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'categories'
                ? 'text-ucv-red border-b-2 border-ucv-red'
                : 'text-gray-600 hover:text-ucv-blue'
            }`}
          >
            Categorías
          </button>
        </div>

        {/* Departamentos */}
        {activeTab === 'departments' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ucv-blue">Gestión de Departamentos</h2>
              <button
                onClick={() => setShowDeptForm(true)}
                className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                + Nuevo Departamento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => (
                <div key={dept.departmentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-ucv-blue">{dept.name}</h3>
                    <button
                      onClick={() => handleDeleteDepartment(dept.departmentId)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">Código: {dept.code}</p>
                  <p className="text-sm text-gray-600">Piso: {dept.floor} - Aula: {dept.classroom}</p>
                  <p className="text-sm text-gray-600">Torre: {dept.tower}</p>
                </div>
              ))}
            </div>

            {departments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay departamentos registrados
              </div>
            )}
          </div>
        )}

        {/* Categorías */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-ucv-blue">Gestión de Categorías</h2>
              <button
                onClick={() => setShowCatForm(true)}
                className="bg-ucv-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                + Nueva Categoría
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.categoryId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-ucv-blue">{cat.name}</h3>
                    <button
                      onClick={() => handleDeleteCategory(cat.categoryId)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{cat.description}</p>
                  <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mt-2">
                    {cat.type}
                  </span>
                </div>
              ))}
            </div>

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay categorías registradas
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Nuevo Departamento */}
      {showDeptForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">Nuevo Departamento</h3>
            <form onSubmit={handleDeptSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={deptForm.name}
                onChange={(e) => setDeptForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
              />
              <input
                type="text"
                placeholder="Código"
                required
                value={deptForm.code}
                onChange={(e) => setDeptForm(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Piso"
                  required
                  value={deptForm.floor}
                  onChange={(e) => setDeptForm(prev => ({ ...prev, floor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
                <input
                  type="text"
                  placeholder="Aula"
                  required
                  value={deptForm.classroom}
                  onChange={(e) => setDeptForm(prev => ({ ...prev, classroom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                />
              </div>
              <input
                type="text"
                placeholder="Torre"
                required
                value={deptForm.tower}
                onChange={(e) => setDeptForm(prev => ({ ...prev, tower: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowDeptForm(false)}
                  className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Nueva Categoría */}
      {showCatForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-ucv-blue mb-4">Nueva Categoría</h3>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={catForm.name}
                onChange={(e) => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
              />
              <textarea
                placeholder="Descripción"
                required
                value={catForm.description}
                onChange={(e) => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
                rows={3}
              />
              <select
                value={catForm.type}
                onChange={(e) => setCatForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red"
              >
                <option value="Técnico">Técnico</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Otros">Otros</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCatForm(false)}
                  className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentCategoryManagement;