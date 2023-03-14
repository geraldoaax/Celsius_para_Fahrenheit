const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const Chart = require("chart.js");
const path = require("path");

const app = express();

const folderPath = path.join(__dirname, "content/Celsius-to-Fahrenheit.csv");

const COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

// Load the CSV data
const data = [];
fs.createReadStream(folderPath)
  .pipe(csv())
  .on("data", (row) => {
    data.push(row);
  })
  .on("end", () => {
    console.log(data);
  });

// Serve the web page with the chart
app.get("/", (req, res) => {
  const chartData = {
    labels: data.map((row) => row.Celsius),
    datasets: [
      {
        label: "Temperature",
        data: data.map((row) => row.Fahrenheit),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const chartConfig = {
    type: "scatter",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Celsius_para_Fahrenheit",
        },
      },
      scales: {
        y: {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          position: "left",
          ticks: {
            color: "#f67019",
          },
        },
        y2: {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          position: "right",
          reverse: true,
          ticks: {
            color: "#4dc9f6",
          },
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      },
    },
  };

  const chartHTML = `
    <html>
      <head>
        <title>Chart.js Example</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <canvas id="chart"></canvas>
        <script>
          const chartConfig = ${JSON.stringify(chartConfig)};
          new Chart(document.getElementById('chart'), chartConfig);
        </script>
      </body>
    </html>
  `;

  res.send(chartHTML);
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
