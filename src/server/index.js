// server.js
import mysql from "mysql2/promise";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 5000;

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  database: "movil",
  password: "",
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log("Conexión a BD OK");
  } catch (error) {
    console.error("Error al conectarse a la BD:", error);
    process.exit(1);
  }
})();

// Util: detectar si un Buffer contiene bytes de imagen (PNG/JPEG)
function bufferContainsImageBytes(buf) {
  if (!Buffer.isBuffer(buf)) return false;
  const hexStart = buf.slice(0, 4).toString("hex");
  if (hexStart.startsWith("ffd8ff")) return true; // JPEG
  const ascii8 = buf.slice(0, 8).toString("ascii");
  if (ascii8.startsWith("\x89PNG\r\n\x1a\n")) return true; // PNG
  return false;
}

// Root
app.get("/", (req, res) => res.send("Hola mundo"));

// POST /producto - guarda bytes reales en LONGBLOB
app.post("/producto", async (req, res) => {
  try {
    const { nombre, precio, cantidad, categoria, imagen } = req.body;
    if (
      !nombre?.trim() ||
      !Number.isFinite(precio) ||
      !Number.isFinite(cantidad) ||
      !categoria?.trim()
    ) {
      return res
        .status(400)
        .send({ error: "No se han insertado los datos correspondientes" });
    }

    let imagenBuffer = null;
    if (imagen) {
      const cleaned = String(imagen).replace(/\r?\n|\r|\s+/g, "");
      imagenBuffer = Buffer.from(cleaned, "base64");
    }

    const sql =
      "INSERT INTO productos (nombre, precio, cantidad, categoria, imagen) VALUES (?,?,?,?,?)";
    await pool.query(sql, [nombre, precio, cantidad, categoria, imagenBuffer]);
    return res.status(201).send({ status: 201, message: "Producto creado" });
  } catch (err) {
    console.error("POST /producto error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// PUT /producto/:id - actualizar, convierte imagen a bytes si viene
app.put("/producto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, cantidad, categoria, imagen } = req.body;
    if (
      !id ||
      !nombre ||
      !Number.isFinite(precio) ||
      !Number.isFinite(cantidad) ||
      !categoria
    ) {
      return res.status(401).send({ error: "Faltan datos" });
    }

    let imagenBuffer = null;
    if (imagen) {
      const cleaned = String(imagen).replace(/\r?\n|\r|\s+/g, "");
      imagenBuffer = Buffer.from(cleaned, "base64");
    }

    const sql =
      "UPDATE productos SET nombre = ?, precio = ?, cantidad = ?, categoria = ?, imagen = ? WHERE id = ?";
    const [result] = await pool.query(sql, [
      nombre,
      precio,
      cantidad,
      categoria,
      imagenBuffer,
      id,
    ]);
    if (result.affectedRows > 0)
      return res.status(200).send({ status: 200, result });
    return res
      .status(404)
      .send({ status: 404, error: "No se encontró el producto" });
  } catch (err) {
    console.error("PUT /producto/:id error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// GET /producto/detalle/:id
app.get("/producto/detalle/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT * FROM productos WHERE id = ?";
    const [rows] = await pool.query(sql, [id]);

    const productos = rows.map((p) => {
      let imagenBase64 = "";
      if (p.imagen) {
        if (Buffer.isBuffer(p.imagen)) {
          if (bufferContainsImageBytes(p.imagen)) {
            imagenBase64 = p.imagen.toString("base64");
          } else {
            const asText = p.imagen
              .toString("utf8")
              .replace(/\r?\n|\r|\s+/g, "");
            imagenBase64 = asText.startsWith("data:")
              ? asText.split(",")[1]
              : asText;
          }
        } else if (typeof p.imagen === "string") {
          let s = p.imagen.replace(/\r?\n|\r|\s+/g, "");
          if (s.startsWith("data:")) s = s.split(",")[1];
          imagenBase64 = s;
        } else {
          imagenBase64 = "";
        }
      }
      return { ...p, imagen: imagenBase64 };
    });

    if (productos.length === 0)
      return res
        .status(404)
        .send({ status: 404, message: "No se encontró el producto" });
    return res.status(200).send({ status: 200, result: productos });
  } catch (err) {
    console.error("GET /producto/detalle/:id error:", err);
    return res.status(500).send({ status: 500, error: err.message || err });
  }
});

// GET /producto/:nombre
app.get("/producto/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const sql = "SELECT * FROM productos WHERE nombre LIKE ?";
    const [rows] = await pool.query(sql, [`%${nombre}%`]);

    const productos = rows.map((p) => {
      let imagenBase64 = "";
      if (p.imagen) {
        if (Buffer.isBuffer(p.imagen)) {
          if (bufferContainsImageBytes(p.imagen)) {
            imagenBase64 = p.imagen.toString("base64");
          } else {
            const asText = p.imagen
              .toString("utf8")
              .replace(/\r?\n|\r|\s+/g, "");
            imagenBase64 = asText.startsWith("data:")
              ? asText.split(",")[1]
              : asText;
          }
        } else if (typeof p.imagen === "string") {
          let s = p.imagen.replace(/\r?\n|\r|\s+/g, "");
          if (s.startsWith("data:")) s = s.split(",")[1];
          imagenBase64 = s;
        } else {
          imagenBase64 = "";
        }
      }
      return { ...p, imagen: imagenBase64 };
    });

    return res.status(200).send({ status: 200, result: productos });
  } catch (err) {
    console.error("GET /producto/:nombre error:", err);
    return res.status(500).send({ status: 500, error: err.message || err });
  }
});

// DELETE /producto/:id
app.delete("/producto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(401)
        .send({ error: "No se han insertado los datos correspondientes" });
    const sql = "DELETE FROM productos WHERE id = ?";
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows > 0) return res.status(200).send({ result });
    return res.status(404).send({ error: "ID desconocida" });
  } catch (err) {
    console.error("DELETE /producto/:id error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// Endpoint temporal: /diagnose
app.get("/diagnose", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, imagen FROM productos");
    const problemas = [];
    for (const r of rows) {
      if (!r.imagen) continue;
      const buf = Buffer.isBuffer(r.imagen)
        ? r.imagen
        : Buffer.from(String(r.imagen), "utf8");
      const hexStart = buf.slice(0, 4).toString("hex");
      const ascii8 = buf.slice(0, 8).toString("ascii");
      const looksLikeImageBytes =
        hexStart.startsWith("ffd8ff") || ascii8.startsWith("\x89PNG\r\n\x1a\n");
      if (!looksLikeImageBytes) {
        const s = buf.toString("utf8").replace(/\r?\n|\r|\s+/g, "");
        try {
          const once = Buffer.from(s, "base64").toString("utf8").slice(0, 12);
          if (once.startsWith("iVBORw0K") || once.startsWith("/9j/")) {
            problemas.push({ id: r.id, issue: "double-base64" });
          } else {
            problemas.push({ id: r.id, issue: "text-base64" });
          }
        } catch (e) {
          problemas.push({ id: r.id, issue: "unknown", err: e.message });
        }
      }
    }
    return res.status(200).send({ status: 200, problemas });
  } catch (err) {
    console.error("GET /diagnose error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// Endpoint temporal: /repair
app.post("/repair", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, imagen FROM productos");
    const fixes = [];
    for (const r of rows) {
      if (!r.imagen) continue;
      const buf = Buffer.isBuffer(r.imagen)
        ? r.imagen
        : Buffer.from(String(r.imagen), "utf8");
      const hexStart = buf.slice(0, 4).toString("hex");
      const ascii8 = buf.slice(0, 8).toString("ascii");
      const looksLikeImageBytes =
        hexStart.startsWith("ffd8ff") || ascii8.startsWith("\x89PNG\r\n\x1a\n");
      if (looksLikeImageBytes) continue;

      const ascii = buf.toString("utf8").replace(/\r?\n|\r|\s+/g, "");
      try {
        const once = Buffer.from(ascii, "base64").toString("utf8").slice(0, 12);
        if (once.startsWith("iVBORw0K") || once.startsWith("/9j/")) {
          const innerBase64 = Buffer.from(ascii, "base64").toString("utf8");
          const imageBytes = Buffer.from(innerBase64, "base64");
          await pool.query("UPDATE productos SET imagen = ? WHERE id = ?", [
            imageBytes,
            r.id,
          ]);
          fixes.push({ id: r.id, action: "fixed double-base64" });
        } else {
          const imageBytes = Buffer.from(ascii, "base64");
          await pool.query("UPDATE productos SET imagen = ? WHERE id = ?", [
            imageBytes,
            r.id,
          ]);
          fixes.push({ id: r.id, action: "converted base64-text-to-bytes" });
        }
      } catch (e) {
        fixes.push({ id: r.id, action: "error", err: e.message });
      }
    }
    return res.status(200).send({ status: 200, fixes });
  } catch (err) {
    console.error("POST /repair error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// Fallback
app.all("/*splat", (req, res) =>
  res.status(404).send({ mensaje: "La ruta no existe" }),
);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
