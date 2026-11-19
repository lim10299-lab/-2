"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  { href: "/units", label: "부대소개" },
  { href: "/activities", label: "주요활동" },
  { href: "/talk", label: "소통마당" },
  { href: "/schedule", label: "일정" },
  { href: "/resources", label: "자료실" },
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="홈으로">
          <span className="brand-mark">3사</span>
          <span>
            가족소통마당
            <small>육군3사관학교 근무지원단</small>
          </span>
        </Link>
        <nav className="nav" aria-label="주 메뉴">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={path.startsWith(n.href) ? "active" : ""}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/my" className="btn btn-light">내 정보</Link>
        </div>
      </div>
    </header>
  );
}
