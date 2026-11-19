import { UNITS } from "./mock-data";
import type { UnitSlug } from "./types";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${m}월 ${d}일 (${WEEK[day]})`;
}

export function formatDateTime(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });
}

export function unitName(slug: UnitSlug | "all"): string {
  if (slug === "all") return "근무지원단 전체";
  return UNITS.find((u) => u.slug === slug)?.name ?? slug;
}

export function unitColor(slug: UnitSlug | "all"): string {
  if (slug === "all") return "#1f3d2b";
  return UNITS.find((u) => u.slug === slug)?.color ?? "#1f3d2b";
}
