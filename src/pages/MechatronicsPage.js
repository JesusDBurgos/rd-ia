import React from 'react';
    import { Container, Button } from 'react-bootstrap';
    import { Link } from 'react-router-dom';
    import MechatronicsCarousel from '../components/MechatronicsCarousel';

    function MechatronicsPage() {
      return (
        <Container className="py-4">
          {/* <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold">Galería de Mecatrónica UNAB</h1>
            <Link to="/">
              <Button variant="outline-primary">
                <i className="bi bi-arrow-left me-2"></i>Volver al Portafolio
              </Button>
            </Link>
          </div> */}
          <MechatronicsCarousel />
        </Container>
      );
    }

    export default MechatronicsPage;