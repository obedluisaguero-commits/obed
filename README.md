# monky's — Documentación técnica

Tienda online de moda familiar conectada a Google Sheets. Next.js + Tailwind + Vercel.

---

## 1. Arquitectura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Google Sheets   │◄────►│  Google Apps      │      │   Administrador  │
│  (Base de datos) │      │  Script (Code.gs) │◄─────│   (edita filas)  │
│  Hoja "Productos"│      │  Validación +     │      └─────────────────┘
└────────┬─────────┘      │  alertas de stock │
         │ Sheets API v4  └──────────────────┘
         │ (lectura, API Key)
         ▼
┌──────────────────────────────────────────────┐
│              Next.js (Vercel)                  │
│  lib/sheets.js → capa de acceso a datos        │
│  getStaticProps + ISR (revalidate: 60s)        │
│  pages/api/* → stock en tiempo real, búsqueda  │
├──────────────────────────────────────────────┤
│  / (Inicio)  /mujer  /hombre  /ninos           │
│  /ofertas    /producto/[id]   /contacto        │
└────────────────────┬───────────────────────────┘
                      │
                      ▼
            ┌───────────────────┐
            │   Usuario final     │
            │  (familia peruana)  │
            │  → compra vía       │
            │    WhatsApp wa.me   │
            └───────────────────┘
```

**Flujo de datos:** el administrador edita precios/stock directamente en Google Sheets (sin código). Apps Script valida cada cambio en segundo plano (precios coherentes, stock no negativo, estado automático). Next.js consulta el Sheet vía API cada 60 segundos (ISR — Incremental Static Regeneration), por lo que el sitio se mantiene casi en tiempo real sin sacrificar la velocidad de páginas estáticas. La página de producto además hace polling cada 20s contra `/api/stock/[id]` para mostrar el stock más reciente sin esperar la regeneración completa.

**Por qué este stack:**
- **Google Sheets como BD** → el dueño del negocio (no técnico) administra inventario sin depender de un programador.
- **ISR en vez de SSR puro** → páginas servidas como estáticas (rápidas, SEO-friendly) pero que se actualizan solas.
- **WhatsApp como checkout** → evita pasarela de pagos compleja; encaja con el comportamiento de compra real en Perú (Yape/Plin + conversación directa).

---

## 2. Modelo de base de datos (Google Sheets)

Hoja `Productos`, una fila por producto/variante:

| Columna | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `ID` | texto único | identificador interno | `1` |
| `Categoria` | texto | Mujer / Hombre / Niños | `Mujer` |
| `Subcategoria` | texto | según categoría | `Vestidos` |
| `Codigo` | texto | SKU para WhatsApp/inventario | `VES-001` |
| `Nombre` | texto | nombre comercial | `Vestido Floral Manga Corta` |
| `Descripcion` | texto largo | detalle del producto | `Tela algodón, corte A...` |
| `Precio` | número | precio normal (PEN) | `90` |
| `PrecioOferta` | número/vacío | precio rebajado, vacío si no aplica | `65` |
| `Stock` | número entero | unidades disponibles | `12` |
| `Talla` | texto | S/M/L o numérica | `M` |
| `Color` | texto | color principal | `Rosa` |
| `Marca` | texto | marca o "monky's" | `monky's` |
| `Imagen1` | URL | imagen principal | `https://drive.google.com/...` |
| `Imagen2` | URL/vacío | imagen secundaria | |
| `Imagen3` | URL/vacío | imagen terciaria | |
| `Estado` | texto | `activo` / `nuevo` / `agotado` / `inactivo` | `activo` |

**Reglas de negocio (automatizadas por Apps Script):**
- `PrecioOferta` debe ser menor a `Precio`, o se resalta en rojo.
- `Stock = 0` → `Estado` cambia automáticamente a `agotado`.
- Stock ≤ 5 unidades → email automático de alerta al administrador.
- Imágenes: subir a Google Drive con "Cualquier usuario con el enlace puede ver" y usar el enlace directo, o un host de imágenes (Cloudinary/Imgur) para mejor rendimiento.

---

## 3. Estrategia SEO

**On-page:**
- Metadatos únicos por página (`title`, `description`, `canonical`) — ver `<Head>` en cada página.
- Schema.org `ClothingStore` en inicio y `Product` con `Offer`/disponibilidad en fichas de producto → habilita rich snippets (precio, stock) en Google.
- URLs limpias y semánticas: `/mujer`, `/producto/[id]`, sin parámetros innecesarios.
- `sitemap.xml` dinámico (`pages/sitemap.xml.js`) que se regenera incluyendo cada producto activo.
- `robots.txt` permite indexación total excepto `/api/`.
- Redirecciones 301 desde variantes con tilde/plural (`/niños` → `/ninos`) para evitar contenido duplicado.

**Performance (factor de ranking):**
- ISR: HTML pre-renderizado, no esperar a Sheets API en cada visita.
- `next/image` con `sizes` correctos → carga adaptactiva según viewport.
- Mobile-first: Tailwind con breakpoints `sm/md/lg`, probado primero en 375px.

**Contenido:**
- Descripciones de producto orientadas a búsquedas reales ("vestido floral manga corta" en vez de solo "vestido bonito").
- Testimonios con ubicación (Huancayo, Lima, Arequipa) refuerzan SEO local + confianza.

**Pendiente recomendado:** Google Search Console + Google Business Profile vinculado a la tienda física en Huancayo para SEO local.

---

## 4. Funcionalidades clave — dónde están implementadas

| Funcionalidad | Archivo |
|---|---|
| Conexión Google Sheets API | `lib/sheets.js` |
| Buscador inteligente | `pages/api/buscar.js` |
| Filtros dinámicos (subcategoría, talla, orden) | `pages/[categoria]/index.jsx` |
| Stock en tiempo real | `pages/api/stock/[id].js` + polling en `pages/producto/[id].jsx` |
| Botón WhatsApp por producto | mensaje prellenado con nombre, código, talla y precio |
| Productos relacionados | `fetchRelatedProducts()` en `lib/sheets.js` |
| SEO avanzado | metadatos, JSON-LD, sitemap dinámico |
| Responsive mobile-first | Tailwind, grids `grid-cols-2 md:grid-cols-4` |
| Automatización de inventario | `apps-script/Code.gs` |

---

## 5. Guía de despliegue

### Paso 1 — Google Sheets
1. Crear una hoja llamada `Productos` con los encabezados exactos de la tabla de la sección 2 (fila 1).
2. Compartir la hoja como "Cualquiera con el enlace puede ver" (solo lectura es suficiente para la API).
3. Copiar el ID de la hoja desde la URL: `docs.google.com/spreadsheets/d/`**`ESTE_ID`**`/edit`.

### Paso 2 — Google Cloud / API Key
1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com).
2. Habilitar **Google Sheets API**.
3. Crear credencial tipo **API Key**, restringirla a "Google Sheets API" por seguridad.

### Paso 3 — Apps Script (automatización)
1. En el Sheet: Extensiones → Apps Script.
2. Pegar el contenido de `apps-script/Code.gs`.
3. Configurar el trigger `onEditTrigger`: Triggers (reloj) → Add Trigger → función `onEditTrigger` → evento "On edit".
4. Configurar trigger diario para `actualizarProductosNuevosDiario` (opcional).
5. Reemplazar `EMAIL_ALERTAS` por el correo real del administrador.

### Paso 4 — Variables de entorno
Copiar `.env.local.example` → `.env.local` y completar `GOOGLE_SHEET_ID` y `GOOGLE_SHEETS_API_KEY`.

### Paso 5 — Desarrollo local
```bash
npm install
npm run dev
```
Abrir `http://localhost:3000`.

### Paso 6 — Despliegue en Vercel
```bash
npm i -g vercel
vercel
```
O conectar el repositorio de GitHub directamente desde el dashboard de Vercel. Agregar las mismas variables de entorno en **Project Settings → Environment Variables**.

---

## 6. Próximos pasos sugeridos
- Reemplazar el número de WhatsApp placeholder (`51999999999`) en todos los archivos por el número real.
- Subir imágenes reales a Cloudinary o Google Drive y actualizar las columnas `Imagen1/2/3`.
- Configurar dominio propio (`monkysstore.pe`) en Vercel y actualizar `SEO.canonical` / `BASE_URL`.
- Conectar Google Analytics 4 + Meta Pixel para medir conversión desde WhatsApp.
- Considerar autenticación simple en el Sheet (protección de pestaña) para evitar ediciones accidentales del administrador.
