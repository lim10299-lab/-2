"use client";
import { useState } from "react";
import UnitBadge from "./UnitBadge";
import { formatDate, unitColor } from "@/lib/format";
import type { Activity } from "@/lib/types";

export default function ActivityCard({ a }: { a: Activity }) {
  // Supabase 연결 후: 'cheers' 테이블에 (activity_id, user_id) insert 로 바꿉니다.
  const [on, setOn] = useState(false);
  return (
    <article className="card activity" style={{ ["--c" as string]: unitColor(a.unit) }}>
      <div className="activity-photo">
        {a.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.imageUrl} alt={a.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : null}
        <span>{a.type}</span>
      </div>
      <div className="activity-body">
        <UnitBadge unit={a.unit} />
        <h3>{a.title}</h3>
        <p>{a.summary}</p>
        <div className="activity-meta">
          <span>{formatDate(a.date)} · 댓글 {a.comments}</span>
          <button className={`cheer-btn ${on ? "on" : ""}`} onClick={() => setOn(!on)} aria-pressed={on}>
            👏 응원해요 {a.cheers + (on ? 1 : 0)}
          </button>
        </div>
      </div>
    </article>
  );
}
