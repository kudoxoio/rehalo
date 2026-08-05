/**
 * AppointmentsCalendar.tsx
 *
 * Island de React con FullCalendar v7 + interacción.
 * Se hidrata con `client:load` desde /dashboard/appointments.astro.
 *
 * Features:
 * - Vista semana (default) / día / mes
 * - Drag & drop para reagendar (eventDrop)
 * - Resize para cambiar duración (eventResize)
 * - Click en slot vacío → crear cita (select)
 * - Click en evento → editar / eliminar (eventClick)
 * - Filtro por terapeuta
 * - Estado local (mock); backend cuando exista
 */

import { useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type {
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";

import "@fullcalendar/react/skeleton.css";

// ─────────────────────────────────────────────────────────────
// Tipos públicos
// ─────────────────────────────────────────────────────────────

export interface PatientOption {
  id: string;
  name: string;
}

export interface TherapistOption {
  id: string;
  name: string;
  color: string;
}

export interface TypeOption {
  id: string;
  name: string;
  durationMin: number;
  color: string;
}

export interface RoomOption {
  id: string;
  name: string;
}

export interface InitialAppointment {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  roomId: string;
  typeId: string;
  start: string;
  end: string;
  status:
    | "confirmada"
    | "asistio"
    | "no-show"
    | "cancelada"
    | "reagendada";
  notes?: string;
}

interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    patientId: string;
    therapistId: string;
    typeId: string;
    roomId: string;
    status: InitialAppointment["status"];
    notes?: string;
  };
}

type ModalMode = "create" | "edit";

interface ModalState {
  mode: ModalMode;
  id?: string;
  start: string;
  end: string;
  patientId: string;
  therapistId: string;
  typeId: string;
  roomId: string;
  status: InitialAppointment["status"];
  notes: string;
}

const STATUS_LABELS: Record<InitialAppointment["status"], string> = {
  confirmada: "Confirmada",
  asistio: "Asistió",
  "no-show": "No-show",
  cancelada: "Cancelada",
  reagendada: "Reagendada",
};

const STATUS_CLASSES: Record<InitialAppointment["status"], string> = {
  confirmada: "chip chip-info",
  asistio: "chip chip-success",
  "no-show": "chip chip-danger",
  cancelada: "chip chip-neutral",
  reagendada: "chip chip-warning",
};

// Color por terapeuta — coincide con el sistema de avatars
function colorToBg(color: string): string {
  const map: Record<string, string> = {
    primary: "#84cc16",
    info: "#06b6d4",
    warning: "#f59e0b",
    success: "#10b981",
    destructive: "#ef4444",
  };
  return map[color] ?? "#84cc16";
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function toLocalInput(iso: string): string {
  // Para <input type="datetime-local"> — usa la zona local del navegador
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(local: string): string {
  return new Date(local).toISOString();
}

/**
 * Formatea una Date como ISO local SIN sufijo Z.
 * Es el formato que usa `<input type="datetime-local">` y el que devuelve
 * FullCalendar en `startStr`/`endStr` al hacer `select`. Hay que guardar en
 * este formato (no UTC) para que al re-leer el string el navegador lo
 * interprete como la MISMA hora local que tenía el usuario en pantalla.
 */
function formatLocalIso(date: Date): string {
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function emptyModal(): ModalState {
  const now = new Date();
  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 45);
  return {
    mode: "create",
    start: start.toISOString(),
    end: end.toISOString(),
    patientId: "",
    therapistId: "",
    typeId: "",
    roomId: "",
    status: "confirmada",
    notes: "",
  };
}

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────

interface Props {
  initialAppointments: InitialAppointment[];
  patients: PatientOption[];
  therapists: TherapistOption[];
  types: TypeOption[];
  rooms: RoomOption[];
}

export default function AppointmentsCalendar({
  initialAppointments,
  patients,
  therapists,
  types,
  rooms,
}: Props) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    initialAppointments.map((a) => ({
      id: a.id,
      title: a.patientName,
      start: a.start,
      end: a.end,
      backgroundColor: colorToBg(
        therapists.find((t) => t.id === a.therapistId)?.color ?? "primary",
      ),
      borderColor: colorToBg(
        therapists.find((t) => t.id === a.therapistId)?.color ?? "primary",
      ),
      textColor: "#ffffff",
      classNames: ["rehalo-fc-event", `status-${a.status}`],
      extendedProps: {
        patientId: a.patientId,
        therapistId: a.therapistId,
        typeId: a.typeId,
        roomId: a.roomId,
        status: a.status,
        notes: a.notes,
      },
    })),
  );

  const [modal, setModal] = useState<ModalState | null>(null);
  const [therapistFilter, setTherapistFilter] = useState<string>("all");
  const [toast, setToast] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => {
    const visible = events.filter(
      (e) => therapistFilter === "all" || e.extendedProps.therapistId === therapistFilter,
    );
    return {
      total: visible.length,
      confirmadas: visible.filter((e) => e.extendedProps.status === "confirmada").length,
      asistio: visible.filter((e) => e.extendedProps.status === "asistio").length,
      noShow: visible.filter((e) => e.extendedProps.status === "no-show").length,
    };
  }, [events, therapistFilter]);

  // ── Handlers ──────────────────────────────────────────────

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSelect(info: { startStr: string; endStr: string }) {
    setModal({
      ...emptyModal(),
      start: info.startStr,
      end: info.endStr,
      therapistId: therapists[0]?.id ?? "",
    });
  }

  function handleEventClick(info: EventClickArg) {
    const e = info.event;
    const props = e.extendedProps as CalendarEvent["extendedProps"];
    setModal({
      mode: "edit",
      id: e.id,
      start: e.startStr,
      end: e.endStr,
      patientId: props.patientId,
      therapistId: props.therapistId,
      typeId: props.typeId,
      roomId: props.roomId,
      status: props.status,
      notes: props.notes ?? "",
    });
  }

  function handleEventDrop(info: EventDropArg) {
    if (!info.event.start || !info.event.end) return;
    const id = info.event.id;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, start: info.event.startStr, end: info.event.endStr }
          : e,
      ),
    );
    showToast(`Cita reagendada para ${info.event.startStr}`);
  }

  function handleEventResize(info: { event: { id: string; startStr: string; endStr: string } }) {
    const id = info.event.id;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, start: info.event.startStr, end: info.event.endStr }
          : e,
      ),
    );
    showToast(`Duración actualizada`);
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal) return;

    const type = types.find((t) => t.id === modal.typeId);
    const patient = patients.find((p) => p.id === modal.patientId);
    const therapist = therapists.find((t) => t.id === modal.therapistId);

    if (!patient || !therapist) {
      showToast("Paciente y terapeuta son obligatorios");
      return;
    }

    const newEvent: CalendarEvent = {
      id: modal.mode === "edit" && modal.id ? modal.id : `a-${Date.now()}`,
      title: patient.name,
      start: fromLocalInput(modal.start),
      end: fromLocalInput(modal.end),
      backgroundColor: colorToBg(therapist.color),
      borderColor: colorToBg(therapist.color),
      textColor: "#ffffff",
      classNames: ["rehalo-fc-event", `status-${modal.status}`],
      extendedProps: {
        patientId: patient.id,
        therapistId: therapist.id,
        typeId: modal.typeId,
        roomId: modal.roomId,
        status: modal.status,
        notes: modal.notes,
      },
    };

    if (modal.mode === "edit" && modal.id) {
      setEvents((prev) => prev.map((ev) => (ev.id === modal.id ? newEvent : ev)));
      showToast("Cita actualizada");
    } else {
      setEvents((prev) => [...prev, newEvent]);
      showToast(`Nueva cita: ${patient.name}`);
    }

    setModal(null);
  }

  function handleDelete() {
    if (!modal || modal.mode !== "edit" || !modal.id) return;
    if (!confirm("¿Eliminar esta cita? Esta acción no se puede deshacer.")) return;
    setEvents((prev) => prev.filter((e) => e.id !== modal.id));
    showToast("Cita eliminada");
    setModal(null);
  }

  function applyTypeDefaults(typeId: string) {
    if (!modal) return;
    const type = types.find((t) => t.id === typeId);
    if (!type) return;
    const start = new Date(modal.start);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + type.durationMin);
    // Guardamos en formato local-sin-Z (igual que modal.start) para que el
    // input muestre la misma hora local que el usuario ve, sin el offset UTC.
    setModal({ ...modal, typeId, end: formatLocalIso(end) });
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="rehalo-calendar-island">
      {/* Toolbar */}
      <div className="surface-card mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => calendarRef.current?.getApi().today()}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => calendarRef.current?.getApi().prev()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => calendarRef.current?.getApi().next()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent"
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={therapistFilter}
              onChange={(e) => setTherapistFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-card px-3 text-sm"
            >
              <option value="all">Todos los terapeutas</option>
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-border bg-card p-0.5">
              {[
                { id: "timeGridDay", label: "Día" },
                { id: "timeGridWeek", label: "Semana" },
                { id: "dayGridMonth", label: "Mes" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => calendarRef.current?.getApi().changeView(v.id)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  {v.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setModal(emptyModal())}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              + Nueva cita
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground">
            <strong className="text-foreground">{stats.total}</strong> visibles
          </span>
          <span className="text-info">
            <strong>{stats.confirmadas}</strong> confirmadas
          </span>
          <span className="text-success">
            <strong>{stats.asistio}</strong> asistidas
          </span>
          <span className="text-destructive">
            <strong>{stats.noShow}</strong> no-show
          </span>
        </div>
      </div>

      {/* Calendar */}
      <div className="surface-card overflow-hidden p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          firstDay={1}
          headerToolbar={false}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
          slotDuration="00:30:00"
          allDaySlot={false}
          nowIndicator={true}
          weekends={true}
          selectable={true}
          selectMirror={true}
          editable={true}
          eventResizableFromStart={true}
          dayMaxEvents={true}
          events={events.filter(
            (e) =>
              therapistFilter === "all" ||
              e.extendedProps.therapistId === therapistFilter,
          )}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-3">
              <h3 className="text-base font-semibold">
                {modal.mode === "edit" ? "Editar cita" : "Nueva cita"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </header>

            <form onSubmit={handleSave} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium">Paciente</label>
                <select
                  required
                  value={modal.patientId}
                  onChange={(e) => setModal({ ...modal, patientId: e.target.value })}
                  className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                >
                  <option value="">Seleccionar paciente…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Terapeuta</label>
                  <select
                    required
                    value={modal.therapistId}
                    onChange={(e) => setModal({ ...modal, therapistId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                  >
                    <option value="">Seleccionar…</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Tipo de cita</label>
                  <select
                    required
                    value={modal.typeId}
                    onChange={(e) => applyTypeDefaults(e.target.value)}
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                  >
                    <option value="">Seleccionar…</option>
                    {types.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.durationMin} min)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Inicio</label>
                  <input
                    type="datetime-local"
                    required
                    value={toLocalInput(modal.start)}
                    onChange={(e) => setModal({ ...modal, start: fromLocalInput(e.target.value) })}
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Fin</label>
                  <input
                    type="datetime-local"
                    required
                    value={toLocalInput(modal.end)}
                    onChange={(e) => setModal({ ...modal, end: fromLocalInput(e.target.value) })}
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Sala</label>
                  <select
                    value={modal.roomId}
                    onChange={(e) => setModal({ ...modal, roomId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                  >
                    <option value="">Sin asignar</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Estado</label>
                  <select
                    value={modal.status}
                    onChange={(e) =>
                      setModal({
                        ...modal,
                        status: e.target.value as InitialAppointment["status"],
                      })
                    }
                    className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
                  >
                    {Object.entries(STATUS_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Notas</label>
                <textarea
                  rows={2}
                  value={modal.notes}
                  onChange={(e) => setModal({ ...modal, notes: e.target.value })}
                  className="w-full rounded-lg border border-input bg-card p-3 text-sm"
                  placeholder="Observaciones para la sesión…"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  {modal.mode === "edit" && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-3 text-sm font-semibold text-destructive hover:bg-destructive/15"
                    >
                      🗑 Eliminar
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="h-10 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-accent"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    {modal.mode === "edit" ? "Guardar cambios" : "Crear cita"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
          {toast}
        </div>
      )}

      {/* Custom FullCalendar overrides */}
      <style>{`
        .rehalo-calendar-island .fc {
          font-family: inherit;
          color: inherit;
        }
        .rehalo-calendar-island .fc-toolbar-title {
          font-size: 1rem;
          font-weight: 600;
        }
        .rehalo-calendar-island .fc-col-header-cell {
          background: var(--color-card);
          border-color: var(--color-border);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-muted-foreground);
          padding: 8px;
        }
        .rehalo-calendar-island .fc-timegrid-slot {
          height: 36px;
          border-color: var(--color-border);
        }
        .rehalo-calendar-island .fc-timegrid-axis-cushion,
        .rehalo-calendar-island .fc-timegrid-slot-label-cushion {
          font-size: 0.7rem;
          color: var(--color-muted-foreground);
        }
        .rehalo-calendar-island .fc-timegrid-event-harness {
          margin: 1px 3px;
        }
        .rehalo-calendar-island .fc-event {
          border-radius: 6px;
          border-width: 0 0 0 3px;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 6px;
          cursor: pointer;
          transition: transform 120ms ease;
        }
        .rehalo-calendar-island .fc-event:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .rehalo-calendar-island .fc-event-title {
          font-weight: 700;
        }
        .rehalo-calendar-island .fc-event-time {
          opacity: 0.9;
        }
        .rehalo-calendar-island .fc-now-indicator-line {
          border-color: var(--color-primary);
          border-width: 2px;
        }
        .rehalo-calendar-island .fc-now-indicator-arrow {
          border-top-color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }
        .rehalo-calendar-island .status-no-show {
          opacity: 0.7;
          text-decoration: line-through;
        }
        .rehalo-calendar-island .status-cancelada {
          opacity: 0.5;
          text-decoration: line-through;
        }
        .rehalo-calendar-island .fc-highlight {
          background: var(--color-primary) !important;
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
}
