import AdminPanel from "@/components/AdminPanel";
import { getPendingActivities } from "@/lib/repository";

export const metadata = { title: "관리자" };

export default async function AdminPage() {
  const pending = await getPendingActivities();
  return (
    <>
      <section className="page-hero" style={{ background: "#14291d" }}>
        <div className="container">
          <div className="eyebrow">관리자</div>
          <h1>게시 승인 · 운영 현황</h1>
          <p>작성 → 보안 검토 → 승인 → 게시. 승인과 동시에 해당 근무대 부모님께 알림이 발송됩니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <AdminPanel pending={pending} />
        </div>
      </section>
    </>
  );
}
