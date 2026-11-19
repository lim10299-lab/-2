"use client";
// 근무대 소통방.
// Supabase 연결 후: chat_messages 테이블을 select 하고,
//   supabase.channel(`room:${unit}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `unit=eq.${unit}` }, ...)
// 로 새 메시지를 실시간 구독합니다. 지금은 예시 메시지 + 브라우저 저장으로 동작합니다.
import { useEffect, useRef, useState } from "react";
import { CHAT_MESSAGES } from "@/lib/mock-data";
import { formatDateTime, unitName } from "@/lib/format";
import { useLocalState } from "@/lib/use-local-state";
import type { ChatMessage, UnitSlug } from "@/lib/types";

const SENSITIVE = ["아프", "아파", "병원", "징계", "다쳤", "상담", "우울", "힘들어"];

export default function ChatRoom({ unit, onGoInquiry }: { unit: UnitSlug; onGoInquiry: () => void }) {
  const [mine, setMine] = useLocalState<ChatMessage[]>(`chat-${unit}`, []);
  const [text, setText] = useState("");
  const [warn, setWarn] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const messages = [...CHAT_MESSAGES.filter((m) => m.unit === unit), ...mine].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function send() {
    const body = text.trim();
    if (!body) return;
    if (!warn && SENSITIVE.some((k) => body.includes(k))) {
      setWarn(true);
      return;
    }
    setMine((prev) => [
      ...prev,
      { id: `local-${Date.now()}`, unit, author: "나", role: "parent", body, createdAt: new Date().toISOString() },
    ]);
    setText("");
    setWarn(false);
  }

  return (
    <div className="card chat">
      <div className="chat-head">
        <div>
          <b>{unitName(unit)} 소통방</b>
          <div className="small muted">담당 간부 상주 · 평일 09~18시 (시간 외 글은 다음 날 오전 확인)</div>
        </div>
        <span className="live-dot">실시간</span>
      </div>
      <div className="notice-box" style={{ margin: 12, marginBottom: 0 }}>
        📌 이번 주 일정과 이용 수칙을 확인해 주세요. 특정 장병의 건강·징계·상담 이야기는 1:1 문의를 이용해 주세요.
      </div>
      <div className="chat-body" ref={bodyRef}>
        {messages.length === 0 && <div className="empty">아직 대화가 없습니다. 첫 인사를 남겨 보세요.</div>}
        {messages.map((m) => {
          const me = m.author === "나";
          return (
            <div key={m.id} className={`msg ${m.role} ${me ? "me" : ""}`}>
              <span className="who">{me ? "나" : m.author} · {formatDateTime(m.createdAt)}</span>
              <div className="bubble">{m.body}</div>
            </div>
          );
        })}
      </div>
      {warn && (
        <div className="notice-box" style={{ margin: "0 12px 8px", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          개인적인 내용이 담긴 것 같아요. 1:1 문의로 보내시면 담당 간부만 볼 수 있습니다.
          <button className="btn btn-primary btn-sm" onClick={onGoInquiry}>1:1 문의로 이동</button>
          <button className="btn btn-ghost btn-sm" onClick={send}>그래도 소통방에 올리기</button>
        </div>
      )}
      <div className="chat-input">
        <input
          className="input"
          value={text}
          onChange={(e) => { setText(e.target.value); setWarn(false); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) send(); }}
          placeholder="부모님들과 안부를 나눠 보세요"
          aria-label="메시지 입력"
        />
        <button className="btn btn-primary" onClick={send}>보내기</button>
      </div>
    </div>
  );
}
