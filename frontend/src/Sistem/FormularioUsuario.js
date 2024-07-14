import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import axios from './axiosConfig'
import './FormularioUsuario.css'; // Asegúrate de importar el archivo CSS

const FormularioUsuario = ({ selectedUser, fetchData, onClear }) => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    telefono_movil: '',
    correo_electronico: '',
    ocupacion: '',
    asistencia: false,
    comida: false,
    carrera: '',
    universidad: '',
    organizacion: '',
    trabajo: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedUser) {
      setUsuario({
        nombre: selectedUser.nombre,
        apellido: selectedUser.apellido,
        telefono_movil: selectedUser.telefono_movil,
        correo_electronico: selectedUser.correo_electronico,
        ocupacion: selectedUser.ocupacion,
        asistencia: Boolean(selectedUser.asistencia),
        comida: Boolean(selectedUser.comida),
        carrera: selectedUser.carrera || '',
        universidad: selectedUser.universidad || '',
        organizacion: selectedUser.organizacion || '',
        trabajo: selectedUser.trabajo || ''
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario({
      ...usuario,
      [name]: type === 'checkbox' ? Boolean(checked) : value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.nombre = usuario.nombre ? "" : "Este campo es obligatorio.";
    tempErrors.apellido = usuario.apellido ? "" : "Este campo es obligatorio.";
    tempErrors.telefono_movil = usuario.telefono_movil ? "" : "Este campo es obligatorio.";
    tempErrors.correo_electronico = usuario.correo_electronico ? "" : "Este campo es obligatorio.";
    tempErrors.ocupacion = usuario.ocupacion ? "" : "Este campo es obligatorio.";

    if (usuario.ocupacion === 'estudiante') {
      tempErrors.carrera = usuario.carrera ? "" : "Este campo es obligatorio.";
      tempErrors.universidad = usuario.universidad ? "" : "Este campo es obligatorio.";
    }

    if (usuario.ocupacion === 'profesional') {
      tempErrors.organizacion = usuario.organizacion ? "" : "Este campo es obligatorio.";
      tempErrors.trabajo = usuario.trabajo ? "" : "Este campo es obligatorio.";
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      if (selectedUser) {
        await axios.put(`/api/personas/${selectedUser.id_persona}`, usuario);
      } else {
        await axios.post('/api/personas', usuario);
      }
      fetchData();
      handleClear(); // Limpiar el formulario después de enviar
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await axios.delete(`/api/personas/${selectedUser.id_persona}`);
      fetchData();
      handleClear(); // Limpiar el formulario después de eliminar
    }
  };

  const handleClear = () => {
    setUsuario({
      nombre: '',
      apellido: '',
      telefono_movil: '',
      correo_electronico: '',
      ocupacion: '',
      asistencia: false,
      comida: false,
      carrera: '',
      universidad: '',
      organizacion: '',
      trabajo: ''
    });
    onClear(); // Llama a la función para deseleccionar la fila
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Información del Usuario</h2>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="nombre"
            label="Nombre"
            fullWidth
            value={usuario.nombre}
            onChange={handleChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="apellido"
            label="Apellido"
            fullWidth
            value={usuario.apellido}
            onChange={handleChange}
            error={!!errors.apellido}
            helperText={errors.apellido}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="telefono_movil"
            label="Teléfono Móvil"
            fullWidth
            value={usuario.telefono_movil}
            onChange={handleChange}
            error={!!errors.telefono_movil}
            helperText={errors.telefono_movil}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="correo_electronico"
            label="Correo Electrónico"
            fullWidth
            value={usuario.correo_electronico}
            onChange={handleChange}
            error={!!errors.correo_electronico}
            helperText={errors.correo_electronico}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="ocupacion"
            label="Ocupación"
            select
            fullWidth
            value={usuario.ocupacion}
            onChange={handleChange}
            error={!!errors.ocupacion}
            helperText={errors.ocupacion}
          >
            <MenuItem value="">
              <em>Select...</em>
            </MenuItem>
            <MenuItem value="estudiante">Estudiante</MenuItem>
            <MenuItem value="profesional">Profesional</MenuItem>
          </TextField>
        </Grid>
        {usuario.ocupacion === 'estudiante' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                name="carrera"
                label="Carrera"
                fullWidth
                value={usuario.carrera}
                onChange={handleChange}
                error={!!errors.carrera}
                helperText={errors.carrera}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="universidad"
                label="Universidad"
                fullWidth
                value={usuario.universidad}
                onChange={handleChange}
                error={!!errors.universidad}
                helperText={errors.universidad}
              />
            </Grid>
          </>
        )}
        {usuario.ocupacion === 'profesional' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                name="organizacion"
                label="Organización"
                fullWidth
                value={usuario.organizacion}
                onChange={handleChange}
                error={!!errors.organizacion}
                helperText={errors.organizacion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="trabajo"
                label="Trabajo"
                fullWidth
                value={usuario.trabajo}
                onChange={handleChange}
                error={!!errors.trabajo}
                helperText={errors.trabajo}
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} sm={3}>
          <FormControlLabel
            control={
              <Switch
                checked={usuario.asistencia}
                onChange={handleChange}
                name="asistencia"
              />
            }
            label="Asistencia"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControlLabel
            control={
              <Switch
                checked={usuario.comida}
                onChange={handleChange}
                name="comida"
              />
            }
            label="Comida"
          />
        </Grid>
        <Grid container spacing={2} style={{ padding  : '20px' }}>
          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: '#38de54', color: '#fff' }} // Verde
              fullWidth
            >
              Enviar Actualización
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#dc3545', color: '#fff' }} // Rojo
              fullWidth
              onClick={handleDelete}
            >
              Eliminar Registro
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#ffc107', color: '#fff' }} // Amarillo
              fullWidth
              onClick={handleClear}
            >
              Limpiar Campos
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormularioUsuario;
