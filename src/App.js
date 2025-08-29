import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas y Layouts
import PortfolioHub from './pages/PortfolioHub';
import RetinopathyPage from './pages/RetinopathyPage';
import MechatronicsLayout from './layouts/MechatronicsLayout'; // Importa el nuevo Layout

// Componentes que se anidarán
import MechatronicsCarousel from './components/MechatronicsCarousel'; // Tu carrusel
import Chatbot from './components/Chatbot'; // Tu chatbot

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'; // Importa tus estilos globales

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal del portafolio */}
        <Route path="/" element={<PortfolioHub />} />
        
        {/* Ruta para el proyecto de Retinopatía (sin cambios) */}
        <Route path="/retinopathy-scanner" element={<RetinopathyPage />} />
        
        {/* --- RUTA ANIDADA PARA MECATRÓNICA --- */}
        <Route path="/mechatronics" element={<MechatronicsLayout />}>
          {/* La ruta "index" es la que se muestra por defecto en /mechatronics */}
          <Route index element={<MechatronicsCarousel />} />
          
          {/* Esta ruta se activará con la URL /mechatronics/chatbot */}
          <Route path="chatbot" element={<Chatbot />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;