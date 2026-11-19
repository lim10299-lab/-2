"use client";
import { useState } from "react";
import ChatRoom from "./ChatRoom";
import InquiryPanel from "./InquiryPanel";
import CheerPanel from "./CheerPanel";
import type { Faq, Unit, UnitSlug } from "@/lib/types";

type Tab = "room" | "inquiry" | "cheer" | "faq";
const TABS: { id: Tab; label: string }[] = [
  { id: "room", label: "근무대 소통방" },
  { id: "inquiry", label: "1:1 문의" },
  { id: "cheer", label: "응원 메시지" },
  { id: "faq", label: "자주 묻는 질문" },
];

export default function TalkCenter({ units, faqs, initialUnit, initialTab }: { units: Unit[]; faqs: Faq[]; initialUnit: UnitSlug; initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [unit, setUnit] = useState<UnitSlug>(initialUnit);

  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "room" && (
        <>
          <div className="chips" style={{ marginBottom: 14 }}>
            {units.map((u) => (
              <button key={u.slug} className={`chip ${unit === u.slug ? "on" : ""}`} onClick={() => setUnit(u.slug)}>{u.name}</button>
            ))}
          </div>
          <ChatRoom key={unit} unit={unit} onGoInquiry={() => setTab("inquiry")} />
          <p className="hint">소통방은 해당 근무대 가입 회원만 볼 수 있습니다. 비방·허위사실·광고성 글은 운영 정책에 따라 숨김 처리됩니다.</p>
        </>
      )}
      {tab === "inquiry" && <InquiryPanel unit={unit} units={units} />}
      {tab === "cheer" && <CheerPanel unit={unit} units={units} />}
      {tab === "faq" && (
        <div className="grid" style={{ maxWidth: 760 }}>
          {faqs.map((f) => (
            <details key={f.id} className="card card-pad">
              <summary style={{ fontWeight: 700, cursor: "pointer" }}>
                <span className="small" style={{ color: "var(--gold)", marginRight: 8 }}>{f.category}</span>
                {f.question}
              </summary>
              <p className="muted" style={{ marginBottom: 0 }}>{f.answer}</p>
            </details>
          ))}
          <p className="muted">원하는 답이 없나요? <button className="btn btn-ghost btn-sm" onClick={() => setTab("inquiry")}>1:1 문의하기</button></p>
        </div>
      )}
    </>
  );
}
