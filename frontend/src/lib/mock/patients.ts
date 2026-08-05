/**
 * mock/patients.ts
 *
 * Datos de demo para el MVP. Cuando esté el backend, esto se reemplaza
 * por fetches a la API. La forma de los objetos está alineada con lo que
 * el backend expondrá (ver SPECIFICATIONS.md sección 2.1).
 */

export type Pathology =
  | "Lumbalgia mecánica"
  | "Cervicalgia"
  | "Lesión de manguito rotador"
  | "Post-operatorio LCA"
  | "Epicondilitis"
  | "Fascitis plantar"
  | "Esguince tobillo"
  | "Tendinopatía rotuliana"
  | "Hernia discal lumbar"
  | "Capsulitis adhesiva";

export interface MedicalHistory {
  pathologies: string[]; // Antecedentes patológicos
  surgeries: string[]; // Antecedentes quirúrgicos
  medications: string[]; // Farmacológicos actuales
  allergies: string[]; // Alergias
}

export interface PainScale {
  eva: number; // 0-10 (EVA / NPRS)
  location: string;
  since: string; // ISO date
}

export interface RangeOfMotion {
  joint: string; // "hombro", "rodilla", etc.
  movement: string; // "flexión", "abducción"
  degrees: number;
  normalDegrees: number;
}

export interface MuscleStrength {
  // Escala Daniels 0-5
  muscle: string;
  side: "izq" | "der" | "ambos";
  grade: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface OrthopedicTest {
  name: string; // "Neer", "Hawkins", "Lachman"
  positive: boolean;
  notes?: string;
}

export interface ValidatedScale {
  name: "Oswestry" | "DASH" | "Lysholm" | "Berg" | "Tinetti";
  score: number;
  maxScore: number;
  interpretation: string;
  date: string;
}

export interface Consent {
  id: string;
  type: "Consentimiento informado" | "Consentimiento de tratamiento" | "Cesión de imagen";
  signedAt: string;
  expiresAt: string;
  signedBy: string;
}

export interface Attachment {
  id: string;
  type: "image" | "video" | "pdf" | "imaging";
  name: string;
  category: "RX" | "RM" | "Ecografía" | "Marcha" | "Foto clínica" | "Documento";
  uploadedAt: string;
  size: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type:
    | "Evaluación inicial"
    | "Sesión"
    | "Reevaluación"
    | "Nota clínica"
    | "Consentimiento"
    | "Adjunto"
    | "Alta";
  title: string;
  description?: string;
  author: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: "Creación" | "Edición" | "Consulta" | "Eliminación" | "Firma";
  field?: string;
  before?: string;
  after?: string;
}

export interface Patient {
  id: string;
  // Demográficos
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string; // ISO
  sex: "M" | "F" | "X";
  phone: string;
  email: string;
  address: string;
  city: string;
  // Contacto emergencia
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  // Seguro médico
  insurance: {
    company: string;
    plan: string;
    memberNumber: string;
    copay?: number;
  };
  // Clínico
  primaryPathology: Pathology;
  icd10: string;
  medicalHistory: MedicalHistory;
  painScale: PainScale;
  rom: RangeOfMotion[];
  strength: MuscleStrength[];
  orthopedicTests: OrthopedicTest[];
  scales: ValidatedScale[];
  consents: Consent[];
  attachments: Attachment[];
  timeline: TimelineEvent[];
  audit: AuditEntry[];
  // Metadata
  therapistId: string;
  status: "activo" | "alta" | "inactivo";
  enrolledAt: string;
}

const TODAY = new Date("2026-08-05");
function daysAgo(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
function daysAhead(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const patients: Patient[] = [
  {
    id: "p-001",
    firstName: "Lucía",
    lastName: "Méndez",
    dni: "28.456.789",
    birthDate: "1985-03-12",
    sex: "F",
    phone: "+54 11 4567-8901",
    email: "lucia.mendez@email.com",
    address: "Av. Corrientes 1234, 5°B",
    city: "CABA, Buenos Aires",
    emergencyContact: {
      name: "Carlos Méndez",
      relation: "Esposo",
      phone: "+54 11 4567-8902",
    },
    insurance: {
      company: "OSDE",
      plan: "210",
      memberNumber: "12345678901",
      copay: 0,
    },
    primaryPathology: "Lumbalgia mecánica",
    icd10: "M54.5",
    medicalHistory: {
      pathologies: ["Hipertensión controlada (2018)"],
      surgeries: ["Apendicectomía (2010)"],
      medications: ["Losartán 50mg/día"],
      allergies: ["Penicilina (urticaria)"],
    },
    painScale: { eva: 6, location: "Zona lumbar L4-L5, irradiada a glúteo derecho", since: daysAgo(45) },
    rom: [
      { joint: "Columna lumbar", movement: "Flexión", degrees: 45, normalDegrees: 60 },
      { joint: "Columna lumbar", movement: "Extensión", degrees: 15, normalDegrees: 25 },
      { joint: "Cadera derecha", movement: "Rotación interna", degrees: 25, normalDegrees: 45 },
    ],
    strength: [
      { muscle: "Cuadriceps", side: "der", grade: 4 },
      { muscle: "Glúteo mayor", side: "der", grade: 3 },
      { muscle: "Core (abdominales)", side: "ambos", grade: 3 },
    ],
    orthopedicTests: [
      { name: "Lasègue", positive: true, notes: "Positivo a 30° en miembro inferior derecho" },
      { name: "Slump test", positive: true },
      { name: "FABER", positive: false },
    ],
    scales: [
      { name: "Oswestry", score: 28, maxScore: 50, interpretation: "Discapacidad moderada", date: daysAgo(40) },
    ],
    consents: [
      { id: "c1", type: "Consentimiento informado", signedAt: daysAgo(40), expiresAt: daysAhead(325), signedBy: "Lucía Méndez" },
      { id: "c2", type: "Consentimiento de tratamiento", signedAt: daysAgo(40), expiresAt: daysAhead(325), signedBy: "Lucía Méndez" },
    ],
    attachments: [
      { id: "a1", type: "imaging", name: "RM lumbar L4-S1.pdf", category: "RM", uploadedAt: daysAgo(35), size: "2.4 MB" },
      { id: "a2", type: "video", name: "Marcha - evaluación inicial.mp4", category: "Marcha", uploadedAt: daysAgo(40), size: "18.2 MB" },
      { id: "a3", type: "image", name: "Foto postura lateral.jpg", category: "Foto clínica", uploadedAt: daysAgo(40), size: "1.1 MB" },
    ],
    timeline: [
      { id: "t1", date: daysAgo(40), type: "Evaluación inicial", title: "Primera consulta", description: "Lumbalgia mecánica subaguda. EVA 6/10.", author: "Lic. Ana Rodríguez" },
      { id: "t2", date: daysAgo(38), type: "Adjunto", title: "Carga de RM lumbar L4-S1", author: "Lic. Ana Rodríguez" },
      { id: "t3", date: daysAgo(35), type: "Sesión", title: "Sesión #3 — Terapia manual + TENS", author: "Lic. Ana Rodríguez" },
      { id: "t4", date: daysAgo(28), type: "Sesión", title: "Sesión #7 — Fortalecimiento core", description: "Progresión de ejercicios sin dolor.", author: "Lic. Ana Rodríguez" },
      { id: "t5", date: daysAgo(14), type: "Reevaluación", title: "Reevaluación de medio término", description: "EVA bajó a 4/10. Oswestry 22/50.", author: "Lic. Ana Rodríguez" },
      { id: "t6", date: daysAgo(7), type: "Sesión", title: "Sesión #12 — Estabilización lumbar", author: "Lic. Ana Rodríguez" },
    ],
    audit: [
      { id: "au1", timestamp: daysAgo(40), user: "Lic. Ana Rodríguez", action: "Creación", field: "Expediente", after: "Paciente dado de alta" },
      { id: "au2", timestamp: daysAgo(40), user: "Lucía Méndez", action: "Firma", field: "Consentimiento informado" },
      { id: "au3", timestamp: daysAgo(14), user: "Lic. Ana Rodríguez", action: "Edición", field: "Escala Oswestry", before: "32/50", after: "22/50" },
      { id: "au4", timestamp: daysAgo(3), user: "Admin Sistema", action: "Consulta", field: "Expediente completo" },
    ],
    therapistId: "th-001",
    status: "activo",
    enrolledAt: daysAgo(40),
  },
  {
    id: "p-002",
    firstName: "Carlos",
    lastName: "Pérez",
    dni: "32.789.012",
    birthDate: "1972-09-22",
    sex: "M",
    phone: "+54 11 5678-1234",
    email: "carlos.perez@email.com",
    address: "Calle Lavalle 567, 2°A",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "María Pérez", relation: "Hija", phone: "+54 11 5678-1235" },
    insurance: { company: "Swiss Medical", plan: "Premium", memberNumber: "98765432100" },
    primaryPathology: "Lesión de manguito rotador",
    icd10: "M75.1",
    medicalHistory: {
      pathologies: ["Diabetes tipo 2"],
      surgeries: [],
      medications: ["Metformina 850mg"],
      allergies: [],
    },
    painScale: { eva: 7, location: "Hombro derecho, región deltoidea", since: daysAgo(20) },
    rom: [
      { joint: "Hombro derecho", movement: "Abducción", degrees: 95, normalDegrees: 180 },
      { joint: "Hombro derecho", movement: "Flexión", degrees: 110, normalDegrees: 180 },
    ],
    strength: [
      { muscle: "Manguito rotador", side: "der", grade: 3 },
      { muscle: "Deltoides", side: "der", grade: 4 },
    ],
    orthopedicTests: [
      { name: "Neer", positive: true },
      { name: "Hawkins-Kennedy", positive: true },
      { name: "Empty can", positive: true },
    ],
    scales: [{ name: "DASH", score: 52, maxScore: 100, interpretation: "Discapacidad severa", date: daysAgo(18) }],
    consents: [
      { id: "c3", type: "Consentimiento informado", signedAt: daysAgo(18), expiresAt: daysAhead(347), signedBy: "Carlos Pérez" },
    ],
    attachments: [
      { id: "a4", type: "imaging", name: "RM hombro derecho.pdf", category: "RM", uploadedAt: daysAgo(15), size: "3.1 MB" },
    ],
    timeline: [
      { id: "t7", date: daysAgo(18), type: "Evaluación inicial", title: "Evaluación inicial hombro derecho", author: "Lic. Diego Salazar" },
      { id: "t8", date: daysAgo(10), type: "Sesión", title: "Sesión #4 — Movilización pasiva", author: "Lic. Diego Salazar" },
    ],
    audit: [{ id: "au5", timestamp: daysAgo(18), user: "Lic. Diego Salazar", action: "Creación" }],
    therapistId: "th-002",
    status: "activo",
    enrolledAt: daysAgo(18),
  },
  {
    id: "p-003",
    firstName: "Marta",
    lastName: "Rivas",
    dni: "41.234.567",
    birthDate: "1990-06-15",
    sex: "F",
    phone: "+54 11 6789-2345",
    email: "marta.rivas@email.com",
    address: "Av. Santa Fe 3456, 8°A",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "Pedro Rivas", relation: "Hermano", phone: "+54 11 6789-2346" },
    insurance: { company: "Galeno", plan: "220", memberNumber: "11223344556" },
    primaryPathology: "Post-operatorio LCA",
    icd10: "Z96.651",
    medicalHistory: {
      pathologies: [],
      surgeries: ["Reconstrucción de LCA derecho (2026-04-10)"],
      medications: [],
      allergies: ["Ibuprofeno (gastrointestinal)"],
    },
    painScale: { eva: 3, location: "Rodilla derecha, zona peri-articular", since: daysAgo(110) },
    rom: [{ joint: "Rodilla derecha", movement: "Flexión", degrees: 110, normalDegrees: 135 }],
    strength: [{ muscle: "Cuadriceps", side: "der", grade: 4 }],
    orthopedicTests: [{ name: "Lachman", positive: false, notes: "Negativo — injerto competente" }],
    scales: [{ name: "Lysholm", score: 68, maxScore: 100, interpretation: "Bueno", date: daysAgo(30) }],
    consents: [
      { id: "c4", type: "Consentimiento informado", signedAt: daysAgo(110), expiresAt: daysAhead(255), signedBy: "Marta Rivas" },
    ],
    attachments: [
      { id: "a5", type: "imaging", name: "RX rodilla post-op.jpg", category: "RX", uploadedAt: daysAgo(105), size: "850 KB" },
    ],
    timeline: [
      { id: "t9", date: daysAgo(110), type: "Evaluación inicial", title: "Post-operatorio día 1", author: "Lic. Ana Rodríguez" },
      { id: "t10", date: daysAgo(80), type: "Sesión", title: "Sesión #15 — Reeducación de marcha", author: "Lic. Ana Rodríguez" },
      { id: "t11", date: daysAgo(30), type: "Reevaluación", title: "Lysholm 68/100", author: "Lic. Ana Rodríguez" },
    ],
    audit: [{ id: "au6", timestamp: daysAgo(110), user: "Lic. Ana Rodríguez", action: "Creación" }],
    therapistId: "th-001",
    status: "activo",
    enrolledAt: daysAgo(110),
  },
  {
    id: "p-004",
    firstName: "Diego",
    lastName: "Salazar",
    dni: "35.678.901",
    birthDate: "1988-11-30",
    sex: "M",
    phone: "+54 11 7890-3456",
    email: "diego.salazar@email.com",
    address: "Av. Rivadavia 7890, 3°C",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "Laura Salazar", relation: "Madre", phone: "+54 11 7890-3457" },
    insurance: { company: "Medife", plan: "Plata", memberNumber: "55443322110" },
    primaryPathology: "Cervicalgia",
    icd10: "M54.2",
    medicalHistory: {
      pathologies: ["Ansiedad (2022)"],
      surgeries: [],
      medications: ["Sertralina 50mg"],
      allergies: [],
    },
    painScale: { eva: 5, location: "Cuello, región cervical C5-C6", since: daysAgo(15) },
    rom: [{ joint: "Columna cervical", movement: "Rotación derecha", degrees: 50, normalDegrees: 80 }],
    strength: [],
    orthopedicTests: [{ name: "Spurling", positive: true, notes: "Irradiación a miembro superior derecho" }],
    scales: [{ name: "DASH", score: 35, maxScore: 100, interpretation: "Discapacidad moderada", date: daysAgo(12) }],
    consents: [],
    attachments: [],
    timeline: [
      { id: "t12", date: daysAgo(12), type: "Evaluación inicial", title: "Cervicalgia mecánica", author: "Lic. Ana Rodríguez" },
    ],
    audit: [{ id: "au7", timestamp: daysAgo(12), user: "Lic. Ana Rodríguez", action: "Creación" }],
    therapistId: "th-001",
    status: "activo",
    enrolledAt: daysAgo(12),
  },
  {
    id: "p-005",
    firstName: "Sofía",
    lastName: "Acosta",
    dni: "44.567.890",
    birthDate: "1995-07-08",
    sex: "F",
    phone: "+54 11 8901-4567",
    email: "sofia.acosta@email.com",
    address: "Av. Córdoba 2345, 6°B",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "Juan Acosta", relation: "Padre", phone: "+54 11 8901-4568" },
    insurance: { company: "Particular", plan: "-", memberNumber: "-" },
    primaryPathology: "Fascitis plantar",
    icd10: "M72.2",
    medicalHistory: { pathologies: [], surgeries: [], medications: [], allergies: [] },
    painScale: { eva: 4, location: "Talón derecho, primer paso matutino", since: daysAgo(60) },
    rom: [],
    strength: [],
    orthopedicTests: [{ name: "Windlass test", positive: true }],
    scales: [],
    consents: [{ id: "c5", type: "Consentimiento de tratamiento", signedAt: daysAgo(55), expiresAt: daysAhead(310), signedBy: "Sofía Acosta" }],
    attachments: [
      { id: "a6", type: "image", name: "Huella plantar - estudio.pdf", category: "Documento", uploadedAt: daysAgo(55), size: "540 KB" },
    ],
    timeline: [
      { id: "t13", date: daysAgo(55), type: "Evaluación inicial", title: "Fascitis plantar bilateral", author: "Lic. Diego Salazar" },
      { id: "t14", date: daysAgo(40), type: "Sesión", title: "Sesión #6 — Estiramiento fascia", author: "Lic. Diego Salazar" },
    ],
    audit: [{ id: "au8", timestamp: daysAgo(55), user: "Lic. Diego Salazar", action: "Creación" }],
    therapistId: "th-002",
    status: "activo",
    enrolledAt: daysAgo(55),
  },
  {
    id: "p-006",
    firstName: "Roberto",
    lastName: "Giménez",
    dni: "25.123.456",
    birthDate: "1965-02-20",
    sex: "M",
    phone: "+54 11 9012-5678",
    email: "roberto.gimenez@email.com",
    address: "Av. Belgrano 1234, 1°A",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "Ana Giménez", relation: "Esposa", phone: "+54 11 9012-5679" },
    insurance: { company: "PAMI", plan: "Afiliado", memberNumber: "15098745632" },
    primaryPathology: "Hernia discal lumbar",
    icd10: "M51.2",
    medicalHistory: {
      pathologies: ["Hipertensión", "Hipercolesterolemia"],
      surgeries: ["Colecistectomía (2015)"],
      medications: ["Enalapril 10mg", "Atorvastatina 20mg"],
      allergies: [],
    },
    painScale: { eva: 8, location: "Lumbociática derecha L5-S1", since: daysAgo(8) },
    rom: [{ joint: "Columna lumbar", movement: "Flexión", degrees: 30, normalDegrees: 60 }],
    strength: [{ muscle: "Tibial anterior", side: "der", grade: 3 }],
    orthopedicTests: [
      { name: "Lasègue", positive: true, notes: "Positivo a 20°" },
      { name: "Signo de Bragard", positive: true },
    ],
    scales: [{ name: "Oswestry", score: 38, maxScore: 50, interpretation: "Discapacidad severa", date: daysAgo(8) }],
    consents: [{ id: "c6", type: "Consentimiento informado", signedAt: daysAgo(8), expiresAt: daysAhead(357), signedBy: "Roberto Giménez" }],
    attachments: [
      { id: "a7", type: "imaging", name: "RM columna lumbosacra.pdf", category: "RM", uploadedAt: daysAgo(7), size: "4.2 MB" },
    ],
    timeline: [
      { id: "t15", date: daysAgo(8), type: "Evaluación inicial", title: "Lumbociatalgia aguda", author: "Lic. Ana Rodríguez" },
      { id: "t16", date: daysAgo(5), type: "Sesión", title: "Sesión #2 — Terapia manual", author: "Lic. Ana Rodríguez" },
    ],
    audit: [{ id: "au9", timestamp: daysAgo(8), user: "Lic. Ana Rodríguez", action: "Creación" }],
    therapistId: "th-001",
    status: "activo",
    enrolledAt: daysAgo(8),
  },
  {
    id: "p-007",
    firstName: "Valentina",
    lastName: "Castro",
    dni: "38.901.234",
    birthDate: "1998-04-25",
    sex: "F",
    phone: "+54 11 0123-6789",
    email: "valentina.castro@email.com",
    address: "Calle Paraguay 890, 4°D",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "Camila Castro", relation: "Hermana", phone: "+54 11 0123-6790" },
    insurance: { company: "OSDE", plan: "310", memberNumber: "99887766554" },
    primaryPathology: "Esguince tobillo",
    icd10: "S93.4",
    medicalHistory: { pathologies: [], surgeries: [], medications: [], allergies: [] },
    painScale: { eva: 2, location: "Tobillo izquierdo, cara externa", since: daysAgo(12) },
    rom: [{ joint: "Tobillo izquierdo", movement: "Dorsiflexión", degrees: 15, normalDegrees: 20 }],
    strength: [],
    orthopedicTests: [{ name: "Cajón anterior", positive: false }],
    scales: [],
    consents: [],
    attachments: [],
    timeline: [
      { id: "t17", date: daysAgo(12), type: "Evaluación inicial", title: "Esguince grado II tobillo izquierdo", author: "Lic. Diego Salazar" },
      { id: "t18", date: daysAgo(2), type: "Sesión", title: "Sesión #5 — Propiocepción", author: "Lic. Diego Salazar" },
    ],
    audit: [{ id: "au10", timestamp: daysAgo(12), user: "Lic. Diego Salazar", action: "Creación" }],
    therapistId: "th-002",
    status: "activo",
    enrolledAt: daysAgo(12),
  },
  {
    id: "p-008",
    firstName: "Fernando",
    lastName: "Morales",
    dni: "30.456.789",
    birthDate: "1980-12-03",
    sex: "M",
    phone: "+54 11 1234-7890",
    email: "fernando.morales@email.com",
    address: "Av. Independencia 3456, 2°B",
    city: "CABA, Buenos Aires",
    emergencyContact: { name: "Lucía Morales", relation: "Esposa", phone: "+54 11 1234-7891" },
    insurance: { company: "Swiss Medical", plan: "Classic", memberNumber: "55443322110" },
    primaryPathology: "Tendinopatía rotuliana",
    icd10: "M76.5",
    medicalHistory: { pathologies: [], surgeries: [], medications: [], allergies: [] },
    painScale: { eva: 5, location: "Rodilla izquierda, polo inferior rótula", since: daysAgo(30) },
    rom: [],
    strength: [],
    orthopedicTests: [{ name: "Royal London Hospital", positive: true }],
    scales: [],
    consents: [],
    attachments: [],
    timeline: [
      { id: "t19", date: daysAgo(30), type: "Evaluación inicial", title: "Tendinopatía rotuliana", author: "Lic. Ana Rodríguez" },
    ],
    audit: [{ id: "au11", timestamp: daysAgo(30), user: "Lic. Ana Rodríguez", action: "Creación" }],
    therapistId: "th-001",
    status: "activo",
    enrolledAt: daysAgo(30),
  },
];

// Helpers
export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date("2026-08-05");
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatDate(iso: string, opts: "short" | "long" | "datetime" = "short"): string {
  const d = new Date(iso);
  if (opts === "short") return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  if (opts === "long") return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  return d.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function evaColor(eva: number): "success" | "warning" | "danger" {
  if (eva <= 3) return "success";
  if (eva <= 6) return "warning";
  return "danger";
}