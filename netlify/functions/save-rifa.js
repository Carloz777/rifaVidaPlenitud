const { createClient } = require('@supabase/supabase-js');

// ✅ Tus datos de Supabase ya están aquí
const supabaseUrl = 'https://qnwaeivskhavrenzqgqs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFud2FlaXZza2hhdnJlbnpxZ3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjY2NjcsImV4cCI6MjA3MzU0MjY2N30.rmkWf-cai37YRu0eAGd_mmbrdKyQZxOsV8-QtC6iE5k';

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const { casillero, nombre, telefono, opcion } = body;

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('rifa_participantes')
      .insert([
        {
          casillero,
          nombre,
          telefono,
          opcion,
        },
      ]);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Guardado con éxito en Supabase!',
        data,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido',
      }),
    };
  }
};