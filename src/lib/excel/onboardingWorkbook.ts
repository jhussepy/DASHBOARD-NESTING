import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { read, utils } from "xlsx";
import { AccessContract, Advisor, CatalogItem, DashboardExcelRow, ChangeHistory, Incident, Induction, OnboardingData, Quality, Rebate, Tariff, Training } from "@/lib/types/onboarding";
import { normalize, splitTags, toNumber } from "@/lib/utils/format";

export const workbookPath = path.join(process.cwd(), "data", "vodafone_onboarding_base_dinamica.xlsx");

type RawRow = Record<string, unknown>;
type Workbook = ReturnType<typeof read>;
const sheetRows = (workbook: Workbook, sheetName: string) => utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName] ?? utils.json_to_sheet([]), { defval: "" });

export const fallbackWarning = "Excel no encontrado. Ejecuta npm run create:workbook.";

export function getFallbackOnboardingData(warning = fallbackWarning): OnboardingData {
  const updatedAt = new Date().toISOString();
  return {
    source: "fallback",
    warning,
    updatedAt,
    asesores: [
      {
        id: "fallback-001",
        nombreCompleto: "Asesor Demo Fallback",
        identificador: "DEMO-001",
        fechaIngreso: updatedAt.slice(0, 10),
        supervisor: "Coordinación Vodafone",
        turno: "Mañana",
        campana: "Demo onboarding",
        estadoGeneral: "Credenciales pendientes",
        telefono: "+34 600 000 000",
        correo: "asesor.demo@example.com",
        observaciones: "Datos demo mínimos cargados porque no se encontró el Excel local.",
        etiquetas: ["fallback", "demo"],
        avance: 35,
        proximaAccion: "Ejecutar npm run create:workbook y pulsar Sincronizar Excel.",
      },
    ],
    accesosContrato: [
      {
        advisorId: "fallback-001",
        usuarioVodafone: "Pendiente",
        correoInterno: "Pendiente",
        plataformaFormacion: "Pendiente",
        retail: "Pendiente",
        firmaEnvioContrato: "Pendiente",
        firmaContrato: "Pendiente",
        fechaSolicitud: "",
        fechaActivacion: "",
        responsableGestion: "",
        incidencias: warning,
        estadoBloqueo: "Pendiente",
        observaciones: "Fallback seguro sin credenciales sensibles.",
      },
    ],
    induccion: [
      {
        advisorId: "fallback-001",
        cancelacionMovilidadExplicada: "Pendiente",
        fechaExplicacion: "",
        responsableExplico: "",
        confirmacionAsesor: "No",
        escalamientoIncidenciasExplicado: "Pendiente",
        normativaAsistenciaExplicada: "Pendiente",
        usoHerramientasExplicado: "Pendiente",
        calidadComercialInicialExplicada: "Pendiente",
        protocoloComunicacionExplicado: "Pendiente",
        estadoGeneralInduccion: "Pendiente",
        observacionesEvidencia: "Fallback: pendiente crear workbook local.",
        constanciaInterna: "",
      },
    ],
    tarifas: [
      { id: "fallback-tar-001", nombreTarifa: "Tarifa Demo", precio: 0, serviciosIncluidos: "Demo", fibra: "Pendiente", lineasMoviles: 0, gb: "Pendiente", streaming: "No", permanencia: "Pendiente", condiciones: "Generar Excel para editar tarifas reales.", argumentoComercial: "Ejemplo fallback para mantener la aplicación operativa.", perfilClienteIdeal: "Demo", objecionesFrecuentes: "Está caro", rebateRecomendado: "Generar workbook local.", estadoTarifa: "Pausada", segmento: "demo" },
    ],
    rebate: [
      { id: "fallback-reb-001", objecionCliente: "Está caro", tipoCliente: "Demo", respuestaCorta: "Entiendo el precio; revisemos valor total.", respuestaProfesional: "Respuesta demo disponible hasta generar el Excel local.", preguntaDiagnostico: "¿Qué pagas actualmente?", tecnicaCierre: "Comparación de valor", riesgoCalidad: "No prometer descuentos no confirmados", ejemploLlamada: "Cliente: Está caro. Asesor: Revisemos el valor total." },
    ],
    formacion: [
      { advisorId: "fallback-001", modulo: "Introducción Vodafone", checklist: "Pendiente", examenRapido: 0, practicaComercial: 0, simulacionLlamada: 0, avancePorcentual: 10, notaModulo: 0, resultadoFinal: "Necesita refuerzo" },
    ],
    calidad: [
      { advisorId: "fallback-001", fechaEvaluacion: updatedAt.slice(0, 10), tipoLlamada: "Simulada", cumpleSaludo: "Pendiente", cumpleOferta: "Pendiente", cumpleCondiciones: "Pendiente", cumpleTratamientoDatos: "Pendiente", cumpleCierreCorrecto: "Pendiente", erroresDetectados: "Sin evaluación real", nota: 0, requiereRefuerzo: "Sí", observaciones: "Fallback seguro." },
    ],
    incidencias: [
      { id: "fallback-inc-001", advisorId: "fallback-001", fecha: updatedAt.slice(0, 10), tipoIncidencia: "Excel no encontrado", prioridad: "high", estado: "Abierta", descripcion: warning, responsable: "Coordinación", accionRecomendada: "Ejecutar npm run create:workbook." },
    ],
    historial: [
      { id: "fallback-his-001", advisorId: "fallback-001", fecha: updatedAt, campoModificado: "Fuente", valorAnterior: "Sin Excel", valorNuevo: "Fallback", responsable: "Sistema", observacion: warning, tipoEvidencia: "evento automático" },
    ],
    catalogos: [
      { catalogo: "Estados operativos", valor: "Pendiente", activo: "Sí" },
    ],
    dashboardExcel: [
      { indicador: "Fuente de datos", valor: "fallback", objetivo: "excel", observacion: warning },
    ],
  };
}

export function readOnboardingWorkbook(): OnboardingData {
  if (!existsSync(workbookPath)) return getFallbackOnboardingData();
  const workbook = read(readFileSync(workbookPath), { type: "buffer", cellDates: false });
  const asesores: Advisor[] = sheetRows(workbook, "Asesores").map((row) => ({
    id: normalize(row.ID),
    nombreCompleto: normalize(row.NombreCompleto),
    identificador: normalize(row.Identificador),
    fechaIngreso: normalize(row.FechaIngreso),
    supervisor: normalize(row.Supervisor),
    turno: normalize(row.Turno),
    campana: normalize(row.Campana),
    estadoGeneral: normalize(row.EstadoGeneral),
    telefono: normalize(row.Telefono),
    correo: normalize(row.Correo),
    observaciones: normalize(row.Observaciones),
    etiquetas: splitTags(row.Etiquetas),
    avance: toNumber(row.Avance),
    proximaAccion: normalize(row.ProximaAccion),
  }));

  const accesosContrato: AccessContract[] = sheetRows(workbook, "Accesos_Contrato").map((row) => ({
    advisorId: normalize(row.AdvisorID),
    usuarioVodafone: normalize(row.UsuarioVodafone),
    correoInterno: normalize(row.CorreoInterno),
    plataformaFormacion: normalize(row.PlataformaFormacion),
    retail: normalize(row.Retail),
    firmaEnvioContrato: normalize(row.FirmaEnvioContrato),
    firmaContrato: normalize(row.FirmaContrato),
    fechaSolicitud: normalize(row.FechaSolicitud),
    fechaActivacion: normalize(row.FechaActivacion),
    responsableGestion: normalize(row.ResponsableGestion),
    incidencias: normalize(row.Incidencias),
    estadoBloqueo: normalize(row.EstadoBloqueo),
    observaciones: normalize(row.Observaciones),
  }));

  const induccion: Induction[] = sheetRows(workbook, "Induccion").map((row) => ({
    advisorId: normalize(row.AdvisorID),
    cancelacionMovilidadExplicada: normalize(row.CancelacionMovilidadExplicada),
    fechaExplicacion: normalize(row.FechaExplicacion),
    responsableExplico: normalize(row.ResponsableExplico),
    confirmacionAsesor: normalize(row.ConfirmacionAsesor),
    escalamientoIncidenciasExplicado: normalize(row.EscalamientoIncidenciasExplicado),
    normativaAsistenciaExplicada: normalize(row.NormativaAsistenciaExplicada),
    usoHerramientasExplicado: normalize(row.UsoHerramientasExplicado),
    calidadComercialInicialExplicada: normalize(row.CalidadComercialInicialExplicada),
    protocoloComunicacionExplicado: normalize(row.ProtocoloComunicacionExplicado),
    estadoGeneralInduccion: normalize(row.EstadoGeneralInduccion),
    observacionesEvidencia: normalize(row.ObservacionesEvidencia),
    constanciaInterna: normalize(row.ConstanciaInterna),
  }));

  const tarifas: Tariff[] = sheetRows(workbook, "Tarifas").map((row) => ({
    id: normalize(row.ID),
    nombreTarifa: normalize(row.NombreTarifa),
    precio: toNumber(row.Precio),
    serviciosIncluidos: normalize(row.ServiciosIncluidos),
    fibra: normalize(row.Fibra),
    lineasMoviles: toNumber(row.LineasMoviles),
    gb: normalize(row.GB),
    streaming: normalize(row.Streaming),
    permanencia: normalize(row.Permanencia),
    condiciones: normalize(row.Condiciones),
    argumentoComercial: normalize(row.ArgumentoComercial),
    perfilClienteIdeal: normalize(row.PerfilClienteIdeal),
    objecionesFrecuentes: normalize(row.ObjecionesFrecuentes),
    rebateRecomendado: normalize(row.RebateRecomendado),
    estadoTarifa: normalize(row.EstadoTarifa),
    segmento: normalize(row.Segmento),
  }));

  const rebate: Rebate[] = sheetRows(workbook, "Rebate").map((row) => ({
    id: normalize(row.ID),
    objecionCliente: normalize(row.ObjecionCliente),
    tipoCliente: normalize(row.TipoCliente),
    respuestaCorta: normalize(row.RespuestaCorta),
    respuestaProfesional: normalize(row.RespuestaProfesional),
    preguntaDiagnostico: normalize(row.PreguntaDiagnostico),
    tecnicaCierre: normalize(row.TecnicaCierre),
    riesgoCalidad: normalize(row.RiesgoCalidad),
    ejemploLlamada: normalize(row.EjemploLlamada),
  }));

  const formacion: Training[] = sheetRows(workbook, "Formacion").map((row) => ({
    advisorId: normalize(row.AdvisorID),
    modulo: normalize(row.Modulo),
    checklist: normalize(row.Checklist),
    examenRapido: toNumber(row.ExamenRapido),
    practicaComercial: toNumber(row.PracticaComercial),
    simulacionLlamada: toNumber(row.SimulacionLlamada),
    avancePorcentual: toNumber(row.AvancePorcentual),
    notaModulo: toNumber(row.NotaModulo),
    resultadoFinal: normalize(row.ResultadoFinal),
  }));

  const calidad: Quality[] = sheetRows(workbook, "Calidad").map((row) => ({
    advisorId: normalize(row.AdvisorID),
    fechaEvaluacion: normalize(row.FechaEvaluacion),
    tipoLlamada: normalize(row.TipoLlamada),
    cumpleSaludo: normalize(row.CumpleSaludo),
    cumpleOferta: normalize(row.CumpleOferta),
    cumpleCondiciones: normalize(row.CumpleCondiciones),
    cumpleTratamientoDatos: normalize(row.CumpleTratamientoDatos),
    cumpleCierreCorrecto: normalize(row.CumpleCierreCorrecto),
    erroresDetectados: normalize(row.ErroresDetectados),
    nota: toNumber(row.Nota),
    requiereRefuerzo: normalize(row.RequiereRefuerzo),
    observaciones: normalize(row.Observaciones),
  }));

  const incidencias: Incident[] = sheetRows(workbook, "Incidencias").map((row) => ({
    id: normalize(row.ID),
    advisorId: normalize(row.AdvisorID),
    fecha: normalize(row.Fecha),
    tipoIncidencia: normalize(row.TipoIncidencia),
    prioridad: (normalize(row.Prioridad).toLowerCase() || "medium") as Incident["prioridad"],
    estado: normalize(row.Estado),
    descripcion: normalize(row.Descripcion),
    responsable: normalize(row.Responsable),
    accionRecomendada: normalize(row.AccionRecomendada),
  }));

  const historial: ChangeHistory[] = sheetRows(workbook, "Historial").map((row) => ({
    id: normalize(row.ID),
    advisorId: normalize(row.AdvisorID),
    fecha: normalize(row.Fecha),
    campoModificado: normalize(row.CampoModificado),
    valorAnterior: normalize(row.ValorAnterior),
    valorNuevo: normalize(row.ValorNuevo),
    responsable: normalize(row.Responsable),
    observacion: normalize(row.Observacion),
    tipoEvidencia: normalize(row.TipoEvidencia),
  }));
  const catalogos: CatalogItem[] = sheetRows(workbook, "Catalogos").map((row) => ({ catalogo: normalize(row.Catalogo), valor: normalize(row.Valor), activo: normalize(row.Activo) }));
  const dashboardExcel: DashboardExcelRow[] = sheetRows(workbook, "Dashboard_Excel").map((row) => ({ indicador: normalize(row.Indicador), valor: normalize(row.Valor), objetivo: normalize(row.Objetivo), observacion: normalize(row.Observacion) }));

  return { asesores, accesosContrato, induccion, tarifas, rebate, formacion, calidad, incidencias, historial, catalogos, dashboardExcel, updatedAt: new Date().toISOString(), source: "excel" };
}
