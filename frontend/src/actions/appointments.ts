/**
 * actions/appointments.ts
 *
 * Server actions para gestión de citas (Spec 2.2).
 * Mockeado: en producción esto llama al backend de calendario.
 */
import { defineAction } from "astro:actions";
import { z } from "astro:schema";

const isoDateTime = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida");

export const appointments = {
  /**
   * Crear / agendar una cita.
   * Spec 2.2 — "Tipos de citas configurables (con equipamiento)…
   * Reservación online desde portal del paciente…
   * Lista de espera automática con reasignación."
   */
  create: defineAction({
    accept: "form",
    input: z.object({
      patientId: z.string().min(1, "Seleccioná un paciente"),
      therapistId: z.string().min(1, "Seleccioná un terapeuta"),
      roomId: z.string().min(1, "Seleccioná una sala"),
      typeId: z.string().min(1, "Seleccioná un tipo de cita"),
      start: isoDateTime,
      notes: z.string().max(500).optional().default(""),
      source: z.enum(["panel", "portal", "recurrencia"]).default("panel"),
    }),
    handler: async (input) => {
      // Validación cruzada: equipo disponible en la sala
      // (En producción: contra inventario real)
      return {
        ok: true as const,
        appointmentId: `a-${Date.now()}`,
        createdAt: new Date().toISOString(),
        remindersScheduled: ["email", "whatsapp"],
      };
    },
  }),

  /**
   * Reagendar una cita, mover a lista de espera o liberar slot.
   */
  reschedule: defineAction({
    accept: "form",
    input: z.object({
      appointmentId: z.string().min(1),
      newStart: isoDateTime,
      reason: z.string().max(200).optional().default(""),
    }),
    handler: async (input) => {
      return { ok: true as const, newStart: input.newStart };
    },
  }),

  /**
   * Marcar no-show / cancelación.
   * Aplica política configurable del clinic.
   */
  markAttendance: defineAction({
    accept: "form",
    input: z.object({
      appointmentId: z.string().min(1),
      status: z.enum(["asistio", "no-show", "cancelada"]),
      notes: z.string().max(300).optional(),
    }),
    handler: async (input) => {
      return { ok: true as const, status: input.status };
    },
  }),

  /**
   * Disparar recordatorio manual (email / SMS / WhatsApp).
   */
  sendReminder: defineAction({
    accept: "form",
    input: z.object({
      appointmentId: z.string().min(1),
      channel: z.enum(["email", "sms", "whatsapp"]),
    }),
    handler: async (input) => ({ ok: true as const, channel: input.channel, sentAt: new Date().toISOString() }),
  }),

  /**
   * Bloquear slot (mantenimiento, vacaciones, cursos).
   */
  blockSlot: defineAction({
    accept: "form",
    input: z.object({
      type: z.enum(["vacaciones", "equipamiento", "mantenimiento", "curso"]),
      title: z.string().min(2).max(80),
      start: isoDateTime,
      end: isoDateTime,
      therapistId: z.string().optional(),
      roomId: z.string().optional(),
    }),
    handler: async (input) => ({ ok: true as const, blockId: `blk-${Date.now()}` }),
  }),
};
