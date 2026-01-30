import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

const Modificar = ({ isOpen, onClose, task, onSave }) => {
    if (!isOpen || !task) return null;

    const [formData, setFormData] = useState({
        tarea: task.title || "",
        desc: task.descripcion || "",
        imagen: task.imagen || null
    });

    useEffect(() => {
        if (task) {
            setFormData({
                tarea: task.title || "",
                desc: task.descripcion || "",
                imagen: task.imagen || null
            });
        }
    }, [task]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updated = {
            ...task,
            title: formData.tarea,
            descripcion: formData.desc,
            imagen: formData.imagen
        };

        onSave && onSave(updated);
        console.log("Form Data:", formData);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files && files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({ ...prev, imagen: event.target.result }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div style={{ margin: "10% auto", padding: "20px", background: "#fff", width: "50%" }}>
                <Container>
                    <Row>
                        <Col>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="Tareas">
                                    <Form.Label>Ingrese la tarea a registrar</Form.Label>
                                    <Form.Control
                                        name="tarea"
                                        size="lg"
                                        placeholder="Ingresar la tarea"
                                        type="text"
                                        value={formData.tarea}
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
                                        value={formData.desc}
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

                                <div className="d-flex justify-content-end">
                                    <Button variant="secondary" onClick={onClose} className="me-2">Cancelar</Button>
                                    <Button variant="primary" onClick={handleSubmit}>Confirmar cambios</Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}

export default Modificar