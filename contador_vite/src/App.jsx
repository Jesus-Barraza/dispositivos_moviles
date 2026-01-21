import { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './App.css';

function App() {
  

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col>
          <h1>Contador</h1><br></br>
          <Button variant="primary">Agregar +1</Button> <Button variant="danger"> Retirar -1</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default App
