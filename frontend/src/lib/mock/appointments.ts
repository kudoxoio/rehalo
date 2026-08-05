/**
 * mock/appointments.ts
 *
 * Datos de demo para el módulo Agenda / Citas (Spec 2.2).
 * Modela: terapeutas, salas, tipos de cita (con equipamiento),
 * bloques de calendario, citas, lista de espera, política no-shows.
 */

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface Therapist {
  id: string;
  name: string;
  specialty: string;
  color: string; // HSL token o hex — debe ir como clase bg-{color}
  avatarInitials: string;
}

export interface Room {
  id: string;
  name: string;
  equipment: string[]; // tags visibles
  icon: string; // nombre tabler icon (calendario, swimming, etc.)
}

export interface AppointmentType {
  id: string;
  name: string;
  durationMin: 30 | 45 | 60 | 90;
  color: string; // tailwind class sin prefijo: "primary" | "info" | "warning" | "success"
  icon: string;
  requiredEquipment: string[]; // roomId donde se puede hacer
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  roomId: string;
  typeId: string;
  start: string; // ISO datetime
  end: string;
  status: "confirmada" | "asistio" | "no-show" | "cancelada" | "reagendada";
  remindersDispatched: ("email" | "sms" | "whatsapp")[];
  notes?: string;
  source: "panel" | "portal" | "recurrencia";
}

export interface WaitlistEntry {
  id: string;
  patientId: string;
  patientName: string;
  desiredDate: string;
  therapistId?: string; // preferido
  typeId: string;
  priority: "alta" | "media" | "baja";
  notes?: string;
  createdAt: string;
}

export interface CalendarBlock {
  id: string;
  type: "vacaciones" | "equipamiento" | "mantenimiento" | "curso";
  title: string;
  start: string;
  end: string;
  therapistId?: string;
  roomId?: string;
}

export interface NoShowPolicy {
  freeNoShowsPerYear: number;
  chargePerAdditional: number;
  recurrenceHoldDays: number;
  autoBlock: boolean;
}

// ─────────────────────────────────────────────────────────────
// Datos
// ─────────────────────────────────────────────────────────────

export const therapists: Therapist[] = [
  { id: "th-001", name: "Lic. Ana Rodríguez", specialty: "Kinesiología", color: "primary", avatarInitials: "AR" },
  { id: "th-002", name: "Lic. Diego Salazar", specialty: "Kinesiología", color: "info", avatarInitials: "DS" },
  { id: "th-003", name: "Lic. Paola Méndez", specialty: "Fisioterapia deportiva", color: "warning", avatarInitials: "PM" },
];

export const rooms: Room[] = [
  { id: "room-1", name: "Box 1 — General", equipment: ["Camilla", "TENS", "Ultrasonido"], icon: "stethoscope" },
  { id: "room-2", name: "Box 2 — General", equipment: ["Camilla", "Bandas"], icon: "stethoscope" },
  { id: "room-3", name: "Sala Hidroterapia", equipment: ["Pileta terapéutica", "Duchas"], icon: "swimming" },
  { id: "room-4", name: "Gimnasio", equipment: ["Pesas", "Bicicleta", "Escalador"], icon: "dumbbell" },
  { id: "room-5", name: "Sala Tracción", equipment: ["Mesa de tracción cervical", "Mesa lumbar"], icon: "stretching" },
];

export const appointmentTypes: AppointmentType[] = [
  {
    id: "type-eval",
    name: "Evaluación inicial",
    durationMin: 60,
    color: "info",
    icon: "clipboard-list",
    requiredEquipment: ["room-1", "room-2"],
  },
  {
    id: "type-seguimiento",
    name: "Sesión seguimiento",
    durationMin: 45,
    color: "primary",
    icon: "walk",
    requiredEquipment: ["room-1", "room-2", "room-4"],
  },
  {
    id: "type-kine",
    name: "Kinesiología",
    durationMin: 45,
    color: "primary",
    icon: "walk",
    requiredEquipment: ["room-1", "room-2", "room-4"],
  },
  {
    id: "type-hidro",
    name: "Hidroterapia",
    durationMin: 60,
    color: "info",
    icon: "swimming",
    requiredEquipment: ["room-3"],
  },
  {
    id: "type-traccion",
    name: "Tracción cervical/lumbar",
    durationMin: 30,
    color: "warning",
    icon: "stretching",
    requiredEquipment: ["room-5"],
  },
  {
    id: "type-reeval",
    name: "Reevaluación",
    durationMin: 45,
    color: "info",
    icon: "chart-line",
    requiredEquipment: ["room-1", "room-2"],
  },
  {
    id: "type-alta",
    name: "Alta / Educación HEP",
    durationMin: 30,
    color: "success",
    icon: "clipboard-check",
    requiredEquipment: ["room-1", "room-2"],
  },
];

export const noShowPolicy: NoShowPolicy = {
  freeNoShowsPerYear: 2,
  chargePerAdditional: 5000,
  recurrenceHoldDays: 7,
  autoBlock: true,
};

// ─────────────────────────────────────────────────────────────
// Helpers de fecha
// ─────────────────────────────────────────────────────────────

const TODAY = new Date("2026-08-05T12:00:00");

function at(hour: number, dayOffset: number, minute = 0): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function addMinutes(iso: string, min: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + min);
  return d.toISOString();
}

// ─────────────────────────────────────────────────────────────
// Citas de la semana (lunes a sábado de la semana del TODAY)
// ─────────────────────────────────────────────────────────────

export const appointments: Appointment[] = [
  // ── DÍA 0 (hoy, miércoles 5) ───────────────────────────────
  {
    id: "a-001",
    patientId: "p-001",
    patientName: "Lucía Méndez",
    therapistId: "th-001",
    roomId: "room-1",
    typeId: "type-seguimiento",
    start: at(9, 0),
    end: addMinutes(at(9, 0), 45),
    status: "confirmada",
    remindersDispatched: ["email", "whatsapp"],
    notes: "Fortalecimiento lumbar",
    source: "recurrencia",
  },
  {
    id: "a-002",
    patientId: "p-003",
    patientName: "Marta Rivas",
    therapistId: "th-001",
    roomId: "room-4",
    typeId: "type-seguimiento",
    start: at(10, 0),
    end: addMinutes(at(10, 0), 45),
    status: "confirmada",
    remindersDispatched: ["email", "sms"],
    source: "recurrencia",
  },
  {
    id: "a-003",
    patientId: "p-006",
    patientName: "Roberto Giménez",
    therapistId: "th-001",
    roomId: "room-1",
    typeId: "type-seguimiento",
    start: at(11, 0),
    end: addMinutes(at(11, 0), 45),
    status: "asistio",
    remindersDispatched: ["email", "whatsapp"],
    source: "recurrencia",
  },
  {
    id: "a-004",
    patientId: "p-004",
    patientName: "Diego Salazar",
    therapistId: "th-001",
    roomId: "room-5",
    typeId: "type-traccion",
    start: at(13, 0),
    end: addMinutes(at(13, 0), 30),
    status: "confirmada",
    remindersDispatched: ["email"],
    source: "recurrencia",
  },
  {
    id: "a-005",
    patientId: "p-002",
    patientName: "Carlos Pérez",
    therapistId: "th-002",
    roomId: "room-2",
    typeId: "type-seguimiento",
    start: at(9, 0),
    end: addMinutes(at(9, 0), 45),
    status: "confirmada",
    remindersDispatched: ["email", "whatsapp"],
    source: "recurrencia",
  },
  {
    id: "a-006",
    patientId: "p-005",
    patientName: "Sofía Acosta",
    therapistId: "th-002",
    roomId: "room-2",
    typeId: "type-seguimiento",
    start: at(10, 0),
    end: addMinutes(at(10, 0), 45),
    status: "confirmada",
    remindersDispatched: ["email"],
    source: "recurrencia",
  },
  {
    id: "a-007",
    patientId: "p-007",
    patientName: "Valentina Castro",
    therapistId: "th-002",
    roomId: "room-4",
    typeId: "type-seguimiento",
    start: at(11, 0),
    end: addMinutes(at(11, 0), 45),
    status: "no-show",
    remindersDispatched: ["email", "whatsapp", "sms"],
    notes: "No se presentó. Aplicar política.",
    source: "recurrencia",
  },
  {
    id: "a-008",
    patientId: "p-008",
    patientName: "Fernando Morales",
    therapistId: "th-002",
    roomId: "room-2",
    typeId: "type-reeval",
    start: at(13, 0),
    end: addMinutes(at(13, 0), 45),
    status: "confirmada",
    remindersDispatched: ["email"],
    source: "panel",
  },
  {
    id: "a-009",
    patientId: "p-001",
    patientName: "Lucía Méndez",
    therapistId: "th-001",
    roomId: "room-3",
    typeId: "type-hidro",
    start: at(15, 0),
    end: addMinutes(at(15, 0), 60),
    status: "confirmada",
    remindersDispatched: ["email", "whatsapp"],
    notes: "Segunda sesión de hidroterapia",
    source: "panel",
  },
  // ── DÍA +1 (jueves) ───────────────────────────────────────
  {
    id: "a-010",
    patientId: "p-003",
    patientName: "Marta Rivas",
    therapistId: "th-001",
    roomId: "room-4",
    typeId: "type-seguimiento",
    start: at(9, 1),
    end: addMinutes(at(9, 1), 45),
    status: "confirmada",
    remindersDispatched: ["email"],
    source: "recurrencia",
  },
  {
    id: "a-011",
    patientId: "p-006",
    patientName: "Roberto Giménez",
    therapistId: "th-001",
    roomId: "room-1",
    typeId: "type-seguimiento",
    start: at(10, 1),
    end: addMinutes(at(10, 1), 45),
    status: "confirmada",
    remindersDispatched: ["email"],
    source: "recurrencia",
  },
  {
    id: "a-012",
    patientId: "p-002",
    patientName: "Carlos Pérez",
    therapistId: "th-002",
    roomId: "room-2",
    typeId: "type-seguimiento",
    start: at(9, 1),
    end: addMinutes(at(9, 1), 45),
    status: "cancelada",
    remindersDispatched: ["email"],
    notes: "Cancelada con 2h de anticipación",
    source: "recurrencia",
  },
  // ── DÍA +2 (viernes) ──────────────────────────────────────
  {
    id: "a-013",
    patientId: "p-001",
    patientName: "Lucía Méndez",
    therapistId: "th-001",
    roomId: "room-1",
    typeId: "type-seguimiento",
    start: at(9, 2),
    end: addMinutes(at(9, 2), 45),
    status: "confirmada",
    remindersDispatched: [],
    notes: "Recordatorio programado 24h antes",
    source: "recurrencia",
  },
  {
    id: "a-014",
    patientId: "p-005",
    patientName: "Sofía Acosta",
    therapistId: "th-002",
    roomId: "room-2",
    typeId: "type-seguimiento",
    start: at(10, 2),
    end: addMinutes(at(10, 2), 45),
    status: "confirmada",
    remindersDispatched: [],
    source: "recurrencia",
  },
  // ── DÍA +3 (sábado) ───────────────────────────────────────
  {
    id: "a-015",
    patientId: "p-004",
    patientName: "Diego Salazar",
    therapistId: "th-001",
    roomId: "room-1",
    typeId: "type-reeval",
    start: at(10, 3),
    end: addMinutes(at(10, 3), 45),
    status: "confirmada",
    remindersDispatched: [],
    source: "panel",
  },
];

// ─────────────────────────────────────────────────────────────
// Lista de espera
// ─────────────────────────────────────────────────────────────

export const waitlist: WaitlistEntry[] = [
  {
    id: "wl-001",
    patientId: "p-008",
    patientName: "Fernando Morales",
    desiredDate: at(9, 0),
    typeId: "type-hidro",
    priority: "alta",
    notes: "Quiere hidroterapia antes de fin de mes",
    createdAt: at(14, -3),
  },
  {
    id: "wl-002",
    patientId: "p-005",
    patientName: "Sofía Acosta",
    desiredDate: at(11, 2),
    therapistId: "th-002",
    typeId: "type-seguimiento",
    priority: "media",
    notes: "Solicita turno fuera del horario laboral",
    createdAt: at(9, -1),
  },
  {
    id: "wl-003",
    patientId: "p-002",
    patientName: "Carlos Pérez",
    desiredDate: at(16, 0),
    typeId: "type-seguimiento",
    priority: "baja",
    createdAt: at(8, 0),
  },
];

// ─────────────────────────────────────────────────────────────
// Bloqueos de calendario
// ─────────────────────────────────────────────────────────────

export const calendarBlocks: CalendarBlock[] = [
  {
    id: "blk-1",
    type: "vacaciones",
    title: "Lic. Ana Rodríguez — Vacaciones",
    start: at(0, 7),
    end: at(23, 13),
    therapistId: "th-001",
  },
  {
    id: "blk-2",
    type: "mantenimiento",
    title: "Mantenimiento pileta",
    start: at(13, 0),
    end: at(16, 0),
    roomId: "room-3",
  },
  {
    id: "blk-3",
    type: "curso",
    title: "Curso: Actualización en dolor lumbar",
    start: at(8, 5),
    end: at(13, 5),
    therapistId: "th-002",
  },
  {
    id: "blk-4",
    type: "equipamiento",
    title: "Calibración mesa de tracción",
    start: at(15, 1),
    end: at(17, 1),
    roomId: "room-5",
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

export function getTherapistById(id: string): Therapist | undefined {
  return therapists.find((t) => t.id === id);
}

export function getRoomById(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}

export function getTypeById(id: string): AppointmentType | undefined {
  return appointmentTypes.find((t) => t.id === id);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}

export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const today = new Date("2026-08-05T12:00:00");
  return d.toDateString() === today.toDateString();
}

export function durationMin(start: string, end: string): number {
  return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
}

export const statusLabels: Record<Appointment["status"], string> = {
  confirmada: "Confirmada",
  asistio: "Asistió",
  "no-show": "No-show",
  cancelada: "Cancelada",
  reagendada: "Reagendada",
};

export const statusChipClass: Record<Appointment["status"], string> = {
  confirmada: "chip-info",
  asistio: "chip-success",
  "no-show": "chip-danger",
  cancelada: "chip-neutral",
  reagendada: "chip-warning",
};

export const priorityChipClass: Record<WaitlistEntry["priority"], string> = {
  alta: "chip-danger",
  media: "chip-warning",
  baja: "chip-neutral",
};

export const blockChipClass: Record<CalendarBlock["type"], string> = {
  vacaciones: "chip-warning",
  equipamiento: "chip-danger",
  mantenimiento: "chip-info",
  curso: "chip-primary",
};

// ─────────────────────────────────────────────────────────────
// Cálculos KPI
// ─────────────────────────────────────────────────────────────

export function getKpis() {
  const today = appointments.filter((a) => isToday(a.start));
  const noShowsToday = today.filter((a) => a.status === "no-show").length;
  const occupancy = Math.round((today.filter((a) => a.status !== "cancelada").length / 20) * 100);
  const upcomingWeek = appointments.filter((a) => {
    const d = new Date(a.start);
    const now = new Date("2026-08-05T12:00:00");
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7 && a.status === "confirmada";
  }).length;
  return {
    today: today.length,
    noShowsToday,
    occupancy: Math.min(occupancy, 100),
    waitlist: waitlist.length,
    upcomingWeek,
  };
}
