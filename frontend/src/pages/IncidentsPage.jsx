import { useState } from "react";
import IncidentForm from "../components/incident/IncidentForm";
import IncidentList from "../components/incident/IncidentList";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

export default function IncidentsPage() {
  const [incidentEditar, setIncidentEditar] = useState(null);
  const [recargar, setRecargar] = useState(false);

  const handleGuardado = () => {
    setIncidentEditar(null);
    setRecargar(prev => !prev);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🚨 Gestión de Incidentes
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Reporte y seguimiento de incidentes en la universidad
      </Typography>

      <Divider sx={{ mb: 4 }} />

      {/* Formulario */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <IncidentForm
          incidentEditar={incidentEditar}
          onGuardado={handleGuardado}
        />
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Lista */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Lista de Incidentes Reportados
        </Typography>
        <IncidentList
          key={recargar}
          onEditar={(incident) => setIncidentEditar(incident)}
        />
      </Box>
    </Box>
  );
}