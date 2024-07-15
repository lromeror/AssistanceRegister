import "./Styles/NewData.css";
import { FileInput, Label, Button } from "flowbite-react";
import { useState } from "react";
import axios from "axios";

export default function Newdata() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Por favor, selecciona un archivo primero');
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
            alert('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error al subir el archivo', error);
            alert('Error al subir el archivo');
        }
    };

    return (
        <div className="column_center">
            <h2 className="text">NEW DATA</h2>
            <div>
                <FileInput id="single-file-upload" onChange={handleFileChange} />
            </div>
            <Button onClick={handleSubmit} className="mt-4">Upload</Button>
        </div>
    );
}
