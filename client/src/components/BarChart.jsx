import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ poll, style }) => {
  const options = {
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        color: "white",
      },
    },
  };

  const labels = poll.options.map((option) => option.optionName);

  const data = {
    labels,
    datasets: [
      {
        label: "Vote",
        data: poll.options.map((option) => option.count),
        backgroundColor: "rgba(54, 162, 235, 0.4)",
      },
    ],
  };

  return (
    <div className={`${style}`}>
      <Bar options={options} data={data} width={400} height={400} />
    </div>
  );
};

export default BarChart;
