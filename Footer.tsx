import Link from "next/link";
import { SITE } from "@/lib/mock-data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <strong>{SITE.name}</strong>
          <div>{SITE.org} · {SITE.mission}</div>
          <div style={{ marginTop: 6 }}>긴급 상황은 사이트가 아닌 {SITE.phone}로 연락해 주세요.</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Link href="/resources">개인정보 처리방침</Link>
          <Link href="/resources">이용 수칙</Link>
          <Link href="/admin">관리자</Link>
        </div>
      </div>
    </footer>
  );
}
