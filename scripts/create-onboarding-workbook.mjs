import { utils, writeFile } from "xlsx";
import { existsSync, mkdirSync } from "node:fs";

const workbookPath = "data/vodafone_onboarding_base_dinamica.xlsx";
const force = process.argv.includes("--force");

mkdirSync("data", { recursive: true });

if (existsSync(workbookPath) && !force) {
  console.log("Workbook already exists. Use --force to overwrite.");
  process.exit(0);
}

const asesores = [
  ["adv-001", "Marina Soler Prieto", "INT-2401", "2026-06-10", "Laura Campos", "Mañana", "Residencial fibra y móvil", "En formación", "+34 600 111 222", "marina.soler@example.com", "Buen dominio de argumentario, pendiente reforzar objeciones de precio.", "alto potencial; tarifas", 72, "Completar simulación de llamada y validar checklist de cancelación de movilidad."],
  ["adv-002", "Nabil Ortega Ruiz", "INT-2402", "2026-06-11", "Sergio Vidal", "Tarde", "Valor convergente", "Bloqueado", "+34 600 333 444", "nabil.ortega@example.com", "Bloqueo operativo por retail pendiente y falta de responsable.", "bloqueo; retail", 38, "Asignar responsable y escalar activación de retail antes del cierre del día."],
  ["adv-003", "Claudia Beltrán Mesa", "INT-2403", "2026-06-12", "Laura Campos", "Mañana", "Autónomos", "Credenciales pendientes", "+34 600 555 666", "claudia.beltran@example.com", "Documentación revisada. Pendiente activación de usuario Vodafone.", "pre-ingreso; documentación ok", 51, "Revisar credenciales y confirmar formación inicial."],
  ["adv-004", "Irene Vega Santos", "INT-2404", "2026-06-09", "Pablo Martín", "Partido", "Low cost", "Listo para producción", "+34 600 777 888", "irene.vega@example.com", "Apta para primeras llamadas con seguimiento de calidad diario.", "producción inicial; apta", 94, "Iniciar producción inicial con revisión de primeras ventas."],
  ["adv-005", "Hugo Navarro Gil", "INT-2405", "2026-06-12", "Marta León", "Tarde", "Residencial valor", "Pendiente de contrato", "+34 600 999 111", "hugo.navarro@example.com", "Pendiente firma y explicación final de normativa.", "contrato; seguimiento", 44, "Enviar recordatorio de firma y agendar inducción operativa."],
];
const access = [
  ["adv-001", "Activo", "Activo", "Activo", "Activo", "Confirmado", "Firmado", "2026-06-09T09:00:00Z", "2026-06-10T11:20:00Z", "Diego Ramos", "", "Activo", "Accesos validados."],
  ["adv-002", "Solicitado", "Activo", "Pendiente", "Pendiente", "Enviado", "Pendiente", "2026-06-09T08:00:00Z", "", "", "Retail pendiente más de 48 horas", "Bloqueado", "Caso requiere escalamiento."],
  ["adv-003", "Solicitado", "Solicitado", "Activo", "En proceso", "Confirmado", "Firmado", "2026-06-11T07:30:00Z", "", "Marta León", "", "En proceso", "Dentro del SLA."],
  ["adv-004", "Activo", "Activo", "Activo", "Activo", "Confirmado", "Firmado", "2026-06-08T10:00:00Z", "2026-06-09T12:10:00Z", "Pablo Martín", "", "Activo", "Todas las validaciones cerradas."],
  ["adv-005", "No solicitado", "Solicitado", "Pendiente", "Pendiente", "Enviado", "Pendiente", "2026-06-12T08:15:00Z", "", "Marta León", "Contrato pendiente de firma", "Pendiente", "Necesita seguimiento de firma."],
];
const induction = [
  ["adv-001", "Explicado", "2026-06-10", "Laura Campos", "Sí", "Explicado", "Explicado", "Explicado", "Reforzado", "Explicado", "En progreso", "Pendiente reforzar cierre de constancia.", "Se deja constancia interna parcial."],
  ["adv-002", "Pendiente", "", "", "No", "Explicado", "Pendiente", "Pendiente", "Pendiente", "Explicado", "Requiere nueva explicación", "No existe constancia de movilidad.", ""],
  ["adv-003", "Explicado", "2026-06-12", "Marta León", "Sí", "Explicado", "Explicado", "Explicado", "Pendiente", "Explicado", "En progreso", "Falta calidad comercial inicial.", "Constancia de movilidad registrada."],
  ["adv-004", "Explicado", "2026-06-09", "Pablo Martín", "Sí", "Explicado", "Explicado", "Explicado", "Explicado", "Explicado", "Completo", "Evidencia completa.", "Constancia interna completa."],
  ["adv-005", "Pendiente", "", "", "No", "Pendiente", "Pendiente", "Pendiente", "Pendiente", "Pendiente", "Pendiente", "Pendiente sesión de inducción.", ""],
];
const tarifas = [
  ["tar-001", "Fibra 600 + Móvil 50GB", 39.99, "Fibra, móvil y fijo", "600Mb", 1, "50GB", "Opcional", "12 meses", "Sujeto a cobertura", "Equilibrio para hogares que quieren estabilidad y datos suficientes.", "Familias pequeñas y teletrabajo moderado", "Está caro; No quiero permanencia", "Comparar coste total frente a servicios separados.", "Activa", "residencial; valor; fibra; móvil"],
  ["tar-002", "Solo Móvil Ilimitada", 24.99, "Móvil", "No aplica", 1, "Ilimitados", "No", "Sin permanencia móvil", "Uso razonable", "Libertad para clientes que no quieren cambiar fibra.", "Usuarios intensivos de móvil", "Ya tengo otra compañía", "Centrar en libertad, cobertura y simplicidad.", "Activa", "móvil; low cost"],
  ["tar-003", "Autónomo Pro Fibra 1Gb", 54.99, "Fibra, móvil y soporte", "1Gb", 2, "100GB", "Opcional", "12 meses", "Requiere documentación profesional", "Productividad y soporte para negocio pequeño.", "Autónomos y microempresas", "Lo voy a pensar", "Diagnosticar coste de interrupciones.", "Activa", "autónomo; empresa; fibra"],
];
const rebate = [
  ["reb-001", "Está caro", "Residencial", "Entiendo el precio; revisemos valor total.", "Comprendo que el precio sea clave. Si comparamos fibra, datos, instalación y soporte, vemos si mejora tu coste real.", "¿Qué pagas ahora sumando fibra, líneas y extras?", "Cierre por comparación de valor", "No prometer descuentos no confirmados", "Cliente: Está caro. Asesor: Lo revisamos con números claros."],
  ["reb-002", "Lo voy a pensar", "Indeciso", "Perfecto, pensemos con criterios claros.", "Dejemos definidos precio, permanencia, cobertura y fecha de instalación para decidir con información completa.", "¿Qué punto necesitas tener claro para decidir hoy?", "Cierre por siguiente paso concreto", "Presionar afecta la calidad", "Cliente: Lo pienso. Asesor: ¿La duda principal es precio, cobertura o condiciones?"],
  ["reb-003", "No quiero permanencia", "Sensibilidad contractual", "Revisemos qué permanencia aplica y por qué.", "La permanencia se explica antes de avanzar y revisamos alternativas si necesitas flexibilidad.", "¿Tu rechazo viene por una mala experiencia anterior?", "Cierre por transparencia", "Ocultar permanencia es riesgo crítico", "Cliente: No quiero permanencia. Asesor: Lo dejamos claro antes de decidir."],
];
const formacion = [
  ["adv-001", "Rebate y objeciones", "Contenido visto; práctica completada", 78, 82, 80, 76, 80, "Apto"],
  ["adv-002", "Calidad comercial", "Contenido visto; requiere práctica", 48, 52, 50, 44, 50, "Necesita refuerzo"],
  ["adv-003", "Tarifas principales", "Contenido visto", 66, 64, 60, 58, 63, "Necesita refuerzo"],
  ["adv-004", "Cierre de venta", "Completo", 94, 92, 95, 96, 94, "Apto"],
  ["adv-005", "Contrato y firma", "Pendiente examen", 50, 45, 40, 35, 45, "Bloqueado"],
];
const calidad = [
  ["adv-001", "2026-06-11", "Simulada", "Sí", "Sí", "Sí", "Sí", "No", "Cierre poco directo", 82, "Sí", "Mejorar cierre alternativo."],
  ["adv-002", "2026-06-11", "Simulada", "Sí", "No", "No", "Sí", "No", "No explica permanencia; no confirma condiciones", 54, "Sí", "Refuerzo urgente."],
  ["adv-004", "2026-06-11", "Real", "Sí", "Sí", "Sí", "Sí", "Sí", "", 94, "No", "Lista para seguimiento estándar."],
  ["adv-005", "2026-06-12", "Simulada", "Sí", "No", "No", "Sí", "No", "No consolida firma ni condiciones", 58, "Sí", "Reforzar contrato y calidad."],
];
const incidencias = [
  ["inc-001", "adv-002", "2026-06-11", "Retail pendiente", "critical", "Abierta", "Retail pendiente más de 48 horas.", "Sergio Vidal", "Escalar activación retail y asignar responsable."],
  ["inc-002", "adv-002", "2026-06-11", "Calidad crítica", "high", "En curso", "Nota de calidad por debajo de 70.", "Laura Campos", "Programar refuerzo y nueva simulación."],
  ["inc-003", "adv-005", "2026-06-12", "Contrato sin firma", "high", "Abierta", "Contrato enviado sin firma confirmada.", "Marta León", "Enviar recordatorio y resolver dudas."],
];
const historial = [
  ["his-001", "adv-001", "2026-06-10 11:20", "Retail", "En proceso", "Activo", "Diego Ramos", "Activación validada para producción inicial.", "captura interna"],
  ["his-002", "adv-002", "2026-06-11 16:00", "EstadoBloqueo", "En proceso", "Bloqueado", "Sergio Vidal", "Retail pendiente más de 48 horas.", "nota interna"],
  ["his-003", "adv-003", "2026-06-12 08:20", "UsuarioVodafone", "No solicitado", "Solicitado", "Marta León", "Solicitud registrada sin credenciales sensibles.", "registro operativo"],
  ["his-004", "adv-005", "2026-06-12 12:30", "FirmaContrato", "Pendiente", "Pendiente", "Marta León", "Se envía recordatorio de firma.", "mensaje"],
];
const catalogos = [
  ["Estados operativos", "No solicitado", "Sí"], ["Estados operativos", "Solicitado", "Sí"], ["Estados operativos", "En proceso", "Sí"], ["Estados operativos", "Activo", "Sí"], ["Estados operativos", "Bloqueado", "Sí"], ["Estados operativos", "Requiere soporte", "Sí"], ["Estados operativos", "Pendiente", "Sí"], ["Estados operativos", "Firmado", "Sí"], ["Estados operativos", "Incidencia", "Sí"],
  ["Auto refresh", "30 segundos", "Sí"], ["Auto refresh", "60 segundos", "Sí"],
];
const dashboard = [["Total objetivo semanal", 12, 15, "Seguimiento de ingresos"], ["SLA credenciales", "24h", "24h", "Activación de usuario Vodafone"], ["SLA retail", "48h", "48h", "Activación retail"]];

const headers = {
  Dashboard_Excel: ["Indicador", "Valor", "Objetivo", "Observacion"],
  Asesores: ["ID", "NombreCompleto", "Identificador", "FechaIngreso", "Supervisor", "Turno", "Campana", "EstadoGeneral", "Telefono", "Correo", "Observaciones", "Etiquetas", "Avance", "ProximaAccion"],
  Accesos_Contrato: ["AdvisorID", "UsuarioVodafone", "CorreoInterno", "PlataformaFormacion", "Retail", "FirmaEnvioContrato", "FirmaContrato", "FechaSolicitud", "FechaActivacion", "ResponsableGestion", "Incidencias", "EstadoBloqueo", "Observaciones"],
  Induccion: ["AdvisorID", "CancelacionMovilidadExplicada", "FechaExplicacion", "ResponsableExplico", "ConfirmacionAsesor", "EscalamientoIncidenciasExplicado", "NormativaAsistenciaExplicada", "UsoHerramientasExplicado", "CalidadComercialInicialExplicada", "ProtocoloComunicacionExplicado", "EstadoGeneralInduccion", "ObservacionesEvidencia", "ConstanciaInterna"],
  Tarifas: ["ID", "NombreTarifa", "Precio", "ServiciosIncluidos", "Fibra", "LineasMoviles", "GB", "Streaming", "Permanencia", "Condiciones", "ArgumentoComercial", "PerfilClienteIdeal", "ObjecionesFrecuentes", "RebateRecomendado", "EstadoTarifa", "Segmento"],
  Rebate: ["ID", "ObjecionCliente", "TipoCliente", "RespuestaCorta", "RespuestaProfesional", "PreguntaDiagnostico", "TecnicaCierre", "RiesgoCalidad", "EjemploLlamada"],
  Formacion: ["AdvisorID", "Modulo", "Checklist", "ExamenRapido", "PracticaComercial", "SimulacionLlamada", "AvancePorcentual", "NotaModulo", "ResultadoFinal"],
  Calidad: ["AdvisorID", "FechaEvaluacion", "TipoLlamada", "CumpleSaludo", "CumpleOferta", "CumpleCondiciones", "CumpleTratamientoDatos", "CumpleCierreCorrecto", "ErroresDetectados", "Nota", "RequiereRefuerzo", "Observaciones"],
  Incidencias: ["ID", "AdvisorID", "Fecha", "TipoIncidencia", "Prioridad", "Estado", "Descripcion", "Responsable", "AccionRecomendada"],
  Historial: ["ID", "AdvisorID", "Fecha", "CampoModificado", "ValorAnterior", "ValorNuevo", "Responsable", "Observacion", "TipoEvidencia"],
  Catalogos: ["Catalogo", "Valor", "Activo"],
};
const datasets = { Dashboard_Excel: dashboard, Asesores: asesores, Accesos_Contrato: access, Induccion: induction, Tarifas: tarifas, Rebate: rebate, Formacion: formacion, Calidad: calidad, Incidencias: incidencias, Historial: historial, Catalogos: catalogos };
const wb = utils.book_new();
Object.entries(datasets).forEach(([name, rows]) => utils.book_append_sheet(wb, utils.aoa_to_sheet([headers[name], ...rows]), name));
writeFile(wb, workbookPath);
console.log(`${force ? "Overwritten" : "Created"} ${workbookPath}`);
