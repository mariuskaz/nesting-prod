import React, { useState, useEffect } from "react"
import NestingCharts from "./Components/NestingCharts"
import Sidebar from "./Components/Sidebar"
import DataTable from "./Components/DataTable"

const locations = [
  "http://192.168.100.102/nesting/snovar%2001/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2002/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2003/tpaprod/",
]

export default function App() {
  const [ synced, setSynced ] = useState(false)
  const [ date, setDate ] = useState(new Date())
  const [ items, setItems ] = useState([])
  const [ view, setView ] = useState(0)

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
            fetch(url)
                .then((res) => res.text())
                .then(text => {
                  const parser = new DOMParser()
                  const xml = parser.parseFromString(text, "application/xml")
                  //const power = xml.getElementsByTagName("Start")[0]?.childNodes[0].nodeValue
                  const programs = xml.getElementsByTagName("Program")
                  const regex = /^\d{4}-$/

                  for (let item = 0; item < programs.length; item++) {
                    let machine = index + 1,
                    name = programs[item].getElementsByTagName("Name")[0]?.childNodes[0].nodeValue || "",
                    start = programs[item].getElementsByTagName("Start")[0]?.childNodes[0].nodeValue || "",
                    end = programs[item].getElementsByTagName("End")[0]?.childNodes[0].nodeValue || "",
                    duration = (new Date(end) - new Date(start)) / 1000 / 60,
                    filename = name.substring(name.lastIndexOf('\\') + 1),
                    failed = programs[item].getElementsByTagName("Interrupted")[0]?.childNodes[0].nodeValue || "0",
                    type = "Kiti darbai"

                    if (regex.test(filename.substring(0, 5))) type = "Gamyba"
                    if (filename.toUpperCase().substring(0,3) === "BR-") type = "Brokas"
                    if (filename.toUpperCase().includes("CINAVIM")) type = "Pagalbinė"
                    if (filename.toUpperCase().includes("NUTRAUKIM")) type = "Pagalbinė"
                    if (filename.includes("_J1C") || filename.includes("_J2C")) type="II darbas"

                    //console.log(filename, duration)
                    if (name.length > 0) data.push({ machine, name, start, end, duration, failed, type })
                  }

                })
                .catch(err => console.log)
        )
      )

      setItems(data)
      setSynced(true)

      const time = new Date().toLocaleTimeString()
      console.log(time, 'completed items:', data.length)

    }

    if (!synced) fetchData()

    const refresh = setInterval(() => {
        const today = new Date().setHours(0,0,0,0)
        const picked = date.setHours(0,0,0,0)
        if (picked === today) setSynced(false)
    }, 1000 * 60 * 5)

    return () => clearInterval(refresh)

  }, [synced, date, items])

  function handleChange(e) {
    if (e.target.value.length) {
      setDate(new Date(e.target.value))
      setSynced(false)
      e.target.blur()
    }
  }

  const short_date = new Intl.DateTimeFormat('lt-LT').format(date)
  const date_style = {
    padding:'4px', margin:'10px 10px 0', border:'1px solid lightgray', background:'white',
  }
  
  return (
    <>
      <Sidebar change={(i)=>setView(i)} />
      <input type="date" style={date_style} value={short_date} onChange={handleChange} />
      {view === 0 && <NestingCharts date={date} items={items} />}
      {view === 1 && <DataTable items={items} />}
    </>
  );
}
