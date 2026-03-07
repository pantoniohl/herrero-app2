import { useState } from "react";

const LOGO_SRC = "data:image/jpeg;base64,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";

// ══════════════════════════════════════════════
// SIMULACIÓN DE DATOS QUE VENDRÍAN DEL BACKEND
// vía el token de la URL (?token=abc123)
// ══════════════════════════════════════════════
const MOCK_TOKEN_VALIDO = "abc123";

const MOCK_DATA = {
  alumno: {
    nombre: "María",
    apellidos: "García López",
    permiso: "B",
    fase: null,
    transporte: false,
    maxPracticasSemana: 6,
  },
  formulario: {
    valido: true,
    yaEnviado: false,
    fechaLimite: "domingo 16 de marzo a las 22:00",
    semanaDesde: "17 mar",
    semanaHasta: "21 mar",
    // Fechas concretas de cada día para mostrar al alumno
    fechasDias: {
      lunes:     "lun 17 mar",
      martes:    "mar 18 mar",
      miercoles: "mié 19 mar",
      jueves:    "jue 20 mar",
      viernes:   "vie 21 mar",
    }
  }
};

// ══════════════════════════════════════════════
// CONSTANTES
// ══════════════════════════════════════════════
const DIAS_SEMANA = ["lunes","martes","miercoles","jueves","viernes"];
const DIAS_LABEL  = { lunes:"Lunes", martes:"Martes", miercoles:"Miércoles", jueves:"Jueves", viernes:"Viernes" };
const DIAS_CORTO  = { lunes:"LUN", martes:"MAR", miercoles:"MIÉ", jueves:"JUE", viernes:"VIE" };
const FRANJAS = [
  { key:"manana",   label:"Mañana",   hora:"09:00–14:00", icon:"🌅" },
  { key:"mediodia", label:"Mediodía", hora:"14:00–17:00", icon:"☀️" },
  { key:"tarde",    label:"Tarde",    hora:"17:00–21:00", icon:"🌆" },
];

// ══════════════════════════════════════════════
// PANTALLA: TOKEN INVÁLIDO / ENLACE CADUCADO
// ══════════════════════════════════════════════
function PantallaEnlaceInvalido() {
  return (
    <div style={{ minHeight:"100vh", background:"#F7F3EE", fontFamily:"system-ui, sans-serif", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"white", padding:"14px 20px", borderBottom:"3px solid #1A3A6B", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        <img src={LOGO_SRC} alt="Autoescuela Herrero" style={{ height:34, objectFit:"contain" }} />
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:20 }}>🔗</div>
        <div style={{ fontSize:20, fontWeight:800, color:"#1C1C1C", marginBottom:10 }}>Enlace no válido</div>
        <div style={{ fontSize:14, color:"#7A7A7A", lineHeight:1.8, maxWidth:300 }}>
          Este enlace ha caducado o no es correcto.<br/><br/>
          Cuando la oficina abra el formulario de la próxima semana recibirás un nuevo enlace por WhatsApp.
        </div>
        <div style={{ marginTop:32, padding:"12px 20px", background:"white", borderRadius:14, border:"1.5px solid #E8E0D5", fontSize:13, color:"#5A5A5A" }}>
          📞 <strong>688 70 86 69</strong>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// PANTALLA: YA ENVIADO
// ══════════════════════════════════════════════
function PantallaYaEnviado({ alumno }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F7F3EE", fontFamily:"system-ui, sans-serif", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"white", padding:"14px 20px", borderBottom:"3px solid #1A3A6B", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        <img src={LOGO_SRC} alt="Autoescuela Herrero" style={{ height:34, objectFit:"contain" }} />
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"#1A6B3A", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, marginBottom:20 }}>✓</div>
        <div style={{ fontSize:20, fontWeight:800, color:"#1C1C1C", marginBottom:10 }}>Ya enviaste tu disponibilidad</div>
        <div style={{ fontSize:14, color:"#7A7A7A", lineHeight:1.8, maxWidth:300 }}>
          {alumno.apellidos}, ya hemos recibido tu disponibilidad para esta semana.<br/><br/>
          Te avisaremos por WhatsApp cuando tengamos tu horario listo.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// PANTALLA: CONFIRMACIÓN TRAS ENVIAR
// ══════════════════════════════════════════════
function PantallaConfirmacion({ alumno, disponibilidad, practicasDeseadas }) {
  const diasSel = DIAS_SEMANA.filter(d => disponibilidad[d].size > 0);
  return (
    <div style={{ minHeight:"100vh", background:"#F7F3EE", fontFamily:"system-ui, sans-serif", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"white", padding:"14px 20px", borderBottom:"3px solid #1A3A6B", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        <img src={LOGO_SRC} alt="Autoescuela Herrero" style={{ height:34, objectFit:"contain" }} />
      </div>
      <div style={{ flex:1, padding:"32px 20px 0", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"#1A6B3A", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, marginBottom:20 }}>✓</div>
        <div style={{ fontSize:21, fontWeight:800, color:"#1C1C1C", marginBottom:6, textAlign:"center" }}>¡Disponibilidad enviada!</div>
        <div style={{ fontSize:14, color:"#7A7A7A", textAlign:"center", marginBottom:28, lineHeight:1.6 }}>
          Te avisamos por WhatsApp en cuanto<br/>tengamos tu horario listo.
        </div>
        <div style={{ background:"white", borderRadius:16, border:"1.5px solid #E8E0D5", padding:"18px 20px", width:"100%", maxWidth:420 }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#9A9A9A", textTransform:"uppercase", letterSpacing:"1px", marginBottom:14 }}>Resumen</div>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:14, borderBottom:"1px solid #F0EBE5" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"#1A3A6B", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700 }}>
              {alumno.nombre[0]}{alumno.apellidos[0]}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700 }}>{alumno.apellidos}</div>
              <div style={{ fontSize:12, color:"#7A7A7A" }}>{alumno.nombre} · Permiso {alumno.permiso}</div>
            </div>
          </div>
          {diasSel.map(dia => (
            <div key={dia} style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#1A3A6B", marginBottom:5 }}>{DIAS_LABEL[dia]}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {FRANJAS.filter(f => disponibilidad[dia].has(f.key)).map(f => (
                  <span key={f.key} style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:10, background:"#1A3A6B18", color:"#1A3A6B" }}>{f.icon} {f.label}</span>
                ))}
              </div>
            </div>
          ))}
          {alumno.permiso === "B" && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid #F0EBE5", fontSize:13, color:"#5A5A5A" }}>
              Prácticas solicitadas: <strong style={{ color:"#1A3A6B" }}>{practicasDeseadas}</strong>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding:"24px 20px 40px", textAlign:"center" }}>
        <div style={{ fontSize:12, color:"#C0C0C0" }}>Autoescuela Herrero · Trujillo · 688 70 86 69</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// FORMULARIO PRINCIPAL
// ══════════════════════════════════════════════
function Formulario({ alumno, fechaLimite, semanaDesde, semanaHasta, fechasDias, onEnviar }) {
  const [disponibilidad, setDisponibilidad] = useState(
    Object.fromEntries(DIAS_SEMANA.map(d => [d, new Set()]))
  );
  // modo por día: "franjas" o "especifico"
  const [modoDia, setModoDia] = useState(
    Object.fromEntries(DIAS_SEMANA.map(d => [d, "franjas"]))
  );
  // rangos específicos por día: [{ desde:"09:00", hasta:"11:30" }, ...]
  const [rangosDia, setRangosDia] = useState(
    Object.fromEntries(DIAS_SEMANA.map(d => [d, []]))
  );
  const [practicasDeseadas, setPracticasDeseadas] = useState(2);

  const limiteDias    = alumno.transporte ? 2 : 5;
  const limiteMaxPrac = alumno.transporte ? 4 : (alumno.maxPracticasSemana || 8);
  const diasSel = DIAS_SEMANA.filter(d =>
    modoDia[d] === "franjas" ? disponibilidad[d].size > 0 : rangosDia[d].length > 0
  );
  const formularioValido = diasSel.length > 0;

  const setModo = (dia, modo) => {
    setModoDia(prev => ({...prev, [dia]: modo}));
    // limpiar el otro modo al cambiar
    if (modo === "franjas") setRangosDia(prev => ({...prev, [dia]: []}));
    else setDisponibilidad(prev => ({...prev, [dia]: new Set()}));
  };

  const addRango = (dia) => setRangosDia(prev => ({...prev, [dia]: [...prev[dia], {desde:"09:00", hasta:"14:00"}]}));
  const delRango = (dia, i) => setRangosDia(prev => ({...prev, [dia]: prev[dia].filter((_,j)=>j!==i)}));
  const setRango = (dia, i, field, val) => setRangosDia(prev => ({...prev, [dia]: prev[dia].map((r,j)=>j===i?{...r,[field]:val}:r)}));

  // ¿el alumno tiene poca disponibilidad? → aviso
  const totalFranjas = diasSel.reduce((acc, d) => {
    if (modoDia[d]==="franjas") return acc + disponibilidad[d].size;
    return acc + rangosDia[d].length;
  }, 0);
  const pocaDisponibilidad = diasSel.length > 0 && totalFranjas <= 2;

  const toggleFranja = (dia, franja) => {
    setDisponibilidad(prev => {
      const set = new Set(prev[dia]);
      set.has(franja) ? set.delete(franja) : set.add(franja);
      return { ...prev, [dia]: set };
    });
  };

  const toggleDia = (dia) => {
    setDisponibilidad(prev => {
      const nuevo = prev[dia].size === FRANJAS.length ? new Set() : new Set(FRANJAS.map(f => f.key));
      return { ...prev, [dia]: nuevo };
    });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F7F3EE", fontFamily:"system-ui, sans-serif", paddingBottom:90 }}>

      {/* HEADER */}
      <div style={{ background:"white", padding:"14px 20px 12px", borderBottom:"3px solid #1A3A6B", boxShadow:"0 2px 12px rgba(0,0,0,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <img src={LOGO_SRC} alt="Autoescuela Herrero" style={{ height:30, objectFit:"contain" }} />
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:"#9A9A9A", textTransform:"uppercase", letterSpacing:"0.8px" }}>Semana</div>
            <div style={{ fontSize:13, fontWeight:800, color:"#1A3A6B" }}>{semanaDesde} – {semanaHasta}</div>
          </div>
        </div>
        <div style={{ fontSize:15, fontWeight:700, color:"#1C1C1C", marginTop:8 }}>Disponibilidad semanal</div>
      </div>

      <div style={{ padding:"14px 16px 0" }}>

        {/* FICHA ALUMNO */}
        <div style={{ background:"white", borderRadius:14, border:"1.5px solid #E8E0D5", padding:"14px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:"50%", background:"#1A3A6B", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, flexShrink:0 }}>
            {alumno.nombre[0]}{alumno.apellidos[0]}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:700 }}>{alumno.apellidos}</div>
            <div style={{ fontSize:13, color:"#7A7A7A" }}>{alumno.nombre}</div>
            <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:10, background:"#1A3A6B22", color:"#1A3A6B" }}>Permiso {alumno.permiso}</span>
              {alumno.permiso !== "B" && alumno.fase && (
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:10, background:alumno.fase==="pista"?"#D4700A22":"#1A3A6B22", color:alumno.fase==="pista"?"#D4700A":"#1A3A6B" }}>
                  {alumno.fase==="pista"?"🏁 Pista":"🛣️ Circulación"}
                </span>
              )}
              {alumno.transporte && <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:10, background:"#D4700A22", color:"#D4700A" }}>🚐 Transporte</span>}
            </div>
          </div>
        </div>

        {/* AVISO LÍMITE */}
        <div style={{ background:"#FEF3E2", border:"1.5px solid #F5C47A", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>⏰</span>
          <div style={{ fontSize:13, color:"#8A5A00", lineHeight:1.5 }}>
            Rellena antes del <strong>{fechaLimite}</strong>
          </div>
        </div>

        {/* DISPONIBILIDAD TOTAL */}
        {(() => {
          const todoMarcado = DIAS_SEMANA.every(d => modoDia[d]==="franjas" && disponibilidad[d].size===FRANJAS.length);
          const marcarTodo = () => {
            setDisponibilidad(Object.fromEntries(DIAS_SEMANA.map(d => [d, new Set(FRANJAS.map(f=>f.key))])));
            setModoDia(Object.fromEntries(DIAS_SEMANA.map(d => [d, "franjas"])));
            setRangosDia(Object.fromEntries(DIAS_SEMANA.map(d => [d, []])));
          };
          const desmarcarTodo = () => {
            setDisponibilidad(Object.fromEntries(DIAS_SEMANA.map(d => [d, new Set()])));
          };
          return (
            <button onClick={todoMarcado ? desmarcarTodo : marcarTodo} style={{
              width:"100%", padding:"13px 16px", borderRadius:12, cursor:"pointer",
              fontFamily:"inherit", fontSize:14, fontWeight:700,
              border:"1.5px solid "+(todoMarcado?"#1A6B3A":"#1A6B3A44"),
              background:todoMarcado?"#1A6B3A":"#EEF7F1",
              color:todoMarcado?"white":"#1A6B3A",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              marginBottom:14,
              boxShadow:todoMarcado?"0 4px 14px rgba(26,107,58,0.25)":"none",
            }}>
              <span style={{ fontSize:18 }}>{todoMarcado ? "✓" : "🗓"}</span>
              {todoMarcado ? "Disponible cualquier día · Desmarca" : "Disponible cualquier día a cualquier hora"}
            </button>
          );
        })()}

        {/* AVISO POCA DISPONIBILIDAD */}
        <div style={{ background:"#FEF3E2", border:"1.5px solid #F5C47A", borderRadius:12, padding:"10px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>⚠️</span>
          <div style={{ fontSize:12, color:"#8A5A00", lineHeight:1.6 }}>
            Cuanta menos disponibilidad indiques, más difícil será asignarte prácticas. Si puedes, añade más días o franjas horarias.
          </div>
        </div>

        {/* RESTRICCIÓN TRANSPORTE */}
        {alumno.transporte && (
          <div style={{ background:"#EEF3FB", border:"1.5px solid #1A3A6B33", borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#1A3A6B", lineHeight:1.6 }}>
            ℹ️ Con transporte de la autoescuela puedes seleccionar un máximo de <strong>{limiteDias} días</strong>.
          </div>
        )}

        <div style={{ fontSize:14, fontWeight:700, color:"#1C1C1C", marginBottom:12 }}>¿Qué días puedes esta semana?</div>

        {/* BOTÓN REPLICAR HACIA ADELANTE */}
        {(() => {
          // Buscar el último día activo
          const ultimoDiaActivo = [...DIAS_SEMANA].reverse().find(d =>
            modoDia[d]==="franjas" ? disponibilidad[d].size > 0 : rangosDia[d].length > 0
          );
          if (!ultimoDiaActivo) return null;
          const idxUltimo = DIAS_SEMANA.indexOf(ultimoDiaActivo);
          const diasSiguientes = DIAS_SEMANA.slice(idxUltimo + 1).filter(d =>
            modoDia[d]==="franjas" ? disponibilidad[d].size === 0 : rangosDia[d].length === 0
          );
          if (diasSiguientes.length === 0) return null;

          const replicar = () => {
            const modo = modoDia[ultimoDiaActivo];
            if (modo === "franjas") {
              const copia = new Set(disponibilidad[ultimoDiaActivo]);
              setDisponibilidad(prev => ({
                ...prev,
                ...Object.fromEntries(diasSiguientes.map(d => [d, new Set(copia)]))
              }));
              setModoDia(prev => ({
                ...prev,
                ...Object.fromEntries(diasSiguientes.map(d => [d, "franjas"]))
              }));
            } else {
              const copiaRangos = rangosDia[ultimoDiaActivo].map(r => ({...r}));
              setRangosDia(prev => ({
                ...prev,
                ...Object.fromEntries(diasSiguientes.map(d => [d, copiaRangos]))
              }));
              setModoDia(prev => ({
                ...prev,
                ...Object.fromEntries(diasSiguientes.map(d => [d, "especifico"]))
              }));
            }
          };

          const labelDias = diasSiguientes.map(d => DIAS_LABEL[d]).join(", ");
          return (
            <button onClick={replicar} style={{
              width:"100%", padding:"12px 16px", borderRadius:12, cursor:"pointer",
              fontFamily:"inherit", fontSize:13, fontWeight:700,
              border:"1.5px dashed #1A3A6B88",
              background:"#EEF3FB", color:"#1A3A6B",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              marginBottom:10,
            }}>
              <span style={{ fontSize:16 }}>📋</span>
              Aplicar al resto: {labelDias}
            </button>
          );
        })()}


        {/* DÍAS */}
        {DIAS_SEMANA.map(dia => {
          const franjasSelec = disponibilidad[dia];
          const rangos       = rangosDia[dia];
          const modo         = modoDia[dia];
          const activo       = modo==="franjas" ? franjasSelec.size > 0 : rangos.length > 0;
          const bloqueado    = !activo && diasSel.length >= limiteDias;
          const todoDia      = franjasSelec.size === FRANJAS.length;

          return (
            <div key={dia} style={{ background:"white", borderRadius:14, marginBottom:10, border:"1.5px solid "+(activo?"#1A3A6B":"#E8E0D5"), overflow:"hidden", opacity:bloqueado?0.4:1 }}>

              {/* Cabecera día */}
              <div onClick={()=>!bloqueado&&toggleDia(dia)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", cursor:bloqueado?"not-allowed":"pointer", background:activo?"#1A3A6B08":"white" }}>
                <div style={{ width:48, height:48, borderRadius:10, flexShrink:0, background:activo?"#1A3A6B":"#F0EBE5", color:activo?"white":"#9A9A9A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", lineHeight:1.3 }}>
                  <div style={{ fontSize:10, fontWeight:700 }}>{DIAS_CORTO[dia]}</div>
                  <div style={{ fontSize:9, opacity:0.75, fontWeight:400 }}>{(fechasDias||{})[dia]?.split(" ").slice(1).join(" ")||""}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:activo?"#1A3A6B":"#1C1C1C" }}>{DIAS_LABEL[dia]}</div>
                  <div style={{ fontSize:11, color:"#9A9A9A", marginTop:1 }}>
                    {activo
                      ? modo==="franjas"
                        ? (todoDia?"Todo el día":franjasSelec.size+" franja"+(franjasSelec.size!==1?"s":""))
                        : rangos.length+" rango"+(rangos.length!==1?"s":"")+" específico"+(rangos.length!==1?"s":"")
                      : bloqueado?"Límite de días alcanzado":"Toca para seleccionar"}
                  </div>
                </div>
                <div style={{ width:26, height:26, borderRadius:"50%", background:activo?"#1A3A6B":"#F0EBE5", color:activo?"white":"#C0C0C0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, flexShrink:0 }}>
                  {activo?"−":"+"}
                </div>
              </div>

              {/* Contenido si el día está activo */}
              {activo && (
                <div style={{ padding:"0 12px 12px" }}>

                  {/* Selector de modo */}
                  <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                    {[{k:"franjas",l:"🕐 Por franjas"},{k:"especifico",l:"⏱ Personalizado"}].map(m=>(
                      <button key={m.k} onClick={()=>setModo(dia,m.k)} style={{ flex:1, padding:"7px 6px", borderRadius:9, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:700, border:"1.5px solid "+(modo===m.k?"#1A3A6B":"#E8E0D5"), background:modo===m.k?"#1A3A6B":"white", color:modo===m.k?"white":"#9A9A9A" }}>{m.l}</button>
                    ))}
                  </div>

                  {/* MODO FRANJAS */}
                  {modo==="franjas" && (
                    <div style={{ display:"flex", gap:6 }}>
                      {FRANJAS.map(f => {
                        const sel = franjasSelec.has(f.key);
                        return (
                          <button key={f.key} onClick={()=>toggleFranja(dia,f.key)} style={{ flex:1, padding:"10px 4px", borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, textAlign:"center", border:"1.5px solid "+(sel?"#1A3A6B":"#E8E0D5"), background:sel?"#1A3A6B":"#F7F3EE", color:sel?"white":"#7A7A7A", lineHeight:1.5 }}>
                            <div style={{ fontSize:18, marginBottom:2 }}>{f.icon}</div>
                            <div>{f.label}</div>
                            <div style={{ fontSize:10, opacity:0.7, marginTop:1 }}>{f.hora}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* MODO HORARIO ESPECÍFICO */}
                  {modo==="especifico" && (
                    <div>
                      {rangos.map((r,i)=>(
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                          <input type="time" value={r.desde} onChange={e=>setRango(dia,i,"desde",e.target.value)} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:9, padding:"9px 10px", fontFamily:"inherit", fontSize:14, fontWeight:700, outline:"none", background:"#F7F3EE", color:"#1A3A6B" }} />
                          <span style={{ fontSize:13, color:"#9A9A9A", fontWeight:600 }}>–</span>
                          <input type="time" value={r.hasta} onChange={e=>setRango(dia,i,"hasta",e.target.value)} style={{ flex:1, border:"1.5px solid #E8E0D5", borderRadius:9, padding:"9px 10px", fontFamily:"inherit", fontSize:14, fontWeight:700, outline:"none", background:"#F7F3EE", color:"#1A3A6B" }} />
                          <button onClick={()=>delRango(dia,i)} style={{ width:30, height:30, borderRadius:"50%", border:"1px solid #F5C4C4", background:"#FDF5F5", color:"#C8102E", cursor:"pointer", fontSize:16, flexShrink:0 }}>×</button>
                        </div>
                      ))}
                      <button onClick={()=>addRango(dia)} style={{ width:"100%", padding:"8px", borderRadius:9, border:"1.5px dashed #1A3A6B55", background:"#EEF3FB", color:"#1A3A6B", fontFamily:"inherit", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Añadir rango horario</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* CANTIDAD DE PRÁCTICAS — solo B, solo si hay días seleccionados */}
        {alumno.permiso === "B" && diasSel.length > 0 && (
          <div style={{ background:"white", borderRadius:14, border:"1.5px solid #E8E0D5", padding:"16px", marginTop:4, marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#1C1C1C", marginBottom:14 }}>¿Cuántas prácticas quieres esta semana?</div>
            <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
              {Array.from({ length: Math.min(limiteMaxPrac, 8) }, (_,i) => i+1).map(n => (
                <button key={n} onClick={()=>setPracticasDeseadas(n)} style={{ width:46, height:46, borderRadius:10, cursor:"pointer", fontFamily:"inherit", fontSize:17, fontWeight:700, border:"1.5px solid "+(practicasDeseadas===n?"#1A3A6B":"#E8E0D5"), background:practicasDeseadas===n?"#1A3A6B":"white", color:practicasDeseadas===n?"white":"#7A7A7A" }}>{n}</button>
              ))}
            </div>
            <div style={{ fontSize:11, color:"#9A9A9A", textAlign:"center", marginTop:10, lineHeight:1.5 }}>El sistema intentará asignarte las que pueda según la disponibilidad de la autoescuela</div>
          </div>
        )}

        {/* RESUMEN PREVIO */}
        {formularioValido && (
          <div style={{ background:"#EEF3FB", border:"1.5px solid #1A3A6B33", borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#1A3A6B", marginBottom:10 }}>📋 Tu selección</div>
            {diasSel.map(dia=>(
              <div key={dia} style={{ display:"flex", alignItems:"flex-start", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#1A3A6B", minWidth:76, paddingTop:1 }}>{DIAS_LABEL[dia]}</span>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {FRANJAS.filter(f=>disponibilidad[dia].has(f.key)).map(f=>(
                    <span key={f.key} style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:"#1A3A6B22", color:"#1A3A6B", fontWeight:600 }}>{f.icon} {f.label}</span>
                  ))}
                </div>
              </div>
            ))}
            {alumno.permiso==="B" && (
              <div style={{ fontSize:12, color:"#5A5A5A", marginTop:6, paddingTop:8, borderTop:"1px solid #D8E8FB" }}>
                Prácticas solicitadas: <strong style={{ color:"#1A3A6B" }}>{practicasDeseadas}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOTÓN ENVIAR FIJO */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"white", borderTop:"1px solid #E8E0D5", boxShadow:"0 -4px 16px rgba(0,0,0,0.08)", padding:"10px 16px 20px" }}>
        <div style={{ fontSize:11, color:"#9A9A9A", lineHeight:1.6, textAlign:"center", marginBottom:10, padding:"0 4px" }}>
          Una vez enviada tu disponibilidad, la autoescuela te asignará las prácticas para la semana que viene, quedando confirmadas según la petición que envías. <strong style={{ color:"#C8102E" }}>Asegúrate de que esta disponibilidad es correcta. Una vez confirmadas las prácticas por la escuela no hay posibilidad de cambio.</strong>
        </div>
        <button disabled={!formularioValido} onClick={()=>onEnviar(disponibilidad, practicasDeseadas)} style={{ width:"100%", padding:16, background:formularioValido?"#C8102E":"#C0C0C0", color:"white", border:"none", borderRadius:14, fontFamily:"inherit", fontSize:16, fontWeight:700, cursor:formularioValido?"pointer":"not-allowed", boxShadow:formularioValido?"0 6px 20px rgba(200,16,46,0.3)":"none" }}>
          {formularioValido ? "Enviar disponibilidad" : "Selecciona al menos un día"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// APP RAÍZ — resuelve el token y decide pantalla
// ══════════════════════════════════════════════
export default function AppAlumno() {
  // En producción: leer el token de window.location.search
  // const params = new URLSearchParams(window.location.search);
  // const token  = params.get("token");
  const token = MOCK_TOKEN_VALIDO; // simulado para el prototipo

  const [enviado, setEnviado] = useState(false);
  const [dispGuardada, setDispGuardada] = useState(null);
  const [pracGuardadas, setPracGuardadas] = useState(null);

  // Token inválido o ausente
  if (!token || token !== MOCK_TOKEN_VALIDO) return <PantallaEnlaceInvalido />;

  const { alumno, formulario } = MOCK_DATA;

  // Formulario caducado o token ya usado
  if (!formulario.valido) return <PantallaEnlaceInvalido />;

  // Ya enviado anteriormente
  if (formulario.yaEnviado) return <PantallaYaEnviado alumno={alumno} />;

  // Enviado en esta sesión
  if (enviado) return <PantallaConfirmacion alumno={alumno} disponibilidad={dispGuardada} practicasDeseadas={pracGuardadas} />;

  const handleEnviar = (disp, pracs) => {
    setDispGuardada(disp);
    setPracGuardadas(pracs);
    setEnviado(true);
    // En producción: POST al backend con token + disponibilidad
  };

  return <Formulario alumno={alumno} fechaLimite={formulario.fechaLimite} semanaDesde={formulario.semanaDesde} semanaHasta={formulario.semanaHasta} fechasDias={formulario.fechasDias} onEnviar={handleEnviar} />;
}
