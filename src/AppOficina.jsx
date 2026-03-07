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
      const maxHoy = alumno.permiso === "B"
        ? (alumno.transporte === "autoescuela" ? 2 : 3)
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
          const profConfig = configSemanal.profesores?.[pk]?.dias?.[dia];
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
          const profConfigDia = configSemanal.profesores[profKey].dias[dia];
          const capProf = configSemanal.profesores[profKey].capBloqueo || profConfigDia.capBloqueo;

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
            const vehCompatibles = Object.entries(VEHICULOS).filter(([, v]) => {
              if (v.permiso !== alumno.permiso) return false;
              if (esPista && v.modalidad === "circ") return false;
              if (!esPista && v.modalidad === "pista") return false;
              return true;
            }).map(([k]) => k);

            let asignadoConVeh = false;
            for (const vehKey of vehCompatibles) {
              const vehConfigDia = configSemanal.vehiculos?.[vehKey]?.dias?.[dia];
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
            // Módulo B: no necesita vehículo específico
            const hueco = elegirHueco(
              tramosComunes, duracion,
              ocupacionesProf,
              capProf
            );
            if (hueco) {
              const entrada = {
                alumnoId: alumno.id,
                alumnoNombre: alumno.apellidos + ", " + alumno.nombre,
                profesor: profKey,
                vehiculo: null,
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
              asignadas++;
              asignadasHoy++;
              asignado = true;
              break;
            }
          }
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
function ModuloConfig({ cfg, setCfg, alumnos }) {
  const [seccion, setSeccion] = useState("general");
  const [guardandoParcial, setGuardandoParcial] = useState(false);

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
                await guardarConfigBorrador(cfg);
                setTimeout(()=>setGuardandoParcial(false),1500);
              } catch(e) { console.error(e); setGuardandoParcial(false); }
            }} style={{ flex:1, padding:12, borderRadius:10, border:"1.5px solid #1A3A6B", background:"white", color:"#1A3A6B", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>{guardandoParcial?"✅ Guardado":"💾 Guardar borrador"}</button>
            <button onClick={async()=>{
              try {
                const saved = await guardarConfigBorrador(cfg);
                await activarSemanaDB(saved.id);
                alert("¡Semana activada! Los alumnos ya pueden enviar su disponibilidad.");
              } catch(e) { console.error(e); alert("Error al activar: "+e.message); }
            }} style={{ flex:2, padding:12, borderRadius:10, border:"none", background:"#C8102E", color:"white", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(200,16,46,0.25)" }}>⚡ Activar semana</button>
          </div>
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
            const d = cfg.profesores[profActivo][dia];
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
            const d = cfg.vehiculos[vehActivo][dia];
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

  const guardar = async (alumno) => {
    try {
      let saved;
      if (alumno.id && typeof alumno.id === "string" && alumno.id.includes("-")) {
        // UUID real de Supabase — actualizar
        saved = await actualizarAlumno(alumno.id, alumno);
        setAlumnos(prev => prev.map(a => a.id===saved.id ? saved : a));
      } else {
        // Nuevo alumno
        const { id, ...sinId } = alumno;
        saved = await crearAlumno(sinId);
        setAlumnos(prev => [...prev, saved]);
      }
      setModal(null); setAlumnoEditar(null);
    } catch(e) {
      console.error("Error guardando alumno:", e);
      alert("Error al guardar: " + e.message);
    }
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
          <div key={a.id} onClick={()=>{setAlumnoEditar(a);setModal("editar");}} style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", padding:"12px 14px", marginBottom:8, cursor:"pointer", opacity:a.activo?1:0.55 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:a.activo?"#1A3A6B":"#C0C0C0", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{a.nombre[0]}{a.apellidos[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos}, {a.nombre}</div>
                <div style={{ fontSize:12, color:"#7A7A7A" }}>{a.localidad}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                <Badge color={COLOR_PERM[a.permiso]}>{a.permiso}</Badge>
                {!a.activo && <Badge color="#9A9A9A">Archivado</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* FAB */}
      <button onClick={()=>{setAlumnoEditar(null);setModal("nuevo");}} style={{ position:"fixed", bottom:80, right:16, width:56, height:56, borderRadius:"50%", background:"#C8102E", border:"none", color:"white", fontSize:26, cursor:"pointer", boxShadow:"0 6px 20px rgba(200,16,46,0.35)", zIndex:200 }}>+</button>
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
  const [form, setForm] = useState(alumno || { nombre:"", apellidos:"", telefono:"", localidad:"Trujillo", permiso:"B", fase:null, activo:true, bono:false, bonoRestantes:"", fechaAlta:new Date().toISOString().slice(0,10) });
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
      <button disabled={!valido} onClick={()=>onGuardar({...form,id:form.id||Date.now()})} style={{ width:"100%", padding:14, marginTop:8, background:valido?"#C8102E":"#C0C0C0", color:"white", border:"none", borderRadius:12, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:valido?"pointer":"not-allowed" }}>
        {esNuevo?"Dar de alta":"Guardar cambios"}
      </button>
    </div>
  );
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

function ModuloPlanning({ cfg, alumnos }) {
  const [planning, setPlanning] = useState(null);
  const [sinAsignar, setSinAsignar] = useState([]);
  const [diaActivo, setDiaActivo] = useState("lunes");
  const [vista, setVista] = useState("dia");
  const [modalP, setModalP] = useState(null);

  const ejecutar = () => {
    const alumnosConDisp = alumnos.filter(a=>a.activo).map(a=>({
      ...a,
      disponibilidad: Object.fromEntries(DIAS_SEMANA.map(d=>[d,{estado:"todo"}]))
    }));
    const res = generarPlanning(cfg, alumnosConDisp, DIAS_SEMANA);
    setPlanning(res.planning);
    setSinAsignar(res.sinAsignar);
  };

  const totalAsignadas = planning ? Object.values(planning).flat().length : 0;

  return (
    <div>
      <button onClick={ejecutar} style={{ width:"100%", padding:14, background:"#1A3A6B", color:"white", border:"none", borderRadius:12, fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(26,58,107,0.3)", marginBottom:12 }}>⚡ Generar planning</button>

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

        <div style={{ display:"flex", gap:6, marginBottom:10, overflowX:"auto" }}>
          {[{k:"dia",l:"📅 Por día"},{k:"profesor",l:"👤 Profesor"},{k:"semanal",l:"🗓 Semanal"}].map(v=>(
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

        {modalP && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
            <div style={{ background:"white", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"24px 20px 40px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontSize:17, fontWeight:700 }}>Detalle práctica</div>
                <button onClick={()=>setModalP(null)} style={{ width:32, height:32, borderRadius:"50%", border:"1.5px solid #E8E0D5", background:"white", cursor:"pointer", fontSize:16 }}>✕</button>
              </div>
              <div style={{ background:COLOR_PROF[modalP.p.profesor]+"11", border:"1px solid "+COLOR_PROF[modalP.p.profesor]+"33", borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
                <div style={{ fontSize:17, fontWeight:800 }}>{modalP.p.alumnoNombre}</div>
                <div style={{ fontSize:14, color:COLOR_PROF[modalP.p.profesor], fontWeight:700, marginTop:4 }}>{DIAS_LABEL[modalP.dia]} · {modalP.p.desde}–{modalP.p.hasta}</div>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  <Badge color={COLOR_PERM[modalP.p.permiso]}>{modalP.p.permiso}</Badge>
                  {modalP.p.tipo==="pista"&&<Badge color="#D4700A">🏁 Pista</Badge>}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
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
function ModuloWhatsApp({ alumnos }) {
  const [busqueda, setBusqueda] = useState("");
  const SEMANA_WA = "17–21 marzo 2025";

  const genTexto = (a) => {
    const lineas = ["🚗 *AUTOESCUELA HERRERO*", "📋 Semana "+SEMANA_WA, "👤 "+a.apellidos+", "+a.nombre, ""];
    lineas.push("_Disponibilidad pendiente de confirmar_");
    lineas.push(""); lineas.push("_Autoescuela Herrero · 688 70 86 69_");
    return lineas.join("\n");
  };

  const filtrados = alumnos.filter(a=>a.activo&&(a.nombre+" "+a.apellidos).toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div>
      <div style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", marginBottom:12 }}>
        <span>🔍</span>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar alumno..." style={{ flex:1, border:"none", background:"transparent", fontFamily:"inherit", fontSize:14, outline:"none" }} />
      </div>
      {filtrados.map(a=>{
        const [copiado, setCopiado] = useState(false);
        const texto = genTexto(a);
        return (
          <div key={a.id} style={{ background:"white", borderRadius:12, border:"1.5px solid #E8E0D5", marginBottom:10, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#F7F3EE", borderBottom:"1px solid #F0EBE5" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:"#1A3A6B", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{a.nombre[0]}{a.apellidos[0]}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700 }}>{a.apellidos}, {a.nombre}</div><div style={{ fontSize:12, color:"#7A7A7A" }}>{a.localidad} · {a.permiso}</div></div>
            </div>
            <div style={{ padding:"10px 14px" }}>
              <div style={{ background:"#E9F5E1", borderRadius:10, padding:"10px", fontSize:11, lineHeight:1.7, whiteSpace:"pre-wrap", fontFamily:"monospace", maxHeight:100, overflowY:"auto" }}>
                {texto.replace(/\\n/g,"\n").split("\n").map((l,i)=><div key={i}>{l||" "}</div>)}
              </div>
              <button onClick={()=>{navigator.clipboard.writeText(texto.replace(/\\n/g,"\n"));setCopiado(true);setTimeout(()=>setCopiado(false),2000);}} style={{ width:"100%", marginTop:8, padding:"10px", borderRadius:10, background:copiado?"#1A6B3A":"#25D366", color:"white", border:"none", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                {copiado?"✅ Copiado":"📋 Copiar para WhatsApp"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════
// APP SHELL — OFICINA
// ══════════════════════════════════════════════
const NAV = [
  { key:"config",   label:"Config",   icon:"⚙️" },
  { key:"alumnos",  label:"Alumnos",  icon:"👥" },
  { key:"planning", label:"Planning", icon:"📅" },
  { key:"whatsapp", label:"WhatsApp", icon:"💬" },
];

export default function AppOficina() {
  const [pantalla, setPantalla] = useState("config");
  const [cfg, setCfg] = useState(configInicial());
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar alumnos y config activa desde Supabase al arrancar
  useEffect(() => {
    const cargar = async () => {
      try {
        const [alumnosData, configData] = await Promise.all([
          getAlumnos({ soloActivos: false }),
          getConfigActiva(),
        ]);
        if (alumnosData) setAlumnos(alumnosData);
        if (configData) setCfg(configData);
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
        {pantalla==="config"   && <ModuloConfig   cfg={cfg} setCfg={setCfg} alumnos={alumnos} />}
        {pantalla==="alumnos"  && <ModuloAlumnos  alumnos={alumnos} setAlumnos={setAlumnos} />}
        {pantalla==="planning" && <ModuloPlanning cfg={cfg} alumnos={alumnos} />}
        {pantalla==="whatsapp" && <ModuloWhatsApp alumnos={alumnos} />}
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
