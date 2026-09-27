# Registro de medios del hero

- **Estado:** seleccionados e integrados para revisión final.
- **Fecha:** 27 de septiembre de 2026.
- **Uso:** fondo decorativo de la home; nunca representa una vivienda atendida
  por HappyHomes ni confirma cobertura en una dirección concreta.
- **Modelo seleccionado:** `kwaivgi/kling-v3.0-std`.
- **Configuración:** 12 segundos, 720p, 16:9, primer fotograma de referencia y
  sin audio.

Los inputs y maestros de generación son material local temporal y están
excluidos de Git. La procedencia, el fotograma de entrada, el prompt, los
parámetros y los hashes necesarios para auditar cada generación se conservan en
este registro. El sitio depende exclusivamente de los derivados públicos
enumerados abajo.

## Cadaqués · `hero-coast-cadaques-v1`

- **Fuente:** [An aerial view of a city by the ocean](https://unsplash.com/photos/an-aerial-view-of-a-city-by-the-ocean-XL5cZwZQmt0).
- **Identificador:** `XL5cZwZQmt0`.
- **Fotógrafa:** [Jametlene Reskp](https://unsplash.com/@reskp).
- **Localización declarada:** Cadaqués, España.
- **Licencia observada:** descarga gratuita bajo Unsplash License; no aparecía
  marcada como Plus ni premium.
- **Original revisado:** 4032 × 2268 px, 2.636.050 bytes, SHA-256
  `e1adb9556a28b0ae581429761879bda6ada59eababbc4e1f07c53c7554850e45`.
- **Fotograma de entrada temporal:** recorte central 16:9 del original, JPEG de
  1280 × 720 px, 300.098 bytes, SHA-256
  `b9ed7bfd28892827165a2e6d2438e18db6bf063e814ecbb0259263525cd442a9`.
- **Generación Kling:** trabajo
  `gen-vid-1790525397-3SjANTAxiPYf6OyBBNnE`, 12,041667 s, 1280 × 720,
  24 fps, H.264, sin audio, 30.591.229 bytes, coste reportado 1,008 USD y
  SHA-256 del maestro
  `fcda607d79dd85408b29eb3bdee0c21c2d457c6e3f161e3e94994cac87171051`.

### Prompt de generación de Cadaqués

```text
Use the supplied image as the exact first frame. Create one continuous
12-second photorealistic 16:9 aerial coastal shot of Cadaqués with a calm,
understated Mediterranean mood. Preserve the recognizable bay, white village,
terracotta roofs, shoreline, hills, boats, architecture, perspective, daylight,
and natural color relationships of the source image.

Introduce restrained but clearly perceptible motion: a very slow, stabilized
drone glide forward and slightly to the right, covering only a small distance,
with realistic parallax between the nearest roofs, village, boats, and distant
headland. Add gentle sea ripples and sunlight shimmer. Moored boats may bob and
turn almost imperceptibly around their anchors; masts must remain straight and
stable. Any visible vegetation may move lightly in a coastal breeze. Keep the
horizon level and the overall exposure stable. No audio.

Do not add, remove, multiply, or redesign buildings, roofs, chimneys, boats,
roads, shoreline, hills, or vegetation. No people, close-up figures, birds,
vehicles, text, signs, logos, or watermarks. No fast drone movement, orbit,
zoom, tilt, rolling horizon, dramatic waves, moving boats crossing the bay,
time-lapse, changing weather, morphing, warped architecture, bending masts,
flicker, pulsing water, lens flare, oversaturation, artificial depth effects,
or cinematic spectacle.
```

## Tossa de Mar · `hero-coast-tossa-v1`

- **Fuente:** [Aerial photo of cliff during daytime](https://unsplash.com/photos/aerial-photo-of-cliff-during-daytime-DgE-BlRLKUU).
- **Identificador:** `DgE-BlRLKUU`.
- **Fotógrafo:** [Joshua Kettle](https://unsplash.com/@joshuakettle).
- **Localización declarada:** Costa Brava, Tossa de Mar, Cataluña.
- **Licencia observada:** descarga gratuita bajo Unsplash License; no aparecía
  marcada como Plus ni premium.
- **Original revisado:** 4000 × 3000 px, 3.709.943 bytes, SHA-256
  `56311126ad4bb54cccda29ae5b1b555b2b4d30c8f29535f464a91230b1f9e0fa`.
- **Fotograma de entrada temporal:** recorte central 16:9 del original, JPEG de
  1280 × 720 px, 355.020 bytes, SHA-256
  `ed20b757dd26a163541415e885593ef78836ca6e499f37648589559cd9b88b35`.
- **Generación Kling:** trabajo
  `gen-vid-1790525566-n7lo1azssFb0Ua9iUtbH`, 12,041667 s, 1280 × 720,
  24 fps, H.264, sin audio, 35.185.430 bytes, coste reportado 1,008 USD y
  SHA-256 del maestro
  `1994a1dd3c50d0625a0bf8c554cbd2593fce87190f075abebf5beb8f8199122d`.

### Prompt de generación de Tossa de Mar

```text
Use the supplied image as the exact first frame. Create one continuous
12-second photorealistic 16:9 aerial coastal shot of Tossa de Mar with a calm,
warm Mediterranean mood. Preserve the recognizable cliff, pine trees, rocky
shoreline, sea, hillside buildings, paths, perspective, sunset direction, and
natural color relationships of the source image.

Introduce restrained but clearly perceptible motion: a very slow, stabilized
drone glide forward and slightly along the coastline, covering only a small
distance, with realistic parallax between the foreground vegetation, cliff,
buildings, and distant sea. Add gentle water movement against the rocks and
subtle ripples across the sea. The lightest pine branches may move softly in a
coastal breeze. Keep the horizon level, the sun fixed, and exposure stable. No
audio.

Do not add, remove, multiply, or redesign buildings, terraces, paths, trees,
rocks, shoreline, or vegetation. No people, close-up figures, birds, boats,
vehicles, text, signs, logos, or watermarks. No fast drone movement, orbit,
zoom, tilt, rolling horizon, dramatic waves, time-lapse, changing weather,
morphing, warped cliffs or buildings, flicker, pulsing vegetation, expanding
sun, exposure pumping, new lens flare, oversaturation, artificial depth
effects, or cinematic spectacle.
```

## Derivados publicados

| Archivo | Uso | Dimensiones | Peso | SHA-256 |
|---|---|---:|---:|---|
| `web/public/media/hero/hero-coast-cadaques-v1-desktop.mp4` | Clip 1, escritorio | 1280 × 720 | 1.835.308 B | `c9814d5171ad6e784d5e6be3b0a1bd4562c438b354d17b9df41151b98de0426d` |
| `web/public/media/hero/hero-coast-cadaques-v1-mobile.mp4` | Clip 1, móvil | 540 × 960 | 801.263 B | `8b9511e83b9561d4505813ab1e79fefce35dcbc5b52ad9bdf35801696fa4ffba` |
| `web/public/media/hero/hero-coast-tossa-v1-desktop.mp4` | Clip 2, escritorio | 1280 × 720 | 2.121.679 B | `5ae03126fa23d10acedb621ef1612a752fcf36f5ac0d153a39fddc26ea4a957c` |
| `web/public/media/hero/hero-coast-tossa-v1-mobile.mp4` | Clip 2, móvil | 540 × 960 | 1.039.203 B | `239e0c89a1f32871ccb4f34ce598d884a142643083e57e9e8a32303e6a3f9943` |
| `web/public/media/hero/hero-coast-cadaques-v1-desktop.avif` | Póster moderno, escritorio | 1280 × 720 | 96.539 B | `c6246f064dbb4c1b3cd4495450c8bf1bc746fa629d6d968677f2dbc3588434c3` |
| `web/public/media/hero/hero-coast-cadaques-v1-desktop.jpg` | Póster fallback, escritorio | 1280 × 720 | 139.186 B | `bec54b5ded6cfbba187f1cc90ecc439474d82cab27bc9b7b3b3600a7f8091a6f` |
| `web/public/media/hero/hero-coast-cadaques-v1-mobile.avif` | Póster moderno, móvil | 540 × 960 | 36.387 B | `d2577806800e1ba406f42e808eb87bb12f5d2d4bcd6f47ad6465b795d4bfd684` |
| `web/public/media/hero/hero-coast-cadaques-v1-mobile.jpg` | Póster fallback, móvil | 540 × 960 | 72.532 B | `8f37ae961ebddfa53a82dfce53631340c9b345f77af2a7785cb9e189ff2234bb` |

Los MP4 públicos usan H.264 High, `yuv420p`, fast start, 24 fps y no contienen
pista de audio. Los recortes móviles son verticales y centran la costa para
evitar descargar y recortar en el navegador el archivo de escritorio.

### Parámetros de procesado

- Vídeo de escritorio: escala Lanczos a 1280 × 720, `libx264`, preset `slow`,
  CRF 30, perfil High, nivel 4.0, `yuv420p`, etiqueta `avc1` y fast start.
- Vídeo móvil: recorte central 405 × 720, escala Lanczos a 540 × 960,
  `libx264`, preset `slow`, CRF 31, perfil High, nivel 4.0, `yuv420p`, etiqueta
  `avc1` y fast start.
- Póster JPEG de escritorio: recorte central 1280 × 720, metadatos eliminados y
  calidad 54. Póster JPEG móvil: recorte central 540 × 960, metadatos eliminados
  y calidad 60.
- Póster AVIF: `libaom-av1`, CRF 38, imagen fija y `yuv420p` a partir del recorte
  correspondiente.

## Tratamiento e interacción

- El primer póster aparece en el HTML inicial y permanece como experiencia
  completa sin JavaScript, con movimiento reducido, ahorro de datos, conexión
  lenta o error de reproducción.
- Los clips alternan con un fundido de 900 ms y se cargan de forma progresiva:
  el segundo empieza a descargarse después de iniciar el primero.
- Un velo crudo semitransparente, basado en el mismo color de la sección de
  planes, reduce el contraste del paisaje para estabilizar la lectura.
- El control visible permite pausar y reanudar; la pausa se recuerda durante la
  sesión.
- La ilustración original continúa disponible en `Hero.astro` como reversión.

## Dirección descartada

El prototipo previo de fachada de Ibiza y el encuadre en columna se descartaron
por falta de presencia y exceso de estatismo. No quedan derivados públicos ni
configuración activa de esa propuesta.
