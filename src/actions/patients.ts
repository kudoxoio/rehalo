/**
 * actions/patients.ts
 *
 * Server actions para gestión de pacientes (Spec 2.1).
 * En producción, estos handlers llaman al backend. Por ahora hacen
 * mock: validan con Zod, asignan ID, y devuelven OK.
 */
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

const dniRegex = /^[\d.\-\s]{6,15}$/;
const phoneRegex = /^[+\d\s().\-]{6,20}$/;
const icd10Regex = /^[A-Z]\d{2}(\.\d)?$/;

export const patients = {
  /**
   * Alta de paciente.
   * Spec 2.1 — "Alta de paciente con datos demográficos,
   * contacto de emergencia, seguro médico."
   */
  create: defineAction({
    accept: "form",
    input: z.object({
      firstName: z.string().min(2, "Mínimo 2 caracteres").max(60),
      lastName: z.string().min(2, "Mínimo 2 caracteres").max(60),
      dni: z.string().regex(dniRegex, "DNI inválido"),
      birthDate: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida"),
      sex: z.enum(["F", "M", "X"]),
      phone: z.string().regex(phoneRegex, "Teléfono inválido"),
      email: z.string().email("Email inválido").optional().or(z.literal("")),
      address: z.string().max(200).optional().default(""),
      city: z.string().max(100).optional().default(""),
      emergencyName: z.string().min(2, "Requerido"),
      emergencyRelation: z.enum([
        "Esposo/a",
        "Hijo/a",
        "Padre/Madre",
        "Hermano/a",
        "Otro familiar",
        "Amistad",
      ]),
      emergencyPhone: z.string().regex(phoneRegex, "Teléfono inválido"),
      insuranceCompany: z.string().min(2),
      insurancePlan: z.string().max(60).optional().default(""),
      memberNumber: z.string().max(40).optional().default(""),
      icd10: z.string().regex(icd10Regex, "CIE-10 inválido (ej: M54.5)"),
      consultReason: z.string().min(10, "Describí el motivo (mínimo 10 caracteres)"),
      consentSigned: z.string().optional(),
    }),
    handler: async (input) => {
      // ─── Mock: en producción acá iría la llamada al backend ──────────
      // await api.post('/patients', { ...input, consentSignedAt: input.consentSigned ? new Date() : null })

      // Generar ID determinístico para demo
      const nextId = `p-${String(Math.floor(Math.random() * 900) + 100)}`;
      return {
        ok: true as const,
        patientId: nextId,
        createdAt: new Date().toISOString(),
        consentSigned: input.consentSigned === "true",
      };
    },
  }),

  /**
   * Subir adjunto (imagen, RX, video).
   * Spec 2.1 — "Adjuntos: imágenes, estudios de imagenología, videos…"
   */
  uploadAttachment: defineAction({
    accept: "form",
    input: z.object({
      patientId: z.string().min(1),
      category: z.enum(["RX", "RM", "Ecografía", "Marcha", "Foto clínica", "Documento"]),
      notes: z.string().max(500).optional(),
    }),
    handler: async (input) => {
      // En producción: subir a S3/R2 + guardar ref en DB
      return { ok: true as const, attachmentId: `a-${Date.now()}` };
    },
  }),
};