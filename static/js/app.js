// ── Estado de la aplicacion ──
let contadorDeudores = 0;
let contadorAcreedores = 0;
let contadorCodeudores = 0;

// ── Inicializacion: formulario listo para llenado manual ──
// Forzar scroll al inicio al recargar
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  iniciarFormularioVacio();
  window.scrollTo(0, 0);
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

  // Limpiar inmueble y prestamo (contenedores vacios, botones visibles)
  document.getElementById("inmueble-container").innerHTML = "";
  document.getElementById("btn-agregar-inmueble").style.display = "";
  document.getElementById("prestamo-container").innerHTML = "";
  document.getElementById("btn-agregar-prestamo").style.display = "";
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
      setVal(`deudor_${idx}_tipo_doc`, normalizarTipoDoc(d.tipo_doc));
      setVal(`deudor_${idx}_cc`, d.cc || "");
      setVal(`deudor_${idx}_cc_expedicion`, d.cc_expedicion || "");
      setVal(`deudor_${idx}_direccion`, d.direccion || "");
      setVal(`deudor_${idx}_email`, d.email || "");
      setVal(`deudor_${idx}_telefono`, d.telefono || "");
      setVal(`deudor_${idx}_estado_civil`, d.estado_civil || "");
      setVal(`deudor_${idx}_participacion_monto`, d.participacion_monto || "");
      setVal(`deudor_${idx}_participacion_porcentaje`, d.participacion_porcentaje || "");
      setVal(`deudor_${idx}_tipo_cuenta`, normalizarTipoCuenta(d.tipo_cuenta));
      setVal(`deudor_${idx}_numero_cuenta`, d.numero_cuenta || "");
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
    setVal(`codeudor_${idx}_tipo_doc`, normalizarTipoDoc(cod.tipo_doc));
    setVal(`codeudor_${idx}_cc`, cod.cc || "");
    setVal(`codeudor_${idx}_cc_expedicion`, cod.cc_expedicion || "");
    setVal(`codeudor_${idx}_direccion`, cod.direccion || "");
    setVal(`codeudor_${idx}_email`, cod.email || "");
    setVal(`codeudor_${idx}_telefono`, cod.telefono || "");
    setVal(`codeudor_${idx}_estado_civil`, cod.estado_civil || "");
    setVal(`codeudor_${idx}_tipo_cuenta`, normalizarTipoCuenta(cod.tipo_cuenta));
    setVal(`codeudor_${idx}_numero_cuenta`, cod.numero_cuenta || "");
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
      container.insertAdjacentHTML("beforeend", crearCardPersona("acreedor", idx, true));
      setVal(`acreedor_${idx}_nombre`, acr.nombre || "");
      setVal(`acreedor_${idx}_tipo_doc`, normalizarTipoDoc(acr.tipo_doc));
      setVal(`acreedor_${idx}_cc`, acr.cc || "");
      setVal(`acreedor_${idx}_cc_expedicion`, acr.cc_expedicion || "");
      setVal(`acreedor_${idx}_direccion`, acr.direccion || "");
      setVal(`acreedor_${idx}_email`, acr.email || "");
      setVal(`acreedor_${idx}_telefono`, acr.telefono || "");
      setVal(`acreedor_${idx}_estado_civil`, acr.estado_civil || "");
      setVal(`acreedor_${idx}_participacion_monto`, acr.participacion_monto || "");
      setVal(`acreedor_${idx}_participacion_porcentaje`, acr.participacion_porcentaje || "");
      setVal(`acreedor_${idx}_tipo_cuenta`, normalizarTipoCuenta(acr.tipo_cuenta));
      setVal(`acreedor_${idx}_numero_cuenta`, acr.numero_cuenta || acr.cuenta_bancaria || "");
    });
  } else {
    agregarAcreedor();
    agregarAcreedor();
  }

  // ── Inmueble (desplegar y rellenar) ──
  mostrarInmueble();
  const inm = datos.inmueble || {};
  setVal("inmueble_matricula", inm.matricula_inmobiliaria || "");
  setVal("inmueble_cedula_catastral", inm.cedula_catastral || "");
  setVal("inmueble_chip", inm.chip || "");
  setVal("inmueble_ciudad_oficina_registro", inm.ciudad_oficina_registro || "");
  setVal("inmueble_ciudad_inmueble", inm.ciudad_inmueble || "");
  setVal("inmueble_direccion", inm.direccion || "");
  setVal("inmueble_descripcion", inm.descripcion || "");
  setVal("inmueble_linderos", inm.linderos || "");

  // ── Prestamo (desplegar y rellenar) ──
  mostrarPrestamo();
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
      tipo_doc: val(`deudor_${i}_tipo_doc`),
      cc: val(`deudor_${i}_cc`),
      cc_expedicion: val(`deudor_${i}_cc_expedicion`),
      direccion: val(`deudor_${i}_direccion`),
      email: val(`deudor_${i}_email`),
      telefono: val(`deudor_${i}_telefono`),
      estado_civil: val(`deudor_${i}_estado_civil`),
      participacion_monto: val(`deudor_${i}_participacion_monto`),
      participacion_porcentaje: val(`deudor_${i}_participacion_porcentaje`),
      tipo_cuenta: val(`deudor_${i}_tipo_cuenta`),
      numero_cuenta: val(`deudor_${i}_numero_cuenta`),
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
      ciudad_oficina_registro: val("inmueble_ciudad_oficina_registro"),
      ciudad_inmueble: val("inmueble_ciudad_inmueble"),
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
      tipo_doc: val(`acreedor_${idx}_tipo_doc`),
      cc: val(`acreedor_${idx}_cc`),
      cc_expedicion: val(`acreedor_${idx}_cc_expedicion`),
      direccion: val(`acreedor_${idx}_direccion`),
      email: val(`acreedor_${idx}_email`),
      telefono: val(`acreedor_${idx}_telefono`),
      estado_civil: val(`acreedor_${idx}_estado_civil`),
      participacion_monto: val(`acreedor_${idx}_participacion_monto`),
      participacion_porcentaje: val(`acreedor_${idx}_participacion_porcentaje`),
      tipo_cuenta: val(`acreedor_${idx}_tipo_cuenta`),
      numero_cuenta: val(`acreedor_${idx}_numero_cuenta`),
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
      tipo_doc: val(`${prefijo}_${i}_tipo_doc`),
      cc: val(`${prefijo}_${i}_cc`),
      cc_expedicion: val(`${prefijo}_${i}_cc_expedicion`),
      direccion: val(`${prefijo}_${i}_direccion`),
      email: val(`${prefijo}_${i}_email`),
      telefono: val(`${prefijo}_${i}_telefono`),
      estado_civil: val(`${prefijo}_${i}_estado_civil`),
      tipo_cuenta: val(`${prefijo}_${i}_tipo_cuenta`),
      numero_cuenta: val(`${prefijo}_${i}_numero_cuenta`),
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

function mostrarInmueble() {
  const container = document.getElementById("inmueble-container");
  document.getElementById("btn-agregar-inmueble").style.display = "none";
  container.innerHTML = `
    <div class="form-grid">
      <div class="field">
        <label>No. Matricula Inmobiliaria <span class="required">*</span></label>
        <input type="text" id="inmueble_matricula" placeholder="50S-XXXXXX">
      </div>
      <div class="field">
        <label>Cedula catastral</label>
        <input type="text" id="inmueble_cedula_catastral" placeholder="BS 23S 61 44 2">
      </div>
      <div class="field">
        <label>Codigo CHIP</label>
        <input type="text" id="inmueble_chip" placeholder="AAA0000XXXX">
      </div>
      <div class="field">
        <label>Ciudad Oficina de Registro <span class="required">*</span></label>
        <input type="text" id="inmueble_ciudad_oficina_registro" placeholder="Bogota">
      </div>
      <div class="field">
        <label>Ciudad del Inmueble <span class="required">*</span></label>
        <input type="text" id="inmueble_ciudad_inmueble" placeholder="Bogota">
      </div>
      <div class="field full-width">
        <label>Direccion del inmueble <span class="required">*</span></label>
        <input type="text" id="inmueble_direccion" placeholder="Direccion completa del inmueble">
      </div>
      <div class="field full-width">
        <label>Descripcion del inmueble</label>
        <textarea id="inmueble_descripcion" rows="4" placeholder="Area, numero de pisos, distribucion, etc."></textarea>
      </div>
      <div class="field full-width">
        <label>Linderos</label>
        <textarea id="inmueble_linderos" rows="4" placeholder="Linderos del inmueble segun escritura"></textarea>
      </div>
    </div>
  `;
}

function mostrarPrestamo() {
  const container = document.getElementById("prestamo-container");
  document.getElementById("btn-agregar-prestamo").style.display = "none";
  container.innerHTML = `
    <div class="form-grid">
      <div class="field">
        <label>Monto del prestamo <span class="required">*</span></label>
        <input type="text" id="prestamo_monto" placeholder="180.000.000" readonly autocomplete="off">
      </div>
      <div class="field">
        <label>Plazo (meses) <span class="required">*</span></label>
        <input type="number" id="prestamo_plazo" placeholder="60" min="1" max="360" autocomplete="off">
      </div>
      <div class="field">
        <label>Tasa mensual anticipada <span class="required">*</span></label>
        <input type="text" id="prestamo_tasa" placeholder="1.80%" autocomplete="off">
      </div>
      <div class="field">
        <label>Valor cuota mensual</label>
        <input type="text" id="prestamo_cuota" placeholder="3.240.000" oninput="formatearMonto(this)" autocomplete="off">
      </div>
      <div class="field">
        <label>Forma de pago <span class="required">*</span></label>
        <select id="prestamo_forma_pago" autocomplete="off">
          <option value="">Seleccionar...</option>
          <option value="Solo intereses">Solo intereses</option>
          <option value="Interes y capital">Interes y capital</option>
        </select>
      </div>
      <div class="field">
        <label>Comision Aluri</label>
        <input type="text" id="prestamo_comision" placeholder="9.000.000" readonly autocomplete="off">
      </div>
      <div class="field full-width">
        <label>Observaciones</label>
        <textarea id="prestamo_observaciones" rows="3" placeholder="Condiciones especiales, notas adicionales..." autocomplete="off"></textarea>
      </div>
    </div>
  `;
  // Limpiar campos readonly que sincronizarMontoDeudor pudo haber llenado
  const elMonto = document.getElementById("prestamo_monto");
  if (elMonto) elMonto.value = "";
  const elComision = document.getElementById("prestamo_comision");
  if (elComision) elComision.value = "";
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
          <label>Tipo de documento</label>
          <select id="deudor_${idx}_tipo_doc">
            <option value="C.C.">C.C.</option>
            <option value="C.E.">C.E.</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="T.I.">T.I.</option>
            <option value="NIT">NIT</option>
          </select>
        </div>
        <div class="field">
          <label>No. Documento <span class="required">*</span></label>
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
        <div class="field">
          <label>Tipo de cuenta</label>
          <select id="deudor_${idx}_tipo_cuenta">
            <option value="">Seleccionar...</option>
            <option value="Cuenta de ahorros">Cuenta de ahorros</option>
            <option value="Cuenta corriente">Cuenta corriente</option>
          </select>
        </div>
        <div class="field">
          <label>Numero de cuenta</label>
          <input type="text" id="deudor_${idx}_numero_cuenta" placeholder="XXXXXXXXXX">
        </div>
      </div>
    </div>
  `;
}

function crearCardPersona(tipo, idx, conEliminar) {
  const label = tipo === "acreedor" ? `Acreedor ${idx}` : `Codeudor ${idx}`;
  const esAcreedor = tipo === "acreedor";

  const cuentaFields = `
      <div class="field">
        <label>Tipo de cuenta</label>
        <select id="${tipo}_${idx}_tipo_cuenta">
          <option value="">Seleccionar...</option>
          <option value="Cuenta de ahorros">Cuenta de ahorros</option>
          <option value="Cuenta corriente">Cuenta corriente</option>
        </select>
      </div>
      <div class="field">
        <label>Numero de cuenta</label>
        <input type="text" id="${tipo}_${idx}_numero_cuenta" placeholder="XXXXXXXXXX">
      </div>
  `;

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
      ${cuentaFields}
    `;
  } else {
    extraFields = cuentaFields;
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
          <label>Tipo de documento</label>
          <select id="${tipo}_${idx}_tipo_doc">
            <option value="C.C.">C.C.</option>
            <option value="C.E.">C.E.</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="T.I.">T.I.</option>
            <option value="NIT">NIT</option>
          </select>
        </div>
        <div class="field">
          <label>No. Documento <span class="required">*</span></label>
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
        elPct.value = Math.round((montoDeudor / montoTotal) * 100) + "%";
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
      pctInput.value = Math.round((monto / montoTotal) * 100) + "%";
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

// Normaliza tipo de documento parseado del checklist a los valores del select
// Ej: "C.C", "CC", "cedula" -> "C.C."
function normalizarTipoDoc(raw) {
  if (!raw) return "C.C.";
  const s = String(raw).toLowerCase().replace(/[\s.]/g, "");
  if (s.includes("cedulaextranj") || s === "ce") return "C.E.";
  if (s === "cc" || s.includes("cedulaciudadan") || s.includes("cedula")) return "C.C.";
  if (s.includes("pasaporte")) return "Pasaporte";
  if (s === "ti" || s.includes("tarjetaidentidad")) return "T.I.";
  if (s === "nit") return "NIT";
  return "C.C.";
}

// Normaliza tipo de cuenta parseado del checklist al valor del select
// Ej: "Ahorros", "ahorro", "Cuenta Ahorros" -> "Cuenta de ahorros"
function normalizarTipoCuenta(raw) {
  if (!raw) return "";
  const s = String(raw).toLowerCase();
  if (s.includes("ahorr")) return "Cuenta de ahorros";
  if (s.includes("corriente")) return "Cuenta corriente";
  return "";
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
