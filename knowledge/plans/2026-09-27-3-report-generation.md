# Plan para generar borradores de informes de visita

- **Fecha del plan:** 27 de septiembre de 2026
- **Estado:** en ejecución; no aprobado para procesar datos de clientes
- **Avance actual:** especificación y Apps Script del formulario piloto
  implementados localmente; pendientes de instalar y validar en Google con datos
  ficticios
- **Alcance:** contrato de datos del informe, fixtures ficticios, renderizado
  determinista, procedimiento operativo, skill de generación y validación local
- **Objetivo:** transformar un checklist y anotaciones de una visita en un
  borrador estructurado, trazable y revisable que alimente las plantillas HTML
  con vídeo o fotografías.
- **Dependencias:** protocolo P7 y evidencia P8 de
  [`../product/core.md`](../product/core.md), una persona responsable de revisar
  cada informe y las plantillas standalone ya disponibles.
- **Condición para datos reales:** no utilizar direcciones, códigos de acceso,
  llaves, imágenes interiores ni anotaciones de clientes hasta aprobar
  proveedor, almacenamiento, acceso y tratamiento de datos. Esta condición se
  resolverá junto al trabajo posterior de protección de informes.
- **Fuera de alcance:** autenticación robusta, URLs privadas, portal, envío al
  propietario, almacenamiento definitivo de medios reales, generación de PDF,
  publicación automática y diagnóstico técnico asistido por IA. El piloto puede
  subir archivos ficticios a Drive para validar el flujo.

## Resultado esperado

El sistema recibe una entrada estructurada y notas complementarias, genera un
JSON conforme a una versión explícita del esquema, muestra advertencias y deja
el informe en estado `draft`. Un componente Astro convierte ese JSON en la
variante fotográfica o de vídeo. Una persona debe revisar y aprobar el contenido
antes de cualquier entrega.

```text
Checklist + notas + referencias de evidencia
                    ↓
          normalización asistida
                    ↓
       JSON versionado + advertencias
                    ↓
         validación determinista
                    ↓
          revisión humana obligatoria
                    ↓
        plantilla HTML de previsualización
```

La IA redacta y organiza; no determina hechos ausentes, no diagnostica, no
autoriza gastos y no publica.

## Principios de implementación

1. El JSON es la fuente de verdad del informe; la IA no genera HTML.
2. El renderizado HTML es determinista y compartido por ambas modalidades.
3. Cada afirmación generada conserva una referencia a la anotación de origen.
4. Un dato ausente produce una advertencia o `No revisado`, nunca una invención.
5. Las reglas críticas se validan con código, no solo mediante instrucciones al
   modelo.
6. Los informes reales nunca se guardan en Git.
7. Una salida del generador siempre es un borrador pendiente de revisión humana.

## Dirección propuesta para recopilar los datos

La persona visitante debe completar un formulario estructurado desde el móvil,
no redactar el informe en Word o Google Docs. El formulario registra hechos y
selecciones; la IA normaliza después la redacción.

Para el piloto se parte de una **cuenta personal de Google** y una carpeta de
Drive compartida con el socio. No existe la administración de dominio propia de
Google Workspace: la cuenta creadora conserva la propiedad, el socio recibe
acceso de edición mediante la carpeta y las capacidades reales de restricción a
respondedores deben comprobarse en esa cuenta antes de usar datos reales.

La dirección operativa acordada para el piloto es generar **un formulario por
visita y código de casa** desde una plantilla maestra definida en código. Cada
formulario se nombra, por ejemplo, `HH-024 · Visita 008 · 2026-09-24`, queda
registrado en una hoja índice,
se guarda en la carpeta compartida y permanece abierta hasta que el informe sea
aprobado. El acceso requiere una cuenta Google y registra el email de quien
responde. Esto reduce la introducción manual de metadatos, pero deberá reevaluarse
si el volumen convierte la gestión de formularios en una carga.

El formulario puede recibir más de una respuesta para permitir correcciones. Cada
envío se conserva como una revisión numerada; no se sobrescribe la respuesta
anterior y la hoja índice indica cuál es el borrador vigente. El formulario se
cierra manualmente desde la hoja de control cuando el informe queda aprobado.

Configuración acordada para el prototipo:

- carpeta compartida de Drive con ID
  `1X97gnQtXLxOnIedfmg9A7gGwSIwLJWKg`;
- códigos de casa con formato `HH-001`, `HH-002`, etc.;
- hoja de control `HappyHomes · Control de visitas`;
- respondedores identificados mediante login y email;
- usuarios operativos sincronizados desde quienes tengan permiso de edición en
  la carpeta, sin mantener inicialmente una segunda lista manual.

La pertenencia a la carpeta se comprueba al procesar la respuesta. Con una cuenta
personal de Google esto aporta control operativo y trazabilidad, pero no sustituye
una protección previa robusta: una respuesta de un email no autorizado se marca y
no se convierte en informe.

En cuentas personales, el servicio integrado de Apps Script activa la recogida de
email como entrada escrita y no garantiza por sí solo una identidad verificada.
El prototipo crea una plantilla maestra cerrada: la persona propietaria selecciona
una vez `Recopilar direcciones de correo → Verificado`, confirma el paso en la
hoja y solo entonces el script permite copiarla para una visita. El código no
puede comprobar automáticamente que este ajuste siga activo.

La plantilla incorpora manualmente una pregunta de subida porque las API de
Google Forms no permiten crear ese tipo de pregunta. Admite vídeo e imágenes y
queda opcional: la primera respuesta debe aportar evidencia, pero una corrección
posterior puede heredar los archivos ya almacenados sin volver a subirlos. La
cuenta personal y su cuota compartida de Drive son suficientes para archivos
ficticios del piloto, no constituyen aprobación del almacenamiento real.

Mientras no exista un proveedor aprobado, la alternativa es un formulario local
que exporte JSON sin enviar datos a un servidor. Word o Google Docs pueden servir
como apoyo para revisar texto, pero no como fuente principal porque no garantizan
campos, estados ni validación consistentes.

La interacción prioriza opciones, botones, desplegables y casillas. El texto
libre se reserva para observaciones, motivos de un punto no revisado, actuaciones
y decisiones que no puedan expresarse mediante opciones cerradas.

El formulario piloto se organiza en:

1. identificación mediante código de casa, nunca dirección completa;
2. fecha, responsable, entrada y salida;
3. subida directa del vídeo o de las fotografías;
4. estado y anotación opcional para cada categoría;
5. decisión, coste o presupuesto y siguiente visita cuando procedan;
6. confirmación final de que no se han escrito datos sensibles innecesarios.

El primer prototipo utiliza diez categorías agrupadas para móvil: acceso y
puertas; ambiente interior; agua y baños; electricidad e iluminación; cocina y
frío; ventanas y persianas; climatización; estado interior general; exterior
accesible; y salida y cierre. Cada categoría usa una opción cerrada de estado y
una anotación opcional que pasa a ser obligatoria durante la validación cuando el
resultado no es `Correcto`.

Google Forms recibe los archivos durante el piloto y el script los mueve a la
subcarpeta `AÑO/CÓDIGO_CASA/Evidencias`, los renombra con identificadores internos
y conserva sus IDs en la entrada JSON. No recoge dirección completa, códigos de
acceso, ubicación de llaves ni periodos detallados de ausencia. El consentimiento
de vídeo procede del acuerdo firmado y no se vuelve a preguntar en cada visita.

## Paso 0 — cerrar decisiones operativas mínimas

- **T001.** Nombrar a la persona responsable de aprobar cada informe y definir
  quién puede corregir estados, observaciones y decisiones antes de entregarlo.
- **T002.** Aprobar como entrada mínima un checklist por categoría, horas de
  entrada y salida, responsable, evidencia subida, anotaciones de excepción,
  decisiones y siguiente visita.
- **T003.** Decidir el canal de la primera entrada: Google Forms restringido al
  equipo si la cuenta personal ofrece controles suficientes, o formulario local
  con exportación JSON mientras no lo esté. En el piloto, una plantilla maestra
  genera una copia por visita y código de casa. Los datos obligatorios son
  estructurados y el texto libre se limita a notas complementarias. Google Forms
  exige login, recoge email y admite respuestas sucesivas como revisiones.
- **T004.** Definir qué campos puede proponer la IA y cuáles deben proceder
  literalmente de la persona visitante. Fechas, horas, estados, actuaciones,
  costes e identificadores de evidencias no deben inferirse.
- **T005.** Confirmar que el primer prototipo utiliza exclusivamente casos
  ficticios o anonimizados y que Google Forms, una hoja de respuestas o cualquier
  herramienta externa no recibe datos reales mientras privacidad, permisos y
  proveedores sigan pendientes.
- **T006.** Registrar en `knowledge/product/core.md` cualquier decisión de
  producto nueva que aparezca durante este paso antes de incorporarla al
  esquema o al prompt.

## Paso 1 — definir el contrato de datos versionado

- **T007.** Crear el esquema `visit-report-v1` con `schemaVersion`, identificador
  de informe, código visible de casa, visita, responsable, tiempos, estado
  general, protocolo, evidencia, observaciones, decisiones, próxima visita y
  flujo de aprobación.
- **T008.** Limitar los estados a `correct`, `observe`, `decision`, `authorized`
  y `not-reviewed`, trazados a los significados de `product/core.md`.
- **T009.** Añadir reglas condicionales: `not-reviewed` exige motivo;
  `authorized` exige actuación y autorización de origen; `decision` exige una
  pregunta concreta; un coste exige importe, fuente o estado pendiente.
- **T010.** Modelar la evidencia como una unión explícita: vídeo autorizado o
  fotografías fechadas. El vídeo incluye orientación, ausencia de audio,
  duración, referencia opaca del asset y fecha máxima de disponibilidad.
- **T011.** Añadir referencias internas `sourceRefs` a checks, observaciones,
  actuaciones y decisiones para poder rastrear cada texto hasta una anotación.
  Estas referencias no se muestran al propietario.
- **T012.** Añadir `warnings`, `completeness` y `workflow.status`; el generador
  solo puede producir `draft` o `needs-review`.
- **T013.** Definir una política de compatibilidad: cambios aditivos mantienen la
  versión y cambios incompatibles crean `visit-report-v2` con migración
  explícita.
- **T014.** Crear tipos de TypeScript para el renderer y comprobar mediante tests
  que representan el mismo contrato que el esquema de validación.

### Reglas editoriales del contrato

- Un hecho observado no se transforma en causa o diagnóstico.
- “Correcto” significa que no se observó una incidencia en el punto revisado;
  nunca implica certificación.
- No se usa “resuelto” para una actuación simple salvo que exista evidencia y
  alcance aprobado; se usa `Actuación autorizada`.
- Una recomendación no puede aparecer como encargo aceptado.
- Un profesional, material o reparación nunca parece incluido sin indicación
  expresa del producto canónico.
- La dirección completa, códigos de acceso y referencias de llaves quedan fuera
  del informe generado.

## Paso 2 — crear fixtures y separar datos de presentación

- **T015.** Extraer los datos ficticios actualmente embebidos en
  `VisitReportDemo.astro` a fixtures versionados independientes.
- **T016.** Crear como mínimo fixtures para: visita sin incidencia, seguimiento,
  decisión requerida, actuación autorizada, punto no revisado, modalidad vídeo
  y modalidad fotografías.
- **T017.** Añadir fixtures inválidos para campos ausentes, horas incoherentes,
  estado desconocido, evidencia incompatible y decisión sin pregunta.
- **T018.** Crear `VisitReport.astro` como renderer puro que recibe un informe
  validado y no contiene datos de negocio inline.
- **T019.** Convertir `VisitReportDemo.astro` en un wrapper fino que añade la
  etiqueta de demostración y selecciona un fixture ficticio.
- **T020.** Mantener las rutas standalone de vídeo y fotografías alimentadas por
  el mismo renderer y por datos diferentes, sin duplicar markup.
- **T021.** Renderizar ausencias de forma explícita y accesible; nunca ocultar un
  check porque falte información.
- **T022.** Conservar la jerarquía semántica, estilos de impresión, responsive y
  estados visibles sin depender solo del color.

## Paso 3 — documentar el procedimiento de trabajo

- **T023.** Crear una especificación de formulario independiente del proveedor y
  su primera implementación en Google Forms o formulario local. Incluir campos
  obligatorios, identificadores de nota, desplegables canónicos y ejemplos de
  redacción factual; si se elige Google Forms, preparar un Apps Script repetible
  que copie la plantilla, incorpore código, número y fecha, mueva el formulario a
  la carpeta compartida y lo registre en una hoja índice. El script añade un menú
  a la hoja de control para crear y cerrar formularios, y numera cada respuesta
  posterior como una revisión sin borrar las anteriores. La pregunta de archivos
  se añade manualmente a la plantilla, y el script organiza y renombra la
  evidencia subida o la hereda en una corrección sin archivo nuevo.
- **T024.** Documentar el proceso `recoger → generar → validar → revisar →
  aprobar`, con responsable y condición de salida en cada estado.
- **T025.** Especificar cómo registrar cambios posteriores sin sobrescribir la
  anotación original ni perder trazabilidad.
- **T026.** Añadir una lista de revisión humana: identidad de la visita,
  coherencia temporal, correspondencia con evidencias, estados, lenguaje,
  decisiones, costes y datos sensibles.
- **T027.** Definir el comportamiento ante contradicciones: no elegir una versión
  automáticamente, marcar `needs-review` y presentar las fuentes enfrentadas.
- **T028.** Definir el comportamiento ante información incompleta: conservar el
  campo vacío o usar `not-reviewed`, emitir una advertencia y solicitar el dato.
- **T029.** Prohibir que el procedimiento envíe emails, publique URLs, autorice
  gastos o cambie el estado a `approved` o `delivered`.

## Paso 4 — crear la skill de generación y revisión

- **T030.** Crear una skill de proyecto `visit-report` que lea el procedimiento,
  el esquema y el territorio verbal antes de procesar una entrada.
- **T031.** Separar dos comandos conceptuales: `generate-draft`, que produce JSON
  y advertencias, y `review-draft`, que compara la salida con las anotaciones.
- **T032.** Exigir a `generate-draft` que devuelva únicamente datos conformes al
  esquema, sin HTML, Markdown comercial ni explicación mezclada con el JSON.
- **T033.** Instruir a la skill para conservar literalmente cifras, horas,
  identificadores, estados elegidos, límites económicos y fechas.
- **T034.** Instruir a la skill para usar la voz precisa y serena de HappyHomes,
  distinguiendo hecho observado, recomendación y decisión solicitada.
- **T035.** Hacer que la skill rechace o marque cualquier diagnóstico, garantía,
  afirmación de seguridad, actuación no autorizada o información sin fuente.
- **T036.** Hacer que `review-draft` produzca un resultado estructurado con
  errores bloqueantes, advertencias, campos sin fuente y diferencias respecto a
  la entrada.
- **T037.** Añadir ejemplos positivos y negativos usando únicamente viviendas,
  personas y evidencias ficticias.
- **T038.** Documentar que la skill es una herramienta de prototipo para el
  equipo y no una interfaz operativa final para la persona visitante.

## Paso 5 — implementar validación determinista local

- **T039.** Crear un validador local sin llamadas de pago que compruebe el
  esquema, enums, campos condicionales, fechas, duración y coherencia de la
  modalidad de evidencia.
- **T040.** Validar que la duración coincide con entrada y salida o emitir una
  diferencia explícita que requiera revisión.
- **T041.** Validar que un vídeo no tenga audio, sea vertical y tenga fecha de
  eliminación no superior a 15 días desde la entrega del informe.
- **T042.** Validar que las fotografías tengan referencia, fecha/hora y texto
  descriptivo, sin exigir que el modelo procese el archivo binario.
- **T043.** Validar que cada texto generado tenga al menos una `sourceRef`
  existente en la entrada.
- **T044.** Añadir una comprobación de términos prohibidos o condicionados del
  producto canónico, tratándola como ayuda y no como sustituto de la revisión.
- **T045.** Hacer que cualquier error bloqueante termine con código distinto de
  cero y no produzca una salida marcada como válida.
- **T046.** Crear tests unitarios para todas las reglas y fixtures inválidos sin
  enviar contenido a un proveedor externo.

## Paso 6 — conectar generación, validación y previsualización ficticia

- **T047.** Definir un comando documentado para validar un JSON de borrador y
  mostrar errores con ruta de campo, causa y acción recomendada.
- **T048.** Permitir que los fixtures ficticios validados alimenten las rutas
  standalone existentes sin copiar datos dentro de los componentes.
- **T049.** Añadir una ruta o mecanismo de preview solo para fixtures del
  repositorio; no aceptar rutas arbitrarias, parámetros con datos personales ni
  archivos reales en esta iteración.
- **T050.** Mostrar en el preview el estado `draft`, las advertencias pendientes
  y la indicación de que requiere revisión humana, fuera del contenido final que
  vería el propietario.
- **T051.** Confirmar que cambiar de vídeo a fotografías es una decisión de datos
  y no requiere cambiar la plantilla ni editar markup.
- **T052.** Documentar el límite de esta iteración: producir un JSON y un preview
  ficticio no equivale a almacenar, proteger ni entregar un informe real.

## Paso 7 — verificar seguridad, exactitud y experiencia

- **T053.** Ejecutar todos los tests del validador y comprobar casos válidos,
  inválidos, incompletos y contradictorios.
- **T054.** Ejecutar la skill con al menos cuatro entradas ficticias y comparar
  cada frase generada con sus `sourceRefs`.
- **T055.** Introducir deliberadamente datos ausentes y confirmar que no se
  completan por inferencia.
- **T056.** Introducir una observación ambigua compatible con un diagnóstico y
  confirmar que la salida conserva solo el hecho observable.
- **T057.** Comprobar que ninguna salida contiene dirección completa, códigos de
  acceso, llaves, teléfono, email u otros datos innecesarios.
- **T058.** Ejecutar `pnpm --filter happy-homes-web build` y comprobar que las
  plantillas standalone y la landing siguen generándose correctamente.
- **T059.** Revisar vídeo y fotografías a 375, 768 y 1440 px y a zoom equivalente
  al 200 %, sin desbordamiento ni pérdida de información.
- **T060.** Navegar el informe con teclado y lector semántico, verificando orden
  de encabezados, nombres de evidencias y estados comprensibles sin color.
- **T061.** Revisar la impresión a PDF para confirmar que no corta observaciones,
  decisiones o metadatos esenciales, aunque la automatización de PDF permanezca
  fuera de alcance.
- **T062.** Realizar una revisión final de producto y operación antes de permitir
  que el procedimiento se pruebe fuera del conjunto de fixtures ficticios.

## Archivos previstos

- Nuevo `knowledge/product/report-generation.md`
- Nuevo `knowledge/product/report-intake-form.md`
- Nuevo `knowledge/product/schemas/visit-report-v1.schema.json`
- Nuevo `.opencode/skills/visit-report/SKILL.md`
- Nuevo `web/src/types/visit-report.ts`
- Nuevos fixtures en `web/src/data/report-fixtures/`
- Nuevo `web/src/components/VisitReport.astro`
- `web/src/components/VisitReportDemo.astro`
- `web/src/pages/report-template-video.html.astro`
- `web/src/pages/report-template-photo.html.astro`
- Nuevo validador en `scripts/report-gen/`
- Nuevos tests en `scripts/report-gen/test/`
- Nuevo `scripts/report-gen/google-forms/Code.gs` para el piloto con Google Forms
- `.gitignore`, solo si se define una ubicación local temporal que deba quedar
  excluida
- `knowledge/product/core.md`, únicamente cuando una decisión nueva sea aprobada

Los nombres concretos pueden ajustarse durante el Paso 0, pero el esquema debe
permanecer independiente del componente visual y del proveedor de IA.

## Criterios de aceptación globales

- [ ] Existe una única versión documentada del contrato de datos.
- [ ] Ambas modalidades se renderizan desde el mismo componente y esquema.
- [ ] Los componentes no contienen datos ficticios inline salvo en wrappers o
      fixtures identificados expresamente.
- [ ] Cada observación, actuación y decisión generada es trazable a una fuente.
- [ ] Los campos ausentes generan advertencias y nunca contenido inventado.
- [ ] La IA no puede aprobar, entregar, diagnosticar ni autorizar gastos.
- [ ] Una persona debe revisar el borrador antes de cualquier uso externo.
- [ ] El formulario funciona desde móvil, obliga a completar los campos críticos,
      permite subir evidencia ficticia y no solicita direcciones, accesos ni
      llaves.
- [ ] Si se usa Google Forms, el acceso, propietario, colaboradores, hoja de
      respuestas y retención están documentados y aprobados.
- [ ] Cada formulario de visita tiene identificador único, aparece en la hoja
      índice y no obliga a volver a escribir código de casa o número de visita.
- [ ] El formulario utiliza controles cerrados para los estados y reserva texto
      libre para observaciones justificadas.
- [ ] El formulario exige cuenta Google, registra el email y conserva cada envío
      posterior como una revisión trazable.
- [ ] La hoja de control permite crear y cerrar formularios sin editar el Apps
      Script para cada visita.
- [ ] Los ejemplos y tests contienen únicamente datos ficticios.
- [ ] El validador rechaza estados, evidencias y fechas incompatibles.
- [ ] La salida conserva el tono de HappyHomes sin suavizar ni dramatizar hechos.
- [ ] El build web y los tests del generador terminan correctamente.
- [ ] El plan de protección de URLs sigue siendo una dependencia separada antes
      de utilizar datos reales.

## Verificación prevista

```bash
node --test scripts/report-gen/test/*.test.js
node scripts/report-gen/cli.mjs validate <fixture.json>
pnpm --filter happy-homes-web build
```

Además de los comandos, la verificación incluye comparación manual entre notas,
JSON y HTML, matriz responsive, zoom, teclado, semántica, impresión y revisión de
privacidad. No se realizará ninguna llamada de pago ni se utilizarán datos reales
para verificar esta iteración.

## Riesgos y decisiones que quedan abiertas

- El proveedor o modelo que ejecutará la transformación no está elegido; no debe
  recibir datos reales hasta completar evaluación contractual y de privacidad.
- Google Forms desde una cuenta personal es la recomendación para el piloto, no
  una aprobación de proveedor. La propiedad individual, recuperación de cuenta,
  acceso del socio y ausencia de administración de dominio son riesgos que deben
  aceptarse o resolverse antes de datos reales.
- Los archivos subidos consumen los 15 GB compartidos de una cuenta personal y
  una cuenta no autorizada que conozca el enlace podría intentar subir contenido
  antes de que el script rechace la respuesta. El piloto usa archivos ficticios;
  capacidad, acceso previo y borrado automático deben resolverse antes de operar.
- Un formulario por visita simplifica la experiencia, pero puede generar cientos
  de archivos, enlaces y triggers. La hoja índice, carpetas por año/casa y cierre
  manual controlado son obligatorios; con mayor volumen deberá migrarse a un
  formulario único o una aplicación interna. Al cerrar un formulario se elimina
  su trigger y al reabrirlo se reinstala.
- Mantener el formulario abierto permite correcciones, pero genera respuestas
  múltiples. La numeración de revisiones y la selección explícita del borrador
  vigente son necesarias para evitar enviar una versión antigua.
- La entrada final de la persona visitante podría evolucionar a una app interna;
  este plan mantiene el contrato común independiente del canal.
- La calidad del borrador depende de un checklist suficientemente estructurado;
  aceptar únicamente texto libre aumenta ambigüedad y riesgo de invención.
- La protección de URLs, almacenamiento, revocación y registro de acceso se
  resolverán en el paso posterior y no deben simularse con JavaScript cliente.
- La generación de PDF debe consumir el mismo JSON, pero se evaluará después de
  estabilizar esquema, HTML y flujo de revisión.
