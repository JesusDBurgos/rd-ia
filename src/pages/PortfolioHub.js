import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PortfolioHub() {
  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Mi Portafolio de Proyectos</h1>
          <p className="lead text-muted">
            Una colección de aplicaciones y proyectos desarrollados con React.
          </p>
        </div>

        <Row>
          {/* Tarjeta para el Proyecto de Retinopatía */}
          <Col md={6} className="mb-4">
            <Card className="shadow h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h3" className="fw-bold">
                  <i className="bi bi-eye-fill me-2 text-primary"></i>
                  RetinaScan
                </Card.Title>
                <Card.Text className="flex-grow-1">
                  Una herramienta de IA para la detección de Retinopatía Diabética a partir de imágenes de fondo de ojo. Sube una imagen y obtén un análisis detallado.
                </Card.Text>
                <Link to="/retinopathy-scanner">
                  <Button variant="primary" className="mt-auto">
                    Ir a la Aplicación <i className="bi bi-arrow-right"></i>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tarjeta para el Proyecto de Mecatrónica */}
          <Col md={6} className="mb-4">
            <Card className="shadow h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h3" className="fw-bold">
                  <i className="bi bi-gear-wide-connected me-2 text-success"></i>
                  Galería de Mecatrónica
                </Card.Title>
                <Card.Text className="flex-grow-1">
                  Una galería de imágenes visualizando los laboratorios y espacios de Mecatrónica en la UNAB.
                </Card.Text>
                <Link to="/mechatronics">
                  <Button variant="success" className="mt-auto">
                    Ver Galería <i className="bi bi-arrow-right"></i>
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PortfolioHub;