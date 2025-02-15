// Importar dependencias
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const mysql = require('mysql');
const cors = require('cors');

// Cargar configuración desde .env
dotenv.config();

// Configurar conexión a MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors());

/** ==========================
 *  📌 Endpoints para Estudiantes
 *  ========================== **/

// Obtener todos los estudiantes
app.get('/apiv2/estudiantes', (req, res) => {
    connection.query('SELECT * FROM estudiantes', function (error, rows) {
        if (error) return res.status(500).json({ error });
        res.status(200).json(rows);
    });
});

// Obtener un estudiante por carnet (dividido en tres partes)
app.get('/apiv2/estudiantes/:serie/:anio/:numero', (req, res) => {
    const { serie, anio, numero } = req.params;
    connection.query(
        'SELECT * FROM estudiantes WHERE carnet_serie = ? AND carnet_anio = ? AND carnet_numero = ?',
        [serie, anio, numero],
        function (error, rows) {
            if (error) return res.status(500).json({ error });
            if (rows.length === 0) return res.status(404).json({ message: 'Estudiante no encontrado' });
            res.status(200).json(rows[0]);
        }
    );
});

// Crear un nuevo estudiante
app.post("/apiv2/estudiantes", (req, res) => {
    const estudiante = req.body;

    connection.query('INSERT INTO estudiantes SET ?', estudiante, function (error, result) {
        if (error) return res.status(500).json(error);
        res.status(201).json({ message: "Estudiante agregado", id: result.insertId });
    });
});

// Actualizar un estudiante
app.put('/apiv2/estudiantes/:serie/:anio/:numero', (req, res) => {
    const { serie, anio, numero } = req.params;
    const estudiante = req.body;

    connection.query(
        'UPDATE estudiantes SET ? WHERE carnet_serie = ? AND carnet_anio = ? AND carnet_numero = ?',
        [estudiante, serie, anio, numero],
        function (error, result) {
            if (error) return res.status(500).json({ error });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Estudiante no encontrado" });
            res.status(200).json({ message: "Estudiante actualizado" });
        }
    );
});

// Eliminar un estudiante
app.delete('/apiv2/estudiantes/:serie/:anio/:numero', (req, res) => {
    const { serie, anio, numero } = req.params;

    connection.query(
        'DELETE FROM estudiantes WHERE carnet_serie = ? AND carnet_anio = ? AND carnet_numero = ?',
        [serie, anio, numero],
        function (error, result) {
            if (error) return res.status(500).json({ error });
            if (result.affectedRows === 0) return res.status(404).json({ message: "Estudiante no encontrado" });
            res.status(200).json({ message: "Estudiante eliminado" });
        }
    );
});

// Endpoint para obtener estadísticas por edad
app.get('/apiv2/estadisticas/edad', (req, res) => {
    const query = `
        SELECT YEAR(CURDATE()) - YEAR(fecha_nacimiento) AS edad, COUNT(*) AS cantidad
        FROM estudiantes
        GROUP BY edad
        ORDER BY edad;
    `;

    connection.query(query, (error, rows) => {
        if (error) return res.status(500).json({ error });
        res.status(200).json(rows);
    });
});

// Iniciar el servidor
app.listen(8800, () => {
    console.log('API corriendo en el puerto 8800');
});
