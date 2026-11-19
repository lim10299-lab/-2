import TalkCenter from "@/components/talk/TalkCenter";
import { getFaqs, getUnits } from "@/lib/repository";
import { PROGRAMS, SITUATIONS } from "@/lib/mock-data";
import type { UnitSlug } from "@/lib/types";

export const metadata = { title: "소통마당" };

type Tab = "room" | "inquiry" | "cheer" | "faq";

export default async function TalkPage({ searchParams }: { searchParams: Promise<{ unit?: string; tab?: string }> }) {
  const sp = await searchParams;
  const [units, faqs] = await Promise.all([getUnits(), getFaqs()]);
  const unit = (units.find((u) => u.slug === sp.unit)?.slug ?? "supply") as UnitSlug;
  const tab = (["room", "inquiry", "cheer", "faq"].includes(sp.tab ?? "") ? sp.tab : "room") as Tab;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">소통마당</div>
          <h1>부대와 부모님이 함께 이야기하는 곳</h1>
          <p>근무대 소통방, 1:1 문의, 자녀에게 보내는 응원 메시지를 한곳에서 이용하세요.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <TalkCenter units={units} faqs={faqs} initialUnit={unit} initialTab={tab} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div className="card card-pad">
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>이럴 땐 이렇게 해 주세요</h2>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>상황</th><th>이용 방법</th><th>답변</th></tr></thead>
                <tbody>
                  {SITUATIONS.map((s) => (
                    <tr key={s.situation}>
                      <td style={{ fontWeight: 700 }}>{s.situation}</td>
                      <td>{s.parent}<div className="hint">{s.unit}</div></td>
                      <td style={{ whiteSpace: "nowrap", fontWeight: 700, color: s.target === "즉시" ? "var(--danger)" : "var(--green-800)" }}>{s.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card card-pad">
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>정기 소통 프로그램</h2>
            <ul className="list">
              {PROGRAMS.map((p) => (
                <li key={p.name} style={{ alignItems: "start" }}>
                  <span className="status status-답변" style={{ flex: "0 0 auto", minWidth: 86, textAlign: "center" }}>{p.cycle}</span>
                  <div>
                    <b>{p.name}</b>
                    <div className="small muted">{p.content} · {p.channel}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
