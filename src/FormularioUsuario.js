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

  useEffect(() => {
    if (selectedUser) {
      setUsuario({
        nombre: selectedUser.nombre,
        apellido: selectedUser.apellido,
        telefono_movil: selectedUser.telefono_movil,
        correo_electronico: selectedUser.correo_electronico,
        ocupacion: selectedUser.ocupacion,
        asistencia: selectedUser.asistencia,
        comida: selectedUser.comida,
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
  };

  return (
    
  );
};

export default FormularioUsuario;