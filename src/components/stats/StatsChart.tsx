
import React from "react";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from "recharts";
import { format } from "date-fns";

interface ChartProps {
  type: "bar" | "line" | "pie";
  data: any[];
  xKey: string;
  yKey: string;
  height?: number;
}

export const StatsChart: React.FC<ChartProps> = ({
  type,
  data,
  xKey,
  yKey,
  height = 300,
}) => {
  const colors = [
    "#9b87f5", // neuro-purple
    "#7E69AB", // neuro-dark-purple
    "#D6BCFA", // neuro-light-purple
    "#F2FCE2", // neuro-soft-green
    "#FEF7CD", // neuro-soft-yellow
    "#FEC6A1", // neuro-soft-orange
    "#E5DEFF", // neuro-soft-purple
    "#FFDEE2", // neuro-soft-pink
    "#D3E4FD"  // neuro-soft-blue
  ];
  
  const formatXAxis = (value: any) => {
    if (value instanceof Date) {
      return format(value, "EEE");
    }
    if (typeof value === "number" && value > 1000000000) {
      return format(new Date(value), "EEE");
    }
    return value;
  };
  
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>;
  }
  
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={xKey} 
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12, fill: "#888888" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#888888" }}
                allowDecimals={false}
              />
              <Tooltip 
                formatter={(value: any) => [`${value} cards`, "Reviewed"]}
                labelFormatter={(label: any) => {
                  if (label instanceof Date) {
                    return format(label, "EEEE, MMM d");
                  }
                  if (typeof label === "number" && label > 1000000000) {
                    return format(new Date(label), "EEEE, MMM d");
                  }
                  return label;
                }}
              />
              <Bar dataKey={yKey} fill="#9b87f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                dataKey={yKey}
                nameKey={xKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, "Accuracy"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={xKey} 
                tickFormatter={formatXAxis} 
                tick={{ fontSize: 12, fill: "#888888" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "#888888" }} />
              <Tooltip />
              <Line type="monotone" dataKey={yKey} stroke="#9b87f5" strokeWidth={2} dot={{ stroke: "#9b87f5", strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return renderChart();
};
