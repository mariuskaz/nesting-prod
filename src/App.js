import React, { useState, useEffect } from "react"
import NestingCharts from "./Components/NestingCharts"
import DataTable from "./Components/DataTable"
import Sidebar from "./Components/Sidebar"
import Params from "./Components/Params"
import Stats from "./Components/Stats"

const locations = [
  "http://192.168.100.102/nesting/snovar%2001/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2002/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2003/tpaprod/",
]

export default function App() {
  const [ synced, setSynced ] = useState(false)
  const [ updated, setUpdated ] = useState(true)
  const [ date, setDate ] = useState(new Date())
  const [ items, setItems ] = useState([])
  const [ view, setView ] = useState(1)
  const [ params, setParams ] = useState({ 
    calcIdle: true,
    expandAll: true,
  })

  useEffect(() => {

    const year = date.toLocaleString("default", { year: 'numeric' })
    const month = date.toLocaleString("default", { month: '2-digit' })
    const day = date.toLocaleString("default", { day: '2-digit' })
    const file = year + "\\" + month + "\\TPAProd_0_" + year + month + day + ".xml";
    const urls = locations.map( location => location + file)

    const fetchData = async() => {
      let data = []
      await Promise.all(
        urls.map((url, index) =>
            fetch(url, {cache: "no-store"})
                .then((res) => res.text())
                .then(text => {
                  const parser = new DOMParser()
                  const xml = parser.parseFromString(text, "application/xml")
                  const powerStarts = xml.getElementsByTagName("Start")
                  const powerEnds = xml.getElementsByTagName("End")

                  const machine = index + 1, name = "Nestingas #" + machine,
                  start = powerStarts[1]?.childNodes[0].nodeValue || "",
                  end = powerEnds[powerEnds.length - 1]?.childNodes[0].nodeValue || "", 
                  duration = (new Date(end) - new Date(start)) / 1000 / 60 || 0,
                  status = "220",
                  type = "Power on/off",
                  material = ""

                  if (powerStarts.length > 0 && params.calcIdle)
                    data.push({ machine, name, start, end, duration, status, type, material })
                  
                  const programs = xml.getElementsByTagName("Program")
                  const regex = /^\d{4}[-+]$/
                  let idle = duration

                  for (let item = 0; item < programs.length; item++) {
                    let name = programs[item].getElementsByTagName("Name")[0]?.childNodes[0].nodeValue || "",
                    start = programs[item].getElementsByTagName("Start")[0]?.childNodes[0].nodeValue || "",
                    end = programs[item].getElementsByTagName("End")[0]?.childNodes[0].nodeValue || "",
                    duration = (new Date(end) - new Date(start)) / 1000 / 60 || 0,
                    filename = name.substring(name.lastIndexOf('\\') + 1),
                    status = programs[item].getElementsByTagName("Interrupted")[0]?.childNodes[0].nodeValue || "0",
                    type = "Kiti darbai",
                    material = programs[item].getAttribute('Product') || ""

                    if (regex.test(filename.substring(0, 5))) type = "Gamyba"
                    if (filename.toUpperCase().includes("CINAVIM")) type = "Pagalbinė"
                    if (filename.toUpperCase().includes("NUTRAUKIM")) type = "Pagalbinė"
                    if (filename.toUpperCase().substring(0,3) === "BR-") type = "Brokas"
                    else if (filename.includes("_J1C") || filename.includes("_J2C")) type="II darbas"

                    if (name.length > 0) data.push({ machine, name, start, end, duration, status, type, material })
                    idle -= duration
                  }

                  if (powerStarts.length > 0 && params.calcIdle)
                    data.push({ machine, name, start:"", end:"", duration: idle, status: "220", type: "Idle time", material })

                })
                .catch(err => console.log)
        )
      )

      const fixedData = data.map( item => {
        if (item.type !== 'Gamyba') return item
        let status = item.status,
        found = data.filter( i => i.type === 'Gamyba' && i.name === item.name).length
        if (found === 1) status = '0'
        return {...item, status}
      })

      setItems(fixedData)
      setSynced(true)

      const time = new Date().toLocaleTimeString()
      console.log(time, 'results:', data.length)

    }

    if (!synced) fetchData()

    const refresh = setInterval(() => {
        const today = new Date().setHours(0,0,0,0)
        const picked = date.setHours(0,0,0,0)
        if (picked === today) setSynced(false)
    }, 1000 * 60 * 5)

    return () => clearInterval(refresh)

  }, [synced, date, items, params])

  function DatePicker({value, onChange}) {
    const short_date = new Intl.DateTimeFormat('lt-LT').format(value)
    return <input type="date" className="date-picker" value={short_date} onChange={onChange} /> 
  }

  function handleChange(e) {
    if (e.target.value.length) {
      setDate(new Date(e.target.value))
      setSynced(false)
      e.target.blur()
    }
  }

  function toggleIdle() {
    setParams(values => { 
      return { ...values, calcIdle: !values.calcIdle }
    })
    setSynced(false)
  }

  function toggleExpand() {
    setParams(values => { 
      return { ...values, expandAll: !params.expandAll }
    })
  }

  return (
    <>
      {(!synced || !updated) && <div className='dot-pulse'/>}
      <Sidebar view={view} onChange={(i)=>setView(i)} />
      <DatePicker value={date} onChange={handleChange} />
      

      {view === 1 && 
          <NestingCharts date={date} items={items} />
      }

      {view === 2 && 
        <DataTable title={"Įvykdytos programos"} date={date}
          items={items.filter(item => item.status === "0")} 
          expand={params.expandAll} />
      }

      {view === 3 && 
        <DataTable title={"Sutrikimai"} date={date}
          items={items.filter(item => item.status === "1")} 
          expand={params.expandAll} />
      }

      {view === 4 && <Stats date={date} 
          setUpdated={(b)=>setUpdated(b)} />}

      {view === 0 && 
        <Params params={params} items={items}
          toggleIdle={toggleIdle} toggleExpand={toggleExpand} /> 
      }

    </>
  );
}
