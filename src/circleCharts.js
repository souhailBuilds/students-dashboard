import { dashboardUI } from "./ui";
let myChart = null;
export default function displayCircleStatusChart(arr, studentArr) {
  if (myChart) {
    myChart.destroy();
  }
  const labels = Object.keys(arr);
  const data = Object.values(arr);
  const paidPercent = Math.floor((arr.paid * 100) / studentArr.length);
  myChart = new Chart(dashboardUI.paidStatusCanvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "",
          data: data,
          borderWidth: 0, // Removes the white border around segments
          hoverBorderWidth: 0, // Prevents border from appearing on hover
          hoverOffset: 4,
        },
      ],
    },
    options: {
      // Note: 'options' should be plural
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom", // Moves legend below the chart
          labels: {
            usePointStyle: true, // Changes box to a circle/dot
            pointStyle: "circle", // Explicitly sets the shape to a dot
            padding: 15, // Adds breathing room around labels
            boxWidth: 6, // Sets the width of the dot
            boxHeight: 6, // Sets the height of the dot
            useBorderRadius: true,

            font: {
              size: 13,
            },
          },
        },
        centerText: {
          display: true,
          text: [`${paidPercent}%`, "Paid"], // Change this to your variable or logic
        },
      },
      // Cutout percentage makes the doughnut thinner/thicker
      cutout: "75%",
    },
    plugins: [
      {
        id: "centerText",
        afterDraw: (chart) => {
          const {
            ctx,
            chartArea: { top, bottom, left, right, width, height },
          } = chart;
          const options = chart.config.options.plugins.centerText;

          ctx.save();
          const textArray = options.text;
          const centerX = left + width / 2;
          const centerY = (top + height + 10) / 2;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // --- LINE 1 (Percentage) ---
          ctx.font = `bold ${(height / 60).toFixed(2)}em sans-serif`;
          ctx.fillStyle = "#fff";
          // To move the lines CLOSER together, decrease these numbers (e.g., -5 and +8)
          // To move the lines FURTHER apart, increase them (e.g., -15 and +20)
          ctx.fillText(textArray[0], centerX, centerY - 10);

          // --- LINE 2 (The word "Paid") ---
          ctx.font = `${(height / 120).toFixed(2)}em sans-serif`;
          ctx.fillStyle = "#888";
          ctx.fillText(textArray[1], centerX, centerY + 12);

          ctx.restore();
        },
      },
    ],
  });
}
