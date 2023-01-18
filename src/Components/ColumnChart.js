import React from 'react'
import { Chart } from "react-google-charts"

const style = { padding:"5px" }
const blue_color = "color:rgb(51, 102, 204)"

const options = {
  legend: "none", 
  title: "Realaus laiko rezultatai lapais",
  vAxis: { viewWindow: { min: 0, max: 16 }, ticks: [0, 2, 4, 6, 8, 10, 12, 14, 16] }
}

export default function ColumnChart({ items }) {

  const machines = [...new Set(items.map(item => item.machine))]
  const header =  [["Nestingas", "Lapai", { role: 'annotation' }, { role: "style" }]]
  const rows = machines.map( machine => [
    "Nestingas #" + machine, 
    items.filter(item => item.machine === machine && item.type === "Gamyba").length, 
    items.filter(item => item.machine === machine && item.type === "Gamyba").length, 
    blue_color
  ])

  const data = [...header, ...rows]
  console.log(data.length, data)

  return (
    <Chart chartType="ColumnChart" width="920px" height="400px" data={data} options={options} style={style} />
  )
}
