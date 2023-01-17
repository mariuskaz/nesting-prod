import React from 'react'
import { Chart } from "react-google-charts"

export default function PieChart({ title, data }) {
  
  const options = {
    legend: "none",
    title: title,
  }

  const style = { 
    display:'inline-block', 
    margin:'5px'
  }

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
