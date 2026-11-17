import { BarChart3, Building2, CheckCircle2, LayoutDashboard, MapPin, Vote } from "lucide-react";
import type { ViewId } from "../types";

const ITEMS: { id: ViewId; label: string; icon: typeof Vote }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "units", label: "Polling units", icon: MapPin },
  { id: "wards", label: "Ward reports", icon: Building2 },
  { id: "lgas", label: "LGA reports", icon: BarChart3 },
  { id: "totals", label: "Total votes", icon: Vote },
];

export default function Sidebar({ view, onChange }: { view: ViewId; onChange: (v: ViewId) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">O</div>
        <div>
          <div className="brand-name">Oriyomi</div>
          <div className="brand-sub">VICTORY DASHBOARD</div>
        </div>
      </div>
      <div className="nav-label">REPORTS</div>
      <nav>
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`nav-item ${view === id ? "active" : ""}`} onClick={() => onChange(id)} aria-current={view === id ? "page" : undefined}>
            <Icon size={18} aria-hidden="true" /> {label}
          </button>
        ))}
      </nav>
      <div className="integrity">
        <div className="integrity-title">INTEGRITY NOTE</div>
        <p>Every result is preserved with its recorded date and time.</p>
        <div className="audit"><CheckCircle2 size={13} /> Audit ready</div>
      </div>
    </aside>
  );
}
