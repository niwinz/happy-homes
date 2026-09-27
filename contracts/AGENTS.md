# Expedientes contractuales

Este directorio contiene los datos y documentos de cada contrato. Sus reglas se
aplican tanto a agentes como a cualquier automatización que opere aquí.

## Fuentes

- `../knowledge/business/legal-identity.json`: identidad, privacidad y datos del
  proveedor.
- `../knowledge/product/service-agreement-template.md`: texto contractual
  canónico.
- `_template/contract.json`: estructura inicial de cada expediente.
- `../scripts/contract-gen/AGENTS.md`: CLI, generación y verificación.
- `../.opencode/skills/hh-new-contract/SKILL.md`: alta asistida desde
  contexto libre.

El producto canónico prevalece sobre datos provisionales, planes o
investigación. Un expediente instancia decisiones aprobadas; no las aprueba.

## Operación

Usa la skill `hh-new-contract` para crear o actualizar un contrato. La persona
operadora puede aportar notas, mensajes o datos incompletos y desordenados. La
skill debe:

1. extraer solo información respaldada por el contexto;
2. separar datos claros, ambiguos, desconocidos y prohibidos;
3. presentar la propuesta y solicitar confirmación explícita;
4. escribir `contract.json` únicamente después de la confirmación;
5. ejecutar el generador y comunicar los campos pendientes.

No pidas a la persona operadora que copie plantillas, edite JSON o recuerde
comandos. La confirmación de datos y la firma continúan siendo actos humanos.

## Estructura

```text
contracts/<contractId>/
├── contract.json
├── agreement-draft.docx
├── agreement-draft.pdf
├── visit-sheet-draft.docx
├── visit-sheet-draft.pdf
├── agreement.docx
├── agreement.pdf
├── visit-sheet.docx
├── visit-sheet.pdf
└── agreement-signed.pdf
```

- `contract.json` reúne cliente, vivienda, servicio y elecciones.
- Los campos usan `camelCase`; `contractId` es el único identificador.
- Los valores ausentes o `""` se convierten en líneas para completar a mano.
- Los archivos `agreement-draft.*` son derivados regenerables y no firmables.
- Los archivos `visit-sheet-draft.*` son fichas operativas no utilizables en una
  visita mientras queden aprobaciones o datos pendientes.
- Los archivos `agreement.*` solo se generan con todas las aprobaciones
  cerradas y constituyen la versión preparada para firma.
- Los archivos `visit-sheet.*` contienen únicamente instrucciones operativas y
  una referencia opaca; nunca datos personales, dirección, precio o secretos.
  El generador rechaza la versión final si faltan condiciones operativas.
- `agreement-signed.pdf` es el original canónico recibido después de firmar.

## Invariantes

- Usa códigos opacos en rutas, nunca nombres ni otros datos personales.
- Haz coincidir exactamente la carpeta y `contractId`.
- Para contratos reales usa la secuencia `HH-NNN`. Si el usuario no aporta un
  identificador, `hh-new-contract` asigna el siguiente número disponible entre
  expedientes no ficticios; `_template` y `fictitious: true` no cuentan.
- No inventes datos ni conviertas una interpretación ambigua en un valor.
- No almacenes códigos de alarma o acceso, contraseñas, credenciales ni
  ubicaciones físicas de llaves.
- No añadas datos personales a una ficha operativa. Una copia impresa debe
  devolverse o destruirse después de la visita.
- No cierres aprobaciones legales o de negocio por iniciativa propia.
- Mientras cualquier aprobación esté abierta, genera únicamente un borrador con
  aviso visible de **NO FIRMAR**.
- No crees, edites, comprimas, regeneres, reemplaces ni elimines
  `agreement-signed.pdf`.
- Una corrección posterior a la firma requiere una adenda o un nuevo
  `contractId`.
- No hagas commit de datos personales salvo petición explícita y únicamente
  cuando la política de acceso, retención y borrado lo permita.

## Aprobación y archivo

Una versión para firma requiere simultáneamente:

- `legal_review_required: false` en la plantilla revisada;
- `status: "approved"` y `legalReviewApproved: true` en
  `legal-identity.json`;
- `status: "approved"` en `contract.json`;
- petición explícita de la versión para firma.

La firma se realiza fuera del generador. Conserva el PDF original exacto como
`agreement-signed.pdf`; si procede de un escaneo, cualquier OCR o compresión es
un derivado separado.

## Pendientes

Este es el índice único de pendientes del sistema contractual. Las fuentes
enlazadas siguen siendo canónicas.

| Pendiente | Bloquea | Criterio de cierre |
|---|---|---|
| Decisiones legales, de producto y operativas | Documento firmable | Resolver la lista «Decisiones que bloquean el uso de la plantilla» y reflejar las aprobaciones en el producto canónico. |
| Identidad real del proveedor | Contrato real | Sustituir el fixture de `../knowledge/business/legal-identity.json`, usar `fictitious: false` y cerrar sus aprobaciones. El NIF actual es deliberadamente inválido. |
| Datos y condiciones particulares | Contrato afectado | Confirmar la extracción y aprobar `<contractId>/contract.json`. |
| Firma e identidad/representación | Primera firma | Aprobar y documentar el mecanismo operativo fuera del generador. |
| Custodia, permisos, copias, retención y borrado | Datos reales | Aprobar una política que incluya Git, historial, copias de seguridad, acceso y purga. |
| Revisión final | Entrega para firma | Revisar todas las páginas, tablas, casillas, firmas, enlaces y accesibilidad del PDF aprobado. |
| Logotipo final | Presentación | Integrar `knowledge/brand/assets/logo.svg` en DOCX y PDF y repetir la revisión visual. |
| Primer original firmado | Cierre del expediente | Archivar el archivo recibido como `agreement-signed.pdf` sin modificarlo. |

Ya están implementados la arquitectura KISS, `camelCase`, el identificador
único, la generación DOCX/PDF, las líneas manuscritas, las barreras de
aprobación, la protección del firmado, las pruebas y el ejemplo ficticio.
