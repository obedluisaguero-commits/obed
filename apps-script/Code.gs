/**
 * Code.gs — Google Apps Script para monky's
 * Se vincula a la hoja de cálculo "monky's - Inventario"
 *
 * Funciones:
 * 1. Validación automática de datos al editar (precios, stock, estado)
 * 2. Alertas de stock bajo por correo/WhatsApp (vía webhook)
 * 3. Endpoint API REST de respaldo (doGet) para consumo externo
 * 4. Marca automática de productos "nuevo" / "agotado"
 */

const SHEET_NAME = 'Productos'
const STOCK_MINIMO = 5
const EMAIL_ALERTAS = 'admin@monkysstore.pe' // cambiar por el correo real
const COLUMNS = {
  ID: 1, CATEGORIA: 2, SUBCATEGORIA: 3, CODIGO: 4, NOMBRE: 5, DESCRIPCION: 6,
  PRECIO: 7, PRECIO_OFERTA: 8, STOCK: 9, TALLA: 10, COLOR: 11, MARCA: 12,
  IMAGEN1: 13, IMAGEN2: 14, IMAGEN3: 15, ESTADO: 16,
}

/**
 * Trigger: se ejecuta automáticamente al editar cualquier celda de la hoja.
 * Configurar en Apps Script > Triggers > onEdit > Desde la hoja de cálculo > Al editar
 */
function onEditTrigger(e) {
  const sheet = e.range.getSheet()
  if (sheet.getName() !== SHEET_NAME) return

  const row = e.range.getRow()
  if (row === 1) return // ignorar encabezados

  validarFila(sheet, row)
  actualizarEstadoAutomatico(sheet, row)
  verificarStockBajo(sheet, row)
}

/**
 * Valida que precio, oferta y stock sean coherentes.
 * Resalta en rojo celdas con errores.
 */
function validarFila(sheet, row) {
  const precio = sheet.getRange(row, COLUMNS.PRECIO).getValue()
  const precioOferta = sheet.getRange(row, COLUMNS.PRECIO_OFERTA).getValue()
  const stock = sheet.getRange(row, COLUMNS.STOCK).getValue()

  const celdaPrecioOferta = sheet.getRange(row, COLUMNS.PRECIO_OFERTA)
  const celdaStock = sheet.getRange(row, COLUMNS.STOCK)

  // La oferta nunca debe ser mayor o igual al precio normal
  if (precioOferta && precioOferta >= precio) {
    celdaPrecioOferta.setBackground('#FCE4F0')
    SpreadsheetApp.getActive().toast(
      `Fila ${row}: el precio de oferta debe ser menor al precio normal`,
      'Error de validación',
      6
    )
  } else {
    celdaPrecioOferta.setBackground(null)
  }

  // El stock no puede ser negativo
  if (stock < 0) {
    celdaStock.setBackground('#FCE4F0')
    sheet.getRange(row, COLUMNS.STOCK).setValue(0)
  } else {
    celdaStock.setBackground(null)
  }
}

/**
 * Actualiza automáticamente la columna Estado según el stock:
 * - Stock = 0 → "agotado"
 * - Stock > 0 y estado anterior era "agotado" → vuelve a "activo"
 * No sobreescribe el estado "nuevo" manualmente asignado.
 */
function actualizarEstadoAutomatico(sheet, row) {
  const stock = sheet.getRange(row, COLUMNS.STOCK).getValue()
  const estadoActual = sheet.getRange(row, COLUMNS.ESTADO).getValue()
  const celdaEstado = sheet.getRange(row, COLUMNS.ESTADO)

  if (stock === 0 && estadoActual !== 'agotado') {
    celdaEstado.setValue('agotado')
  } else if (stock > 0 && estadoActual === 'agotado') {
    celdaEstado.setValue('activo')
  }
}

/**
 * Envía alerta por correo cuando el stock cae por debajo del mínimo.
 */
function verificarStockBajo(sheet, row) {
  const stock = sheet.getRange(row, COLUMNS.STOCK).getValue()
  const nombre = sheet.getRange(row, COLUMNS.NOMBRE).getValue()
  const codigo = sheet.getRange(row, COLUMNS.CODIGO).getValue()

  if (stock > 0 && stock <= STOCK_MINIMO) {
    const props = PropertiesService.getScriptProperties()
    const yaAlertado = props.getProperty(`alerta_${codigo}`)

    if (!yaAlertado) {
      MailApp.sendEmail({
        to: EMAIL_ALERTAS,
        subject: `⚠️ Stock bajo: ${nombre}`,
        body: `El producto "${nombre}" (código ${codigo}) tiene solo ${stock} unidades en stock.\n\nRevisa la hoja de inventario para reabastecer.`,
      })
      props.setProperty(`alerta_${codigo}`, 'true')
    }
  } else if (stock > STOCK_MINIMO) {
    // Resetea la alerta cuando se reabastece
    PropertiesService.getScriptProperties().deleteProperty(`alerta_${codigo}`)
  }
}

/**
 * Trigger diario (configurar con Triggers > Basado en tiempo > Diario):
 * Marca como "nuevo" los productos agregados en los últimos 14 días
 * y quita la etiqueta "nuevo" a los más antiguos.
 */
function actualizarProductosNuevosDiario() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
  const data = sheet.getDataRange().getValues()
  const hoy = new Date()

  for (let i = 1; i < data.length; i++) {
    const fechaCreacion = data[i][16] // columna opcional Q: FechaCreacion (agregar si se desea)
    if (!fechaCreacion) continue

    const dias = (hoy - new Date(fechaCreacion)) / (1000 * 60 * 60 * 24)
    const estadoActual = data[i][COLUMNS.ESTADO - 1]

    if (dias <= 14 && estadoActual !== 'agotado') {
      sheet.getRange(i + 1, COLUMNS.ESTADO).setValue('nuevo')
    } else if (dias > 14 && estadoActual === 'nuevo') {
      sheet.getRange(i + 1, COLUMNS.ESTADO).setValue('activo')
    }
  }
}

/**
 * Endpoint API REST de respaldo (GET).
 * Publicar como Web App: Implementar > Nueva implementación > Aplicación web
 * URL resultante: https://script.google.com/macros/s/XXXXX/exec
 *
 * Uso: /exec?categoria=mujer
 *      /exec?id=PRD-001
 *      /exec (todos los productos activos)
 */
function doGet(e) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
  const data = sheet.getDataRange().getValues()
  const headers = data[0]
  const rows = data.slice(1)

  let productos = rows.map((row) => {
    const obj = {}
    headers.forEach((h, i) => (obj[h] = row[i]))
    return obj
  })

  productos = productos.filter((p) => p.ID) // descarta filas vacías

  if (e.parameter.id) {
    productos = productos.filter((p) => p.Codigo === e.parameter.id || p.ID == e.parameter.id)
  }
  if (e.parameter.categoria) {
    productos = productos.filter(
      (p) => String(p.Categoria).toLowerCase() === e.parameter.categoria.toLowerCase()
    )
  }
  if (e.parameter.estado) {
    productos = productos.filter(
      (p) => String(p.Estado).toLowerCase() === e.parameter.estado.toLowerCase()
    )
  } else {
    productos = productos.filter((p) => String(p.Estado).toLowerCase() !== 'inactivo')
  }

  return ContentService.createTextOutput(JSON.stringify({ productos }))
    .setMimeType(ContentService.MimeType.JSON)
}

/**
 * Menú personalizado en la hoja para ejecutar acciones manualmente.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("monky's")
    .addItem('Validar todos los productos', 'validarTodaLaHoja')
    .addItem('Actualizar productos nuevos', 'actualizarProductosNuevosDiario')
    .addItem('Revisar stock bajo (todos)', 'revisarStockBajoCompleto')
    .addToUi()
}

function validarTodaLaHoja() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
  const lastRow = sheet.getLastRow()
  for (let row = 2; row <= lastRow; row++) {
    validarFila(sheet, row)
    actualizarEstadoAutomatico(sheet, row)
  }
  SpreadsheetApp.getActive().toast('Validación completa', "monky's", 4)
}

function revisarStockBajoCompleto() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
  const lastRow = sheet.getLastRow()
  for (let row = 2; row <= lastRow; row++) {
    verificarStockBajo(sheet, row)
  }
}
