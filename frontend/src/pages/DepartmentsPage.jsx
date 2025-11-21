import { useState } from "react";
import DepartmentForm from "../components/department/DepartmentForm";
import DepartmentList from "../components/department/DepartmentList";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


export default function DepartmentsPage() {
    const [departmentEditar, setDepartmentEditar] = useState(null);
    const [recargar, setRecargar] = useState(false);

    // Función que se pasa al formulario para indicar que se guardó un departamento
    const handleGuardado = () => {
        setDepartmentEditar(null); // Limpiar formulario
        setRecargar(prev => !prev); // Cambiar estado para recargar lista
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Gestión de Departamentos
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <DepartmentForm
                departmentEditar={departmentEditar}
                onGuardado={handleGuardado}
            />

            <Divider sx={{ my: 3 }} />

            <DepartmentList
                key={recargar}
                onEditar={(dep) => setDepartmentEditar(dep)}
            />
        </Box>
    );
}