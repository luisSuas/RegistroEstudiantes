import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EstadisticasEdad.css'; // Asegúrate de que este archivo existe

function EstadisticasEdad() {
    const [estadisticas, setEstadisticas] = useState([]);
    const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false); // Estado para controlar la visualización
    const [loading, setLoading] = useState(false); // Estado para saber si estamos cargando datos

    useEffect(() => {
        if (mostrarEstadisticas) {
            // Empezamos a cargar las estadísticas
            setLoading(true);
            axios.get('http://localhost:8800/apiv2/estadisticas/edad')
                .then((response) => {
                    setEstadisticas(response.data);
                    setLoading(false); // Datos cargados
                })
                .catch((error) => {
                    console.error('Error al obtener las estadísticas:', error);
                    setLoading(false); // Finaliza la carga incluso si hay error
                });
        }
    }, [mostrarEstadisticas]); // Solo cuando mostrarEstadisticas cambia

    const handleClick = () => {
        setMostrarEstadisticas(true); // Cambia el estado para mostrar estadísticas
    };

    return (
        <div>
            <h2>Estadísticas por Edad</h2>

            {/* Solo muestra el botón si no se han mostrado las estadísticas */}
            {!mostrarEstadisticas && (
                <div className="boton-container">
                    <button className="boton-estadisticas" onClick={handleClick}>Ver Estadísticas por Edad</button>
                </div>
            )}

            {/* Si se está cargando, muestra un mensaje de carga */}
            {loading && <p>Cargando estadísticas...</p>}

            {/* Si las estadísticas están cargadas, mostramos la tabla */}
            {mostrarEstadisticas && !loading && (
                <table>
                    <thead>
                        <tr>
                            <th>Edad</th>
                            <th>Cantidad de Estudiantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estadisticas.length > 0 ? (
                            estadisticas.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.edad}</td>
                                    <td>{item.cantidad}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No hay datos disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EstadisticasEdad;
