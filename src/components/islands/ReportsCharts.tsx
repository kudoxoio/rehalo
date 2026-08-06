/**
 * ReportsCharts.tsx
 *
 * Island de React con todos los gráficos de la vista Reportes.
 * Usa Recharts. Se monta como `client:load` desde /dashboard/reports.astro.
 */
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getPathologyDistribution,
  getGenderDistribution,
  getEvaByPatient,
  getSessionsByTherapist,
  getEvaTrend,
  getConsentStatus,
  getOccupancyLast7Days,
  getTopPatientsBySessions,
  getClinicalAlerts,
  type ClinicalAlert,
} from "@lib/mock/reports";

const PIE_COLORS = ["#84cc16", "#06b6d4", "#f59e0b", "#a855f7", "#ec4899", "#10b981", "#f97316"];

function fmtPercent(v: number) {
  return `${v}%`;
}

interface EvaPoint {
  name: string;
  fullName?: string;
  eva: number;
  pathology: string;
}

function EvaTooltip({ active, payload }: { active?: boolean; payload?: { payload: EvaPoint }[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{d.fullName ?? d.name}</p>
      <p className="text-muted-foreground">{d.pathology}</p>
      <p className="mt-1">
        EVA: <span className="font-bold">{d.eva}/10</span>
      </p>
    </div>
  );
}

function PathologyTooltip({ active, payload }: { active?: boolean; payload?: { payload: { name: string; count: number; pct: number } }[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold">{d.name}</p>
      <p className="text-muted-foreground">
        {d.count} pacientes · {d.pct}%
      </p>
    </div>
  );
}

function StandardTooltip({ active, payload, label, suffix = "" }: { active?: boolean; payload?: { value: number; name?: string; color?: string }[]; label?: string; suffix?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name ? `${p.name}: ` : ""}
          <span className="font-bold">
            {p.value}
            {suffix}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function ReportsCharts() {
  const pathologyDist = getPathologyDistribution();
  const genderDist = getGenderDistribution();
  const evaByPatient = getEvaByPatient();
  const sessionsByTherapist = getSessionsByTherapist();
  const evaTrend = getEvaTrend();
  const consentStatus = getConsentStatus();
  const occupancy7d = getOccupancyLast7Days();
  const topBySessions = getTopPatientsBySessions().slice(0, 6);
  const alerts = getClinicalAlerts();

  return (
    <div className="space-y-6">
      {/* ─── Tendencia EVA (line chart grande) ─────────────── */}
      <section className="surface-card p-6">
        <header className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold">Evolución del dolor (EVA promedio)</h2>
            <p className="text-xs text-muted-foreground">
              Últimas 8 semanas · todos los pacientes activos
            </p>
          </div>
          <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
            ↓ Mejora sostenida
          </span>
        </header>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evaTrend}>
              <defs>
                <linearGradient id="evaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#84cc16" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis
                domain={[0, 10]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                label={{
                  value: "EVA",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                }}
              />
              <Tooltip content={<StandardTooltip suffix="/10" />} />
              <Area
                type="monotone"
                dataKey="promedio"
                name="EVA promedio"
                stroke="#84cc16"
                strokeWidth={2.5}
                fill="url(#evaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ─── Distribución por patología ─────────────────────── */}
        <section className="surface-card p-6">
          <header className="mb-4">
            <h2 className="text-lg font-semibold">Distribución por patología</h2>
            <p className="text-xs text-muted-foreground">Motivos de consulta activos</p>
          </header>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pathologyDist}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {pathologyDist.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PathologyTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ─── Ocupación 7 días ───────────────────────────────── */}
        <section className="surface-card p-6">
          <header className="mb-4">
            <h2 className="text-lg font-semibold">Ocupación últimos 7 días</h2>
            <p className="text-xs text-muted-foreground">Cupos usados vs disponibles</p>
          </header>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancy7d}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip content={<StandardTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="ocupados" name="Ocupados" stackId="a" fill="#84cc16" radius={[0, 0, 0, 0]} />
                <Bar dataKey="libres" name="Libres" stackId="a" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ─── EVA por paciente ─────────────────────────────── */}
      <section className="surface-card p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold">Dolor por paciente (EVA)</h2>
          <p className="text-xs text-muted-foreground">
            Ordenado de mayor a menor · pacientes con EVA ≥7 requieren atención prioritaria
          </p>
        </header>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evaByPatient} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                domain={[0, 10]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                width={80}
              />
              <Tooltip content={<EvaTooltip />} />
              <Bar dataKey="eva" name="EVA" radius={[0, 6, 6, 0]}>
                {evaByPatient.map((p, i) => (
                  <Cell
                    key={i}
                    fill={p.eva >= 7 ? "#ef4444" : p.eva >= 5 ? "#f59e0b" : "#84cc16"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ─── Sesiones por terapeuta ───────────────────────── */}
        <section className="surface-card p-6">
          <header className="mb-4">
            <h2 className="text-base font-semibold">Sesiones por terapeuta</h2>
            <p className="text-xs text-muted-foreground">Incluye no-shows</p>
          </header>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionsByTherapist} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  width={60}
                />
                <Tooltip content={<StandardTooltip />} />
                <Bar dataKey="sesiones" name="Sesiones" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                <Bar dataKey="noShows" name="No-shows" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ─── Distribución por género ──────────────────────── */}
        <section className="surface-card p-6">
          <header className="mb-4">
            <h2 className="text-base font-semibold">Distribución por género</h2>
            <p className="text-xs text-muted-foreground">Pacientes activos</p>
          </header>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDist}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  <Cell fill="#a855f7" />
                  <Cell fill="#06b6d4" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip content={<StandardTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ─── Consentimientos ───────────────────────────────── */}
        <section className="surface-card p-6">
          <header className="mb-4">
            <h2 className="text-base font-semibold">Consentimientos firmados</h2>
            <p className="text-xs text-muted-foreground">Cumplimiento normativo</p>
          </header>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={consentStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as { name: string; value: number; pct: number };
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                        <p className="font-semibold">{d.name}</p>
                        <p className="text-muted-foreground">
                          {d.value} pacientes · {d.pct}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ─── Top pacientes por sesiones ───────────────────── */}
      <section className="surface-card p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold">Top adherencia al plan</h2>
          <p className="text-xs text-muted-foreground">
            Pacientes con más sesiones completadas
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium">Paciente</th>
                <th className="py-2 text-left font-medium">CIE-10</th>
                <th className="py-2 text-right font-medium">Sesiones</th>
                <th className="py-2 text-left font-medium pl-4">Progreso</th>
              </tr>
            </thead>
            <tbody>
              {topBySessions.map((p) => {
                const max = Math.max(...topBySessions.map((x) => x.sesiones));
                const pct = Math.round((p.sesiones / max) * 100);
                return (
                  <tr key={p.name} className="border-b border-border/40">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {p.icd10}
                    </td>
                    <td className="py-3 text-right font-bold">{p.sesiones}</td>
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{fmtPercent(pct)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Alertas clínicas ─────────────────────────────── */}
      <section className="surface-card p-6">
        <header className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-semibold">Alertas clínicas</h2>
          <span className="rounded-full bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
            {alerts.length}
          </span>
        </header>
        <p className="mb-3 text-xs text-muted-foreground">
          Pacientes que requieren atención prioritaria (dolor severo, consentimientos faltantes
          o inasistencia prolongada).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {alerts.map((a) => (
            <AlertCard key={a.patient.id} alert={a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function AlertCard({ alert }: { alert: ClinicalAlert }) {
  const severityStyles: Record<ClinicalAlert["severity"], string> = {
    alta: "border-destructive/40 bg-destructive/5",
    media: "border-warning/40 bg-warning/5",
    baja: "border-info/40 bg-info/5",
  };
  const severityLabel: Record<ClinicalAlert["severity"], string> = {
    alta: "Alta",
    media: "Media",
    baja: "Baja",
  };
  return (
    <a
      href={`/dashboard/patients/${alert.patient.id}`}
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent ${severityStyles[alert.severity]}`}
    >
      <div className="avatar-fallback flex size-10 shrink-0 items-center justify-center text-sm">
        {alert.patient.firstName[0]}
        {alert.patient.lastName[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">
            {alert.patient.firstName} {alert.patient.lastName}
          </p>
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-medium">
            {severityLabel[alert.severity]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{alert.patient.primaryPathology}</p>
        <p className="mt-1 text-xs">{alert.reason}</p>
      </div>
    </a>
  );
}
