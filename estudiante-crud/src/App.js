import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EstudianteLista from './servicios/EstudianteLista';
import EstudianteForm from './servicios/EstudianteForm';
import EstudianteEditar from './servicios/EstudianteEditar';
import EstadisticasEdad from './servicios/EstadisticasEdad';
function App() {
  return (
    <div>
      <Routes>
        {/* Listado de estudiantes */}
        <Route path="/" element={<EstudianteLista />} />
        
        {/* Agregar estudiante */}
        <Route path="/agregar" element={<EstudianteForm />} />
        
        {/* Editar estudiante */}
        <Route path="/editar/:serie/:anio/:numero" element={<EstudianteEditar />} />
        <Route path="/estadisticas" element={<EstadisticasEdad />} />
      </Routes>
    </div>
  );
}

export default App;

