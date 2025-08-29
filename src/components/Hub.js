import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // ¡Importante para la navegación!

function Hub() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container>
        <Card className="text-center shadow-lg border-0">
          <Card.Header as="h1" className="bg-primary text-white">
            <i className="bi bi-eye-fill me-2"></i>
            Bienvenido a RetinaScan
          </Card.Header>
          <Card.Body className="p-5">
            <Card.Title as="h2" className="mb-4">
              Sistema de Detección de Retinopatía Diabética
            </Card.Title>
            <Card.Text className="mb-4">
              Esta herramienta utiliza inteligencia artificial para analizar imágenes de fondo de ojo
              y ayudar en la detección temprana de la retinopatía diabética.
            </Card.Text>
            
            {/* Este es el botón que lleva a tu aplicación */}
            <Link to="/analisis">
              <Button variant="success" size="lg">
                Comenzar Análisis <i className="bi bi-arrow-right-circle ms-2"></i>
              </Button>
            </Link>

          </Card.Body>
          <Card.Footer className="text-muted">
            Un proyecto para la innovación en el diagnóstico médico.
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
}

export default Hub;