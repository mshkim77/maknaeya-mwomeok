import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "막내야뭐먹 - 오늘 점심 메뉴 추천",
  description: "맨날 막내한테 묻지 말고! 위치 기반 주변 식당 랜덤 추천 서비스",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-orange-50 font-[family-name:var(--font-noto-sans-kr)]">
        {children}
      </body>
    </html>
  );
}
