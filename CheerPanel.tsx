"use client";
// 응원 메시지: 부모님 → 자녀. 담당 간부가 주 1회 모아서 전달하고, 자녀의 짧은 답장을 돌려드립니다.
import { useState } from "react";
import { SAMPLE_CHEERS } from "@/lib/mock-data";
import { formatDateTime, unitName } from "@/lib/format";
import { useLocalState } from "@/lib/use-local-state";
import type { CheerMessage, Unit, UnitSlug } from "@/lib/types";

const MAX = 500;

export default function CheerPanel({ unit, units }: { unit: UnitSlug; units: Unit[] }) {
  const [list, setList] = useLocalState<CheerMessage[]>("cheers", SAMPLE_CHEERS);
  const [form, setForm] = useState({ unit, toName: "", body: "", special: false });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.toName.trim() || !form.body.trim()) return;
    setList((prev) => [
      { id: `m-${Date.now()}`, unit: form.unit, toName: form.toName, body: form.body, createdAt: new Date().toISOString(), delivered: false },
      ...prev,
    ]);
    setForm({ ...form, body: "", special: false });
  }

  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <form className="card card-pad" onSubmit={submit}>
        <h3 style={{ fontSize: 20, marginBottom: 4 }}>자녀에게 응원 보내기</h3>
        <p className="small muted" style={{ marginTop: 0 }}>담당 간부가 매주 모아 자녀에게 전해 드립니다. 생일·기념일 메시지는 당일에 전달합니다.</p>
        <div className="grid grid-2" style={{ gap: 12 }}>
          <div className="field">
            <label htmlFor="c-unit">근무대</label>
            <select id="c-unit" className="select" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value as UnitSlug })}>
              {units.map((u) => <option key={u.slug} value={u.slug}>{u.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-name">받는 사람</label>
            <input id="c-name" className="input" value={form.toName} onChange={(e) => setForm({ ...form, toName: e.target.value })} placeholder="자녀 이름" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="c-body">메시지</label>
          <textarea id="c-body" className="textarea" maxLength={MAX} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="따뜻한 한마디를 남겨 주세요" />
          <span className="hint" style={{ textAlign: "right" }}>{form.body.length} / {MAX}자</span>
        </div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, fontSize: 15 }}>
          <input type="checkbox" checked={form.special} onChange={(e) => setForm({ ...form, special: e.target.checked })} />
          생일·기념일 메시지 (당일 전달)
        </label>
        <button className="btn btn-gold" style={{ width: "100%" }}>응원 보내기</button>
      </form>
      <div className="grid">
        <h3 style={{ fontSize: 20 }}>보낸 응원</h3>
        {list.map((m) => (
          <div key={m.id} className="card card-pad">
            <div className="row-between">
              <b>{m.toName}에게 · <span className="small muted">{unitName(m.unit)}</span></b>
              <span className={`status ${m.delivered ? "status-답변" : "status-확인"}`}>{m.delivered ? "전달 완료" : "전달 대기"}</span>
            </div>
            <p style={{ margin: "8px 0", fontSize: 15 }}>{m.body}</p>
            {m.reply && (
              <div style={{ background: "var(--gold-soft)", borderRadius: 10, padding: "10px 14px", fontSize: 15 }}>
                <b className="small" style={{ color: "#7a5a14" }}>자녀의 답장</b>
                <div>{m.reply}</div>
              </div>
            )}
            <div className="hint" style={{ marginTop: 6 }}>{formatDateTime(m.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
