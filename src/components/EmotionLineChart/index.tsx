import { getMoodEmoji } from "components/BatteryIndicator";
import dayjs from "dayjs";
import type { Dashboard } from "pages/dashboard";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area } from "recharts";

export const EmotionLineChart = ({ dashboard}: { dashboard: Dashboard }) => {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart
        data={Object.keys(dashboard.percents).map((key) => ({
          date: key,
          percent: dashboard.percents[key],
        }))}
        style={{ pointerEvents: 'none' }}
        margin={{ top: 20, right: 30, left: -40, bottom: 0 }}
      >
        <XAxis
          dataKey="date"
          tickFormatter={(d) => dayjs(d).format("dd D")}
          tick={{ fill: "#64748b", fontSize: 12 }}
          axisLine={true}
          tickLine={false}
        />

        <YAxis
          domain={[0, 1]}
          tick={false}
          tickLine={false}
          axisLine={true}
        />
        <Line
          type="monotone"
          dataKey="percent"
          stroke="#dbeafe"
          strokeWidth={3}
          connectNulls={true}
          dot={({ cx, cy, payload }) => (
           <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={24}
          >
            {(!payload.percent && payload.percent !== 0) ? "" : getMoodEmoji(payload.percent)}
          </text>
          )}
        />

        <defs>
          <linearGradient id="colorPercent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="percent"
          stroke=""
          fill="url(#colorPercent)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}