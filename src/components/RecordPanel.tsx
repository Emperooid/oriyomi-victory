import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { emptyVotes } from "../api";
import { ELECTIONS, LGAS, PARTIES, unitsFor, wardsFor } from "../data/oyo";
import type { NewResult, PartyId } from "../types";

interface Props {
  defaultElection: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (r: NewResult) => Promise<void>;
}

export default function RecordPanel({ defaultElection, open, onClose, onSubmit }: Props) {
  const [election, setElection] = useState(defaultElection === "all" ? ELECTIONS[0].id : defaultElection);
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [unit, setUnit] = useState("");
  const [votes, setVotes] = useState(emptyVotes());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const missing = [!lga && "local government", !ward && "ward", !unit && "polling unit"].filter(Boolean) as string[];
  const ready = missing.length === 0 && !busy;

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      await onSubmit({ electionId: election, lga, ward, pollingUnit: unit, votes });
    } catch {
      setError("Could not save this result. Please try again.");
      setBusy(false);
      return;
    }
    setVotes(emptyVotes());
    setUnit("");
    setBusy(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <aside className={`record ${open ? "open" : ""}`} id="record-panel">
      <button className="close" onClick={onClose} aria-label="Close"><X size={18} /></button>
      <div className="eyebrow">POLLING OFFICER</div>
      <h2>Record results</h2>
      <p className="muted small">Enter the official count exactly as signed at the polling unit.</p>

      <label>ELECTION</label>
      <select id="rec-election" value={election} onChange={(e) => setElection(e.target.value)}>
        {ELECTIONS.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>

      <label>LOCAL GOVERNMENT</label>
      <select value={lga} onChange={(e) => { setLga(e.target.value); setWard(""); setUnit(""); }}>
        <option value="">Select local government</option>
        {LGAS.map((l) => <option key={l}>{l}</option>)}
      </select>

      <label>WARD</label>
      <select value={ward} disabled={!lga} onChange={(e) => { setWard(e.target.value); setUnit(""); }}>
        <option value="">Select ward</option>
        {wardsFor(lga).map((w) => <option key={w}>{w}</option>)}
      </select>

      <label>POLLING UNIT</label>
      <select value={unit} disabled={!ward} onChange={(e) => setUnit(e.target.value)}>
        <option value="">Select polling unit</option>
        {unitsFor(ward).map((u) => <option key={u}>{u}</option>)}
      </select>

      <div className="row-between">
        <label>PARTY VOTE COUNT</label>
        <span className="badge">REQUIRED</span>
      </div>
      {PARTIES.map((p) => (
        <div key={p.id} className="vote-row" style={{ borderLeftColor: p.color }}>
          <span>{p.label}</span>
          <input
            type="number" min={0} inputMode="numeric"
            value={votes[p.id]}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              setVotes((v) => ({ ...v, [p.id as PartyId]: Math.max(0, Math.floor(Number(e.target.value) || 0)) }))
            }
          />
        </div>
      ))}

      <button className="primary" disabled={!ready} onClick={submit}>
        <CheckCircle2 size={16} /> {done ? "Result recorded" : "Submit official results"}
      </button>
      {missing.length > 0 && <p className="hint">Select {missing.join(", ")} to enable submit.</p>}
      {error && <p className="hint error" role="alert">{error}</p>}
      {done && <p className="hint ok" role="status">Saved. See it at the top of the polling unit report.</p>}
      <p className="muted tiny center">Submissions are time-stamped and locked in after submission.</p>
    </aside>
  );
}
