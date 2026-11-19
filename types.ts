// 사이트 전체에서 쓰는 데이터 형태입니다.
// supabase/schema.sql 의 테이블 구조와 1:1로 맞춰 두었습니다.

export type UnitSlug =
  | "medical"
  | "hq"
  | "facility"
  | "supply"
  | "maintenance"
  | "band"
  | "signal";

export interface Unit {
  slug: UnitSlug;
  name: string; // 의무대대
  tagline: string; // 한 줄 소개
  missions: string[]; // 생도 교육 지원 임무
  corner: string; // 고정 코너
  examples: string[]; // 주요활동 게시 예시
  caution: string; // 보안상 유의점
  color: string; // 근무대 대표 색
  dailySchedule: { time: string; label: string }[]; // 우리 부대의 하루
}

export type ActivityType = "교육지원" | "훈련" | "행사" | "체육·여가" | "포상·승진" | "봉사";

export interface Activity {
  id: string;
  unit: UnitSlug;
  type: ActivityType;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  imageUrl?: string | null; // Supabase Storage 공개 URL
  cheers: number;
  comments: number;
  status: "draft" | "review" | "approved" | "rejected";
}

export interface CalendarEvent {
  id: string;
  unit: UnitSlug | "all";
  title: string;
  date: string;
  time?: string;
  place?: string;
  kind: "행사" | "면회·개방" | "수료·전역" | "온라인";
  description?: string;
}

export interface Notice {
  id: string;
  unit: UnitSlug | "all";
  title: string;
  date: string;
  pinned?: boolean;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface Resource {
  id: string;
  title: string;
  category: "생활 안내" | "신청 양식" | "운영 정책";
  date: string;
  fileUrl?: string | null;
}

export interface ChatMessage {
  id: string;
  unit: UnitSlug;
  author: string;
  role: "parent" | "staff";
  body: string;
  createdAt: string; // ISO
}

export type InquiryCategory = "건강·의료" | "휴가·면회·외출" | "생활·고충" | "행사·방문" | "기타";
export type InquiryStatus = "접수" | "확인 중" | "답변 완료";

export interface Inquiry {
  id: string;
  unit: UnitSlug;
  category: InquiryCategory;
  title: string;
  body: string;
  status: InquiryStatus;
  createdAt: string;
  answer?: string;
  answeredBy?: string;
}

export interface CheerMessage {
  id: string;
  unit: UnitSlug;
  toName: string;
  body: string;
  createdAt: string;
  delivered: boolean;
  reply?: string;
}

export interface ProgramItem {
  name: string;
  cycle: string;
  content: string;
  channel: string;
}
