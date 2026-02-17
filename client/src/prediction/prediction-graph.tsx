import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { GraphUnit } from "./prediction-types";

interface LocalParams {
  data: GraphUnit[];
}

const accent = "#f59e42"; // amber-500
const glassBg = "rgba(255,255,255,0.7)";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl shadow-lg px-4 py-2 bg-white/90 border border-amber-200">
        <div className="font-semibold text-amber-600">{label}</div>
        <div className="text-gray-700">Продажі: <span className="font-bold">{payload[0].value}</span></div>
      </div>
    );
  }
  return null;
};

const PredictionGraph = ({ data }: LocalParams) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-amber-100">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#f3e8ff" />
          <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#a78bfa" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 13, fill: "#a78bfa" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f59e4222" }} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: 8, color: accent, fontWeight: 600, fontSize: 15 }} formatter={() => "Кількість продажів"} />
          <Line
            type="monotone"
            dataKey="uv"
            name="Кількість продажів"
            stroke={accent}
            strokeWidth={3}
            dot={{ r: 5, fill: accent, stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 7, fill: accent, stroke: "#fff", strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionGraph;
