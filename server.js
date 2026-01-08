const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// Servir CSS explícitamente (fix clave)
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
