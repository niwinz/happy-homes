export interface Plan {
  name: string;
  price: string;
  period: string;
  priceNote: string;
  blurb: string;
  features: string[];
  featured?: boolean;
  badge?: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface ExtraService {
  name: string;
  price: string;
  unit: string;
  description: string;
  excludes: string;
}

export interface ProtocolArea {
  area: string;
  standard: string;
  authorized: string;
  excluded: string;
}

export interface PlanComparisonRow {
  feature: string;
  lite: string;
  care: string;
  complete: string;
}

export const plans: Plan[] = [
  {
    name: "Lite",
    price: "79 €",
    period: "/mes",
    priceNote: "IVA incluido",
    blurb: "Una comprobación mensual documentada para una vivienda sencilla.",
    features: [
      "1 visita por mes natural",
      "Responsable de Casa",
      "Protocolo visual acordado",
      "Informe con imágenes después de cada visita",
      "Aviso de incidencias observadas",
      "Custodia de un juego de llaves",
      "Coordinación adicional presupuestada aparte",
    ],
    ctaLabel: "Consultar Lite",
    ctaHref: "/contacto?plan=lite",
  },
  {
    name: "Care",
    price: "119 €",
    period: "/mes",
    priceNote: "IVA incluido",
    blurb: "La propuesta principal: más continuidad y una gestión sencilla incluida.",
    features: [
      "2 visitas por mes natural",
      "Responsable de Casa",
      "Protocolo visual acordado",
      "Informe con imágenes después de cada visita",
      "Aviso de incidencias observadas",
      "Custodia de un juego de llaves",
      "Hasta 15 min/mes de coordinación remota",
    ],
    featured: true,
    badge: "Recomendado",
    ctaLabel: "Consultar Care",
    ctaHref: "/contacto?plan=care",
  },
  {
    name: "Complete",
    price: "229 €",
    period: "/mes",
    priceNote: "IVA incluido",
    blurb: "Seguimiento más frecuente, sin convertir la visita en vigilancia permanente.",
    features: [
      "4 visitas por mes natural",
      "Responsable de Casa",
      "Protocolo visual acordado",
      "Informe con imágenes después de cada visita",
      "Aviso de incidencias observadas",
      "Custodia de un juego de llaves",
      "Hasta 30 min/mes de coordinación remota",
      "Resumen trimestral de evolución",
    ],
    ctaLabel: "Consultar Complete",
    ctaHref: "/contacto?plan=complete",
  },
];

export const planComparison: PlanComparisonRow[] = [
  {
    feature: "Precio mensual",
    lite: "79 € · IVA incluido",
    care: "119 € · IVA incluido",
    complete: "229 € · IVA incluido",
  },
  {
    feature: "Visitas por mes natural",
    lite: "1 visita",
    care: "2 visitas",
    complete: "4 visitas",
  },
  {
    feature: "Responsable de Casa",
    lite: "Incluido",
    care: "Incluido",
    complete: "Incluido",
  },
  {
    feature: "Protocolo visual acordado",
    lite: "Incluido",
    care: "Incluido",
    complete: "Incluido",
  },
  {
    feature: "Informe con imágenes",
    lite: "Incluido en cada visita",
    care: "Incluido en cada visita",
    complete: "Incluido en cada visita",
  },
  {
    feature: "Aviso de incidencias observadas",
    lite: "Incluido",
    care: "Incluido",
    complete: "Incluido",
  },
  {
    feature: "Custodia de un juego de llaves",
    lite: "Incluida provisionalmente",
    care: "Incluida provisionalmente",
    complete: "Incluida provisionalmente",
  },
  {
    feature: "Coordinación remota",
    lite: "Presupuesto aparte",
    care: "Hasta 15 min/mes incluidos",
    complete: "Hasta 30 min/mes incluidos",
  },
  {
    feature: "Resumen de evolución",
    lite: "No incluido",
    care: "No incluido",
    complete: "Trimestral incluido",
  },
  {
    feature: "Preparación de llegada",
    lite: "Servicio adicional",
    care: "Servicio adicional",
    complete: "Servicio adicional",
  },
  {
    feature: "Visitas extraordinarias",
    lite: "Servicio adicional",
    care: "Servicio adicional",
    complete: "Servicio adicional",
  },
  {
    feature: "Profesionales, materiales y reparaciones",
    lite: "Presupuesto aparte",
    care: "Presupuesto aparte",
    complete: "Presupuesto aparte",
  },
  {
    feature: "Permanencia mensual",
    lite: "Sin permanencia",
    care: "Sin permanencia",
    complete: "Sin permanencia",
  },
];

export const oneOffExtras: ExtraService[] = [
  {
    name: "Visita visual extraordinaria",
    price: "59 €",
    unit: "por visita",
    description: "Protocolo acordado e informe visual, sujeto a zona y disponibilidad.",
    excludes: "No incluye reparaciones ni trabajo técnico.",
  },
  {
    name: "Visita tras temporal o aviso",
    price: "69 €",
    unit: "por visita priorizada",
    description: "Revisión cuando el acceso sea seguro e informe de lo observado.",
    excludes: "No garantiza disponibilidad inmediata.",
  },
  {
    name: "Apertura y cierre a profesional",
    price: "39 €",
    unit: "por acceso · hasta 15 min",
    description: "Identificación, acceso y cierre para una persona autorizada.",
    excludes: "La espera y la supervisión se cobran aparte.",
  },
  {
    name: "Acompañamiento de profesional",
    price: "59 €",
    unit: "primera hora",
    description: "Acceso, presencia e informe breve de la visita del profesional.",
    excludes: "Profesional, materiales y tiempo adicional no incluidos.",
  },
  {
    name: "Tiempo adicional",
    price: "29 €",
    unit: "cada 30 min",
    description: "Permanencia adicional previamente autorizada.",
    excludes: "No incluye trabajo técnico.",
  },
  {
    name: "Preparación previa a llegada",
    price: "Desde 59 €",
    unit: "por servicio",
    description: "Ventilar, activar elementos autorizados y realizar una comprobación final.",
    excludes: "Limpieza, compras y reparaciones no incluidas.",
  },
  {
    name: "Entrega o recogida de llaves",
    price: "39 €",
    unit: "por servicio",
    description: "Verificación del receptor, entrega y registro en zona y horario acordados.",
    excludes: "Copias, espera y desplazamiento especial no incluidos.",
  },
  {
    name: "Compra de bienvenida",
    price: "25 € + compra",
    unit: "por encargo",
    description: "Compra sobre una lista acordada, ticket y colocación en la casa.",
    excludes: "Productos restringidos o transporte especial no incluidos.",
  },
  {
    name: "Coordinación adicional",
    price: "39 €/hora",
    unit: "bloques de 30 min",
    description: "Llamadas, solicitud de presupuestos y seguimiento remoto.",
    excludes: "Presencia, profesionales y materiales no incluidos.",
  },
  {
    name: "Supervisión visual de obra",
    price: "Desde 99 €",
    unit: "por visita",
    description: "Observación visual, fotografías y resumen para el propietario.",
    excludes: "No es dirección de obra, certificación ni control técnico.",
  },
];

export const recurringExtras: ExtraService[] = [
  {
    name: "Limpieza periódica",
    price: "Presupuesto periódico",
    unit: "según frecuencia y alcance",
    description: "Coordinación o servicio profesional conforme a una propuesta aceptada.",
    excludes: "Tareas no incluidas en el presupuesto se valoran aparte.",
  },
  {
    name: "Cuidado de jardín",
    price: "Presupuesto periódico",
    unit: "según vivienda y frecuencia",
    description: "Servicio profesional programado con alcance y calendario acordados.",
    excludes: "Reparaciones, consumibles y trabajos extraordinarios no incluidos.",
  },
  {
    name: "Cuidado de piscina",
    price: "Presupuesto periódico",
    unit: "según instalación y frecuencia",
    description: "Servicio profesional programado según las necesidades de la piscina.",
    excludes: "Reparaciones, piezas y consumibles no presupuestados quedan aparte.",
  },
];

export const protocolAreas: ProtocolArea[] = [
  {
    area: "Acceso",
    standard: "Puerta, cerradura y cambios visibles.",
    authorized: "Abrir o cerrar contraventanas acordadas.",
    excluded: "Investigar intrusiones o prestar seguridad.",
  },
  {
    area: "Registro",
    standard: "Persona, fecha y horas de entrada y salida.",
    authorized: "Ubicación aproximada asociada a la visita.",
    excluded: "Seguimiento permanente de la vivienda.",
  },
  {
    area: "Ambiente",
    standard: "Olores anómalos, condensación y señales visibles.",
    authorized: "Ventilación breve y lectura orientativa de ambiente.",
    excluded: "Diagnosticar humedad o calidad del aire.",
  },
  {
    area: "Agua",
    standard: "Fugas, manchas y goteos visibles en puntos accesibles.",
    authorized: "Abrir grifos, descargar inodoros y revisar el desagüe aparente.",
    excluded: "Desmontar sifones, reparar o certificar fontanería.",
  },
  {
    area: "Electricidad",
    standard: "Estado visual del cuadro y aparatos acordados.",
    authorized: "Encender luces o equipos concretos.",
    excluded: "Manipular el cuadro, probar o reparar instalaciones.",
  },
  {
    area: "Cocina",
    standard: "Estado visual del frigorífico y fugas aparentes.",
    authorized: "Leer temperatura o activar un equipo acordado.",
    excluded: "Manipular gas, limpiar o retirar alimentos sin encargo.",
  },
  {
    area: "Baños",
    standard: "Fugas, cisternas y desagües aparentes.",
    authorized: "Uso breve de grifos y descarga.",
    excluded: "Desatascar o aplicar productos.",
  },
  {
    area: "Cerramientos",
    standard: "Ventanas, persianas y cierres accesibles del checklist.",
    authorized: "Abrir o cerrar elementos seleccionados.",
    excluded: "Trabajos en altura o forzar mecanismos dañados.",
  },
  {
    area: "Climatización",
    standard: "Estado visual y lectura disponible.",
    authorized: "Encendido breve o ajuste previamente acordado.",
    excluded: "Mantenimiento, purga o diagnóstico.",
  },
  {
    area: "Interior general",
    standard: "Cambios visibles, plagas aparentes o suciedad anormal.",
    authorized: "Mover un elemento ligero para revisar un punto acordado.",
    excluded: "Inventario, limpieza o manipulación de pertenencias.",
  },
  {
    area: "Exterior accesible",
    standard: "Fachada, terraza o patio visibles desde una zona segura.",
    authorized: "Riego o tarea simple contratada.",
    excluded: "Cubiertas, escaleras, poda, piscina o trabajos en altura.",
  },
  {
    area: "Salida y cierre",
    standard: "Comprobación del perfil pactado de luces, ventanas y acceso.",
    authorized: "Cerrar la llave de paso cuando se haya acordado y sea seguro.",
    excluded: "Actuaciones no autorizadas salvo riesgo inmediato.",
  },
];

export const processSteps = [
  {
    icon: "mapPin",
    title: "Comprobamos el encaje",
    text: "Nos indicas municipio, tipo y tamaño aproximado de vivienda. Confirmamos cobertura y condiciones.",
  },
  {
    icon: "clipboard",
    title: "Acordamos el protocolo",
    text: "Definimos frecuencia, puntos de revisión, autorizaciones, acceso y elementos excluidos.",
  },
  {
    icon: "home",
    title: "Pasamos por tu casa",
    text: "Tu Responsable de Casa realiza la visita visual y registra cada punto del protocolo.",
  },
  {
    icon: "video",
    title: "Recibes el informe",
    text: "Te contamos qué se revisó, qué se observó y si necesitamos una decisión por tu parte.",
  },
];

export const coverageAreas = ["Costa Brava", "Alt Empordà", "Área de Olot"];

export const serviceLanguages = ["Castellano", "Catalán"];

export const coverageNote =
  "Cuéntanos dónde está tu casa y te confirmamos disponibilidad y condiciones para esa dirección.";

export const faqGroups = [
  {
    title: "El servicio",
    items: [
      {
        q: "¿Qué ocurre después de cada visita?",
        a: "Tu Responsable de Casa te envía un resumen y un informe el mismo día. Indica qué se ha revisado, qué se ha observado y si necesitamos una decisión por tu parte.",
      },
      {
        q: "¿Siempre entra la misma persona?",
        a: "Tienes un Responsable de Casa estable que conoce tu vivienda y es tu contacto. Si hace falta una sustitución, te indicamos quién entrará y su identidad queda registrada en el informe.",
      },
      {
        q: "¿Es un servicio de seguridad?",
        a: "No. Realizamos visitas visuales y preventivas en momentos programados. HappyHomes no sustituye una alarma, un seguro ni un servicio de vigilancia.",
      },
      {
        q: "¿Qué zonas cubrís?",
        a: "Trabajamos en la Costa Brava, el Alt Empordà y el área de Olot. Confirmamos disponibilidad y condiciones después de conocer la ubicación de la casa.",
      },
    ],
  },
  {
    title: "Planes y extras",
    items: [
      {
        q: "¿Qué diferencia hay entre los planes?",
        a: "La calidad del protocolo es la misma. Cambian la frecuencia —una, dos o cuatro visitas por mes natural— y el tiempo de coordinación remota incluido.",
      },
      {
        q: "¿Los precios incluyen IVA?",
        a: "Sí. En este prototipo, Lite cuesta 79 €/mes, Care 119 €/mes y Complete 229 €/mes, con IVA incluido y sin cuota de alta.",
      },
      {
        q: "¿La cuota incluye reparaciones?",
        a: "No. Los profesionales, materiales, esperas y desplazamientos extraordinarios se presupuestan por separado.",
      },
      {
        q: "¿Hay permanencia en la modalidad mensual?",
        a: "La propuesta mensual no tiene permanencia mínima. La cuota se cobra por adelantado y la baja se solicita por escrito hasta 15 días antes del siguiente cobro.",
      },
      {
        q: "¿Puedo pedir una visita adicional?",
        a: "Sí, según cobertura y disponibilidad. La propuesta actual para una visita visual extraordinaria es de 59 €, con IVA incluido.",
      },
    ],
  },
  {
    title: "Evidencia, llaves e incidencias",
    items: [
      {
        q: "¿Grabáis el interior de la casa?",
        a: "Solo con tu consentimiento expreso. La opción principal es vídeo continuo y sin audio. Si prefieres no grabar, documentamos la visita con fotografías fechadas.",
      },
      {
        q: "¿Guardáis las llaves?",
        a: "La propuesta incluye custodiar un juego para realizar las visitas. Se identifica sin dirección visible, cada retirada queda registrada y no se entrega a terceros sin autorización.",
      },
      {
        q: "¿Qué pasa si encontráis una incidencia?",
        a: "Documentamos lo observado y te avisamos según su prioridad. No encargamos gastos sin autorización, salvo el límite de emergencia que se haya acordado por escrito.",
      },
      {
        q: "¿Cuánto tiempo se conserva el vídeo?",
        a: "La propuesta actual establece su eliminación como máximo 15 días después de entregar el informe. Este plazo está pendiente de validación legal y técnica.",
      },
      {
        q: "¿Cuándo respondéis a una consulta?",
        a: "La propuesta actual es responder el mismo día laborable a las consultas recibidas antes de las 17:00 y el siguiente día laborable a las posteriores. El horario propuesto es de lunes a viernes, de 9:00 a 18:00, sin atención 24/7.",
      },
    ],
  },
];

export const homeFaqItems = [
  faqGroups[0].items[0],
  faqGroups[0].items[1],
  faqGroups[0].items[3],
  faqGroups[1].items[2],
];
