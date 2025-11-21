import { useEffect, useState } from "react";
import { saveDepartment, updateDepartment } from "../../services/departmentServices.js";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const vacio = {
    name: "",
    code: "",
    classroom: "",
    floor: "",
    tower: "",
    registeredUser: ""
};

export default function DepartmentForm({ departmentEditar, onGuardado }) {
    const [department, setDepartment] = useState(vacio);

    useEffect(() => {
        if (departmentEditar) setDepartment(departmentEditar);
        else setDepartment(vacio);
    }, [departmentEditar]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setDepartment(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const esEdicion = !!department.departmentId;
        try {
            if (esEdicion) {
                await updateDepartment(department.departmentId, department);
                alert("Departamento actualizado");
            } else {
                await saveDepartment(department);
                alert("Departamento registrado");
            }
            setDepartment(vacio);
            onGuardado?.();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack direction="row" spacing={2}>
                <h3>{department.departmentId ? "Editar" : "Registrar"} Departamento</h3>
                <TextField name="name" value={department.name} onChange={onChange} placeholder="Nombre" />
                <TextField name="code" value={department.code} onChange={onChange} placeholder="Código" />
                <TextField name="classroom" value={department.classroom} onChange={onChange} placeholder="Aula" />
                <TextField name="floor" value={department.floor} onChange={onChange} placeholder="Piso" />
                <TextField name="tower" value={department.tower} onChange={onChange} placeholder="Torre" />
                <TextField name="registeredUser" value={department.registeredUser} onChange={onChange} placeholder="Usuario que registra" />
                <Button variant="contained" endIcon={<SendIcon />} type="submit">
                    {department.departmentId ? "Actualizar" : "Registrar"}
                </Button>
            </Stack>
        </form>
    );
}