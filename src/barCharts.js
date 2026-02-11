import { dashboardUI } from "./ui";
export default function displayProfChartsBar(data, label) {
  const formattedLabels = label.map((name) => name.split(" "));
  console.log("ffffffffffffff");
  new Chart(dashboardUI.profCharsBarCanvas, {
    type: "bar",
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: "",
          data: data,
          backgroundColor: "#7c3aed",
          borderColor: "#6d28d9",
          borderWidth: 1,
          barPercentage: 1, // Makes bars thinner (0.1 to 1)
          categoryPercentage: 0.6, // Space between bars (0.1 to 1)
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // This hides the entire legend box
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 10, // Font size for Y-axis numbers
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 10, // Font size for X-axis labels
            },
          },
        },
      },
    },
  });
}
