"use client";
// 내 정보: 관심 근무대와 알림 종류를 부모님이 직접 고릅니다.
// Supabase 연결 후: profiles 테이블(관심 근무대)과 notification_prefs 테이블에 저장합니다.
import Link from "next/link";
import { useLocalState } from "@/lib/use-local-state";
import type { Unit, UnitSlug } from "@/lib/types";

const ALERTS = [
  { id: "post", label: "새 활동 게시물", desc: "관심 근무대에 새 소식이 올라오면" },
  { id: "answer", label: "1:1 문의 답변", desc: "문의 상태가 바뀌거나 답변이 달리면" },
  { id: "event", label: "행사 하루 전", desc: "참석 신청한 행사 전날" },
  { id: "cheer", label: "자녀 답장", desc: "응원 메시지에 답장이 오면" },
  { id: "letter", label: "대장의 편지·소식지", desc: "월 1회 정기 소식" },
];

export default function MySettings({ units }: { units: Unit[] }) {
  const [fav, setFav] = useLocalState<UnitSlug[]>("fav-units", ["supply"]);
  const [alerts, setAlerts] = useLocalState<Record<string, boolean>>("alerts", { post: true, answer: true, event: true, cheer: true, letter: false });
  const [channel, setChannel] = useLocalState<"push" | "kakao">("alert-channel", "push");

  return (
    <div className="grid grid-2" style={{ alignItems: "start" }}>
      <div className="grid">
        <div className="card card-pad">
          <div className="row-between">
            <div>
              <div className="small muted">회원</div>
              <h2 style={{ fontSize: 22 }}>○○○ 부모님</h2>
              <div className="small muted">자녀: ○○○ 일병 · 보급대 · 가입 승인 완료</div>
            </div>
            <Link href="/login" className="btn btn-ghost btn-sm">로그아웃</Link>
          </div>
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>관심 근무대</h3>
          <p className="small muted" style={{ marginTop: 0 }}>선택한 근무대의 소식이 홈 화면과 알림에 먼저 표시됩니다.</p>
          <div className="chips">
            {units.map((u) => {
              const on = fav.includes(u.slug);
              return (
                <button key={u.slug} className={`chip ${on ? "on" : ""}`} onClick={() => setFav(on ? fav.filter((x) => x !== u.slug) : [...fav, u.slug])}>
                  {on ? "✓ " : ""}{u.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="card card-pad">
          <h3 style={{ fontSize: 18, marginBottom: 8 }}>바로가기</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/talk?tab=inquiry" className="btn btn-ghost btn-sm">내 문의 내역</Link>
            <Link href="/talk?tab=cheer" className="btn btn-ghost btn-sm">보낸 응원</Link>
            <Link href="/schedule" className="btn btn-ghost btn-sm">참석 신청한 행사</Link>
          </div>
        </div>
      </div>
      <div className="card card-pad">
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>알림 설정</h3>
        <div className="field" style={{ marginTop: 10 }}>
          <label>받는 방법</label>
          <div className="chips">
            <button className={`chip ${channel === "push" ? "on" : ""}`} onClick={() => setChannel("push")}>웹 푸시(홈 화면 추가)</button>
            <button className={`chip ${channel === "kakao" ? "on" : ""}`} onClick={() => setChannel("kakao")}>카카오 알림톡</button>
          </div>
        </div>
        <ul className="list">
          {ALERTS.map((a) => (
            <li key={a.id} style={{ justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{a.label}</div>
                <div className="hint">{a.desc}</div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={!!alerts[a.id]} onChange={(e) => setAlerts({ ...alerts, [a.id]: e.target.checked })} aria-label={a.label} />
                <span />
              </label>
            </li>
          ))}
        </ul>
        <p className="hint" style={{ marginBottom: 0 }}>자녀 전역 후 6개월이 지나면 계정이 자동으로 휴면 처리됩니다.</p>
      </div>
    </div>
  );
}
