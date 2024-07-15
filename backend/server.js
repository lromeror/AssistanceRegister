const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');  // Para trabajar con el sistema de archivos
const app = express();
const port = 3001;
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: ["http://localhost:3000", "https://registerwids.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    }
});

app.use(cors({
    origin: ["http://localhost:3000", "https://registerwids.onrender.com"],
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
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const emitDataUpdate = () => {
    const sql = `
        SELECT p.id_persona, p.nombre, p.apellido, p.telefono_movil, p.correo_electronico, 
               p.ocupacion, MAX(e.carrera) AS carrera, MAX(e.universidad) AS universidad, 
               MAX(pr.organizacion) AS organizacion, MAX(pr.trabajo) AS trabajo,
               p.asistencia, p.comida
        FROM personas p
        LEFT JOIN estudiantes e ON p.id_persona = e.id_persona
        LEFT JOIN profesionales pr ON p.id_persona = pr.id_persona
        GROUP BY p.id_persona, p.nombre, p.apellido, p.telefono_movil, p.correo_electronico, 
                 p.ocupacion, p.asistencia, p.comida
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            return;
        }
        console.log('Emitiendo actualización de datos:', results);
        io.emit('updateData', results);
    });
};

app.get('/api/personas', (req, res) => {
    const sql = `
        SELECT p.id_persona, p.nombre, p.apellido, p.telefono_movil, p.correo_electronico, 
               p.ocupacion, MAX(e.carrera) AS carrera, MAX(e.universidad) AS universidad, 
               MAX(pr.organizacion) AS organizacion, MAX(pr.trabajo) AS trabajo,
               p.asistencia, p.comida
        FROM personas p
        LEFT JOIN estudiantes e ON p.id_persona = e.id_persona
        LEFT JOIN profesionales pr ON p.id_persona = pr.id_persona
        GROUP BY p.id_persona, p.nombre, p.apellido, p.telefono_movil, p.correo_electronico, 
                 p.ocupacion, p.asistencia, p.comida
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener datos:', err);
            res.status(500).send('Error al obtener datos');
            return;
        }
        console.log('Resultados obtenidos de la base de datos:', results);
        res.json(results);
    });
});

app.post('/api/personas', (req, res) => {
    const { nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida, carrera, universidad, organizacion, trabajo } = req.body;
    const sql = `INSERT INTO personas (nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al insertar datos');
            return;
        }
        const id_persona = result.insertId;

        if (ocupacion === 'estudiante') {
            const sqlEstudiante = `INSERT INTO estudiantes (id_persona, carrera, universidad) VALUES (?, ?, ?)
                                   ON DUPLICATE KEY UPDATE carrera = VALUES(carrera), universidad = VALUES(universidad)`;
            db.query(sqlEstudiante, [id_persona, carrera, universidad], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos de estudiante:', err);
                    res.status(500).send('Error al insertar datos de estudiante');
                    return;
                }
                emitDataUpdate();
                res.sendStatus(201);
            });
        } else if (ocupacion === 'profesional') {
            const sqlProfesional = `INSERT INTO profesionales (id_persona, organizacion, trabajo) VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE organizacion = VALUES(organizacion), trabajo = VALUES(trabajo)`;
            db.query(sqlProfesional, [id_persona, organizacion, trabajo], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos de profesional:', err);
                    res.status(500).send('Error al insertar datos de profesional');
                    return;
                }
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
    const sql = `UPDATE personas SET nombre = ?, apellido = ?, telefono_movil = ?, ocupacion = ?, correo_electronico = ?, asistencia = ?, comida = ?, actualizacion = 1 WHERE id_persona = ?`;

    db.query(sql, [nombre, apellido, telefono_movil, ocupacion, correo_electronico, asistencia, comida, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            res.status(500).send('Error al actualizar datos');
            return;
        }

        if (ocupacion === 'estudiante') {
            const sqlEstudiante = `INSERT INTO estudiantes (id_persona, carrera, universidad) VALUES (?, ?, ?)
                                   ON DUPLICATE KEY UPDATE carrera = VALUES(carrera), universidad = VALUES(universidad)`;
            db.query(sqlEstudiante, [id, carrera, universidad], (err, result) => {
                if (err) {
                    console.error('Error al actualizar datos de estudiante:', err);
                    res.status(500).send('Error al actualizar datos de estudiante');
                    return;
                }
                emitDataUpdate();
                res.sendStatus(200);
            });
        } else if (ocupacion === 'profesional') {
            const sqlProfesional = `INSERT INTO profesionales (id_persona, organizacion, trabajo) VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE organizacion = VALUES(organizacion), trabajo = VALUES(trabajo)`;
            db.query(sqlProfesional, [id, organizacion, trabajo], (err, result) => {
                if (err) {
                    console.error('Error al actualizar datos de profesional:', err);
                    res.status(500).send('Error al actualizar datos de profesional');
                    return;
                }
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
        if (err) {
            console.error('Error al eliminar datos:', err);
            res.status(500).send('Error al eliminar datos');
            return;
        }
        emitDataUpdate();
        res.sendStatus(200);
    });
});


// Configuración de Multer para guardar los archivos en una carpeta específica

// Asegurarse de que la carpeta 'uploads' existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Renombrar el archivo para evitar colisiones
    }
});

const upload = multer({ storage: storage });

// Ruta para manejar la subida de archivos
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        res.send('Archivo subido exitosamente');
    } catch (error) {
        res.status(400).send('Error al subir el archivo');
    }
});

app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


