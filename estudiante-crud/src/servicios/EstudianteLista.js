import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEstudiantes, deleteEstudiante } from './estudianteServicio';
import './EstudianteLista.css';

function EstudianteLista() {
    const [estudiantes, setEstudiantes] = useState([]);

    useEffect(() => {
        getEstudiantes()
            .then((res) => {
                setEstudiantes(res.data);
            })
            .catch((error) => {
                console.error("Error al obtener los estudiantes:", error);
            });
    }, []);

    const handleDelete = async (estudiante) => {
        try {
            const confirmacion = window.confirm('¿Estás seguro de eliminar este estudiante?');
            if (confirmacion) {
                await deleteEstudiante(estudiante.carnet_serie, estudiante.carnet_anio, estudiante.carnet_numero);
                alert('Estudiante eliminado correctamente');
    
                // Eliminar estudiante de la lista de estudiantes localmente
                setEstudiantes((prevEstudiantes) => 
                    prevEstudiantes.filter(est => 
                        est.carnet_serie !== estudiante.carnet_serie ||
                        est.carnet_anio !== estudiante.carnet_anio ||
                        est.carnet_numero !== estudiante.carnet_numero
                    )
                );
            }
        } catch (error) {
            console.error('Error al eliminar el estudiante:', error);
            alert('No se pudo eliminar el estudiante');
        }
    };

    return (
        <div>
            <h2>Lista de Estudiantes</h2>

            <div className="botones-agregar">
                <Link to="/agregar">
                    <button className="boton-agregar">Agregar Estudiante</button>
                </Link>
                <Link to="/estadisticas">
                    <button className="boton-estadisticas">Ver Estadísticas de Edad</button>
                </Link>
            </div>

            <table className="estudiante-table">
                <thead>
                    <tr>
                        <th>Carnet</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Teléfono</th>
                        <th>Correo Electrónico</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((estudiante) => (
                        <tr key={estudiante.carnet}>
                            <td>{`${estudiante.carnet_serie}-${estudiante.carnet_anio}-${estudiante.carnet_numero}`}</td>
                            <td>{`${estudiante.primer_nombre} ${estudiante.segundo_nombre || ''}`}</td>
                            <td>{`${estudiante.primer_apellido} ${estudiante.segundo_apellido || ''}`}</td>
                            <td>{estudiante.telefono}</td>
                            <td>{estudiante.correo_electronico}</td>
                            <td>{estudiante.fecha_nacimiento}</td>
                            <td>
                            <Link to={`/editar/${estudiante.carnet_serie}/${estudiante.carnet_anio}/${estudiante.carnet_numero}`}>
                            <button className="boton-editar">Editar</button>
                            </Link>
                                <button
                                    className="boton-eliminar"
                                    onClick={() => handleDelete(estudiante)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EstudianteLista;
