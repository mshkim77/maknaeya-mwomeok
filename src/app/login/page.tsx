import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-orange-200 opacity-30" />
        <div className="absolute -bottom-10 -left-20 w-80 h-80 rounded-full bg-yellow-200 opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors mb-8 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-black text-gray-900">
            막내야뭐먹
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            로그인하고 더 많은 기능을 사용해보세요
          </p>
        </div>

        {/* Login benefits */}
        <div className="card p-5 mb-6 space-y-3">
          <p className="text-sm font-bold text-gray-700">로그인하면 이런게 가능해요!</p>
          {[
            { emoji: "❤️", text: "단골 식당 즐겨찾기 저장" },
            { emoji: "🚫", text: "싫어하는 음식 제외하기" },
            { emoji: "📊", text: "내 점심 기록 통계 보기" },
            { emoji: "👥", text: "팀원들과 투표하기" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Login buttons */}
        <div className="space-y-3">
          {/* Kakao Login */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: "#FEE500", color: "#3C1E1E" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.02944 3 3 6.35888 3 10.5C3 13.1999 4.67419 15.5759 7.20711 16.9283L6.27209 20.3856C6.18994 20.6863 6.5285 20.9235 6.78706 20.7468L10.9282 18.0225C11.2773 18.0745 11.635 18.1015 11.9985 18.1015C16.9706 18.1015 20.9985 14.7441 20.9985 10.6C20.9985 6.45592 16.9706 3 12 3Z" />
            </svg>
            카카오로 시작하기
          </button>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-bold text-sm bg-white border-2 border-gray-200 text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            구글로 시작하기
          </button>

          {/* Guest */}
          <div className="pt-2 text-center">
            <Link
              href="/main"
              className="text-sm text-gray-400 hover:text-orange-500 transition-colors font-medium underline underline-offset-2"
            >
              로그인 없이 둘러보기
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-8">
          로그인 시{" "}
          <span className="underline cursor-pointer hover:text-gray-600">이용약관</span>
          {" "}및{" "}
          <span className="underline cursor-pointer hover:text-gray-600">개인정보처리방침</span>
          에 동의하게 됩니다.
        </p>
      </div>
    </main>
  );
}
