import React from 'react'
import { Chart } from "react-google-charts"

export default function PieChart({ machine, items }) {
  
  const colors = [ "#3366CC", "#FF9900", "#109618", "#990099", "#DC3912", "#DDD" ]
  const options = { legend: "none", title: "Nestingas #" + machine, colors }
  const style = { display:'inline-block', margin:'5px' }

  const filter = (item, type) => item.machine === machine && item.type === type && item.status !== "1"
  const duration = (total, item) => Math.round(total + item.duration)

  const data = [
    ["Programa", "Valandos"],
    ["Gamyba",  items.filter(item => filter(item, "Gamyba")).reduce(duration, 0)],
    ["Pagalbinės", items.filter(item => filter(item, "Pagalbinė")).reduce(duration, 0)],
    ["II darbas", items.filter(item => filter(item, "II darbas")).reduce(duration, 0)],
    ["Kiti darbai", items.filter(item => filter(item, "Kiti darbai")).reduce(duration, 0)],
    ["Brokas", items.filter(item => filter(item, "Brokas")).reduce(duration, 0)],
    ["Prastova", items.filter(item => filter(item, "Idle time")).reduce(duration, 0)],
  ]

  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      style={style}
      width={"307px"}
      height={"280px"}
    />
  )
}
