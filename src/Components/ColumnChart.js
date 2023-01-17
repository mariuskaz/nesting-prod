import React from 'react'
import { Chart } from "react-google-charts"

const options = {
  legend: "none",
  title: "Realaus laiko rezultatai lapais",
  vAxis: { 
    viewWindow: { min: 0, max: 16 }, 
    ticks: [0, 2, 4, 6, 8, 10, 12, 14, 16] 
  }
}

const style = {
    padding:"5px"
}

export default function ColumnChart({data}) {
  return (
    <Chart chartType="ColumnChart" width="920px" height="400px" data={data} options={options} style={style} />
  )
}
