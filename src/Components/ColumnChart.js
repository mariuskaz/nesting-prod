import React from 'react'
import { Chart } from "react-google-charts"

const style = { padding:"0 5px 5px" }
const blue_color = "color:rgb(51, 102, 204)"

export default function ColumnChart({ title, items }) {

  const machines = [1, 2, 3] //[...new Set(items.map(item => item.machine))].sort()
  const sheets = machines.map( machine => items.filter(item => item.machine === machine && item.type === "Gamyba" && item.failed === "0").length)
  const maximum = Math.max(...sheets)
  const qty = sheets.reduce((total, qty) => total + qty, 0)
  
  const options = {

    legend: "none", 
    title: title + " (" + qty + " lap.)",

    vAxis: { 
      format: '0', 
      viewWindow: { 
        min: 0, 
        max: maximum < 15 ? 15 : maximum 
      } 
    },

    animation: {
      duration: 1000,
      easing: "out",
      /* startup: true, */
    },
    
  }
  
  const header =  [["Nestingas", "Lapai", { role: 'annotation' }, { role: "style" }]]
  const rows = machines.map( machine => [
    "Nestingas #" + machine, 
    items.filter(item => item.machine === machine && item.type === "Gamyba" && item.failed === "0").length, 
    items.filter(item => item.machine === machine && item.type === "Gamyba" && item.failed === "0").length + " lapai", 
    blue_color
  ])

  const data = [...header, ...rows]

  return (
    <Chart chartType="ColumnChart" width="940px" height="400px" data={data} options={options} style={style} />
  )
}
