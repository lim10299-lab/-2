import { getNotices, getResources } from "@/lib/repository";
import { formatDate } from "@/lib/format";

export const metadata = { title: "자료실" };

export default async function ResourcesPage() {
  const [resources, notices] = await Promise.all([getResources(), getNotices()]);
  const groups = ["생활 안내", "신청 양식", "운영 정책"] as const;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">자료실</div>
          <h1>공지사항과 안내 자료</h1>
          <p>생활 안내문, 신청 양식, 운영 정책을 내려받을 수 있습니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid" style={{ gap: 24 }}>
          <div className="card card-pad">
            <h2 style={{ fontSize: 20, marginBottom: 6 }}>공지사항</h2>
            <ul className="list">
              {notices.map((n) => (
                <li key={n.id} style={{ justifyContent: "space-between" }}>
                  <span>{n.pinned && <span className="pin">고정</span>}<b style={{ fontWeight: 600 }}>{n.title}</b></span>
                  <span className="small muted">{formatDate(n.date)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-3">
            {groups.map((g) => (
              <div key={g} className="card card-pad">
                <h2 style={{ fontSize: 18, marginBottom: 6 }}>{g}</h2>
                <ul className="list">
                  {resources.filter((r) => r.category === g).map((r) => (
                    <li key={r.id} style={{ justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.title}</div>
                        <div className="hint">{formatDate(r.date)}</div>
                      </div>
                      {/* Supabase Storage 연결 후 r.fileUrl 로 내려받기 */}
                      <a className="btn btn-ghost btn-sm" href={r.fileUrl ?? "#"} aria-disabled={!r.fileUrl}>받기</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
