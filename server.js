const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const DATA_FILE = "data.json";

app.get("/", (req, res) => {
  res.send("Bienvenido a la API Campesino");
});

app.post("/saveLabels", (req, res) => {
  const labelsData = req.body;
  const deviceId = req.headers["device-id"];
  saveLabelsToFile(labelsData, deviceId);
  res.send("Etiquetas guardadas correctamente.");
});

app.get("/getLabels", (req, res) => {
  const labels = getLabelsFromFile();
  res.json(labels);
});

function saveLabelsToFile(labelsData, deviceId) {
  const data = {
    id: deviceId,
    etiquetas: labelsData,
  };

  let existingData = [];
  try {
    existingData = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    console.error("Error al leer el archivo de datos:", err);
  }

  existingData.push(data);

  fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
}

function getLabelsFromFile() {
  let existingData = [];
  try {
    existingData = JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    console.error("Error al leer el archivo de datos:", err);
  }

  let allLabels = [];
  existingData.forEach((deviceData) => {
    allLabels = allLabels.concat(deviceData.etiquetas);
  });

  return allLabels;
}

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
