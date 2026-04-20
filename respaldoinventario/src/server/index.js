//import { v4 as uuid } from "uuid";
import mysql from "mysql2/promise";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

//puertos
const app = express();
const port = 5000

//restricciones
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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

//Búsqueda de datos
app.get("/producto", async (req, res) => {
    try {
        const sql = "SELECT * FROM productos";
        const [rows] = await pool.query(sql);
        return res.status(200).send({ result:rows,  });
    } catch (err) {
        return res.status(500).send({ error: err.message || err });
    }
});

//entrada de datos
app.post("/producto", async (req,res) => {
    try {
        const {nombre, precio, cantidad, categoria, imagen} = req.body;
        //const id = uuid()
        if (!nombre?.trim() || !Number.isFinite(precio) || !Number.isFinite(cantidad) || !categoria.trim()) {
            console.log(nombre, precio, cantidad, categoria, imagen);
            return res.status(400).send({error: "No se han insertado los datos correspondientes, inténtelo de nuevo"});
        } else {
            const sql = "INSERT INTO productos (nombre, precio, cantidad, categoria, imagen) VALUES (?,?,?,?,?)";
            const [result] = await pool.query(sql, [nombre, precio, cantidad, categoria, imagen])
            return res.status(201).send({ result })
        }
    } catch (err) {
        console.log(err.message || err )
        return res.status(500).send({error: err.message || err})
    }
});

app.get("/producto/:q", async (req,res) => {
    try {
        const {q} = req.params;
        const sql = "SELECT * FROM productos WHERE nombre LIKE ?"
        const [result] = await pool.query(sql, [`%${q}%`]);
        if (result.length == 0) {
            return res.status(404).send({ error: "No se encontró el producto" }); 
        } else {
            return res.status(200).send({ result })
        }
    } catch (err) {
        return res.status(500).send({error: err.message || err})
    }
});

app.delete("/producto/:id", async (req,res) => {
    try {
        const {id} = req.params;
        if (!id) {
            return res.status(401).send({error: "No se han insertado los datos correspondientes, inténtelo de nuevo"})
        } else {
            const sql = "DELETE FROM productos WHERE id = ?";
            const [result] = await pool.query(sql, [id]);
            if (result.affectedRows > 0) {
                return res.status(200).send({ result })
            } else {
                return res.status(404).send({error: "ID desconocida"})
            }
        }
    } catch (err) {
        return res.status(500).send({error: err.message || err})
    }
});

app.put("/producto/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {nombre, precio, cantidad, categoria, imagen} = req.body;
        if ((id === undefined || id === null || id === "") || !nombre || !precio || !cantidad || !categoria) {
            return res.status(401).send({error: "No se han insertado los datos correspondientes, inténtelo de nuevo"})
        } else {
            //"INSERT INTO productos (nombre, precio, cantidad, categoria, imagen) VALUES (?,?,?,?,?)";
            const sql = "UPDATE productos SET nombre = ?, precio = ?, cantidad = ?, categoria = ?, imagen = ? WHERE id = ?";
            const [result] = await pool.query(sql, [nombre, precio, cantidad, categoria, imagen, id])
            if (result.affectedRows > 0) { 
                return res.status(200).send({ result }); 
            } else { 
                return res.status(404).send({ error: "No se encontró el producto con ese ID" }); 
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

/*
app.on("error", (err) => {
  console.error("Error en el servidor:", err);
});
*/