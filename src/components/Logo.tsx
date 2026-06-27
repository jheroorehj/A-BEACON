/**
 * A-BEACON 공용 로고 컴포넌트
 * 사이트 전체에서 동일한 색상 스타일을 보장합니다.
 * O → #ff385c, 나머지 → #222222, ● 점 → #ff385c
 */

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** 로고 뒤 ● 점 표시 여부 (기본 true) */
  showDot?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_CLASS: Record<string, string> = {
  xs: "text-sm  tracking-widest",
  sm: "text-base tracking-widest",
  md: "text-xl  tracking-widest",
  lg: "text-2xl tracking-widest",
  xl: "text-4xl tracking-wider",
};

export function Logo({ size = "md", showDot = true, className = "", onClick }: LogoProps) {
  return (
    <span
      className={`font-black text-[#222222] inline-flex items-center ${SIZE_CLASS[size]} ${onClick ? "cursor-pointer select-none" : ""} ${className}`}
      onClick={onClick}
    >
      A-BEAC<span className="text-[#ff385c]">O</span>N
      {showDot && (
        <span className="text-[#ff385c] ml-[0.3em] text-[0.45em] leading-none">●</span>
      )}
    </span>
  );
}
