import React from 'react'
import { Chart } from "react-google-charts"

export default function PieChart({ machine, items }) {
  
  const options = { legend: "none", title: "Nestingas #" + machine }
  const style = { display:'inline-block', margin:'5px' }

  const data = [
    ["Programa", "Valandos"],
    ["Gamyba", items.filter(item => item.machine === machine && item.type === "Gamyba").length],
    ["Pagalbinės", items.filter(item => item.machine === machine && item.type === "Pagalbinė").length],
    ["II darbas", items.filter(item => item.machine === machine && item.type === "II darbas").length],
    ["Brokas", items.filter(item => item.machine === machine && item.type === "Brokas").length],
    ["Kitos", items.filter(item => item.machine === machine && item.type === "Kiti").length],
    ["Prastova", 0],
  ]

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      style={style}
      width={"300px"}
      height={"280px"}
    />
  )
}
