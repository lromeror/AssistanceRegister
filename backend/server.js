const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');  
const csv = require('csv-parser');


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
        //console.log('Resultados obtenidos de la base de datos:', results);
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


// Configuración de Multer para guardar los archivos en una carpeta específica y filtrar solo archivos .csv

// Asegúrate de que la carpeta 'uploads' existe
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

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos .csv'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Ruta para manejar la subida de archivos y devolver todas las filas del archivo CSV
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file || path.extname(req.file.originalname).toLowerCase() !== '.csv') {
            console.log('No se subió ningún archivo o el archivo no es un .csv');
            return res.status(400).send('No se subió ningún archivo o el archivo no es un .csv');
        }

        const filePath = path.join(__dirname, 'uploads', req.file.filename);

        // Crear un flujo de lectura para el archivo CSV
        const stream = fs.createReadStream(filePath)
            .pipe(csv());

        // Leer y procesar las filas del archivo CSV
        stream.on('data', async (row) => {
            try {
                await processCSVRow(row);
            } catch (error) {
                console.error('Error al insertar los datos en la base de datos:', error);
            }
        });

        // Manejar el fin del flujo de lectura
        stream.on('end', () => {
            res.status(201).send('Datos insertados correctamente');
        });

        // Manejar errores durante la lectura del archivo
        stream.on('error', (error) => {
            console.error(`Error procesando el archivo: ${error.message}`);
            res.status(500).send('Error procesando el archivo');
        });

    } catch (error) {
        console.error('Error al subir el archivo backend', error);
        res.status(400).send('Error al subir el archivo backend');
    }
});

async function processCSVRow(row) {
    const { nombre, apellido, telefono_movil, correo_electronico, ocupacion, carrera, universidad, organizacion, trabajo } = row;
    // Log para depuración
    console.log('Datos recibidos:', row);

    const [result] = await db.promise().query(
        `INSERT INTO personas (nombre, apellido, telefono_movil, ocupacion, correo_electronico) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), apellido=VALUES(apellido), telefono_movil=VALUES(telefono_movil), ocupacion=VALUES(ocupacion)`,
        [nombre, apellido, telefono_movil, ocupacion, correo_electronico]
    );

    const id_persona = result.insertId || (await db.promise().query(
        `SELECT id_persona FROM personas WHERE correo_electronico = ?`, [correo_electronico]
    ))[0][0].id_persona;

    if (ocupacion === 'Estudiante') {
        await db.promise().query(
            `INSERT INTO estudiantes (id_persona, carrera, universidad) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE carrera=VALUES(carrera), universidad=VALUES(universidad)`,
            [id_persona, carrera, universidad]
        );
    } else if (ocupacion === 'Profesional') {
        await db.promise().query(
            `INSERT INTO profesionales (id_persona, organizacion, trabajo) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE organizacion=VALUES(organizacion), trabajo=VALUES(trabajo)`,
            [id_persona, organizacion, trabajo]
        );
    }
}


app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


