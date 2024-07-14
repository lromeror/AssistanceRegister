import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import FormularioUsuario from './FormularioUsuario';
import Header from './Header'; 
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import axios from 'axios';

const Sistema = () => {
  const [filterColumn, setFilterColumn] = useState('nombre');
  const [filterValue, setFilterValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/personas');
      setData(response.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const handleColumnChange = (event) => {
    setFilterColumn(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleRowSelect = (user) => {
    setSelectedUser(user);
  };

  const clearSelection = () => {
    setSelectedUser(null); 
    setClearSelectionTrigger(prev => !prev); 
  };

  return (
    <Container>
      <Header />  {/* Añade el componente de cabecera aquí */}
      <h1>Registro de Asistencia</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Filtrar por"
            value={filterColumn}
            onChange={handleColumnChange}
            fullWidth
          >
            <MenuItem value="nombre">Nombre</MenuItem>
            <MenuItem value="apellido">Apellido</MenuItem>
            <MenuItem value="telefono_movil">Telefono_movil</MenuItem>
            <MenuItem value="correo_electronico">Correo_electronico</MenuItem>
            <MenuItem value="ocupacion">Ocupacion</MenuItem>
            <MenuItem value="carrera">Carrera</MenuItem>
            <MenuItem value="universidad">Universidad</MenuItem>
            <MenuItem value="organizacion">Organizacion</MenuItem>
            <MenuItem value="trabajo">Trabajo</MenuItem>
            <MenuItem value="asistencia">Asistencia</MenuItem>
            <MenuItem value="comida">Comida</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Buscar"
            value={filterValue}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <TableComponent
        filterColumn={filterColumn}
        filterValue={filterValue}
        onRowSelect={handleRowSelect}
        clearSelectionTrigger={clearSelectionTrigger}
        data={data}
      />
      <FormularioUsuario selectedUser={selectedUser} fetchData={fetchData} onClear={clearSelection} />
    </Container>
  );
};

export default Sistema;
