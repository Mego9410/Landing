import styles from "./admin.module.css";

/** One series of daily counts as thin bars, with each bar's date and count on hover and in a hidden table. */
export function DailyBars({ points, label }: { points: { day: string; n: number | null }[]; label: string }) {
  const W = 600, H = 150, pad = 18, max = Math.max(1, ...points.map((p) => p.n ?? 0));
  const step = (W - 8) / points.length, bar = Math.max(3, step - 4);
  const short = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H + pad}`} className={styles.chart} role="img" aria-label={`${label}, ${short(points[0].day)} to ${short(points.at(-1)!.day)}`}>
        <line x1="0" x2={W} y1={H} y2={H} className={styles.chartBase} />
        {points.map((p, i) => {
          const h = p.n ? Math.max(4, (p.n / max) * (H - 16)) : 0;
          const x = 4 + i * step + (step - bar) / 2;
          return (
            <g key={p.day}>
              {/* A full-height hit area, bigger than the bar, for the hover label. */}
              <rect x={4 + i * step} y="0" width={step} height={H} fill="transparent"><title>{`${short(p.day)}: ${p.n ?? "no report yet"}`}</title></rect>
              {h ? <path className={styles.chartBar} d={`M${x} ${H} V${H - h + 4} q0 -4 4 -4 h${bar - 8} q4 0 4 4 V${H} Z`} pointerEvents="none" /> : null}
            </g>
          );
        })}
        <text x="4" y={H + 14} className={styles.chartAxis}>{short(points[0].day)}</text>
        <text x={W - 4} y={H + 14} textAnchor="end" className={styles.chartAxis}>{short(points.at(-1)!.day)}</text>
        <text x={W - 4} y="11" textAnchor="end" className={styles.chartAxis}>{`peak ${max}`}</text>
      </svg>
      <table style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        <caption>{label}</caption>
        <tbody>{points.map((p) => <tr key={p.day}><td>{p.day}</td><td>{p.n ?? "no report"}</td></tr>)}</tbody>
      </table>
    </figure>
  );
}
