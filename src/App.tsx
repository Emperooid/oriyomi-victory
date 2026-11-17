import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import RecordPanel from "./components/RecordPanel";
import Sidebar from "./components/Sidebar";
import { ELECTIONS } from "./data/oyo";
import Overview from "./views/Overview";
import Reports from "./views/Reports";
import type { NewResult, ResultEntry, ViewId } from "./types";

const TITLES: Record<ViewId, string> = {
  overview: "Election results",
  units: "Polling units",
  wards: "Ward reports",
  lgas: "LGA reports",
  totals: "Total votes",
};

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [election, setElection] = useState("all");
  const [all, setAll] = useState<ResultEntry[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => { api.list().then(setAll); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanelOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = useMemo(
    () => (election === "all" ? all : all.filter((r) => r.electionId === election)),
    [all, election],
  );

  const resetDemo = useCallback(async () => setAll(await api.resetDemo()), []);

  const submit = useCallback(async (input: NewResult) => {
    const row = await api.submit(input);
    setAll((prev) => [row, ...prev]);
    // make sure the new row is visible under the current filter
    setElection((cur) => (cur !== "all" && cur !== row.electionId ? row.electionId : cur));  }, []);

  return (
    <div className="app">
      <Sidebar view={view} onChange={setView} />
      <div className="main-col">
        <header className="topbar">
          <div>
            <strong>Oyo State Election Operations</strong>
            <div className="muted tiny">Live result collection dashboard</div>
          </div>
          <div className="top-actions">
            <span className="live"><i /> System live</span>
            <button
              className="record-btn"
              onClick={() => {
                setPanelOpen(true);
                setTimeout(() => document.getElementById("rec-election")?.focus(), 50);
              }}
            >
              <Plus size={16} /> Record results
            </button>
          </div>
        </header>
        <main className="content">
          <div className="title-row">
            <div>
              <div className="eyebrow">LIVE OVERVIEW</div>
              <h1>{TITLES[view]}</h1>
              <p className="muted">Monitor submitted polling units and compare totals across every reporting level.</p>
            </div>
            <div className="filter">
              <label>ELECTION FILTER</label>
              <select value={election} onChange={(e) => setElection(e.target.value)}>
                <option value="all">All elections</option>
                {ELECTIONS.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>
          {view === "overview" && <Overview rows={rows} onReset={resetDemo} />}
          {view === "units" && <Overview rows={rows} limit={Infinity} onReset={resetDemo} />}
          {(view === "wards" || view === "lgas" || view === "totals") && <Reports view={view} rows={rows} />}
        </main>
      </div>
      {panelOpen && <div className="backdrop" onClick={() => setPanelOpen(false)} />}
      <RecordPanel defaultElection={election} open={panelOpen} onClose={() => setPanelOpen(false)} onSubmit={submit} />
    </div>
  );
}
