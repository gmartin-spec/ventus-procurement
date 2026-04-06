import { useGoogleSheets } from "./hooks/useGoogleSheets";

// ─── ICONS (inline SVG components) ───────────────────────────────────────────
const Icons = {
  Package: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  FileText: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  DollarSign: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  BarChart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Eye: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Truck: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Clock: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  AlertTriangle: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Download: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  ChevronDown: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronRight: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Ship: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0021 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6"/><line x1="12" y1="1" x2="12" y2="4"/></svg>,
  Globe: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Users: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  X: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Upload: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Settings: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Anchor: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0020 0h-3"/></svg>,
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: "PV-MAL", name: "PV Malambo", country: "CO", client: "TEBSA", mwp: 66 },
  { id: "PV-IGU", name: "La Iguana", country: "GT", client: "INDE", mwp: 50 },
  { id: "PV-BUG", name: "Bugambiles", country: "GT", client: "EGEE", mwp: 30 },
  { id: "EO-NAS", name: "NASPUY H2", country: "UY", client: "NASPUY SA", mwp: 15 },
];

const SUPPLIERS = ["Longi Green Energy", "Sungrow Power", "TBEA Co.", "Nextracker", "Kuehne + Nagel", "Jinko Solar", "ABB Ltd", "Siemens Energy"];

const STATUSES = {
  draft: { label: "Borrador", color: "#64748b", bg: "#f1f5f9" },
  approved: { label: "Aprobada", color: "#0369a1", bg: "#e0f2fe" },
  ordered: { label: "Ordenada", color: "#7c3aed", bg: "#ede9fe" },
  production: { label: "En Producción", color: "#c2410c", bg: "#fff7ed" },
  shipped: { label: "Embarcada", color: "#0891b2", bg: "#ecfeff" },
  in_transit: { label: "En Tránsito", color: "#2563eb", bg: "#dbeafe" },
  customs: { label: "En Aduana", color: "#d97706", bg: "#fffbeb" },
  delivered: { label: "Entregada", color: "#059669", bg: "#ecfdf5" },
  closed: { label: "Cerrada", color: "#374151", bg: "#f3f4f6" },
};

const DOC_TYPES = ["Bill of Lading", "Packing List", "Commercial Invoice", "Certificate of Origin", "Insurance Certificate", "Inspection Report", "Customs Declaration"];

const INCOTERMS = ["FOB", "CIF", "DDP", "EXW", "CFR", "DAP"];

function generatePOs() {
  const pos = [];
  let seed = 42;
  const seededRandom = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
  const items = [
    { desc: "Módulos PV 580W", supplier: "Longi Green Energy", unit: "pcs", qty: 113793, unitPrice: 72.5, cat: "Modules" },
    { desc: "Inversores String 225kW", supplier: "Sungrow Power", unit: "pcs", qty: 42, unitPrice: 18500, cat: "Inverters" },
    { desc: "Transformador 66/34.5kV", supplier: "TBEA Co.", unit: "pcs", qty: 2, unitPrice: 285000, cat: "Transformer" },
    { desc: "Tracker 1P 2x30", supplier: "Nextracker", unit: "sets", qty: 1850, unitPrice: 3200, cat: "Trackers" },
    { desc: "Cables DC 4mm²", supplier: "ABB Ltd", unit: "m", qty: 450000, unitPrice: 0.85, cat: "BOS Eléctrico" },
    { desc: "Módulos PV 550W", supplier: "Jinko Solar", unit: "pcs", qty: 90909, unitPrice: 68.0, cat: "Modules" },
    { desc: "Inversor Central 3.15MW", supplier: "Sungrow Power", unit: "pcs", qty: 5, unitPrice: 142000, cat: "Inverters" },
    { desc: "Subestación Compacta", supplier: "Siemens Energy", unit: "pcs", qty: 1, unitPrice: 520000, cat: "Transformer" },
    { desc: "Estructura Fija", supplier: "Nextracker", unit: "sets", qty: 2200, unitPrice: 1100, cat: "Estructuras" },
    { desc: "Freight Shanghai-Buenaventura", supplier: "Kuehne + Nagel", unit: "containers", qty: 85, unitPrice: 4200, cat: "Freight" },
    { desc: "Freight Shanghai-Puerto Quetzal", supplier: "Kuehne + Nagel", unit: "containers", qty: 62, unitPrice: 4800, cat: "Freight" },
    { desc: "Electrolizador PEM 5MW", supplier: "Siemens Energy", unit: "pcs", qty: 1, unitPrice: 3200000, cat: "H2 Equipment" },
  ];

  const statusKeys = Object.keys(STATUSES);
  items.forEach((item, i) => {
    const projIdx = i < 5 ? 0 : i < 8 ? 1 : i < 9 ? 2 : i < 11 ? 3 : 3;
    const statusIdx = Math.min(Math.floor(Math.random() * statusKeys.length), statusKeys.length - 1);
    const status = statusKeys[statusIdx];
    const fob = item.qty * item.unitPrice;
    const freightPct = 0.03 + Math.random() * 0.05;
    const insPct = 0.005 + Math.random() * 0.005;
    const dutyPct = item.cat === "Freight" ? 0 : 0.02 + Math.random() * 0.08;
    const cif = fob * (1 + freightPct + insPct);
    const ddp = cif * (1 + dutyPct);
    const createdDate = new Date(2025, Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 28));
    const etd = new Date(createdDate.getTime() + (30 + Math.floor(Math.random() * 60)) * 86400000);
    const eta = new Date(etd.getTime() + (25 + Math.floor(Math.random() * 20)) * 86400000);
    const docsRequired = DOC_TYPES.slice(0, 4 + Math.floor(Math.random() * 3));
    const docsReceived = docsRequired.slice(0, Math.floor(Math.random() * (docsRequired.length + 1)));

    pos.push({
      id: `PO-${String(2025)}${String(i + 1).padStart(3, "0")}`,
      project: PROJECTS[projIdx],
      description: item.desc,
      supplier: item.supplier,
      category: item.cat,
      qty: item.qty,
      unit: item.unit,
      unitPrice: item.unitPrice,
      currency: "USD",
      incoterm: INCOTERMS[Math.floor(Math.random() * 3)],
      status,
      costs: { fob, freight: fob * freightPct, insurance: fob * insPct, cif, duties: cif * dutyPct, ddp },
      dates: { created: createdDate, etd, eta, delivered: status === "delivered" || status === "closed" ? new Date(eta.getTime() + Math.floor(Math.random() * 7) * 86400000) : null },
      docs: { required: docsRequired, received: docsReceived },
      notes: "",
      priority: Math.random() > 0.7 ? "high" : Math.random() > 0.5 ? "medium" : "low",
    });
  });
  return pos;
}

const INITIAL_POS = generatePOs();

// ─── UTILITIES ───────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtK = (n) => n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : n.toFixed(0);
const fmtDate = (d) => d ? d.toLocaleDateString("es-UY", { day: "2-digit", month: "short", year: "2-digit" }) : "—";
const pct = (a, b) => b === 0 ? 0 : Math.round((a / b) * 100);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const theme = {
  bg: "#0a0e1a",
  bgCard: "#111827",
  bgCardHover: "#1a2236",
  bgSidebar: "#0d1224",
  border: "#1e293b",
  borderLight: "#2a3a52",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  accent: "#06b6d4",
  accentDark: "#0e7490",
  accentGlow: "rgba(6, 182, 212, 0.15)",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUSES[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: s.color, background: s.bg, letterSpacing: 0.3 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const colors = { high: theme.danger, medium: theme.warning, low: theme.success };
  return <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[priority], display: "inline-block", boxShadow: `0 0 6px ${colors[priority]}44` }} title={priority} />;
}

function ProgressBar({ value, max, color = theme.accent, height = 6 }) {
  const p = pct(value, max);
  return (
    <div style={{ width: "100%", background: "#1e293b", borderRadius: height, height, overflow: "hidden" }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, borderRadius: height, transition: "width 0.6s ease" }} />
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub, color = theme.accent, trend }) {
  return (
    <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 20, height: 20, color }} />
        </div>
        {trend && <span style={{ fontSize: 12, color: trend > 0 ? theme.success : theme.danger, fontWeight: 600 }}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>{value}</div>
        <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: theme.textDim, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

function MiniBarChart({ data, color = theme.accent, height = 50 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
          <div style={{ width: "100%", background: color, borderRadius: "3px 3px 0 0", height: Math.max(4, (d.value / max) * height * 0.85), opacity: 0.7 + (i / data.length) * 0.3, transition: "height 0.4s ease" }} title={`${d.label}: ${fmt(d.value)}`} />
          <span style={{ fontSize: 9, color: theme.textDim }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DocCompletion({ docs }) {
  const total = docs.required.length;
  const recv = docs.received.length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.textMuted }}>
        <span>{recv}/{total} docs</span>
        <span>{pct(recv, total)}%</span>
      </div>
      <ProgressBar value={recv} max={total} color={recv === total ? theme.success : recv > total / 2 ? theme.warning : theme.danger} />
    </div>
  );
}

function CostBreakdown({ costs }) {
  const segments = [
    { label: "FOB", value: costs.fob, color: "#06b6d4" },
    { label: "Freight", value: costs.freight, color: "#3b82f6" },
    { label: "Insurance", value: costs.insurance, color: "#8b5cf6" },
    { label: "Duties", value: costs.duties, color: "#f59e0b" },
  ];
  const total = costs.ddp;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 10 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ width: `${pct(s.value, total)}%`, background: s.color, minWidth: s.value > 0 ? 4 : 0 }} title={`${s.label}: ${fmt(s.value)}`} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: theme.textMuted }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            {s.label}: {fmt(s.value)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Icons.BarChart },
  { id: "orders", label: "Órdenes de Compra", icon: Icons.Package },
  { id: "documents", label: "Documentos", icon: Icons.FileText },
  { id: "costs", label: "Control de Costos", icon: Icons.DollarSign },
  { id: "timeline", label: "Timeline Logístico", icon: Icons.Ship },
  { id: "kpis", label: "KPIs & Reportes", icon: Icons.Eye },
];

const ROLES = [
  { id: "procurement", label: "Compras", icon: Icons.Package },
  { id: "project", label: "Proyecto", icon: Icons.Users },
  { id: "comex", label: "Comex", icon: Icons.Globe },
];

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const sheets = useGoogleSheets(INITIAL_POS);
  const pos = sheets.data;
  const setPOs = sheets.setData;
  const syncStatus = sheets.syncStatus;
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeRole, setActiveRole] = useState("procurement");
  const [selectedPO, setSelectedPO] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewPO, setShowNewPO] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const filtered = useMemo(() => {
    return pos.filter(po => {
      if (filterProject !== "all" && po.project.id !== filterProject) return false;
      if (filterStatus !== "all" && po.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return po.id.toLowerCase().includes(q) || po.description.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q);
      }
      return true;
    });
  }, [pos, filterProject, filterStatus, searchQuery]);

const handleSync = useCallback(() => {
    sheets.sync();
  }, [sheets]);

  const handleStatusChange = useCallback((poId, newStatus) => {
    setPOs(prev => prev.map(po => po.id === poId ? { ...po, status: newStatus } : po));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, color: theme.text, fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif", fontSize: 14, overflow: "hidden" }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarCollapsed ? 64 : 240, background: theme.bgSidebar, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", transition: "width 0.3s ease", overflow: "hidden", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? "20px 12px" : "20px 22px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icons.Anchor style={{ width: 20, height: 20, color: "#fff" }} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3, background: theme.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VENTUS</div>
              <div style={{ fontSize: 10, color: theme.textDim, letterSpacing: 1.5, textTransform: "uppercase" }}>Procurement Hub</div>
            </div>
          )}
        </div>

        {/* Role Selector */}
        {!sidebarCollapsed && (
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 10, color: theme.textDim, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Vista</div>
            <div style={{ display: "flex", gap: 4, background: "#0a0e1a", borderRadius: 8, padding: 3 }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setActiveRole(r.id)} style={{ flex: 1, padding: "6px 4px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: activeRole === r.id ? theme.accent : "transparent", color: activeRole === r.id ? "#fff" : theme.textDim, transition: "all 0.2s" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveNav(item.id); setSelectedPO(null); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: sidebarCollapsed ? "10px 16px" : "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? theme.accentGlow : "transparent", color: active ? theme.accent : theme.textMuted, fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.2s", textAlign: "left", position: "relative" }}>
                {active && <div style={{ position: "absolute", left: 0, top: "25%", bottom: "25%", width: 3, borderRadius: 2, background: theme.accent }} />}
                <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                {!sidebarCollapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Sync Status */}
        <div style={{ padding: sidebarCollapsed ? "16px 12px" : "16px 18px", borderTop: `1px solid ${theme.border}` }}>
          <button onClick={handleSync} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "flex-start", gap: 8, padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: syncStatus === "syncing" ? "#0e7490" + "22" : "transparent", color: syncStatus === "syncing" ? theme.accent : theme.textDim, cursor: "pointer", fontSize: 12, transition: "all 0.3s" }}>
            <Icons.Refresh style={{ width: 14, height: 14, animation: syncStatus === "syncing" ? "spin 1s linear infinite" : "none" }} />
            {!sidebarCollapsed && (syncStatus === "syncing" ? "Sincronizando..." : "Google Sheets ✓")}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <header style={{ padding: "16px 28px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: theme.bgSidebar, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>
              {NAV_ITEMS.find(n => n.id === activeNav)?.label}
            </h1>
            <span style={{ fontSize: 11, color: theme.textDim, background: theme.bgCard, padding: "4px 10px", borderRadius: 6, border: `1px solid ${theme.border}` }}>
              {ROLES.find(r => r.id === activeRole)?.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Icons.Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: theme.textDim }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Buscar PO, proveedor..." style={{ padding: "8px 12px 8px 32px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.text, fontSize: 13, width: 220, outline: "none" }} />
            </div>
            {/* Filters */}
            <select value={filterProject} onChange={e => setFilterProject(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.text, fontSize: 12, outline: "none", cursor: "pointer" }}>
              <option value="all">Todos los proyectos</option>
              {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bgCard, color: theme.text, fontSize: 12, outline: "none", cursor: "pointer" }}>
              <option value="all">Todos los estados</option>
              {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {/* New PO */}
            <button onClick={() => setShowNewPO(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: theme.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <Icons.Plus style={{ width: 14, height: 14 }} /> Nueva OC
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
          {activeNav === "dashboard" && <DashboardView pos={pos} filtered={filtered} role={activeRole} onSelectPO={setSelectedPO} onNav={setActiveNav} />}
          {activeNav === "orders" && !selectedPO && <OrdersView pos={filtered} onSelect={setSelectedPO} onStatusChange={handleStatusChange} />}
          {activeNav === "orders" && selectedPO && <PODetail po={pos.find(p => p.id === selectedPO)} onBack={() => setSelectedPO(null)} onStatusChange={handleStatusChange} />}
          {activeNav === "documents" && <DocumentsView pos={filtered} />}
          {activeNav === "costs" && <CostsView pos={filtered} />}
          {activeNav === "timeline" && <TimelineView pos={filtered} />}
          {activeNav === "kpis" && <KPIsView pos={pos} filtered={filtered} />}
        </div>
      </main>

      {/* New PO Modal */}
      {showNewPO && <NewPOModal onClose={() => setShowNewPO(false)} onSave={(po) => { setPOs(prev => [po, ...prev]); setShowNewPO(false); }} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; scrollbar-width: thin; scrollbar-color: ${theme.borderLight} transparent; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.borderLight}; border-radius: 3px; }
        select option { background: ${theme.bgCard}; color: ${theme.text}; }
        input::placeholder { color: ${theme.textDim}; }
      `}</style>
    </div>
  );
}

// ─── DASHBOARD VIEW ──────────────────────────────────────────────────────────
function DashboardView({ pos, filtered, role, onSelectPO, onNav }) {
  const totalValue = pos.reduce((s, p) => s + p.costs.ddp, 0);
  const activeOrders = pos.filter(p => !["closed", "delivered"].includes(p.status)).length;
  const inTransit = pos.filter(p => ["shipped", "in_transit", "customs"].includes(p.status)).length;
  const docsComplete = pos.filter(p => p.docs.received.length === p.docs.required.length).length;
  const avgDocCompletion = pos.length > 0 ? Math.round(pos.reduce((s, p) => s + pct(p.docs.received.length, p.docs.required.length), 0) / pos.length) : 0;
  const overdueCount = pos.filter(p => p.dates.eta && p.dates.eta < new Date() && !["delivered", "closed"].includes(p.status)).length;

  const byProject = PROJECTS.map(proj => ({
    label: proj.id.split("-")[1],
    value: pos.filter(p => p.project.id === proj.id).reduce((s, p) => s + p.costs.ddp, 0),
  }));

  const byStatus = Object.entries(STATUSES).map(([k, v]) => ({
    status: k, label: v.label, count: pos.filter(p => p.status === k).length, color: v.color,
  })).filter(s => s.count > 0);

  const urgent = pos.filter(p => p.priority === "high" && !["delivered", "closed"].includes(p.status)).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.4s ease" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KPICard icon={Icons.DollarSign} label="Valor Total Procurement" value={`$${fmtK(totalValue)}`} sub="DDP all projects" color={theme.accent} trend={12} />
        <KPICard icon={Icons.Package} label="OC Activas" value={activeOrders} sub={`${pos.length} totales`} color={theme.purple} />
        <KPICard icon={Icons.Ship} label="En Tránsito" value={inTransit} sub="embarques en ruta" color="#3b82f6" />
        <KPICard icon={Icons.FileText} label="Docs Completos" value={`${avgDocCompletion}%`} sub={`${docsComplete}/${pos.length} OC completas`} color={overdueCount > 0 ? theme.warning : theme.success} />
        {overdueCount > 0 && <KPICard icon={Icons.AlertTriangle} label="Atrasadas" value={overdueCount} sub="requieren atención" color={theme.danger} />}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* Status Distribution */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Distribución por Estado</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {byStatus.map(s => (
              <div key={s.status} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 90, fontSize: 12, color: theme.textMuted }}>{s.label}</span>
                <div style={{ flex: 1, background: "#1e293b", borderRadius: 4, height: 22, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${pct(s.count, pos.length)}%`, height: "100%", background: s.color, borderRadius: 4, transition: "width 0.5s ease", minWidth: s.count > 0 ? 24 : 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Project Chart */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Valor por Proyecto (DDP)</h3>
          <MiniBarChart data={byProject} height={100} />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {PROJECTS.map((p, i) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: theme.textMuted }}>
                <span>{p.name}</span>
                <span style={{ fontFamily: "JetBrains Mono", color: theme.text }}>{fmt(byProject[i].value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent / Attention */}
      {urgent.length > 0 && (
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.danger}33`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: theme.danger, display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.AlertTriangle style={{ width: 16, height: 16 }} /> Requiere Atención
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {urgent.map(po => (
              <div key={po.id} onClick={() => { onSelectPO(po.id); onNav("orders"); }} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 14px", borderRadius: 8, background: "#1a0a0a", cursor: "pointer", transition: "background 0.2s" }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: theme.accent, fontWeight: 600 }}>{po.id}</span>
                <span style={{ flex: 1, fontSize: 13, color: theme.text }}>{po.description}</span>
                <span style={{ fontSize: 11, color: theme.textDim }}>{po.project.name}</span>
                <StatusBadge status={po.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ORDERS VIEW ─────────────────────────────────────────────────────────────
function OrdersView({ pos, onSelect, onStatusChange }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["", "OC", "Descripción", "Proveedor", "Proyecto", "Estado", "FOB", "DDP", "ETA", "Docs"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pos.map((po, idx) => (
              <tr key={po.id} onClick={() => onSelect(po.id)} style={{ borderBottom: `1px solid ${theme.border}`, cursor: "pointer", transition: "background 0.15s", animation: `fadeIn 0.3s ease ${idx * 0.03}s both` }}
                onMouseEnter={e => e.currentTarget.style.background = theme.bgCardHover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 6px 12px 14px", width: 20 }}><PriorityDot priority={po.priority} /></td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600, color: theme.accent }}>{po.id}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{po.description}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: theme.textMuted }}>{po.supplier}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "#1e293b", color: theme.textMuted }}>{po.project.name}</span>
                </td>
                <td style={{ padding: "12px 14px" }}><StatusBadge status={po.status} /></td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12 }}>{fmt(po.costs.fob)}</td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600 }}>{fmt(po.costs.ddp)}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: theme.textMuted }}>{fmtDate(po.dates.eta)}</td>
                <td style={{ padding: "12px 14px", width: 120 }}><DocCompletion docs={po.docs} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {pos.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: theme.textDim }}>No se encontraron órdenes con los filtros aplicados</div>
        )}
      </div>
    </div>
  );
}

// ─── PO DETAIL ───────────────────────────────────────────────────────────────
function PODetail({ po, onBack, onStatusChange }) {
  if (!po) return null;
  const statusKeys = Object.keys(STATUSES);
  const currentIdx = statusKeys.indexOf(po.status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "slideIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer", fontSize: 12 }}>← Volver</button>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "JetBrains Mono", color: theme.accent }}>{po.id}</h2>
        <StatusBadge status={po.status} />
        <PriorityDot priority={po.priority} />
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {currentIdx < statusKeys.length - 1 && (
            <button onClick={() => onStatusChange(po.id, statusKeys[currentIdx + 1])} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: theme.accent, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
              Avanzar → {STATUSES[statusKeys[currentIdx + 1]].label}
            </button>
          )}
        </div>
      </div>

      {/* Status Pipeline */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {statusKeys.map((sk, i) => {
            const passed = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={sk} style={{ display: "flex", alignItems: "center", flex: i < statusKeys.length - 1 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: passed ? theme.accent : "#1e293b", border: isCurrent ? `2px solid ${theme.accent}` : "2px solid transparent", boxShadow: isCurrent ? `0 0 12px ${theme.accent}44` : "none", transition: "all 0.3s" }}>
                    {passed && <Icons.Check style={{ width: 14, height: 14, color: "#fff" }} />}
                  </div>
                  <span style={{ fontSize: 9, color: passed ? theme.accent : theme.textDim, fontWeight: isCurrent ? 700 : 400, whiteSpace: "nowrap" }}>{STATUSES[sk].label}</span>
                </div>
                {i < statusKeys.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < currentIdx ? theme.accent : "#1e293b", margin: "0 4px", marginBottom: 18, transition: "background 0.3s" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Info */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Información General</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Descripción", po.description],
              ["Proveedor", po.supplier],
              ["Proyecto", `${po.project.name} (${po.project.country})`],
              ["Cliente", po.project.client],
              ["Cantidad", `${po.qty.toLocaleString()} ${po.unit}`],
              ["Precio Unit.", fmt(po.unitPrice)],
              ["Incoterm", po.incoterm],
              ["Categoría", po.category],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 12, color: theme.textDim }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Fechas Clave</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Creación OC", date: po.dates.created, icon: Icons.FileText },
              { label: "ETD (Despacho)", date: po.dates.etd, icon: Icons.Truck },
              { label: "ETA (Llegada)", date: po.dates.eta, icon: Icons.Ship },
              { label: "Entrega Real", date: po.dates.delivered, icon: Icons.Check },
            ].map(d => (
              <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <d.icon style={{ width: 16, height: 16, color: d.date ? theme.accent : theme.textDim }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: theme.textDim }}>{d.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "JetBrains Mono" }}>{fmtDate(d.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Costs */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Desglose de Costos (FOB → CIF → DDP)</h3>
        <CostBreakdown costs={po.costs} />
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "FOB", value: po.costs.fob, color: "#06b6d4" },
            { label: "CIF", value: po.costs.cif, color: "#3b82f6" },
            { label: "DDP", value: po.costs.ddp, color: "#8b5cf6" },
          ].map(c => (
            <div key={c.label} style={{ textAlign: "center", padding: 16, background: `${c.color}11`, borderRadius: 10, border: `1px solid ${c.color}33` }}>
              <div style={{ fontSize: 11, color: theme.textDim, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "JetBrains Mono", color: c.color }}>{fmt(c.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Documentos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {po.docs.required.map(doc => {
            const received = po.docs.received.includes(doc);
            return (
              <div key={doc} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: received ? `${theme.success}11` : `${theme.danger}08`, border: `1px solid ${received ? theme.success : theme.danger}33` }}>
                {received ? <Icons.Check style={{ width: 14, height: 14, color: theme.success }} /> : <Icons.Clock style={{ width: 14, height: 14, color: theme.danger }} />}
                <span style={{ fontSize: 12, color: received ? theme.success : theme.textMuted }}>{doc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── DOCUMENTS VIEW ──────────────────────────────────────────────────────────
function DocumentsView({ pos }) {
  const allDocs = pos.flatMap(po =>
    po.docs.required.map(doc => ({
      poId: po.id,
      project: po.project.name,
      supplier: po.supplier,
      docType: doc,
      received: po.docs.received.includes(doc),
      status: po.status,
    }))
  );
  const pending = allDocs.filter(d => !d.received);
  const complete = allDocs.filter(d => d.received);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.4s ease" }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KPICard icon={Icons.FileText} label="Total Documentos" value={allDocs.length} color={theme.accent} />
        <KPICard icon={Icons.Check} label="Recibidos" value={complete.length} sub={`${pct(complete.length, allDocs.length)}%`} color={theme.success} />
        <KPICard icon={Icons.Clock} label="Pendientes" value={pending.length} color={theme.warning} />
        <KPICard icon={Icons.AlertTriangle} label="Críticos" value={pending.filter(d => ["shipped", "in_transit", "customs"].includes(d.status)).length} sub="embarques sin docs" color={theme.danger} />
      </div>

      {/* Pending Documents */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Documentos Pendientes</h3>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer", fontSize: 12 }}>
            <Icons.Upload style={{ width: 14, height: 14 }} /> Subir Documento
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["OC", "Proyecto", "Proveedor", "Documento", "Estado OC", "Acción"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textDim, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pending.slice(0, 20).map((d, i) => (
              <tr key={`${d.poId}-${d.docType}`} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "10px 14px", fontFamily: "JetBrains Mono", fontSize: 12, color: theme.accent }}>{d.poId}</td>
                <td style={{ padding: "10px 14px", fontSize: 12 }}>{d.project}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, color: theme.textMuted }}>{d.supplier}</td>
                <td style={{ padding: "10px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icons.FileText style={{ width: 14, height: 14, color: theme.warning }} />
                  {d.docType}
                </td>
                <td style={{ padding: "10px 14px" }}><StatusBadge status={d.status} /></td>
                <td style={{ padding: "10px 14px" }}>
                  <button style={{ padding: "4px 12px", borderRadius: 6, border: `1px solid ${theme.accent}`, background: "transparent", color: theme.accent, cursor: "pointer", fontSize: 11 }}>Marcar Recibido</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doc Completion by PO */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Completitud Documental por OC</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {pos.map(po => (
            <div key={po.id} style={{ padding: "12px 16px", borderRadius: 10, background: "#0a0e1a", border: `1px solid ${theme.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: theme.accent, fontWeight: 600 }}>{po.id}</span>
                <span style={{ fontSize: 11, color: theme.textDim }}>{po.supplier}</span>
              </div>
              <DocCompletion docs={po.docs} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COSTS VIEW ──────────────────────────────────────────────────────────────
function CostsView({ pos }) {
  const totalFOB = pos.reduce((s, p) => s + p.costs.fob, 0);
  const totalCIF = pos.reduce((s, p) => s + p.costs.cif, 0);
  const totalDDP = pos.reduce((s, p) => s + p.costs.ddp, 0);
  const totalFreight = pos.reduce((s, p) => s + p.costs.freight, 0);
  const totalDuties = pos.reduce((s, p) => s + p.costs.duties, 0);

  const byCategory = {};
  pos.forEach(po => {
    if (!byCategory[po.category]) byCategory[po.category] = { fob: 0, cif: 0, ddp: 0, count: 0 };
    byCategory[po.category].fob += po.costs.fob;
    byCategory[po.category].cif += po.costs.cif;
    byCategory[po.category].ddp += po.costs.ddp;
    byCategory[po.category].count += 1;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.4s ease" }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        <KPICard icon={Icons.Package} label="Total FOB" value={`$${fmtK(totalFOB)}`} color="#06b6d4" />
        <KPICard icon={Icons.Truck} label="Freight Total" value={`$${fmtK(totalFreight)}`} sub={`${pct(totalFreight, totalFOB)}% del FOB`} color="#3b82f6" />
        <KPICard icon={Icons.Ship} label="Total CIF" value={`$${fmtK(totalCIF)}`} color="#8b5cf6" />
        <KPICard icon={Icons.Globe} label="Aranceles" value={`$${fmtK(totalDuties)}`} sub={`${pct(totalDuties, totalCIF)}% del CIF`} color="#f59e0b" />
        <KPICard icon={Icons.DollarSign} label="Total DDP" value={`$${fmtK(totalDDP)}`} sub="costo total landed" color={theme.success} />
      </div>

      {/* Cost Waterfall */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Cascada de Costos: FOB → CIF → DDP</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 200 }}>
          {[
            { label: "FOB", value: totalFOB, color: "#06b6d4" },
            { label: "+ Freight", value: totalFreight, color: "#3b82f6", isAdd: true },
            { label: "+ Insurance", value: pos.reduce((s, p) => s + p.costs.insurance, 0), color: "#8b5cf6", isAdd: true },
            { label: "= CIF", value: totalCIF, color: "#a78bfa" },
            { label: "+ Duties", value: totalDuties, color: "#f59e0b", isAdd: true },
            { label: "= DDP", value: totalDDP, color: "#10b981" },
          ].map((b, i) => {
            const maxVal = totalDDP;
            const h = (b.value / maxVal) * 160;
            return (
              <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono", color: b.color }}>${fmtK(b.value)}</span>
                <div style={{ width: "100%", height: Math.max(h, 10), background: b.isAdd ? `${b.color}44` : b.color, borderRadius: "6px 6px 0 0", border: b.isAdd ? `2px dashed ${b.color}` : "none", transition: "height 0.5s ease" }} />
                <span style={{ fontSize: 11, color: theme.textMuted, textAlign: "center" }}>{b.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Category Table */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${theme.border}` }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Costos por Categoría</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["Categoría", "#OC", "FOB", "CIF", "DDP", "% Total", "Margen FOB→DDP"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(byCategory).sort((a, b) => b[1].ddp - a[1].ddp).map(([cat, data]) => (
              <tr key={cat} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: 13 }}>{cat}</td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12, color: theme.textMuted }}>{data.count}</td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12 }}>{fmt(data.fob)}</td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12 }}>{fmt(data.cif)}</td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600 }}>{fmt(data.ddp)}</td>
                <td style={{ padding: "12px 14px", width: 100 }}>
                  <ProgressBar value={data.ddp} max={totalDDP} />
                  <span style={{ fontSize: 10, color: theme.textDim }}>{pct(data.ddp, totalDDP)}%</span>
                </td>
                <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12, color: theme.warning }}>+{pct(data.ddp - data.fob, data.fob)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TIMELINE VIEW ───────────────────────────────────────────────────────────
function TimelineView({ pos }) {
  const activePOs = pos.filter(p => !["draft", "closed"].includes(p.status));
  const today = new Date();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.4s ease" }}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Timeline de Embarques</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {activePOs.map(po => {
            const start = po.dates.created;
            const end = po.dates.eta || new Date(start.getTime() + 120 * 86400000);
            const totalDays = Math.max(1, (end - start) / 86400000);
            const elapsed = Math.max(0, (today - start) / 86400000);
            const progress = Math.min(100, (elapsed / totalDays) * 100);
            const isLate = today > end && !["delivered", "closed"].includes(po.status);

            return (
              <div key={po.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 10, background: "#0a0e1a", border: `1px solid ${isLate ? theme.danger + "44" : theme.border}` }}>
                <div style={{ width: 120, flexShrink: 0 }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600, color: theme.accent }}>{po.id}</div>
                  <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>{po.supplier}</div>
                </div>
                <div style={{ width: 80, flexShrink: 0 }}>
                  <StatusBadge status={po.status} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10, color: theme.textDim }}>
                    <span>ETD: {fmtDate(po.dates.etd)}</span>
                    <span>ETA: {fmtDate(po.dates.eta)}</span>
                  </div>
                  <div style={{ width: "100%", background: "#1e293b", borderRadius: 6, height: 10, overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: isLate ? theme.danger : progress > 80 ? theme.success : theme.accent, borderRadius: 6, transition: "width 0.5s ease" }} />
                    {/* Today marker */}
                    <div style={{ position: "absolute", left: `${progress}%`, top: -2, width: 2, height: 14, background: "#fff", borderRadius: 1 }} />
                  </div>
                </div>
                <div style={{ width: 80, textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: isLate ? theme.danger : theme.textMuted }}>
                    {isLate ? `+${Math.ceil((today - end) / 86400000)}d` : `${Math.max(0, Math.ceil((end - today) / 86400000))}d`}
                  </div>
                  <div style={{ fontSize: 10, color: theme.textDim }}>{isLate ? "atrasada" : "restantes"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Arrivals */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Próximas Llegadas (30 días)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {activePOs
            .filter(po => po.dates.eta && po.dates.eta > today && po.dates.eta < new Date(today.getTime() + 30 * 86400000))
            .sort((a, b) => a.dates.eta - b.dates.eta)
            .map(po => (
              <div key={po.id} style={{ padding: "14px 16px", borderRadius: 10, background: "#0a0e1a", border: `1px solid ${theme.accent}22` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: theme.accent, fontWeight: 600 }}>{po.id}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.success }}>{fmtDate(po.dates.eta)}</span>
                </div>
                <div style={{ fontSize: 13, marginBottom: 4 }}>{po.description}</div>
                <div style={{ fontSize: 11, color: theme.textDim }}>{po.project.name} — {po.supplier}</div>
                <div style={{ marginTop: 8 }}><DocCompletion docs={po.docs} /></div>
              </div>
            ))}
          {activePOs.filter(po => po.dates.eta && po.dates.eta > today && po.dates.eta < new Date(today.getTime() + 30 * 86400000)).length === 0 && (
            <div style={{ padding: 20, color: theme.textDim, fontSize: 13 }}>No hay llegadas programadas en los próximos 30 días</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── KPIs VIEW ───────────────────────────────────────────────────────────────
function KPIsView({ pos, filtered }) {
  const totalDDP = pos.reduce((s, p) => s + p.costs.ddp, 0);
  const totalFOB = pos.reduce((s, p) => s + p.costs.fob, 0);
  const avgLeadTime = pos.filter(p => p.dates.eta && p.dates.created).reduce((s, p) => s + (p.dates.eta - p.dates.created) / 86400000, 0) / (pos.length || 1);
  const onTimeDelivery = pos.filter(p => p.dates.delivered && p.dates.eta && p.dates.delivered <= new Date(p.dates.eta.getTime() + 3 * 86400000)).length;
  const deliveredCount = pos.filter(p => p.dates.delivered).length;
  const docCompletionRate = pos.length > 0 ? pos.reduce((s, p) => s + pct(p.docs.received.length, p.docs.required.length), 0) / pos.length : 0;
  const costOverhead = pct(totalDDP - totalFOB, totalFOB);

  const bySupplier = {};
  pos.forEach(po => {
    if (!bySupplier[po.supplier]) bySupplier[po.supplier] = { total: 0, count: 0, docsComplete: 0, docsTotal: 0 };
    bySupplier[po.supplier].total += po.costs.ddp;
    bySupplier[po.supplier].count += 1;
    bySupplier[po.supplier].docsComplete += po.docs.received.length;
    bySupplier[po.supplier].docsTotal += po.docs.required.length;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.4s ease" }}>
      {/* Main KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <KPICard icon={Icons.Clock} label="Lead Time Promedio" value={`${Math.round(avgLeadTime)}d`} sub="creación → llegada" color={theme.accent} />
        <KPICard icon={Icons.Check} label="On-Time Delivery" value={`${deliveredCount > 0 ? pct(onTimeDelivery, deliveredCount) : 0}%`} sub={`${onTimeDelivery}/${deliveredCount} entregas`} color={theme.success} trend={5} />
        <KPICard icon={Icons.FileText} label="Completitud Docs" value={`${Math.round(docCompletionRate)}%`} color={docCompletionRate > 80 ? theme.success : theme.warning} />
        <KPICard icon={Icons.DollarSign} label="Overhead FOB→DDP" value={`+${costOverhead}%`} sub="costos logísticos + aranceles" color={theme.purple} />
      </div>

      {/* Supplier Performance */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Performance por Proveedor</h3>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer", fontSize: 12 }}>
            <Icons.Download style={{ width: 14, height: 14 }} /> Exportar
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
              {["Proveedor", "#OC", "Valor Total (DDP)", "% Cartera", "Docs Completos", "Rating"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: theme.textDim, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(bySupplier).sort((a, b) => b[1].total - a[1].total).map(([supplier, data]) => {
              const docPct = pct(data.docsComplete, data.docsTotal);
              return (
                <tr key={supplier} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: 13 }}>{supplier}</td>
                  <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12 }}>{data.count}</td>
                  <td style={{ padding: "12px 14px", fontFamily: "JetBrains Mono", fontSize: 12, fontWeight: 600 }}>{fmt(data.total)}</td>
                  <td style={{ padding: "12px 14px", width: 100 }}>
                    <ProgressBar value={data.total} max={totalDDP} />
                    <span style={{ fontSize: 10, color: theme.textDim }}>{pct(data.total, totalDDP)}%</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: docPct > 80 ? theme.success : docPct > 50 ? theme.warning : theme.danger }}>{docPct}%</span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} style={{ width: 12, height: 12, borderRadius: 2, background: s <= Math.ceil(docPct / 20) ? theme.accent : "#1e293b" }} />
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Project Summary */}
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>Resumen por Proyecto</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {PROJECTS.map(proj => {
            const projPOs = pos.filter(p => p.project.id === proj.id);
            const projDDP = projPOs.reduce((s, p) => s + p.costs.ddp, 0);
            const projActive = projPOs.filter(p => !["delivered", "closed"].includes(p.status)).length;
            const projDocPct = projPOs.length > 0 ? Math.round(projPOs.reduce((s, p) => s + pct(p.docs.received.length, p.docs.required.length), 0) / projPOs.length) : 0;
            return (
              <div key={proj.id} style={{ padding: "18px 20px", borderRadius: 12, background: "#0a0e1a", border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{proj.name}</div>
                    <div style={{ fontSize: 11, color: theme.textDim }}>{proj.client} — {proj.country} — {proj.mwp} MWp</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: theme.accentGlow, color: theme.accent, fontWeight: 600 }}>{proj.country}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: theme.textDim }}>Valor DDP</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono", color: theme.accent }}>${fmtK(projDDP)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: theme.textDim }}>OC Activas</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono" }}>{projActive}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: theme.textDim }}>Docs</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono", color: projDocPct > 80 ? theme.success : theme.warning }}>{projDocPct}%</div>
                  </div>
                </div>
                <ProgressBar value={projDocPct} max={100} color={projDocPct > 80 ? theme.success : theme.warning} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── NEW PO MODAL ────────────────────────────────────────────────────────────
function NewPOModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    description: "", supplier: SUPPLIERS[0], project: PROJECTS[0].id, category: "Modules",
    qty: 1, unit: "pcs", unitPrice: 0, incoterm: "FOB", priority: "medium",
  });

  const handleSave = () => {
    const fob = form.qty * form.unitPrice;
    const newPO = {
      id: `PO-${Date.now().toString().slice(-6)}`,
      project: PROJECTS.find(p => p.id === form.project),
      description: form.description,
      supplier: form.supplier,
      category: form.category,
      qty: Number(form.qty),
      unit: form.unit,
      unitPrice: Number(form.unitPrice),
      currency: "USD",
      incoterm: form.incoterm,
      status: "draft",
      costs: { fob, freight: 0, insurance: 0, cif: fob, duties: 0, ddp: fob },
      dates: { created: new Date(), etd: null, eta: null, delivered: null },
      docs: { required: DOC_TYPES.slice(0, 4), received: [] },
      notes: "",
      priority: form.priority,
    };
    onSave(newPO);
  };

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "#0a0e1a", color: theme.text, fontSize: 13, outline: "none" };
  const labelStyle = { fontSize: 12, color: theme.textDim, marginBottom: 4, display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 28, width: 520, maxHeight: "80vh", overflow: "auto", animation: "fadeIn 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Nueva Orden de Compra</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textDim }}><Icons.X style={{ width: 20, height: 20 }} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Descripción</label>
            <input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ej: Módulos PV 580W" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Proveedor</label>
              <select style={inputStyle} value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}>
                {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Proyecto</label>
              <select style={inputStyle} value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
                {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Cantidad</label>
              <input style={inputStyle} type="number" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Unidad</label>
              <input style={inputStyle} value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Precio Unit. (USD)</label>
              <input style={inputStyle} type="number" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Incoterm</label>
              <select style={inputStyle} value={form.incoterm} onChange={e => setForm({ ...form, incoterm: e.target.value })}>
                {INCOTERMS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Categoría</label>
              <input style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Prioridad</label>
              <select style={inputStyle} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.textMuted, cursor: "pointer", fontSize: 13 }}>Cancelar</button>
          <button onClick={handleSave} disabled={!form.description} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: form.description ? theme.accent : theme.textDim, color: "#fff", cursor: form.description ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 600 }}>Crear OC</button>
        </div>
      </div>
    </div>
  );
}
