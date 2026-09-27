# Propuesta de alineación entre producto y web

- **Fecha del plan:** 27 de septiembre de 2026.
- **Estado:** Pasos 0–4 implementados en el prototipo; Paso 5 bloqueado por
  P1–P15; verificación del Paso 6 completada para el alcance implementado.
- **Contexto de publicación:** la web es un prototipo y puede mostrar decisiones
  provisionales para evaluar la propuesta. Debe conservarse la trazabilidad de
  ese estado y revisarse antes de convertirla en oferta comercial definitiva.
- **Objetivo:** alinear la web con `knowledge/product/core.md`, hacer visible el
  valor del protocolo y eliminar promesas no documentadas, prohibidas o no
  ofrecidas por HappyHomes.
- **Alcance:** home, servicios, cómo funciona, informe, FAQ, contacto, navegación,
  footer y contenido compartido de producto.
- **Fuera de alcance:** aprobar precios, cobertura, fiscalidad, contratos,
  proveedores, custodia de llaves o capacidades operativas. Este plan no cambia
  el estado de ninguna decisión P1–P15.
- **Fuentes:** `knowledge/product/core.md`, `knowledge/brand/core.md`,
  `knowledge/brand/design.md`, `knowledge/business/pricing-and-economics.md` y la
  implementación actual en `web/src/`.

### Regla editorial del prototipo

- Las decisiones **definidas** y **provisionales** del producto canónico pueden
  representarse en la web para evaluar la propuesta.
- Las decisiones **pendientes** solo se muestran mediante la formulación prudente
  indicada en el canon; no se completan inventando una respuesta.
- Las prestaciones **no ofrecidas** y los claims **prohibidos** no aparecen ni
  siquiera como hipótesis comercial.
- Antes del lanzamiento, P1–P15 determinan qué contenido se confirma, modifica o
  retira. El prototipo no cambia por sí mismo el estado de esas decisiones.

## 1. Conclusión del análisis

La web actual no representa el producto canónico. Conserva la primera
arquitectura comercial —Basic, Standard y Premium con rangos de precio— mientras
el producto propone Lite, Care y Complete. El problema más urgente, sin embargo,
no son los nombres: hay promesas públicas expresamente prohibidas o todavía no
validadas.

Al tratarse de un prototipo, la actualización puede sustituir directamente los
rangos antiguos por Lite a 79 euros, Care a 119 euros y Complete a 229 euros,
como precios mensuales con IVA incluido de la propuesta canónica. P1, P3 y P15
siguen bloqueando su conversión en tarifa comercial definitiva, pero no su uso
en el prototipo. El orden recomendado es:

1. retirar contradicciones y claims prohibidos;
2. trasladar a la web la propuesta de valor definida y el alcance real;
3. explicar el protocolo, el informe y la gestión de incidencias;
4. publicar la comparación canónica de planes y precios para evaluar su
   comprensión;
5. validar o corregir nombres, precios, IVA, anualidad y extras antes del
   lanzamiento comercial.

## 2. Hallazgos principales

### 2.1 Planes y extras

| Web actual | Producto canónico | Acción propuesta |
|---|---|---|
| Basic, Standard y Premium | Lite, Care y Complete, todavía provisionales | Sustituir la oferta antigua por la arquitectura canónica del prototipo. |
| Rangos 59–79, 99–139 y 179–249 euros | 79, 119 y 229 euros provisionales | Mostrar los precios mensuales con IVA incluido y mantener registrada su validación pendiente. |
| “Visita semanal” | Cuatro visitas por mes natural | Usar siempre la unidad inequívoca del canon. |
| “Control de okupación” | Claim prohibido | Eliminar de inmediato. |
| “Respuesta 24h” | Servicio no ofrecido | Eliminar de inmediato. |
| Mantenimiento, jardín y piscina dentro de Premium | Profesionales y trabajos aparte | Mostrar limpieza, jardín y piscina como servicios recurrentes con presupuesto periódico; P14 valida su oferta final. |
| Todos los add-ons presentados como “desde 10 €/mes” | Hay servicios puntuales, tiempo facturable y servicios periódicos | Separar unidad y modalidad de cobro usando el catálogo provisional del canon. |
| Alarma y videovigilancia | No ofrecido en el lanzamiento | Eliminar del catálogo. |

### 2.2 Promesa, proceso y alcance

- “Tu casa siempre lista” sugiere preparación de llegada incluida, pero esta es
  un extra. La promesa principal debe centrarse en cuidado presencial,
  continuidad, revisión e informe.
- “Hablamos con la misma persona siempre” es absoluto. El canon promete un
  Responsable de Casa estable y sustituciones identificadas y registradas.
- “Recibimos tu casa” está formulado de forma confusa y “te damos un juego de
  llaves” invierte la relación. La alta debe explicar cobertura, propuesta,
  ficha, protocolo, acceso y primera programación.
- La web muestra el informe, pero apenas explica qué se revisa, qué requiere
  autorización y qué queda fuera. El protocolo es una oportunidad de confianza
  más fuerte que añadir prestaciones.
- La clasificación de incidencias —crítica, prioritaria y seguimiento— y la
  separación entre observación, decisión y actuación autorizada no se aprovechan
  en la narrativa pública.

### 2.3 Cobertura, idiomas y contacto

- La home, FAQ, contacto, footer y “Sobre nosotros” prometen todo el Alt Empordà
  y una franja de Llançà a Tossa. P2 sigue pendiente. Debe usarse la formulación
  segura: se confirma disponibilidad y condiciones para cada dirección.
- La web anuncia francés, inglés y alemán. El lanzamiento definido parte de
  castellano y catalán; francés e inglés dependen de P11 y alemán no se ofrece.
- FAQ y contacto prometen respuesta en menos de 24 horas y urgencias para
  Premium. El prototipo debe usar en su lugar el horario y los tiempos
  provisionales del canon, sin sugerir atención 24/7.
- El formulario pide un mensaje libre, pero no recoge de forma estructurada los
  datos mínimos para comprobar encaje: municipio o código postal, tipología,
  tamaño aproximado y frecuencia o necesidad.
- El endpoint del formulario y el teléfono siguen siendo placeholders, por lo
  que el flujo no está listo para lanzamiento.

### 2.4 Informe y evidencia

- `/el-informe` es la parte más alineada de la web y debe conservarse como prueba
  principal del servicio.
- La promesa de vídeo continuo sin audio necesita consentimiento expreso y una
  alternativa con fotografías fechadas.
- `VideoProof.astro` afirma que el vídeo puede consultarse durante 15 días. El
  canon establece que se elimina como máximo 15 días después de entregar el
  informe. El prototipo puede mostrar ese plazo provisional, pero debe describir
  correctamente la retención y no convertirla en una ventana de acceso distinta.
- El protocolo y el informe deben usar las mismas doce categorías y los cinco
  estados canónicos para evitar que marketing, operación y entregable describan
  servicios distintos.

## 3. Propuesta de experiencia web

### Home

1. Hero centrado en una persona de referencia, visita e informe; CTA
   `Comprobar disponibilidad`.
2. Muestra del informe, ya existente.
3. Proceso de alta y visita en cuatro pasos reales.
4. Resumen público del protocolo: qué observamos, qué hacemos solo con permiso y
   qué queda fuera.
5. Lite, Care y Complete con una, dos o cuatro visitas por mes natural y sus
   precios mensuales propuestos.
6. Responsable de Casa y sustitución identificada.
7. Cobertura prudente y FAQ de alta intención.

### Servicios

- Convertir la ruta en la explicación comercial completa del alcance.
- Presentar Lite a 79 euros, Care a 119 euros y Complete a 229 euros al mes, con
  IVA incluido, como arquitectura de trabajo del prototipo.
- Tratar Care como la opción recomendada, sin afirmar que sea la más elegida.
- Mantener P1/P3/P15 como puerta para confirmar o corregir esos importes antes de
  que la web pase de prototipo a oferta comercial.
- Añadir una comparación accesible con filas para:
  - visitas por mes natural;
  - Responsable de Casa;
  - protocolo acordado;
  - informe con imágenes;
  - comunicación de incidencias;
  - coordinación incluida o aparte;
  - extras y terceros;
  - permanencia y alta, solo tras validación jurídica.
- Separar con claridad `Incluido`, `Con autorización`, `Presupuesto aparte` y
  `No ofrecido`.

#### Extras y servicios adicionales

Reservar una sección propia inmediatamente después de la comparación de planes.
No debe ser una nube de etiquetas: cada servicio necesita nombre, modalidad de
cobro, precio o estado de presupuesto, alcance breve y exclusión principal.

**Servicios puntuales o por tiempo:**

| Servicio | Unidad provisional del prototipo | Precio canónico provisional |
|---|---|---:|
| Visita visual extraordinaria | Por visita | 59 € |
| Visita tras temporal o aviso | Por visita priorizada | 69 € |
| Apertura y cierre a profesional | Por acceso, hasta 15 min | 39 € |
| Acompañamiento de profesional | Primera hora | 59 € |
| Tiempo adicional de acompañamiento | Cada 30 min | 29 € |
| Preparación previa a llegada | Por servicio | Desde 59 € |
| Entrega o recogida de llaves | Por servicio | 39 € |
| Compra de bienvenida | Por encargo | 25 € + compra |
| Coordinación adicional | Por hora, en bloques de 30 min | 39 €/hora |
| Supervisión visual de obra | Por visita | Desde 99 € |

**Servicios recurrentes o presupuestados:**

- limpieza periódica;
- cuidado de jardín;
- cuidado de piscina.

Estos tres servicios deben reservar espacio para una futura cuota mensual o
frecuencia acordada, pero mientras no exista una unidad canónica concreta se
muestran como `Presupuesto periódico`. La ficha debe aclarar que el profesional,
los materiales y consumibles no se presumen incluidos en el precio de
HappyHomes.

La sección termina con una nota común:

> Confirmamos tareas, disponibilidad y precio antes de actuar. Los materiales y
> facturas de profesionales externos se indican por separado.

CTA: `Consultar un servicio adicional`.

### Cómo funciona

Crear `/como-funciona` para explicar el recorrido completo:

1. consulta con municipio, tipología y tamaño aproximado;
2. confirmación de cobertura y propuesta;
3. alta, ficha de vivienda, acceso y protocolo acordado;
4. visita visual y preventiva;
5. informe y aviso según prioridad;
6. decisión del propietario y coordinación, cuando se autorice.

La página debe incluir una versión comprensible de la matriz provisional del
protocolo, distinguiendo lo estándar, lo autorizado y lo excluido. P7 bloquea su
conversión en compromiso operativo definitivo, no su representación en el
prototipo.

### Informe, FAQ y contacto

- Mantener `/el-informe`, pero alinear terminología, estados y retención con P8.
- Sustituir la FAQ actual por las respuestas canónicas de `product/core.md`
  ampliadas con cobertura, altas, extras y límites ya definidos.
- Transformar contacto en una solicitud de encaje, sin pedir dirección completa
  ni información sensible en el primer paso.

## 4. Copy recomendado para planes en el prototipo

> **El mismo cuidado, con la frecuencia que tu casa necesita.**
>
> Todas las visitas siguen el protocolo acordado y generan un informe con
> imágenes. La diferencia principal es cuántas veces pasamos por tu casa y el
> alcance de coordinación confirmado en tu propuesta.

- **Lite · 79 €/mes, IVA incluido.** Una visita al mes natural para una vivienda
  que necesita una comprobación periódica documentada.
- **Care · 119 €/mes, IVA incluido.** Dos visitas al mes natural y hasta 15
  minutos mensuales de coordinación remota. Es la propuesta principal de
  HappyHomes, no “la más elegida”.
- **Complete · 229 €/mes, IVA incluido.** Cuatro visitas al mes natural, hasta 30
  minutos mensuales de coordinación remota y resumen trimestral, sin presentarlo
  como vigilancia permanente o visita semanal garantizada.

CTA común: `Comprobar disponibilidad y propuesta`.

Nota de alcance:

> Las visitas son visuales y preventivas. Los trabajos técnicos, reparaciones,
> materiales, profesionales y desplazamientos extraordinarios se presupuestan
> aparte. Confirmamos cobertura, alcance y condiciones antes de activar el
> servicio.

Los precios se muestran para evaluar la propuesta del prototipo. Antes del
lanzamiento deben confirmarse o modificarse en el producto canónico tras cerrar
P1, P3 y P15.

## 5. Puertas de publicación

| Contenido | Puede prepararse ahora | Requisito antes de publicarlo como condición definitiva |
|---|---|---|
| Naturaleza visual y preventiva | Sí | Aprobación final de claims de §14. |
| Responsable de Casa con sustitución identificada | Sí, como prototipo | P9 y aprobación de claims. |
| Matriz detallada del protocolo | Sí, como propuesta provisional | P7 antes de convertirla en compromiso operativo. |
| Vídeo o fotografías | Sí, condicionado | P8, acuerdo y almacenamiento. |
| 1, 2 o 4 visitas | Sí, como propuesta | P1/P3 y aprobación comercial. |
| 79, 119 y 229 euros | Sí, en el prototipo | P1, P3 y P15 antes de convertirlos en tarifa comercial. |
| Anual, 12 meses por el precio de 10 | Sí, si se decide probarla | P4 y P5 antes del lanzamiento. |
| Custodia incluida | Sí, como propuesta provisional | P6 antes del lanzamiento. |
| Municipios concretos | No | P2. |
| SLA y horario provisionales | Sí | P10 antes del lanzamiento. |
| Francés e inglés | No | P11. |
| Alemán | No ofrecido | Cambio explícito del producto canónico. |
| Precios de extras | Sí, como propuesta provisional | P14 y P15 antes del lanzamiento. |

## Paso 0 — corregir riesgo editorial

- **Estado:** implementado.
- **Dependencias:** aprobación de esta propuesta.
- **Archivos afectados:** `web/src/pages/index.astro`,
  `web/src/pages/servicios.astro`, `web/src/pages/faq.astro`,
  `web/src/pages/contacto.astro`, `web/src/pages/sobre-nosotros.astro`,
  `web/src/components/Footer.astro`, `web/src/components/VideoProof.astro` y
  `web/src/layouts/Base.astro`.

- **T001.** Eliminar claims prohibidos: ocupación, seguridad, alarma,
  videovigilancia, urgencias 24/7 e inclusión de mantenimiento técnico.
- **T002.** Sustituir cobertura absoluta por la formulación prudente de §3.3.
- **T003.** Retirar alemán y no anunciar francés o inglés hasta cerrar P11.
- **T004.** Matizar Responsable de Casa, preparación de llegada, detección de
  incidencias y coordinación de terceros.
- **T005.** Sustituir SLA, forma de pago, cancelación, llaves y retención actuales
  por las propuestas provisionales del canon; retirar cualquier seguro o
  condición que no esté documentada.

### Criterios de aceptación

- No queda ningún claim de las listas prohibidas de §14.3.
- Ninguna ruta publica cobertura, idiomas, horario o respuesta ajenos al canon.
- La corrección solo introduce los precios de plan ya registrados en el producto
  canónico; no inventa prestaciones.

## Paso 1 — establecer una fuente web única

- **Estado:** implementado.
- **Dependencias:** Paso 0.
- **Archivos afectados:** nuevo `web/src/data/product.ts` o nombre equivalente;
  páginas y componentes que consuman planes, cobertura, idiomas, FAQ y alcance.

- **T006.** Crear un módulo de contenido público trazado a las secciones del
  producto canónico.
- **T007.** Modelar prestaciones como `incluido`, `autorizado`, `aparte`,
  `pendiente` o `no-ofrecido`, sin depender solo de iconos o color.
- **T008.** Modelar precio, periodicidad, IVA y estado de validación; mostrar los
  precios canónicos en el prototipo y conservar la puerta P1/P3/P15.
- **T009.** Eliminar duplicación de planes, cobertura, idiomas y FAQ entre home,
  servicios, contacto y footer.

### Criterios de aceptación

- Una modificación de contenido compartido se refleja en todas las rutas.
- Los estados internos pendientes no se convierten automáticamente en copy
  público.
- No existe una segunda definición de producto dentro de componentes Astro.

## Paso 2 — reconstruir planes y alcance

- **Estado:** implementado.
- **Dependencias:** Paso 1; P1/P3/P15 bloquean la tarifa comercial definitiva,
  no la representación en el prototipo.
- **Archivos afectados:** `web/src/pages/servicios.astro`,
  `web/src/pages/index.astro`, `web/src/components/PlanGrid.astro`,
  `web/src/components/PlanCard.astro`, `web/src/components/AddOnList.astro` y
  posibles nuevos `PlanComparison.astro`, `ExtrasSection.astro` y
  `ScopeNote.astro`.

- **T010.** Sustituir Basic/Standard/Premium por Lite 79 €, Care 119 € y Complete
  229 €, con IVA incluido y una, dos o cuatro visitas por mes natural.
- **T011.** Adaptar las tarjetas para explicar alcance común, coordinación y
  diferencias reales entre planes.
- **T012.** Crear una tabla accesible de comparación con incluido, aparte y no
  ofrecido.
- **T013.** Sustituir la lista genérica de add-ons por una sección estructurada
  que separe servicios puntuales, tiempo facturable y servicios recurrentes;
  mostrar unidad y precio provisional cuando existan, reservar `Presupuesto
  periódico` para limpieza, jardín y piscina, diferenciar trabajo de HappyHomes,
  terceros y materiales, y eliminar servicios no ofrecidos.
- **T014.** Conservar frecuencia o plan de interés al llegar al formulario, sin
  incluir datos personales en la URL.

### Criterios de aceptación

- La web muestra los precios canónicos del prototipo y elimina los rangos
  antiguos.
- Las visitas se expresan por mes natural.
- Reparaciones, materiales, profesionales y esperas quedan claramente aparte.
- Cada extra indica si se cobra por servicio, visita, hora, bloque de tiempo o
  presupuesto periódico; ninguno parece incluido automáticamente en la cuota.
- El plan de mayor frecuencia no parece conserjería ilimitada ni vigilancia.

## Paso 3 — hacer visible el protocolo y la experiencia

- **Estado:** implementado.
- **Dependencias:** Paso 1; P7 para convertir la matriz detallada en compromiso
  operativo definitivo.
- **Archivos afectados:** nuevo `web/src/pages/como-funciona.astro`, nuevos
  componentes de protocolo y proceso, `web/src/pages/index.astro`,
  `web/src/pages/el-informe.astro`, `web/src/components/HowItWorks.astro` y
  `web/src/components/VisitReportDemo.astro`.

- **T015.** Crear `/como-funciona` con consulta, alta, visita, informe e
  incidencia.
- **T016.** Publicar la matriz provisional del protocolo con categorías, acciones
  autorizadas y exclusiones, sin presentarla como validada en viviendas piloto.
- **T017.** Alinear las categorías y estados entre protocolo, ejemplo de informe
  y formulario operativo de visita.
- **T018.** Añadir una explicación de prioridades de incidencia sin prometer
  diagnóstico ni plazo no aprobado.
- **T019.** Revisar la promesa de evidencia y expresar los 15 días como plazo
  máximo provisional de retención desde la entrega del informe.

### Criterios de aceptación

- Una persona entiende qué ocurre antes, durante y después de una visita.
- Se distingue observación visual, comprobación autorizada y trabajo excluido.
- Protocolo, informe y operación usan el mismo vocabulario.

## Paso 4 — actualizar FAQ, contacto y navegación

- **Estado:** implementado.
- **Dependencias:** Pasos 0–3; P12/P13 para activar captación real.
- **Archivos afectados:** `web/src/pages/faq.astro`,
  `web/src/pages/contacto.astro`, `web/src/components/ContactForm.astro`,
  `web/src/components/Header.astro` y `web/src/components/Footer.astro`.

- **T020.** Sustituir FAQ por respuestas canónicas y objeciones coherentes con el
  alcance publicado.
- **T021.** Pedir municipio o código postal, tipología, tamaño aproximado,
  frecuencia o necesidad, nombre y email; mantener teléfono opcional.
- **T022.** No pedir dirección completa, acceso, llaves ni periodos de ausencia
  en la consulta inicial.
- **T023.** Explicar el siguiente paso usando el horario y SLA provisionales del
  canon, manteniendo P10 como validación previa al lanzamiento.
- **T024.** Incorporar “Cómo funciona” y “El informe” a la navegación sin perder
  claridad en móvil.

### Criterios de aceptación

- El formulario recoge lo necesario para evaluar cobertura y encaje.
- No solicita datos sensibles prematuramente.
- FAQ, contacto, navegación y footer no contradicen servicios.

## Paso 5 — preparar el paso de prototipo a oferta comercial

- **Estado:** bloqueado por P1–P15 según la tabla de puertas.
- **Dependencias:** actualización previa de `knowledge/product/core.md`.
- **Archivos afectados:** módulo de producto compartido y rutas comerciales.

- **T025.** Confirmar, modificar o retirar los precios prototipados al cerrar
  P1/P3/P15 antes del lanzamiento comercial.
- **T026.** Confirmar, modificar o retirar la modalidad anual prototipada al
  cerrar P4/P5.
- **T027.** Confirmar, modificar o retirar custodia, extras, idiomas, cobertura y
  tiempos al cerrar sus decisiones correspondientes.
- **T028.** Revisar cada claim público contra §14 antes del despliegue comercial.

### Criterios de aceptación

- Cada condición publicada apunta a una decisión definida y aprobada.
- Precio, IVA, alcance, cancelación y extras son coherentes en todas las rutas.
- No queda contenido provisional presentado como promesa definitiva.

## Paso 6 — verificación

- **Estado:** completado para los Pasos 0–4.
- **Dependencias:** trabajo ejecutado.
- **Archivos afectados:** todos los anteriores; sin editar `web/dist/` ni
  `web/.astro/`.

- **T029.** Ejecutar una búsqueda de claims antiguos y prohibidos en `web/src/`.
- **T030.** Verificar navegación, tablas, acordeones y formulario con teclado y
  lector de pantalla.
- **T031.** Revisar 375, 768, 1440 y 1920 px, zoom al 200 % y ausencia de scroll
  horizontal.
- **T032.** Ejecutar axe o auditoría equivalente y revisar contraste.
- **T033.** Ejecutar `pnpm --filter happy-homes-web build` y
  `git diff --check`.
- **T034.** Comparar el contenido final con P1–P15 y registrar cualquier bloqueo
  que permanezca.

### Registro de verificación

- `pnpm --filter happy-homes-web build`: correcto; nueve rutas generadas.
- `git diff --check`: correcto.
- Búsqueda en `web/src/`: sin nombres, rangos de precio ni claims prohibidos de
  la oferta anterior.
- Axe: cero violaciones en `/`, `/servicios`, `/como-funciona`, `/el-informe`,
  `/faq` y `/contacto` a 375, 768, 1440 y 1920 px.
- Responsive: sin scroll horizontal de página y con un único `h1` en las 24
  combinaciones anteriores. La comparación conserva desplazamiento horizontal
  dentro de una región de tabla identificada y enfocable en móvil. Se revisaron
  además las seis rutas a 720 px como aproximación al reflow de 1440 px con zoom
  del 200 %, sin desbordamiento ni objetivos interactivos menores de 44 px.
- Teclado: skip link, menú móvil, acordeones, tabla y validación del formulario
  son accesibles; el formulario mueve el foco al primer error.
- Lighthouse Accessibility en `/servicios`: 100. No se registra rendimiento
  sobre `astro dev`; debe medirse contra preview estático siguiendo
  `knowledge/workflow/web-verification.md` cuando el puerto reservado 11002 esté
  libre.
- Permanecen abiertos P1–P15 conforme a sus estados canónicos. Formspree y la URL
  pública del sitio siguen siendo placeholders y bloquean el despliegue real.

## 6. Orden recomendado

1. Aprobar e implementar el Paso 0 como corrección editorial urgente.
2. Crear la fuente única del Paso 1.
3. Ejecutar juntos los Pasos 2 y 3 para que planes y protocolo cuenten una misma
   historia.
4. Actualizar conversión y navegación en el Paso 4.
5. Mantener el lanzamiento comercial bloqueado por el Paso 5, aunque el
   prototipo muestre la propuesta.
6. Aplicar el Paso 6 en cada entrega, no solo al final.

## 7. Resultado esperado

La web dejará de vender una combinación ambigua de vigilancia, mantenimiento y
conserjería. Explicará un producto más defendible y diferenciador: una persona de
referencia, visitas visuales consistentes, un protocolo acordado, evidencia e
informes que permiten decidir el siguiente paso. Los planes mostrarán los precios
canónicos provisionales para probar la propuesta, sin confundirlos con una tarifa
comercial ya validada.
