import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import SelectBox from "./SelectBox";
import TextBox from "./TextBox";
import TimeBox from "./TimeBox";

export default function DataTable({ title, date, items, expand }) {
  const [ expanded, setExpanded ] = useState(expand)
  const [ filteredItems, setFilteredItems ] = useState(items)
  const [ machine, setMachine ] = useState(0)
  const [ type, setType ] = useState("all")
  const [ name, setName ] = useState("")
  const [ material, setMaterial ] = useState("")
  const [ startTime, setStartTime ] = useState("")
  const [ endTime, setEndTime ] = useState("")

  const machines = [
    { key: '0', value: '' },
    { key: '1', value: '#1' },
    { key: '2', value: '#2' },
    { key: '3', value: '#3' },
  ]

  const types = [
    { key: "all", value:"" },
    { key: "Gamyba", value:"Gamyba" },
    { key: "Pagalbinė", value:"Pagalbinė" },
    { key: "II darbas", value:"II darbas" },
    { key: "Kiti darbai", value:"Kiti darbai" },
    { key: "Brokas", value:"Brokas" },
  ]

  useEffect(() => {
    setFilteredItems(() => {
      return items.filter(item => {
        const currentMachine = machine === 0 ? true : item.machine === machine
        const currentType = type === "all" ? true : item.type === type
        const currentName = name === "" ? true : item.name.includes(name)
        const currentMaterial = material === "" ? true : item.material.toLowerCase().includes(material.toLowerCase())
        const short_date = new Intl.DateTimeFormat('lt-LT').format(date)
        const start_date = startTime.length > 0 ? new Date(short_date + " " + startTime + ":") : undefined
        const end_date = endTime.length > 0 ? new Date(short_date + " " + endTime + ":") : undefined
        const currentStart = start_date ? new Date(item.start) > start_date : true
        const currentEnd = end_date ? new Date(item.end) < end_date : true
        return currentMachine && currentType && currentName && currentMaterial && currentStart && currentEnd
      })
    })
  }, [date, items, machine, type, name, material, startTime, endTime])
  

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

  const style = { 
    margin:'2px 5px 0px', 
  }

  const time = t => { 
    if (t.length > 0) return new Date(t).toLocaleTimeString("lt-LT")
    return ""
  }

  const format = d => {
    return new Date(d * 60 * 1000).toISOString().substring(11, 11 + 8) || "00:00:00";
  }

  const data = [
    ["Nest.", "Startas", "Pabaiga", "Trukmė", "Programos pavadinimas", "Programos tipas", "Medžiaga"],
      ...filteredItems.map(item => [ 
      item.machine, 
      time(item.start), 
      time(item.end), 
      format(item.duration), 
      item.name.substring(item.name.lastIndexOf('\\') + 1), 
      item.type, 
      item.material 
      ]),
  ]

  function handleMachine(e) {
    setMachine(parseInt(e.target.value))
  }

  function handleType(e) {
    setType(e.target.value)
  }

  function handleName(e) {
    setName(e.target.value)
  }

  function handleMaterial(e) {
    setMaterial(e.target.value)
  }

  function handleStart(e) {
    setStartTime(e.target.value)
  }

  
  function handleEnd(e) {
    setEndTime(e.target.value)
  }

  function handleSave() {
    console.log('download file')
    let content = "Nestingas;Startas;Pabaiga;Trukmė;Programa;Programos tipas;Medžiaga\n"
    let link = document.createElement('a')
    filteredItems.forEach(item => content += `${item.machine};${time(item.start)};${time(item.end)};${format(item.duration)};${item.name};${item.type};${item.material}\n` )
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
      <button className="button float" onClick={handleSave}>
        <i className="material-symbols-outlined green">save</i>
      </button>

      <div className="box">
        {!expanded && <i className="material-symbols-outlined float" onClick={()=>setExpanded(true)}>expand_more</i>}
        {expanded && <i className="material-symbols-outlined float" onClick={()=>setExpanded(false)}>expand_less</i>}
        <p className="bold">{title.toUpperCase()}<span className="label">{filteredItems.length}</span></p>
        {expanded && 
          <div className="filters">
            <SelectBox 
              label={'Nestingas'} 
              value={machine} 
              options={machines} 
              onChange={(e) => handleMachine(e)} 
            />
            <TimeBox 
              label={'Startas'} 
              value={startTime}
              onChange={(e) => handleStart(e)}
            /> 
            <TimeBox 
              label={'Pabaiga'} 
              value={endTime}
              onChange={(e) => handleEnd(e)}
            />  
            <TextBox 
              label={'Programos pavadinimas'} 
              value={name} 
              onChange={(e)=>handleName(e)} 
            /> 
            <SelectBox 
              label={'Tipas'} 
              value={type} 
              options={types} 
              onChange={(e) => handleType(e)} 
            /> 
            <TextBox 
              label={'Medžiaga'} 
              value={material}
              onChange={(e) => handleMaterial(e)} 
            />
        </div>}
      </div>
      
      <Chart
        chartType="Table"
        options={options}
        style={style}
        data={data}
      />

    </>
  );
}
