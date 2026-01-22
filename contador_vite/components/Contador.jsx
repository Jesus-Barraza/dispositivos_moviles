import { useState } from 'react';
import { Button, Container, Row, Col, Badge } from 'react-bootstrap';

function Contador() {
    var [cont, setCont] = useState(10);

    function minus() {
        setCont((prev) => prev - 1);
        console.log(cont);
    }

    const plus = ()=> {
        setCont((prev) => prev + 1);
        console.log(cont);
    }

    return(
        <Container fluid className="py-4">
            <Row className="justify-content-center">
                <Col>
                    <h1>Contador</h1><br/>
                    <Badge bg="primary" className="fs-4 px-4 py-2"> El contador cuenta: {cont} </Badge> <br/><br/>
                    <Button variant="success" onClick={() => plus()}>Agregar +1</Button> <Button variant="danger" onClick={minus}> Retirar -1</Button>
                </Col>
          </Row>
        </Container>
    )
}

export default Contador;