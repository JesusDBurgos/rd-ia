import React from 'react';
import { Outlet } from 'react-router-dom'; // ¡Importante!
import Navigation from '../components/Navigation'; // Tu componente de navegación
import '../App.css'; // Asegúrate de que la clase .sidebar esté aquí o importa el CSS necesario

function MechatronicsLayout() {
  return (
    <div>
      <Navigation /> {/* La barra de navegación siempre será visible */}
      
      {/* El div 'main-content' es un contenedor para el contenido dinámico */}
      <div className="main-content">
        {/* Outlet es el marcador de posición donde se renderizarán las rutas hijas (el carrusel o el chatbot) */}
        <Outlet />
      </div>
    </div>
  );
}

export default MechatronicsLayout;