import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

export default function DataTable({ title, items }) {
  const [ expanded, setExpanded ] = useState(false)
  const [ filteredItems, setFilteredItems ] = useState(items)
  const [ machine, setMachine ] = useState(0)
  const [ type, setType ] = useState("all")
  const [ name, setName ] = useState("")

  useEffect(() => {
    setFilteredItems(() => {
      return items.filter(item => {
        const currentMachine = machine === 0 ? true : item.machine === machine
        const currentType = type === "all" ? true : item.type === type
        const currentName = name === "" ? true : item.name.includes(name)
        return currentMachine && currentType && currentName
      })
      console.log(name)
    })
  }, [items, machine, type, name])
  

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

  function Nesting({ value }) {
    return (
      <div className="block">
        <div className="small gray">Nestingas</div>
        <select value={value} onChange={(e) => handleMachine(e)}>
          <option value="0"></option>
          <option value="1">#1</option>
          <option value="2">#2</option>
          <option value="3">#3</option>
        </select>
      </div>
    )
  }

  function Type({value}) {
    return (
      <div className="block">
        <div className="small gray">Tipas</div>
        <select value={value} style={{ width:'94px'}} onChange={(e) => handleType(e)}>
          <option value="all"></option>
          <option value="Gamyba">Gamyba</option>
          <option value="Pagalbinė">Pagalbinė</option>
          <option value="II darbas">II darbas</option>
          <option value="Kiti darbai">Kiti darbai</option>
          <option value="Brokas">Brokas</option>
        </select>
      </div>
    )
  }

  function Text({ label, value, change }) {
    return (
      <div className="block">
        <div className="small gray">{label}</div>
        <input defaultValue={value} type="search" className="long" onChange={(e)=>handleName(e)}/>
      </div>
    )
  }

  function Time({ label }) {
    return (
      <div className="block">
        <div className="small gray">{label}</div>
        <input type="search" className="short" placeholder="00:00" />
      </div>
    )
  }

  function handleMachine(e) {
    setMachine(parseInt(e.target.value))
  }

  function handleType(e) {
    setType(e.target.value)
  }

  function handleName(e) {
    if (e.key === "Enter") setName(e.target.value)
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
          <Nesting value={machine} onChange={(e) => handleMachine(e)} /> 
          <Time label={'Startas'} /> 
          <Time label={'Pabaiga'} /> 
          <Text label={'Programos pavadinimas'} value={name} onChange={(e)=>handleName(e)} /> 
          <Type value={type} onChange={(e) => handleType(e)} /> 
          <Text label={'Medžiaga'} />
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
