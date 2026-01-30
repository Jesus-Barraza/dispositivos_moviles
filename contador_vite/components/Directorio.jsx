import { useState } from "react";
import { Button, Container, Row, Col, Form, Table } from 'react-bootstrap';
import Inicio from "./Inicio.jsx"
import "./Directorio.css"

const Directorio = () => {
    const [vista, setVista] = useState("directorio");
    const [tabla, setTabla] = useState([]);
    const [ide, setIde] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [datos, setDatos] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
    });

    if (vista === "inicio") {
        return <Inicio/>
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId !== null) {
            // Update existing entry
            setTabla(prev => prev.map(item => item.id === editingId ? {
                ...item,
                name: datos.nombre,
                place: datos.direccion,
                phone: datos.telefono
            } : item));
            setEditingId(null);
        } else {
            const alumnos = {
                id: ide,
                name: datos.nombre,
                place: datos.direccion,
                phone: datos.telefono
            }

            setTabla(prev => [...prev, alumnos]);
            setIde(prev => prev + 1);

            console.log("Form Data:", alumnos);
        }

        setDatos({ nombre: "", direccion: "", telefono: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatos((prev) => ({
        ...prev,
        [name]: value
        }));
    };

    const handleModify = (id) => {
        // Start editing: populate form with selected row's data
        const item = tabla.find(t => t.id === id);
        if (!item) return;
        setEditingId(id);
        setDatos({ nombre: item.name, direccion: item.place, telefono: item.phone });
        
    }

    return (
        <Container>
            <Row>
                <Col>
                <Button variant="secondary" onClick={() => setVista("inicio")}>Regresar al inicio</Button><br/><br/><br/>
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
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
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
                            <td onClick={() => setTabla(prev => prev.filter(t => t.id !== tabla.id))} color={"#d82323"}>Borrar</td>
                            <td onClick={() => handleModify(tabla.id)} color={"#fffb1a"}>modificar</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default Directorio;