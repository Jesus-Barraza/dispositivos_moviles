import { useState } from "react";
import { Button, Container, Row, Col, Badge, Card, Form } from 'react-bootstrap';
import Inicio from "./Inicio.jsx"

function Tareas () {
    const [contador, setCont] = useState(0);

    const [tasks, setTasks] = useState([])

    const [Datos, setDatos] = useState({
        tarea: "",
        desc: ""
    });

    const [imagen, setImagen] = useState(null);
    const [vista, setVista] = useState("tareas");

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload

        const nuevaTarea = {
            id: contador,
            title: Datos.tarea,
            descripcion: Datos.desc,
            imagen: imagen
        }

        setTasks(prev => [...prev, nuevaTarea]);
        setDatos({ tarea: "", desc: "" });
        setImagen(null);
        setCont(prev => prev + 1);

        console.log("Form Data:", Datos);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file" && files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagen(event.target.result);
            };
            reader.readAsDataURL(files[0]);
        } else {
            setDatos((prev) => ({
            ...prev,
            [name]: value
            }));
        }
    };

    if (vista === "inicio") {
        return <Inicio/>
    }

    return(
        <Container>
            <Row>
                <Col>
                    <Button variant="secondary" onClick={() => setVista("inicio")}> volver al inicio </Button> <br/><br/><br/>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="Tareas">
                            <Form.Label>Ingrese la tarea a registrar</Form.Label>
                            <Form.Control
                                name="tarea" 
                                size="lg" 
                                placeholder="Ingresar la tarea" 
                                type="text"
                                value={Datos.tarea}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="Descripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Ingresa la descripción de la tarea"
                                type="text"
                                name="desc"
                                value={Datos.desc}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="Image" className="mb-3">
                            <Form.Label>Imagen (opcional)</Form.Label>
                            <Form.Control 
                                type="file" 
                                name="imagen" 
                                onChange={handleChange} 
                                accept="image/*" 
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Registrar
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row className="mt-4">
                {tasks.map((tarea, index) => (
                    <Col xs={8} md={8} lg={6} key={tarea.id} className="mb-3">
                        <Card width="120" className="w-100">
                            <Card.Body>
                            {tarea.imagen && <Card.Img variant="top" src={tarea.imagen} />}
                            <Card.Title>
                                {index + 1}. {tarea.title}
                            </Card.Title>
                            <Card.Text>
                                {tarea.descripcion}
                            </Card.Text>
                            <Button
                                variant="danger"
                                onClick={() =>
                                setTasks(prev => prev.filter(t => t.id !== tarea.id))
                                }
                            >
                                Eliminar
                            </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
                </Row>
        </Container>
    )
}

export default Tareas;