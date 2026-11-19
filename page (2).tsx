import Link from "next/link";
import { notFound } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import { getActivities, getUnit, getUnits } from "@/lib/repository";

export async function generateStaticParams() {
  const units = await getUnits();
  return units.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const unit = await getUnit((await params).slug);
  return { title: unit?.name ?? "근무대" };
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = await getUnit(slug);
  if (!unit) notFound();
  const activities = await getActivities({ unit: unit.slug, limit: 3 });

  return (
    <>
      <section className="page-hero" style={{ background: `linear-gradient(160deg, ${unit.color}, #14291d)` }}>
        <div className="container">
          <Link href="/units" className="small" style={{ opacity: 0.8 }}>← 부대소개</Link>
          <h1>{unit.name}</h1>
          <p>{unit.tagline}</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div className="grid">
            <div className="card card-pad">
              <h2 style={{ fontSize: 20, marginBottom: 10 }}>생도 교육 지원 임무</h2>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {unit.missions.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
            <div className="card card-pad">
              <h2 style={{ fontSize: 20, marginBottom: 10 }}>이런 소식을 전해 드려요</h2>
              <p style={{ margin: "0 0 8px" }}><b>고정 코너</b> · {unit.corner}</p>
              <div className="chips">
                {unit.examples.map((e) => <span key={e} className="chip" style={{ cursor: "default" }}>{e}</span>)}
              </div>
              <p className="hint" style={{ marginTop: 12, marginBottom: 0 }}>보안 안내: {unit.caution}</p>
            </div>
            <div className="card card-pad">
              <h2 style={{ fontSize: 20, marginBottom: 6 }}>{unit.name}장 인사말</h2>
              <p className="muted" style={{ margin: 0 }}>
                부모님, 반갑습니다. 자녀들이 맡은 임무를 잘 해낼 수 있도록 곁에서 돕겠습니다. 매주 활동 소식을 전해 드리고,
                궁금한 점은 소통마당에서 언제든 답해 드리겠습니다. <span className="small">(예시 문구)</span>
              </p>
            </div>
          </div>
          <div className="card card-pad">
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>우리 부대의 하루</h2>
            <ol className="timeline">
              {unit.dailySchedule.map((s) => (
                <li key={s.time}><time>{s.time}</time><span>{s.label}</span></li>
              ))}
            </ol>
            <p className="hint" style={{ marginBottom: 0 }}>일과는 훈련·행사에 따라 달라질 수 있습니다.</p>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              <Link href={`/talk?unit=${unit.slug}`} className="btn btn-primary">{unit.name} 소통방</Link>
              <Link href={`/talk?unit=${unit.slug}&tab=inquiry`} className="btn btn-ghost">1:1 문의</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>{unit.name} 최근 활동</h2>
            <Link href="/activities">전체 활동 →</Link>
          </div>
          {activities.length ? (
            <div className="grid grid-3">{activities.map((a) => <ActivityCard key={a.id} a={a} />)}</div>
          ) : (
            <div className="empty">아직 올라온 활동이 없습니다.</div>
          )}
        </div>
      </section>
    </>
  );
}
