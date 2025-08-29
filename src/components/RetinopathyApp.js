import React, { useState } from 'react';
import { 
  Container, Row, Col, Navbar, Nav, Card, Button, 
  ProgressBar, Badge, Form, Image, Spinner
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function RetinopathyApp() {
  const [imagePreview, setImagePreview] = useState(null);
  const [predictionImages, setPredictionImages] = useState([]);
  const [detectedLessions, setDetectedLessions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [totalDetections, setTotalDetections] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [lessionsConfidence, setLessionsConfidence] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Nuevo estado
  const [loadingPredict, setLoadingPredict] = useState(false); // Estado para el círculo de carga
  const [loadingSegment, setLoadingSegment] = useState(false); // Estado para el círculo de carga

  const classDescriptions = {
    0: "No DR - No hay signos de retinopatía diabética.",
    1: "Mild - Retinopatía diabética leve.",
    2: "Moderate - Retinopatía diabética moderada.",
    3: "Severe - Retinopatía diabética severa.",
    4: "Proliferative DR - Retinopatía diabética proliferativa.",
  };

  const lesionTypes = {
    0: { name: "Microaneurismas", color: "rgb(255, 0, 0)" },
    1: { name: "Hemorragias", color: "rgb(128, 0, 0)" },
    2: { name: "Exudados duros", color: "rgb(0, 0, 255)" },
    3: { name: "Exudados blandos", color: "rgb(255, 192, 203)" },
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guardar el archivo en el estado
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null); // Limpiar archivo
    setPredictionImages([]);
    setPrediction(null);
    setTotalDetections(null);
    setConfidence(null);
    setLessionsConfidence(null);
    setDetectedLessions([]);
  };

  const handlePredict = async () => {
    if (!selectedFile) { // Usar el estado en lugar de la referencia
      alert("Por favor, sube una imagen primero.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile); // Usar el archivo guardado en el estado
  
    try {
      setLoadingPredict(true); // Mostrar círculo de carga
      setLoadingSegment(true); // Mostrar círculo de carga

      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Error al realizar la predicción");
      }
  
      const result = await response.json();

      setLoadingPredict(false); // Ocultar círculo de carga

      // Extraer datos de clasificación
      const predictedClass = result.classification.predicted_class;
      const predictedConfidence = result.classification.confidence;

      // Extraer datos de detección
      const detectionBoxes = result.detections.boxes;
      const totalDetections = result.detections.total_detections;
      const averageConfidence = result.detections.average_confidence;
      const detectionsByClass = result.detections.detections_by_class;


      // Actualizar estados con la información de clasificación
      setPrediction(predictedClass);
      setConfidence(Number((predictedConfidence * 100).toFixed(2)));
      setTotalDetections(totalDetections);

      // Actualizar estados con la información de detección
      setLessionsConfidence(Number((averageConfidence * 100).toFixed(2)));

      // Transformar detecciones por clase al formato esperado por el componente
      const detectionsArray = Object.keys(detectionsByClass).map(key => ({
        tipo: key,
        cantidad: detectionsByClass[key]
      }));
      setDetectedLessions(detectionsArray);

      const segmentFormData = new FormData();
      segmentFormData.append("file", selectedFile);
      segmentFormData.append("detections", JSON.stringify(detectionBoxes));

      const segmentResponse = await fetch("http://127.0.0.1:8000/segment-sam/", {
        method: "POST",
        body: segmentFormData,
      });

      if (!segmentResponse.ok) {
        throw new Error("Error al realizar la segmentación");
      }

      // Procesar la imagen segmentada
      const segmentedBlob = await segmentResponse.blob();
      const segmentedImageUrl = URL.createObjectURL(segmentedBlob);

      setPredictionImages({
        "Imagen Original": imagePreview,
        "Imagen Segmentada": segmentedImageUrl,
      });

      setSelectedPrediction(segmentedImageUrl);

    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar la imagen. Inténtalo de nuevo.");
    } finally {
      setLoadingSegment(false); // Ocultar círculo de carga
      setLoadingPredict(false); // Ocultar círculo de carga
    }
  };

  const handlePredictionChange = (predictionKey) => {
    setSelectedPrediction(predictionImages[predictionKey]);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <i className="bi bi-eye-fill me-2 fs-4"></i>
            <span className="fw-bold">RetinaScan</span>
          </Navbar.Brand>
          <div className="text-white fs-5 d-none d-md-block">Detección de Retinopatía Diabética</div>
          <div>
            <Button variant="primary" className="rounded-circle me-2">
              <i className="bi bi-info"></i>
            </Button>
            <Button variant="primary" className="rounded-circle">
              <i className="bi bi-gear"></i>
            </Button>
          </div>
        </Container>
      </Navbar>
      
      {/* Main Content */}
      <div className="flex-grow-1 bg-light py-4">
        <Container className="my-3">
          <Card className="shadow border-0 overflow-hidden">
            {/* Step Indicator */}
            <div className="bg-light border-bottom p-3">
              <Row className="justify-content-center">
                <Col md={8}>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>1</div>
                      <span className="ms-2 text-primary fw-medium">Subir imagen</span>
                    </div>
                    <i className="bi bi-chevron-right mx-3 text-secondary"></i>
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${imagePreview ? 'bg-primary text-white' : 'bg-secondary text-light'}`} style={{width: '35px', height: '35px'}}>2</div>
                      <span className={`ms-2 ${imagePreview ? 'text-primary' : 'text-secondary'} fw-medium`}>Análisis</span>
                    </div>
                    <i className="bi bi-chevron-right mx-3 text-secondary"></i>
                    <div className="d-flex align-items-center">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${prediction !== null ? 'bg-primary text-white' : 'bg-secondary text-light'}`} style={{width: '35px', height: '35px'}}>3</div>
                      <span className={`ms-2 ${prediction !== null ? 'text-primary' : 'text-secondary'} fw-medium`}>Resultados</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            
            {/* Upload Section */}
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-semibold text-dark mb-4">Cargue una imagen de fondo de ojo para su análisis</h2>
                
                {!imagePreview ? (
                  <div className="mx-auto" style={{maxWidth: '500px'}}>
                    <div className="border border-2 border-primary rounded-3 p-5 bg-light border-dashed">
                      <i className="bi bi-cloud-arrow-up fs-1 text-primary mb-3"></i>
                      <p className="text-primary fw-medium mb-2">Arrastre una imagen o haga clic para seleccionar</p>
                      <p className="text-muted small">Formatos aceptados: JPG, PNG (máx. 10MB)</p>
                      <Form.Control 
                        type="file" 
                        className="d-none" 
                        id="fileUpload" 
                        accept=".jpg,.jpeg,.png" 
                        onChange={handleImageChange}
                      />
                      <Button variant="outline-primary" onClick={() => document.getElementById('fileUpload').click()}>
                        Seleccionar archivo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column align-items-center">
                    <div className="position-relative mb-4" style={{maxWidth: '400px'}}>
                      <Image 
                        src={imagePreview} 
                        alt="Fondo de ojo" 
                        className="img-fluid rounded border shadow-sm" 
                      />
                      <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-2 rounded-circle" onClick={handleRemoveImage}>
                        <i className="bi bi-x"></i>
                      </Button>
                    </div>
                    
                    <div className="d-flex gap-3 mb-3">
                      <Button variant="outline-danger" onClick={handleRemoveImage}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Cambiar
                      </Button>
                      <Button variant="success" className="px-4" onClick={handlePredict} disabled={!selectedFile}>
                        Analizar
                        <i className="bi bi-chevron-right ms-2"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
            
            {(prediction !== null || loadingPredict) && (
              <>
                {/* Results Section */}
                <div className="border-top bg-light p-4">
                  <div className="mx-auto" style={{maxWidth: '900px'}}>
                    {loadingPredict ? (
                      // Estado de carga para la predicción inicial
                      <Card className="mb-4 border shadow-sm">
                        <Card.Body className="p-5">
                          <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
                            <h4 className="mt-4 fw-medium text-primary">Analizando imagen...</h4>
                            <p className="text-muted">Estamos procesando su imagen para detectar signos de retinopatía diabética.</p>
                          </div>
                        </Card.Body>
                      </Card>
                    ) : (
                      // Resultados de la predicción
                      <Card className="mb-4 border shadow-sm">
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-warning bg-opacity-25 p-2 rounded-circle me-3">
                              <i className="bi bi-exclamation-triangle text-warning fs-5"></i>
                            </div>
                            <div>
                              <h3 className="fs-4 fw-bold mb-0">{classDescriptions[prediction]}</h3>
                            </div>
                          </div>
                          
                          <Row className="mt-4">
                            <Col md={6}>
                              <div className="bg-light p-3 rounded">
                                <h5 className="text-muted small fw-medium mb-2">Anomalías detectadas: {totalDetections}</h5>
                                <div className="d-flex flex-wrap gap-2">
                                  {detectedLessions.map((lesion, index) => (
                                    <Badge key={index} bg='primary' className="bg-opacity-75 py-2 px-3">
                                      {lesionTypes[lesion.tipo].name}: {lesion.cantidad}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="bg-light p-3 rounded">
                                <h5 className="text-muted small fw-medium mb-2">Confianza de predicción de diagnóstico:</h5>
                                <div className="d-flex align-items-center">
                                  <div className="flex-grow-1 me-2">
                                    <ProgressBar now={confidence} variant="primary" style={{height: '10px'}} />
                                  </div>
                                  <span className="fw-bold text-primary">{confidence}%</span>
                                </div>
                                <h5 className="text-muted small fw-medium mb-2 mt-2">Confianza de predicción de anomalías:</h5>
                                <div className="d-flex align-items-center">
                                  <div className="flex-grow-1 me-2">
                                    <ProgressBar now={lessionsConfidence} variant="primary" style={{height: '10px'}} />
                                  </div>
                                  <span className="fw-bold text-primary">{lessionsConfidence}%</span>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    )}
                    
                    {/* Image Comparison or Loading State */}
                    {loadingSegment || loadingPredict ? (
                      <Card className="border shadow-sm mb-4">
                        <Card.Body className="p-5">
                          <div className="d-flex flex-column align-items-center justify-content-center py-5">
                            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
                            <h4 className="mt-4 fw-medium text-primary">Procesando imágenes...</h4>
                            <p className="text-muted">Estamos analizando y segmentando su imagen. Esto podría tardar unos instantes.</p>
                          </div>
                        </Card.Body>
                      </Card>
                    ) : (
                      <>
                        <h4 className="fw-semibold mb-3">Análisis de imagen</h4>
                        <Row className="g-4">
                          <Col md={6}>
                            <Card className="h-100 border shadow-sm">
                              <Card.Body className="p-3">
                                <div className="mb-3">
                                  <Image 
                                    src={imagePreview} 
                                    alt="Imagen original" 
                                    className="img-fluid rounded w-100" 
                                  />
                                </div>
                                <div className="text-center">
                                  <Badge bg="primary" className="py-2 px-3">Imagen Original</Badge>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                          
                          <Col md={6}>
                            <Card className="h-100 border shadow-sm">
                              <Card.Body className="p-3">
                                <div className="mb-3">
                                  <Image 
                                    src={selectedPrediction} 
                                    alt="Imagen segmentada" 
                                    className="img-fluid rounded w-100" 
                                  />
                                </div>
                                <div className="text-center">
                                  <Badge bg="success" className="py-2 px-3">Imagen Segmentada</Badge>
                                </div>

                                {/* Color Legend */}
                                <div className="mt-3 p-2 border rounded bg-light">
                                  <p className="text-muted small mb-2">Distinción de anomalías oculares:</p>
                                  <div className="d-flex flex-wrap gap-2">
                                    {Object.entries(lesionTypes).map(([key, value]) => (
                                      <div key={key} className="d-flex align-items-center me-2">
                                        <div 
                                          className="rounded-circle me-1" 
                                          style={{
                                            width: '12px', 
                                            height: '12px',
                                            backgroundColor: value.color,
                                            border: '1px solid rgba(0,0,0,0.2)'
                                          }}
                                        ></div>
                                        <span className="small">{value.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </>
                    )}
                    {/* <div className="mt-4 text-center">
                      <Button variant="outline-secondary" className="me-2">
                        <i className="bi bi-file-earmark-pdf me-2"></i>
                        Exportar informe
                      </Button>
                      <Button variant="primary">
                        <i className="bi bi-save me-2"></i>
                        Guardar resultados
                      </Button>
                    </div> */}
                  </div>
                </div>
              </>
            )}
          </Card>
        </Container>
      </div>
      
      {/* Footer */}
      <footer className="bg-dark text-white py-3">
        <Container className="text-center">
          <p className="mb-1">© 2025 RetinaScan - Sistema de detección de Retinopatía Diabética</p>
          <p className="text-muted small">Esta herramienta es un auxiliar diagnóstico y no reemplaza la evaluación de un especialista</p>
        </Container>
      </footer>
    </div>
  );
}

export default RetinopathyApp;