import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from "recharts";

export default function CaloriesChart({ data, target }) {
  return (
    <div className="h-52 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDF1EE" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9CA9A1" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9CA9A1" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            cursor={{ fill: "rgba(15,157,88,0.05)" }}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid #E8EFEA",
              fontSize: 12,
              fontFamily: "Almarai, sans-serif",
            }}
            formatter={(value) => [`${value} سعرة`, "المستهلك"]}
          />
          {target ? <ReferenceLine y={target} stroke="#0F9D58" strokeDasharray="4 4" strokeOpacity={0.6} /> : null}
          <Bar dataKey="calories" radius={[8, 8, 0, 0]} maxBarSize={34}>
            {data.map((entry) => (
              <Cell key={entry.date} fill={entry.calories > target ? "#E4A11B" : "#0F9D58"} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}