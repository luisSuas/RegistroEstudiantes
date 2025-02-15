import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateEstudiante } from './estudianteServicio';
import axios from 'axios';
import './EstudianteEditar.css';

function EstudianteEditar() {
    const { serie, anio, numero } = useParams(); 
    const navigate = useNavigate();
    const [estudiante, setEstudiante] = useState({
        carnet_serie: '',
        carnet_anio: '',
        carnet_numero: '',
        primer_nombre: '',
        segundo_nombre: '',
        primer_apellido: '',
        segundo_apellido: '',
        telefono: '',
        correo_electronico: '',
        fecha_nacimiento: ''
    });

    useEffect(() => {
        const fetchEstudiante = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/apiv2/estudiantes/${serie}/${anio}/${numero}`);
                setEstudiante(response.data);
            } catch (error) {
                console.error('Error al cargar los datos del estudiante:', error);
            }
        };
        fetchEstudiante();
    }, [serie, anio, numero]);
    
    const handleChange = (e) => {
        setEstudiante({ ...estudiante, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEstudiante(serie, anio, numero, estudiante);
            alert('Estudiante actualizado correctamente');
            navigate('/');  // Redirige después de actualizar
        } catch (error) {
            console.error('Error al actualizar el estudiante:', error);
            alert('No se pudo actualizar el estudiante');
        }
    };    

    return (
        <div className="EstudianteEditar">
            <h2>Editar Estudiante</h2>
            <form onSubmit={handleSubmit}>
                <label>Carnet:</label>
                <div className="carnet-container">
                    <input type="text" name="carnet_serie" value={estudiante.carnet_serie} onChange={handleChange} required placeholder="Serie" />
                    <input type="text" name="carnet_anio" value={estudiante.carnet_anio} onChange={handleChange} required placeholder="Año" />
                    <input type="text" name="carnet_numero" value={estudiante.carnet_numero} onChange={handleChange} required placeholder="Número" />
                </div>
                <label>Nombres:</label>
                <div className="nombre-container">
                    <input type="text" name="primer_nombre" value={estudiante.primer_nombre} onChange={handleChange} required placeholder="Primer Nombre" />
                    <input type="text" name="segundo_nombre" value={estudiante.segundo_nombre} onChange={handleChange} placeholder="Segundo Nombre (Opcional)" />
                </div>
                <label>Apellidos:</label>
                <div className="apellido-container">
                    <input type="text" name="primer_apellido" value={estudiante.primer_apellido} onChange={handleChange} required placeholder="Primer Apellido" />
                    <input type="text" name="segundo_apellido" value={estudiante.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido (Opcional)" />
                </div>
                <label>Teléfono:</label>
                <input type="text" name="telefono" value={estudiante.telefono} onChange={handleChange} required />
                <label>Correo Electrónico:</label>
                <input type="email" name="correo_electronico" value={estudiante.correo_electronico} onChange={handleChange} required />
                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" value={estudiante.fecha_nacimiento} onChange={handleChange} required />
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
}

export default EstudianteEditar;
