import React from 'react';
import EstudianteForm from './EstudianteForm';
import EstudianteLista from './EstudianteLista';

function EstudianteApp() {

    return (
        <div>
            <h1>Gestión de Estudiantes</h1>
            <EstudianteForm  />
            <EstudianteLista  />
        </div>
    );
}

export default EstudianteApp;
