import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import FormularioUsuario from './FormularioUsuario';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import axios from 'axios';

const App = () => {
  const [filterColumn, setFilterColumn] = useState('nombre');
  const [filterValue, setFilterValue] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get('http://localhost:3001/api/personas');
    setData(response.data);
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

  return (
    <Container>
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
      <TableComponent filterColumn={filterColumn} filterValue={filterValue} onRowSelect={handleRowSelect} />
      <FormularioUsuario selectedUser={selectedUser} fetchData={fetchData} />
    </Container>
  );
};

export default App;
