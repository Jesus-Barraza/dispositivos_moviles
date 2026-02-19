import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Table } from 'react-bootstrap';
import App from "../App.jsx"
import "./agregar.css"
import axios from "axios";
import { v4 as uuid } from "uuid";

const agregar = () => {
    const [vista, setVista] = useState("Agregar");
    const [editingId, setEditingId] = useState(null);
    const [datos, setDatos] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
    });
    const [activo, setActivo] = useState(false);
    const [alumnos, setAlumnos] = useState([]);
    const [tabla, setTabla] = useState([])

    if (vista === "App") {
        return <App/>
    };

    useEffect(() => {
        getAlumnos();
    }, [])

    const getAlumnos = async () =>{
        const response = await axios.get("http://127.0.0.1:5000/alumnos");
        console.log(response);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {

    };

    const cancelar = (e) => {
        setActivo(false);
        setDatos({ nombre: "", direccion: "", telefono: "" });
    }

    const handleEditar  = (id) => {
        
    }

    const handleEliminar = (id) => {

    }

    return (
        <Container>
            <Row>
                <Col>
                <Button variant="secondary" onClick={() => setVista("App")}>Regresar al inicio</Button><br/><br/><br/>
                </Col>
            </Row>
            <Form>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre"
                        name="nombre"
                        value={datos.nombre}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="whereyoulive">
                    <Form.Label>direccion</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa tu dirección"
                        name="direccion"
                        value={datos.direccion}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>teléfono</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingresa tu teléfono"
                        name="telefono"
                        value={datos.telefono}
                        onChange={handleChange}
                    />
                    <Form.Text className="text-muted">
                    Cuidado a la hora de escribir tus datos
                    </Form.Text>
                </Form.Group>
                {
                    !activo ? (
                        <>
                            <Button variant="primary" type="submit" onClick={handleSubmit}> Agregar </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="primary" type="submit" onClick={handleSubmit}> Modificar </Button> {" "}
                            <Button variant="secondary" type="submit" onClick={cancelar}> Cancelar </Button>
                        </>
                    )
                }
                
            </Form> <br/><br/>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                    </tr>
                </thead>
                <tbody>
                    {tabla.map((tabla) => (
                        <tr key={tabla.id}>
                            <td>{tabla.id}</td>
                            <td>{tabla.name}</td>
                            <td>{tabla.place}</td>
                            <td>{tabla.phone}</td>
                            <td><Button variant="danger" onClick={() => handleEliminar(tabla.id)}>Borrar</Button> <p/>
                            <Button variant="warning" onClick={() => handleEditar(tabla.id)}>modificar</Button></td>
                            
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default agregar;