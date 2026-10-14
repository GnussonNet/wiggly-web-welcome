import { CalendarDays, Check, FileImage, Link, RotateCcw } from "lucide-react";
import { useToolDemo } from "@/hooks/use-tool-demo";

export type ToolId = "burrow" | "loam" | "trace";

const EVENTS = [
  { time: "09:00", name: "Design lecture", kind: "Lecture", included: true },
  { time: "11:00", name: "Optional workshop", kind: "Workshop", included: false },
  { time: "13:00", name: "Systems lecture", kind: "Lecture", included: true },
  { time: "15:00", name: "Study group", kind: "Social", included: false },
];

const DETAILS = [
  { label: "Location", value: "59.3293° N, 18.0686° E" },
  { label: "Camera", value: "Phone camera" },
  { label: "Date taken", value: "12 October 2026" },
];

function BurrowExample({ stage }: { stage: number }) {
  return <>
    <div className="demo-content calendar-example">
      <div className="sample-heading"><CalendarDays size={17} aria-hidden="true" /><span>Your week</span><span className="sample-label">Sample calendar</span></div>
      <div className="sample-filter"><span>Include</span><span className={`filter-value ${stage >= 1 ? "is-selected" : ""}`}>Lectures only <Check size={13} aria-hidden="true" /></span></div>
      <ul className="sample-events">{EVENTS.map((event) => <li key={event.name} className={stage >= 2 && !event.included ? "is-excluded" : ""}>
        <time>{event.time}</time><div><span>{event.name}</span><small>{event.kind}</small></div><span className="event-indicator"><span className="sr-only">{stage >= 2 && !event.included ? "Excluded" : "Included"}</span>{stage >= 2 && !event.included ? <span aria-hidden="true">−</span> : <Check size={13} aria-hidden="true" />}</span>
      </li>)}</ul>
    </div>
    <div className="demo-result"><Check size={15} aria-hidden="true" /><span>{stage >= 3 ? "2 of 4 events in your filtered calendar" : stage >= 1 ? "Applying your rule…" : "4 events in the original calendar"}</span></div>
  </>;
}

function LoamExample({ stage }: { stage: number }) {
  return <>
    <div className="demo-content photo-example">
      <div className="sample-file">
        <FileImage size={32} aria-hidden="true" />
        <div><span>sample.jpg</span><small>The photo stays unchanged</small></div>
      </div>
      <dl className="metadata-example">{DETAILS.map((detail) => <div key={detail.label} className={stage >= 2 ? "is-removed" : ""}>
        <dt>{detail.label}</dt><dd><span>{detail.value}</span><Check size={13} aria-label={stage >= 2 ? "Removed" : undefined} aria-hidden={stage < 2} /></dd>
      </div>)}</dl>
    </div>
    <div className="demo-result"><Check size={15} aria-hidden="true" /><span>{stage >= 3 ? "A cleaned copy. The same photo." : stage >= 1 ? "Removing descriptive metadata…" : "A photo can carry more than you see"}</span></div>
  </>;
}

function TraceExample({ stage }: { stage: number }) {
  return <>
    <div className="demo-content link-example">
      <div className="sample-heading"><Link size={17} aria-hidden="true" /><span>A link from a newsletter</span></div>
      <div className="sample-url"><span>https://example.com/article</span><span className={stage >= 2 ? "tracking-text is-removed" : "tracking-text"}>?utm_source=newsletter<br />&amp;utm_medium=email</span><span>&amp;id=42#read</span></div>
      <div className="parameter-summary"><span className={stage >= 1 ? "is-selected" : ""}>{stage >= 2 ? "2 tracking parameters removed" : "2 known tracking parameters"}</span><span>Article ID and anchor kept</span></div>
      <div className={`clean-url ${stage >= 2 ? "is-ready" : ""}`}><span>Cleaned link</span><code>https://example.com/article?id=42#read</code></div>
    </div>
    <div className="demo-result"><Check size={15} aria-hidden="true" /><span>{stage >= 3 ? "Same article. Less attached." : stage >= 1 ? "Removing known tracking parameters…" : "Choose what travels with your link"}</span></div>
  </>;
}

export default function ToolDemo({ tool, name }: { tool: ToolId; name: string }) {
  const { ref, stage, reduced, replay } = useToolDemo();
  return <figure ref={ref} className="tool-demo" aria-label={`${name} example`} data-stage={stage}>
    <figcaption className="demo-header"><span>How {name} works <span className="example-label">Sample data</span></span>{!reduced && <button type="button" onClick={replay} aria-label={`Replay ${name} example`}><RotateCcw size={13} aria-hidden="true" />Replay</button>}</figcaption>
    {tool === "burrow" ? <BurrowExample stage={stage} /> : tool === "loam" ? <LoamExample stage={stage} /> : <TraceExample stage={stage} />}
  </figure>;
}
