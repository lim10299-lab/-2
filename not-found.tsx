import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty">
        <h1 style={{ fontSize: 26, color: "var(--ink)" }}>페이지를 찾을 수 없습니다</h1>
        <p>주소를 다시 확인해 주세요.</p>
        <Link href="/" className="btn btn-primary">홈으로</Link>
      </div>
    </section>
  );
}
