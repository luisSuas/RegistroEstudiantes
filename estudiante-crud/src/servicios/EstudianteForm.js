import React, { useState, useEffect } from 'react';
import { createEstudiante, getEstudianteById, updateEstudiante } from '../servicios/estudianteServicio';
import './EstudianteForm.css';

const EstudianteForm = ({ carnet, onSuccess }) => {
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
    const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar el envío

    useEffect(() => {
        if (carnet) {
            fetchEstudiante(carnet);
        }
    }, [carnet]);

    const fetchEstudiante = async (id) => {
        const response = await getEstudianteById(id);
        setEstudiante(response.data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstudiante({ ...estudiante, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;  // Evita que el formulario se envíe varias veces
        setIsSubmitting(true); // Marca que estamos enviando el formulario

        try {
            if (carnet) {
                await updateEstudiante(carnet, estudiante);
            } else {
                await createEstudiante(estudiante);
            }
            // Resetear formulario
            setEstudiante({
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

            // Llamar a onSuccess si está definido
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error guardando el estudiante', error);
        } finally {
            setIsSubmitting(false); // Desmarcar después de completar el envío
        }
    };

    return (
        <div className="form-container">
            <h2>{carnet ? 'Editar Estudiante' : 'Agregar Estudiante'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Carnet:</label>
                <div className="carnet-group">
                    <input type="text" name="carnet_serie" value={estudiante.carnet_serie} onChange={handleChange} placeholder="Serie (Ej: 2590)" required />
                    <input type="text" name="carnet_anio" value={estudiante.carnet_anio} onChange={handleChange} placeholder="Año (Ej: 21)" required />
                    <input type="text" name="carnet_numero" value={estudiante.carnet_numero} onChange={handleChange} placeholder="Número (Ej: 8015)" required />
                </div>

                <label>Nombres:</label>
                <input type="text" name="primer_nombre" value={estudiante.primer_nombre} onChange={handleChange} placeholder="Primer Nombre" required />
                <input type="text" name="segundo_nombre" value={estudiante.segundo_nombre} onChange={handleChange} placeholder="Segundo Nombre" />

                <label>Apellidos:</label>
                <input type="text" name="primer_apellido" value={estudiante.primer_apellido} onChange={handleChange} placeholder="Primer Apellido" required />
                <input type="text" name="segundo_apellido" value={estudiante.segundo_apellido} onChange={handleChange} placeholder="Segundo Apellido" />

                <label>Teléfono:</label>
                <input type="text" name="telefono" value={estudiante.telefono} onChange={handleChange} placeholder="Teléfono" required />

                <label>Correo Electrónico:</label>
                <input type="email" name="correo_electronico" value={estudiante.correo_electronico} onChange={handleChange} placeholder="Correo Electrónico" required />

                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" value={estudiante.fecha_nacimiento} onChange={handleChange} required />

                <button type="submit" disabled={isSubmitting}>{carnet ? 'Actualizar' : 'Agregar'}</button>
            </form>
        </div>
    );
};

export default EstudianteForm;
