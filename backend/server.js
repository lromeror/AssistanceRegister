const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const port = 3001;
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  }
});

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'viaduct.proxy.rlwy.net',
    user: 'root',
    password: 'UAxgbfibezWmZpWKvXBANZtRbWuvcObR',
    database: 'railway2',
    port: 49882
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL.');
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const emitDataUpdate = () => {
    const sql = `SELECT personas.*, estudiantes.carrera, estudiantes.universidad, profesionales.organizacion, profesionales.trabajo
                FROM personas
                LEFT JOIN estudiantes ON personas.id_persona = estudiantes.id_persona
                LEFT JOIN profesionales ON personas.id_persona = profesionales.id_persona`;

    db.query(sql, (err, results) => {
        if (err) throw err;
        io.emit('updateData', results);
    });
};

app.get('/api/personas', (req, res) => {
    const sql = `SELECT personas.*, estudiantes.carrera, estudiantes.universidad, profesionales.organizacion, profesionales.trabajo
                FROM personas
                LEFT JOIN estudiantes ON personas.id_persona = estudiantes.id_persona
                LEFT JOIN profesionales ON personas.id_persona = profesionales.id_persona`;

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/personas', (req, res) => {
    const { nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida, carrera, universidad, organizacion, trabajo } = req.body;
    const sql = `INSERT INTO personas (nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida], (err, result) => {
        if (err) throw err;
        const id_persona = result.insertId;

        if (ocupacion === 'estudiante') {
            const sqlEstudiante = `INSERT INTO estudiantes (id_persona, carrera, universidad) VALUES (?, ?, ?)`;
            db.query(sqlEstudiante, [id_persona, carrera, universidad], (err, result) => {
                if (err) throw err;
                emitDataUpdate();
                res.sendStatus(201);
            });
        } else if (ocupacion === 'profesional') {
            const sqlProfesional = `INSERT INTO profesionales (id_persona, organizacion, trabajo) VALUES (?, ?, ?)`;
            db.query(sqlProfesional, [id_persona, organizacion, trabajo], (err, result) => {
                if (err) throw err;
                emitDataUpdate();
                res.sendStatus(201);
            });
        } else {
            emitDataUpdate();
            res.sendStatus(201);
        }
    });
});

app.put('/api/personas/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida, carrera, universidad, organizacion, trabajo } = req.body;
    const sql = `UPDATE personas SET nombre = ?, apellido = ?, telefono_movil = ?, ocupacion = ?, correo_electronico = ?, asistencia = ?, comida = ? WHERE id_persona = ?`;

    db.query(sql, [nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida, id], (err, result) => {
        if (err) throw err;

        if (ocupacion === 'estudiante') {
            const sqlEstudiante = `REPLACE INTO estudiantes (id_persona, carrera, universidad) VALUES (?, ?, ?)`;
            db.query(sqlEstudiante, [id, carrera, universidad], (err, result) => {
                if (err) throw err;
                emitDataUpdate();
                res.sendStatus(200);
            });
        } else if (ocupacion === 'profesional') {
            const sqlProfesional = `REPLACE INTO profesionales (id_persona, organizacion, trabajo) VALUES (?, ?, ?)`;
            db.query(sqlProfesional, [id, organizacion, trabajo], (err, result) => {
                if (err) throw err;
                emitDataUpdate();
                res.sendStatus(200);
            });
        } else {
            emitDataUpdate();
            res.sendStatus(200);
        }
    });
});

app.delete('/api/personas/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM personas WHERE id_persona = ?`;

    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        emitDataUpdate();
        res.sendStatus(200);
    });
});

// Servir los archivos estáticos de la aplicación React
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
