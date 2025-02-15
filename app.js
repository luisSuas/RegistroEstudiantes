// Importar dependencias
const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const alumnos = require('./routes/alumnos');
// Cargamos configuración en archivo .env
dotenv.config();

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Conectar a la base de datos
db.connect((err) => {
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

app.use('/apiv2/alumnos', alumnosRoutes);



// Iniciar el servidor
app.listen(8800, () => {
    console.log('Servidor APIv2 corriendo en puerto 8800');
});
