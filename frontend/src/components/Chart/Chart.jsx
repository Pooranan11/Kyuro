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

function formatDate(dateStr, period) {
  const d = new Date(dateStr)
  if (period === "5d") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }
  if (period === "1mo") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }
  if (period === "1y") {
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function Chart({ data, period = "1y" }) {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Select an asset to display the chart</div>
  }

  const tickInterval = Math.max(0, Math.floor(data.length / 6) - 1)

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
            interval={tickInterval}
            tickFormatter={(v) => formatDate(v, period)}
          />
          <YAxis
            tick={{ fill: "#555", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={(v) => `$${v.toLocaleString("en-US")}`}
            domain={["auto", "auto"]}
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
            formatter={(value) => [`$${value.toLocaleString("en-US")}`, "Close"]}
            labelFormatter={(label) => formatDate(label, period)}
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
