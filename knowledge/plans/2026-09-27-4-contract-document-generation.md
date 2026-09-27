# Plan para generar acuerdos en DOCX y PDF

- **Fecha:** 27 de septiembre de 2026
- **Estado:** sustituido por la simplificación KISS solicitada posteriormente
- **Nota:** este plan conserva el historial de la primera implementación. La
  arquitectura vigente está en `scripts/contract-gen/AGENTS.md`; no reutilizar
  la separación de perfiles, acuerdos, manifiestos ni Markdown generado descrita
  a continuación.
- **Alcance:** registros contractuales canónicos, validación local, renderizado
  Markdown, DOCX y PDF de borrador
- **Dependencias:** plantilla contractual pendiente de revisión jurídica,
  Pandoc, XeLaTeX, EB Garamond e Inter disponibles en el entorno
- **Fuera de alcance:** aprobar condiciones legales, firmar electrónicamente,
  alterar un PDF firmado o introducir datos reales de clientes durante las
  pruebas

## Paso 0 — fijar el contrato de datos y las salvaguardas

- **T001.** Definir registros Markdown con frontmatter JSON para la identidad
  legal, el perfil del propietario y cada acuerdo.
- **T002.** Separar datos canónicos, plantilla legal, documentos regenerables y
  PDF firmado inmutable.
- **T003.** Bloquear documentos firmables mientras la plantilla requiera revisión
  legal; permitir únicamente salidas claramente marcadas como borrador.
- **T004.** Prohibir credenciales, códigos de alarma y ubicaciones de llaves en
  los registros contractuales.

**Archivos afectados:** `knowledge/business/`,
`knowledge/product/service-agreement-template.md`, `scripts/contract-gen/`.

**Aceptación:** el esquema distingue datos de empresa, cliente y acuerdo y la
validación falla ante estados o campos incompatibles.

## Paso 1 — crear el paquete y el CLI

- **T005.** Crear el paquete privado `@happy-homes/contract-gen` con una única
  entrada CLI y añadirlo al workspace.
- **T006.** Implementar `--agreement`, `--mode filled|handwritten`,
  `--format docx|pdf|all`, `--output` y `--draft`.
- **T007.** Resolver rutas desde la raíz, mostrar ayuda clara y no sobrescribir
  resultados salvo petición explícita.
- **T008.** Leer frontmatter JSON sin añadir dependencias de runtime.

**Aceptación:** la ayuda funciona desde la raíz y los argumentos inválidos
terminan con un error accionable y código distinto de cero.

## Paso 2 — validar y resolver la plantilla

- **T009.** Combinar identidad legal, perfil y acuerdo mediante un mapeo
  explícito de variables.
- **T010.** Implementar modos cumplimentado y manuscrito sin dejar marcadores
  `{{...}}` en la salida.
- **T011.** Resolver de forma determinista las casillas de vídeo/fotografías,
  comprobaciones, gasto e inicio anticipado.
- **T012.** Excluir frontmatter, notas internas y enlaces de investigación del
  documento generado.
- **T013.** Generar un Markdown intermedio auditable y marcado como borrador
  cuando corresponda.

**Aceptación:** ninguna salida contiene notas internas, credenciales o
placeholders; las elecciones coinciden con los datos de entrada.

## Paso 3 — aplicar la identidad visual a DOCX y PDF

- **T014.** Crear de forma reproducible un `reference.docx` A4 con EB Garamond,
  Inter, petróleo, crudo, terracota, bordes finos y jerarquía compacta.
- **T015.** Crear configuración XeLaTeX equivalente para PDF, con encabezado,
  pie, numeración y aviso de borrador.
- **T016.** Generar DOCX y PDF desde el mismo Markdown resuelto.
- **T017.** Mantener el wordmark tipográfico hasta que exista un logotipo final.

**Aceptación:** ambos formatos son legibles, coherentes con la marca y conservan
tablas, casillas, firmas y anexos.

## Paso 4 — añadir expedientes ficticios y trazabilidad

- **T018.** Crear `knowledge/business/legal-identity.md` con campos canónicos
  pendientes, claramente identificados como datos de prueba.
- **T019.** Crear un cliente y acuerdo `HH-TEST-001` exclusivamente ficticios.
- **T020.** Añadir una plantilla de `manifest.md` para registrar estado, firma,
  versión y SHA-256 del futuro PDF firmado.
- **T021.** Documentar la estructura por cliente y la regla de no sobrescribir
  originales firmados.

**Aceptación:** el ejemplo permite ejecutar ambos modos sin sugerir que los datos
o condiciones provisionales están aprobados.

## Paso 5 — verificar

- **T022.** Añadir tests unitarios para argumentos, frontmatter, validación,
  reemplazo de variables, casillas y modo manuscrito.
- **T023.** Ejecutar los tests sin red ni datos reales.
- **T024.** Generar DOCX y PDF de ejemplo y comprobar tipos, metadatos, fuentes,
  número de páginas y ausencia de marcadores.
- **T025.** Revisar visualmente ambos documentos y corregir cortes o jerarquía.
- **T026.** Ejecutar el build web para confirmar que el nuevo workspace no
  altera el sitio.

**Verificación:**

```bash
node --test scripts/contract-gen/test/*.test.js
pnpm --filter @happy-homes/contract-gen cli -- --help
pnpm --filter @happy-homes/contract-gen cli -- \
  --agreement HH-TEST-001 --mode filled --format all --draft
pnpm --filter happy-homes-web build
```

## Definición de terminado

- [x] Un único origen genera DOCX y PDF.
- [x] Los datos canónicos viven en `knowledge/business/`.
- [x] Los documentos reales quedan bloqueados mientras falte revisión legal.
- [x] El modo manuscrito deja campos útiles, no placeholders técnicos.
- [x] Las selecciones sensibles son explícitas y coherentes.
- [x] El estilo respeta la identidad de marca y funciona en A4.
- [x] Las pruebas y el build terminan correctamente.
