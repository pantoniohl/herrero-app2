// ══════════════════════════════════════════════════════════════
// supabase.js — Capa de datos Autoescuela Herrero
// Sustituye todos los datos mock de la app por llamadas reales
// ══════════════════════════════════════════════════════════════
// Instalación: npm install @supabase/supabase-js
// Variables de entorno necesarias (.env o Vercel):
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
// ══════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;

// ── ALUMNOS ───────────────────────────────────────────────────

export async function getAlumnos({ soloActivos = true } = {}) {
  let query = supabase.from('alumnos').select('*').order('apellidos');
  if (soloActivos) query = query.eq('activo', true);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAlumno(id) {
  const { data, error } = await supabase
    .from('alumnos').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function crearAlumno(alumno) {
  const { data, error } = await supabase
    .from('alumnos').insert(alumno).select().single();
  if (error) throw error;
  return data;
}

export async function actualizarAlumno(id, cambios) {
  const { data, error } = await supabase
    .from('alumnos').update(cambios).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function archivarAlumno(id) {
  return actualizarAlumno(id, { activo: false });
}

// ── CONFIGURACIÓN SEMANAL ─────────────────────────────────────

export async function getConfigActiva() {
  const { data, error } = await supabase
    .from('configuracion_semanal')
    .select('*')
    .eq('activa', true)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data || null;
}

export async function getConfig(id) {
  const { data, error } = await supabase
    .from('configuracion_semanal').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function guardarConfigBorrador(cfg) {
  // Upsert por fecha_desde
  const { data, error } = await supabase
    .from('configuracion_semanal')
    .upsert({ ...cfg, activa: false }, { onConflict: 'fecha_desde' })
    .select().single();
  if (error) throw error;
  return data;
}

export async function activarSemana(id) {
  // Desactivar la anterior primero
  await supabase
    .from('configuracion_semanal')
    .update({ activa: false })
    .eq('activa', true);
  // Activar la nueva
  const { data, error } = await supabase
    .from('configuracion_semanal')
    .update({ activa: true })
    .eq('id', id)
    .select().single();
  if (error) throw error;
  return data;
}

// ── TOKENS DE ACCESO ──────────────────────────────────────────

export async function generarTokens(configId, alumnosIds) {
  // Calcular expiración: fecha_limite de la config
  const config = await getConfig(configId);
  const expiresAt = config.fecha_limite;

  const tokens = alumnosIds.map(alumnoId => ({
    alumno_id: alumnoId,
    config_id: configId,
    expires_at: expiresAt,
    usado: false,
  }));

  const { data, error } = await supabase
    .from('tokens_alumno')
    .upsert(tokens, { onConflict: 'alumno_id,config_id' })
    .select('*, alumnos(nombre, apellidos, telefono)');
  if (error) throw error;
  return data;
}

export async function validarToken(token) {
  const { data, error } = await supabase
    .from('tokens_alumno')
    .select('*, alumnos(*), configuracion_semanal(*)')
    .eq('token', token)
    .single();

  if (error || !data) return { valido: false, motivo: 'Token no encontrado' };
  if (data.usado)      return { valido: false, motivo: 'ya_enviado', alumno: data.alumnos };
  if (new Date(data.expires_at) < new Date())
    return { valido: false, motivo: 'caducado' };

  return {
    valido: true,
    tokenId: data.id,
    alumno: data.alumnos,
    config: data.configuracion_semanal,
  };
}

export async function marcarTokenUsado(tokenId) {
  const { error } = await supabase
    .from('tokens_alumno')
    .update({ usado: true })
    .eq('id', tokenId);
  if (error) throw error;
}

// Obtener tokens con datos de alumno para el generador WhatsApp
export async function getTokensConAlumnos(configId) {
  const { data, error } = await supabase
    .from('tokens_alumno')
    .select('token, alumnos(id, nombre, apellidos, telefono, localidad, permiso)')
    .eq('config_id', configId);
  if (error) throw error;
  return data;
}

// ── DISPONIBILIDAD ────────────────────────────────────────────

export async function enviarDisponibilidad({ tokenId, alumnoId, configId, dias, practicasDeseadas }) {
  // Marcar token como usado
  await marcarTokenUsado(tokenId);

  const { data, error } = await supabase
    .from('disponibilidad')
    .insert({
      token_id: tokenId,
      alumno_id: alumnoId,
      config_id: configId,
      dias,
      practicas_deseadas: practicasDeseadas,
    })
    .select().single();
  if (error) throw error;
  return data;
}

export async function getDisponibilidades(configId) {
  const { data, error } = await supabase
    .from('disponibilidad')
    .select('*, alumnos(id, nombre, apellidos, permiso, fase, localidad, transporte, profesor_fijo, coche_asignado, max_practicas_semana)')
    .eq('config_id', configId);
  if (error) throw error;
  return data;
}

// ── PLANNING ──────────────────────────────────────────────────

export async function guardarPlanning(configId, { practicas, sinAsignar }) {
  const { data, error } = await supabase
    .from('planning')
    .upsert({ config_id: configId, practicas, sin_asignar: sinAsignar }, { onConflict: 'config_id' })
    .select().single();
  if (error) throw error;
  return data;
}

export async function getPlanning(configId) {
  const { data, error } = await supabase
    .from('planning')
    .select('*')
    .eq('config_id', configId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function publicarPlanning(configId) {
  const { data, error } = await supabase
    .from('planning')
    .update({ publicado: true, publicado_at: new Date().toISOString() })
    .eq('config_id', configId)
    .select().single();
  if (error) throw error;
  return data;
}
