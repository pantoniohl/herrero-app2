// v30b — Informes PDF visuales + pestaña Informes + teléfonos profesores
import { useState, useEffect } from "react";
import supabase, {
  getAlumnos, crearAlumno, actualizarAlumno,
  getConfigActiva, guardarConfigBorrador, activarSemana as activarSemanaDB,
  guardarPlanning, getPlanning, getDisponibilidades
} from "./lib/supabase.js";

const LOGO_SRC = "data:image/jpeg;base64,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";

// ══════════════════════════════════════════════
// MOTOR
// ══════════════════════════════════════════════
// ════════════════════════════════════════════════════════════
// MOTOR DE ASIGNACIÓN — Autoescuela Herrero
// ════════════════════════════════════════════════════════════

// ─── Constantes ─────────────────────────────────────────────
const HORA_MAX = "21:00";
const DIAS_ORDEN = { lunes:0, martes:1, miercoles:2, jueves:3, viernes:4 };
const DUR_B = 30;       // minutos
const DUR_PESADOS = 45; // minutos por defecto
const DUR_PESADOS_MAX = 60;

const CAPACIDADES = {
  mamen: ["B","C"],
  javi:  ["B","C"],
  pablo: ["C","C+E"],
  toni:  ["B","C","C+E"],
};

const VEHICULOS = {
  renault_amarillo: { permiso:"C",   modalidad:"ambas"  },
  renault_blanco:   { permiso:"C",   modalidad:"circ"   },
  trailer_renault:  { permiso:"C+E", modalidad:"circ"   },
  trailer_mercedes: { permiso:"C+E", modalidad:"pista"  },
};

const VEHICULOS_B = {
  audi_a3:     { nombre:"Audi A3",     profPreferente:"mamen" },
  toyota_auris:{ nombre:"Toyota Auris",profPreferente:"javi"  },
};

// Máximo hueco permitido entre prácticas del mismo profesor (minutos)
const MAX_HUECO_PROF = 30;
// Máximo número de cortes permitidos por profesor por día
const MAX_CORTES_DIA = 1;

// ─── Utilidades de tiempo ────────────────────────────────────
function toMin(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

// Devuelve lista de tramos [{desde, hasta}] en minutos disponibles
// para un recurso (profesor o vehículo) en un día dado
function tramosDisponibles(configDia) {
  if (!configDia || configDia.estado === "no") return [];
  if (configDia.estado === "todo") return [{ desde: toMin("09:00"), hasta: toMin(HORA_MAX) }];
  if (configDia.estado === "tramos") {
    return (configDia.tramos || []).map(t => ({ desde: toMin(t.desde), hasta: toMin(t.hasta) }));
  }
  return [];
}

// Resta un bloqueo CAP de los tramos disponibles
function restarCAP(tramos, capBloqueo) {
  if (!capBloqueo?.activo) return tramos;
  const capDesde = toMin(capBloqueo.desde);
  const capHasta = toMin(capBloqueo.hasta);
  const resultado = [];
  for (const t of tramos) {
    if (capHasta <= t.desde || capDesde >= t.hasta) {
      resultado.push(t); // sin solapamiento
    } else {
      if (t.desde < capDesde) resultado.push({ desde: t.desde, hasta: capDesde });
      if (t.hasta > capHasta) resultado.push({ desde: capHasta, hasta: t.hasta });
    }
  }
  return resultado;
}

// Intersección de dos listas de tramos
function intersectarTramos(a, b) {
  const result = [];
  for (const ta of a) {
    for (const tb of b) {
      const desde = Math.max(ta.desde, tb.desde);
      const hasta = Math.min(ta.hasta, tb.hasta);
      if (hasta > desde) result.push({ desde, hasta });
    }
  }
  return result;
}

// Resta ocupaciones ya asignadas de los tramos libres
function restarOcupaciones(tramos, ocupaciones) {
  let libre = [...tramos];
  for (const oc of ocupaciones) {
    const nuevo = [];
    for (const t of libre) {
      if (oc.hasta <= t.desde || oc.desde >= t.hasta) {
        nuevo.push(t);
      } else {
        if (t.desde < oc.desde) nuevo.push({ desde: t.desde, hasta: oc.desde });
        if (t.hasta > oc.hasta) nuevo.push({ desde: oc.hasta, hasta: t.hasta });
      }
    }
    libre = nuevo;
  }
  return libre;
}

// ─── Obtener huecos libres de duración mínima ────────────────
function huecosSuficientes(tramos, durMin) {
  return tramos.filter(t => (t.hasta - t.desde) >= durMin);
}

// ─── Score de adyacencia (optimización compacidad) ──────────
// Cuanto más cerca del CAP o de otra práctica ya asignada, mejor
function scoreAdyacencia(hueco, ocupaciones, capBloqueo) {
  if (ocupaciones.length === 0 && !capBloqueo?.activo) return 0;
  let minDist = Infinity;
  for (const oc of ocupaciones) {
    const distInicio = Math.abs(hueco.desde - oc.hasta);
    const distFin    = Math.abs(oc.desde - hueco.hasta);
    minDist = Math.min(minDist, distInicio, distFin);
  }
  if (capBloqueo?.activo) {
    const capDesde = toMin(capBloqueo.desde);
    const capHasta = toMin(capBloqueo.hasta);
    minDist = Math.min(minDist,
      Math.abs(hueco.desde - capHasta),
      Math.abs(capDesde - hueco.hasta)
    );
  }
  return minDist === Infinity ? 9999 : minDist;
}

// ─── Verificar que la jornada del profesor no se rompe ──────
// Devuelve true si colocar una práctica en [desde, hasta] respeta
// la regla de jornada continua (máx 1 corte de 30 min al día)
function jornadaValida(desde, hasta, ocupaciones) {
  if (ocupaciones.length === 0) return true; // primera práctica del día, siempre válida

  // Calcular todos los huecos que habría si añadimos esta práctica
  const todasOcup = [...ocupaciones, { desde, hasta }]
    .sort((a, b) => a.desde - b.desde);

  let cortes = 0;
  for (let i = 1; i < todasOcup.length; i++) {
    const hueco = todasOcup[i].desde - todasOcup[i-1].hasta;
    if (hueco > 0 && hueco <= MAX_HUECO_PROF) cortes++;
    else if (hueco > MAX_HUECO_PROF) return false; // hueco demasiado grande
  }
  return cortes <= MAX_CORTES_DIA;
}

// ─── Elegir mejor hueco para una práctica ───────────────────
function elegirHueco(huecos, durMin, ocupaciones, capBloqueo) {
  const validos = huecos
    .filter(h => (h.hasta - h.desde) >= durMin)
    .filter(h => jornadaValida(h.desde, h.desde + durMin, ocupaciones));
  if (validos.length === 0) return null;
  // Ordenar por adyacencia (menor distancia = mejor)
  validos.sort((a, b) =>
    scoreAdyacencia(a, ocupaciones, capBloqueo) -
    scoreAdyacencia(b, ocupaciones, capBloqueo)
  );
  return { desde: validos[0].desde, hasta: validos[0].desde + durMin };
}

// ─── Verificar restricción de pista ─────────────────────────
function pistaBloqueada(ocupacionesPista, desde, hasta) {
  return ocupacionesPista.some(oc => oc.hasta > desde && oc.desde < hasta);
}

// ─── MOTOR PRINCIPAL ─────────────────────────────────────────
/*
  Entradas:
    - configSemanal: { profesores, vehiculos, horasPista, capSemana }
    - alumnos: array de alumnos activos con disponibilidad semanal
    - diasSemana: ["lunes","martes","miercoles","jueves","viernes"]

  Salida:
    - planning: { [dia]: [ { alumnoId, profesor, vehiculo, tipo, desde, hasta, duracion } ] }
    - sinAsignar: [ { alumnoId, motivo } ]
*/
function generarPlanning(configSemanal, alumnos, diasSemana) {
  const planning = Object.fromEntries(diasSemana.map(d => [d, []]));
  const sinAsignar = [];

  // Ocupaciones por recurso y día: { [profKey_dia]: [{desde,hasta}], [vehKey_dia]: [...] }
  const ocupProf = {};
  const ocupVeh  = {};
  const ocupPista = {}; // pista compartida

  const getOcup = (map, key) => { if (!map[key]) map[key] = []; return map[key]; };

  // Separar alumnos: primero pesados (C, C+E), luego B
  // Dentro de cada grupo: primero los que van a examen esa semana
  const alumnosExamen = new Set(configSemanal.alumnosExamen || []);
  const diaExamenOrden = configSemanal.diaExamen ? (DIAS_ORDEN[configSemanal.diaExamen] ?? 99) : 99;

  const pesados = alumnos.filter(a => a.permiso === "C" || a.permiso === "C+E");
  const moduloB = alumnos.filter(a => a.permiso === "B");

  const ordenarGrupo = (grupo) => grupo.slice().sort((a, b) => {
    const aExamen = alumnosExamen.has(a.id) ? 0 : 1;
    const bExamen = alumnosExamen.has(b.id) ? 0 : 1;
    return aExamen - bExamen;
  });

  const ordenados = [...ordenarGrupo(pesados), ...ordenarGrupo(moduloB)];

  for (const alumno of ordenados) {
    const duracion = alumno.permiso === "B" ? DUR_B : DUR_PESADOS;
    const maxSemanal = alumno.permiso === "B" ? (alumno.maxPracticas || 8) : 2;
    let asignadas = 0;
    let diasAsignados = 0;
    const diasDisponibles = alumno.disponibilidad || {}; // { [dia]: { estado, desde, hasta } }

    // Para alumnos de examen: ordenar días por proximidad al día de examen
    const diasOrdenados = alumnosExamen.has(alumno.id) && configSemanal.diaExamen
      ? [...diasSemana].sort((a, b) => {
          const distA = Math.abs((DIAS_ORDEN[a]??99) - diaExamenOrden);
          const distB = Math.abs((DIAS_ORDEN[b]??99) - diaExamenOrden);
          return distA - distB;
        })
      : diasSemana;

    for (const dia of diasOrdenados) {
      if (asignadas >= maxSemanal) break;

      const dispAlumno = diasDisponibles[dia];
      if (!dispAlumno || dispAlumno.estado === "no") continue;

      // Tramos disponibles del alumno ese día
      const tramosAlumno = dispAlumno.estado === "todo"
        ? [{ desde: toMin("09:00"), hasta: toMin(HORA_MAX) }]
        : (dispAlumno.tramos || []).map(t => ({ desde: toMin(t.desde), hasta: toMin(t.hasta) }));

      if (tramosAlumno.length === 0) continue;

      // Límite de pista ese día
      const limitePista = toMin(configSemanal.horasPista?.[dia] || HORA_MAX);

      // Cuántas prácticas puede tener el alumno este día
      // Trujillo: hasta 3/día | Pueblo: hasta 2/día
      const maxHoy = alumno.permiso === "B"
        ? (alumno.localidad === "Trujillo" ? 3 : 2)
        : 1;
      let asignadasHoy = 0;

      // Intentar asignar maxHoy prácticas este día
      while (asignadasHoy < maxHoy && asignadas < maxSemanal) {
        let asignado = false;

        // Prioridad de profesores según permiso
        // B: Mamen > Javi > Toni (Pablo nunca da B)
        // C/C+E: Pablo primero, luego compacidad
        const PRIORIDAD_B    = ["mamen","javi","toni","pablo"];
        const PRIORIDAD_PESADOS = ["pablo","mamen","javi","toni"];

        const profesoresCandidatos = Object.keys(CAPACIDADES).filter(pk => {
          if (alumno.permiso === "B" && alumno.profesorFijo && pk !== alumno.profesorFijo) return false;
          // B: respetar profesor fijo si ya tiene uno asignado
          if (alumno.permiso === "B" && alumno.profesorFijo && pk !== alumno.profesorFijo) return false;
          const caps = CAPACIDADES[pk];
          if (!caps.includes(alumno.permiso)) return false;
          const profConfig = configSemanal.profesores?.[pk]?.[dia] || configSemanal.profesores?.[pk]?.dias?.[dia];
          if (!profConfig || profConfig.estado === "no") return false;
          // Pablo: máximo 3 días de prácticas normales
          if (pk === "pablo") {
            const diasPablo = diasSemana.filter(d =>
              getOcup(ocupProf, pk + "_" + d).length > 0
            ).length;
            if (diasPablo >= 3 && getOcup(ocupProf, pk + "_" + dia).length === 0) return false;
          }
          return true;
        });

        // Ordenar profesores según criterio
        profesoresCandidatos.sort((a, b) => {
          if (alumno.permiso === "B") {
            // Prioridad fija: Mamen > Javi > Toni
            const pa = PRIORIDAD_B.indexOf(a);
            const pb = PRIORIDAD_B.indexOf(b);
            if (pa !== pb) return pa - pb;
          } else {
            // C y C+E: Pablo primero, luego compacidad
            const pa = PRIORIDAD_PESADOS.indexOf(a);
            const pb = PRIORIDAD_PESADOS.indexOf(b);
            if (pa !== pb) return pa - pb;
          }
          // Desempate: quien ya tiene prácticas ese día (compacidad)
          const ocA = getOcup(ocupProf, a + "_" + dia).length;
          const ocB = getOcup(ocupProf, b + "_" + dia).length;
          return ocB - ocA;
        });

        for (const profKey of profesoresCandidatos) {
          const profConfigDia = configSemanal.profesores[profKey]?.[dia] || configSemanal.profesores[profKey]?.dias?.[dia];
          const capProf = profConfigDia?.capBloqueo;

          // Tramos libres del profesor
          let tramosProf = tramosDisponibles(profConfigDia);
          tramosProf = restarCAP(tramosProf, capProf);
          const ocupacionesProf = getOcup(ocupProf, profKey + "_" + dia);
          tramosProf = restarOcupaciones(tramosProf, ocupacionesProf);

          // Intersección alumno ∩ profesor
          let tramosComunes = intersectarTramos(tramosAlumno, tramosProf);
          if (tramosComunes.length === 0) continue;

          // Para pesados: buscar vehículo compatible
          if (alumno.permiso !== "B") {
            const esPista = alumno.fase === "pista";
            let vehCompatibles = Object.entries(VEHICULOS).filter(([, v]) => {
              if (v.permiso !== alumno.permiso) return false;
              if (esPista && v.modalidad === "circ") return false;
              if (!esPista && v.modalidad === "pista") return false;
              return true;
            }).map(([k]) => k);

            // Respetar vehículo preferente del alumno: ponerlo primero
            if (alumno.cocheAsignado && vehCompatibles.includes(alumno.cocheAsignado)) {
              vehCompatibles = [alumno.cocheAsignado, ...vehCompatibles.filter(v => v !== alumno.cocheAsignado)];
            }

            let asignadoConVeh = false;
            for (const vehKey of vehCompatibles) {
              const vehConfigDia = configSemanal.vehiculos?.[vehKey]?.[dia] || configSemanal.vehiculos?.[vehKey]?.dias?.[dia];
              if (!vehConfigDia || vehConfigDia.estado === "no") continue;

              let tramosVeh = tramosDisponibles(vehConfigDia);
              const ocupacionesVeh = getOcup(ocupVeh, vehKey + "_" + dia);
              tramosVeh = restarOcupaciones(tramosVeh, ocupacionesVeh);

              let tramosFinales = intersectarTramos(tramosComunes, tramosVeh);

              // Restricción pista
              if (esPista) {
                tramosFinales = tramosFinales.map(t => ({
                  desde: t.desde,
                  hasta: Math.min(t.hasta, limitePista),
                })).filter(t => t.hasta > t.desde);

                // No puede haber otro vehículo en pista simultáneamente
                const ocPista = getOcup(ocupPista, dia);
                tramosFinales = restarOcupaciones(tramosFinales, ocPista);
              }

              const hueco = elegirHueco(
                tramosFinales, duracion,
                ocupacionesProf,
                capProf
              );

              if (hueco) {
                // Asignar
                const entrada = {
                  alumnoId: alumno.id,
                  alumnoNombre: alumno.apellidos + ", " + alumno.nombre,
                  profesor: profKey,
                  vehiculo: vehKey,
                  permiso: alumno.permiso,
                  fase: alumno.fase,
                  desde: toHHMM(hueco.desde),
                  hasta: toHHMM(hueco.hasta),
                  duracion,
                  tipo: esPista ? "pista" : "circulacion",
                  forzado: false,
                };
                planning[dia].push(entrada);
                getOcup(ocupProf, profKey + "_" + dia).push(hueco);
                getOcup(ocupVeh,  vehKey  + "_" + dia).push(hueco);
                if (esPista) getOcup(ocupPista, dia).push(hueco);
                asignadas++;
                asignadasHoy++;
                asignado = true;
                asignadoConVeh = true;
                break;
              }
            }
            if (asignadoConVeh) break;

          } else {
            // Módulo B: vehículo fijo del alumno (si tiene) o cualquiera disponible
            const vehB = alumno.cocheAsignado
              ? [alumno.cocheAsignado]
              : Object.keys(VEHICULOS_B);

            for (const vehKey of vehB) {
              const vehConfigDia = configSemanal.vehiculos?.[vehKey]?.[dia] || configSemanal.vehiculos?.[vehKey]?.dias?.[dia];
              // Si el vehículo no está configurado como "no", proceder
              if (vehConfigDia && vehConfigDia.estado === "no") continue;
              let tramosVeh = vehConfigDia ? tramosDisponibles(vehConfigDia) : [{desde:toMin("08:00"),hasta:toMin("21:00")}];
              const ocupacionesVeh = getOcup(ocupVeh, vehKey + "_" + dia);
              tramosVeh = restarOcupaciones(tramosVeh, ocupacionesVeh);
              const tramosFinalesB = intersectarTramos(tramosComunes, tramosVeh);
              const hueco = elegirHueco(tramosFinalesB, duracion, ocupacionesProf, capProf);
              if (hueco) {
                const entrada = {
                  alumnoId: alumno.id,
                  alumnoNombre: alumno.apellidos + ", " + alumno.nombre,
                  profesor: profKey,
                  vehiculo: vehKey,
                  permiso: "B",
                  fase: null,
                  desde: toHHMM(hueco.desde),
                  hasta: toHHMM(hueco.hasta),
                  duracion,
                  tipo: "circulacion",
                  forzado: false,
                };
                planning[dia].push(entrada);
                getOcup(ocupProf, profKey + "_" + dia).push(hueco);
                getOcup(ocupVeh, vehKey + "_" + dia).push(hueco);
                asignadas++;
                asignadasHoy++;
                asignado = true;
                break;
              }
            }
            if (asignado) break;
          }

        if (!asignado) break; // No hay más huecos este día
      }

      if (asignadasHoy > 0) diasAsignados++;
    }

    if (asignadas === 0) {
      sinAsignar.push({
        alumnoId: alumno.id,
        alumnoNombre: alumno.apellidos + ", " + alumno.nombre,
        permiso: alumno.permiso,
        motivo: "Sin hueco compatible con su disponibilidad",
      });
    }
  }

  // Ordenar cada día por hora de inicio
  for (const dia of diasSemana) {
    planning[dia].sort((a, b) => toMin(a.desde) - toMin(b.desde));
  }

  return { planning, sinAsignar };
}

// ─── Ampliar práctica a 60 min (acción de oficina) ───────────
function ampliarPractica(planning, dia, index, ocupProf, ocupVeh, ocupPista) {
  const practica = planning[dia][index];
  if (!practica) return { ok: false, motivo: "Práctica no encontrada" };
  if (practica.permiso === "B") return { ok: false, motivo: "Solo aplicable a pesados" };

  const nuevaHasta = toMin(practica.desde) + DUR_PESADOS_MAX;
  const limiteMax  = toMin(HORA_MAX);
  if (nuevaHasta > limiteMax) return { ok: false, motivo: "Supera el límite de " + HORA_MAX };

  // Verificar que no hay colisión con siguiente práctica del profesor o vehículo
  const ocupacionesProf = (ocupProf[practica.profesor + "_" + dia] || [])
    .filter((_, i) => i !== index);
  const colision = ocupacionesProf.some(oc =>
    oc.desde < nuevaHasta && oc.hasta > toMin(practica.desde)
  );
  if (colision) return { ok: false, motivo: "Colisión con otra práctica del profesor" };

  planning[dia][index] = {
    ...practica,
    hasta: toHHMM(nuevaHasta),
    duracion: DUR_PESADOS_MAX,
  };
  return { ok: true };
}


// ══════════════════════════════════════════════
// CONSTANTES COMPARTIDAS
// ══════════════════════════════════════════════
const DIAS_SEMANA = ["lunes","martes","miercoles","jueves","viernes"];
const DIAS_LABEL  = { lunes:"Lunes", martes:"Martes", miercoles:"Miércoles", jueves:"Jueves", viernes:"Viernes" };
const DIAS_CORTO  = { lunes:"L", martes:"M", miercoles:"X", jueves:"J", viernes:"V" };
const PROFS       = ["mamen","javi","pablo","toni"];
const PROF_LABEL  = { mamen:"Mamen", javi:"Javi", pablo:"Pablo", toni:"Toni" };
const COLOR_PROF  = { mamen:"#1A6B3A", javi:"#1A3A6B", pablo:"#C8102E", toni:"#6B1A6B" };
const COLOR_PERM  = { B:"#1A6B3A", C:"#1A3A6B", "C+E":"#6B1A6B" };
const VEH_LABEL   = { renault_amarillo:"R.Amarillo(C)", renault_blanco:"R.Blanco(C)", trailer_renault:"Tráiler R.(C+E)", trailer_mercedes:"Tráiler M.(C+E)", audi_a3:"Audi A3", toyota_auris:"Toyota Auris" };
const VEHICULOS_PESADOS = ["renault_amarillo","renault_blanco","trailer_renault","trailer_mercedes"];

// ── Estado inicial config semanal ─────────────
function mergeDeep(base, override) {
  if (!override) return base;
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
      result[key] = mergeDeep(base[key] || {}, override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

function configInicial() {
  const profDias = Object.fromEntries(PROFS.map(pk => [pk, Object.fromEntries(DIAS_SEMANA.map(d => [d, { estado:"todo", tramos:[], capBloqueo:{ activo:false, desde:"", hasta:"" }, tipoJornada: pk==="toni"?"completa":null }]))]));
  const vehDias  = Object.fromEntries(VEHICULOS_PESADOS.map(vk => [vk, Object.fromEntries(DIAS_SEMANA.map(d => [d, { estado:"todo", tramos:[], motivo:"" }]))]));
  return { fechasSemanaDe:"", fechasSemanaA:"", fechaLimite:"", horaLimite:"22:00", notas:"", diaExamen:null, alumnosExamen:[], horasPista:{ lunes:"20:00", martes:"20:00", miercoles:"20:00", jueves:"20:00", viernes:"20:00" }, profesores:profDias, vehiculos:vehDias };
}

// ── Alumnos demo ──────────────────────────────
const ALUMNOS_DEMO = [
  { id:1, nombre:"Antonio", apellidos:"Fernández Mora",   telefono:"634112233", localidad:"Trujillo",   permiso:"C",   fase:"pista",       activo:true,  bono:false, bonoRestantes:null, fechaAlta:"2024-09-01", profesorFijo:null,    cocheAsignado:null },
  { id:2, nombre:"Carlos",  apellidos:"Sánchez Díaz",     telefono:"698556677", localidad:"La Cumbre",  permiso:"C+E", fase:"circulacion",  activo:true,  bono:true,  bonoRestantes:6,    fechaAlta:"2024-11-03", profesorFijo:null,    cocheAsignado:null },
  { id:3, nombre:"Elena",   apellidos:"Torres Blanco",    telefono:"677889900", localidad:"Trujillo",   permiso:"C+E", fase:"pista",        activo:true,  bono:false, bonoRestantes:null, fechaAlta:"2025-02-01", profesorFijo:null,    cocheAsignado:null },
  { id:4, nombre:"José",    apellidos:"Pérez Alonso",     telefono:"655001122", localidad:"Ibahernando",permiso:"C",   fase:"circulacion",  activo:true,  bono:true,  bonoRestantes:3,    fechaAlta:"2025-01-10", profesorFijo:null,    cocheAsignado:null },
  { id:5, nombre:"María",   apellidos:"García López",     telefono:"677889900", localidad:"Trujillo",   permiso:"B",   fase:null,           activo:true,  bono:false, bonoRestantes:null, fechaAlta:"2024-10-15", profesorFijo:"mamen", cocheAsignado:"audi_a3",      maxPracticas:6 },
  { id:6, nombre:"Lucía",   apellidos:"Martín Rubio",     telefono:"611223344", localidad:"Trujillo",   permiso:"B",   fase:null,           activo:true,  bono:false, bonoRestantes:null, fechaAlta:"2024-08-20", profesorFijo:"javi",  cocheAsignado:"toyota_auris", maxPracticas:6 },
  { id:7, nombre:"Miguel",  apellidos:"Romero Castillo",  telefono:"699445566", localidad:"Madroñera",  permiso:"B",   fase:null,           activo:false, bono:false, bonoRestantes:null, fechaAlta:"2025-01-22", profesorFijo:null,    cocheAsignado:null,           maxPracticas:4, transporte:true },
];

// ══════════════════════════════════════════════
// COMPONENTES COMPARTIDOS
// ══════════════════════════════════════════════
function Badge({ children, color }) {
  return <span style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, background:(color||"#1A3A6B")+"22", color:color||"#1A3A6B", border:"1px solid "+(color||"#1A3A6B")+"44" }}>{children}</span>;
}

function SelectorEstado({ valor, onChange }) {
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[{v:"todo",l:"Todo el día"},{v:"tramos",l:"Por tramos"},{v:"no",l:"No disponible"}].map(op=>(
        <button key={op.v} onClick={()=>onChange(op.v)} style={{ flex:1, padding:"7px 4px", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:"1.5px solid "+(valor===op.v?(op.v==="no"?"#C8102E":"#1A3A6B"):"#E8E0D5"), background:valor===op.v?(op.v==="no"?"#C8102E":"#1A3A6B"):"white", color:valor===op.v?"white":"#7A7A7A" }}>{op.l}</button>
      ))}
    </div>
  );
}

function GestorTramos({ tramos, onChange }) {
  return (
    <div style={{ marginTop:8 }}>
      {tramos.map((t,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
          <input type="time" value={t.desde} onChange={e=>onChange(tramos.map((x,j)=>j===i?{...x,desde:e.target.value}:x))} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:8, padding:"7px 8px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE" }} />
          <span style={{ fontSize:12, color:"#9A9A9A" }}>–</span>
          <input type="time" value={t.hasta} onChange={e=>onChange(tramos.map((x,j)=>j===i?{...x,hasta:e.target.value}:x))} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:8, padding:"7px 8px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE" }} />
          <button onClick={()=>onChange(tramos.filter((_,j)=>j!==i))} style={{ width:28, height:28, borderRadius:"50%", border:"1px solid #F5C4C4", background:"#FDF5F5", color:"#C8102E", cursor:"pointer", fontSize:14 }}>×</button>
        </div>
      ))}
      <button onClick={()=>onChange([...tramos,{desde:"09:00",hasta:"14:00"}])} style={{ width:"100%", padding:"7px", borderRadius:8, border:"1.5px dashed #1A3A6B44", background:"#EEF3FB", color:"#1A3A6B", fontFamily:"inherit", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Añadir tramo</button>
    </div>
  );
}

// ══════════════════════════════════════════════
// MÓDULO 1: CONFIGURACIÓN SEMANAL
// ══════════════════════════════════════════════
function ModuloConfig({ cfg, setCfg, alumnos, configId, setConfigId, tokens, setTokens }) {
  const [seccion, setSeccion] = useState("general");
  const [guardandoParcial, setGuardandoParcial] = useState(false);
  const [mostrarTokens, setMostrarTokens] = useState(false);
  const [seleccionados, setSeleccionados] = useState(new Set());
  const [generandoTokens, setGenerandoTokens] = useState(false);

  const setP = (k,v) => setCfg(p=>({...p,[k]:v}));
  const setProf = (pk,dia,field,val) => setCfg(p=>({...p, profesores:{...p.profesores,[pk]:{...p.profesores[pk],[dia]:{...p.profesores[pk][dia],[field]:val}}}}));
  const setVeh = (vk,dia,field,val) => setCfg(p=>({...p, vehiculos:{...p.vehiculos,[vk]:{...p.vehiculos[vk],[dia]:{...p.vehiculos[vk][dia],[field]:val}}}}));

  const TABS = [{k:"general",l:"📋 General"},{k:"profesores",l:"👤 Profesores"},{k:"vehiculos",l:"🚛 Vehículos"},{k:"pista",l:"🏁 Pista"},{k:"examen",l:"🎓 Examen"}];
  const [profActivo, setProfActivo] = useState("mamen");
  const [vehActivo, setVehActivo] = useState("renault_amarillo");

  return (
    <div>
      {/* Tabs */}
      <div style={{ display:"flex", gap:0, background:"white", borderBottom:"1px solid #E8E0D5", overflowX:"auto", marginBottom:14 }}>
        {TABS.map(t=>{
          const badge = t.k==="examen" && cfg.alumnosExamen.length>0 ? cfg.alumnosExamen.length : null;
          return (
            <button key={t.k} onClick={()=>setSeccion(t.k)} style={{ flex:"0 0 auto", padding:"10px 12px", border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700, color:seccion===t.k?"#1A3A6B":"#9A9A9A", borderBottom:seccion===t.k?"2.5px solid #1A3A6B":"2.5px solid transparent" }}>
              {t.l}{badge?<span style={{ marginLeft:4, fontSize:10, background:"#C8102E", color:"white", borderRadius:10, padding:"1px 5px" }}>{badge}</span>:null}
            </button>
          );
        })}
      </div>

      {/* General */}
      {seccion==="general" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", gap:8 }}>
            {[{k:"fechasSemanaDe",l:"Semana del"},{k:"fechasSemanaA",l:"Al"}].map(f=>(
              <div key={f.k} style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5 }}>{f.l}</div>
                <input type="date" value={cfg[f.k]} onChange={e=>setP(f.k,e.target.value)} style={{ width:"100%", border:"1.5px solid #E8E0D5", borderRadius:10, padding:"10px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE", boxSizing:"border-box" }} />
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5 }}>Fecha límite alumnos</div>
            <div style={{ display:"flex", gap:8 }}>
              <input type="date" value={cfg.fechaLimite} onChange={e=>setP("fechaLimite",e.target.value)} style={{ flex:2, border:"1.5px solid #E8E0D5", borderRadius:10, padding:"10px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE" }} />
              <input type="time" value={cfg.horaLimite} onChange={e=>setP("horaLimite",e.target.value)} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:10, padding:"10px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Día de examen</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[{v:null,l:"Sin examen"},...DIAS_SEMANA.map(d=>({v:d,l:DIAS_LABEL[d]}))].map(op=>(
                <button key={op.v||"none"} onClick={()=>setP("diaExamen",op.v)} style={{ padding:"7px 12px", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:"1.5px solid "+(cfg.diaExamen===op.v?(op.v?"#C8102E":"#1A3A6B"):"#E8E0D5"), background:cfg.diaExamen===op.v?(op.v?"#C8102E":"#1A3A6B"):"white", color:cfg.diaExamen===op.v?"white":"#7A7A7A" }}>{op.v?"🚫 ":""}{op.l}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:5 }}>Notas internas</div>
            <textarea value={cfg.notas} onChange={e=>setP("notas",e.target.value)} placeholder="Incidencias, recordatorios..." rows={3} style={{ width:"100%", border:"1.5px solid #E8E0D5", borderRadius:10, padding:"10px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE", resize:"vertical", boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={async()=>{
              try {
                setGuardandoParcial(true);
                const saved = await guardarConfigBorrador(cfg);
                setConfigId(saved.id);
                setTimeout(()=>setGuardandoParcial(false),1500);
              } catch(e) { console.error(e); setGuardandoParcial(false); }
            }} style={{ flex:1, padding:12, borderRadius:10, border:"1.5px solid #1A3A6B", background:"white", color:"#1A3A6B", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>{guardandoParcial?"✅ Guardado":"💾 Guardar borrador"}</button>
            <button onClick={async()=>{
              try {
                const saved = await guardarConfigBorrador(cfg);
                await activarSemanaDB(saved.id);
                setConfigId(saved.id);
                setMostrarTokens(true);
              } catch(e) { console.error(e); alert("Error al activar: "+e.message); }
            }} style={{ flex:2, padding:12, borderRadius:10, border:"none", background:"#C8102E", color:"white", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(200,16,46,0.25)" }}>⚡ Activar semana</button>
          </div>

          {/* MODAL SELECCIÓN ALUMNOS Y GENERACIÓN DE TOKENS */}
          {mostrarTokens && (
            <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
              <div style={{ background:"white", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:500, maxHeight:"85vh", overflowY:"auto", padding:"24px 20px 40px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                  <div style={{ fontSize:17, fontWeight:700 }}>📲 Seleccionar alumnos</div>
                  <button onClick={()=>setMostrarTokens(false)} style={{ width:32, height:32, borderRadius:"50%", border:"1.5px solid #E8E0D5", background:"white", cursor:"pointer", fontSize:16 }}>✕</button>
                </div>
                <div style={{ fontSize:13, color:"#5A5A5A", marginBottom:14 }}>Elige a qué alumnos enviar el enlace de disponibilidad esta semana.</div>
                <button onClick={()=>setSeleccionados(new Set(alumnos.filter(a=>a.activo).map(a=>a.id)))} style={{ fontSize:12, color:"#1A3A6B", fontWeight:600, background:"none", border:"none", cursor:"pointer", marginBottom:10 }}>✅ Seleccionar todos</button>
                <div style={{ marginBottom:16 }}>
                  {alumnos.filter(a=>a.activo).map(a=>{
                    const sel = seleccionados.has(a.id);
                    const yaToken = tokens.find(t=>t.alumno_id===a.id);
                    return (
                      <div key={a.id} onClick={()=>{
                        setSeleccionados(prev=>{const s=new Set(prev); sel?s.delete(a.id):s.add(a.id); return s;});
                      }} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:10, border:"1.5px solid "+(sel?"#1A3A6B":"#E8E0D5"), background:sel?"#EEF3FF":"white", marginBottom:6, cursor:"pointer" }}>
                        <div style={{ width:22, height:22, borderRadius:6, border:"2px solid "+(sel?"#1A3A6B":"#C0C0C0"), background:sel?"#1A3A6B":"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {sel && <span style={{ color:"white", fontSize:13, fontWeight:700 }}>✓</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos}, {a.nombre}</div>
                          <div style={{ fontSize:11, color:"#7A7A7A" }}>{a.localidad} · {a.permiso}</div>
                        </div>
                        {yaToken && <span style={{ fontSize:10, color:yaToken.usado?"#2E7D32":"#E65100", fontWeight:600 }}>{yaToken.usado?"✅ Enviado":"⏳ Pendiente"}</span>}
                      </div>
                    );
                  })}
                </div>
                <button onClick={async()=>{
                  if (seleccionados.size===0) { alert("Selecciona al menos un alumno."); return; }
                  setGenerandoTokens(true);
                  try {
                    const ids = [...seleccionados];
                    const fechaExp = cfg.fechaLimite || new Date(Date.now()+7*86400000).toISOString();
                    const registros = ids.map(alumnoId=>({
                      alumno_id: alumnoId,
                      config_id: configId,
                      expires_at: fechaExp,
                      usado: false,
                    }));
                    const { data, error } = await supabase
                      .from("tokens_alumno")
                      .upsert(registros, { onConflict:"alumno_id,config_id" })
                      .select("*, alumnos(nombre, apellidos, telefono)");
                    if (error) throw error;
                    setTokens(data);
                    setMostrarTokens(false);
                    alert(`✅ ${data.length} enlace(s) generado(s). Ve a la pestaña WhatsApp para enviarlos.`);
                  } catch(e) {
                    alert("Error generando tokens: "+e.message);
                  } finally {
                    setGenerandoTokens(false);
                  }
                }} style={{ width:"100%", padding:14, background:"#C8102E", color:"white", border:"none", borderRadius:12, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:"pointer" }}>
                  {generandoTokens?"⏳ Generando...":"📲 Generar enlaces"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profesores */}
      {seccion==="profesores" && (
        <div>
          <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto" }}>
            {PROFS.map(pk=>(
              <button key={pk} onClick={()=>setProfActivo(pk)} style={{ flex:"0 0 auto", padding:"8px 14px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:700, border:"1.5px solid "+(profActivo===pk?COLOR_PROF[pk]:"#E8E0D5"), background:profActivo===pk?COLOR_PROF[pk]:"white", color:profActivo===pk?"white":"#7A7A7A" }}>{PROF_LABEL[pk]}</button>
            ))}
          </div>
          {DIAS_SEMANA.map(dia=>{
            const DEFAULT_DIA_PROF = { estado:"todo", tramos:[], capBloqueo:{ activo:false, desde:"", hasta:"" }, tipoJornada: profActivo==="toni"?"completa":null };
            const raw = (cfg.profesores?.[profActivo]?.[dia]) || {};
            const d = { ...DEFAULT_DIA_PROF, ...raw, capBloqueo: { ...DEFAULT_DIA_PROF.capBloqueo, ...(raw.capBloqueo||{}) } };
            const cp = COLOR_PROF[profActivo];
            return (
              <div key={dia} style={{ background:"white", borderRadius:12, border:"1.5px solid "+(d.estado==="no"?"#F5C4C4":"#E8E0D5"), marginBottom:10, overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:d.estado==="no"?"#FDF5F5":"#F7F3EE", borderBottom:"1px solid #F0EBE5" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:d.estado==="no"?"#C8102E":cp, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{DIAS_CORTO[dia]}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:700 }}>{DIAS_LABEL[dia]}</div>
                  {profActivo==="toni" && d.estado!=="no" && (
                    <div style={{ display:"flex", gap:4 }}>
                      {["completa","parcial"].map(tj=>(
                        <button key={tj} onClick={()=>setProf(profActivo,dia,"tipoJornada",tj)} style={{ padding:"4px 8px", borderRadius:6, cursor:"pointer", fontFamily:"inherit", fontSize:10, fontWeight:700, border:"1.5px solid "+(d.tipoJornada===tj?cp:"#E8E0D5"), background:d.tipoJornada===tj?cp:"white", color:d.tipoJornada===tj?"white":"#7A7A7A" }}>{tj==="completa"?"Completa":"Parcial"}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding:"10px 12px" }}>
                  <SelectorEstado valor={d.estado} onChange={v=>setProf(profActivo,dia,"estado",v)} />
                  {d.estado==="tramos" && <GestorTramos tramos={d.tramos} onChange={v=>setProf(profActivo,dia,"tramos",v)} />}
                  {d.estado!=="no" && (
                    <div style={{ marginTop:10 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                        <input type="checkbox" checked={d.capBloqueo.activo} onChange={e=>setProf(profActivo,dia,"capBloqueo",{...d.capBloqueo,activo:e.target.checked})} style={{ width:16, height:16, accentColor:cp, cursor:"pointer" }} />
                        <span style={{ fontSize:12, fontWeight:600, color:"#5A5A5A" }}>Bloqueo CAP</span>
                      </div>
                      {d.capBloqueo.activo && (
                        <div style={{ display:"flex", alignItems:"center", gap:8, paddingLeft:24 }}>
                          <input type="time" value={d.capBloqueo.desde} onChange={e=>setProf(profActivo,dia,"capBloqueo",{...d.capBloqueo,desde:e.target.value})} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:8, padding:"7px 8px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE" }} />
                          <span style={{ fontSize:12, color:"#9A9A9A" }}>–</span>
                          <input type="time" value={d.capBloqueo.hasta} onChange={e=>setProf(profActivo,dia,"capBloqueo",{...d.capBloqueo,hasta:e.target.value})} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:8, padding:"7px 8px", fontFamily:"inherit", fontSize:13, outline:"none", background:"#F7F3EE" }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vehículos */}
      {seccion==="vehiculos" && (
        <div>
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
            {VEHICULOS_PESADOS.map(vk=>(
              <button key={vk} onClick={()=>setVehActivo(vk)} style={{ padding:"10px 14px", borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:"inherit", fontSize:13, fontWeight:600, border:"1.5px solid "+(vehActivo===vk?"#1A3A6B":"#E8E0D5"), background:vehActivo===vk?"#1A3A6B":"white", color:vehActivo===vk?"white":"#1C1C1C" }}>🚛 {VEH_LABEL[vk]}</button>
            ))}
          </div>
          {DIAS_SEMANA.map(dia=>{
            const DEFAULT_DIA_VEH = { estado:"todo", tramos:[], motivo:"" };
            const rawv = (cfg.vehiculos?.[vehActivo]?.[dia]) || {};
            const d = { ...DEFAULT_DIA_VEH, ...rawv };
            return (
              <div key={dia} style={{ background:"white", borderRadius:12, border:"1.5px solid "+(d.estado==="no"?"#F5C4C4":"#E8E0D5"), marginBottom:10, overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:d.estado==="no"?"#FDF5F5":"#F7F3EE", borderBottom:"1px solid #F0EBE5" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:d.estado==="no"?"#C8102E":"#5A5A5A", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{DIAS_CORTO[dia]}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:700 }}>{DIAS_LABEL[dia]}</div>
                </div>
                <div style={{ padding:"10px 12px" }}>
                  <SelectorEstado valor={d.estado} onChange={v=>setVeh(vehActivo,dia,"estado",v)} />
                  {d.estado==="tramos" && <GestorTramos tramos={d.tramos} onChange={v=>setVeh(vehActivo,dia,"tramos",v)} />}
                  {d.estado==="no" && <input value={d.motivo} onChange={e=>setVeh(vehActivo,dia,"motivo",e.target.value)} placeholder="Motivo interno" style={{ marginTop:8, width:"100%", border:"1.5px solid #E8E0D5", borderRadius:8, padding:"8px 12px", fontFamily:"inherit", fontSize:12, outline:"none", background:"#F7F3EE", boxSizing:"border-box" }} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pista */}
      {seccion==="pista" && (
        <div>
          <button onClick={()=>setCfg(p=>({...p,horasPista:{lunes:"20:12",martes:"20:14",miercoles:"20:16",jueves:"20:18",viernes:"20:20"}}))} style={{ width:"100%", padding:"10px", borderRadius:10, border:"1.5px solid #1A3A6B44", background:"#EEF3FB", color:"#1A3A6B", fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:14 }}>🌅 Cargar atardeceres automáticamente</button>
          {DIAS_SEMANA.map(dia=>(
            <div key={dia} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, background:"white", borderRadius:10, border:"1.5px solid #E8E0D5", padding:"10px 14px" }}>
              <div style={{ width:32, height:32, borderRadius:8, background:"#1A3A6B", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{DIAS_CORTO[dia]}</div>
              <div style={{ flex:1, fontSize:13, fontWeight:600 }}>{DIAS_LABEL[dia]}</div>
              <input type="time" value={cfg.horasPista[dia]||""} onChange={e=>setCfg(p=>({...p,horasPista:{...p.horasPista,[dia]:e.target.value}}))} style={{ border:"1.5px solid #E8E0D5", borderRadius:8, padding:"7px 10px", fontFamily:"inherit", fontSize:14, fontWeight:700, outline:"none", background:"#F7F3EE", color:"#1A3A6B", width:100 }} />
            </div>
          ))}
        </div>
      )}

      {/* Examen */}
      {seccion==="examen" && (
        <div>
          {!cfg.diaExamen ? (
            <div style={{ background:"#F7F3EE", borderRadius:12, border:"1.5px dashed #E8E0D5", padding:24, textAlign:"center", color:"#9A9A9A", fontSize:13 }}>Configura primero un día de examen en <strong>General</strong></div>
          ) : (
            <div>
              <div style={{ background:"#FEF3E2", border:"1.5px solid #F5C47A", borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:13, color:"#8A5A00" }}>
                📋 Examen el <strong>{DIAS_LABEL[cfg.diaExamen]}</strong> — los marcados tienen prioridad y el motor les asigna el día más cercano al examen
              </div>
              {alumnos.filter(a=>a.activo).map(a=>{
                const sel = cfg.alumnosExamen.includes(a.id);
                const cp = COLOR_PERM[a.permiso]||"#555";
                return (
                  <div key={a.id} onClick={()=>setCfg(p=>{const s=new Set(p.alumnosExamen);sel?s.delete(a.id):s.add(a.id);return{...p,alumnosExamen:[...s]};})} style={{ display:"flex", alignItems:"center", gap:12, background:"white", borderRadius:12, marginBottom:8, border:"1.5px solid "+(sel?"#C8102E":"#E8E0D5"), padding:"12px 14px", cursor:"pointer" }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:sel?"#C8102E":"#F0EBE5", color:sel?"white":"#9A9A9A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{sel?"✓":a.nombre[0]+a.apellidos[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos}, {a.nombre}</div>
                      <Badge color={cp}>{a.permiso}</Badge>
                    </div>
                    {sel && <span style={{ fontSize:11, fontWeight:700, color:"#C8102E" }}>📋 Examen</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// MÓDULO 2: GESTIÓN DE ALUMNOS (compacto)
// ══════════════════════════════════════════════
const LOCALIDADES = ["Trujillo","La Cumbre","Ibahernando","Torrecillas de la Tiesa","Aldeacentenera","Garcíaz","Madroñera","Zarza de Montánchez","Herguijuela","Santa Cruz de la Sierra","Puerto de Santa Cruz","Otra"];

function ModuloAlumnos({ alumnos, setAlumnos }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtros, setFiltros] = useState({ permiso:"todos", estado:"activos", bono:"todos" });
  const [modal, setModal] = useState(null);
  const [alumnoEditar, setAlumnoEditar] = useState(null);
  const [importando, setImportando] = useState(false);
  const setF = (k,v) => setFiltros(p=>({...p,[k]:v}));

  const filtrados = alumnos.filter(a=>{
    if (filtros.estado==="activos" && !a.activo) return false;
    if (filtros.estado==="archivados" && a.activo) return false;
    if (filtros.permiso!=="todos" && a.permiso!==filtros.permiso) return false;
    if (filtros.bono==="si" && !a.bono) return false;
    if (filtros.bono==="no" && a.bono) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      if (!(a.nombre+" "+a.apellidos+" "+a.localidad).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Importar Excel — lee filas desde fila 4 (tras cabecera y ayuda)
  const importarExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportando(true);
    try {
      const { read, utils } = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = read(buf);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = utils.sheet_to_json(ws, { header:1, defval:"" });
      const dataRows = rows.slice(3);
      const nuevos = [];
      for (const row of dataRows) {
        const nombre = (row[0]||"").toString().trim();
        const apellidos = (row[1]||"").toString().trim();
        if (!nombre || !apellidos) continue;
        const alumno = {
          nombre,
          apellidos,
          telefono: (row[2]||"").toString().trim(),
          localidad: (row[3]||"Trujillo").toString().trim(),
          permiso: (row[4]||"B").toString().trim().toUpperCase(),
          fase: (row[5]||"").toString().trim().toLowerCase() || null,
          bono: (row[6]||"NO").toString().trim().toUpperCase() === "SI",
          bono_restantes: row[7] ? parseInt(row[7]) : null,
          transporte: (row[8]||"NO").toString().trim().toUpperCase() === "SI",
          max_practicas_semana: row[9] ? parseInt(row[9]) : 6,
          activo: true,
          fecha_alta: new Date().toISOString().slice(0,10),
        };
        const { data, error } = await supabase.from("alumnos").insert(alumno).select().single();
        if (error) { console.error("Error insert:", error); throw new Error(error.message); }
        if (data) nuevos.push({ ...data, bonoRestantes: data.bono_restantes, profesorFijo: data.profesor_fijo, cocheAsignado: data.coche_asignado, maxPracticas: data.max_practicas_semana, fechaAlta: data.fecha_alta });
      }
      if (nuevos.length > 0) {
        setAlumnos(prev => [...prev, ...nuevos]);
        alert(`✅ ${nuevos.length} alumno(s) importado(s) correctamente.`);
      } else {
        alert("No se encontraron alumnos válidos en el Excel. Comprueba que los datos empiezan en la fila 4.");
      }
    } catch(err) {
      console.error(err);
      alert("Error al importar: " + err.message);
    } finally {
      setImportando(false);
      e.target.value = "";
    }
  };

  const guardar = (alumno) => {
    setAlumnos(prev => prev.find(a=>a.id===alumno.id) ? prev.map(a=>a.id===alumno.id?alumno:a) : [...prev,alumno]);
    setModal(null); setAlumnoEditar(null);
  };

  return (
    <div>
      {/* Buscador */}
      <div style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", marginBottom:10 }}>
        <span style={{ fontSize:16, color:"#9A9A9A" }}>🔍</span>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar..." style={{ flex:1, border:"none", background:"transparent", fontFamily:"inherit", fontSize:14, outline:"none" }} />
      </div>
      {/* Filtros rápidos */}
      <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto" }}>
        {[{k:"estado",ops:[{v:"activos",l:"Activos"},{v:"archivados",l:"Archivados"},{v:"todos",l:"Todos"}]},{k:"permiso",ops:[{v:"todos",l:"Todos"},{v:"B",l:"B"},{v:"C",l:"C"},{v:"C+E",l:"C+E"}]}].map(f=>
          f.ops.map(op=>(
            <button key={f.k+op.v} onClick={()=>setF(f.k,op.v)} style={{ flex:"0 0 auto", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:"1.5px solid "+(filtros[f.k]===op.v?"#1A3A6B":"#E8E0D5"), background:filtros[f.k]===op.v?"#1A3A6B":"white", color:filtros[f.k]===op.v?"white":"#7A7A7A" }}>{op.l}</button>
          ))
        )}
      </div>
      {/* Lista */}
      <div style={{ marginBottom:70 }}>
        {filtrados.map(a=>(
          <div key={a.id} style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", padding:"12px 14px", marginBottom:8, opacity:a.activo?1:0.55 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div onClick={()=>{setAlumnoEditar(a);setModal("editar");}} style={{ width:36, height:36, borderRadius:"50%", background:a.activo?"#1A3A6B":"#C0C0C0", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, cursor:"pointer", flexShrink:0 }}>{a.nombre[0]}{a.apellidos[0]}</div>
              <div onClick={()=>{setAlumnoEditar(a);setModal("editar");}} style={{ flex:1, cursor:"pointer" }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos}, {a.nombre}</div>
                <div style={{ fontSize:12, color:"#7A7A7A" }}>{a.localidad}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <Badge color={COLOR_PERM[a.permiso]}>{a.permiso}</Badge>
                {!a.activo && <Badge color="#9A9A9A">Archivado</Badge>}
              </div>
              <button
                onClick={async (e)=>{
                  e.stopPropagation();
                  if (!window.confirm(`¿Borrar a ${a.nombre} ${a.apellidos} permanentemente? Esta acción no se puede deshacer.`)) return;
                  try {
                    await supabase.from("alumnos").delete().eq("id", a.id);
                    setAlumnos(prev => prev.filter(x => x.id !== a.id));
                  } catch(err) {
                    alert("Error al borrar: " + err.message);
                  }
                }}
                style={{ width:32, height:32, borderRadius:"50%", border:"1.5px solid #FFD0D0", background:"#FFF5F5", color:"#C8102E", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                title="Borrar alumno"
              >🗑</button>
            </div>
          </div>
        ))}
      </div>
      {/* FAB nuevo alumno */}
      <button onClick={()=>{setAlumnoEditar(null);setModal("nuevo");}} style={{ position:"fixed", bottom:80, right:16, width:56, height:56, borderRadius:"50%", background:"#C8102E", border:"none", color:"white", fontSize:26, cursor:"pointer", boxShadow:"0 6px 20px rgba(200,16,46,0.35)", zIndex:200 }}>+</button>
      {/* Botón importar Excel */}
      <label style={{ position:"fixed", bottom:80, right:82, width:46, height:46, borderRadius:"50%", background:"#1A3A6B", border:"none", color:"white", fontSize:20, cursor:"pointer", boxShadow:"0 4px 14px rgba(26,58,107,0.35)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }} title="Importar Excel">
        {importando ? "⏳" : "📥"}
        <input type="file" accept=".xlsx,.xls" onChange={importarExcel} style={{ display:"none" }} />
      </label>
      {/* Modal */}
      {(modal==="nuevo"||modal==="editar") && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div style={{ background:"white", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, maxHeight:"90vh", overflowY:"auto", padding:"24px 20px 40px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ fontSize:17, fontWeight:700 }}>{modal==="nuevo"?"Nuevo alumno":"Editar alumno"}</div>
              <button onClick={()=>{setModal(null);setAlumnoEditar(null);}} style={{ width:32, height:32, borderRadius:"50%", border:"1.5px solid #E8E0D5", background:"white", cursor:"pointer", fontSize:16 }}>✕</button>
            </div>
            <FormAlumnoCompacto alumno={alumnoEditar} onGuardar={guardar} />
          </div>
        </div>
      )}
    </div>
  );
}

function FormAlumnoCompacto({ alumno, onGuardar }) {
  const esNuevo = !alumno?.id;
  const [form, setForm] = useState(alumno || { nombre:"", apellidos:"", telefono:"", localidad:"Trujillo", permiso:"B", fase:null, activo:true, bono:false, bonoRestantes:"", fechaAlta:new Date().toISOString().slice(0,10), profesorFijo:null, cocheAsignado:null });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const valido = form.nombre.trim() && form.apellidos.trim() && form.telefono.trim();
  return (
    <div>
      {[{l:"Nombre",k:"nombre"},{l:"Apellidos",k:"apellidos"},{l:"Teléfono",k:"telefono",t:"tel"}].map(f=>(
        <div key={f.k} style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 }}>{f.l}</div>
          <input type={f.t||"text"} value={form[f.k]} onChange={e=>set(f.k,e.target.value)} style={{ width:"100%", border:"1.5px solid #E8E0D5", borderRadius:10, padding:"10px 12px", fontFamily:"inherit", fontSize:14, outline:"none", background:"#F7F3EE", boxSizing:"border-box" }} />
        </div>
      ))}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:4 }}>Localidad</div>
        <select value={form.localidad} onChange={e=>set("localidad",e.target.value)} style={{ width:"100%", border:"1.5px solid #E8E0D5", borderRadius:10, padding:"10px 12px", fontFamily:"inherit", fontSize:14, outline:"none", background:"#F7F3EE" }}>
          {LOCALIDADES.map(l=><option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Permiso</div>
        <div style={{ display:"flex", gap:8 }}>
          {["B","C","C+E"].map(p=>(
            <button key={p} onClick={()=>{set("permiso",p);if(p==="B")set("fase",null);}} style={{ flex:1, padding:"10px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:15, fontWeight:700, border:"1.5px solid "+(form.permiso===p?"#1A3A6B":"#E8E0D5"), background:form.permiso===p?"#1A3A6B":"white", color:form.permiso===p?"white":"#7A7A7A" }}>{p}</button>
          ))}
        </div>
      </div>
      {form.permiso!=="B" && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Fase</div>
          <div style={{ display:"flex", gap:8 }}>
            {[{k:"pista",l:"🏁 Pista"},{k:"circulacion",l:"🛣️ Circulación"}].map(f=>(
              <button key={f.k} onClick={()=>set("fase",f.k)} style={{ flex:1, padding:"10px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, border:"1.5px solid "+(form.fase===f.k?"#1A3A6B":"#E8E0D5"), background:form.fase===f.k?"#1A3A6B":"white", color:form.fase===f.k?"white":"#7A7A7A" }}>{f.l}</button>
            ))}
          </div>
        </div>
      )}
      {!esNuevo && (
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Estado</div>
          <div style={{ display:"flex", gap:8 }}>
            {[{v:true,l:"✅ Activo"},{v:false,l:"📁 Archivado"}].map(op=>(
              <button key={String(op.v)} onClick={()=>set("activo",op.v)} style={{ flex:1, padding:"10px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600, border:"1.5px solid "+(form.activo===op.v?(op.v?"#1A6B3A":"#C8102E"):"#E8E0D5"), background:form.activo===op.v?(op.v?"#1A6B3A":"#C8102E"):"white", color:form.activo===op.v?"white":"#7A7A7A" }}>{op.l}</button>
            ))}
          </div>
        </div>
      )}
      {/* Profesor preferente */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Profesor preferente</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[{v:null,l:"Auto"}, ...PROFS.map(pk=>({v:pk,l:PROF_LABEL[pk]}))].map(op=>(
            <button key={String(op.v)} onClick={()=>set("profesorFijo",op.v)} style={{ padding:"7px 12px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:"1.5px solid "+(form.profesorFijo===op.v?"#1A3A6B":"#E8E0D5"), background:form.profesorFijo===op.v?"#1A3A6B":"white", color:form.profesorFijo===op.v?"white":"#7A7A7A" }}>{op.l}</button>
          ))}
        </div>
      </div>
      {/* Vehículo asignado */}
      <div style={{ marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:600, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Vehículo {form.permiso==="B"?"fijo":"preferente"}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[{v:null,l:"Auto"}, ...(form.permiso==="B"
            ? [{v:"audi_a3",l:"Audi A3"},{v:"toyota_auris",l:"Toyota Auris"}]
            : form.permiso==="C"
              ? [{v:"renault_amarillo",l:"R.Amarillo"},{v:"renault_blanco",l:"R.Blanco"}]
              : [{v:"trailer_renault",l:"Tráiler R."},{v:"trailer_mercedes",l:"Tráiler M."}]
          )].map(op=>(
            <button key={String(op.v)} onClick={()=>set("cocheAsignado",op.v)} style={{ padding:"7px 12px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:"1.5px solid "+(form.cocheAsignado===op.v?"#C8102E":"#E8E0D5"), background:form.cocheAsignado===op.v?"#C8102E":"white", color:form.cocheAsignado===op.v?"white":"#7A7A7A" }}>{op.l}</button>
          ))}
        </div>
      </div>
      <button disabled={!valido} onClick={()=>onGuardar({...form,id:form.id||Date.now()})} style={{ width:"100%", padding:14, marginTop:8, background:valido?"#C8102E":"#C0C0C0", color:"white", border:"none", borderRadius:12, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:valido?"pointer":"not-allowed" }}>
        {esNuevo?"Dar de alta":"Guardar cambios"}
      </button>
    </div>
  );
}


// ══════════════════════════════════════════════
// GENERADORES DE PDF (ventana HTML imprimible)
// ══════════════════════════════════════════════

function semanaLabel(cfg) {
  const de = cfg.fechasSemanaDe || "";
  const a  = cfg.fechasSemanaA  || "";
  return de ? `Semana del ${de} al ${a}` : "Semana actual";
}

function estilosPDF() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
    body { padding: 20px; color: #1a1a1a; font-size: 12px; }
    h1 { font-size: 18px; color: #1A3A6B; margin-bottom: 4px; }
    h2 { font-size: 14px; color: #1A3A6B; margin: 16px 0 8px; border-bottom: 2px solid #1A3A6B; padding-bottom: 4px; }
    h3 { font-size: 12px; color: #555; margin: 10px 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .cabecera { background: #1A3A6B; color: white; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; }
    .cabecera h1 { color: white; }
    .cabecera p  { font-size: 11px; opacity: 0.85; margin-top: 4px; }
    .practica { display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; background: #f7f7f7; border-radius: 6px; border-left: 4px solid #1A3A6B; margin-bottom: 6px; page-break-inside: avoid; }
    .practica .hora { font-weight: 700; font-size: 13px; min-width: 90px; }
    .practica .info { flex: 1; }
    .practica .nombre { font-weight: 700; font-size: 13px; }
    .practica .detalle { font-size: 11px; color: #666; margin-top: 2px; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 20px; font-size: 10px; font-weight: 700; margin-right: 4px; }
    .badge-b   { background: #E3F2FD; color: #1565C0; }
    .badge-c   { background: #FFF3E0; color: #E65100; }
    .badge-ce  { background: #F3E5F5; color: #6A1B9A; }
    .badge-pista { background: #FFF8E1; color: #F57F17; }
    .total { background: #EEF2FF; padding: 6px 10px; border-radius: 6px; font-size: 11px; color: #3949AB; font-weight: 600; margin-bottom: 10px; }
    .separador { height: 1px; background: #E0E0E0; margin: 12px 0; }
    @media print { body { padding: 10px; } .no-print { display: none; } }
  `;
}

function colorProf(profKey) {
  const mapa = { mamen:"#1A6B3A", javi:"#7B2DBF", pablo:"#C8102E", toni:"#1A3A6B" };
  return mapa[profKey] || "#555";
}

function abrirVentanaPDF(titulo, htmlContenido) {
  const estilos = estilosPDF();
  const btnStyle = "position:fixed;top:10px;right:10px;padding:8px 16px;background:#1A3A6B;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:700;z-index:999;";
  const html = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + titulo + "</title><style>" + estilos + "</style></head><body>"
    + "<button class=\"no-print\" onclick=\"window.print()\" style=\"" + btnStyle + "\">Imprimir / Guardar PDF</button>"
    + htmlContenido + "</body></html>";
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    const a = document.createElement("a");
    a.href = url;
    a.download = titulo.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-") + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}
function chipPermiso(permiso) {
  const cls = permiso==="B"?"badge-b":permiso==="C"?"badge-c":"badge-ce";
  return `<span class="badge ${cls}">${permiso}</span>`;
}

function generarPDFGeneral(planning, alumnos, cfg) {
  let html = `<div class="cabecera"><h1>AUTOESCUELA HERRERO — Planning General</h1><p>${semanaLabel(cfg)}</p></div>`;
  for (const profKey of ["mamen","javi","pablo","toni"]) {
    const todasProf = DIAS_SEMANA.flatMap(d => (planning[d]||[]).filter(p=>p.profesor===profKey));
    if (!todasProf.length) continue;
    const totalMin = todasProf.reduce((a,p)=>a+(p.duracion||0),0);
    const cp = colorProf(profKey);
    html += `<h2 style="color:${cp};border-color:${cp}">👤 ${PROF_LABEL[profKey]} <span style="font-size:11px;font-weight:400">${todasProf.length} prácticas · ${Math.floor(totalMin/60)}h ${totalMin%60}min</span></h2>`;
    for (const dia of DIAS_SEMANA) {
      const pracs = (planning[dia]||[]).filter(p=>p.profesor===profKey);
      if (!pracs.length) continue;
      html += `<h3>${DIAS_LABEL[dia]}</h3>`;
      for (const p of pracs) {
        html += `<div class="practica" style="border-left-color:${cp}">
          <div class="hora">${p.desde}–${p.hasta}</div>
          <div class="info">
            <div class="nombre">${p.alumnoNombre}</div>
            <div class="detalle">${chipPermiso(p.permiso)} ${VEH_LABEL[p.vehiculo]||"—"} · ${p.tipo==="pista"?"🏁 Pista":"Circulación"} · ${p.duracion}min</div>
          </div>
        </div>`;
      }
    }
  }
  abrirVentanaPDF("Planning General", html);
}

function generarPDFsProfesores(planning, alumnos, cfg) {
  for (const profKey of ["mamen","javi","pablo","toni"]) {
    const todasProf = DIAS_SEMANA.flatMap(d => (planning[d]||[]).filter(p=>p.profesor===profKey));
    if (!todasProf.length) continue;
    const totalMin = todasProf.reduce((a,p)=>a+(p.duracion||0),0);
    const cp = colorProf(profKey);
    let html = `<div class="cabecera" style="background:${cp}"><h1>AUTOESCUELA HERRERO · ${PROF_LABEL[profKey].toUpperCase()}</h1><p>${semanaLabel(cfg)}</p></div>`;
    html += `<div class="total">Total semana: ${todasProf.length} prácticas · ${Math.floor(totalMin/60)}h ${totalMin%60>0?totalMin%60+"min":""}</div>`;
    for (const dia of DIAS_SEMANA) {
      const pracs = (planning[dia]||[]).filter(p=>p.profesor===profKey);
      if (!pracs.length) continue;
      const minDia = pracs.reduce((a,p)=>a+(p.duracion||0),0);
      html += `<h2>${DIAS_LABEL[dia]} <span style="font-size:11px;font-weight:400">${Math.floor(minDia/60)}h ${minDia%60>0?minDia%60+"min":""}</span></h2>`;
      for (const p of pracs) {
        html += `<div class="practica" style="border-left-color:${cp}">
          <div class="hora">${p.desde}–${p.hasta}</div>
          <div class="info">
            <div class="nombre">${p.alumnoNombre}</div>
            <div class="detalle">${chipPermiso(p.permiso)} ${VEH_LABEL[p.vehiculo]||"—"} · ${p.tipo==="pista"?"🏁 Pista":"Circulación"} · ${p.duracion}min</div>
          </div>
        </div>`;
      }
    }
    abrirVentanaPDF(`Planning ${PROF_LABEL[profKey]}`, html);
  }
}

function generarPDFsAlumnos(planning, alumnos, cfg) {
  const alumnosConPracs = alumnos.filter(a =>
    DIAS_SEMANA.some(d => (planning[d]||[]).some(p => p.alumnoId === a.id))
  );
  for (const alumno of alumnosConPracs) {
    const todasAlumno = DIAS_SEMANA.flatMap(d => (planning[d]||[]).filter(p=>p.alumnoId===alumno.id));
    const totalMin = todasAlumno.reduce((a,p)=>a+(p.duracion||0),0);
    let html = `<div class="cabecera" style="background:#C8102E"><h1>AUTOESCUELA HERRERO</h1><p>Tus prácticas · ${semanaLabel(cfg)}</p></div>`;
    html += `<div style="background:#F7F3EE;border-radius:8px;padding:12px 14px;margin-bottom:14px;">
      <div style="font-size:16px;font-weight:700;color:#1A3A6B">${alumno.apellidos}, ${alumno.nombre}</div>
      <div style="font-size:11px;color:#666;margin-top:4px">${alumno.localidad} · Permiso ${alumno.permiso}${alumno.fase ? " · " + alumno.fase : ""}</div>
    </div>`;
    html += `<div class="total">Total semana: ${todasAlumno.length} prácticas · ${Math.floor(totalMin/60)}h ${totalMin%60>0?totalMin%60+"min":""}</div>`;
    for (const dia of DIAS_SEMANA) {
      const pracs = (planning[dia]||[]).filter(p=>p.alumnoId===alumno.id);
      if (!pracs.length) continue;
      html += `<h2>${DIAS_LABEL[dia]}</h2>`;
      for (const p of pracs) {
        const cp = colorProf(p.profesor);
        html += `<div class="practica" style="border-left-color:${cp}">
          <div class="hora">${p.desde}–${p.hasta}</div>
          <div class="info">
            <div class="nombre" style="color:${cp}">${PROF_LABEL[p.profesor]}</div>
            <div class="detalle">${VEH_LABEL[p.vehiculo]||"—"} · ${p.tipo==="pista"?"🏁 Pista":"Circulación"} · ${p.duracion}min</div>
          </div>
        </div>`;
      }
    }
    html += `<div class="separador"></div><p style="font-size:10px;color:#999;text-align:center">Autoescuela Herrero · C/ Tenerías 6 bajo · Trujillo · 688 70 86 69</p>`;
    abrirVentanaPDF(`Prácticas ${alumno.apellidos} ${alumno.nombre}`, html);
  }
}

// ══════════════════════════════════════════════
// MÓDULO 3: PLANNING
// ══════════════════════════════════════════════
function ChipPractica({ p, onClick }) {
  const cp = COLOR_PROF[p.profesor]||"#555";
  return (
    <div onClick={onClick} style={{ background:"white", borderRadius:8, borderLeft:"3px solid "+cp, border:"1px solid "+cp+"33", borderLeftWidth:3, borderLeftColor:cp, padding:"8px 10px", marginBottom:4, cursor:"pointer" }}>
      <div style={{ fontSize:11, fontWeight:700, color:cp }}>{p.desde}–{p.hasta} <span style={{ fontSize:10, color:"#9A9A9A", fontWeight:400 }}>{p.duracion}min</span></div>
      <div style={{ fontSize:13, fontWeight:700, color:"#1C1C1C", marginTop:1 }}>{p.alumnoNombre}</div>
      <div style={{ display:"flex", gap:4, marginTop:4, flexWrap:"wrap" }}>
        <Badge color={COLOR_PERM[p.permiso]}>{p.permiso}</Badge>
        {p.tipo==="pista"&&<span style={{ fontSize:10, color:"#D4700A", fontWeight:600 }}>🏁Pista</span>}
      </div>
    </div>
  );
}

function ModuloPlanning({ cfg, alumnos, configId, planning, setPlanning, sinAsignar, setSinAsignar }) {
  const [diaActivo, setDiaActivo] = useState("lunes");
  const [vista, setVista] = useState("dia");
  const [modalP, setModalP] = useState(null);
  const [generando, setGenerando] = useState(false);

  const ejecutar = async () => {
    setGenerando(true);
    try {
      // Cargar disponibilidades reales si hay configId
      let dispPorAlumno = {};
      if (configId) {
        const disps = await getDisponibilidades(configId);
        (disps || []).forEach(d => {
          dispPorAlumno[d.alumno_id] = d.dias || {};
        });
      }

      const alumnosConDisp = alumnos.filter(a => a.activo).map(a => {
        const diasDisp = dispPorAlumno[a.id];
        let disponibilidad;
        if (diasDisp && Object.keys(diasDisp).length > 0) {
          // Convertir franjas de Supabase al formato del motor
          disponibilidad = Object.fromEntries(DIAS_SEMANA.map(d => {
            const franjas = diasDisp[d] || [];
            if (franjas.length === 0) return [d, { estado: "no" }];
            if (franjas.includes("manana") && franjas.includes("tarde") && franjas.includes("noche")) return [d, { estado: "todo" }];
            return [d, { estado: "tramos", tramos: franjaATramos(franjas) }];
          }));
        } else {
          // Sin disponibilidad registrada: disponible todo
          disponibilidad = Object.fromEntries(DIAS_SEMANA.map(d => [d, { estado: "todo" }]));
        }
        return { ...a, disponibilidad };
      });

      const res = generarPlanning(cfg, alumnosConDisp, DIAS_SEMANA);
      setPlanning(res.planning);
      setSinAsignar(res.sinAsignar);
    } catch(e) {
      console.error("Error generando planning:", e);
      alert("Error al generar planning: " + (e.message || e));
    } finally {
      setGenerando(false);
    }
  };

  // Convierte franjas ["manana","tarde"] a tramos horarios
  const franjaATramos = (franjas) => {
    const mapa = { manana:[{desde:"09:00",hasta:"14:00"}], tarde:[{desde:"14:00",hasta:"17:00"}], noche:[{desde:"17:00",hasta:"21:00"}] };
    return franjas.flatMap(f => mapa[f] || []);
  };

  const totalAsignadas = planning ? Object.values(planning).flat().length : 0;

  return (
    <div>
      <button onClick={ejecutar} disabled={generando} style={{ width:"100%", padding:14, background:generando?"#5A5A5A":"#1A3A6B", color:"white", border:"none", borderRadius:12, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:generando?"not-allowed":"pointer", boxShadow:"0 4px 16px rgba(26,58,107,0.3)", marginBottom:12 }}>{generando ? "⏳ Generando..." : "⚡ Generar planning"}</button>

      {planning && <>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          {[{l:"Asignadas",v:totalAsignadas,c:"#1A6B3A"},{l:"Sin asignar",v:sinAsignar.length,c:sinAsignar.length>0?"#C8102E":"#9A9A9A"}].map((x,i)=>(
            <div key={i} style={{ background:"white", borderRadius:10, padding:"10px 14px", border:"1px solid #E8E0D5", flex:1, textAlign:"center" }}>
              <div style={{ fontSize:20, fontWeight:800, color:x.c }}>{x.v}</div>
              <div style={{ fontSize:10, color:"#9A9A9A" }}>{x.l}</div>
            </div>
          ))}
        </div>

        {sinAsignar.length>0 && (
          <div style={{ background:"#FDF5F5", border:"1.5px solid #F5C4C4", borderRadius:10, padding:"10px 14px", marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#C8102E", marginBottom:6 }}>⚠️ Sin asignar</div>
            {sinAsignar.map((a,i)=><div key={i} style={{ fontSize:12, color:"#5A5A5A" }}>· {a.alumnoNombre} ({a.permiso})</div>)}
          </div>
        )}

        {/* Botones de PDF */}
        <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
          <button onClick={()=>generarPDFGeneral(planning, alumnos, cfg)} style={{ flex:"1 1 auto", padding:"9px 12px", borderRadius:10, border:"1.5px solid #1A3A6B", background:"white", color:"#1A3A6B", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>📄 PDF General</button>
          <button onClick={()=>generarPDFsProfesores(planning, alumnos, cfg)} style={{ flex:"1 1 auto", padding:"9px 12px", borderRadius:10, border:"1.5px solid #2E7D32", background:"white", color:"#2E7D32", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>👤 PDF por Profesor</button>
          <button onClick={()=>generarPDFsAlumnos(planning, alumnos, cfg)} style={{ flex:"1 1 auto", padding:"9px 12px", borderRadius:10, border:"1.5px solid #C8102E", background:"white", color:"#C8102E", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>🎓 PDF por Alumno</button>
        </div>

        <div style={{ display:"flex", gap:6, marginBottom:10, overflowX:"auto" }}>
          {[{k:"dia",l:"📅 Por día"},{k:"profesor",l:"👤 Profesor"},{k:"semanal",l:"🗓 Semanal"},{k:"vehiculos",l:"🚗 Vehículos"}].map(v=>(
            <button key={v.k} onClick={()=>setVista(v.k)} style={{ flex:"0 0 auto", padding:"7px 12px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:"1.5px solid "+(vista===v.k?"#1A3A6B":"#E8E0D5"), background:vista===v.k?"#1A3A6B":"white", color:vista===v.k?"white":"#7A7A7A" }}>{v.l}</button>
          ))}
        </div>

        {vista!=="semanal" && (
          <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto" }}>
            {DIAS_SEMANA.map(d=>(
              <button key={d} onClick={()=>setDiaActivo(d)} style={{ flex:"0 0 auto", padding:"7px 12px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:"1.5px solid "+(diaActivo===d?"#1A3A6B":"#E8E0D5"), background:diaActivo===d?"#1A3A6B":"white", color:diaActivo===d?"white":"#7A7A7A" }}>
                {DIAS_LABEL[d]} <span style={{ fontSize:10, opacity:0.7 }}>({(planning[d]||[]).length})</span>
              </button>
            ))}
          </div>
        )}

        {vista==="dia" && (
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${PROFS.filter(pk=>(planning[diaActivo]||[]).some(p=>p.profesor===pk)).length||1},1fr)`, gap:8 }}>
            {PROFS.filter(pk=>(planning[diaActivo]||[]).some(p=>p.profesor===pk)).map(pk=>{
              const cp=COLOR_PROF[pk];
              return (
                <div key={pk}>
                  <div style={{ background:cp, color:"white", borderRadius:"10px 10px 0 0", padding:"7px 10px", fontSize:12, fontWeight:700, textAlign:"center" }}>{PROF_LABEL[pk]}</div>
                  <div style={{ background:"white", border:"1px solid "+cp+"33", borderTop:"none", borderRadius:"0 0 10px 10px", padding:"8px" }}>
                    {(planning[diaActivo]||[]).filter(p=>p.profesor===pk).map((p,i)=><ChipPractica key={i} p={p} onClick={()=>setModalP({p,dia:diaActivo})} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {vista==="profesor" && PROFS.map(pk=>{
          const pracs=(planning[diaActivo]||[]).filter(p=>p.profesor===pk);
          const cp=COLOR_PROF[pk];
          return (
            <div key={pk} style={{ background:"white", borderRadius:12, border:"1.5px solid "+cp+"33", marginBottom:10, overflow:"hidden" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:cp+"12", padding:"10px 14px", borderBottom:"1px solid "+cp+"22" }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:cp, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{PROF_LABEL[pk][0]}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700 }}>{PROF_LABEL[pk]}</div><div style={{ fontSize:11, color:"#9A9A9A" }}>{pracs.length} prácticas</div></div>
              </div>
              <div style={{ padding:"8px 10px" }}>
                {pracs.length===0?<div style={{ fontSize:12, color:"#C0C0C0", textAlign:"center", padding:"8px 0" }}>Sin prácticas</div>:pracs.map((p,i)=><ChipPractica key={i} p={p} onClick={()=>setModalP({p,dia:diaActivo})} />)}
              </div>
            </div>
          );
        })}

        {vista==="semanal" && (
          <div style={{ overflowX:"auto" }}>
            <div style={{ display:"grid", gridTemplateColumns:"60px repeat(5,1fr)", gap:4, minWidth:420 }}>
              <div/>
              {DIAS_SEMANA.map(d=><div key={d} style={{ background:"#1A3A6B", color:"white", borderRadius:6, padding:"5px", fontSize:11, fontWeight:700, textAlign:"center" }}>{DIAS_LABEL[d].slice(0,3)}<div style={{ fontSize:9, opacity:0.7 }}>{(planning[d]||[]).length}</div></div>)}
              {PROFS.map(pk=>{
                const cp=COLOR_PROF[pk];
                return [
                  <div key={pk+"_l"} style={{ display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:28, height:28, borderRadius:"50%", background:cp, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{PROF_LABEL[pk][0]}</div></div>,
                  ...DIAS_SEMANA.map(d=>(
                    <div key={pk+"_"+d} style={{ background:"white", border:"1px solid "+cp+"22", borderRadius:6, padding:"3px", minHeight:50 }}>
                      {(planning[d]||[]).filter(p=>p.profesor===pk).map((p,i)=>(
                        <div key={i} onClick={()=>setModalP({p,dia:d})} style={{ fontSize:9, fontWeight:600, color:cp, padding:"2px 4px", borderRadius:4, background:cp+"11", marginBottom:2, cursor:"pointer", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.desde} {p.alumnoNombre.split(",")[0]}</div>
                      ))}
                    </div>
                  ))
                ];
              })}
            </div>
          </div>
        )}

        {vista==="vehiculos" && (
          <div>
            {Object.keys(VEH_LABEL).map(vk => {
              const todasPracs = DIAS_SEMANA.flatMap(d =>
                (planning[d]||[]).filter(p => p.vehiculo === vk).map(p => ({...p, dia:d}))
              );
              const totalMin = todasPracs.reduce((acc,p) => acc + (p.duracion||0), 0);
              const totalH = Math.floor(totalMin/60);
              const totalM = totalMin % 60;
              if (todasPracs.length === 0) return null;
              return (
                <div key={vk} style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", marginBottom:12, overflow:"hidden" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"#1A3A6B", padding:"10px 14px" }}>
                    <div style={{ color:"white", fontWeight:700, fontSize:14 }}>🚗 {VEH_LABEL[vk]}</div>
                    <div style={{ color:"#A8C4E8", fontSize:12, fontWeight:600 }}>{totalH}h {totalM>0?totalM+"min":""} · {todasPracs.length} prácticas</div>
                  </div>
                  {DIAS_SEMANA.map(d => {
                    const pracs = (planning[d]||[]).filter(p => p.vehiculo === vk);
                    if (pracs.length === 0) return null;
                    return (
                      <div key={d} style={{ borderBottom:"1px solid #F0EBE5", padding:"8px 14px" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.6px", marginBottom:6 }}>{DIAS_LABEL[d]}</div>
                        {pracs.map((p,i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, padding:"6px 10px", background:"#F7F3EE", borderRadius:8, borderLeft:"3px solid "+(COLOR_PROF[p.profesor]||"#888") }}>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, fontWeight:700 }}>{p.alumnoNombre}</div>
                              <div style={{ fontSize:11, color:"#7A7A7A" }}>{p.desde}–{p.hasta} · {p.duracion}min · {PROF_LABEL[p.profesor]}</div>
                            </div>
                            <div style={{ display:"flex", gap:4 }}>
                              {p.tipo==="pista" && <span style={{ fontSize:10, color:"#D4700A", fontWeight:700 }}>🏁Pista</span>}
                              <span style={{ fontSize:10, color:"#7A7A7A" }}>{p.permiso}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {/* Horas totales por día */}
                  <div style={{ padding:"8px 14px", background:"#F7F9FF", display:"flex", gap:6, flexWrap:"wrap" }}>
                    {DIAS_SEMANA.map(d => {
                      const min = (planning[d]||[]).filter(p=>p.vehiculo===vk).reduce((a,p)=>a+(p.duracion||0),0);
                      if (!min) return null;
                      return <span key={d} style={{ fontSize:10, fontWeight:600, color:"#1A3A6B", background:"#E0EAF8", padding:"3px 8px", borderRadius:20 }}>{DIAS_LABEL[d].slice(0,3)}: {Math.floor(min/60)}h{min%60>0?min%60+"m":""}</span>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {modalP && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
            <div style={{ background:"white", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"24px 20px 40px", maxHeight:"90vh", overflowY:"auto" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontSize:17, fontWeight:700 }}>Editar práctica</div>
                <button onClick={()=>setModalP(null)} style={{ width:32, height:32, borderRadius:"50%", border:"1.5px solid #E8E0D5", background:"white", cursor:"pointer", fontSize:16 }}>✕</button>
              </div>
              <div style={{ background:COLOR_PROF[modalP.p.profesor]+"11", border:"1px solid "+COLOR_PROF[modalP.p.profesor]+"33", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                <div style={{ fontSize:17, fontWeight:800 }}>{modalP.p.alumnoNombre}</div>
                <div style={{ fontSize:14, color:COLOR_PROF[modalP.p.profesor], fontWeight:700, marginTop:4 }}>{DIAS_LABEL[modalP.dia]} · {modalP.p.desde}–{modalP.p.hasta}</div>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  <Badge color={COLOR_PERM[modalP.p.permiso]}>{modalP.p.permiso}</Badge>
                  {modalP.p.tipo==="pista"&&<Badge color="#D4700A">🏁 Pista</Badge>}
                  <Badge color="#5A7A9A">🚗 {VEH_LABEL[modalP.p.vehiculo]||"Sin vehículo"}</Badge>
                </div>
              </div>
              {/* Cambiar profesor */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Cambiar profesor</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {PROFS.filter(pk => CAPACIDADES[pk]?.includes(modalP.p.permiso)).map(pk=>(
                    <button key={pk} onClick={()=>setModalP(mp=>({...mp, p:{...mp.p, profesor:pk}}))}
                      style={{ padding:"7px 12px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600,
                        border:"1.5px solid "+(modalP.p.profesor===pk?COLOR_PROF[pk]:"#E8E0D5"),
                        background:modalP.p.profesor===pk?COLOR_PROF[pk]:"white",
                        color:modalP.p.profesor===pk?"white":"#7A7A7A" }}>{PROF_LABEL[pk]}</button>
                  ))}
                </div>
              </div>
              {/* Cambiar vehículo */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#5A5A5A", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>Cambiar vehículo</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {(modalP.p.permiso==="B"
                    ? Object.keys(VEHICULOS_B)
                    : Object.entries(VEHICULOS).filter(([,v])=>v.permiso===modalP.p.permiso).map(([k])=>k)
                  ).map(vk=>(
                    <button key={vk} onClick={()=>setModalP(mp=>({...mp, p:{...mp.p, vehiculo:vk}}))}
                      style={{ padding:"7px 12px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600,
                        border:"1.5px solid "+(modalP.p.vehiculo===vk?"#C8102E":"#E8E0D5"),
                        background:modalP.p.vehiculo===vk?"#C8102E":"white",
                        color:modalP.p.vehiculo===vk?"white":"#7A7A7A" }}>{VEH_LABEL[vk]}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <button onClick={()=>{
                  setPlanning(p=>{
                    const n={...p};
                    n[modalP.dia]=n[modalP.dia].map(x=>x===modalP.p?{...modalP.p, forzado:true}:x);
                    return n;
                  });
                  setModalP(null);
                }} style={{ padding:12, borderRadius:12, border:"1.5px solid #1A3A6B33", background:"#F0F4FF", color:"#1A3A6B", fontFamily:"inherit", fontSize:14, fontWeight:600, cursor:"pointer" }}>💾 Guardar cambios</button>
                <button onClick={()=>{setPlanning(p=>{const n={...p};n[modalP.dia]=n[modalP.dia].filter(x=>x!==modalP.p);return n;});setModalP(null);}} style={{ padding:12, borderRadius:12, border:"1.5px solid #C8102E33", background:"#FDF5F5", color:"#C8102E", fontFamily:"inherit", fontSize:14, fontWeight:600, cursor:"pointer" }}>🗑 Eliminar práctica</button>
              </div>
            </div>
          </div>
        )}
      </>}
    </div>
  );
}

// ══════════════════════════════════════════════
// MÓDULO 4: WHATSAPP (compacto)
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// MÓDULO RESPUESTAS
// ══════════════════════════════════════════════
function ModuloRespuestas({ alumnos, tokens: tokensProp, setTokens, configId }) {
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [tokensLocales, setTokensLocales] = useState(tokensProp);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    if (!configId) { setCargando(false); return; }
    try {
      const [dispData, toksData] = await Promise.all([
        getDisponibilidades(configId),
        supabase.from("tokens_alumno").select("*, alumnos(nombre,apellidos,telefono)").eq("config_id", configId)
      ]);
      setDisponibilidades(dispData || []);
      if (toksData.data) {
        setTokensLocales(toksData.data);
        if (setTokens) setTokens(toksData.data);
      }
    } catch(e) { console.error(e); }
    finally { setCargando(false); }
  };

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 15000);
    return () => clearInterval(intervalo);
  }, [configId]);

  const alumnosQueRespondieron = new Set(disponibilidades.map(d => d.alumno_id));
  const pendientes = tokensLocales.filter(t => !alumnosQueRespondieron.has(t.alumno_id));
  const respondidos = tokensLocales.filter(t => alumnosQueRespondieron.has(t.alumno_id));
  const DIAS_L = { lunes:"Lun", martes:"Mar", miercoles:"Mié", jueves:"Jue", viernes:"Vie", sabado:"Sáb" };
  const FRANJAS_L = { manana:"Mañana", tarde:"Tarde", noche:"Noche" };

  if (!configId) return (
    <div style={{ textAlign:"center", padding:"40px 20px", color:"#7A7A7A" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>📨</div>
      <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Sin semana activa</div>
      <div style={{ fontSize:13 }}>Activa una semana desde Config para ver las respuestas.</div>
    </div>
  );

  return (
    <div>
      {/* Contador */}
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        <div style={{ flex:1, background:"#E8F5E9", borderRadius:12, padding:"12px", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:700, color:"#2E7D32" }}>{respondidos.length}</div>
          <div style={{ fontSize:11, color:"#4CAF50", fontWeight:600 }}>Han respondido</div>
        </div>
        <div style={{ flex:1, background:"#FFF3E0", borderRadius:12, padding:"12px", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:700, color:"#E65100" }}>{pendientes.length}</div>
          <div style={{ fontSize:11, color:"#FF9800", fontWeight:600 }}>Pendientes</div>
        </div>
        <div style={{ flex:1, background:"#E3F2FD", borderRadius:12, padding:"12px", textAlign:"center" }}>
          <div style={{ fontSize:22, fontWeight:700, color:"#1565C0" }}>{tokensLocales.length}</div>
          <div style={{ fontSize:11, color:"#1976D2", fontWeight:600 }}>Total enviados</div>
        </div>
      </div>

      {/* Pendientes */}
      {pendientes.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#E65100", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>⏳ Pendientes de respuesta</div>
          {pendientes.map(t => {
            const a = alumnos.find(al => al.id === t.alumno_id) || t.alumnos || {};
            return (
              <div key={t.id} style={{ background:"#FFF8F0", borderRadius:10, border:"1.5px solid #FFE0B2", padding:"10px 14px", marginBottom:6, display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"#FF9800", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{(a.nombre||"?")[0]}{(a.apellidos||"?")[0]}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos||"–"}, {a.nombre||"–"}</div>
                  <div style={{ fontSize:11, color:"#9A7A5A" }}>{a.localidad||""} · {a.permiso||""}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Respondidos con detalle */}
      {disponibilidades.length > 0 && (
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"#2E7D32", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:8 }}>✅ Disponibilidades recibidas</div>
          {disponibilidades.map(d => {
            const a = d.alumnos || alumnos.find(al => al.id === d.alumno_id) || {};
            const franjas = d.dias || {};
            const diasConFranjas = Object.entries(franjas).filter(([,fs]) => fs && fs.length > 0);
            return (
              <div key={d.id} style={{ background:"white", borderRadius:12, border:"1.5px solid #C8E6C9", marginBottom:10, overflow:"hidden" }}>
                <div style={{ background:"#F1F8E9", borderBottom:"1px solid #C8E6C9", padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"#2E7D32", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>{(a.nombre||"?")[0]}{(a.apellidos||"?")[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos||"–"}, {a.nombre||"–"}</div>
                    <div style={{ fontSize:11, color:"#5A7A5A" }}>{a.localidad||""} · {a.permiso||""}</div>
                  </div>
                  <div style={{ fontSize:11, color:"#2E7D32", fontWeight:600 }}>
                    {d.created_at ? new Date(d.created_at).toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"}) : ""}
                  </div>
                </div>
                <div style={{ padding:"10px 14px" }}>
                  {d.preferencia_horaria && (
                    <div style={{ fontSize:12, color:"#5A7A5A", marginBottom:8 }}>
                      🕐 Preferencia: <strong>{d.preferencia_horaria}</strong>
                    </div>
                  )}
                  {diasConFranjas.length === 0 ? (
                    <div style={{ fontSize:12, color:"#9A9A9A", fontStyle:"italic" }}>Sin franjas específicas indicadas</div>
                  ) : (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {diasConFranjas.map(([dia, franjasList]) => (
                        (franjasList||[]).map(franja => (
                          <span key={dia+franja} style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>
                            {DIAS_L[dia]||dia} {FRANJAS_L[franja]||franja}
                          </span>
                        ))
                      ))}
                    </div>
                  )}
                  {d.notas && (
                    <div style={{ marginTop:8, fontSize:12, color:"#5A5A5A", background:"#F7F3EE", borderRadius:8, padding:"6px 10px" }}>
                      💬 {d.notas}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tokensLocales.length > 0 && disponibilidades.length === 0 && respondidos.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 20px", color:"#7A7A7A" }}>
          <div style={{ fontSize:32, marginBottom:8 }}>⏳</div>
          <div style={{ fontSize:14 }}>Esperando respuestas... (actualiza cada 30s)</div>
        </div>
      )}

      <button onClick={cargar} disabled={cargando} style={{ width:"100%", marginTop:8, padding:12, borderRadius:10, border:"1.5px solid #1A3A6B", background:cargando?"#F0F4FF":"white", color:"#1A3A6B", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:cargando?"not-allowed":"pointer" }}>
        {cargando ? "⏳ Actualizando..." : "🔄 Actualizar ahora"}
      </button>
    </div>
  );
}

function ModuloWhatsApp({ alumnos, tokens, setTokens, configId }) {
  const [busqueda, setBusqueda] = useState("");
  const [alumnosRespondieron, setAlumnosRespondieron] = useState(new Set());
  const BASE_URL = window.location.origin;

  // Polling cada 15s para actualizar estado ✅/⏳
  useEffect(() => {
    if (!configId) return;
    const actualizar = async () => {
      try {
        const [toksRes, dispRes] = await Promise.all([
          supabase.from("tokens_alumno").select("*, alumnos(nombre, apellidos, telefono)").eq("config_id", configId),
          supabase.from("disponibilidad").select("alumno_id").eq("config_id", configId),
        ]);
        if (toksRes.data) setTokens(toksRes.data);
        if (dispRes.data) setAlumnosRespondieron(new Set(dispRes.data.map(d => d.alumno_id)));
      } catch(e) { console.error(e); }
    };
    actualizar(); // cargar inmediatamente
    const intervalo = setInterval(actualizar, 15000);
    return () => clearInterval(intervalo);
  }, [configId]);

  // helper: ha respondido = tiene disponibilidad guardada
  const haRespondido = (alumnoId) => alumnosRespondieron.has(alumnoId);

  // Formato semana desde tokens si hay config activa
  const semanaLabel = () => {
    // Intentar sacar fechas del primer token
    return "esta semana";
  };

  const genMensaje = (alumno, token) => {
    const enlace = `${BASE_URL}/alumno?token=${token}`;
    return `Hola ${alumno.nombre} 👋\n\nTe enviamos el enlace para indicar tu disponibilidad de prácticas *esta semana*:\n\n🔗 ${enlace}\n\n⏰ Rellénalo antes de la fecha límite indicada en el formulario.\n\n_Autoescuela Herrero · 688 70 86 69_`;
  };

  // Combinar tokens con datos de alumno
  const tokensConDatos = tokens.map(t => ({
    ...t,
    alumno: alumnos.find(a => a.id === t.alumno_id) || t.alumnos,
  })).filter(t => t.alumno);

  const filtrados = tokensConDatos.filter(t => {
    const a = t.alumno;
    if (!a) return false;
    return (a.nombre+" "+a.apellidos).toLowerCase().includes(busqueda.toLowerCase());
  });

  if (tokens.length === 0) return (
    <div style={{ textAlign:"center", padding:"40px 20px", color:"#7A7A7A" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>📲</div>
      <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Sin enlaces generados</div>
      <div style={{ fontSize:13 }}>Activa la semana desde Config y selecciona los alumnos para generar los enlaces.</div>
    </div>
  );

  return (
    <div>
      <div style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", marginBottom:8 }}>
        <span>🔍</span>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar alumno..." style={{ flex:1, border:"none", background:"transparent", fontFamily:"inherit", fontSize:14, outline:"none" }} />
      </div>
      <div style={{ fontSize:12, color:"#7A7A7A", marginBottom:12 }}>
        {tokens.filter(t=>haRespondido(t.alumno_id)).length}/{tokens.length} alumnos han enviado su disponibilidad
      </div>
      {filtrados.map(t => {
        const a = t.alumno;
        const respondido = haRespondido(t.alumno_id);
        const telefono = (a.telefono||"").replace(/\D/g,"");
        const mensaje = genMensaje(a, t.token);
        const waUrl = `https://wa.me/34${telefono}?text=${encodeURIComponent(mensaje)}`;
        return (
          <div key={t.id} style={{ background:"white", borderRadius:12, border:"1.5px solid "+(respondido?"#C8E6C9":"#E8E0D5"), marginBottom:10, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:respondido?"#F1F8E9":"#F7F3EE", borderBottom:"1px solid #F0EBE5" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:respondido?"#2E7D32":"#1A3A6B", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{a.nombre[0]}{a.apellidos[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos}, {a.nombre}</div>
                <div style={{ fontSize:12, color:"#7A7A7A" }}>{a.localidad} · {a.permiso}</div>
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:respondido?"#2E7D32":"#E65100", background:respondido?"#E8F5E9":"#FFF3E0", padding:"3px 8px", borderRadius:20 }}>
                {respondido?"✅ Enviado":"⏳ Pendiente"}
              </span>
            </div>
            {!respondido && (
              <div style={{ padding:"10px 14px" }}>
                <div style={{ background:"#E9F5E1", borderRadius:10, padding:"10px", fontSize:11, lineHeight:1.7, whiteSpace:"pre-wrap", maxHeight:90, overflowY:"auto", color:"#2A2A2A" }}>
                  {mensaje}
                </div>
                <a href={waUrl} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", marginTop:8, padding:"11px", borderRadius:10, background:"#25D366", color:"white", border:"none", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", textAlign:"center", textDecoration:"none" }}>
                  📱 Abrir WhatsApp Web
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ══════════════════════════════════════════════
// MÓDULO 5: INFORMES (PDF visual en navegador)
// ══════════════════════════════════════════════
function InformePlanningProfesor({ profKey, planning, cfg }) {
  const cp = COLOR_PROF[profKey] || "#1A3A6B";
  const todasProf = DIAS_SEMANA.flatMap(d => (planning[d]||[]).filter(p=>p.profesor===profKey).map(p=>({...p,dia:d})));
  if (!todasProf.length) return null;
  const totalMin = todasProf.reduce((a,p)=>a+(p.duracion||0),0);
  return (
    <div style={{ background:"white", borderRadius:14, border:"1.5px solid "+cp+"33", marginBottom:16, overflow:"hidden", pageBreakInside:"avoid" }}>
      <div style={{ background:cp, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ color:"white", fontWeight:800, fontSize:15 }}>👤 {PROF_LABEL[profKey]}</div>
          <div style={{ color:"white", opacity:0.85, fontSize:11, marginTop:2 }}>{semanaLabel(cfg)}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"white", fontWeight:700, fontSize:16 }}>{todasProf.length}</div>
          <div style={{ color:"white", opacity:0.8, fontSize:10 }}>prácticas</div>
          <div style={{ color:"white", fontWeight:600, fontSize:12 }}>{Math.floor(totalMin/60)}h {totalMin%60>0?totalMin%60+"min":""}</div>
        </div>
      </div>
      <div style={{ padding:"10px 14px" }}>
        {DIAS_SEMANA.map(dia => {
          const pracs = (planning[dia]||[]).filter(p=>p.profesor===profKey);
          if (!pracs.length) return null;
          const minDia = pracs.reduce((a,p)=>a+(p.duracion||0),0);
          return (
            <div key={dia} style={{ marginBottom:10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:cp, textTransform:"uppercase", letterSpacing:"0.7px", borderBottom:"1.5px solid "+cp+"22", paddingBottom:4, marginBottom:6, display:"flex", justifyContent:"space-between" }}>
                <span>{DIAS_LABEL[dia]}</span>
                <span style={{ fontWeight:500, opacity:0.7 }}>{Math.floor(minDia/60)}h{minDia%60>0?" "+minDia%60+"min":""}</span>
              </div>
              {pracs.map((p,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"#F7F9FF", borderRadius:8, borderLeft:"3px solid "+cp, marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:13, minWidth:90, color:"#1A1A1A" }}>{p.desde}–{p.hasta}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{p.alumnoNombre}</div>
                    <div style={{ fontSize:11, color:"#777", marginTop:1 }}>
                      <Badge color={COLOR_PERM[p.permiso]}>{p.permiso}</Badge>
                      {" "}{VEH_LABEL[p.vehiculo]||"—"} · {p.tipo==="pista"?"🏁 Pista":"🛣️ Circulación"} · {p.duracion}min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InformePlanningAlumno({ alumno, planning, cfg }) {
  const todasAlumno = DIAS_SEMANA.flatMap(d => (planning[d]||[]).filter(p=>p.alumnoId===alumno.id).map(p=>({...p,dia:d})));
  if (!todasAlumno.length) return null;
  const totalMin = todasAlumno.reduce((a,p)=>a+(p.duracion||0),0);
  const iniciales = (alumno.nombre[0]||"")+(alumno.apellidos[0]||"");
  return (
    <div style={{ background:"white", borderRadius:14, border:"1.5px solid #E8E0D5", marginBottom:16, overflow:"hidden" }}>
      <div style={{ background:"#C8102E", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:42, height:42, borderRadius:"50%", background:"rgba(255,255,255,0.25)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, flexShrink:0 }}>{iniciales}</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"white", fontWeight:800, fontSize:15 }}>{alumno.apellidos}, {alumno.nombre}</div>
          <div style={{ color:"white", opacity:0.85, fontSize:11, marginTop:2 }}>{alumno.localidad} · Permiso {alumno.permiso}{alumno.fase?" · "+alumno.fase:""}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"white", fontWeight:700, fontSize:16 }}>{todasAlumno.length}</div>
          <div style={{ color:"white", opacity:0.8, fontSize:10 }}>prácticas</div>
          <div style={{ color:"white", fontWeight:600, fontSize:12 }}>{Math.floor(totalMin/60)}h {totalMin%60>0?totalMin%60+"min":""}</div>
        </div>
      </div>
      <div style={{ padding:"10px 14px" }}>
        {DIAS_SEMANA.map(dia => {
          const pracs = (planning[dia]||[]).filter(p=>p.alumnoId===alumno.id);
          if (!pracs.length) return null;
          return (
            <div key={dia} style={{ marginBottom:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#1A3A6B", textTransform:"uppercase", letterSpacing:"0.7px", borderBottom:"1.5px solid #E8E0D5", paddingBottom:4, marginBottom:6 }}>{DIAS_LABEL[dia]}</div>
              {pracs.map((p,i) => {
                const cp = COLOR_PROF[p.profesor]||"#555";
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"#F7F3EE", borderRadius:8, borderLeft:"3px solid "+cp, marginBottom:4 }}>
                    <div style={{ fontWeight:700, fontSize:13, minWidth:90, color:"#1A1A1A" }}>{p.desde}–{p.hasta}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:cp }}>{PROF_LABEL[p.profesor]}</div>
                      <div style={{ fontSize:11, color:"#777", marginTop:1 }}>{VEH_LABEL[p.vehiculo]||"—"} · {p.tipo==="pista"?"🏁 Pista":"🛣️ Circulación"} · {p.duracion}min</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid #F0EBE5", fontSize:10, color:"#999", textAlign:"center" }}>
          Autoescuela Herrero · C/ Tenerías 6 bajo · Trujillo · 688 70 86 69
        </div>
      </div>
    </div>
  );
}

function InformeSemanal({ planning, cfg }) {
  const totalPracs = DIAS_SEMANA.reduce((a,d)=>a+(planning[d]||[]).length,0);
  return (
    <div style={{ background:"white", borderRadius:14, border:"1.5px solid #1A3A6B33", marginBottom:16, overflow:"hidden" }}>
      <div style={{ background:"#1A3A6B", padding:"12px 16px" }}>
        <div style={{ color:"white", fontWeight:800, fontSize:15 }}>🗓 Planning Semanal General</div>
        <div style={{ color:"white", opacity:0.85, fontSize:11, marginTop:2 }}>{semanaLabel(cfg)} · {totalPracs} prácticas totales</div>
      </div>
      <div style={{ overflowX:"auto", padding:"10px 8px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, minWidth:480 }}>
          <thead>
            <tr>
              <th style={{ padding:"6px 8px", background:"#F7F9FF", textAlign:"left", fontSize:10, color:"#5A5A5A", fontWeight:700, borderBottom:"1.5px solid #E8E0D5" }}>HORA</th>
              {DIAS_SEMANA.map(d=>(
                <th key={d} style={{ padding:"6px 8px", background:"#F7F9FF", textAlign:"center", fontSize:10, color:"#1A3A6B", fontWeight:700, borderBottom:"1.5px solid #E8E0D5", borderLeft:"1px solid #F0EBE5" }}>
                  {DIAS_LABEL[d].slice(0,3).toUpperCase()}
                  <div style={{ fontWeight:500, color:"#9A9A9A" }}>{(planning[d]||[]).length}p</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROFS.map(pk => {
              const cp = COLOR_PROF[pk];
              const tienePracs = DIAS_SEMANA.some(d=>(planning[d]||[]).some(p=>p.profesor===pk));
              if (!tienePracs) return null;
              return (
                <tr key={pk}>
                  <td style={{ padding:"6px 8px", fontWeight:700, fontSize:11, color:"white", background:cp, whiteSpace:"nowrap" }}>{PROF_LABEL[pk]}</td>
                  {DIAS_SEMANA.map(d => {
                    const pracs = (planning[d]||[]).filter(p=>p.profesor===pk);
                    return (
                      <td key={d} style={{ padding:"4px 6px", verticalAlign:"top", borderLeft:"1px solid #F0EBE5", borderBottom:"1px solid #F7F3EE", minWidth:80 }}>
                        {pracs.map((p,i)=>(
                          <div key={i} style={{ background:cp+"11", borderRadius:5, padding:"3px 5px", marginBottom:2, borderLeft:"2px solid "+cp }}>
                            <div style={{ fontWeight:700, fontSize:10, color:cp }}>{p.desde}</div>
                            <div style={{ fontSize:10, color:"#333", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:80 }}>{p.alumnoNombre.split(",")[0]}</div>
                            <div style={{ fontSize:9, color:"#888" }}>{VEH_LABEL[p.vehiculo]?.split("(")[0]||""}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function botonWA(texto, telefono) {
  if (!telefono) return null;
  const tel = telefono.replace(/\D/g,"");
  const url = "https://wa.me/34"+tel+"?text="+encodeURIComponent(texto);
  return (
    <a href={url} target="_blank" rel="noreferrer"
       style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:20, background:"#25D366", color:"white", textDecoration:"none", fontFamily:"inherit", fontSize:12, fontWeight:700 }}>
      📱 Enviar por WhatsApp
    </a>
  );
}

function imprimirSeccion(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const html = "<!DOCTYPE html><html><head><meta charset='utf-8'><style>"+
    "body{font-family:Arial,sans-serif;padding:20px;color:#1a1a1a;font-size:12px;}"+
    "* {box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}"+
    "@media print{.no-print{display:none}}"+
    "</style></head><body>"+
    "<button class='no-print' onclick='window.print()' style='position:fixed;top:10px;right:10px;padding:8px 16px;background:#1A3A6B;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:700;'>Imprimir PDF</button>"+
    el.innerHTML+"</body></html>";
  const blob = new Blob([html],{type:"text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.target = "_blank"; a.rel = "noreferrer";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),15000);
}

function ModuloInformes({ planning, alumnos, cfg, tokens, configId }) {
  const [vista, setVista] = useState("profesores");
  const [alumnoSel, setAlumnoSel] = useState(null);

  if (!planning) return (
    <div style={{ textAlign:"center", padding:"60px 20px", color:"#7A7A7A" }}>
      <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
      <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Sin planning generado</div>
      <div style={{ fontSize:13 }}>Genera el planning desde la pestaña Planning para ver los informes.</div>
    </div>
  );

  const alumnosConPracs = alumnos.filter(a =>
    DIAS_SEMANA.some(d => (planning[d]||[]).some(p=>p.alumnoId===a.id))
  );

  const msgProfesor = (profKey) => {
    const pracs = DIAS_SEMANA.flatMap(d=>(planning[d]||[]).filter(p=>p.profesor===profKey).map(p=>({...p,dia:d})));
    if (!pracs.length) return "";
    let msg = "Hola "+PROF_LABEL[profKey]+" 👋\n\n*Planning "+semanaLabel(cfg)+"*\n\n";
    for (const dia of DIAS_SEMANA) {
      const dp = pracs.filter(p=>p.dia===dia);
      if (!dp.length) continue;
      msg += "*"+DIAS_LABEL[dia].toUpperCase()+"*\n";
      dp.forEach(p => { msg += "  "+p.desde+"-"+p.hasta+" → "+p.alumnoNombre+" ("+p.permiso+") "+VEH_LABEL[p.vehiculo]+"\n"; });
      msg += "\n";
    }
    msg += "_Autoescuela Herrero_";
    return msg;
  };

  const msgAlumno = (alumno) => {
    const pracs = DIAS_SEMANA.flatMap(d=>(planning[d]||[]).filter(p=>p.alumnoId===alumno.id).map(p=>({...p,dia:d})));
    if (!pracs.length) return "";
    let msg = "Hola "+alumno.nombre+" 👋\n\n*Tus prácticas "+semanaLabel(cfg)+"*\n\n";
    for (const dia of DIAS_SEMANA) {
      const dp = pracs.filter(p=>p.dia===dia);
      if (!dp.length) continue;
      msg += "*"+DIAS_LABEL[dia].toUpperCase()+"*\n";
      dp.forEach(p => { msg += "  "+p.desde+"-"+p.hasta+" · Prof: "+PROF_LABEL[p.profesor]+" · "+VEH_LABEL[p.vehiculo]+"\n"; });
      msg += "\n";
    }
    msg += "_Autoescuela Herrero · 688 70 86 69_";
    return msg;
  };

  const PROFS_CONFIG = { mamen:"605285702", javi:"617190800", pablo:"622593677", toni:"655577578" };

  return (
    <div style={{ paddingBottom:180 }}>
      <div style={{ fontSize:16, fontWeight:800, color:"#1A3A6B", marginBottom:12 }}>📋 Informes · {semanaLabel(cfg)}</div>

      {/* Selector de vista */}
      <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto" }}>
        {[{k:"profesores",l:"👤 Profesores"},{k:"alumnos",l:"🎓 Alumnos"},{k:"semanal",l:"🗓 Semanal"}].map(v=>(
          <button key={v.k} onClick={()=>setVista(v.k)} style={{ flex:"0 0 auto", padding:"8px 14px", borderRadius:20, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700, border:"none", background:vista===v.k?"#1A3A6B":"#F0F4FF", color:vista===v.k?"white":"#1A3A6B" }}>{v.l}</button>
        ))}
      </div>

      {/* VISTA PROFESORES */}
      {vista==="profesores" && PROFS.map(pk => {
        const pracs = DIAS_SEMANA.flatMap(d=>(planning[d]||[]).filter(p=>p.profesor===pk));
        if (!pracs.length) return null;
        return (
          <div key={pk}>
            <div id={"informe-prof-"+pk}>
              <InformePlanningProfesor profKey={pk} planning={planning} cfg={cfg} />
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              <button onClick={()=>imprimirSeccion("informe-prof-"+pk)}
                style={{ flex:"1 1 auto", padding:"9px 14px", borderRadius:20, border:"1.5px solid "+COLOR_PROF[pk], background:"white", color:COLOR_PROF[pk], fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                🖨️ PDF / Imprimir
              </button>
              {botonWA(msgProfesor(pk), PROFS_CONFIG[pk])}
            </div>
          </div>
        );
      })}

      {/* VISTA ALUMNOS */}
      {vista==="alumnos" && alumnosConPracs.map(alumno => (
        <div key={alumno.id}>
          <div id={"informe-alumno-"+alumno.id}>
            <InformePlanningAlumno alumno={alumno} planning={planning} cfg={cfg} />
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
            <button onClick={()=>imprimirSeccion("informe-alumno-"+alumno.id)}
              style={{ flex:"1 1 auto", padding:"9px 14px", borderRadius:20, border:"1.5px solid #C8102E", background:"white", color:"#C8102E", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>
              🖨️ PDF / Imprimir
            </button>
            {botonWA(msgAlumno(alumno), alumno.telefono)}
          </div>
        </div>
      ))}

      {/* VISTA SEMANAL */}
      {vista==="semanal" && (
        <div>
          <div id="informe-semanal">
            <InformeSemanal planning={planning} cfg={cfg} />
          </div>
          <button onClick={()=>imprimirSeccion("informe-semanal")}
            style={{ width:"100%", padding:"11px", borderRadius:20, border:"1.5px solid #1A3A6B", background:"white", color:"#1A3A6B", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:16 }}>
            🖨️ PDF / Imprimir Planning Completo
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// APP SHELL — OFICINA
// ══════════════════════════════════════════════
const NAV = [
  { key:"config",      label:"Config",    icon:"⚙️" },
  { key:"alumnos",     label:"Alumnos",   icon:"👥" },
  { key:"respuestas",  label:"Respuestas",icon:"📬" },
  { key:"planning",    label:"Planning",  icon:"📅" },
  { key:"informes",    label:"Informes",  icon:"📋" },
  { key:"whatsapp",    label:"WhatsApp",  icon:"💬" },
];

export default function AppOficina() {
  const [pantalla, setPantalla] = useState("config");
  const [cfg, setCfg] = useState(configInicial());
  const [configId, setConfigId] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [planning, setPlanning] = useState(null);
  const [sinAsignar, setSinAsignar] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [alumnosData, configData] = await Promise.all([
          getAlumnos({ soloActivos: false }),
          getConfigActiva(),
        ]);
        if (alumnosData) setAlumnos(alumnosData.map(a => ({
          ...a,
          bonoRestantes: a.bono_restantes,
          profesorFijo: a.profesor_fijo,
          cocheAsignado: a.coche_asignado,
          maxPracticas: a.max_practicas_semana,
          fechaAlta: a.fecha_alta,
        })));
        if (configData) {
          const base = configInicial();
          setCfg({
            ...base,
            fechasSemanaDe: configData.fecha_desde || base.fechasSemanaDe,
            fechasSemanaA:  configData.fecha_hasta  || base.fechasSemanaA,
            fechaLimite:    configData.fecha_limite ? configData.fecha_limite.slice(0,10) : base.fechaLimite,
            horaLimite:     configData.fecha_limite ? configData.fecha_limite.slice(11,16) : base.horaLimite,
            notas:          configData.notas         || base.notas,
            diaExamen:      configData.dia_examen    || base.diaExamen,
            alumnosExamen:  configData.alumnos_examen || base.alumnosExamen,
            horasPista:     configData.horas_pista   ? { ...base.horasPista, ...configData.horas_pista } : base.horasPista,
            profesores:     configData.profesores    ? mergeDeep(base.profesores, configData.profesores) : base.profesores,
            vehiculos:      configData.vehiculos     ? mergeDeep(base.vehiculos, configData.vehiculos)   : base.vehiculos,
          });
          setConfigId(configData.id);
          // Cargar tokens existentes para esta semana
          const { data: toks } = await supabase
            .from("tokens_alumno")
            .select("*, alumnos(nombre, apellidos, telefono)")
            .eq("config_id", configData.id);
          if (toks) setTokens(toks);
        }
      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return (
    <div style={{ minHeight:"100vh", background:"#F7F3EE", fontFamily:"system-ui, sans-serif", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:32 }}>⏳</div>
      <div style={{ fontSize:15, fontWeight:600, color:"#1A3A6B" }}>Cargando...</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#F7F3EE", fontFamily:"system-ui, sans-serif", paddingBottom:70 }}>

      {/* HEADER */}
      <div style={{ background:"white", padding:"12px 20px", borderBottom:"3px solid #1A3A6B", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        <img src={LOGO_SRC} alt="Autoescuela Herrero" style={{ height:34, objectFit:"contain" }} />
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:"#9A9A9A", textTransform:"uppercase", letterSpacing:"1px" }}>Panel Oficina</div>
          <div style={{ fontSize:12, fontWeight:700, color:"#1A3A6B" }}>{alumnos.filter(a=>a.activo).length} alumnos activos</div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ padding:"16px 16px 0" }}>
        {pantalla==="config"      && <ModuloConfig   cfg={cfg} setCfg={setCfg} alumnos={alumnos} configId={configId} setConfigId={setConfigId} tokens={tokens} setTokens={setTokens} />}
        {pantalla==="alumnos"     && <ModuloAlumnos  alumnos={alumnos} setAlumnos={setAlumnos} />}
        {pantalla==="respuestas"  && <ModuloRespuestas alumnos={alumnos} tokens={tokens} setTokens={setTokens} configId={configId} />}
        {pantalla==="planning"    && <ModuloPlanning cfg={cfg} alumnos={alumnos} configId={configId} planning={planning} setPlanning={setPlanning} sinAsignar={sinAsignar} setSinAsignar={setSinAsignar} />}
        {pantalla==="informes"    && <ModuloInformes planning={planning} alumnos={alumnos} cfg={cfg} tokens={tokens} configId={configId} />}
        {pantalla==="whatsapp"    && <ModuloWhatsApp alumnos={alumnos} tokens={tokens} setTokens={setTokens} configId={configId} />}
      </div>

      {/* NAV INFERIOR */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"white", borderTop:"1px solid #E8E0D5", display:"flex", boxShadow:"0 -4px 16px rgba(0,0,0,0.08)", zIndex:100 }}>
        {NAV.map(n=>{
          const activo = pantalla===n.key;
          return (
            <button key={n.key} onClick={()=>setPantalla(n.key)} style={{ flex:1, padding:"10px 4px", border:"none", background:"none", cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:activo?"#1A3A6B":"#9A9A9A" }}>{n.label}</span>
              {activo && <div style={{ width:20, height:2, background:"#1A3A6B", borderRadius:2 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
}
