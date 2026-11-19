import ActivityFeed from "@/components/ActivityFeed";
import { getActivities, getUnits } from "@/lib/repository";

export const metadata = { title: "주요활동" };

export default async function ActivitiesPage() {
  const [activities, units] = await Promise.all([getActivities(), getUnits()]);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">주요활동</div>
          <h1>자녀들의 활동 소식</h1>
          <p>매주 금요일, 근무대별 활동 사진과 소식이 올라옵니다. 모든 게시물은 보안 검토를 거쳐 공개됩니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ActivityFeed activities={activities} units={units} />
        </div>
      </section>
    </>
  );
}
