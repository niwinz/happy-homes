# Plan de mejoras inspirado por el análisis de SerenoHome

- **Estado:** propuesto; no aprobado para implementación
- **Investigación base:** [`../research/serenohome-competitive-analysis.md`](../research/serenohome-competitive-analysis.md)
- **Objetivo:** hacer que HappyHomes sea más comprensible, demostrable y fácil de contratar sin copiar al competidor ni publicar capacidades no validadas.

## 1. Resultado esperado

La siguiente versión de la web debe permitir que una persona responda, sin contactar todavía:

1. qué recibe después de cada visita;
2. qué se revisa y qué no;
3. quién entra en su casa y cómo se gestionan las llaves;
4. cuánto cuesta o cómo se calcula;
5. si HappyHomes llega a su zona;
6. qué sucede después de enviar una solicitud.

La secuencia estratégica es **definir → demostrar → convertir → escalar**, no empezar por un checkout o por decenas de páginas SEO.

## 2. Principios y límites

- Mantener la identidad de [`../brand/design.md`](../brand/design.md): quiet luxury mediterráneo, petróleo/terracota, EB Garamond/Inter, radios contenidos e ilustración editorial.
- Mantener la voz de [`../brand/core.md`](../brand/core.md): calma, cuidado, precisión y una persona real al otro lado.
- No copiar textos, estructura visual, fotografías, protocolo ni nombres de planes de SerenoHome.
- No publicar precios o servicios propuestos como si estuvieran aprobados.
- Describir la visita como visual y preventiva, no como inspección técnica, seguridad, seguro o garantía.
- No construir portal, pagos o almacenamiento de vídeo hasta validar operación, privacidad, soporte y retorno.
- Una sola CTA primaria por sección y una expectativa concreta tras cada CTA.

## 3. Decisiones bloqueantes

El registro único de decisiones es la sección 16 de
[`../product/core.md`](../product/core.md). Sus identificadores P1–P15, estados
y puertas de validación sustituyen cualquier lista paralela en este plan.
Actualizar una condición del producto significa actualizar primero ese canon.

Si una decisión sigue abierta, la web debe mostrar una formulación honesta —por ejemplo “te confirmamos disponibilidad y precio”—, no inventar precisión.

## 4. Fase 0 — validar y aprobar el producto canónico

- **Prioridad:** P0
- **Dependencias:** responsables de negocio, operaciones, gestoría y revisión legal.
- **Resultado:** `knowledge/product/core.md` aprobado como versión 1.0 y copy público seguro.

### Trabajo

1. Resolver las validaciones P1–P15 registradas en el producto canónico.
2. Medir visitas piloto puerta a puerta: trayecto, estancia, informe, mensajes y coordinación.
3. Probar el protocolo propuesto en distintas tipologías de vivienda.
4. Costear los planes mensuales, la modalidad anual y cada extra.
5. Aprobar cobertura, llaves, evidencias, sustituciones, datos y horarios.
6. Contrastar condiciones y retención con asesoría legal y fiscal.
7. Cambiar cada estado provisional o pendiente a definido, modificar la
   propuesta, o excluirla de la versión 1.0.
8. Revisar la web actual contra los claims autorizados y prohibidos del canon.

### Fuente a actualizar

- `knowledge/product/core.md` para toda decisión de producto.
- Los documentos de research, pricing o personas se actualizan únicamente si
  aparece nueva evidencia o cambia el análisis; no se usan como una segunda
  definición de la oferta.

### Criterios de aceptación

- [ ] `knowledge/product/core.md` tiene versión 1.0 y aprobación explícita.
- [ ] No quedan dos arquitecturas de planes compitiendo como fuente vigente.
- [ ] El precio indica inequívocamente si incluye IVA.
- [ ] Cada prestación tiene inclusión, límite, coste y responsable.
- [ ] Existe una lista de afirmaciones prohibidas o condicionadas.
- [ ] Cobertura, horario, temporales y llaves tienen reglas operables.

## 5. Fase 1 — convertir el informe en producto visible

- **Prioridad:** P0/P1
- **Dependencias:** P6–P8 del producto canónico.
- **Resultado:** una muestra honesta del entregable y una explicación del protocolo.

### Trabajo

1. Diseñar un informe de ejemplo de HappyHomes, no una copia del competidor.
2. Incluir como mínimo:
   - fecha y número de visita;
   - persona responsable;
   - entrada, salida y duración si se registrarán realmente;
   - categorías revisadas;
   - estado comprensible;
   - evidencia visual con fecha;
   - observaciones y siguiente acción;
   - aprobación requerida y coste estimado cuando corresponda.
3. Marcarlo “Ejemplo de informe” mientras no sea un caso real autorizado.
4. Crear una página que explique cada sección, privacidad y entrega.
5. Aplicar la decisión de evidencias registrada en P8:
   - vídeo completo validado;
   - clips solo ante incidencia;
   - fotos fechadas como estándar;
   - combinación por plan.

### Archivos previstos

- Nuevo `web/src/pages/el-informe.astro`
- Nuevo `web/src/components/VisitReportDemo.astro`
- Nuevo `web/src/components/ReportStatus.astro`, si hay estados reutilizables
- `web/src/components/VideoProof.astro`, renombrar o reescribir según P8
- `web/src/pages/index.astro`
- `web/src/pages/servicios.astro`
- `web/src/styles/tokens.css`, solo si falta un token semántico aprobado
- Assets propios en `web/public/` con permiso y tratamiento definido

### Criterios de aceptación

- [ ] La home permite ver una muestra antes del primer formulario.
- [ ] La muestra no contiene una casa, dirección o incidencia real sin permiso.
- [ ] Se distingue “observado”, “resuelto” y “requiere decisión”.
- [ ] No se implica certificación, garantía o aceptación por aseguradoras.
- [ ] El componente funciona a 375, 768 y 1440 px y a 200 % de zoom.

## 6. Fase 2 — reestructurar arquitectura y narrativa

- **Prioridad:** P1
- **Dependencias:** ficha de oferta y muestra de informe.
- **Resultado:** una web más corta, navegable y orientada a decisiones.

### Arquitectura propuesta

| Ruta | Trabajo principal |
|---|---|
| `/` | Resultado, evidencia, proceso, plan recomendado, cobertura, confianza y CTA. |
| `/servicios` | Planes, comparación, extras, límites y preguntas de precio. |
| `/como-funciona` | Desde la primera conversación hasta cada informe e incidencia. |
| `/el-informe` | Muestra, campos, evidencia, privacidad y entrega. |
| `/zonas` | Cobertura real, condiciones de desplazamiento y consulta por municipio. |
| `/sobre-nosotros` | Personas reales, experiencia verificable y continuidad del servicio. |
| `/faq` | Objeciones agrupadas y respuestas contractualmente coherentes. |
| `/contacto` | Disponibilidad/diagnóstico, canales y expectativa de respuesta. |
| `/legal/*` o rutas equivalentes | Aviso, privacidad, cookies y condiciones. |

### Orden recomendado de la home

1. Hero: resultado + zona + CTA de disponibilidad.
2. Muestra resumida del informe.
3. Cómo funciona en tres o cuatro pasos.
4. Plan principal o frecuencias, con precio solo si está aprobado.
5. Persona fija y protocolo de acceso.
6. Cobertura real.
7. FAQ de alta intención.
8. CTA final.

### Cambios de navegación

- Sustituir “Inicio” por uso del wordmark; priorizar `Servicios`, `Cómo funciona`, `El informe`, `Zonas` y `Contacto`.
- Mantener “Sobre nosotros” y FAQ en navegación secundaria o footer si falta espacio.
- CTA principal: `Comprobar disponibilidad` o equivalente validado.
- No añadir “Área de cliente” hasta que exista un producto real.

### Archivos previstos

- `web/src/components/Header.astro`
- `web/src/components/Footer.astro`
- `web/src/components/Hero.astro`
- `web/src/pages/index.astro`
- `web/src/pages/servicios.astro`
- `web/src/pages/sobre-nosotros.astro`
- `web/src/pages/faq.astro`
- Nuevos `web/src/pages/como-funciona.astro` y `web/src/pages/zonas.astro`
- Posible módulo de contenido compartido `web/src/data/offer.ts` tras aprobar la oferta

### Criterios de aceptación

- [ ] Una persona identifica propuesta, evidencia y CTA en la primera pantalla o inmediatamente después.
- [ ] No hay bloques repetidos que alarguen la home sin aportar una decisión nueva.
- [ ] Todos los claims se trazan a la matriz de la fase 0.
- [ ] La navegación móvil tiene objetivos de 44×44 px, foco visible y cierre claro.
- [ ] Hay exactamente un H1 y la jerarquía de encabezados no salta niveles.

## 7. Fase 3 — clarificar planes, extras y alcance

- **Prioridad:** P1
- **Dependencias:** P1, P3, P4, P14 y P15 del producto canónico.
- **Resultado:** comparación transparente sin depender de llamadas para entender lo básico.

### Trabajo

1. Sustituir rangos por:
   - precio final único, si el servicio está estandarizado; o
   - “desde” con regla de cálculo visible; o
   - diagnóstico y presupuesto si todavía no puede estandarizarse.
2. Presentar la frecuencia en visitas por mes natural.
3. Añadir filas de “incluido”, “aparte” y “sujeto a disponibilidad”.
4. Publicar las categorías de extras con unidad: visita, hora o presupuesto.
5. Indicar IVA, permanencia, alta, cancelación y pago.
6. Evitar que el plan más caro contenga promesas operativamente imposibles.

### Archivos previstos

- `web/src/pages/servicios.astro`
- `web/src/pages/index.astro`
- `web/src/components/PlanGrid.astro`
- `web/src/components/PlanCard.astro`
- `web/src/components/AddOnList.astro`
- Posibles nuevos `PlanComparison.astro` y `ScopeNote.astro`

### Criterios de aceptación

- [ ] No hay rangos sin explicar qué mueve el precio.
- [ ] IVA y periodicidad aparecen junto al precio.
- [ ] Reparaciones, materiales y terceros no parecen incluidos.
- [ ] La comparación se entiende sin depender solo de color o iconos.
- [ ] Cada CTA conserva el plan/frecuencia de interés en el formulario.

## 8. Fase 4 — mejorar contacto y conversión

- **Prioridad:** P0 para placeholders; P1 para el nuevo flujo.
- **Dependencias:** P2, P10, P12 y P13 del producto canónico.
- **Resultado:** solicitudes útiles, accesibles y medibles.

### Flujo inicial recomendado

Una sola página, sin pago:

1. municipio o código postal;
2. tipo y tamaño aproximado de casa;
3. frecuencia o necesidad principal;
4. nombre y email;
5. teléfono opcional y preferencia de contacto;
6. consentimiento e información de privacidad;
7. confirmación con plazo y siguiente paso.

No pedir dirección completa, datos de acceso ni detalles sensibles antes de confirmar encaje.

### Trabajo

- Sustituir `https://formspree.io/f/your-id`.
- Sustituir el teléfono provisional.
- Implementar estados: inicial, envío, éxito, error, offline y reintento.
- Mantener errores junto al campo, resumen opcional y movimiento de foco.
- Conservar parámetros de plan/zona de forma segura.
- Medir inicio, error y envío sin registrar contenido personal.
- Definir canal alternativo real; WhatsApp solo si hay número, horario y responsable.

### Archivos previstos

- `web/src/pages/contacto.astro`
- `web/src/components/ContactForm.astro`
- `web/src/layouts/Base.astro`, si se añade medición consentida
- Variables de entorno o configuración documentada para endpoint y teléfono

### Criterios de aceptación

- [ ] Ningún placeholder llega a producción.
- [ ] El formulario funciona con teclado, lector de pantalla y JS fallido cuando sea viable.
- [ ] No se envían eventos con nombre, email, teléfono, dirección o mensaje.
- [ ] Éxito y error explican qué ocurrió y qué hacer.
- [ ] La expectativa de respuesta coincide con la capacidad real.

## 9. Fase 5 — fundamentos SEO y páginas locales piloto

- **Prioridad:** P1 para fundamentos; P2 para expansión local.
- **Dependencias:** dominio, cobertura y contenido local aprobado.
- **Resultado:** indexación coherente y validación de demanda por zona.

### Fundamentos técnicos

- Configurar `site` real en `web/astro.config.mjs`.
- Extender `Base.astro` con canonical, Open Graph completo e imagen social.
- Generar sitemap y robots coherentes.
- Añadir JSON-LD solo con datos reales:
  - `Organization` o tipo local adecuado;
  - `Service`;
  - `Offer` cuando precio y condiciones estén aprobados;
  - `BreadcrumbList` en zonas;
  - no añadir `FAQPage` si no cumple las políticas vigentes del buscador.
- Añadir páginas 404 y estados de URL coherentes.

### Piloto local

1. Seleccionar 3–5 municipios por capacidad, demanda y densidad de ruta.
2. Crear datos estructurados en `web/src/data/areas.ts` o colección equivalente.
3. Escribir contenido original y revisado localmente.
4. Enlazar zona → municipio → servicio → contacto.
5. Medir impresiones, leads válidos y coste operativo antes de ampliar.

### Internacionalización

- Empezar por catalán si el equipo puede mantener paridad.
- Priorizar francés o inglés con evidencia de demanda.
- Usar rutas e `hreflang` recíprocos, canonical por idioma y `x-default`.
- No anunciar alemán hasta poder atender y mantener contenido/contrato en alemán.

### Archivos previstos

- `web/astro.config.mjs`
- `web/src/layouts/Base.astro`
- Nuevo `web/src/pages/zonas/index.astro` o estructura equivalente
- Nuevo `web/src/pages/zonas/[slug].astro`
- Nuevo `web/src/data/areas.ts`
- Nuevo `web/src/pages/404.astro`
- Assets sociales en `web/public/`

### Criterios de aceptación

- [ ] Cada URL indexable tiene title, description, canonical y OG propios.
- [ ] Los datos estructurados validan y coinciden con el contenido visible.
- [ ] Ninguna página local es una sustitución automática de topónimo.
- [ ] Solo se publican municipios servibles.
- [ ] Alternates/hreflang son recíprocos cuando exista i18n.

## 10. Fase 6 — confianza legal y operacional

- **Prioridad:** P0 antes de datos sensibles o servicio activo.
- **Dependencias:** P5, P6, P8, P12 y P13 del producto canónico.
- **Resultado:** expectativas, privacidad y responsabilidades alineadas.

### Páginas y políticas

- Aviso legal.
- Privacidad.
- Cookies y panel de consentimiento si se usan herramientas no esenciales.
- Condiciones del servicio.
- Política operativa de llaves y acceso, integrada o resumida públicamente.
- Tratamiento de fotos y vídeos.

### Contenido mínimo de condiciones

- naturaleza visual/preventiva de la visita;
- intervalo entre visitas y ausencia de garantía sobre hechos intermedios;
- exclusión de seguridad, seguro e inspección técnica;
- autorización y límite de gastos;
- profesionales externos, materiales y esperas;
- acceso, llaves, pérdida, sustitución y devolución;
- incidentes, horarios, temporales y fuerza mayor;
- cancelación, impagos y reprogramación;
- privacidad de evidencias.

### Criterios de aceptación

- [ ] Footer enlaza todas las páginas legales aplicables.
- [ ] El banner de consentimiento no penaliza rechazar.
- [ ] No se carga analítica no esencial antes del consentimiento aplicable.
- [ ] Las condiciones y el copy comercial no se contradicen.
- [ ] La retención de vídeo/fotos es concreta y técnicamente aplicable.

## 11. Fase 7 — portal y contratación online, solo tras validación

- **Prioridad:** P3
- **Condición de entrada:** clientes activos, proceso estable y necesidad demostrada.
- **Resultado:** decisión fundada entre producto propio y herramientas existentes.

### Antes de construir

Medir si email, PDF o mensajería segura resuelven suficientemente:

- entrega y archivo de informes;
- aprobación de gastos;
- historial de incidencias;
- acceso de copropietarios;
- descarga y borrado de evidencias.

### Si se aprueba un portal

- autenticación segura y revocación de sesiones;
- separación estricta por vivienda/cliente;
- logs de acceso;
- retención y borrado;
- exportación;
- accesibilidad;
- respuesta ante brechas;
- soporte y propietario operativo.

El sitio Astro estático no basta por sí solo para estos requisitos; esta fase requiere arquitectura y presupuesto separados.

## 12. QA y verificación transversal

### Comandos

- Gate del repositorio: `pnpm --filter happy-homes-web build`.
- No usar `astro check` hasta declarar sus dependencias, según `AGENTS.md`.

### Matriz manual mínima

- Viewports: 375, 768, 1440 y 1920 px.
- Zoom: 200 %.
- Teclado completo y foco visible.
- Movimiento reducido.
- Contraste AA.
- Formularios: vacío, formato inválido, error de red, éxito, reintento.
- Menú móvil abierto/cerrado y bloqueo de foco si se convierte en diálogo.
- Sin scroll horizontal.
- Titles, canonical, OG, sitemap y JSON-LD.
- Sin datos personales en analítica o URL.

### Presupuesto de rendimiento

- Mantener JavaScript excepcional.
- No añadir librería de iconos ni framework cliente para contenido estático.
- Optimizar imágenes y reservar dimensiones.
- Mantener CSS de página por debajo del objetivo de 50 KB gzip de la guía visual.

## 13. Métricas y experimento

### Funnel

- visita → interacción con informe;
- informe → planes;
- planes → inicio de solicitud;
- inicio → envío válido;
- envío → conversación;
- conversación → cliente.

### Calidad del lead

- dentro de cobertura;
- tipo/tamaño de vivienda;
- frecuencia deseada;
- idioma;
- razón de compra/rechazo;
- fuente y municipio.

### Operación y economía

- minutos y km puerta a puerta;
- minutos de informe y comunicación;
- coste real por visita;
- incidencias y coordinación por vivienda;
- tiempo hasta entregar informe;
- margen por plan y extra;
- capacidad por ruta y persona.

### Experimentos iniciales

1. CTA `Comprobar disponibilidad` frente a `Hablar con nosotros`.
2. Informe visible en la home frente a enlace a página propia, sin ocultarlo en ambos casos.
3. Precio Care final de 109/119/129 € solo en presupuestos comparables y con aprobación de negocio.
4. Formulario de 4–5 campos frente a flujo por pasos, midiendo calidad además de finalización.

No ejecutar experimentos de precio mezclando zonas, prestaciones o canales sin registrar esas diferencias.

## 14. Orden de entrega sugerido

1. **Semana/iteración 1:** validaciones P1–P15, aprobación del producto canónico y eliminación de placeholders.
2. **Iteración 2:** protocolo e informe de ejemplo.
3. **Iteración 3:** nueva home, “Cómo funciona” y “El informe”.
4. **Iteración 4:** servicios/precios, zonas y nuevo contacto.
5. **Iteración 5:** legal, metadatos, schema, sitemap y QA.
6. **Iteración 6:** 3–5 páginas locales piloto e idioma prioritario.
7. **Más adelante:** evaluar checkout y portal con datos de clientes reales.

El calendario depende de decisiones externas; el orden importa más que la duración nominal.

## 15. Definición global de terminado

- [ ] Toda afirmación pública tiene propietario y evidencia interna.
- [ ] Oferta, precio, IVA, frecuencia y exclusiones son coherentes en todas las rutas.
- [ ] Existe una muestra de informe honesta y accesible.
- [ ] Contacto, teléfono, dominio y formularios son reales.
- [ ] Privacidad, cookies, condiciones y llaves están cubiertos.
- [ ] La cobertura publicada coincide con capacidad operativa.
- [ ] No se copia identidad ni contenido del competidor.
- [ ] La web pasa build y QA responsive/accesible.
- [ ] Se han definido eventos y métricas sin capturar datos personales.
- [ ] Las páginas locales se amplían solo después de validar utilidad y demanda.
