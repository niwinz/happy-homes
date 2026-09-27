# Contratos de clientes

Cada contrato utiliza una sola carpeta con un código opaco:

```text
clients/<contract_id>/
├── contract.json
├── agreement-draft.docx
├── agreement-draft.pdf
├── agreement.docx
├── agreement.pdf
└── agreement-signed.pdf
```

- `contract.json` contiene juntos los datos conocidos del cliente, la vivienda,
  el servicio y las elecciones.
- Todos los campos usan `camelCase`; `contractId` es el único identificador y no
  se repite como código de vivienda.
- Los campos ausentes o vacíos se convierten en líneas para rellenar a mano.
- `agreement-draft.docx` y `agreement-draft.pdf` son derivados regenerables.
- `agreement.docx` y `agreement.pdf` solo se generan cuando todas las
  aprobaciones están cerradas y constituyen la versión preparada para firmar.
- `agreement-signed.pdf` se añade cuando se firma y nunca se sobrescribe. Una
  corrección exige una adenda o un contrato nuevo.
- Nunca se guardan códigos de alarma o acceso, contraseñas, credenciales ni la
  ubicación física de llaves.
- Las rutas usan códigos, nunca nombres personales.

La identidad del proveedor está en `../legal-identity.json`. Para crear un
contrato, copiar `_template/contract.json` a una nueva carpeta, cambiar
`contractId` y completar únicamente los datos conocidos.

## Procedimiento operativo

### 1. Preparar los datos

1. Comprobar `../legal-identity.json`. Solo sustituir sus datos o estados con
   información confirmada; `fictitious: true` identifica el fixture actual.
2. Crear `clients/<contract_id>/` y copiar `_template/contract.json` como
   `contract.json`.
3. Hacer coincidir el nombre de la carpeta y `contractId`.
4. Completar únicamente los datos conocidos. Un campo ausente o `""` se convierte
   en una línea para rellenar a mano.
5. Indicar la persona responsable en `homeManagerNameAndContact`. Puede ser la
   misma persona proveedora o representante.
6. Usar únicamente claves `camelCase`. El generador rechaza claves desconocidas.
7. No introducir secretos operativos ni nombres personales en la ruta.

### 2. Generar y revisar el borrador

```bash
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract <contract_id> \
  --format all \
  --draft
```

Usar `--overwrite` únicamente para regenerar estos derivados. Antes de enviarlos,
comprobar:

- aviso visible de borrador;
- datos de proveedor, responsable y cliente;
- líneas en los campos desconocidos;
- casillas y condiciones económicas;
- ausencia de secretos, placeholders `{{...}}` y notas internas.

El borrador actual indica **NO FIRMAR** y no se utiliza para contratar.

### 3. Preparar la versión para firma

Este paso solo puede realizarse después de aprobación legal y de negocio
explícita. Un agente no debe cerrar estas puertas por iniciativa propia:

- `legal_review_required: false` en la plantilla revisada;
- `status: "approved"` y `legalReviewApproved: true` en
  `legal-identity.json`;
- `status: "approved"` en `contract.json`.

Después se genera sin `--draft`:

```bash
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract <contract_id> \
  --format all
```

El resultado es `agreement.docx` y `agreement.pdf`.

### 4. Archivar el original firmado

1. Firmar mediante el procedimiento acordado fuera del generador.
2. Guardar el PDF original exacto como `agreement-signed.pdf` en la misma carpeta.
3. No editar, comprimir, regenerar ni sobrescribir ese archivo.
4. Si hay un error posterior, crear una adenda o un nuevo `contractId`.

## Registro de pendientes de esta tarea

Este es el índice único de pendientes del sistema contractual. No sustituye las
fuentes canónicas enlazadas: sirve para evitar que un bloqueo quede disperso u
oculto. La implementación del generador está terminada; los siguientes puntos
siguen abiertos:

| Pendiente | Bloquea | Fuente y criterio de cierre |
|---|---|---|
| Resolver las decisiones legales, de producto y operativas del acuerdo | Cualquier documento firmable | Lista canónica en [`../../product/service-agreement-template.md`](../../product/service-agreement-template.md), «Decisiones que bloquean el uso de la plantilla». Deben quedar aprobadas y reflejadas también en el producto canónico cuando corresponda. |
| Sustituir la identidad ficticia por los datos reales del proveedor | Cualquier contrato real | `../legal-identity.json`, con datos verificados, `fictitious: false`, `status: "approved"` y `legalReviewApproved: true`. El NIF de prueba actual es deliberadamente inválido. |
| Completar y aprobar los datos de cada contrato real | Ese contrato | `clients/<contract_id>/contract.json`, sin datos ficticios, con las condiciones particulares confirmadas y `status: "approved"`. |
| Aprobar el mecanismo operativo de firma y la comprobación de identidad/representación | Firma y archivo | Decisión de negocio y legal documentada antes de aplicar el paso 4; la firma se realiza fuera del generador. |
| Definir custodia, permisos, copias de seguridad, retención y borrado de expedientes | Uso de datos reales | Política legal y técnica que incluya el repositorio Git, su historial, sus copias y el procedimiento de purga cuando corresponda. La necesidad está registrada también en las notas internas de la plantilla. |
| Hacer la revisión final del documento aprobado | Entrega para firma | Generar sin `--draft` y revisar todas las páginas, tablas, casillas, firmas, enlaces y accesibilidad del PDF. No basta con que la compilación termine. |
| Incorporar el logotipo final en DOCX y PDF | No bloquea el borrador; mejora de presentación | Sustituir el wordmark tipográfico por `knowledge/brand/assets/logo.svg` de forma coherente en ambos formatos y repetir la revisión visual. |
| Archivar el primer original firmado | Cierre de cada expediente | Conservar el archivo recibido como `agreement-signed.pdf`, sin regenerarlo ni sobrescribirlo. Actualmente no existe porque el ejemplo es ficticio. |

No son pendientes: la arquitectura KISS, el esquema `camelCase`, el identificador
único `contractId`, la conversión DOCX/PDF, las líneas para datos desconocidos,
las barreras de aprobación, la protección de `agreement-signed.pdf`, las pruebas
automatizadas y el ejemplo ficticio de borrador ya están implementados.

## Regenerar el ejemplo ficticio

Desde la raíz del repositorio:

```bash
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract HH-TEST-001 \
  --format all \
  --draft \
  --overwrite
```

Mientras la plantilla, la identidad legal o el contrato estén pendientes de
aprobación, omitir `--draft` produce un error. `--overwrite` solo reemplaza los
derivados no firmados.

La guía técnica para agentes está en
[`../../../scripts/contract-gen/AGENTS.md`](../../../scripts/contract-gen/AGENTS.md).
