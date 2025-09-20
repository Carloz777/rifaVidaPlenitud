const { createClient } = require('@supabase/supabase-js');

// ✅ Configuración de Supabase (⚠️ Lo ideal es mover estas claves a variables de entorno en Netlify)
const supabaseUrl = 'https://qnwaeivskhavrenzqgqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFud2FlaXZza2hhdnJlbnpxZ3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjY2NjcsImV4cCI6MjA3MzU0MjY2N30.rmkWf-cai37YRu0eAGd_mmbrdKyQZxOsV8-QtC6iE5k';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Validar método HTTP
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Método no permitido" }),
      };
    }

    // Parsear body
    const body = JSON.parse(event.body);
    const { casillero, nombre, telefono, opcion } = body;

    if (!casillero || !nombre || !telefono) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Faltan datos obligatorios" }),
      };
    }

    // Insertar en Supabase
    const { data, error } = await supabase
      .from("rifa_participantes")
      .insert([{ casillero, nombre, telefono, opcion }]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "✅ Guardado con éxito en Supabase!",
        data,
      }),
    };
  } catch (error) {
    console.error("Error en función save-rifa:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: error.message || "Error desconocido",
      }),
    };
  }
};
