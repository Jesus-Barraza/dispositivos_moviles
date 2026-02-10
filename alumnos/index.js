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
        host: "localhost",
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
    }
})()

//Endpoint
app.get("/", (req, res) => {
        res.send("Hola mundo")
    }
)

app.get("/alumnos", (req,res) => {
    const sql = "SELECT * FROM alumnos"
    pool.query(sql, (err, result, fields) => {
        if (!err) {
            res.status(200).send({result})
        } else {
            res.status(510).send({err})
        }
    });
});

//si no aparece
app.all("/splat", (req,res) => {
    res.status(100).send("La ruta no existe")
})

//escuchar el puerto
app.listen(port, (err) => {
        if (err) {
            console.log(`Error al escuchar: ${err}`)
        } else {
            console.log(`Escuchando el puerto ${port}...`)
        }
    }
)

