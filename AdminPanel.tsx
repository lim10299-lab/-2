"use client";
// 관리자 화면(시연용). 운영 시에는 별도 주소 + 2단계 인증 + Supabase RLS의 staff/admin 역할로 보호합니다.
import { useState } from "react";
import UnitBadge from "./UnitBadge";
import { formatDate } from "@/lib/format";
import type { Activity } from "@/lib/types";

const CHECKS = [
  "부대 위치를 알 수 있는 외곽·간판·지형이 찍히지 않았다",
  "장비·시설·통신 관련 제원이나 수량이 드러나지 않는다",
  "사진 속 장병의 촬영·게시 동의를 받았다",
  "훈련·작전 일정이 사전에 노출되지 않는다",
  "사진 위치정보(EXIF)가 제거되었다 (업로드 시 자동)",
];

export default function AdminPanel({ pending }: { pending: Activity[] }) {
  const [items, setItems] = useState(pending.map((p) => ({ ...p, checks: CHECKS.map(() => false), reason: "" })));
  const [toast, setToast] = useState("");

  function decide(id: string, ok: boolean) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setToast(ok ? "승인되어 게시되었습니다. 해당 근무대 부모님께 알림을 보냈습니다." : "반려 사유와 함께 작성자에게 돌려보냈습니다.");
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          ["승인 대기", `${items.length}건`],
          ["미답변 문의", "1건"],
          ["가입 승인 대기", "3명"],
          ["이번 주 게시", "6건"],
        ].map(([k, v]) => (
          <div key={k} className="card card-pad">
            <div className="small muted">{k}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{v}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>게시 승인 대기</h2>
      {items.length === 0 && <div className="empty">승인 대기 중인 게시물이 없습니다.</div>}
      <div className="grid">
        {items.map((it, idx) => {
          const allChecked = it.checks.every(Boolean);
          return (
            <div key={it.id} className="card card-pad">
              <div className="row-between">
                <UnitBadge unit={it.unit} />
                <span className="small muted">{formatDate(it.date)} · {it.type}</span>
              </div>
              <h3 style={{ fontSize: 18, margin: "8px 0 4px" }}>{it.title}</h3>
              <p className="muted small" style={{ marginTop: 0 }}>{it.summary}</p>
              <div style={{ background: "#faf9f4", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                <b className="small">보안 점검표</b>
                {CHECKS.map((c, i) => (
                  <label key={c} style={{ display: "flex", gap: 8, fontSize: 14, marginTop: 6 }}>
                    <input
                      type="checkbox"
                      checked={it.checks[i]}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = { ...it, checks: it.checks.map((v, j) => (j === i ? e.target.checked : v)) };
                        setItems(next);
                      }}
                    />
                    {c}
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-sm" disabled={!allChecked} onClick={() => decide(it.id, true)}>승인 후 게시</button>
                <button className="btn btn-ghost btn-sm" onClick={() => decide(it.id, false)}>반려</button>
                {!allChecked && <span className="hint" style={{ alignSelf: "center" }}>점검표를 모두 확인해야 승인할 수 있습니다.</span>}
              </div>
            </div>
          );
        })}
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
