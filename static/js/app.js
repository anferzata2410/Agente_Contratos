// ── Estado de la aplicacion ──
let contadorDeudores = 0;
let contadorAcreedores = 0;
let contadorCodeudores = 0;

// ── Inicializacion: formulario listo para llenado manual ──
document.addEventListener("DOMContentLoaded", () => {
  iniciarFormularioVacio();
});

function iniciarFormularioVacio() {
  // Reset completo del formulario
  document.getElementById("checklist-form").reset();

  // Limpiar contenedores dinamicos
  document.getElementById("deudores-container").innerHTML = "";
  contadorDeudores = 0;

  document.getElementById("acreedores-container").innerHTML = "";
  contadorAcreedores = 0;

  document.getElementById("codeudores-container").innerHTML = "";
  contadorCodeudores = 0;

  // Limpiar campos fijos (readonly y demas)
  const camposFijos = ["tipo_contrato", "prestamo_monto", "prestamo_comision",
    "prestamo_plazo", "prestamo_tasa", "prestamo_cuota", "prestamo_forma_pago",
    "prestamo_observaciones", "inmueble_matricula", "inmueble_cedula_catastral",
    "inmueble_chip", "inmueble_direccion", "inmueble_descripcion", "inmueble_linderos"];
  camposFijos.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// ══════════════════════════════════════════════
// CARGAR CHECK LIST DESDE .DOCX
// ══════════════════════════════════════════════

function cargarCheckList() {
  document.getElementById("archivo-checklist").click();
}

async function cargarArchivoSeleccionado() {
  const input = document.getElementById("archivo-checklist");
  const file = input.files[0];
  if (!file) return;

  mostrarLoading("Leyendo Check List...");

  try {
    const formData = new FormData();
    formData.append("archivo", file);

    const resp = await fetch("/api/cargar-checklist", {
      method: "POST",
      body: formData,
    });

    const resultado = await resp.json();

    if (resultado.ok) {
      rellenarFormulario(resultado.datos);
      mostrarToast("Check List cargado exitosamente", "success");
    } else {
      mostrarToast(`Error: ${resultado.error}`, "error");
    }
  } catch (err) {
    mostrarToast(`Error de conexion: ${err.message}`, "error");
  } finally {
    ocultarLoading();
    input.value = "";
  }
}

// ══════════════════════════════════════════════
// RELLENAR FORMULARIO CON DATOS DEL CHECKLIST
// ══════════════════════════════════════════════

function rellenarFormulario(datos) {
  setVal("tipo_contrato", datos.tipo_contrato || "");

  // ── Deudores ──
  const deudoresData = datos.deudores || (datos.deudor ? [datos.deudor] : []);
  const deudContainer = document.getElementById("deudores-container");
  deudContainer.innerHTML = "";
  contadorDeudores = 0;

  if (deudoresData.length > 0) {
    deudoresData.forEach((d) => {
      contadorDeudores++;
      const idx = contadorDeudores;
      deudContainer.insertAdjacentHTML("beforeend", crearCardDeudor(idx));
      setVal(`deudor_${idx}_nombre`, d.nombre || "");
      setVal(`deudor_${idx}_cc`, d.cc || "");
      setVal(`deudor_${idx}_cc_expedicion`, d.cc_expedicion || "");
      setVal(`deudor_${idx}_direccion`, d.direccion || "");
      setVal(`deudor_${idx}_email`, d.email || "");
      setVal(`deudor_${idx}_telefono`, d.telefono || "");
      setVal(`deudor_${idx}_estado_civil`, d.estado_civil || "");
      setVal(`deudor_${idx}_participacion_monto`, d.participacion_monto || "");
      setVal(`deudor_${idx}_participacion_porcentaje`, d.participacion_porcentaje || "");
    });
  } else {
    agregarDeudor();
  }

  // ── Codeudores ──
  const codeudoresData = datos.codeudores || [];
  const codContainer = document.getElementById("codeudores-container");
  codContainer.innerHTML = "";
  contadorCodeudores = 0;

  codeudoresData.forEach((cod) => {
    contadorCodeudores++;
    const idx = contadorCodeudores;
    codContainer.insertAdjacentHTML("beforeend", crearCardPersona("codeudor", idx, true));
    setVal(`codeudor_${idx}_nombre`, cod.nombre || "");
    setVal(`codeudor_${idx}_cc`, cod.cc || "");
    setVal(`codeudor_${idx}_cc_expedicion`, cod.cc_expedicion || "");
    setVal(`codeudor_${idx}_direccion`, cod.direccion || "");
    setVal(`codeudor_${idx}_email`, cod.email || "");
    setVal(`codeudor_${idx}_telefono`, cod.telefono || "");
    setVal(`codeudor_${idx}_estado_civil`, cod.estado_civil || "");
  });

  // ── Acreedores ──
  const acreedoresData = datos.acreedores || [];
  const container = document.getElementById("acreedores-container");
  container.innerHTML = "";
  contadorAcreedores = 0;

  if (acreedoresData.length > 0) {
    acreedoresData.forEach((acr) => {
      contadorAcreedores++;
      const idx = contadorAcreedores;
      container.insertAdjacentHTML("beforeend", crearCardPersona("acreedor", idx, false));
      setVal(`acreedor_${idx}_nombre`, acr.nombre || "");
      setVal(`acreedor_${idx}_cc`, acr.cc || "");
      setVal(`acreedor_${idx}_cc_expedicion`, acr.cc_expedicion || "");
      setVal(`acreedor_${idx}_direccion`, acr.direccion || "");
      setVal(`acreedor_${idx}_email`, acr.email || "");
      setVal(`acreedor_${idx}_telefono`, acr.telefono || "");
      setVal(`acreedor_${idx}_estado_civil`, acr.estado_civil || "");
      setVal(`acreedor_${idx}_participacion_monto`, acr.participacion_monto || "");
      setVal(`acreedor_${idx}_participacion_porcentaje`, acr.participacion_porcentaje || "");
      setVal(`acreedor_${idx}_cuenta_bancaria`, acr.cuenta_bancaria || "");
    });
  } else {
    agregarAcreedor();
    agregarAcreedor();
  }

  // ── Inmueble ──
  const inm = datos.inmueble || {};
  setVal("inmueble_matricula", inm.matricula_inmobiliaria || "");
  setVal("inmueble_cedula_catastral", inm.cedula_catastral || "");
  setVal("inmueble_chip", inm.chip || "");
  setVal("inmueble_direccion", inm.direccion || "");
  setVal("inmueble_descripcion", inm.descripcion || "");
  setVal("inmueble_linderos", inm.linderos || "");

  // ── Prestamo ──
  const p = datos.prestamo || {};
  setVal("prestamo_monto", p.monto || "");
  setVal("prestamo_plazo", p.plazo_meses || "");
  setVal("prestamo_tasa", p.tasa_mensual || "");
  setVal("prestamo_cuota", p.cuota_mensual || "");
  setVal("prestamo_forma_pago", p.forma_pago || "");
  setVal("prestamo_comision", p.comision_aluri || "");
  setVal("prestamo_observaciones", p.observaciones || "");

  sincronizarMontoDeudor();
}

// ══════════════════════════════════════════════
// RECOPILAR DATOS DEL FORMULARIO
// ══════════════════════════════════════════════

function recopilarDeudores() {
  const deudores = [];
  for (let i = 1; i <= contadorDeudores; i++) {
    const el = document.getElementById(`deudor_${i}_nombre`);
    if (!el) continue;
    deudores.push({
      nombre: val(`deudor_${i}_nombre`),
      cc: val(`deudor_${i}_cc`),
      cc_expedicion: val(`deudor_${i}_cc_expedicion`),
      direccion: val(`deudor_${i}_direccion`),
      email: val(`deudor_${i}_email`),
      telefono: val(`deudor_${i}_telefono`),
      estado_civil: val(`deudor_${i}_estado_civil`),
      participacion_monto: val(`deudor_${i}_participacion_monto`),
      participacion_porcentaje: val(`deudor_${i}_participacion_porcentaje`),
    });
  }
  return deudores;
}

function recopilarDatos() {
  const deudores = recopilarDeudores();
  return {
    tipo_contrato: val("tipo_contrato"),
    deudor: deudores[0] || {},
    deudores: deudores,
    codeudores: recopilarPersonas("codeudor", contadorCodeudores),
    acreedores: recopilarAcreedores(),
    inmueble: {
      matricula_inmobiliaria: val("inmueble_matricula"),
      cedula_catastral: val("inmueble_cedula_catastral"),
      direccion: val("inmueble_direccion"),
      descripcion: val("inmueble_descripcion"),
      linderos: val("inmueble_linderos"),
      chip: val("inmueble_chip"),
    },
    prestamo: {
      monto: val("prestamo_monto"),
      plazo_meses: val("prestamo_plazo"),
      tasa_mensual: val("prestamo_tasa"),
      cuota_mensual: val("prestamo_cuota"),
      forma_pago: val("prestamo_forma_pago"),
      comision_aluri: val("prestamo_comision"),
      observaciones: val("prestamo_observaciones"),
    },
    fecha_creacion: new Date().toISOString(),
  };
}

function recopilarAcreedores() {
  const acreedores = [];
  const cards = document.querySelectorAll("#acreedores-container .persona-card");
  cards.forEach((_, i) => {
    const idx = i + 1;
    acreedores.push({
      nombre: val(`acreedor_${idx}_nombre`),
      cc: val(`acreedor_${idx}_cc`),
      cc_expedicion: val(`acreedor_${idx}_cc_expedicion`),
      direccion: val(`acreedor_${idx}_direccion`),
      email: val(`acreedor_${idx}_email`),
      telefono: val(`acreedor_${idx}_telefono`),
      estado_civil: val(`acreedor_${idx}_estado_civil`),
      participacion_monto: val(`acreedor_${idx}_participacion_monto`),
      participacion_porcentaje: val(`acreedor_${idx}_participacion_porcentaje`),
      cuenta_bancaria: val(`acreedor_${idx}_cuenta_bancaria`),
    });
  });
  return acreedores;
}

function recopilarPersonas(prefijo, total) {
  const personas = [];
  for (let i = 1; i <= total; i++) {
    const el = document.getElementById(`${prefijo}_${i}_nombre`);
    if (!el) continue;
    personas.push({
      nombre: val(`${prefijo}_${i}_nombre`),
      cc: val(`${prefijo}_${i}_cc`),
      cc_expedicion: val(`${prefijo}_${i}_cc_expedicion`),
      direccion: val(`${prefijo}_${i}_direccion`),
      email: val(`${prefijo}_${i}_email`),
      telefono: val(`${prefijo}_${i}_telefono`),
      estado_civil: val(`${prefijo}_${i}_estado_civil`),
    });
  }
  return personas;
}

// ══════════════════════════════════════════════
// AGREGAR / QUITAR PERSONAS
// ══════════════════════════════════════════════

function agregarDeudor() {
  if (contadorDeudores >= 4) {
    mostrarToast("Maximo 4 deudores permitidos", "error");
    return;
  }
  contadorDeudores++;
  const container = document.getElementById("deudores-container");
  container.insertAdjacentHTML("beforeend", crearCardDeudor(contadorDeudores));
}

function agregarCodeudor() {
  if (contadorCodeudores >= 4) {
    mostrarToast("Maximo 4 codeudores permitidos", "error");
    return;
  }
  contadorCodeudores++;
  const container = document.getElementById("codeudores-container");
  container.insertAdjacentHTML("beforeend", crearCardPersona("codeudor", contadorCodeudores, true));
}

function agregarAcreedor() {
  if (contadorAcreedores >= 4) {
    mostrarToast("Maximo 4 acreedores permitidos", "error");
    return;
  }
  contadorAcreedores++;
  const container = document.getElementById("acreedores-container");
  container.insertAdjacentHTML("beforeend", crearCardPersona("acreedor", contadorAcreedores, true));
  actualizarParticipaciones();
}

function eliminarPersona(tipo, idx) {
  const el = document.getElementById(`${tipo}_${idx}_card`);
  if (el) el.remove();
  if (tipo === "deudor") {
    contadorDeudores--;
    renumerarCards("deudor", "deudores-container");
  } else if (tipo === "acreedor") {
    contadorAcreedores--;
    renumerarCards("acreedor", "acreedores-container");
    actualizarParticipaciones();
  } else {
    contadorCodeudores--;
    renumerarCards("codeudor", "codeudores-container");
  }
}

function renumerarCards(tipo, containerId) {
  const container = document.getElementById(containerId);
  const cards = container.querySelectorAll(".persona-card");
  if (tipo === "deudor") contadorDeudores = cards.length;
  else if (tipo === "acreedor") contadorAcreedores = cards.length;
  else contadorCodeudores = cards.length;

  cards.forEach((card, i) => {
    const num = i + 1;
    let label;
    if (tipo === "deudor") label = num === 1 ? "Deudor Principal" : `Deudor ${num}`;
    else if (tipo === "acreedor") label = `Acreedor ${num}`;
    else label = `Codeudor ${num}`;

    card.id = `${tipo}_${num}_card`;
    const titleEl = card.querySelector(".persona-title");
    // Preserve remove button if exists
    const rmBtn = card.querySelector(".remove-btn");
    if (rmBtn) {
      titleEl.innerHTML = label + " ";
      rmBtn.setAttribute("onclick", `eliminarPersona('${tipo}', ${num})`);
      titleEl.appendChild(rmBtn);
    } else {
      titleEl.textContent = label;
    }

    card.querySelectorAll("input, select, textarea").forEach((input) => {
      const id = input.getAttribute("id");
      if (id) {
        const newId = id.replace(/\d+/, num);
        input.setAttribute("id", newId);
        input.setAttribute("name", newId);
      }
    });
  });
}

// ══════════════════════════════════════════════
// CREAR CARDS DE PERSONAS
// ══════════════════════════════════════════════

function crearCardDeudor(idx) {
  const label = idx === 1 ? "Deudor Principal" : `Deudor ${idx}`;
  const removeBtn = `<button type="button" class="remove-btn" onclick="eliminarPersona('deudor', ${idx})">Eliminar</button>`;

  return `
    <div class="persona-card" id="deudor_${idx}_card">
      <div class="persona-title">${label} ${removeBtn}</div>
      <div class="form-grid">
        <div class="field full-width">
          <label>Nombre completo <span class="required">*</span></label>
          <input type="text" id="deudor_${idx}_nombre" placeholder="Nombre completo" required>
        </div>
        <div class="field">
          <label>No. Cedula <span class="required">*</span></label>
          <input type="text" id="deudor_${idx}_cc" placeholder="XX.XXX.XXX">
        </div>
        <div class="field">
          <label>Expedida en</label>
          <input type="text" id="deudor_${idx}_cc_expedicion" placeholder="Ciudad">
        </div>
        <div class="field full-width">
          <label>Direccion de notificacion</label>
          <input type="text" id="deudor_${idx}_direccion" placeholder="Direccion completa">
        </div>
        <div class="field">
          <label>Correo electronico</label>
          <input type="email" id="deudor_${idx}_email" placeholder="correo@ejemplo.com">
        </div>
        <div class="field">
          <label>Telefono</label>
          <input type="text" id="deudor_${idx}_telefono" placeholder="300 000 0000">
        </div>
        <div class="field">
          <label>Estado civil</label>
          <input type="text" id="deudor_${idx}_estado_civil" list="opciones-estado-civil" placeholder="Escriba o seleccione...">
        </div>
        <div class="field">
          <label>Participacion $</label>
          <input type="text" id="deudor_${idx}_participacion_monto" placeholder="180.000.000" oninput="formatearMonto(this); sincronizarMontoDeudor()">
        </div>
        <div class="field">
          <label>Participacion %</label>
          <input type="text" id="deudor_${idx}_participacion_porcentaje" placeholder="100%">
        </div>
      </div>
    </div>
  `;
}

function crearCardPersona(tipo, idx, conEliminar) {
  const label = tipo === "acreedor" ? `Acreedor ${idx}` : `Codeudor ${idx}`;
  const esAcreedor = tipo === "acreedor";

  let extraFields = "";
  if (esAcreedor) {
    extraFields = `
      <div class="field">
        <label>Participacion $</label>
        <input type="text" id="${tipo}_${idx}_participacion_monto" placeholder="90.000.000" oninput="formatearMonto(this)">
      </div>
      <div class="field">
        <label>Participacion %</label>
        <input type="text" id="${tipo}_${idx}_participacion_porcentaje" placeholder="50%">
      </div>
      <div class="field full-width">
        <label>Cuenta bancaria</label>
        <input type="text" id="${tipo}_${idx}_cuenta_bancaria" placeholder="Cuenta de ahorros No. XXXXX de Bancolombia">
      </div>
    `;
  }

  const removeBtn = conEliminar
    ? `<button type="button" class="remove-btn" onclick="eliminarPersona('${tipo}', ${idx})">Eliminar</button>`
    : "";

  return `
    <div class="persona-card" id="${tipo}_${idx}_card">
      <div class="persona-title">${label} ${removeBtn}</div>
      <div class="form-grid">
        <div class="field full-width">
          <label>Nombre completo <span class="required">*</span></label>
          <input type="text" id="${tipo}_${idx}_nombre" placeholder="Nombre completo" required>
        </div>
        <div class="field">
          <label>No. Cedula <span class="required">*</span></label>
          <input type="text" id="${tipo}_${idx}_cc" placeholder="XX.XXX.XXX">
        </div>
        <div class="field">
          <label>Expedida en</label>
          <input type="text" id="${tipo}_${idx}_cc_expedicion" placeholder="Ciudad">
        </div>
        <div class="field full-width">
          <label>Direccion de notificacion</label>
          <input type="text" id="${tipo}_${idx}_direccion" placeholder="Direccion completa">
        </div>
        <div class="field">
          <label>Correo electronico</label>
          <input type="email" id="${tipo}_${idx}_email" placeholder="correo@ejemplo.com">
        </div>
        <div class="field">
          <label>Telefono</label>
          <input type="text" id="${tipo}_${idx}_telefono" placeholder="300 000 0000">
        </div>
        <div class="field">
          <label>Estado civil</label>
          <input type="text" id="${tipo}_${idx}_estado_civil" list="opciones-estado-civil" placeholder="Escriba o seleccione...">
        </div>
        ${extraFields}
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════
// SINCRONIZAR MONTO DEUDOR -> MONTO PRESTAMO
// ══════════════════════════════════════════════

function sincronizarMontoDeudor() {
  // Monto total = suma de la participacion $ de TODOS los deudores
  let montoTotal = 0;
  for (let i = 1; i <= contadorDeudores; i++) {
    montoTotal += parseInt((val(`deudor_${i}_participacion_monto`) || "0").replace(/\./g, ""), 10) || 0;
  }

  // Sincronizar monto del prestamo
  const elMonto = document.getElementById("prestamo_monto");
  if (elMonto) {
    elMonto.value = montoTotal > 0 ? montoTotal.toLocaleString("es-CO").replace(/,/g, ".") : "";
  }

  // Calcular % de participacion de cada deudor
  for (let i = 1; i <= contadorDeudores; i++) {
    const montoDeudor = parseInt((val(`deudor_${i}_participacion_monto`) || "0").replace(/\./g, ""), 10) || 0;
    const elPct = document.getElementById(`deudor_${i}_participacion_porcentaje`);
    if (elPct) {
      if (contadorDeudores === 1 && montoDeudor > 0) {
        elPct.value = "100%";
      } else if (montoTotal > 0 && montoDeudor > 0) {
        elPct.value = ((montoDeudor / montoTotal) * 100).toFixed(1) + "%";
      } else {
        elPct.value = "";
      }
    }
  }

  // Comision Aluri = 5% del monto total
  const comision = Math.round(montoTotal * 5 / 100);
  const elComision = document.getElementById("prestamo_comision");
  if (elComision) {
    elComision.value = comision > 0 ? comision.toLocaleString("es-CO").replace(/,/g, ".") : "";
  }
}

// ══════════════════════════════════════════════
// CALCULO AUTOMATICO DE PARTICIPACIONES
// ══════════════════════════════════════════════

function actualizarParticipaciones() {
  const montoTotal = parseFloat((val("prestamo_monto") || "0").replace(/\./g, "").replace(/,/g, "")) || 0;

  const cards = document.querySelectorAll("#acreedores-container .persona-card");

  cards.forEach((_, i) => {
    const idx = i + 1;
    const montoInput = document.getElementById(`acreedor_${idx}_participacion_monto`);
    const pctInput = document.getElementById(`acreedor_${idx}_participacion_porcentaje`);
    if (!montoInput || !pctInput) return;

    const monto = parseFloat((montoInput.value || "0").replace(/\./g, "").replace(/,/g, "")) || 0;

    if (montoTotal > 0 && monto > 0) {
      pctInput.value = ((monto / montoTotal) * 100).toFixed(1) + "%";
    } else {
      pctInput.value = "";
    }
  });
}

// ══════════════════════════════════════════════
// GENERAR CONTRATO (.docx o .pdf)
// ══════════════════════════════════════════════

async function generarContrato(formato) {
  const nombre = val("deudor_1_nombre");
  if (!nombre) {
    mostrarToast("Ingrese al menos el nombre del deudor", "error");
    const el = document.getElementById("deudor_1_nombre");
    if (el) el.focus();
    return;
  }

  const camposRequeridos = [
    { id: "deudor_1_cc", label: "Cedula del deudor" },
    { id: "acreedor_1_nombre", label: "Nombre del acreedor 1" },
    { id: "acreedor_1_cc", label: "Cedula del acreedor 1" },
    { id: "prestamo_monto", label: "Monto del prestamo" },
    { id: "prestamo_plazo", label: "Plazo en meses" },
    { id: "prestamo_tasa", label: "Tasa mensual" },
  ];

  for (const campo of camposRequeridos) {
    if (!val(campo.id)) {
      mostrarToast(`Campo requerido: ${campo.label}`, "error");
      document.getElementById(campo.id).focus();
      return;
    }
  }

  const datos = recopilarDatos();
  const esPDF = formato === "pdf";
  const endpoint = esPDF ? "/api/generar-contrato-pdf" : "/api/generar-contrato";
  const textoLoading = esPDF ? "Generando contrato PDF..." : "Generando contrato...";

  mostrarLoading(textoLoading);

  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || "Error al generar contrato");
    }

    const blob = await resp.blob();
    const contentDisposition = resp.headers.get("Content-Disposition") || "";
    let filename = esPDF ? "Contrato.pdf" : "Contrato.docx";
    const match = contentDisposition.match(/filename=(.+)/);
    if (match) {
      filename = match[1].replace(/"/g, "");
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    mostrarToast(`Contrato ${formato.toUpperCase()} descargado exitosamente`, "success");
  } catch (err) {
    mostrarToast(`Error: ${err.message}`, "error");
  } finally {
    ocultarLoading();
  }
}

// ══════════════════════════════════════════════
// UTILIDADES
// ══════════════════════════════════════════════

function limpiarFormulario() {
  if (confirm("Se borraran todos los datos del formulario. Continuar?")) {
    document.getElementById("checklist-form").reset();
    iniciarFormularioVacio();
  }
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setVal(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.tagName === "SELECT") {
    const opciones = el.querySelectorAll("option");
    let found = false;
    opciones.forEach((opt) => {
      if (opt.value === valor || opt.value.toLowerCase() === valor.toLowerCase()) {
        opt.selected = true;
        found = true;
      }
    });
    if (!found && valor) {
      opciones.forEach((opt) => {
        if (opt.value && valor.toLowerCase().includes(opt.value.toLowerCase().substring(0, 5))) {
          opt.selected = true;
        }
      });
    }
  } else {
    el.value = valor;
  }
}

function mostrarToast(msg, tipo) {
  const prev = document.querySelector(".toast");
  if (prev) prev.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function mostrarLoading(texto) {
  document.getElementById("loading-text").textContent = texto || "Procesando...";
  document.getElementById("loading-overlay").style.display = "flex";
}

function ocultarLoading() {
  document.getElementById("loading-overlay").style.display = "none";
}

function formatearMonto(input) {
  let valor = input.value.replace(/\./g, "").replace(/[^0-9]/g, "");
  if (valor) {
    input.value = parseInt(valor).toLocaleString("es-CO").replace(/,/g, ".");
  }
}
