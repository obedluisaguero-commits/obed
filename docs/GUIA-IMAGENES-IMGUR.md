# Guía: cargar imágenes con Imgur (sin errores)

Esta guía explica cómo subir las fotos de tus productos a **Imgur** y pegar el
enlace correcto en Google Sheets para que aparezcan en la tienda sin errores.

---

## ⚠️ El error #1 (y cómo evitarlo)

El 90% de los problemas vienen de copiar el **enlace equivocado**. Imgur te da
varias URLs y solo **una** sirve: la del **enlace directo a la imagen**.

| Tipo de enlace | Ejemplo | ¿Sirve? |
|---|---|---|
| Página de Imgur | `https://imgur.com/aBcDeF` | ❌ NO (es una página web, no la imagen) |
| Álbum | `https://imgur.com/a/aBcDeF` | ❌ NO |
| Galería | `https://imgur.com/gallery/aBcDeF` | ❌ NO |
| **Enlace directo** | `https://i.imgur.com/aBcDeF.jpg` | ✅ **SÍ** |

**Regla de oro:** el enlace debe empezar con **`https://i.imgur.com/`** (con la
`i.` al inicio) y **terminar en `.jpg`, `.jpeg`, `.png` o `.webp`**.

Si tu enlace no cumple las dos condiciones, la imagen **no cargará**.

---

## Paso 1 — Subir la imagen a Imgur

1. Entra a **https://imgur.com** (no necesitas cuenta, pero con cuenta tus
   imágenes no se borran solas).
2. Haz clic en **New post** (arriba a la izquierda).
3. Arrastra la foto del producto o haz clic en **Choose Photo/Video**.
4. Espera a que termine de subir.

> 💡 Recomendado: crea una cuenta gratuita en Imgur. Las imágenes subidas sin
> cuenta pueden eliminarse si nadie las ve durante mucho tiempo, y entonces se
> romperían en tu tienda.

---

## Paso 2 — Copiar el ENLACE DIRECTO correcto

**Opción A — Desde el menú de Imgur (la más segura):**
1. Pasa el mouse sobre la imagen subida.
2. Haz clic en el ícono de **compartir** o en los **tres puntos (···)**.
3. Busca la opción **"Copy link"** o **"Get share links"**.
4. Elige el campo que dice **"Direct link"** (enlace directo). Ese empieza con
   `https://i.imgur.com/...` y termina en `.jpg` o `.png`. **Ese es el que
   necesitas.**

**Opción B — Clic derecho (rápida y confiable):**
1. Abre la imagen ya subida en Imgur.
2. Haz **clic derecho** sobre la imagen → **"Copiar dirección de la imagen"**
   (en inglés: *"Copy image address"*).
3. Pega en un bloc de notas para verificar que sea `https://i.imgur.com/XXXX.jpg`.

> ❗ Si al pegar te sale `https://imgur.com/XXXX` (sin la `i.` y sin `.jpg`),
> ese es el enlace **equivocado**. Vuelve a copiar usando la Opción B.

---

## Paso 3 — Pegar el enlace en Google Sheets

1. Abre tu hoja **`Productos`**.
2. Ubica la fila del producto.
3. Pega el enlace directo en la columna **`Imagen1`** (imagen principal).
4. Opcional: usa **`Imagen2`** e **`Imagen3`** para más fotos del mismo producto
   (se mostrarán como galería en la página de detalle).

Ejemplo de cómo debe quedar la celda:

```
https://i.imgur.com/aBcDeF.jpg
```

La tienda se actualiza sola en máximo ~60 segundos (o al recargar la página).

---

## ✅ Checklist rápido antes de guardar

- [ ] El enlace empieza con `https://i.imgur.com/`
- [ ] El enlace termina en `.jpg`, `.jpeg`, `.png` o `.webp`
- [ ] Al pegar el enlace en una pestaña nueva del navegador, se ve **solo la
      imagen** (sin la página de Imgur alrededor)
- [ ] No es un enlace de **álbum** (`/a/`) ni de **galería** (`/gallery/`)

---

## 🛠️ Solución de problemas

**"La imagen no aparece / sale el emoji 👗 de relleno"**
- El enlace no es directo. Revisa que sea `i.imgur.com/....jpg` (Paso 2,
  Opción B).
- La celda `Imagen1` está vacía o tiene un espacio. Bórrala y pega de nuevo.

**Error en consola: `hostname "imgur.com" is not configured under images`**
- Estás usando `imgur.com` en vez de `i.imgur.com`. Solo el segundo está
  permitido. Corrige el enlace en la hoja.
- (Solo si decidieras usar otro dominio nuevo, habría que agregarlo en
  `next.config.js` → `images.remotePatterns`.)

**La imagen cargaba y de repente dejó de verse**
- Imgur pudo eliminar la imagen (suele pasar con imágenes subidas sin cuenta).
  Vuelve a subirla con una cuenta de Imgur y actualiza el enlace.

**La imagen se ve recortada**
- Es normal: las tarjetas recortan la imagen para que todas tengan el mismo
  tamaño (`object-fit: cover`). Para mejor resultado, sube fotos en formato
  **vertical o cuadrado** (ej. 1000×1000 px o 800×1200 px).

---

## ℹ️ Nota técnica (ya está configurado, no necesitas tocarlo)

El proyecto ya autoriza el dominio de Imgur en `next.config.js`:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'drive.google.com' },
    { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    { protocol: 'https', hostname: 'i.imgur.com' },   // ← Imgur habilitado
  ],
}
```

Next.js solo permite optimizar imágenes de dominios listados aquí; por eso
`i.imgur.com` funciona de inmediato. Si en el futuro usas otro servicio (por
ejemplo Cloudinary), agrega su dominio en esa misma lista.
