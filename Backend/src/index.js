const express = require("express");
const Redis = require("ioredis");
const pool = require("./database");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({ origin: true, credentials: true }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Redis('redis://cache');

app.get("/estudiantesPorMaterias", async (req, res, next) => {
  try {
    client.get("results").then((result) => {
      if (result) {
        pool.query(`INSERT INTO REGISTROS_PETICIONES (estado, descripcion) VALUES ('GET: 200, Se obtuvo la cantidad de estudiantes inscritos por materia','Obtenido desde el cache');`);
        return res.json(JSON.parse(result));
      }
    });
    const results = await pool.query('SELECT M.id_materia "MATERIA", COUNT(E.id_estudiante) "CANTIDAD" FROM ESTUDIANTES E, MATERIAS M, INSCRIPCION_MATERIAS I WHERE E.id_estudiante = I.id_estudiante AND M.id_materia = I.id_materia GROUP BY M.nombre_materia');
    client.set("results", JSON.stringify(results), "EX", 10);
    pool.query(`INSERT INTO REGISTROS_PETICIONES (estado, descripcion) VALUES ('GET: 200, Se obtuvo la cantidad de estudiantes inscritos por materia','Obtenido desde la base de datos');`);
    res.json(results);
  } catch (error) {
    
    //console.log("Llega desde Cache");
  }
});

async function main() {
  app.set('port', process.env.PORT || 3000);
  app.listen(app.get('port'), () => {
    console.log('Server on port '.concat(app.get('port')));
  });
}

main();