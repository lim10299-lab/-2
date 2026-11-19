"use client";
// 로그인 / 가입 신청.
// Supabase 연결 후:
//  - 로그인: supabase.auth.signInWithOtp({ phone }) (SMS 인증) 또는 본인인증 서비스(PASS 등) 연동
//  - 가입 신청: profiles 테이블에 status='pending' 으로 저장 → 담당 간부가 가족 관계 확인 후 'approved'
import { useState } from "react";
import type { Unit } from "@/lib/types";

export default function LoginForm({ units }: { units: Unit[] }) {
  const [mode, setMode] = useState<"login" | "join">("login");
  const [sent, setSent] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <div className="card card-pad" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="tabs">
        <button className={`tab ${mode === "login" ? "on" : ""}`} onClick={() => setMode("login")}>로그인</button>
        <button className={`tab ${mode === "join" ? "on" : ""}`} onClick={() => setMode("join")}>가입 신청</button>
      </div>

      {mode === "login" ? (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className="field">
            <label htmlFor="phone">휴대폰 번호</label>
            <input id="phone" className="input" inputMode="tel" placeholder="010-0000-0000" required />
          </div>
          {sent && (
            <div className="field">
              <label htmlFor="otp">인증번호</label>
              <input id="otp" className="input" inputMode="numeric" placeholder="문자로 받은 6자리" />
              <span className="hint">시연 화면에서는 실제 문자가 발송되지 않습니다.</span>
            </div>
          )}
          <button className="btn btn-primary" style={{ width: "100%" }}>{sent ? "로그인" : "인증번호 받기"}</button>
        </form>
      ) : joined ? (
        <div className="notice-box">
          가입 신청이 접수되었습니다. 담당 간부가 가족 관계를 확인한 뒤 승인하면 문자로 알려 드립니다. (보통 1~2 영업일)
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setJoined(true); }}>
          <div className="field"><label htmlFor="j-name">보호자 성명</label><input id="j-name" className="input" required /></div>
          <div className="field"><label htmlFor="j-phone">휴대폰 번호 (본인인증)</label><input id="j-phone" className="input" inputMode="tel" required /></div>
          <div className="grid grid-2" style={{ gap: 12 }}>
            <div className="field"><label htmlFor="j-child">자녀 성명</label><input id="j-child" className="input" required /></div>
            <div className="field">
              <label htmlFor="j-unit">자녀 근무대</label>
              <select id="j-unit" className="select">{units.map((u) => <option key={u.slug} value={u.slug}>{u.name}</option>)}</select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="j-rel">관계</label>
            <select id="j-rel" className="select"><option>부</option><option>모</option><option>기타 가족</option></select>
          </div>
          <label style={{ display: "flex", gap: 8, fontSize: 14, marginBottom: 14 }}>
            <input type="checkbox" required />
            <span>개인정보 수집·이용(성명, 연락처, 자녀 정보)과 이용 수칙(사진 외부 공유 금지 등)에 동의합니다.</span>
          </label>
          <button className="btn btn-primary" style={{ width: "100%" }}>가입 신청</button>
        </form>
      )}
    </div>
  );
}
