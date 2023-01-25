import React from "react";
import { Chart } from "react-google-charts";

export default function DataTable({ items }) {

  const options = {
    allowHtml: true,  
    title: "Programos", 
    width:'920px', 
    pageSizeee: 30, 
  }

  const style= { 
    margin:'15px 5px', 
  }

  const format = t => { 
    return new Date(t).toLocaleTimeString() 
  }

  const data = [
    ["Nest", "Startas", "Pabaiga", "Trukmė", "Programa", "Sutr.", "Failo tipas"],
      ...items.map(item => 
        [ item.machine, format(item.start), format(item.end), item.duration, item.name, item.failed, item.type ]),
  ]

  return (
    <>
      <Chart
        chartType="Table"
        data={data}
        options={options}
        style={style}
      />
    </>

  );
}
