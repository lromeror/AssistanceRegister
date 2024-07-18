import "./Styles/NewData.css";
import { FileInput, Button } from "flowbite-react";
import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

export default function Newdata() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate(); // Inicializa useNavigate

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
            alert('Archivo subido y procesado correctamente');
            navigate('/Sistem'); // Redirige a la página "/Sistem"
        } catch (error) {
            console.error('Error al subir el archivo frontend', error);
            alert('Error al subir el archivo frontend');
        }
    };

    return (
        <div className="column_center">
            <h1 className="mb-5">NEW DATA</h1>
            <div>
                <FileInput id="large-file-upload" sizing='lg' onChange={handleFileChange} />
            </div>
            <Button onClick={handleSubmit} className="mt-4 !bg-[#4caf50]">Upload</Button>
        </div>
    );
}
