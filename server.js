const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const folderPath = path.join(__dirname, "content/Celsius-to-Fahrenheit.csv");

fs.createReadStream(folderPath)
  .pipe(csv())
  .on("data", (row) => {
    console.log(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed.");
  });
