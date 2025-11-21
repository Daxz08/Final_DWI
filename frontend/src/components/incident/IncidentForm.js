import { useEffect, useState } from "react";
import { saveIncident, updateIncident } from "../../services/incidentService";
import { getAllCategories } from "../../services/CategoryService";
import { getAllDepartments } from "../../services/departmentServices";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { Typography, Grid } from '@mui/material';

const vacio = {
  area: "",
  description: "",
  incidentDate: new Date().toISOString().split('T')[0],
  priorityLevel: "",
  registeredUser: "",
  categoryId: "",
  departmentId: "",
  userId: 1
};

export default function IncidentForm({ incidentEditar, onGuardado }) {
  const [incident, setIncident] = useState(vacio);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (incidentEditar) {
      setIncident({
        ...incidentEditar,
        incidentDate: incidentEditar.incidentDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setIncident(vacio);
    }
  }, [incidentEditar]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [cats, deps] = await Promise.all([
        getAllCategories(),
        getAllDepartments()
      ]);
      setCategories(cats);
      setDepartments(deps);
    } catch (err) {
      console.error("Error cargando datos:", err);
      alert("Error cargando categorías y departamentos");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setIncident(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones
    if (!incident.area || !incident.description || !incident.categoryId || !incident.departmentId) {
      alert("Por favor complete todos los campos obligatorios");
      setLoading(false);
      return;
    }

    try {
      const incidentData = {
        ...incident,
        registeredUser: incident.registeredUser || "Usuario Actual", // Temporal
        userId: incident.userId || 1 // Temporal
      };

      if (incident.incidentId) {
        await updateIncident(incident.incidentId, incidentData);
        alert("Incidente actualizado correctamente");
      } else {
        await saveIncident(incidentData);
        alert("Incidente registrado correctamente");
      }
      
      setIncident(vacio);
      onGuardado?.();
    } catch (err) {
      console.error("Error guardando incidente:", err);
      alert("Error al guardar el incidente: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h5">
          {incident.incidentId ? "Editar Incidente" : "Registrar Nuevo Incidente"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="area"
              label="Área *"
              value={incident.area}
              onChange={onChange}
              required
              placeholder="Ej: Biblioteca, Laboratorio, Aula A101"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Nivel de Prioridad</InputLabel>
              <Select
                name="priorityLevel"
                value={incident.priorityLevel}
                onChange={onChange}
                label="Nivel de Prioridad"
              >
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                <MenuItem value="Alto">Alto</MenuItem>
                <MenuItem value="Medio">Medio</MenuItem>
                <MenuItem value="Bajo">Bajo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="incidentDate"
              label="Fecha del Incidente"
              type="date"
              value={incident.incidentDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="registeredUser"
              label="Usuario que Registra"
              value={incident.registeredUser}
              onChange={onChange}
              placeholder="Nombre del usuario que reporta"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Categoría *</InputLabel>
              <Select
                name="categoryId"
                value={incident.categoryId}
                onChange={onChange}
                label="Categoría *"
              >
                <MenuItem value=""><em>Seleccionar categoría</em></MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.categoryId} value={cat.categoryId}>
                    {cat.name} - {cat.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Departamento *</InputLabel>
              <Select
                name="departmentId"
                value={incident.departmentId}
                onChange={onChange}
                label="Departamento *"
              >
                <MenuItem value=""><em>Seleccionar departamento</em></MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept.departmentId} value={dept.departmentId}>
                    {dept.name} - {dept.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="description"
              label="Descripción del Incidente *"
              value={incident.description}
              onChange={onChange}
              required
              multiline
              rows={4}
              placeholder="Describa el incidente en detalle..."
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {incident.incidentId && (
            <Button 
              variant="outlined" 
              onClick={() => {
                setIncident(vacio);
                onGuardado?.();
              }}
            >
              Cancelar
            </Button>
          )}
          <Button 
            variant="contained" 
            type="submit" 
            disabled={loading}
            startIcon={<SendIcon />}
          >
            {loading ? "Guardando..." : (incident.incidentId ? "Actualizar" : "Registrar")}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}