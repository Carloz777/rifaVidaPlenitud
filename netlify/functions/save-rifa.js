const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    // 1. Validar método HTTP
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Método no permitido" }),
      };
    }

    // 2. Parsear body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "JSON inválido" }),
      };
    }

    const { casillero, nombre, telefono, opcion } = body;

    // 3. Validar campos obligatorios (ajusta según tu tabla)
    if (!casillero || !nombre || !telefono || !opcion) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Faltan datos obligatorios: casillero, nombre, telefono, opcion" }),
      };
    }

    // 4. Configurar Supabase con variables de entorno (¡IMPORTANTE!)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ⚠️ Usa SERVICE_ROLE, no anon

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Variables de entorno no configuradas");
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Error de configuración del servidor" }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 5. Insertar en Supabase
    const { data, error } = await supabase
      .from("rifa_participantes")
      .insert([{ casillero, nombre, telefono, opcion }]);

    if (error) {
      console.error("❌ Error de Supabase:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    // 6. Respuesta exitosa
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
    console.error("🔥 Error en función save-rifa:", error.message || error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: error.message || "Error desconocido en el servidor",
      }),
    };
  }
};