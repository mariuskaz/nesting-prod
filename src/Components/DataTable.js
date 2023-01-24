import React from "react";
import { Chart } from "react-google-charts";

export default function DataTable({ items }) {

  const options = { title: "Programos", width:'920px', allowHtml: true }
  const style= { marginnn:'5px', }

  const data = [
    ["Startas", "Pabaiga", "Trukmė", "Programa", "Tipas"],
    ...items.map(item => [item.start, item.end, item.duration, item.name, item.type]),
  ]

  console.log(data)

  return (
    <>
      <br/>
      <Chart
        chartType="Table"
        data={data}
        options={options}
        style={style}
      />
    </>

  );
}
