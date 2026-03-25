//import { v4 as uuid } from "uuid";
import mysql from "mysql2/promise";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

//puertos
const app = express();
const port = 5000

//restricciones
app.use(bodyParser.json())
app.use(cors())

//base de datos
const pool = mysql.createPool ({
        host: "127.0.0.1",
        user: "movil",
        database: "movil",
        password: "movil",
        waitForConnections: true,
        connectionLimit: 10,
        enableKeepAlive: true,
    }
);

(async () => {
    try {
        const conn = await pool.getConnection()
        conn.release()
    } catch (error) {
        console.log(`Hubo un error al conectarse, ${error}...`)
        process.exit(1);
    }
})()

//Endpoint
app.get("/", (req, res) => {
        res.send("Hola mundo")
    }
)

app.get("/alumno", async (req, res) => {
    try {
        const sql = "SELECT * FROM alumnos_mov";
        const [rows] = await pool.query(sql);
        return res.status(200).send({ result:rows,  });
    } catch (err) {
        return res.status(500).send({ error: err.message || err });
    }
});

//entrada de datos
app.post("/alumno/agregar", async (req,res) => {
    try {
        const { matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, contrasenha, nombreContacto, telefonoContacto, tipoSangre } = req.body;
        //const id = uuid()
        const sql = "INSERT INTO alumnos_mov (matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, contrasenha, nombreContacto, telefonoContacto, tipoSangre) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const [result] = await pool.query(sql, [matricula, aPaterno, aMaterno, nombre, sexo, dCalle, dNumero, dColonia, dCodigoPostal, aTelefono, aCorreo, aFacebook, aInstagram, contrasenha, nombreContacto, telefonoContacto, tipoSangre]);
        return res.status(200).send({ result })
    } catch (err) {
        return res.status(500).send({error: err.message || err})
    }
});

app.post("/alumno/borrar", async (req,res) => {
    try {
        const {id} = req.body;
        if (!id) {
            return res.status(400).send({error: "No se han insertado los datos correspondientes, inténtelo de nuevo"})
        } else {
            const sql = "DELETE FROM alumnos_mov WHERE id = ?";
            const [result] = await pool.query(sql, [id])
            return res.status(200).send({ result })
        }
    } catch (err) {
        return res.status(500).send({error: err.message || err})
    }
});

app.post("/alumno/modificar", async (req,res) => {
    try {
        const {id, nombre, direccion, telefono} = req.body;
        if ((id === undefined || id === null || id === "") || !nombre || !direccion || !telefono) {
            return res.status(400).send({error: "No se han insertado los datos correspondientes, inténtelo de nuevo"})
        } else {
            const sql = "UPDATE alumnos_mov SET nombre = ?, direccion = ?, telefono = ? WHERE id = ?";
            const [result] = await pool.query(sql, [nombre, direccion, telefono, id])
            if (result.affectedRows > 0) { 
                return res.status(200).send({ result }); 
            } else { 
                return res.status(404).send({ error: "No se encontró el alumno con ese ID" }); 
            }
        }
    } catch (err) {
        return res.status(500).send({error: err.message || err})
    }
});

app.post("/alumno/buscar", async (req,res) => {
    try {
        const {id} = req.body;
        if (id === undefined || id === null || id === "") {
            return res.status(400).send({error: "No se han insertado los datos correspondientes, inténtelo de nuevo"})
        } else {
            const sql = "SELECT * FROM alumnos_mov WHERE id = ?";
            const [result] = await pool.query(sql, [id])
            if (result.length == 0) {
                return res.status(401).send({ error: "No se encontró el alumno con ese ID" }); 
            } else {
                return res.status(200).send({ result })
            }
        }
    } catch (err) {
        return res.status(500).send({error: err.message || err})
    }
});

//si no aparece
app.all("/*splat", (req,res) => {
    return res.status(404).send({mensaje:"La ruta no existe"})
})

//escuchar el puerto
console.log("Antes de app.listen");
app.listen(port, (err) => {
        if (err) {
            console.log(`Error al escuchar: ${err}`)
        } else {
            console.log(`Escuchando el puerto ${port}...`)
        }
    }
)
console.log("Después de app.listen");