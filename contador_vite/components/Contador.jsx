import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Container, Row, Col, Badge } from 'react-bootstrap';
import Inicio from "./Inicio.jsx"

//gane un punto yay

function Contador() {
    const [cont, setCont] = useState(0);

    const [vista, setVista] = useState("contador");

    const minus = () => {
        setCont(prev => {
            if (prev <= -10) {
            toast.error('No puede bajar de -10');
            return prev;
            }
            return prev - 1;
        });
    };

    const plus = () => {
        setCont(prev => {
            if (prev >= 10) {
            toast.error('No puede subir de 10');
            return prev;
            }
            return prev + 1;
        });
    };

    const reset = ()=> {
        setCont((prev) => 0);
        console.log(cont);
    };   

    if (vista === "inicio") {
        return <Inicio/>
    }

    return(
        <Container fluid className="py-4">
            <Row className="justify-content-center">
                <Col>
                    <h1>Contador</h1><br/><br/>
                    <Badge bg="primary" className="fs-4 px-4 py-2"> El contador cuenta: {cont} </Badge> <br/><br/>
                    <Toaster/>
                    <Button variant="success" onClick={() => plus()}>Agregar +1</Button> {' '} <Button variant="danger" onClick={minus}> Retirar -1</Button>
                </Col>
          </Row>
          <Row>
            <Col>
                <Button variant="warning" onClick={() => reset()}>Reiniciar</Button>
            </Col>
          </Row>
          <Row>
            <Col>
                <br/><br/><br/>
                <Button variant="secondary" onClick={() => setVista("inicio")}> Regresar al inicio</Button>
            </Col>
          </Row>
        </Container>
    )
}

export default Contador;