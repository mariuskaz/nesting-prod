import React from "react";
import { Chart } from "react-google-charts";

const options = {
  title: "Programos",
  curveType: "function",
  legend: { position: "bottom" },
  pageSize: 6,
  width:'920px',
  showRowNumber: false,
}

const style= {
    margin:'5px'
}

export default function TableChart({data}) {
  return (
    <Chart
      chartType="Table"
      data={data}
      options={options}
      style={style}
    />
  );
}
