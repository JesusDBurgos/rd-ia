import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

import { NavLink } from 'react-router-dom'; // Nota: se usa NavLink de react-router-dom
import { Navbar } from 'react-bootstrap';
import logoEd from '../static/Bot_IA.png'
import "../App.css";

const Navigation = () => {
  return (
    <div>
      {/* Tu Navbar superior no necesita cambios */}
      <Navbar bg="dark" variant="dark" expand="lg" id="my-nav">
          <Navbar.Brand className="app-logo" href="/">
              <img
                src={logoEd}
                width="40"
                height="50"
                className="d-inline-block align-center"
                alt="React Bootstrap logo"
              />{' '}
              <strong>Asistente Virtual Robótico: Elaine Assistant</strong>
          </Navbar.Brand>
      </Navbar>

      {/* La Sidebar con las rutas corregidas */}
      <div className='sidebar'>
        <CDBSidebar textColor="#333" backgroundColor="#f0f0f0">
            <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
              Ruta de Navegación
            </CDBSidebarHeader>
            <CDBSidebarContent>
              <CDBSidebarMenu>
                {/* Esta ruta ahora apunta a la raíz del proyecto de mecatrónica */}
                <NavLink to="/mechatronics">
                  <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
                </NavLink>
                {/* Esta es una ruta anidada, relativa al padre */}
                <NavLink to="/mechatronics/chatbot">
                  <CDBSidebarMenuItem icon="laptop">Conversación</CDBSidebarMenuItem>
                </NavLink>
              </CDBSidebarMenu>
            </CDBSidebarContent>
          </CDBSidebar>
      </div>
    </div>
  );
};

export default Navigation;