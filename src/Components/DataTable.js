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
    margin:'5px 5px 50px',
  }

  const format = t => { 
    return new Date(t).toLocaleTimeString() 
  }

  const data = [
    ["Nest", "Startas", "Pabaiga", "Trukmė", "Programa", "Sutr.", "Failo tipas"],
      ...items.map(item => 
        [ item.machine, format(item.start), format(item.end), item.duration, item.name, item.failed, item.type ]),
  ]

  function handleSave() {
    console.log('download file')
    let content = "Nestingas;Startas;Pabaiga;Programa;Sutrikimai;Programos tipas\n"
    let link = document.createElement('a')
    items.forEach(item => content += `${item.machine};${item.start};${item.end};${item.name};${item.failed};${item.type}\n` )
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
      <div className="material-symbols-sharp action-button" onClick={handleSave}>save</div>
      <Chart
        chartType="Table"
        data={data}
        options={options}
        style={style}
      />
    </>

  );
}
