import { useState, useEffect } from "react";
import { Button, Container, Row, Col, Form, Table, Alert } from 'react-bootstrap';
import App from "../App.jsx"
//import "./agregar.css"
import axios from "axios";

const agregar = () => {
    const valorinicial = {
        id: "",
        nombre: "",
        direccion: "",
        telefono: "",
    };

    const initialstate =  {
        view:false,
        status:false,
        title:"",
        desc:"",
    };

    const [show, setShow] = useState(initialstate);
    const [vista, setVista] = useState("Agregar");
    const [datos, setDatos] = useState(valorinicial);
    const [alumnos, setAlumnos] = useState([]);
    const [activo, setActivo] = useState(false);

    if (vista === "App") {
        return <App/>
    };

    useEffect(() => {
        getAlumnos();
    }, [])

    const getAlumnos = async () =>{
        const response = await axios.get("http://127.0.0.1:5000/alumnos");
        setAlumnos(response.data.result);
        console.log(response);
    };

    const addAlumno = async (data) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/alumno/agregar", data);
            console.log(response);
            if (response.status == 200) {
                setDatos(valorinicial)
                getAlumnos();
                handleAlerta({
                    view:true,
                    status:false,
                    title:"Status de operación",
                    desc:"Se añadió el alumno con éxito",
                });
            } else {
                handleAlerta({
                    view:true,
                    status:true,
                    title:"Status de operación",
                    desc:`La operación falló, ${response.data.error || response.statusText}`,
                });
            }
        } catch (error) {
            handleAlerta({
                view:true,
                status:true,
                title:"Status de operación",
                desc:`La operación falló, ${error.response?.data?.error || error.message}`,
            });
        }
    };

    const modifyAlumno = async (data) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/alumno/modificar", data);
            console.log(response);
            if (response.status == 200 && response.data.result.affectedRows > 0) {
                setDatos(valorinicial)
                getAlumnos();
                handleAlerta({
                    view:true,
                    status:false,
                    title:"Status de operación",
                    desc:"Se modificó el alumno con éxito",
                });
            } else {
                handleAlerta({
                    view:true,
                    status:true,
                    title:"Status de operación",
                    desc:`La operación falló, ${response.data.error || response.statusText}`,
                });
            }
        } catch (error) {
            handleAlerta({
                view:true,
                status:true,
                title:"Status de operación",
                desc:`La operación falló, ${error.response?.data?.error || error.message}`,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(datos);
        addAlumno(datos)
    };

    const handleChange = (e) => {
        const {name, value} = e.target
        setDatos({...datos, [name]:value})
    };

    const handleCancelar = (e) => {
        if (activo) {
            setActivo(false);
        }
        setDatos(valorinicial);
        getAlumnos();
    }

    const handleBuscar  = async (id) => {
        try {
            const ide = {id}
            const response = await axios.post("http://127.0.0.1:5000/alumno/buscar", ide);
            if (response.data.result.length == 0 || response.status != 200) {
                handleAlerta({
                    view:true,
                    status:true,
                    title:"Status de operación",
                    desc:`La operación falló por un error de tabla, inténtelo de nuevo`,
                });
            } else {
                const alumno = response.data.result[0]
                setDatos({
                    id:alumno.id,
                    nombre:alumno.nombre,
                    direccion:alumno.direccion,
                    telefono:alumno.telefono
                })
            }
            setActivo(true);
        } catch (error) {
            handleAlerta({
                view:true,
                status:true,
                title:"Status de operación",
                desc:`La operación falló, ${error.response?.data?.error || error.message}`,
            });
        }
    };

    const handleEditar = (e) => {
        e.preventDefault();
        modifyAlumno(datos);
        setActivo(false);
    };

    const handleEliminar = async (id) => {
        try {
            const data = {id};
            const response = await axios.post("http://127.0.0.1:5000/alumno/borrar", data);
            console.log(response);
            if (response.status == 200) {
                setDatos(valorinicial)
                getAlumnos();
                handleAlerta({
                    view:true,
                    status:false,
                    title:"Status de operación",
                    desc:"Se borró el alumno con éxito",
                });
            } else {
                handleAlerta({
                    view:true,
                    status:true,
                    title:"Status de operación",
                    desc:`La operación falló, ${response.data.error || response.statusText}`,
                });
            }
        } catch (error) {
            handleAlerta({
                view:true,
                status:true,
                title:"Status de operación",
                desc:`La operación falló, ${error.response?.data?.error || error.message}`,
            });
        }
    };

    const handleAlerta = (inicial) => {
        setShow(inicial);
    };

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
                <Form.Group className="mb-3" controlId="address">
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
                            <Button variant="primary" type="submit" onClick={handleSubmit}> Agregar </Button> {"  "}
                        </>
                    ) : (
                        <>
                            <Button variant="primary" type="submit" onClick={handleEditar}> Modificar </Button> {"  "}
                        </>
                    )
                }
                <Button variant="secondary" type="reset" onClick={handleCancelar}> Cancelar </Button>
            </Form> <br/><br/>
            <Row>
                <Col>                    
                    <Alert show={show.view} variant={ !show.status ? "success" : "danger"}>
                        <Alert.Heading>{show.title}</Alert.Heading>
                        <p>{show.desc}</p>
                        <hr />
                        <div className="d-flex justify-content-end">
                        <Button onClick={() => setShow(initialstate)} variant={ !show.status ? "outline-success" : "outline-danger"}>
                            Cerrar
                        </Button>
                        </div>
                    </Alert>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map((alumnos) => (
                        <tr key={alumnos.id}>
                            <td>{alumnos.id}</td>
                            <td>{alumnos.nombre}</td>
                            <td>{alumnos.direccion}</td>
                            <td>{alumnos.telefono}</td>
                            <td><Button variant="danger" onClick={() => handleEliminar(alumnos.id)}>Borrar</Button> {"   "}
                            <Button variant="warning" onClick={() => handleBuscar(alumnos.id)}>modificar</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default agregar;