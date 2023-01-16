import React from "react";
import { Chart } from "react-google-charts";

const color = "color:rgb(51, 102, 204)"

export const options = {
  title: "Realaus laiko rezultatai",
  //vAxis: { title: "Lapai", viewWindow: { min: 0, max: 16 } },
  legend: "none"
};

export const data = [
  ["Element", "Lapai", { role: "style" }],
  ["Nestingas #1", 12, color],
  ["Nestingas #2", 5, color], 
  ["Nestingas #3", 10, color],
];

export default function App() {
  return (
    <Chart chartType="ColumnChart" width="800px" height="400px" data={data} options={options} />
  );
}
