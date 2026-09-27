# Verificación de la web

Procedimiento canónico para revisar la web Astro localmente. Evita arrancar
servidores duplicados, medir rendimiento sobre el modo de desarrollo o depender
de comandos recordados de otra sesión.

## 1. Entorno

- Ejecutar desde la raíz del repositorio.
- Usar Node `v24.21.0` y `pnpm@12.5.1`.
- El servidor de desarrollo canónico es `http://127.0.0.1:11001/`.
- El puerto reservado para un preview estático es `11002`. No usar otro puerto
  silenciosamente si ya está ocupado.
- Los informes temporales se guardan en `/tmp/opencode/`, no en el repositorio.

## 2. Reutilizar el servidor de desarrollo

Antes de arrancar nada, comprobar si el servicio con autoreload ya responde:

```sh
curl --fail --silent --show-error --output /dev/null \
  http://127.0.0.1:11001/
```

Si el comando termina correctamente, reutilizar ese servidor para revisión
visual, Playwright, responsive, teclado y accesibilidad. No arrancar otro proceso.

Solo si no responde:

```sh
pnpm --filter happy-homes-web dev
```

El modo `dev` incluye herramientas y transformaciones de desarrollo. Sirve para
funcionalidad y accesibilidad, pero **no es una medición válida de rendimiento**.

## 3. Gate de build

```sh
pnpm --filter happy-homes-web build
git diff --check
```

No editar `web/dist/` ni `web/.astro/`. No usar `astro check` hasta que sus
dependencias estén declaradas y el repositorio deje de solicitar una instalación
interactiva.

## 4. Preview estático para Lighthouse

Lighthouse de rendimiento debe ejecutarse contra `web/dist/`, servido por
`astro preview`, nunca contra el servidor `dev`.

### 4.1 Comprobar que el puerto está libre

```sh
node -e "const net=require('node:net');const s=net.createServer();s.once('error',()=>process.exit(1));s.once('listening',()=>s.close());s.listen(11002,'127.0.0.1')"
```

Si falla, el puerto ya está ocupado: no lanzar preview, no matar el proceso y no
permitir que Astro salte automáticamente a 11003. Identificar el bloqueo o usar
la URL del despliegue estático autorizado.

### 4.2 Arrancar y comprobar el preview

```sh
pnpm --filter happy-homes-web exec astro preview \
  --background --host 127.0.0.1 --port 11002
curl --fail --silent --show-error --output /dev/null \
  http://127.0.0.1:11002/
```

Detenerlo al terminar:

```sh
pnpm --filter happy-homes-web exec astro preview stop
```

## 5. Lighthouse

Versión canónica mientras no exista una dependencia fijada en el workspace:
`lighthouse@12.8.2`.

Ejemplo de auditoría de escritorio:

```sh
pnpm dlx lighthouse@12.8.2 http://127.0.0.1:11002/servicios \
  --preset=desktop \
  --output=json \
  --output-path=/tmp/opencode/lighthouse-servicios-desktop.json \
  --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage' \
  --quiet
```

Ejemplo móvil: omitir `--preset=desktop` y cambiar el nombre del resultado.

Extraer las puntuaciones sin depender de la interfaz de Lighthouse:

```sh
node -e "const r=require('/tmp/opencode/lighthouse-servicios-desktop.json');for(const k of ['performance','accessibility','best-practices','seo'])console.log(k,Math.round(r.categories[k].score*100))"
```

Umbrales del prototipo:

- Accessibility: `>= 95`; objetivo normal `100`.
- Best Practices: `>= 95`.
- SEO: `>= 95` en rutas indexables.
- Performance: `>= 90` contra preview estático o despliegue. Una medición sobre
  `dev` se descarta y no se usa para abrir trabajo de optimización.

Auditar como mínimo `/`, `/servicios`, `/como-funciona` y `/contacto` cuando
cambien estructura, conversión o assets. Para un cambio localizado basta la ruta
afectada y una ruta que comparta el componente.

## 6. Accesibilidad y dispositivos

Matriz mínima:

- 375 px, 768 px, 1440 px y 1920 px;
- equivalente a zoom del 200 %;
- teclado completo, incluidos menú móvil, acordeones y formulario;
- objetivos táctiles de al menos 44 × 44 px;
- ausencia de scroll horizontal de página;
- movimiento reducido;
- modo de ahorro de datos cuando cambie el hero audiovisual.

Lighthouse Accessibility es el gate automatizado reproducible actual. Una
ejecución adicional de axe puede usarse desde el navegador o Playwright, pero no
debe documentarse con rutas internas de una caché `pnpm dlx`. Si se incorpora un
script de axe al repositorio, debe fijar su versión, auditar las rutas anteriores
y actualizar este documento con un único comando reproducible.

Los elementos con `data-reveal` tienen transiciones de opacidad. Antes de una
auditoría programática se debe esperar a que termine la transición o activar
`prefers-reduced-motion`; de lo contrario axe puede reportar falsos positivos de
contraste durante el fundido.

## 7. Fondos audiovisuales

El contraste sobre vídeo puede quedar como `incomplete` en herramientas
automáticas. En ese caso:

1. conservar el velo definido por `--hero-media-overlay`;
2. revisar los fotogramas más oscuros y claros de ambos clips;
3. comprobar texto, botones y control de pausa;
4. documentar la relación de contraste calculada y la inspección visual;
5. no interpretar un resultado `incomplete` como aprobado automáticamente.

## 8. Resultado que debe registrarse

Al cerrar una tarea web, indicar:

- comando de build y resultado;
- rutas y viewports revisados;
- puntuaciones Lighthouse realmente ejecutadas y URL auditada;
- violaciones de accesibilidad encontradas o cero violaciones;
- riesgos o checks manuales pendientes;
- cualquier gate no ejecutado y su motivo.
