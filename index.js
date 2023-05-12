const express = require("express");
const app = express();
const PORT = 3000; // Puerto en el que se ejecutará el servidor
const { Pool, Logger } = require("pg");

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: "postgres",
  host: "rdsclinica.c6y5berzarhi.us-east-1.rds.amazonaws.com",
  database: "rdsclinica",
  password: "Q#nr3uHem1ilaf1%",
  port: 5432,
});

app
  .use(express.json({ limit: "150mb" }))
  .use(express.urlencoded({ limit: "150mb", extended: true }));

// Ruta para el endpoint de login
app.post("/login", (req, res) => {
    console.log(req.body);
    const { correo, contrasena } = req.body;  
    // Consulta a la base de datos para verificar las credenciales del usuario
    pool.query(
      "SELECT clinica.sp_login($1, $2);",
      [correo, contrasena],
      (error, results) => {
        if (error) {
          // Manejo de errores de consulta
          console.error("Error al realizar la consulta:", error);
          res.status(500).json({ mensaje: "Error en el servidor" });
        } else {
          const autenticado = results.rows[0].sp_login;
            console.log(autenticado);
          if (autenticado) {
            // Autenticación exitosa
            res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
          } else {
            // Autenticación fallida
            res.status(401).json({ mensaje: "Credenciales inválidas" });
          }
        }
      }
    );
  });
  
// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
