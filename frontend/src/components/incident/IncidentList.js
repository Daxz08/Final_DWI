import { useEffect, useState } from "react";
import { getAllIncidents, deleteIncident } from "../../services/incidentService";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Chip, Box, Typography, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Warning, CheckCircle, Info } from '@mui/icons-material';

export default function IncidentList({ onEditar }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterPriority, setFilterPriority] = useState("Todos");

  const cargarIncidentes = async () => {
    try {
      setLoading(true);
      const data = await getAllIncidents();
      setIncidents(data);
    } catch (err) {
      setError("Error al cargar los incidentes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIncidentes();
  }, []);

  const handleEliminar = async (id, area) => {
    if (!window.confirm(`¿Está seguro de eliminar el incidente del área: ${area}?`)) return;
    try {
      await deleteIncident(id);
      await cargarIncidentes();
    } catch (err) {
      alert("Error al eliminar el incidente: " + err.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alto': return 'error';
      case 'Medio': return 'warning';
      case 'Bajo': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Alto': return <Warning />;
      case 'Medio': return <Info />;
      case 'Bajo': return <CheckCircle />;
      default: return <Info />;
    }
  };

  // Filtramos los incidentes según el nivel de prioridad
  const filteredIncidents = incidents.filter(incident =>
    filterPriority === "Todos" || incident.priorityLevel === filterPriority
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando incidentes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (filteredIncidents.length === 0) {
    return (
      <Alert severity="info">
        No hay incidentes registrados con el nivel de prioridad seleccionado.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filtro de prioridad */}
      <FormControl sx={{ mb: 2, minWidth: 150 }}>
        <InputLabel id="filter-priority-label">Prioridad</InputLabel>
        <Select
          labelId="filter-priority-label"
          value={filterPriority}
          label="Prioridad"
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Alto">Alto</MenuItem>
          <MenuItem value="Medio">Medio</MenuItem>
          <MenuItem value="Bajo">Bajo</MenuItem>
        </Select>
      </FormControl>

      {/* Tabla de incidentes */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de incidentes">
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Área</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prioridad</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIncidents.map((incident) => (
              <TableRow key={incident.incidentId} hover>
                <TableCell>{incident.incidentId}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {incident.area}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 300 }}>
                    {incident.description.length > 100 
  ? `${incident.description.substring(0, 100)}...` 
  : incident.description
}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(incident.incidentDate).toLocaleDateString('es-PE')}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getPriorityIcon(incident.priorityLevel)}
                    label={incident.priorityLevel}
                    color={getPriorityColor(incident.priorityLevel)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{incident.registeredUser}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEditar(incident)}
                      title="Editar incidente"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminar(incident.incidentId, incident.area)}
                      title="Eliminar incidente"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}