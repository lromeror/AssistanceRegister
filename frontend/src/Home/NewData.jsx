import "./Styles/NewData.css";
import { FileInput, Button } from "flowbite-react";
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
            <h1 className="mb-5">NEW DATA</h1>
            <div>
                <FileInput id="large-file-upload" sizing='lg'/>
            </div>
            <Button onClick={handleSubmit} className="mt-4 !bg-[#4caf50]" >Upload</Button>
        </div>
    );
}
