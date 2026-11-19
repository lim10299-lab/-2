import Link from "next/link";
import ActivityCard from "@/components/ActivityCard";
import UnitBadge from "@/components/UnitBadge";
import { getActivities, getEvents, getNotices, getUnits } from "@/lib/repository";
import { SITE } from "@/lib/mock-data";

export default async function Home() {
  const [units, activities, events, notices] = await Promise.all([
    getUnits(),
    getActivities({ limit: 6 }),
    getEvents(),
    getNotices(),
  ]);
  const upcoming = events.filter((e) => e.date >= "2026-11-19").slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="eyebrow">{SITE.org}</div>
          <h1>
            부모님, 자녀의 하루를
            <br />
            함께 보고 이야기하세요
          </h1>
          <p>
            근무지원단 7개 근무대는 생도들의 일반학과·군사학 교육에 필요한 군수 분야를 지원합니다.
            자녀가 어떤 일을 하고, 어떻게 지내는지 매주 전해 드립니다.
          </p>
          <div className="hero-actions">
            <Link href="/activities" className="btn btn-gold">이번 주 활동 보기</Link>
            <Link href="/talk" className="btn btn-light" style={{ height: 44, fontSize: 16 }}>소통마당 들어가기</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">7개 근무대</div>
              <h2>우리 아이의 부대는 무엇을 하나요?</h2>
            </div>
            <Link href="/units">전체 보기 →</Link>
          </div>
          <div className="grid grid-4">
            {units.map((u) => (
              <Link key={u.slug} href={`/units/${u.slug}`} className="card unit-card" style={{ ["--c" as string]: u.color }}>
                <div className="unit-icon">{u.name.slice(0, 1)}</div>
                <h3>{u.name}</h3>
                <p className="muted small" style={{ margin: 0 }}>{u.tagline}</p>
              </Link>
            ))}
            <Link href="/talk" className="card unit-card" style={{ ["--c" as string]: "#b8913a", background: "#fbf6e8" }}>
              <div className="unit-icon">?</div>
              <h3>궁금한 점이 있나요?</h3>
              <p className="muted small" style={{ margin: 0 }}>담당 간부에게 1:1로 물어보세요. 영업일 24시간 안에 답변드립니다.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">주요활동</div>
              <h2>최근 활동 소식</h2>
            </div>
            <Link href="/activities">더 보기 →</Link>
          </div>
          <div className="grid grid-3">
            {activities.map((a) => (
              <ActivityCard key={a.id} a={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid grid-2">
          <div className="card card-pad">
            <div className="section-head" style={{ marginBottom: 6 }}>
              <h2 style={{ fontSize: 20 }}>다가오는 일정</h2>
              <Link href="/schedule">달력 →</Link>
            </div>
            <ul className="list">
              {upcoming.map((e) => {
                const [, m, d] = e.date.split("-").map(Number);
                return (
                  <li key={e.id}>
                    <div className="date-box"><small>{m}월</small><b>{d}</b></div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{e.title}</div>
                      <div className="small muted">{e.time ? `${e.time} · ` : ""}{e.place ?? e.kind}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="card card-pad">
            <div className="section-head" style={{ marginBottom: 6 }}>
              <h2 style={{ fontSize: 20 }}>공지사항</h2>
              <Link href="/resources">자료실 →</Link>
            </div>
            <ul className="list">
              {notices.map((n) => (
                <li key={n.id} style={{ justifyContent: "space-between" }}>
                  <div>
                    {n.pinned && <span className="pin">고정</span>}
                    <span style={{ fontWeight: 600 }}>{n.title}</span>
                  </div>
                  <span className="small muted" style={{ whiteSpace: "nowrap" }}>{n.date.slice(5).replace("-", ".")}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12 }}><UnitBadge unit="all" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
