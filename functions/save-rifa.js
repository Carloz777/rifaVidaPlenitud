// netlify/functions/save-rifa.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Parsear los datos enviados desde el frontend
    const body = JSON.parse(event.body);
    const { casillero, nombre, telefono, opcion } = body;

    // Ruta al archivo JSON donde guardaremos todos los registros
    const filePath = path.join(__dirname, '../../rifa.json');

    // Leer el archivo existente (si existe)
    let datos = [];
    if (fs.existsSync(filePath)) {
      const contenido = fs.readFileSync(filePath, 'utf8');
      datos = JSON.parse(contenido);
    }

    // Agregar nuevo registro
    datos.push({
      casillero,
      nombre,
      telefono,
      opcion,
      fecha: new Date().toISOString()
    });

    // Escribir de nuevo el archivo
    fs.writeFileSync(filePath, JSON.stringify(datos, null, 2));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Guardado con éxito!' })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};