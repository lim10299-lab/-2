import Link from "next/link";
import { getUnits } from "@/lib/repository";
import { SITE } from "@/lib/mock-data";

export const metadata = { title: "부대소개" };

export default async function UnitsPage() {
  const units = await getUnits();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">부대소개</div>
          <h1>{SITE.org}</h1>
          <p>{SITE.mission}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="card card-pad" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>지원단장 인사말</h2>
            <p className="muted" style={{ margin: 0 }}>
              소중한 자녀를 보내 주신 부모님께 감사드립니다. 우리 근무지원단 장병들은 생도들이 마음껏 배우고 훈련할 수 있도록
              보이지 않는 곳에서 묵묵히 일하고 있습니다. 이 공간에서 자녀들의 땀과 성장을 함께 지켜봐 주십시오.
              <br />
              <span className="small">(인사말은 예시 문구입니다)</span>
            </p>
          </div>
          <div className="table-wrap card">
            <table className="table">
              <thead>
                <tr><th>근무대</th><th>한 줄 소개</th><th>생도 교육 지원 임무</th><th></th></tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.slug}>
                    <td style={{ fontWeight: 800, color: u.color, whiteSpace: "nowrap" }}>{u.name}</td>
                    <td>{u.tagline}</td>
                    <td>{u.missions.join(", ")}</td>
                    <td><Link href={`/units/${u.slug}`} className="btn btn-ghost btn-sm">자세히</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 style={{ fontSize: 22, margin: "36px 0 14px" }}>장병 생활 안내</h2>
          <div className="grid grid-4">
            {[
              ["생활관", "근무대별 생활관에서 생활하며, 일과 후에는 개인 정비와 자기계발 시간을 가집니다."],
              ["급식", "보급대가 매일 급식을 지원하며, 주 1회 특식을 제공합니다."],
              ["의료", "의무대대에서 진료받을 수 있으며, 필요하면 상급 병원으로 연계합니다."],
              ["휴가·면회", "제도와 일정은 자료실과 '자주 묻는 질문'에서 확인할 수 있습니다."],
            ].map(([t, d]) => (
              <div key={t} className="card card-pad">
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{t}</h3>
                <p className="muted small" style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
