// 데이터 접근 계층.
// 페이지는 이 파일의 함수만 호출합니다. Supabase가 설정되면 DB에서, 아니면 예시 데이터에서 읽습니다.
// Supabase 연결 후 바꿀 곳은 이 파일 하나뿐이도록 설계했습니다.
import { getSupabase } from "./supabase/client";
import { ACTIVITIES, EVENTS, FAQS, NOTICES, RESOURCES, UNITS } from "./mock-data";
import type { Activity, CalendarEvent, Faq, Notice, Resource, Unit, UnitSlug } from "./types";

export async function getUnits(): Promise<Unit[]> {
  // 근무대 기본 정보는 자주 바뀌지 않아 코드에 둡니다. (DB의 units 테이블과 내용을 맞춰 주세요)
  return UNITS;
}

export async function getUnit(slug: string): Promise<Unit | undefined> {
  return UNITS.find((u) => u.slug === slug);
}

export async function getActivities(opts: { unit?: UnitSlug; limit?: number } = {}): Promise<Activity[]> {
  const sb = getSupabase();
  if (sb) {
    let q = sb
      .from("activities")
      .select("id, unit, type, title, summary, date, image_url, cheers, comments, status")
      .eq("status", "approved")
      .order("date", { ascending: false });
    if (opts.unit) q = q.eq("unit", opts.unit);
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (!error && data) {
      return data.map((r) => ({ ...r, imageUrl: r.image_url })) as Activity[];
    }
    console.error("[repository] activities", error);
  }
  let list = ACTIVITIES.filter((a) => a.status === "approved");
  if (opts.unit) list = list.filter((a) => a.unit === opts.unit);
  list = [...list].sort((a, b) => b.date.localeCompare(a.date));
  return opts.limit ? list.slice(0, opts.limit) : list;
}

export async function getPendingActivities(): Promise<Activity[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("activities").select("*").eq("status", "review");
    if (data) return data.map((r) => ({ ...r, imageUrl: r.image_url })) as Activity[];
  }
  return ACTIVITIES.filter((a) => a.status === "review");
}

export async function getEvents(): Promise<CalendarEvent[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("events").select("*").order("date");
    if (data) return data as CalendarEvent[];
  }
  return [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getNotices(): Promise<Notice[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("notices").select("*").order("date", { ascending: false });
    if (data) return data as Notice[];
  }
  return NOTICES;
}

export async function getFaqs(): Promise<Faq[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("faqs").select("*");
    if (data) return data as Faq[];
  }
  return FAQS;
}

export async function getResources(): Promise<Resource[]> {
  const sb = getSupabase();
  if (sb) {
    const { data } = await sb.from("resources").select("*").order("date", { ascending: false });
    if (data) return data.map((r) => ({ ...r, fileUrl: r.file_url })) as Resource[];
  }
  return RESOURCES;
}
