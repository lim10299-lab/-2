"use client";
// 모바일 하단 탭: 부모님이 한 손으로 쓰기 쉽도록 핵심 메뉴 5개만 둡니다.
import Link from "next/link";
import { usePathname } from "next/navigation";

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const TABS = [
  { href: "/", label: "홈", d: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/activities", label: "주요활동", d: "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4" },
  { href: "/talk", label: "소통마당", d: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" },
  { href: "/schedule", label: "일정", d: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { href: "/my", label: "내 정보", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
];

export default function TabBar() {
  const path = usePathname();
  return (
    <nav className="tabbar" aria-label="하단 메뉴">
      {TABS.map((t) => {
        const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={active ? "active" : ""}>
            {icon(t.d)}
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
