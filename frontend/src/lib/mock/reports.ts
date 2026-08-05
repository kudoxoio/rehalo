/**
 * mock/reports.ts
 *
 * Datos derivados para el módulo Reportes. Agrega métricas reales
 * desde patients + appointments para alimentar los gráficos Recharts.
 */
import { patients, type Patient } from "./patients";
import { appointments, calendarBlocks } from "./appointments";

// ─────────────────────────────────────────────────────────────
// Distribución por patología (top motivos de consulta)
// ─────────────────────────────────────────────────────────────
export interface PathologyCount {
  name: string;
  count: number;
  pct: number;
}

export function getPathologyDistribution(): PathologyCount[] {
  const map = new Map<string, number>();
  for (const p of patients) {
    map.set(p.primaryPathology, (map.get(p.primaryPathology) ?? 0) + 1);
  }
  const total = patients.length;
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

// ─────────────────────────────────────────────────────────────
// Distribución por género
// ─────────────────────────────────────────────────────────────
export interface GenderCount {
  name: string;
  value: number;
}
export function getGenderDistribution(): GenderCount[] {
  const m = patients.filter((p) => p.sex === "M").length;
  const f = patients.filter((p) => p.sex === "F").length;
  const x = patients.filter((p) => p.sex === "X").length;
  return [
    { name: "Femenino", value: f },
    { name: "Masculino", value: m },
    { name: "Otro", value: x },
  ];
}

// ─────────────────────────────────────────────────────────────
// EVA por paciente (ordenado desc para detectar dolor severo)
// ─────────────────────────────────────────────────────────────
export interface EvaByPatient {
  name: string;
  eva: number;
  pathology: string;
}
export function getEvaByPatient(): EvaByPatient[] {
  return patients
    .map((p) => ({
      name: `${p.firstName} ${p.lastName}`.split(" ")[0],
      fullName: `${p.firstName} ${p.lastName}`,
      eva: p.painScale.eva,
      pathology: p.primaryPathology,
    }))
    .sort((a, b) => b.eva - a.eva);
}

// ─────────────────────────────────────────────────────────────
// Sesiones por terapeuta (basado en appointments)
// ─────────────────────────────────────────────────────────────
export interface SessionsByTherapist {
  name: string;
  sesiones: number;
  noShows: number;
}
export function getSessionsByTherapist(): SessionsByTherapist[] {
  const map = new Map<string, { sesiones: number; noShows: number }>();
  for (const a of appointments) {
    const cur = map.get(a.therapistId) ?? { sesiones: 0, noShows: 0 };
    cur.sesiones += 1;
    if (a.status === "no-show") cur.noShows += 1;
    map.set(a.therapistId, cur);
  }
  return Array.from(map.entries()).map(([id, v]) => {
    const th = TH_NAMES[id] ?? id;
    return { name: th, sesiones: v.sesiones, noShows: v.noShows };
  });
}

const TH_NAMES: Record<string, string> = {
  "th-001": "Ana R.",
  "th-002": "Diego S.",
  "th-003": "Paola M.",
};

// ─────────────────────────────────────────────────────────────
// Evolución del dolor (EVA) — serie temporal 8 semanas
// ─────────────────────────────────────────────────────────────
export interface EvaTrendPoint {
  week: string;
  promedio: number;
}
export function getEvaTrend(): EvaTrendPoint[] {
  // Datos derivados plausibles: a partir del valor actual, "retrocedemos" hacia
  // un valor inicial mayor para reflejar mejoría clínica
  const evaActual = avg(patients.map((p) => p.painScale.eva));
  // Curva descendente suave hacia el valor actual
  const semAct = Math.round(evaActual * 10) / 10;
  return [
    { week: "W-8", promedio: +(semAct + 1.4).toFixed(1) },
    { week: "W-7", promedio: +(semAct + 1.1).toFixed(1) },
    { week: "W-6", promedio: +(semAct + 0.9).toFixed(1) },
    { week: "W-5", promedio: +(semAct + 0.7).toFixed(1) },
    { week: "W-4", promedio: +(semAct + 0.5).toFixed(1) },
    { week: "W-3", promedio: +(semAct + 0.3).toFixed(1) },
    { week: "W-2", promedio: +(semAct + 0.2).toFixed(1) },
    { week: "W-1", promedio: +(semAct + 0.1).toFixed(1) },
    { week: "Hoy", promedio: semAct },
  ];
}

// ─────────────────────────────────────────────────────────────
// Estado de consentimientos
// ─────────────────────────────────────────────────────────────
export interface ConsentStatus {
  name: string;
  value: number;
  pct: number;
}
export function getConsentStatus(): ConsentStatus[] {
  const total = patients.length;
  const firmados = patients.filter((p) => p.consents.length > 0).length;
  const sinFirma = total - firmados;
  return [
    { name: "Firmados", value: firmados, pct: Math.round((firmados / total) * 100) },
    { name: "Sin firma", value: sinFirma, pct: Math.round((sinFirma / total) * 100) },
  ];
}

// ─────────────────────────────────────────────────────────────
// Ocupación por día (últimos 7 días)
// ─────────────────────────────────────────────────────────────
export interface OccupancyPoint {
  dia: string;
  cupos: number;
  ocupados: number;
  libres: number;
}
export function getOccupancyLast7Days(): OccupancyPoint[] {
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  // 3 terapeutas × 12 cupos de 30min × 8h = 24 cupos por día. Pero realista: ~20 cupos
  const cap = 20;
  // Distribución plausible
  const data = [
    { cupos: cap, ocupados: 17 },
    { cupos: cap, ocupados: 18 },
    { cupos: cap, ocupados: 14 },
    { cupos: cap, ocupados: 16 },
    { cupos: cap, ocupados: 19 },
    { cupos: cap, ocupados: 8 },
    { cupos: cap, ocupados: 0 },
  ];
  return dias.map((dia, i) => {
    const cupos = data[i].cupos;
    const ocupados = data[i].ocupados;
    return { dia, cupos, ocupados, libres: cupos - ocupados };
  });
}

// ─────────────────────────────────────────────────────────────
// KPIs resumen
// ─────────────────────────────────────────────────────────────
export interface ReportKpis {
  activePatients: number;
  totalSessions: number;
  avgEva: number;
  noShowRate: number;
  occupancyRate: number;
  highPainPatients: number;
}

export function getReportKpis(): ReportKpis {
  const activePatients = patients.filter((p) => p.status === "activo").length;
  const totalSessions = appointments.length;
  const avgEva = +avg(patients.map((p) => p.painScale.eva)).toFixed(1);
  const noShows = appointments.filter((a) => a.status === "no-show").length;
  const noShowRate = totalSessions > 0 ? Math.round((noShows / totalSessions) * 100) : 0;

  // Tasa de ocupación global: hoy 9 citas / 20 cupos ≈ 45%
  const todayAppts = appointments.filter((a) => {
    const d = new Date(a.start);
    const today = new Date("2026-08-05T12:00:00");
    return d.toDateString() === today.toDateString();
  }).length;
  const occupancyRate = Math.round((todayAppts / 20) * 100);

  const highPainPatients = patients.filter((p) => p.painScale.eva >= 7).length;

  return {
    activePatients,
    totalSessions,
    avgEva,
    noShowRate,
    occupancyRate,
    highPainPatients,
  };
}

// ─────────────────────────────────────────────────────────────
// Alertas clínicas (pacientes con riesgo)
// ─────────────────────────────────────────────────────────────
export interface ClinicalAlert {
  patient: Patient;
  reason: string;
  severity: "alta" | "media" | "baja";
}

export function getClinicalAlerts(): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];
  for (const p of patients) {
    if (p.painScale.eva >= 7) {
      alerts.push({
        patient: p,
        reason: `EVA ${p.painScale.eva}/10 — dolor severo`,
        severity: "alta",
      });
    }
    if (!p.consents || p.consents.length === 0) {
      alerts.push({
        patient: p,
        reason: "Sin consentimiento firmado",
        severity: "media",
      });
    }
    const sesiones = p.timeline.filter((t) => t.type === "Sesión").length;
    const lastSesion = p.timeline
      .filter((t) => t.type === "Sesión")
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
    if (lastSesion) {
      const daysSince = Math.floor((Date.now() - +new Date(lastSesion.date)) / 86400000);
      if (daysSince > 14 && p.status === "activo") {
        alerts.push({
          patient: p,
          reason: `Sin sesiones hace ${daysSince} días`,
          severity: "media",
        });
      }
    }
  }
  // Dedup por paciente (el primero)
  const seen = new Set<string>();
  return alerts.filter((a) => {
    if (seen.has(a.patient.id)) return false;
    seen.add(a.patient.id);
    return true;
  });
}

// ─────────────────────────────────────────────────────────────
// Top pacientes por sesiones (cumplimiento del plan)
// ─────────────────────────────────────────────────────────────
export interface PatientBySessions {
  name: string;
  sesiones: number;
  icd10: string;
}
export function getTopPatientsBySessions(): PatientBySessions[] {
  return patients
    .map((p) => ({
      name: `${p.firstName} ${p.lastName}`,
      sesiones: p.timeline.filter((t) => t.type === "Sesión").length,
      icd10: p.icd10,
    }))
    .sort((a, b) => b.sesiones - a.sesiones);
}

// ─────────────────────────────────────────────────────────────
// Util
// ─────────────────────────────────────────────────────────────
function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, n) => s + n, 0) / arr.length;
}
