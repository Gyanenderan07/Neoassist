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
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        No data to visualize
      </div>
    );
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

  // Warm studio palette for doughnut & bar charts
  const colors = [
    "#C85A32", // Terracotta
    "#2D5A46", // Sage
    "#D4A373", // Sand
    "#9C6B38", // Ochre
    "#E0534C", // Coral
    "#6B665E", // Slate Taupe
    "#B85028", // Deep Terracotta
    "#3E735B"  // Deep Sage
  ];

  const chartData = {
    labels: labels.slice(0, 15),
    datasets: [
      {
        label: activeValue ? activeValue.replace(/_/g, " ").toUpperCase() : "VALUE",
        data: values.slice(0, 15),
        backgroundColor: chartType === "doughnut" ? colors : "rgba(200, 90, 50, 0.8)",
        borderColor: chartType === "doughnut" ? "#FFFFFF" : "rgba(200, 90, 50, 1)",
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
          font: { family: "'Urbanist', sans-serif", size: 12, weight: 700 },
          color: "#1F1D1A"
        }
      },
      tooltip: {
        backgroundColor: "#1F1D1A",
        titleFont: { family: "'Urbanist', sans-serif", size: 13, weight: 700 },
        bodyFont: { family: "'Urbanist', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: chartType === "doughnut" ? {} : {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Urbanist', sans-serif", weight: 600 }, color: "#6B665E" }
      },
      y: {
        grid: { color: "rgba(44, 38, 29, 0.06)" },
        ticks: { font: { family: "'Urbanist', sans-serif", weight: 600 }, color: "#6B665E" }
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
