import { getPercentColor } from "components/Calendar";

const radius = 48;
const circumference = 2 * Math.PI * radius;

export const getMoodEmoji = (score: number | undefined): string => {
  if (score == null) return "❓";

  if (score <= 0.2) return "😭";       // Molt malament
  if (score <= 0.4)  return "😞";       // Malament
  if (score <= 0.5)  return "😐";       // Així així
  if (score <= 0.6)  return "🙂";       // Bé
  if (score <= 0.8) return "😄";       // Molt bé
  return "🤩";                         // Eufòric
};


export default function BatteryIndicator({ percent }: { percent: number }) {
  if (!percent && percent !== 0) return null
  const offset = circumference * (1 - percent);

  return (
    <div className="w-full max-w-screen mx-auto">
      <svg
        viewBox="0 0 120 120"
        className="w-[60%] h-auto max-w-[400px] mx-auto block transform"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fondo */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#f0ebe5"
          strokeWidth="3"
          fill="none"
        />
        {/* Porción */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={getPercentColor(percent).hex}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          transform="rotate(-90 60 60)"
          dominantBaseline="middle"
          textAnchor="middle"
        />
        {/* Texto central */}
        <text
          x="60"
          y="73"
          textAnchor="middle"
          fontSize="36"
          fontWeight="300"
          fill="#7a674f"
          fontFamily="PT Serif, sans-serif"
          className="select-none"
        >
          {getMoodEmoji(percent)}
        </text>
      </svg>
    </div>
  );
}
