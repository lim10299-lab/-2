import ScheduleView from "@/components/ScheduleView";
import { getEvents } from "@/lib/repository";

export const metadata = { title: "일정" };
export const revalidate = 3600; // '오늘' 표시가 매시간 갱신되도록

export default async function SchedulePage() {
  const events = await getEvents();
  // 서버 기준 오늘 날짜(한국 시간)
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">일정</div>
          <h1>행사·면회·전역 일정</h1>
          <p>가족이 함께할 수 있는 공개 일정만 안내합니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ScheduleView events={events} today={today} />
        </div>
      </section>
    </>
  );
}
