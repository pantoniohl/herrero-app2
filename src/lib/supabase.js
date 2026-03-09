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
  // Convertir nombres de la app → snake_case de Supabase
  const datos = {
    fecha_desde:    cfg.fecha_desde    || cfg.fechasSemanaDe  || null,
    fecha_hasta:    cfg.fecha_hasta    || cfg.fechasSemanaA   || null,
    fecha_limite:   cfg.fecha_limite   || (cfg.fechaLimite && cfg.horaLimite
                      ? `${cfg.fechaLimite}T${cfg.horaLimite}:00`
                      : cfg.fechaLimite || null),
    notas:          cfg.notas          || null,
    dia_examen:     cfg.dia_examen     || cfg.diaExamen       || null,
    alumnos_examen: cfg.alumnos_examen || cfg.alumnosExamen   || [],
    horas_pista:    cfg.horas_pista    || cfg.horasPista      || {},
    profesores:     cfg.profesores     || {},
    vehiculos:      cfg.vehiculos      || {},
    activa:         false,
  };
  if (!Array.isArray(datos.alumnos_examen)) datos.alumnos_examen = [];
  if (!datos.fecha_desde) throw new Error("Falta la fecha de inicio de semana");

  const { data, error } = await supabase
    .from('configuracion_semanal')
    .upsert(datos, { onConflict: 'fecha_desde' })
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

export async function guardarPlanning(configId, { practicas, sinAsignar, huella }) {
  const { data, error } = await supabase
    .from('planning')
    .upsert({ config_id: configId, practicas, sin_asignar: sinAsignar, huella: huella || null }, { onConflict: 'config_id' })
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

// ── RESET NUEVA SEMANA ────────────────────────────────────────

export async function resetNuevaSemana() {
  // Orden: planning → disponibilidad → tokens → config → alumnos
  // (respetar claves foráneas si las hubiera)
  const errores = [];

  const tablas = ['planning', 'disponibilidad', 'tokens_alumno', 'configuracion_semanal', 'alumnos'];
  for (const tabla of tablas) {
    const { error } = await supabase.from(tabla).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) errores.push(`${tabla}: ${error.message}`);
  }

  if (errores.length) throw new Error('Errores en reset:\n' + errores.join('\n'));
  return true;
}

// ── FUSIÓN DE PRÁCTICAS CONTIGUAS ────────────────────────────
// Exportada aquí para que Vite no la elimine en el bundle del componente

export function fusionarPlanning(planning) {
  if (!planning) return null;
  const toM = t => { const [h, m] = (t || '0:0').split(':'); return parseInt(h) * 60 + parseInt(m); };
  const out = {};
  for (const dia of Object.keys(planning)) {
    const pracs = [...(planning[dia] || [])].sort((a, b) => toM(a.desde) - toM(b.desde));
    const fus = [];
    for (const p of pracs) {
      const ant = fus[fus.length - 1];
      if (ant && ant.alumnoId === p.alumnoId) {
        const gap = toM(p.desde) - toM(ant.hasta);
        if (gap >= 0 && gap <= 5) {
          ant.hasta    = p.hasta;
          ant.duracion = (ant.duracion || 0) + (p.duracion || 0);
          continue;
        }
      }
      fus.push({ ...p });
    }
    out[dia] = fus;
  }
  return out;
}
