import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

const TableComponent = ({ filterColumn, filterValue, onRowSelect }) => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    fetchData();
    socket.on('updateData', (updatedData) => {
      console.log('Data received from WebSocket:', updatedData);
      setData(updatedData);
    });

    return () => {
      socket.off('updateData');
    };
  }, []);

  const fetchData = async () => {
    const response = await axios.get('/api/personas');
    setData(response.data);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row.id_persona);
    onRowSelect(row);
  };

  const filteredData = data.filter((row) => {
    if (!filterValue) return true;
    let cellValue = row[filterColumn] ? row[filterColumn].toString().toLowerCase() : '';
    if (filterColumn === 'asistencia' || filterColumn === 'comida') {
      cellValue = row[filterColumn] ? '1' : '0';
    }
    return cellValue.includes(filterValue.toLowerCase());
  });

  return (
    <TableContainer component={Paper} style={{ maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Id_persona</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Apellido</TableCell>
            <TableCell>Telefono_movil</TableCell>
            <TableCell>Correo_electronico</TableCell>
            <TableCell>Ocupacion</TableCell>
            <TableCell>Carrera</TableCell>
            <TableCell>Universidad</TableCell>
            <TableCell>Organizacion</TableCell>
            <TableCell>Trabajo</TableCell>
            <TableCell>Asistencia</TableCell>
            <TableCell>Comida</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow
              key={row.id_persona}
              onClick={() => handleRowClick(row)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRow === row.id_persona ? '#90caf9' : '',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedRow !== row.id_persona) e.currentTarget.style.backgroundColor = '#e3f2fd';
              }}
              onMouseLeave={(e) => {
                if (selectedRow !== row.id_persona) e.currentTarget.style.backgroundColor = '';
              }}
            >
              <TableCell>{row.id_persona}</TableCell>
              <TableCell>{row.nombre}</TableCell>
              <TableCell>{row.apellido}</TableCell>
              <TableCell>{row.telefono_movil}</TableCell>
              <TableCell>{row.correo_electronico}</TableCell>
              <TableCell>{row.ocupacion}</TableCell>
              <TableCell>{row.carrera || ''}</TableCell>
              <TableCell>{row.universidad || ''}</TableCell>
              <TableCell>{row.organizacion || ''}</TableCell>
              <TableCell>{row.trabajo || ''}</TableCell>
              <TableCell>{row.asistencia ? '1' : '0'}</TableCell>
              <TableCell>{row.comida ? '1' : '0'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
