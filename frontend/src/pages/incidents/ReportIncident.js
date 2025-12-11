import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { incidentService, categoryService, departmentService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ReportIncident = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    area: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    categoryId: '',
    departmentId: ''
  });

  useEffect(() => {
    fetchFormData();
  }, []);

const fetchFormData = async () => {
  try {
    console.log('🔍 [ReportIncident] Cargando datos del formulario...');

    const [categoriesRes, departmentsRes] = await Promise.all([
      categoryService.getAll(),
      departmentService.getAll()
    ]);

    console.log('📥 [ReportIncident] Respuestas:', {
      categories: categoriesRes,
      departments: departmentsRes
    });

    // 🔥 USAR processApiResponse que ya está en los servicios
    if (categoriesRes.success) {
      setCategories(categoriesRes.data || []);
      console.log(`✅ [ReportIncident] ${categoriesRes.data?.length} categorías cargadas`);
    } else {
      console.error('❌ [ReportIncident] Error en categorías:', categoriesRes.message);
      alert('Error al cargar categorías: ' + categoriesRes.message);
    }

    if (departmentsRes.success) {
      setDepartments(departmentsRes.data || []);
      console.log(`✅ [ReportIncident] ${departmentsRes.data?.length} departamentos cargados`);
    } else {
      console.error('❌ [ReportIncident] Error en departamentos:', departmentsRes.message);
      alert('Error al cargar departamentos: ' + departmentsRes.message);
    }

  } catch (error) {
    console.error('❌ [ReportIncident] Error inesperado:', error);
    alert('Error al cargar datos del formulario');
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // CORREGIR handleSubmit - línea 91 aproximadamente
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // 🔥 VERIFICAR que todos los campos requeridos estén presentes
    const incidentData = {
      area: formData.area,
      description: formData.description,
      incidentDate: formData.incidentDate,
      userId: user.userId || user.id,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
      // NO enviar priorityLevel - lo asigna el admin después
    };

    console.log('📤 DATOS A ENVIAR (VERIFICADOS):', incidentData);

    const response = await incidentService.create(incidentData);
    
    if (response.success) {
      alert('✅ Incidencia reportada exitosamente');
      navigate('/student'); // Redirigir al dashboard del estudiante
    } else {
      // 🔥 MEJOR MANEJO DE ERRORES
      console.error('❌ Error del servidor:', response);
      
      if (response.data && typeof response.data === 'object') {
        // Mostrar errores de validación específicos
        const errors = Object.values(response.data).join(', ');
        alert(`❌ Error de validación: ${errors}`);
      } else {
        alert(`❌ Error: ${response.message}`);
      }
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
    alert('❌ Error de conexión con el servidor');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-ucv-blue mb-6">Reportar Incidencia</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-ucv-blue mb-1">
              Área / Equipo Afectado *
            </label>
            <input
              type="text"
              id="area"
              name="area"
              required
              value={formData.area}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red focus:border-transparent"
              placeholder="Ej: Computadora del aula A-301, Proyector, etc."
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ucv-blue mb-1">
              Descripción Detallada *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red focus:border-transparent"
              placeholder="Describe el problema en detalle..."
            />
          </div>

          <div>
            <label htmlFor="incidentDate" className="block text-sm font-medium text-ucv-blue mb-1">
              Fecha de la Incidencia *
            </label>
            <input
              type="date"
              id="incidentDate"
              name="incidentDate"
              required
              value={formData.incidentDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-ucv-blue mb-1">
              Categoría *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red focus:border-transparent"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-ucv-blue mb-1">
              Departamento / Ubicación *
            </label>
            <select
              id="departmentId"
              name="departmentId"
              required
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ucv-red focus:border-transparent"
            >
              <option value="">Selecciona un departamento</option>
              {departments.map(dept => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.name} - {dept.classroom} (Piso {dept.floor})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-ucv-blue border border-ucv-blue rounded-lg hover:bg-ucv-blue hover:text-white transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-ucv-red text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Reportando...' : 'Reportar Incidencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIncident;