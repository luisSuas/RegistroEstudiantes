const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los estudiantes
router.get('/estudiantes', (req, res) => {
    db.query('SELECT * FROM estudiantes', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Obtener un estudiante por carnet (buscando por las tres partes del carnet)
router.get('/estudiantes/:serie/:anio/:numero', (req, res) => {
    const { serie, anio, numero } = req.params;
    db.query(
        'SELECT * FROM estudiantes WHERE carnet_serie = ? AND carnet_anio = ? AND carnet_numero = ?',
        [serie, anio, numero],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (rows.length === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
            res.json(rows[0]);
        }
    );
});

// Crear un nuevo estudiante
router.post('/estudiantes', (req, res) => {
    const { carnet_serie, carnet_anio, carnet_numero, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, correo_electronico, fecha_nacimiento } = req.body;

    if (!carnet_serie || !carnet_anio || !carnet_numero || !primer_nombre || !primer_apellido || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Los campos obligatorios no pueden estar vacíos' });
    }

    const query = 'INSERT INTO estudiantes SET ?';
    const newStudent = { carnet_serie, carnet_anio, carnet_numero, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, correo_electronico, fecha_nacimiento };

    db.query(query, newStudent, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, ...newStudent });
    });
});

// Actualizar un estudiante
router.put('/estudiantes/:serie/:anio/:numero', (req, res) => {
    const { serie, anio, numero } = req.params;
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, correo_electronico, fecha_nacimiento } = req.body;

    if (!primer_nombre || !primer_apellido || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Los campos obligatorios no pueden estar vacíos' });
    }

    const query = `
        UPDATE estudiantes 
        SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, telefono = ?, correo_electronico = ?, fecha_nacimiento = ?
        WHERE carnet_serie = ? AND carnet_anio = ? AND carnet_numero = ?
    `;
    const values = [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, correo_electronico, fecha_nacimiento, serie, anio, numero];

    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el estudiante' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Estudiante no encontrado' });
        res.json({ message: 'Estudiante actualizado correctamente' });
    });
});

// Eliminar un estudiante
router.delete('/estudiantes/:serie/:anio/:numero', (req, res) => {
    const { serie, anio, numero } = req.params;
    db.query(
        'DELETE FROM estudiantes WHERE carnet_serie = ? AND carnet_anio = ? AND carnet_numero = ?',
        [serie, anio, numero],
        (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Estudiante no encontrado' });
            res.status(200).json({ message: 'Estudiante eliminado correctamente' });
        }
    );
});

// Obtener estadísticas de estudiantes por edad
router.get('/estadisticas/edad', async (req, res) => {
    try {
        const query = `SELECT TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS edad, COUNT(*) AS cantidad 
                        FROM estudiantes 
                        GROUP BY edad 
                        ORDER BY edad`;
        const [results] = await db.query(query);  
        res.json(results);
    } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
});

module.exports = router;
