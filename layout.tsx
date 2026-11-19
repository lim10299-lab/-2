import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabBar from "@/components/TabBar";
import { SITE } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: `${SITE.org} 7개 근무대와 부모님이 함께하는 소통 공간`,
  robots: { index: false, follow: false }, // 폐쇄형 사이트: 검색 노출 차단
};

export const viewport: Viewport = { themeColor: "#1f3d2b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        {!isSupabaseConfigured && (
          <div className="demo-banner">시연용 화면입니다 · 예시 데이터로 표시되며, 입력한 내용은 이 브라우저에만 저장됩니다</div>
        )}
        <Header />
        <main>{children}</main>
        <Footer />
        <TabBar />
      </body>
    </html>
  );
}
