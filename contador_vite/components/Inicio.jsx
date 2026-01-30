import {Container, Button, Row, Col} from "react-bootstrap";
import { useState } from "react";
import Contador from "./Contador.jsx";
import Hola from "./Hola.jsx";
import Tareas from "./Tareas.jsx";
import Directorio from "./Directorio.jsx"
import "./Inicio.css"

function Inicio() {
    const [vista, setVista] = useState('inicio');

    if (vista === 'contador') {
        return <Contador />;
    }
    
    if (vista === 'tareas') {
        return <Tareas />;
    }

    if (vista === "directorio") {
        return <Directorio/>
    }

    return(
        <Container>
            <Row>
                <Col>
                    <h2>Bienvenido</h2> <br/>
                    <h4>Elige tu función</h4><br/>

                    <Button variant="primary" onClick={() => setVista('contador')}> Ir al contador </Button> {" "} <Button variant="primary" onClick={() => setVista('tareas')}>Ir al menú de tareas</Button> {" "} <Button variant="primary" onClick={() => setVista('directorio')}>Ir al menú de directorios</Button> <br/><br/><br/>
                    <Hola/>
                </Col>
            </Row>
        </Container>
    )
}

export default Inicio;