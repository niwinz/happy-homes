# HappyHomes — formulario interno de visita

- **Estado:** prototipo operativo con datos ficticios; no aprobado para datos de
  clientes
- **Versión de entrada:** `visit-intake-v2`
- **Cuenta prevista:** cuenta personal de Google
- **Carpeta compartida:** `1X97gnQtXLxOnIedfmg9A7gGwSIwLJWKg`
- **Hoja de control:** `HappyHomes · Control de visitas`
- **Implementación:** `scripts/report-gen/google-forms/Code.gs`

## 1. Objetivo

Registrar una visita desde el móvil con la menor fricción posible: quién la hizo,
cuándo, la evidencia subida, el estado de diez categorías y una explicación solo
cuando algo no está correcto.

El formulario no vuelve a preguntar por consentimiento, duración, nombre del
archivo ni características técnicas. El consentimiento de vídeo procede del
acuerdo firmado; la modalidad se deduce del archivo; y el vídeo continuo,
vertical y sin audio es una regla del procedimiento de grabación, no una pregunta
que deba repetirse después de cada visita.

El formulario no genera, aprueba ni envía informes y no llama a una IA.

## 2. Modelo operativo

1. `Visitas` contiene una fila por visita programada y funciona como panel diario.
2. El script crea una plantilla maestra cerrada.
3. En la plantilla, la persona propietaria configura una vez el email como
   `Verificado` y añade manualmente una pregunta de subida de archivos.
4. El menú `HappyHomes` copia la plantilla para la visita seleccionada.
5. La persona visitante completa el formulario después de la visita y sube el
   vídeo o las fotografías.
6. El script mueve los archivos a `AÑO/CÓDIGO_CASA/Evidencias`, les asigna un
   nombre interno y guarda una nueva fila en `Revisiones`.
7. Una corrección posterior crea otra revisión sin borrar la original. Si no se
   vuelve a subir evidencia, hereda los archivos de la revisión anterior.
8. Una persona selecciona la revisión vigente y cierra el formulario al aprobar
   el informe.

`Revisiones` es un historial automático, no una segunda hoja que deba rellenarse
manualmente. Separarla de `Visitas` evita sobrescribir una respuesta anterior o
duplicar todos los datos de la visita.

## 3. Autorización y límites

La plantilla debe usar `Recopilar direcciones de correo → Verificado`, no
`Entrada del respondedor`. La primera opción exige iniciar sesión y evita que se
escriba otro email. Apps Script no permite comprobar este ajuste, por lo que el
prototipo exige una confirmación humana antes de crear copias.

Al recibir una respuesta, el script comprueba que el email pertenece al
propietario o a una persona con permiso de edición en la carpeta compartida. Una
respuesta no autorizada se conserva como `rejected` y nunca puede ser vigente.

Esta validación ocurre después del envío. Una cuenta no autorizada que conozca el
enlace todavía podría intentar responder y subir un archivo. Por ello:

- el piloto solo usa información y archivos ficticios;
- no deben usarse datos reales hasta aprobar privacidad, permisos y proveedor;
- la protección previa de acceso sigue siendo una dependencia pendiente.

## 4. Evidencia subida al formulario

Google Forms permite subir imágenes y vídeos, pero su API no permite crear la
pregunta de subida mediante código. Se añade una sola vez, manualmente, a la
plantilla maestra con esta configuración:

| Ajuste | Valor |
|---|---|
| Tipo de pregunta | `Subir archivos` |
| Título | `Evidencia de la visita` |
| Tipos permitidos | Vídeo e imagen |
| Número máximo | 10 archivos |
| Tamaño máximo por archivo | 10 GB |
| Obligatoria | No |

La pregunta queda opcional para poder corregir una respuesta sin volver a subir
un vídeo grande. El validador avisa si la primera revisión no contiene evidencia.

Los archivos consumen el espacio de la cuenta propietaria. Una cuenta personal
dispone normalmente de 15 GB compartidos entre Drive, Gmail y Fotos, por lo que
esta solución es adecuada para probar el flujo, no para operar a escala. Antes de
datos reales deben resolverse almacenamiento, acceso y eliminación del vídeo en
un máximo de 15 días desde la entrega del informe.

## 5. Preguntas exactas

### Datos de la visita

| Pregunta | Control | Obligatoria |
|---|---|---|
| Persona que realiza la visita | Texto breve | Sí |
| Fecha efectiva de la visita | Fecha | Sí |
| Hora de entrada | Hora | Sí |
| Hora de salida | Hora | Sí |
| Evidencia de la visita | Subida de vídeo o imágenes | No; validada después |

El código de casa, número de visita y fecha programada proceden de `Visitas` y no
se vuelven a escribir.

### Checklist

Cada categoría contiene únicamente:

1. `Estado`, con una opción obligatoria: `Correcto`, `A observar`,
   `Requiere decisión`, `Actuación autorizada` o `No revisado`.
2. `Anotación`, opcional en el formulario y exigida por el validador cuando el
   estado no es `Correcto`. Debe describir el hecho, la actuación autorizada o el
   motivo por el que no se revisó. Cuando hubo una actuación, incluye también de
   dónde procede la autorización.

| ID | Categoría |
|---|---|
| `C01` | Acceso y puertas |
| `C02` | Ambiente interior |
| `C03` | Agua y baños |
| `C04` | Electricidad e iluminación |
| `C05` | Cocina y frío |
| `C06` | Ventanas y persianas |
| `C07` | Climatización |
| `C08` | Estado interior general |
| `C09` | Exterior accesible |
| `C10` | Salida y cierre |

### Cierre

- decisión que debe tomar el propietario, solo cuando proceda;
- coste, fuente o `Pendiente de presupuesto`, solo cuando proceda;
- próxima visita prevista;
- nota interna para revisión humana;
- confirmación de que no se han escrito direcciones, accesos ni llaves.

El estado general se deriva de los diez estados y se revisa posteriormente. Las
actuaciones se explican en la anotación de la categoría marcada como
`Actuación autorizada`, evitando preguntas duplicadas.

## 6. Preparación

1. Crear `HappyHomes · Control de visitas` dentro de la carpeta compartida.
2. Abrir `Extensiones → Apps Script`.
3. Copiar allí `scripts/report-gen/google-forms/Code.gs` y guardar.
4. Recargar la hoja y ejecutar `HappyHomes → Preparar hoja de control`.
5. Abrir la plantilla desde el diálogo o con
   `HappyHomes → Mostrar plantilla maestra`.
6. Seleccionar `Ajustes → Respuestas → Recopilar direcciones de correo →
   Verificado`.
7. En la sección `Evidencia`, añadir la pregunta de subida con la configuración
   de la sección 4.
8. Volver a la hoja y pulsar
   `HappyHomes → Confirmar plantilla preparada`.

El script detecta si falta la pregunta de subida y no permite confirmar la
plantilla. La plantilla queda en la raíz; los formularios de visita se ordenan en
subcarpetas como `2026/HH-999`.

Cada formulario abierto instala un trigger. Apps Script limita a 20 los triggers
por persona y script, por lo que este diseño es solo para pocas visitas abiertas
simultáneamente. Cerrar un formulario elimina su trigger.

## 7. Crear y revisar una visita ficticia

En `Visitas`, completar una fila:

| Campo | Ejemplo |
|---|---|
| `CODIGO_CASA` | `HH-999` |
| `NUM_VISITA` | `1` |
| `FECHA_PROGRAMADA` | una fecha válida de Google Sheets |
| `RESPONSABLE_PREVISTO` | opcional |

Seleccionar la fila y usar `HappyHomes → Crear formulario para la fila`. El
enlace queda en `URL_RESPUESTA`.

Casos mínimos de prueba:

1. Todos los puntos `Correcto` y un vídeo ficticio pequeño.
2. Una marca ficticia bajo una ventana con estado `A observar` y anotación.
3. Climatización `No revisado` con motivo.
4. Un punto `Requiere decisión` y una pregunta concreta.
5. Una segunda respuesta sin volver a subir el vídeo para comprobar la herencia
   de evidencia.

Cada envío aparece en `Revisiones` con email, autorización, número, advertencias
y JSON. Para elegir uno, seleccionar su fila y usar
`HappyHomes → Marcar revisión seleccionada como vigente`.

## 8. Verificación manual

- El formulario exige iniciar sesión y no permite escribir manualmente el email.
- El archivo subido termina en `AÑO/CÓDIGO_CASA/Evidencias`.
- El archivo recibe un nombre como `HH-999-20260927-V001-R001-E01.mp4`.
- Una cuenta sin edición en la carpeta queda marcada como no autorizada.
- Un estado distinto de `Correcto` sin anotación produce una advertencia.
- Una decisión sin pregunta concreta produce una advertencia.
- Dos envíos generan revisiones 1 y 2 sin sobrescribir información.
- La segunda revisión puede reutilizar la evidencia de la primera.
- Solo una revisión queda marcada como vigente.
- El JSON no contiene dirección, acceso ni referencias de llaves.

## 9. Siguiente paso

Después de validar el formulario con casos ficticios se conectará la entrada
`visit-intake-v2` al esquema `visit-report-v1` y a las plantillas HTML. El uso
con visitas reales sigue bloqueado hasta aprobar privacidad, almacenamiento,
protección de informes y borrado de evidencias.
