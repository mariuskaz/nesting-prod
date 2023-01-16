import React from 'react'
import { Chart } from "react-google-charts"

export const data = [
    ["Task", "Hours per Day"],
    ["Gamyba", 11],
    ["Pagalbinės", 2],
    ["II darbas", 2],
    ["Brokas", 2],
    ["Prastova", 7],
];

export const options = {
    title: "My Daily Activities",
};

export default function PieChart() {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      style={{ display:'inline-block', margin:'10px'}}
      width={"400px"}
      height={"300px"}
    />
  )
}
