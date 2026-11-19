// 예시 데이터(src/lib/mock-data.ts)로 supabase/seed.sql 을 만듭니다.  실행: npm run seed:sql
import { writeFileSync } from "node:fs";
import { ACTIVITIES, EVENTS, FAQS, NOTICES, RESOURCES } from "../src/lib/mock-data.ts";

const q = (v: unknown) => (v === undefined || v === null ? "null" : typeof v === "number" || typeof v === "boolean" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const rows = (table: string, cols: string[], items: Record<string, unknown>[]) =>
  `insert into public.${table} (${cols.join(", ")}) values\n` +
  items.map((it) => `  (${cols.map((c) => q(it[c])).join(", ")})`).join(",\n") + ";\n";

let sql = "-- 예시 데이터 (scripts/make-seed.mts 로 생성). 운영 전 삭제하거나 실제 내용으로 바꾸세요.\n\n";
sql += rows("activities", ["unit", "type", "title", "summary", "date", "cheers", "comments", "status", "security_checked"],
  ACTIVITIES.map((a) => ({ ...a, security_checked: a.status === "approved" })));
sql += rows("events", ["unit", "title", "date", "time", "place", "kind", "description"], EVENTS as never);
sql += rows("notices", ["unit", "title", "date", "pinned"], NOTICES.map((n) => ({ ...n, pinned: !!n.pinned })));
sql += rows("faqs", ["category", "question", "answer"], FAQS as never);
sql += rows("resources", ["title", "category", "date"], RESOURCES as never);
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log("supabase/seed.sql 생성 완료");
