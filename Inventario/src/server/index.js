// server.js
import mysql from "mysql2/promise";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import crypto from "crypto";

const app = express();
const port = 5000;

app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "movil",
  database: "movil",
  password: "movil",
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

// Util: detectar MIME por bytes
function detectImageMime(buf) {
  if (!Buffer.isBuffer(buf)) return null;
  const hexStart = buf.slice(0, 4).toString("hex");
  if (hexStart.startsWith("ffd8ff")) return "image/jpeg";
  const ascii8 = buf.slice(0, 8).toString("ascii");
  if (ascii8.startsWith("\x89PNG\r\n\x1a\n")) return "image/png";
  return null;
}

// Util: convertir campo imagen de la BD a Buffer (maneja bytes, texto base64 y data: URIs)
function normalizeImagenToBuffer(imagenField) {
  if (!imagenField) return null;

  if (Buffer.isBuffer(imagenField)) {
    // Si ya son bytes, devolver tal cual
    return imagenField;
  }

  if (typeof imagenField === "string") {
    let s = imagenField.replace(/\r?\n|\r|\s+/g, "");
    if (s.startsWith("data:")) s = s.split(",")[1];
    try {
      // Intentar decodificar base64
      return Buffer.from(s, "base64");
    } catch (e) {
      return null;
    }
  }

  // Otros tipos: intentar convertir a string y decodificar
  try {
    const s = String(imagenField).replace(/\r?\n|\r|\s+/g, "");
    return Buffer.from(s, "base64");
  } catch (e) {
    return null;
  }
}

// Root
app.get("/", (req, res) => res.send("Hola mundo"));

// POST /producto - guarda bytes reales en LONGBLOB
app.post("/producto", async (req, res) => {
  try {
    const { nombre, precio, cantidad, categoria, imagen } = req.body;
    if (!nombre?.trim() || !Number.isFinite(precio) || !Number.isFinite(cantidad) || !categoria?.trim()) {
      return res.status(400).send({ error: "Faltan datos" });
    }

    let imagenBuffer = null;
    if (imagen) {
      const cleaned = String(imagen).replace(/\r?\n|\r|\s+/g, "");
      const base64part = cleaned.startsWith("data:") ? cleaned.split(",")[1] : cleaned;
      imagenBuffer = Buffer.from(base64part, "base64");
    }

    const sql = "INSERT INTO productos (nombre, precio, cantidad, categoria, imagen) VALUES (?,?,?,?,?)";
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
    console.log("PUT /producto/:id body:", req.params, req.body && { ...req.body, imagen: req.body.imagen ? "[base64 length " + String(req.body.imagen).length + "]" : null });
    const parsedPrecio = Number(precio);
    const parsedCantidad = Number(cantidad);
    if (!id || !nombre || !Number.isFinite(parsedPrecio) || !Number.isFinite(parsedCantidad) || !categoria) {
      return res.status(401).send({ error: "Faltan datos" });
    }

    let imagenBuffer = null;
    if (imagen) {
      const cleaned = String(imagen).replace(/\r?\n|\r|\s+/g, "");
      const base64part = cleaned.startsWith("data:") ? cleaned.split(",")[1] : cleaned;
      imagenBuffer = Buffer.from(base64part, "base64");
    }

    const sql = "UPDATE productos SET nombre = ?, precio = ?, cantidad = ?, categoria = ?, imagen = ? WHERE id = ?";
    const [result] = await pool.query(sql, [nombre, parsedPrecio, parsedCantidad, categoria, imagenBuffer, id]);
    if (result.affectedRows > 0) return res.status(200).send({ status: 200, result });
    return res.status(404).send({ status: 404, error: "No se encontró el producto" });
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
        const buf = normalizeImagenToBuffer(p.imagen);
        if (buf && bufferContainsImageBytes(buf)) {
          imagenBase64 = buf.toString("base64");
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

    if (productos.length === 0) return res.status(404).send({ status: 404, message: "No se encontró el producto" });
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
        const buf = normalizeImagenToBuffer(p.imagen);
        if (buf && bufferContainsImageBytes(buf)) {
          imagenBase64 = buf.toString("base64");
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

// NEW: GET /producto/:id/image - sirve la imagen como recurso (Content-Type + bytes)
app.get("/producto/:id/image", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).send({ error: "Faltan datos" });

    const sql = "SELECT imagen FROM productos WHERE id = ?";
    const [rows] = await pool.query(sql, [id]);
    if (!rows || rows.length === 0) return res.status(404).send({ error: "No se encontró el producto" });

    const raw = rows[0].imagen;
    if (!raw) return res.status(404).send({ error: "No hay imagen para este producto" });

    // Normalizar a Buffer
    let buf = normalizeImagenToBuffer(raw);
    if (!buf) return res.status(500).send({ error: "No se pudo procesar la imagen" });

    // Si el buffer no parece contener bytes de imagen, intentar decodificar doble-base64
    if (!bufferContainsImageBytes(buf)) {
      // intentar interpretar como texto base64 -> bytes
      const asText = buf.toString("utf8").replace(/\r?\n|\r|\s+/g, "");
      try {
        const inner = Buffer.from(asText, "base64");
        if (bufferContainsImageBytes(inner)) buf = inner;
      } catch (e) {
        // dejar buf como está
      }
    }

    const mime = detectImageMime(buf) || "application/octet-stream";
    const etag = crypto.createHash("md5").update(buf).digest("hex");

    // Soporta If-None-Match para caching
    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }

    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Length", buf.length);
    res.setHeader("Cache-Control", "public, max-age=86400"); // 1 día
    res.setHeader("ETag", etag);

    return res.status(200).send(buf);
  } catch (err) {
    console.error("GET /producto/:id/image error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// DELETE /producto/:id
app.delete("/producto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(401).send({ error: "Faltan datos" });
    const sql = "DELETE FROM productos WHERE id = ?";
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows > 0) return res.status(200).send({ result });
    return res.status(404).send({ error: "ID desconocida" });
  } catch (err) {
    console.error("DELETE /producto/:id error:", err);
    return res.status(500).send({ error: err.message || err });
  }
});

// Fallback
app.all("/*splat", (req, res) => res.status(404).send({ mensaje: "La ruta no existe" }));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
