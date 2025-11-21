import { useEffect, useState } from "react";
import { getAllDepartments, deleteDepartment } from "../../services/departmentServices.js";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function DepartmentList({ onEditar }) {
    const [departments, setDepartments] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const cargar = async () => {
        try {
            setCargando(true);
            const data = await getAllDepartments();
            setDepartments(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const eliminar = async (id) => {
        try {
            await deleteDepartment(id);
            await cargar();
        } catch (e) {
            alert(e.message);
        }
    };

    if (cargando) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Grid container spacing={2}>
            {departments.map((d) => (
                <Grid item key={d.departmentId} xs={12} sm={6} md={4}>
                    <Card variant="outlined" sx={{ width: '100%' }}>
                        <Box sx={{ p: 2 }}>
                            <Typography gutterBottom variant="h5">{d.name}</Typography>
                            <Typography variant="body2">Código: {d.code}</Typography>
                            <Typography variant="body2">Aula: {d.classroom}</Typography>
                            <Typography variant="body2">Piso: {d.floor}</Typography>
                            <Typography variant="body2">Torre: {d.tower}</Typography>
                            <Typography variant="body2">Registrado por: {d.registeredUser}</Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2 }}>
                            <Stack spacing={2} direction="row">
                                <Button variant="contained" onClick={() => onEditar(d)}>Editar</Button>
                                <Button variant="outlined" onClick={() => eliminar(d.departmentId)}>Eliminar</Button>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}