// lib/jsonld.js — Serializa datos a JSON-LD de forma segura para incrustarlos
// dentro de una etiqueta <script>. Escapa <, > y & para que ningún valor
// (por ejemplo, el nombre de un producto cargado desde la hoja) pueda cerrar
// el </script> e inyectar HTML/JS malicioso (XSS).
export function safeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
