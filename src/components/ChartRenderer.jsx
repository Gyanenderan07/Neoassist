import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const ChartRenderer = ({ data, chartType, labelKey, valueKey }) => {
  if (!data || data.length === 0) {
    return <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>No data to visualize</div>;
  }

  // Detect keys automatically if not provided
  const keys = Object.keys(data[0]);
  let activeLabel = labelKey && keys.includes(labelKey) ? labelKey : keys[0];
  let activeValue = valueKey && keys.includes(valueKey) ? valueKey : null;

  if (!activeValue) {
    // Look for a numeric column
    activeValue = keys.find(k => typeof data[0][k] === "number") || keys[1] || keys[0];
  }

  const labels = data.map(item => String(item[activeLabel] ?? ""));
  const values = data.map(item => Number(item[activeValue]) || 0);

  const colors = [
    "rgba(37, 99, 235, 0.8)",
    "rgba(14, 165, 233, 0.8)",
    "rgba(168, 85, 247, 0.8)",
    "rgba(245, 158, 11, 0.8)",
    "rgba(16, 185, 129, 0.8)",
    "rgba(244, 63, 94, 0.8)",
    "rgba(99, 102, 241, 0.8)",
    "rgba(234, 179, 8, 0.8)"
  ];

  const chartData = {
    labels: labels.slice(0, 15),
    datasets: [
      {
        label: activeValue ? activeValue.replace(/_/g, " ").toUpperCase() : "VALUE",
        data: values.slice(0, 15),
        backgroundColor: chartType === "doughnut" ? colors : "rgba(37, 99, 235, 0.75)",
        borderColor: chartType === "doughnut" ? "#ffffff" : "rgba(37, 99, 235, 1)",
        borderWidth: 2,
        borderRadius: 8,
        tension: 0.35,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: chartType === "doughnut" ? "right" : "top",
        labels: {
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: 600 },
          color: "#475569"
        }
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: chartType === "doughnut" ? {} : {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" }, color: "#64748b" }
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" }, color: "#64748b" }
      }
    }
  };

  return (
    <div style={{ height: "340px", width: "100%", position: "relative" }}>
      {chartType === "line" && <Line data={chartData} options={options} />}
      {chartType === "doughnut" && <Doughnut data={chartData} options={options} />}
      {(chartType === "bar" || !chartType || chartType === "none") && <Bar data={chartData} options={options} />}
    </div>
  );
};
