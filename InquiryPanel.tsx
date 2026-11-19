"use client";
// 1:1 문의. 부모님 본인과 담당 간부만 볼 수 있습니다(Supabase RLS로 보장).
// Supabase 연결 후: inquiries 테이블에 insert, 상태 변경 시 알림(웹 푸시/알림톡)을 보냅니다.
import { useState } from "react";
import { SAMPLE_INQUIRIES } from "@/lib/mock-data";
import { formatDateTime, unitName } from "@/lib/format";
import { useLocalState } from "@/lib/use-local-state";
import type { Inquiry, InquiryCategory, InquiryStatus, Unit, UnitSlug } from "@/lib/types";

const CATEGORIES: InquiryCategory[] = ["건강·의료", "휴가·면회·외출", "생활·고충", "행사·방문", "기타"];
const STEPS: InquiryStatus[] = ["접수", "확인 중", "답변 완료"];
const TARGET: Record<InquiryCategory, string> = {
  "건강·의료": "당일 안에 진료 상황을 안내드립니다",
  "휴가·면회·외출": "영업일 24시간 안에 답변드립니다",
  "생활·고충": "영업일 24시간 안에 답변드립니다",
  "행사·방문": "영업일 24시간 안에 답변드립니다",
  기타: "건의·민원은 3영업일 안에 조치 결과를 알려 드립니다",
};

export default function InquiryPanel({ unit, units }: { unit: UnitSlug; units: Unit[] }) {
  const [list, setList] = useLocalState<Inquiry[]>("inquiries", SAMPLE_INQUIRIES);
  const [form, setForm] = useState({ unit, category: "건강·의료" as InquiryCategory, title: "", body: "" });
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setList((prev) => [
      { id: `q-${Date.now()}`, ...form, status: "접수", createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setForm({ ...form, title: "", body: "" });
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  }

  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <form className="card card-pad" onSubmit={submit}>
        <h3 style={{ fontSize: 20, marginBottom: 4 }}>1:1 문의하기</h3>
        <p className="small muted" style={{ marginTop: 0 }}>담당 간부만 볼 수 있습니다. 긴급 상황은 부대 대표 전화를 이용해 주세요.</p>
        <div className="field">
          <label htmlFor="q-unit">근무대</label>
          <select id="q-unit" className="select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value as UnitSlug })}>
            {units.map((u) => <option key={u.slug} value={u.slug}>{u.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>문의 유형</label>
          <div className="chips">
            {CATEGORIES.map((c) => (
              <button type="button" key={c} className={`chip ${form.category === c ? "on" : ""}`} onClick={() => setForm({ ...form, category: c })}>{c}</button>
            ))}
          </div>
          <span className="hint">⏱ {TARGET[form.category]}</span>
        </div>
        <div className="field">
          <label htmlFor="q-title">제목</label>
          <input id="q-title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="예) 12월 면회 가능한 날짜 문의" />
        </div>
        <div className="field">
          <label htmlFor="q-body">내용</label>
          <textarea id="q-body" className="textarea" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="자녀 이름과 궁금한 내용을 적어 주세요" />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}>문의 보내기</button>
        {done && <p className="small" style={{ color: "var(--ok)", fontWeight: 700 }}>접수되었습니다. 답변이 등록되면 알림을 보내 드립니다.</p>}
      </form>

      <div className="grid">
        <h3 style={{ fontSize: 20 }}>내 문의 내역</h3>
        {list.length === 0 && <div className="empty">문의 내역이 없습니다.</div>}
        {list.map((q) => (
          <div key={q.id} className="card card-pad">
            <div className="row-between" style={{ marginBottom: 6 }}>
              <span className={`status status-${q.status.split(" ")[0]}`}>{q.status}</span>
              <span className="small muted">{unitName(q.unit)} · {q.category}</span>
            </div>
            <div style={{ fontWeight: 700 }}>{q.title}</div>
            <p className="small muted" style={{ margin: "4px 0 8px" }}>{q.body}</p>
            <div className="steps">
              {STEPS.map((s, i) => (
                <span key={s} className={STEPS.indexOf(q.status) >= i ? "on" : ""}>{i > 0 && "→ "}{s}</span>
              ))}
            </div>
            {q.answer && (
              <div style={{ marginTop: 10, background: "var(--green-100)", borderRadius: 10, padding: "10px 14px" }}>
                <div className="small" style={{ fontWeight: 800, color: "var(--green-800)" }}>답변 · {q.answeredBy}</div>
                <div style={{ fontSize: 15 }}>{q.answer}</div>
              </div>
            )}
            <div className="hint" style={{ marginTop: 8 }}>{formatDateTime(q.createdAt)} 접수</div>
          </div>
        ))}
      </div>
    </div>
  );
}
