import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import "./Chart.css"

export default function Chart({ data }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Sélectionnez un actif pour afficher le graphe</div>
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#555", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#222" }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#555", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(v) => `${v.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: "#888", marginBottom: 4 }}
            itemStyle={{ color: "#6366f1" }}
            formatter={(value) => [`${value.toLocaleString()}`, "Clôture"]}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#6366f1"
            dot={false}
            strokeWidth={2}
            activeDot={{ r: 4, fill: "#6366f1" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
