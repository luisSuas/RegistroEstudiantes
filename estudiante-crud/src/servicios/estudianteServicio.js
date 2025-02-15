import axios from 'axios';

const API_URL = 'http://localhost:8800/apiv2/estudiantes';

export const getEstudiantes = async () => {
    return await axios.get(API_URL);
};

export const getEstudianteById = async (id) => {
    return await axios.get(`${API_URL}/${id}`);
};

export const createEstudiante = async (estudiante) => {
    return await axios.post(API_URL, estudiante);
};

export const updateEstudiante = async (serie, anio, numero, estudiante) => {
    try {
        const response = await axios.put(`http://localhost:8800/apiv2/estudiantes/${serie}/${anio}/${numero}`, estudiante, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        throw error;
    }
};


export const deleteEstudiante = async (serie, anio, numero) => {
    try {
        const response = await axios.delete(`${API_URL}/${serie}/${anio}/${numero}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el estudiante:', error.response?.data || error.message);
        throw error;
    }
};
