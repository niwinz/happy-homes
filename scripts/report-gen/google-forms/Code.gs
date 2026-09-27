/**
 * HappyHomes · Registro de visitas
 *
 * Apps Script vinculado a la hoja "HappyHomes · Control de visitas".
 * Crea un Google Form por visita y conserva cada envío como una revisión.
 */

const CONFIG = Object.freeze({
  DRIVE_FOLDER_ID: "1X97gnQtXLxOnIedfmg9A7gGwSIwLJWKg",
  VISITS_SHEET: "Visitas",
  REVISIONS_SHEET: "Revisiones",
  TIME_ZONE: "Europe/Madrid",
  FORM_VERSION: "visit-intake-v2",
  MAX_PROJECT_TRIGGERS: 20,
  TEMPLATE_FORM_ID_PROPERTY: "FORM_TEMPLATE_ID",
  TEMPLATE_VERSION_PROPERTY: "FORM_TEMPLATE_VERSION",
  TEMPLATE_READY_PROPERTY: "FORM_TEMPLATE_READY",
});

const VISIT_HEADERS = Object.freeze([
  "ID_VISITA",
  "CODIGO_CASA",
  "NUM_VISITA",
  "FECHA_PROGRAMADA",
  "RESPONSABLE_PREVISTO",
  "ESTADO",
  "FORM_ID",
  "URL_RESPUESTA",
  "URL_EDICION",
  "CREADO_EN",
  "NUM_REVISIONES",
  "REVISION_VIGENTE",
  "ULTIMA_RESPUESTA",
  "NOTAS",
]);

const REVISION_HEADERS = Object.freeze([
  "ID_VISITA",
  "FORM_ID",
  "REVISION",
  "RECIBIDO_EN",
  "EMAIL",
  "AUTORIZADO",
  "RESPONSE_ID",
  "VIGENTE",
  "ESTADO_VALIDACION",
  "ADVERTENCIAS",
  "ENTRADA_JSON",
]);

const REPORT_STATUSES = Object.freeze([
  "Correcto",
  "A observar",
  "Requiere decisión",
  "Actuación autorizada",
  "No revisado",
]);

const CHECK_CATEGORIES = Object.freeze([
  { code: "C01", label: "Acceso y puertas" },
  { code: "C02", label: "Ambiente interior" },
  { code: "C03", label: "Agua y baños" },
  { code: "C04", label: "Electricidad e iluminación" },
  { code: "C05", label: "Cocina y frío" },
  { code: "C06", label: "Ventanas y persianas" },
  { code: "C07", label: "Climatización" },
  { code: "C08", label: "Estado interior general" },
  { code: "C09", label: "Exterior accesible" },
  { code: "C10", label: "Salida y cierre" },
]);

const VISIT_STATUS = Object.freeze({
  READY: "Pendiente de formulario",
  OPEN: "Formulario abierto",
  DRAFT: "Borrador recibido",
  REVIEW: "Necesita revisión",
  REJECTED: "Respuesta no autorizada",
  CLOSED: "Formulario cerrado",
});

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("HappyHomes")
    .addItem("Preparar hoja de control", "setupHappyHomesWorkbook")
    .addItem("Mostrar plantilla maestra", "showFormTemplate")
    .addItem("Confirmar plantilla preparada", "confirmReadyTemplate")
    .addSeparator()
    .addItem("Crear formulario para la fila", "createFormForSelectedVisit")
    .addItem("Mostrar enlaces del formulario", "showSelectedFormLinks")
    .addItem("Cerrar formulario", "closeSelectedForm")
    .addItem("Reabrir formulario", "reopenSelectedForm")
    .addSeparator()
    .addItem("Marcar revisión seleccionada como vigente", "markSelectedRevisionCurrent")
    .addToUi();
}

function setupHappyHomesWorkbook() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.setSpreadsheetTimeZone(CONFIG.TIME_ZONE);
  PropertiesService.getScriptProperties().setProperty(
    "CONTROL_SPREADSHEET_ID",
    spreadsheet.getId(),
  );

  const visits = ensureSheet_(spreadsheet, CONFIG.VISITS_SHEET, VISIT_HEADERS);
  const revisions = ensureSheet_(
    spreadsheet,
    CONFIG.REVISIONS_SHEET,
    REVISION_HEADERS,
  );

  formatSheet_(visits, VISIT_HEADERS.length);
  formatSheet_(revisions, REVISION_HEADERS.length);
  addVisitDataValidation_(visits);
  const template = ensureFormTemplate_();

  showTemplateDialog_(template);
}

function createFormForSelectedVisit() {
  const context = getSelectedRowContext_(CONFIG.VISITS_SHEET);
  const row = readRow_(context.sheet, context.row, VISIT_HEADERS);

  if (row.FORM_ID) {
    throw new Error("La visita seleccionada ya tiene un formulario.");
  }

  const houseCode = normalizeHouseCode_(row.CODIGO_CASA);
  const visitNumber = normalizeVisitNumber_(row.NUM_VISITA);
  const scheduledDate = normalizeRequiredDate_(row.FECHA_PROGRAMADA);
  const visitId = buildVisitId_(houseCode, visitNumber, scheduledDate);
  const title = buildFormTitle_(houseCode, visitNumber, scheduledDate);
  const duplicateRow = findRowByValue_(
    context.sheet,
    "ID_VISITA",
    visitId,
    VISIT_HEADERS,
  );

  if (duplicateRow && duplicateRow !== context.row) {
    throw new Error("Ya existe otra fila con el identificador " + visitId + ".");
  }

  assertTriggerCapacity_();
  const template = getReadyFormTemplate_();
  const folder = getVisitFolder_(houseCode, scheduledDate);
  const formFile = DriveApp.getFileById(template.getId()).makeCopy(title, folder);
  const form = FormApp.openById(formFile.getId());
  configureVisitForm_(form, title, visitId, houseCode, visitNumber, scheduledDate);
  ensureFormSubmitTrigger_(form);

  writeRow_(context.sheet, context.row, VISIT_HEADERS, {
    ID_VISITA: visitId,
    CODIGO_CASA: houseCode,
    NUM_VISITA: visitNumber,
    FECHA_PROGRAMADA: scheduledDate,
    ESTADO: VISIT_STATUS.OPEN,
    FORM_ID: form.getId(),
    URL_RESPUESTA: form.getPublishedUrl(),
    URL_EDICION: form.getEditUrl(),
    CREADO_EN: new Date(),
    NUM_REVISIONES: 0,
  });

  publishForm_(form);

  showLinksDialog_(title, form.getPublishedUrl(), form.getEditUrl());
}

function configureVisitForm_(
  form,
  title,
  visitId,
  houseCode,
  visitNumber,
  scheduledDate,
) {
  const formattedDate = formatDate_(scheduledDate);

  form
    .setTitle(title)
    .setDescription(
      "Registro interno de HappyHomes.\n\n" +
        "Casa: " + houseCode + "\n" +
        "Visita: " + padNumber_(visitNumber, 3) + "\n" +
        "Fecha prevista: " + formattedDate + "\n" +
        "Identificador: " + visitId + "\n\n" +
        "No introduzcas dirección completa, códigos de acceso, ubicación de " +
        "llaves ni periodos de ausencia.",
    )
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(true)
    .setProgressBar(true)
    .setShuffleQuestions(false)
    .setConfirmationMessage(
      "Respuesta registrada como una nueva revisión. El borrador deberá " +
        "validarse y revisarse antes de generar el informe.",
    )
    .setAcceptingResponses(false);
}

function configureFormTemplate_(form) {
  form
    .setDescription(
      "Plantilla interna de HappyHomes. No responder. La configuración de " +
      "email debe permanecer en «Verificado» y debe incluir una pregunta " +
        "de subida de archivos.",
    )
    .setCollectEmail(true)
    .setLimitOneResponsePerUser(false)
    .setAllowResponseEdits(false)
    .setShowLinkToRespondAgain(true)
    .setProgressBar(true)
    .setShuffleQuestions(false)
    .setConfirmationMessage(
      "Respuesta registrada como una nueva revisión. El borrador deberá " +
        "validarse y revisarse antes de generar el informe.",
    )
    .setAcceptingResponses(false);

  form.addSectionHeaderItem().setTitle("1 · Datos de la visita");
  form
    .addTextItem()
    .setTitle("Persona que realiza la visita")
    .setHelpText("Nombre y apellido; no uses iniciales ni nombres de cliente.")
    .setRequired(true);
  form
    .addDateItem()
    .setTitle("Fecha efectiva de la visita")
    .setRequired(true);
  form.addTimeItem().setTitle("Hora de entrada").setRequired(true);
  form.addTimeItem().setTitle("Hora de salida").setRequired(true);

  form.addPageBreakItem().setTitle("2 · Evidencia");
  form
    .addSectionHeaderItem()
    .setTitle("Sube el vídeo o las fotografías de la visita")
    .setHelpText(
      "Incluye la evidencia en la primera respuesta. Si solo corriges una " +
        "anotación posterior, no hace falta volver a subirla.",
    );

  addChecklistSection_(form, "3 · Acceso y ambiente", CHECK_CATEGORIES.slice(0, 3));
  addChecklistSection_(form, "4 · Sistemas de la casa", CHECK_CATEGORIES.slice(3, 7));
  addChecklistSection_(form, "5 · Estado general y cierre", CHECK_CATEGORIES.slice(7));

  form.addPageBreakItem().setTitle("6 · Cierre");
  form
    .addParagraphTextItem()
    .setTitle("Decisión que debe tomar el propietario")
    .setHelpText("Solo si algún punto tiene el estado Requiere decisión.")
    .setRequired(false);
  form
    .addTextItem()
    .setTitle("Coste o presupuesto")
    .setHelpText("Indica importe y fuente, o escribe: Pendiente de presupuesto.")
    .setRequired(false);
  form
    .addDateItem()
    .setTitle("Próxima visita prevista")
    .setRequired(false);
  form
    .addParagraphTextItem()
    .setTitle("Nota para la revisión humana")
    .setHelpText("Esta nota es interna y no aparecerá en el informe.")
    .setRequired(false);
  form
    .addCheckboxItem()
    .setTitle("Confirmación final")
    .setChoiceValues([
      "He revisado la respuesta y no contiene direcciones, accesos ni llaves",
    ])
    .setRequired(true);
}

function addChecklistSection_(form, title, categories) {
  form.addPageBreakItem().setTitle(title);

  categories.forEach(function (category) {
    form
      .addMultipleChoiceItem()
      .setTitle("[" + category.code + "] " + category.label + " · Estado")
      .setChoiceValues(REPORT_STATUSES.slice())
      .setRequired(true);
    form
      .addParagraphTextItem()
      .setTitle("[" + category.code + "] " + category.label + " · Anotación")
      .setHelpText(
        "Necesaria si el estado no es Correcto: hecho observado, actuación o " +
          "motivo por el que no se revisó. Si hubo una actuación, indica qué " +
          "se hizo y de dónde procede la autorización.",
      )
      .setRequired(false);
  });
}

function ensureFormTemplate_() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty(CONFIG.TEMPLATE_FORM_ID_PROPERTY);
  const existingVersion = properties.getProperty(CONFIG.TEMPLATE_VERSION_PROPERTY);

  if (existingId && existingVersion === CONFIG.FORM_VERSION) {
    try {
      return FormApp.openById(existingId);
    } catch (error) {
      properties.deleteProperty(CONFIG.TEMPLATE_FORM_ID_PROPERTY);
      properties.deleteProperty(CONFIG.TEMPLATE_VERSION_PROPERTY);
      properties.deleteProperty(CONFIG.TEMPLATE_READY_PROPERTY);
    }
  }

  const form = FormApp.create("HappyHomes · Plantilla maestra de visita", false);
  try {
    configureFormTemplate_(form);
    const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
    DriveApp.getFileById(form.getId()).moveTo(folder);
    properties.setProperty(CONFIG.TEMPLATE_FORM_ID_PROPERTY, form.getId());
    properties.setProperty(CONFIG.TEMPLATE_VERSION_PROPERTY, CONFIG.FORM_VERSION);
    properties.setProperty(CONFIG.TEMPLATE_READY_PROPERTY, "false");
    return form;
  } catch (error) {
    try {
      DriveApp.getFileById(form.getId()).setTrashed(true);
    } catch (cleanupError) {
      // Conserva el error original de configuración.
    }
    throw error;
  }
}

function getReadyFormTemplate_() {
  const properties = PropertiesService.getScriptProperties();
  const ready = properties.getProperty(CONFIG.TEMPLATE_READY_PROPERTY);

  if (ready !== "true") {
    throw new Error(
      "Antes de crear visitas, configura el email verificado y la subida de " +
        "archivos en la plantilla; después usa «Confirmar plantilla preparada».",
    );
  }

  return ensureFormTemplate_();
}

function showFormTemplate() {
  showTemplateDialog_(ensureFormTemplate_());
}

function confirmReadyTemplate() {
  const template = ensureFormTemplate_();
  const ui = SpreadsheetApp.getUi();

  if (!hasFileUploadItem_(template)) {
    ui.alert(
      "Falta la subida de archivos",
      "Añade a la sección Evidencia una pregunta de tipo «Subir " +
        "archivos» antes de confirmar la plantilla.",
      ui.ButtonSet.OK,
    );
    return;
  }

  const answer = ui.alert(
    "Confirmar configuración",
    "¿Has abierto la plantilla y seleccionado Ajustes → Respuestas → " +
      "Recopilar direcciones de correo → Verificado? Esta opción exige iniciar " +
      "sesión. Confirma también que la subida admite vídeos e imágenes y es " +
      "opcional para permitir correcciones sin volver a subir el vídeo.",
    ui.ButtonSet.YES_NO,
  );

  if (answer !== ui.Button.YES) return;

  PropertiesService.getScriptProperties().setProperty(
    CONFIG.TEMPLATE_READY_PROPERTY,
    "true",
  );
  ui.alert(
    "Plantilla confirmada",
    "Ya puedes crear formularios de visita. No cambies el email verificado ni " +
      "la pregunta de subida de la plantilla.",
    ui.ButtonSet.OK,
  );
}

function showTemplateDialog_(form) {
  const editUrl = escapeHtml_(form.getEditUrl());
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:12px;line-height:1.55">' +
      "<strong>Hoja y plantilla preparadas</strong>" +
      "<ol>" +
      '<li><a href="' + editUrl + '" target="_blank">Abrir la plantilla</a>.</li>' +
      "<li>En Ajustes → Respuestas, selecciona «Recopilar direcciones de " +
      "correo → Verificado».</li>" +
      "<li>En la sección Evidencia, añade una pregunta «Subir archivos» llamada " +
      "«Evidencia de la visita».</li>" +
      "<li>Permite vídeos e imágenes, hasta 10 archivos y 10 GB por archivo; " +
      "déjala opcional para no repetir el vídeo al corregir una respuesta.</li>" +
      "<li>Vuelve a la hoja y usa HappyHomes → Confirmar plantilla preparada.</li>" +
      "</ol>" +
      "<p>Después podrás añadir una visita y crear su formulario.</p>" +
      "</div>",
  ).setWidth(500).setHeight(380);
  SpreadsheetApp.getUi().showModalDialog(html, "Preparar formularios");
}

function handleFormSubmit(event) {
  if (!event || !event.response) {
    throw new Error("El manejador necesita un evento de envío de Google Forms.");
  }

  const formId = event.source.getId();
  const response = event.response;
  const email = String(response.getRespondentEmail() || "").trim().toLowerCase();
  const spreadsheet = getControlSpreadsheet_();
  const visitsSheet = spreadsheet.getSheetByName(CONFIG.VISITS_SHEET);
  const revisionsSheet = spreadsheet.getSheetByName(CONFIG.REVISIONS_SHEET);
  const visitRow = findRowByValue_(visitsSheet, "FORM_ID", formId, VISIT_HEADERS);

  if (!visitRow) {
    throw new Error("No se encontró la visita correspondiente al formulario.");
  }

  const visit = readRow_(visitsSheet, visitRow, VISIT_HEADERS);
  const answers = collectAnswers_(response);
  const authorized = isAuthorizedFolderEditor_(email);
  const uploadedFileIds = collectUploadedFileIds_(response);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const existingResponse = findRowByValue_(
      revisionsSheet,
      "RESPONSE_ID",
      response.getId(),
      REVISION_HEADERS,
    );
    if (existingResponse) return;

    const revision = countRevisions_(revisionsSheet, formId) + 1;
    let uploadedFiles;
    if (!authorized) {
      uploadedFiles = uploadedFileIds.map(function (fileId) {
        return { driveFileId: fileId, processingStatus: "rejected" };
      });
    } else if (uploadedFileIds.length > 0) {
      uploadedFiles = organizeUploadedFiles_(uploadedFileIds, visit, revision);
    } else {
      uploadedFiles = getLatestEvidenceAssets_(revisionsSheet, formId);
    }

    const warnings = validateIntake_(answers, authorized, uploadedFiles);
    const validationState = authorized
      ? warnings.length > 0
        ? "needs-review"
        : "draft"
      : "rejected";
    const input = buildIntakeJson_(
      visit,
      response,
      answers,
      email,
      revision,
      validationState,
      warnings,
      uploadedFiles,
    );

    appendRevision_(revisionsSheet, {
      ID_VISITA: visit.ID_VISITA,
      FORM_ID: formId,
      REVISION: revision,
      RECIBIDO_EN: response.getTimestamp(),
      EMAIL: email,
      AUTORIZADO: authorized ? "Sí" : "No",
      RESPONSE_ID: response.getId(),
      VIGENTE: "No",
      ESTADO_VALIDACION: validationState,
      ADVERTENCIAS: JSON.stringify(warnings),
      ENTRADA_JSON: JSON.stringify(input),
    });

    writeRow_(visitsSheet, visitRow, VISIT_HEADERS, {
      ESTADO: authorized
        ? warnings.length > 0
          ? VISIT_STATUS.REVIEW
          : VISIT_STATUS.DRAFT
        : VISIT_STATUS.REJECTED,
      NUM_REVISIONES: revision,
      ULTIMA_RESPUESTA: response.getTimestamp(),
    });
  } finally {
    lock.releaseLock();
  }
}

function buildIntakeJson_(
  visit,
  response,
  answers,
  email,
  revision,
  validationState,
  warnings,
  uploadedFiles,
) {
  const checks = CHECK_CATEGORIES.map(function (category) {
    return {
      code: category.code,
      label: category.label,
      status: answers["[" + category.code + "] " + category.label + " · Estado"] || "",
      note:
        answers["[" + category.code + "] " + category.label + " · Anotación"] || "",
      sourceRefs: [
        "FORM_RESPONSE:" + response.getId() + ":" + category.code + ":status",
        "FORM_RESPONSE:" + response.getId() + ":" + category.code + ":note",
      ],
    };
  });

  return {
    inputVersion: CONFIG.FORM_VERSION,
    visitId: String(visit.ID_VISITA),
    revision: revision,
    houseCode: String(visit.CODIGO_CASA),
    visitNumber: Number(visit.NUM_VISITA),
    scheduledDate: toIsoDate_(visit.FECHA_PROGRAMADA),
    submittedAt: response.getTimestamp().toISOString(),
    visitor: {
      name: answers["Persona que realiza la visita"] || "",
      email: email,
      plannedName: String(visit.RESPONSABLE_PREVISTO || ""),
    },
    actualDate: toIsoDate_(answers["Fecha efectiva de la visita"]),
    startedAt: normalizeTimeAnswer_(answers["Hora de entrada"]),
    finishedAt: normalizeTimeAnswer_(answers["Hora de salida"]),
    evidence: {
      mode: inferEvidenceMode_(uploadedFiles),
      assets: uploadedFiles,
    },
    checks: checks,
    summary: {
      generalStatus: deriveGeneralStatus_(answers),
      ownerDecision:
        answers["Decisión que debe tomar el propietario"] || "",
      costOrQuote: answers["Coste o presupuesto"] || "",
      nextVisit: toIsoDate_(answers["Próxima visita prevista"]),
      internalReviewNote: answers["Nota para la revisión humana"] || "",
    },
    workflow: {
      status: validationState,
      source: "google-forms",
      responseId: response.getId(),
      warnings: warnings,
    },
  };
}

function validateIntake_(answers, authorized, uploadedFiles) {
  const warnings = [];

  if (!authorized) {
    warnings.push("El email no tiene permiso de edición en la carpeta compartida.");
  }

  CHECK_CATEGORIES.forEach(function (category) {
    const statusTitle = "[" + category.code + "] " + category.label + " · Estado";
    const noteTitle = "[" + category.code + "] " + category.label + " · Anotación";
    const status = answers[statusTitle];
    const note = String(answers[noteTitle] || "").trim();

    if (status !== "Correcto" && !note) {
      warnings.push(category.label + ": el estado requiere una anotación.");
    }
  });

  if (!uploadedFiles || uploadedFiles.length === 0) {
    warnings.push("No se ha recibido ningún vídeo ni fotografía.");
  } else if (
    uploadedFiles.some(function (file) {
      return file.processingStatus === "error";
    })
  ) {
    warnings.push("No se pudieron organizar todos los archivos de evidencia.");
  } else if (authorized && inferEvidenceMode_(uploadedFiles) === "unknown") {
    warnings.push("La evidencia subida no es un vídeo ni una imagen reconocible.");
  }

  const hasDecisionCheck = CHECK_CATEGORIES.some(function (category) {
    return (
      answers["[" + category.code + "] " + category.label + " · Estado"] ===
      "Requiere decisión"
    );
  });
  if (
    hasDecisionCheck &&
    !String(answers["Decisión que debe tomar el propietario"] || "").trim()
  ) {
    warnings.push("Falta concretar la decisión que debe tomar el propietario.");
  }

  return warnings;
}

function hasFileUploadItem_(form) {
  return form.getItems().some(function (item) {
    return item.getType().toString() === "FILE_UPLOAD";
  });
}

function collectUploadedFileIds_(response) {
  const ids = [];

  response.getItemResponses().forEach(function (itemResponse) {
    if (itemResponse.getItem().getType().toString() !== "FILE_UPLOAD") return;

    const value = itemResponse.getResponse();
    const values = Array.isArray(value) ? value : [value];
    values.forEach(function (fileId) {
      const normalized = String(fileId || "").trim();
      if (normalized && ids.indexOf(normalized) === -1) ids.push(normalized);
    });
  });

  return ids;
}

function organizeUploadedFiles_(fileIds, visit, revision) {
  const visitFolder = getVisitFolder_(
    String(visit.CODIGO_CASA),
    normalizeRequiredDate_(visit.FECHA_PROGRAMADA),
  );
  const evidenceFolder = findOrCreateFolder_(visitFolder, "Evidencias");
  const visitId = String(visit.ID_VISITA);

  return fileIds.map(function (fileId, index) {
    try {
      const file = DriveApp.getFileById(fileId);
      const extension = getFileExtension_(file.getName());
      const fileName =
        visitId +
        "-R" +
        padNumber_(revision, 3) +
        "-E" +
        padNumber_(index + 1, 2) +
        extension;
      file.setName(fileName);
      file.moveTo(evidenceFolder);

      return {
        driveFileId: fileId,
        fileName: fileName,
        mimeType: file.getMimeType(),
        sizeBytes: file.getSize(),
        processingStatus: "stored",
      };
    } catch (error) {
      return {
        driveFileId: fileId,
        processingStatus: "error",
        error: String(error && error.message ? error.message : error),
      };
    }
  });
}

function getLatestEvidenceAssets_(sheet, formId) {
  const rows = getDataRows_(sheet, REVISION_HEADERS.length);
  const map = getHeaderMap_(sheet, REVISION_HEADERS);

  for (let index = rows.length - 1; index >= 0; index -= 1) {
    const row = rows[index];
    if (String(row[map.FORM_ID - 1]) !== String(formId)) continue;

    try {
      const input = JSON.parse(String(row[map.ENTRADA_JSON - 1] || ""));
      const assets = input && input.evidence && input.evidence.assets;
      if (Array.isArray(assets) && assets.length > 0) {
        return assets.map(function (asset) {
          const inherited = Object.assign({}, asset);
          inherited.inheritedFromRevision = Number(row[map.REVISION - 1]);
          return inherited;
        });
      }
    } catch (error) {
      // Continúa buscando una revisión anterior con evidencia válida.
    }
  }

  return [];
}

function getFileExtension_(fileName) {
  const match = String(fileName || "").match(/(\.[A-Za-z0-9]{1,10})$/);
  return match ? match[1].toLowerCase() : "";
}

function inferEvidenceMode_(uploadedFiles) {
  const mimeTypes = (uploadedFiles || []).map(function (file) {
    return String(file.mimeType || "").toLowerCase();
  });

  if (
    mimeTypes.some(function (mimeType) {
      return mimeType.indexOf("video/") === 0;
    })
  ) {
    return "video";
  }
  if (
    mimeTypes.some(function (mimeType) {
      return mimeType.indexOf("image/") === 0;
    })
  ) {
    return "photos";
  }
  return "unknown";
}

function deriveGeneralStatus_(answers) {
  const statuses = CHECK_CATEGORIES.map(function (category) {
    return answers["[" + category.code + "] " + category.label + " · Estado"] || "";
  });
  const priority = [
    "Requiere decisión",
    "A observar",
    "Actuación autorizada",
    "No revisado",
    "Correcto",
  ];

  for (let index = 0; index < priority.length; index += 1) {
    if (statuses.indexOf(priority[index]) !== -1) return priority[index];
  }
  return "";
}

function markSelectedRevisionCurrent() {
  const context = getSelectedRowContext_(CONFIG.REVISIONS_SHEET);
  const selected = readRow_(context.sheet, context.row, REVISION_HEADERS);

  if (!selected.FORM_ID || !selected.REVISION) {
    throw new Error("Selecciona una fila de revisión válida.");
  }

  if (selected.AUTORIZADO !== "Sí" || selected.ESTADO_VALIDACION === "rejected") {
    throw new Error("Una respuesta no autorizada no puede marcarse como vigente.");
  }

  const rows = getDataRows_(context.sheet, REVISION_HEADERS.length);
  const headerMap = getHeaderMap_(context.sheet, REVISION_HEADERS);

  rows.forEach(function (rowValues, index) {
    if (String(rowValues[headerMap.FORM_ID - 1]) === String(selected.FORM_ID)) {
      context.sheet
        .getRange(index + 2, headerMap.VIGENTE)
        .setValue(index + 2 === context.row ? "Sí" : "No");
    }
  });

  const visits = getControlSpreadsheet_().getSheetByName(CONFIG.VISITS_SHEET);
  const visitRow = findRowByValue_(
    visits,
    "FORM_ID",
    selected.FORM_ID,
    VISIT_HEADERS,
  );
  writeRow_(visits, visitRow, VISIT_HEADERS, {
    REVISION_VIGENTE: selected.REVISION,
  });
}

function closeSelectedForm() {
  setSelectedFormOpenState_(false);
}

function reopenSelectedForm() {
  setSelectedFormOpenState_(true);
}

function setSelectedFormOpenState_(isOpen) {
  const context = getSelectedRowContext_(CONFIG.VISITS_SHEET);
  const row = readRow_(context.sheet, context.row, VISIT_HEADERS);

  if (!row.FORM_ID) {
    throw new Error("La visita seleccionada no tiene formulario.");
  }

  const form = FormApp.openById(String(row.FORM_ID));
  if (isOpen) {
    publishForm_(form);
    ensureFormSubmitTrigger_(form);
  } else {
    form.setAcceptingResponses(false);
    deleteFormSubmitTrigger_(form.getId());
  }

  writeRow_(context.sheet, context.row, VISIT_HEADERS, {
    ESTADO: isOpen ? VISIT_STATUS.OPEN : VISIT_STATUS.CLOSED,
  });
}

function showSelectedFormLinks() {
  const context = getSelectedRowContext_(CONFIG.VISITS_SHEET);
  const row = readRow_(context.sheet, context.row, VISIT_HEADERS);
  if (!row.FORM_ID) {
    throw new Error("La visita seleccionada no tiene formulario.");
  }
  showLinksDialog_(
    String(row.ID_VISITA),
    String(row.URL_RESPUESTA),
    String(row.URL_EDICION),
  );
}

function showLinksDialog_(title, responseUrl, editUrl) {
  const escapedTitle = escapeHtml_(title);
  const escapedResponse = escapeHtml_(responseUrl);
  const escapedEdit = escapeHtml_(editUrl);
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:12px;line-height:1.6">' +
      "<strong>" + escapedTitle + "</strong>" +
      '<p><a href="' + escapedResponse + '" target="_blank">Abrir formulario</a></p>' +
      '<p><a href="' + escapedEdit + '" target="_blank">Editar formulario</a></p>' +
      "</div>",
  ).setWidth(360).setHeight(190);
  SpreadsheetApp.getUi().showModalDialog(html, "Formulario de visita");
}

function ensureFormSubmitTrigger_(form) {
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(function (trigger) {
    return (
      trigger.getHandlerFunction() === "handleFormSubmit" &&
      trigger.getTriggerSourceId() === form.getId()
    );
  });

  if (!exists) {
    if (triggers.length >= CONFIG.MAX_PROJECT_TRIGGERS) {
      throw new Error(
        "No quedan triggers disponibles. Cierra otro formulario antes de abrir este.",
      );
    }
    ScriptApp.newTrigger("handleFormSubmit").forForm(form).onFormSubmit().create();
  }
}

function assertTriggerCapacity_() {
  if (ScriptApp.getProjectTriggers().length >= CONFIG.MAX_PROJECT_TRIGGERS) {
    throw new Error(
      "La cuenta ha alcanzado el límite de triggers. Cierra un formulario " +
        "antes de crear otro.",
    );
  }
}

function publishForm_(form) {
  if (form.supportsAdvancedResponderPermissions()) {
    form.setPublished(true);
  } else {
    form.setAcceptingResponses(true);
  }
}

function deleteFormSubmitTrigger_(formId) {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (
      trigger.getHandlerFunction() === "handleFormSubmit" &&
      trigger.getTriggerSourceId() === formId
    ) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function isAuthorizedFolderEditor_(email) {
  if (!email) return false;

  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const allowed = folder.getEditors().map(function (user) {
    return String(user.getEmail() || "").trim().toLowerCase();
  });
  const owner = folder.getOwner();
  if (owner) {
    allowed.push(String(owner.getEmail() || "").trim().toLowerCase());
  }
  return allowed.indexOf(email.trim().toLowerCase()) !== -1;
}

function getVisitFolder_(houseCode, scheduledDate) {
  const root = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const year = Utilities.formatDate(scheduledDate, CONFIG.TIME_ZONE, "yyyy");
  const yearFolder = findOrCreateFolder_(root, year);
  return findOrCreateFolder_(yearFolder, houseCode);
}

function findOrCreateFolder_(parent, name) {
  const matches = parent.getFoldersByName(name);
  return matches.hasNext() ? matches.next() : parent.createFolder(name);
}

function collectAnswers_(response) {
  const answers = {};
  response.getItemResponses().forEach(function (itemResponse) {
    answers[itemResponse.getItem().getTitle()] = normalizeAnswer_(
      itemResponse.getResponse(),
    );
  });
  return answers;
}

function normalizeAnswer_(value) {
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(String);
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function normalizeTimeAnswer_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, CONFIG.TIME_ZONE, "HH:mm");
  }
  return String(value || "").trim();
}

function appendRevision_(sheet, values) {
  sheet.appendRow(
    REVISION_HEADERS.map(function (header) {
      return values[header] === undefined ? "" : values[header];
    }),
  );
}

function countRevisions_(sheet, formId) {
  if (sheet.getLastRow() < 2) return 0;
  const map = getHeaderMap_(sheet, REVISION_HEADERS);
  return getDataRows_(sheet, REVISION_HEADERS.length).filter(function (row) {
    return String(row[map.FORM_ID - 1]) === String(formId);
  }).length;
}

function ensureSheet_(spreadsheet, name, headers) {
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    headers.forEach(function (header, index) {
      if (existing[index] !== header) {
        throw new Error(
          "La cabecera de " + name + " no coincide en la columna " + (index + 1),
        );
      }
    });
  }
  return sheet;
}

function formatSheet_(sheet, columnCount) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, columnCount).setFontWeight("bold");
  sheet.autoResizeColumns(1, columnCount);
}

function addVisitDataValidation_(sheet) {
  const map = getHeaderMap_(sheet, VISIT_HEADERS);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.keys(VISIT_STATUS).map(function (key) {
      return VISIT_STATUS[key];
    }), true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, map.ESTADO, Math.max(sheet.getMaxRows() - 1, 1)).setDataValidation(rule);
}

function getSelectedRowContext_(requiredSheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const range = sheet.getActiveRange();

  if (sheet.getName() !== requiredSheetName) {
    throw new Error("Selecciona una fila en la pestaña " + requiredSheetName + ".");
  }
  if (!range || range.getRow() < 2) {
    throw new Error("Selecciona una fila de datos, no la cabecera.");
  }
  return { sheet: sheet, row: range.getRow() };
}

function getControlSpreadsheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(
    "CONTROL_SPREADSHEET_ID",
  );
  if (!spreadsheetId) {
    throw new Error("Ejecuta primero setupHappyHomesWorkbook.");
  }
  return SpreadsheetApp.openById(spreadsheetId);
}

function getHeaderMap_(sheet, expectedHeaders) {
  const values = sheet.getRange(1, 1, 1, expectedHeaders.length).getValues()[0];
  const map = {};
  values.forEach(function (header, index) {
    map[header] = index + 1;
  });
  expectedHeaders.forEach(function (header) {
    if (!map[header]) throw new Error("Falta la columna " + header + ".");
  });
  return map;
}

function readRow_(sheet, rowNumber, headers) {
  const values = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const result = {};
  headers.forEach(function (header, index) {
    result[header] = values[index];
  });
  return result;
}

function writeRow_(sheet, rowNumber, headers, updates) {
  if (!rowNumber) throw new Error("No se encontró la fila que se debe actualizar.");
  const map = getHeaderMap_(sheet, headers);
  Object.keys(updates).forEach(function (header) {
    if (!map[header]) throw new Error("Columna desconocida: " + header);
    sheet.getRange(rowNumber, map[header]).setValue(updates[header]);
  });
}

function findRowByValue_(sheet, header, value, headers) {
  if (sheet.getLastRow() < 2) return null;
  const map = getHeaderMap_(sheet, headers);
  const values = sheet
    .getRange(2, map[header], sheet.getLastRow() - 1, 1)
    .getValues();
  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]) === String(value)) return index + 2;
  }
  return null;
}

function getDataRows_(sheet, columnCount) {
  if (sheet.getLastRow() < 2) return [];
  return sheet
    .getRange(2, 1, sheet.getLastRow() - 1, columnCount)
    .getValues();
}

function normalizeHouseCode_(value) {
  const normalized = String(value || "").trim().toUpperCase();
  if (!/^HH-\d{3}$/.test(normalized)) {
    throw new Error("El código de casa debe seguir el formato HH-001.");
  }
  return normalized;
}

function normalizeVisitNumber_(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("El número de visita debe ser un entero positivo.");
  }
  return number;
}

function normalizeRequiredDate_(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new Error("La fecha programada debe ser una fecha válida.");
  }
  return value;
}

function buildVisitId_(houseCode, visitNumber, date) {
  return (
    houseCode +
    "-" +
    Utilities.formatDate(date, CONFIG.TIME_ZONE, "yyyyMMdd") +
    "-V" +
    padNumber_(visitNumber, 3)
  );
}

function buildFormTitle_(houseCode, visitNumber, date) {
  return (
    houseCode +
    " · Visita " +
    padNumber_(visitNumber, 3) +
    " · " +
    Utilities.formatDate(date, CONFIG.TIME_ZONE, "yyyy-MM-dd")
  );
}

function formatDate_(date) {
  return Utilities.formatDate(date, CONFIG.TIME_ZONE, "dd/MM/yyyy");
}

function toIsoDate_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return Utilities.formatDate(value, CONFIG.TIME_ZONE, "yyyy-MM-dd");
  }

  const text = String(value || "").trim();
  let match = text.match(/^(\d{4})[-/]([01]?\d)[-/]([0-3]?\d)$/);
  if (match) {
    return match[1] + "-" + padNumber_(match[2], 2) + "-" + padNumber_(match[3], 2);
  }

  match = text.match(/^([0-3]?\d)[-/]([01]?\d)[-/](\d{4})$/);
  if (match) {
    return match[3] + "-" + padNumber_(match[2], 2) + "-" + padNumber_(match[1], 2);
  }

  return "";
}

function padNumber_(value, length) {
  return String(value).padStart(length, "0");
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
