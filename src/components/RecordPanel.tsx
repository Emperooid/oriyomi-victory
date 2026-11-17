import { CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { WHATSAPP_LINES, waLink } from "../config";
import { ELECTIONS, LGAS, PARTIES, unitsFor, wardsFor } from "../data/oyo";
import type { NewResult, PartyId } from "../types";

const blank = () => Object.fromEntries(PARTIES.map((p) => [p.id, ""])) as Record<PartyId, string>;
const toVotes = (raw: Record<PartyId, string>) =>
  Object.fromEntries(PARTIES.map((p) => [p.id, Math.max(0, Math.floor(Number(raw[p.id]) || 0))])) as Record<PartyId, number>;

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
  const [votes, setVotes] = useState(blank());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const missing = [!lga && "local government", !ward && "ward", !unit && "polling unit"].filter(Boolean) as string[];
  const ready = missing.length === 0 && !busy;

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      await onSubmit({ electionId: election, lga, ward, pollingUnit: unit, votes: toVotes(votes) });
    } catch {
      setError("Could not save this result. Please try again.");
      setBusy(false);
      return;
    }
    setVotes(blank());
    setUnit("");
    setBusy(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  const waText = () =>
    [
      `*Polling unit result*`,
      ELECTIONS.find((e) => e.id === election)?.name,
      `LGA: ${lga}`,
      `Ward: ${ward}`,
      `Polling unit: ${unit}`,
      ...PARTIES.map((p) => `${p.label}: ${toVotes(votes)[p.id]}`),
      `Total: ${Object.values(toVotes(votes)).reduce((a, b) => a + b, 0)}`,
    ].join("\n");

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
            type="number" min={0} inputMode="numeric" placeholder="0"
            aria-label={`${p.label} votes`}
            value={votes[p.id]}
            onChange={(e) => setVotes((v) => ({ ...v, [p.id]: e.target.value }))}
          />
        </div>
      ))}

      <button className="primary" disabled={!ready} onClick={submit}>
        <CheckCircle2 size={16} /> {done ? "Result recorded" : "Submit official results"}
      </button>
      <div className="wa">
        <label>SEND BY WHATSAPP ALSO</label>
        <div className="wa-row">
          {WHATSAPP_LINES.map((l) => (
            <a
              key={l.number}
              className={`wa-btn ${missing.length ? "off" : ""}`}
              href={missing.length ? undefined : waLink(l.number, waText())}
              target="_blank" rel="noopener noreferrer"
              aria-disabled={missing.length > 0}
              aria-label={`Send result to WhatsApp ${l.label}`}
              title={l.label}
            >
              <WhatsAppIcon />
            </a>
          ))}
        </div>
      </div>

      {missing.length > 0 && <p className="hint">Select {missing.join(", ")} to enable submit.</p>}
      {error && <p className="hint error" role="alert">{error}</p>}
      {done && <p className="hint ok" role="status">Saved. See it at the top of the polling unit report.</p>}
      <p className="muted tiny center">Submissions are time-stamped and locked in after submission.</p>
    </aside>
  );
}
