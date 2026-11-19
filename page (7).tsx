import LoginForm from "@/components/LoginForm";
import { getUnits } from "@/lib/repository";

export const metadata = { title: "로그인" };

export default async function LoginPage() {
  const units = await getUnits();
  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="eyebrow">가족 전용 공간</div>
          <h1 style={{ fontSize: 28 }}>가족소통마당 로그인</h1>
          <p className="muted">가족 관계가 확인된 부모님만 이용할 수 있습니다.</p>
        </div>
        <LoginForm units={units} />
      </div>
    </section>
  );
}
