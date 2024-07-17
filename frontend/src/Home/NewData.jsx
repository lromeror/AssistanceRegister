import "./Styles/NewData.css";
import { FileInput, Button } from "flowbite-react";
import axios from "axios";
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import ColumnDropdown from './ColumnDropdown'; // Importa el nuevo componente

const options = [
    'Nombre',
    'Apellido',
    'Telefono_movil',
    'Correo_electronico',
    'Ocupacion',
    'Carrera',
    'Universidad',
    'Organizacion',
    'Trabajo',
    'Asistencia',
    'Comida'
];

export default function Newdata() {
    const [file, setFile] = useState(null);
    const [columns, setColumns] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Por favor, selecciona un archivo primero');
            return;
        } else if (!file.name.endsWith('.csv')) {
            alert('Solo se permiten archivos .csv');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setColumns(Object.keys(response.data.rows[0]) || []);

        } catch (error) {
            console.error('Error al subir el archivo', error);
            alert('Error al subir el archivo');
        }
    };

    return (
        <div className="column_center">
            <h1 className="mb-5">NEW DATA</h1>
            <div>
                <FileInput id="large-file-upload" sizing='lg' onChange={handleFileChange} />
            </div>
            <Button onClick={handleSubmit} className="mt-4 !bg-[#4caf50]">Upload</Button>
            {columns.length > 0 && (
                <div>
                    <h1>COLUMNAS DATASET</h1>
                    <Grid container spacing={2}>
                        {columns.map((column, index) => (
                            <ColumnDropdown key={index} column={column} options={options} />
                        ))}
                    </Grid>
                </div>
            )}
        </div>
    );
}
