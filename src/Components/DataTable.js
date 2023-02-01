import React from "react";
import { Chart } from "react-google-charts";

export default function DataTable({ title, items }) {

  const cssClassNames = { 
    headerRow:'table-header' 
  }

  const options = {
    allowHtml: true,  
    title: "Programos", 
    width:'940px', 
    sortColumn: 0,
    cssClassNames,
  }

  const style= { 
    margin:'2px 5px 50px',
  }

  const time = t => { 
    return new Date(t).toLocaleTimeString("lt-LT") 
  }

  const format = d => {
    return new Date(d * 60 * 1000).toISOString().substring(11, 11 + 8);
  }

  const data = [
    ["Nest.", "Startas", "Pabaiga", "Trukmė", "Programos pavadinimas", "Programos tipas", "Medžiaga"],
      ...items.map(item => [ 
        item.machine, 
        time(item.start), 
        time(item.end), 
        format(item.duration), 
        item.name.substring(item.name.lastIndexOf('\\') + 1), 
        //item.failed, 
        item.type, 
        item.material 
      ]),
  ]

  function handleSave() {
    console.log('download file')
    let content = "Nestingas;Startas;Pabaiga;Trukmė;Programa;Programos tipas;Medžiaga\n"
    let link = document.createElement('a')
    items.forEach(item => content += `${item.machine};${time(item.start)};${time(item.end)};${format(item.duration)};${item.name};${item.type};${item.material}\n` )
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
      <div className="header">{title.toUpperCase()}<span className="label">{items.length}</span></div>
      <Chart
        chartType="Table"
        data={data}
        options={options}
        style={style}
      />
    </>
  );
}
