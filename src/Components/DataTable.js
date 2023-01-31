import React from "react";
import { Chart } from "react-google-charts";

export default function DataTable({ items }) {

  const cssClassNames = { 
    headerRow:'table-header' 
  }

  const options = {
    allowHtml: true,  
    title: "Programos", 
    width:'920px', 
    /* pageSize: 40, */
    sortColumn: 0,
    cssClassNames,
  }

  const style= { 
    margin:'10px 5px 2px',
  }

  const time = t => { 
    return new Date(t).toLocaleTimeString("lt-LT") 
  }

  const format = d => {
    return new Date(d * 60 * 1000).toISOString().substring(11, 11 + 8);
  }

  const data = [
    ["Nest", "Startas", "Pabaiga", "Trukmė", "Programa", "Sutr.", "Programos tipas"],
      ...items.map(item => 
        [ item.machine, time(item.start), time(item.end), format(item.duration), item.name, item.failed, item.type ]),
  ]

  function handleSave() {
    console.log('download file')
    let content = "Nestingas;Startas;Pabaiga;Trukmė;Programa;Sutrikimai;Programos tipas\n"
    let link = document.createElement('a')
    items.forEach(item => content += `${item.machine};${time(item.start)};${time(item.end)};${format(item.duration)};${item.name};${item.failed};${item.type}\n` )
    let bom = new Uint8Array([0xEF, 0xBB, 0xBF]) // UTF-8 BOM
    let blob = new Blob([bom, content], {type: 'text/html'})
    link.style.display = 'none'
    document.body.appendChild(link)
    link.href = URL.createObjectURL(blob)
    link.download = "results.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <>
      <Chart
        chartType="Table"
        data={data}
        options={options}
        style={style}
      />
      <button 
        className="simple-button" 
        onClick={handleSave}
      >Excel</button>
    </>

  );
}
