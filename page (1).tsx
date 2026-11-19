import MySettings from "@/components/MySettings";
import { getUnits } from "@/lib/repository";

export const metadata = { title: "내 정보" };

export default async function MyPage() {
  const units = await getUnits();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow">내 정보</div>
          <h1>알림과 관심 근무대 설정</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <MySettings units={units} />
        </div>
      </section>
    </>
  );
}
