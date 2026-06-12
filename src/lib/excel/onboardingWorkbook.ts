import path from "node:path";
import { readFileSync } from "node:fs";
import { read, utils } from "xlsx";
import { AccessContract, Advisor, CatalogItem, DashboardExcelRow, Incident, Induction, OnboardingData, Quality, Rebate, Tariff, Training } from "@/lib/types/onboarding";
import { normalize, splitTags, toNumber } from "@/lib/utils/format";

export const workbookPath = path.join(process.cwd(), "data", "vodafone_onboarding_base_dinamica.xlsx");

type RawRow = Record<string, unknown>;
type Workbook = ReturnType<typeof read>;
const sheetRows = (workbook: Workbook, sheetName: string) => utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName] ?? utils.json_to_sheet([]), { defval: "" });

export function readOnboardingWorkbook(): OnboardingData {
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

  const catalogos: CatalogItem[] = sheetRows(workbook, "Catalogos").map((row) => ({ catalogo: normalize(row.Catalogo), valor: normalize(row.Valor), activo: normalize(row.Activo) }));
  const dashboardExcel: DashboardExcelRow[] = sheetRows(workbook, "Dashboard_Excel").map((row) => ({ indicador: normalize(row.Indicador), valor: normalize(row.Valor), objetivo: normalize(row.Objetivo), observacion: normalize(row.Observacion) }));

  return { asesores, accesosContrato, induccion, tarifas, rebate, formacion, calidad, incidencias, catalogos, dashboardExcel, updatedAt: new Date().toISOString() };
}
