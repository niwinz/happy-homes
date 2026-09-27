---
name: HH New Contract
description: Crear contratos HappyHomes desde contexto desordenado, confirmar los datos extraídos y generar el acuerdo y la ficha operativa en DOCX/PDF
slash: true
---

# Skill: HH New Contract

## Objetivo

Convertir notas, mensajes, correos o contexto desordenado proporcionado por el
usuario en un expediente contractual HappyHomes validado y confirmado, sin
obligar a la persona operadora a copiar plantillas, conocer rutas o ejecutar el
CLI manualmente.

La skill coordina el proceso. El esquema, las validaciones y la generación de
documentos siguen siendo responsabilidad del CLI determinista del repositorio.

## Fuentes obligatorias

Antes de procesar datos, leer en este orden:

1. `knowledge/critical-info.md`.
2. `knowledge/product/core.md`.
3. `knowledge/business/core.md`.
4. `knowledge/product/service-agreement-template.md`.
5. `knowledge/business/legal-identity.json`.
6. `contracts/AGENTS.md`.
7. `scripts/contract-gen/AGENTS.md`.
8. `contracts/_template/contract.json` y
   `scripts/contract-gen/src/schema.js` para conocer los campos admitidos.

No usar investigación, planes, prototipos ni conversaciones anteriores para
convertir hipótesis en condiciones contractuales aprobadas.

## Principios de seguridad

- No inventar, completar por intuición ni reinterpretar datos ausentes.
- Distinguir siempre entre información explícita, interpretación dudosa y dato
  desconocido.
- No escribir ningún expediente antes de que el usuario confirme la propuesta.
- No guardar códigos de alarma o acceso, contraseñas, credenciales ni
  ubicaciones físicas de llaves. Si aparecen en el contexto, excluirlos e
  informar al usuario sin reproducirlos innecesariamente.
- No modificar la plantilla legal, la identidad del proveedor ni el producto
  canónico durante el alta de un contrato.
- No marcar aprobaciones legales o de negocio por inferencia.
- No generar una versión firmable mientras quede abierta cualquier barrera de
  aprobación. En ese caso, usar siempre `--draft`.
- No crear, modificar, reemplazar ni eliminar `agreement-signed.pdf`.
- No usar servicios externos, búsquedas web ni herramientas remotas con datos
  personales del cliente.
- No hacer commit de expedientes o datos personales salvo petición explícita y
  únicamente cuando la política de acceso, retención y borrado lo permita.

## Flujo

### 1. Recibir el contexto

Aceptar texto libre y archivos aportados por el usuario. Si no hay contexto
suficiente, pedir que comparta lo que tenga; no exigir un formulario previo.

Si el contexto contiene datos reales y la política de custodia, acceso,
retención y borrado de expedientes continúa pendiente, detenerse antes de
persistirlos y explicar el bloqueo. Se puede preparar una propuesta en la
conversación, pero no escribirla en el repositorio.

### 2. Extraer sin escribir

Mapear únicamente datos respaldados por el contexto a:

- `contractId`, si el usuario lo proporciona;
- campos admitidos de `variables`;
- elecciones admitidas de `choices`.

Usar `_template/contract.json` como estructura y `schema.js` como lista cerrada
de campos. No crear claves adicionales para conservar notas o información que
no encaje.

Si falta `contractId`, asignar automáticamente el siguiente identificador real:

1. leer los `contract.json` existentes;
2. excluir `_template` y cualquier expediente con `fictitious: true`;
3. tomar los identificadores con formato `HH-NNN` y hallar su número máximo;
4. usar el siguiente número, con un mínimo de tres dígitos; si no existe ninguno,
   empezar por `HH-001`;
5. comprobar que la carpeta propuesta no exista.

Mostrar el identificador calculado en la confirmación, pero no pedir al usuario
que invente uno. Si el usuario proporciona un `contractId`, validar su formato y
que no colisione con otro expediente.

Clasificar el resultado en cuatro grupos:

1. **Extraído:** valor explícito y su origen breve.
2. **Interpretación a confirmar:** existe más de una lectura razonable.
3. **Desconocido:** se dejará vacío y se convertirá en una línea manuscrita.
4. **Excluido:** secreto operativo, dato no admitido o información innecesaria.

No copiar al contrato frases narrativas completas cuando el valor contractual
pueda conservarse de forma más precisa y breve.

### 3. Presentar y confirmar

Mostrar antes de escribir:

- el `contractId` propuesto;
- una tabla `Campo | Valor propuesto | Origen`;
- las elecciones y casillas propuestas;
- las interpretaciones dudosas;
- los campos relevantes que quedarán para completar a mano;
- cualquier dato excluido, sin repetir secretos;
- el comando y los archivos que se crearán.

Resolver primero las ambigüedades que puedan cambiar precio, alcance, acceso,
consentimiento, gasto, duración, desistimiento o baja. Después pedir una
confirmación explícita con opciones equivalentes a:

1. **Confirmar y generar**.
2. **Corregir datos**.
3. **Cancelar**.

Cuando esté disponible, usar la herramienta de preguntas para esta decisión.
El silencio o una respuesta ambigua no cuentan como confirmación.

### 4. Crear o actualizar el expediente

Solo después de la confirmación:

1. Si el identificador fue automático, recalcularlo para evitar una colisión y
   detenerse si ha cambiado desde la confirmación.
2. Crear `contracts/<contractId>/` si no existe.
3. Crear un único `contract.json` basado en `_template/contract.json`.
4. Hacer coincidir exactamente la carpeta y `contractId`.
5. Escribir solo los valores confirmados y dejar el resto como `""`.
6. Mantener `status: "draft"` salvo aprobación explícita y verificable de las
   condiciones particulares.

Si el expediente ya existe, no sobrescribirlo. Leerlo, mostrar un diff de los
cambios propuestos y solicitar una segunda confirmación antes de editarlo.

### 5. Validar y generar

Con barreras de aprobación abiertas, ejecutar desde la raíz:

```bash
pnpm --filter @happy-homes/contract-gen cli -- \
  --contract <contractId> \
  --document all \
  --format all \
  --draft
```

Usar `--overwrite` solo cuando el usuario haya confirmado la regeneración de
derivados de borrador existentes. Nunca aplicarlo al archivo firmado.

Solo generar sin `--draft` cuando:

- la plantilla ya no exige revisión legal;
- la identidad legal está aprobada;
- el contrato está aprobado;
- el usuario pide expresamente la versión para firma.

### 6. Verificar y entregar

Comprobar y comunicar:

- ruta de `contract.json`;
- rutas de DOCX y PDF generados;
- ruta de la ficha operativa y confirmación de que no contiene datos personales;
- si son borradores o documentos preparados para firma;
- campos que siguen vacíos para completar a mano;
- bloqueos o decisiones que continúan abiertos;
- que `agreement-signed.pdf` no fue tocado.

Si la generación falla, conservar `contract.json`, explicar el error exacto y
no sustituir el documento por contenido generado manualmente.

## Resultado esperado

La persona operadora solo aporta contexto, corrige o confirma la extracción y
recibe los documentos. No necesita copiar archivos, editar JSON ni recordar el
comando del generador.

## Contexto de usuario

$ARGUMENTS
