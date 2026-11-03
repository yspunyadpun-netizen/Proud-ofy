import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { shortDate } from "@/lib/dates";

export default function WeightChart({ logs, target }) {
  const data = [...logs]
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-30)
    .map((log) => ({ date: shortDate(log.date), weight: Number(log.weight) }));

  const weights = data.map((d) => d.weight).filter((w) => w > 0);
  const min = Math.min(...weights, target || Infinity);
  const max = Math.max(...weights, target || 0);
  const pad = Math.max(1, (max - min) * 0.25);

  return (
    <div className="h-56 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDF1EE" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA9A1" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[Math.floor(min - pad), Math.ceil(max + pad)]}
            tick={{ fontSize: 10, fill: "#9CA9A1" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #E8EFEA",
              fontSize: 12,
              fontFamily: "Almarai, sans-serif",
            }}
            formatter={(value) => [`${value} كجم`, "الوزن"]}
          />
          {target ? <ReferenceLine y={target} stroke="#0F9D58" strokeDasharray="4 4" strokeOpacity={0.5} /> : null}
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#0F9D58"
            strokeWidth={2.6}
            dot={{ r: 3, fill: "#0F9D58", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}