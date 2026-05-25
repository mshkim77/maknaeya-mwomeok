"use client";

interface SpinButtonProps {
  onSpin: () => void;
  isSpinning: boolean;
  disabled?: boolean;
}

export default function SpinButton({ onSpin, isSpinning, disabled }: SpinButtonProps) {
  const inactive = disabled && !isSpinning;

  return (
    <div className="relative flex items-center justify-center">
      {!isSpinning && !inactive && (
        <>
          <div className="absolute w-36 h-36 rounded-full opacity-20 animate-pulse-ring"
            style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }} />
          <div className="absolute w-28 h-28 rounded-full opacity-20 animate-pulse-ring"
            style={{ background: "radial-gradient(circle, #06B6D4, transparent)", animationDelay: "0.7s" }} />
        </>
      )}

      <button
        onClick={onSpin}
        disabled={isSpinning || disabled}
        className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-200
          ${inactive
            ? "bg-[#1E293B] text-[#475569] cursor-not-allowed border border-white/6"
            : isSpinning
              ? "scale-95 opacity-90 cursor-not-allowed"
              : "btn-primary hover:scale-105"
          }`}
        style={isSpinning ? { background: "linear-gradient(135deg, #4F46E5, #06B6D4)", color: "white" } : {}}
      >
        <span className={`text-3xl transition-transform duration-300 ${isSpinning ? "animate-spin" : ""}`}>
          🎲
        </span>
        <span className="text-xs font-bold">
          {isSpinning ? "고르는중..." : inactive ? "선택해주세요" : "랜덤 추천"}
        </span>
      </button>
    </div>
  );
}
