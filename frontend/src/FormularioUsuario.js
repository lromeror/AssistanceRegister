import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const FormularioUsuario = ({ selectedUser }) => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    ocupacion: '',
    asistencia: false,
    comida: false,
    carrera: '',
    universidad: '',
    organizacion: '',
    trabajo: ''
  });

  useEffect(() => {
    if (selectedUser) {
      setUsuario({
        nombre: selectedUser.nombre,
        apellido: selectedUser.apellido,
        telefono: selectedUser.telefono_movil,
        correo: selectedUser.correo_electronico,
        ocupacion: selectedUser.ocupacion,
        asistencia: !!selectedUser.asistencia,
        comida: !!selectedUser.comida,
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
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica para enviar la actualización
  };

  const handleClear = () => {
    setUsuario({
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      ocupacion: '',
      asistencia: false,
      comida: false,
      carrera: '',
      universidad: '',
      organizacion: '',
      trabajo: ''
    });
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="apellido"
            label="Apellido"
            fullWidth
            value={usuario.apellido}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="telefono"
            label="Teléfono Móvil"
            fullWidth
            value={usuario.telefono}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="correo"
            label="Correo Electrónico"
            fullWidth
            value={usuario.correo}
            onChange={handleChange}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="universidad"
                label="Universidad"
                fullWidth
                value={usuario.universidad}
                onChange={handleChange}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="trabajo"
                label="Trabajo"
                fullWidth
                value={usuario.trabajo}
                onChange={handleChange}
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
        <Grid item xs={12} sm={4}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Enviar Actualización
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="secondary" fullWidth>
            Eliminar Registro
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" onClick={handleClear} fullWidth>
            Limpiar Campos
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormularioUsuario;
