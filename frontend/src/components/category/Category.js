// src/components/Category/Category.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "sonner";
import { MdAddCircle } from "react-icons/md";
import { FaSave } from "react-icons/fa";

import {
  getAllCategories,
  saveCategory,
  updateCategory,
  deleteCategory,
} from "../../services/CategoryService";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    type: "",
    priorityLevel: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      toast.error("Error al cargar las categorías.");
    }
  };

  const clearForm = () => {
    setFormData({
      categoryId: "",
      name: "",
      type: "",
      priorityLevel: "",
      description: "",
    });
    setIsEditing(false);
  };

  const validateForm = () => {
    const { name, type, priorityLevel, description } = formData;
    if (!name || !type || !priorityLevel || !description) {
      toast.error("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && formData.categoryId) {
        await updateCategory(formData.categoryId, formData);
        toast.success("Categoría actualizada correctamente.");
      } else {
        await saveCategory(formData);
        toast.success("Categoría registrada correctamente.");
      }
      clearForm();
      fetchCategories();
    } catch {
      toast.error("Error al guardar la categoría.");
    }
  };

  const handleEdit = (category) => {
    setFormData(category);
    setIsEditing(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      await deleteCategory(categoryId);
      toast.success("Categoría eliminada correctamente.");
      fetchCategories();
      if (formData.categoryId === categoryId) clearForm();
    } catch {
      toast.error("Error al eliminar la categoría.");
    }
  };

  return (
    <div className="container">
      {/* Formulario */}
      <fieldset className="p-3 bg-light rounded border mb-4">
        <legend className="fw-bold">Gestión de Categorías</legend>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label>Nombre</label>
              <input
                className="form-control"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Tipo</label>
              <input
                className="form-control"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label>Nivel de prioridad</label>
              <select
                className="form-select"
                value={formData.priorityLevel}
                onChange={(e) =>
                  setFormData({ ...formData, priorityLevel: e.target.value })
                }
              >
                <option value="">[Seleccionar]</option>
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>

            <div className="col-md-3">
              <label>Descripción</label>
              <input
                className="form-control"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <button type="submit" className="btn btn-primary">
              {isEditing ? (
                <>
                  <FaSave className="me-2" /> Guardar cambios
                </>
              ) : (
                <>
                  <MdAddCircle className="me-2" /> Registrar
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </fieldset>

      {/* Tabla */}
      <h4 className="mb-3 text-center">Lista de Categorías</h4>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Prioridad</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td>{cat.name}</td>
              <td>{cat.type}</td>
              <td>{cat.priorityLevel}</td>
              <td>{cat.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(cat.categoryId)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Category;