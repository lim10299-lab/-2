"use client";
import { useMemo, useState } from "react";
import ActivityCard from "./ActivityCard";
import type { Activity, ActivityType, Unit, UnitSlug } from "@/lib/types";

const TYPES: ActivityType[] = ["교육지원", "훈련", "행사", "체육·여가", "포상·승진", "봉사"];

export default function ActivityFeed({ activities, units, initialUnit }: { activities: Activity[]; units: Unit[]; initialUnit?: UnitSlug }) {
  const [unit, setUnit] = useState<UnitSlug | "all">(initialUnit ?? "all");
  const [type, setType] = useState<ActivityType | "all">("all");

  const list = useMemo(
    () => activities.filter((a) => (unit === "all" || a.unit === unit) && (type === "all" || a.type === type)),
    [activities, unit, type]
  );

  return (
    <>
      <div style={{ display: "grid", gap: 10, marginBottom: 22 }}>
        <div className="chips" role="group" aria-label="근무대 선택">
          <button className={`chip ${unit === "all" ? "on" : ""}`} onClick={() => setUnit("all")}>전체 근무대</button>
          {units.map((u) => (
            <button key={u.slug} className={`chip ${unit === u.slug ? "on" : ""}`} onClick={() => setUnit(u.slug)}>
              {u.name}
            </button>
          ))}
        </div>
        <div className="chips" role="group" aria-label="활동 유형">
          <button className={`chip ${type === "all" ? "on" : ""}`} onClick={() => setType("all")}>모든 활동</button>
          {TYPES.map((t) => (
            <button key={t} className={`chip ${type === t ? "on" : ""}`} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {list.length ? (
        <div className="grid grid-3">
          {list.map((a) => (
            <ActivityCard key={a.id} a={a} />
          ))}
        </div>
      ) : (
        <div className="empty">선택한 조건의 활동 소식이 아직 없습니다.</div>
      )}
    </>
  );
}
