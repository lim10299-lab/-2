"use client";
import { useMemo, useState } from "react";
import UnitBadge from "./UnitBadge";
import { formatDate } from "@/lib/format";
import { useLocalState } from "@/lib/use-local-state";
import type { CalendarEvent } from "@/lib/types";

const KIND_COLOR: Record<CalendarEvent["kind"], string> = {
  행사: "#7e22ce",
  "면회·개방": "#15803d",
  "수료·전역": "#b8913a",
  온라인: "#1d4ed8",
};

export default function ScheduleView({ events, today }: { events: CalendarEvent[]; today: string }) {
  const [ym, setYm] = useState(today.slice(0, 7));
  const [applied, setApplied] = useLocalState<string[]>("applied-events", []);
  const [y, m] = ym.split("-").map(Number);

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [y, m]);

  const monthEvents = events.filter((e) => e.date.startsWith(ym));
  const move = (d: number) => {
    const dt = new Date(Date.UTC(y, m - 1 + d, 1));
    setYm(dt.toISOString().slice(0, 7));
  };

  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <div className="card card-pad">
        <div className="row-between" style={{ marginBottom: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => move(-1)} aria-label="이전 달">←</button>
          <h2 style={{ fontSize: 20 }}>{y}년 {m}월</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => move(1)} aria-label="다음 달">→</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
          {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <div key={d} className="small" style={{ fontWeight: 700, color: i === 0 ? "var(--danger)" : "var(--ink-3)", padding: "4px 0" }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={`b${i}`} />;
            const date = `${ym}-${String(d).padStart(2, "0")}`;
            const evs = monthEvents.filter((e) => e.date === date);
            const isToday = date === today;
            return (
              <div key={date} style={{ minHeight: 54, borderRadius: 10, padding: "6px 2px", background: isToday ? "var(--green-800)" : evs.length ? "var(--green-100)" : "transparent", color: isToday ? "#fff" : undefined }}>
                <div style={{ fontWeight: isToday ? 800 : 600, fontSize: 15 }}>{d}</div>
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 4 }}>
                  {evs.map((e) => <span key={e.id} title={e.title} style={{ width: 7, height: 7, borderRadius: "50%", background: KIND_COLOR[e.kind] }} />)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="chips" style={{ marginTop: 14 }}>
          {Object.entries(KIND_COLOR).map(([k, c]) => (
            <span key={k} className="small" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-2)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{k}
            </span>
          ))}
        </div>
      </div>
      <div className="grid">
        <h2 style={{ fontSize: 20 }}>{m}월 일정 {monthEvents.length}건</h2>
        {monthEvents.length === 0 && <div className="empty">이 달에는 공개된 일정이 없습니다.</div>}
        {monthEvents.map((e) => {
          const on = applied.includes(e.id);
          const canApply = !!e.place && e.kind !== "온라인";
          return (
            <div key={e.id} className="card card-pad" style={{ borderLeft: `4px solid ${KIND_COLOR[e.kind]}` }}>
              <div className="row-between">
                <span className="small" style={{ fontWeight: 800, color: KIND_COLOR[e.kind] }}>{e.kind}</span>
                <UnitBadge unit={e.unit} />
              </div>
              <h3 style={{ fontSize: 18, margin: "6px 0 2px" }}>{e.title}</h3>
              <div className="small muted">{formatDate(e.date)}{e.time ? ` ${e.time}` : ""}{e.place ? ` · ${e.place}` : ""}</div>
              {e.description && <p className="small" style={{ margin: "8px 0 0" }}>{e.description}</p>}
              {canApply && e.date >= today && (
                <button className={`btn btn-sm ${on ? "btn-ghost" : "btn-primary"}`} style={{ marginTop: 10 }} onClick={() => setApplied(on ? applied.filter((x) => x !== e.id) : [...applied, e.id])}>
                  {on ? "참석 신청 완료 · 취소하기" : "참석 신청"}
                </button>
              )}
            </div>
          );
        })}
        <p className="hint">훈련·작전 일정은 보안상 공개하지 않습니다. 참석 신청 후 출입 절차·주차·준비물을 행사 1주 전에 안내드립니다.</p>
      </div>
    </div>
  );
}
