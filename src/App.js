import React, { useState, useEffect } from "react";
import ColumnChart from "./Components/ColumnChart";
import PieChart from "./Components/PieChart";
import TableChart from "./Components/TableChart";

const locations = [
  "http://192.168.100.102/nesting/snovar%2001/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2002/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2003/tpaprod/",
]

export default function App() {
  const [ date, setDate ] = useState(new Date("2022-12-30"))
  const [ synced, setSynced ] = useState(false)
  const [ data, setData ] = useState([])

  const date_style = {
    padding:'4px', margin:'10px 10px 0', border:'1px solid lightgray'
  }

  const short_date = date.toLocaleString("default", { dateStyle:"short" })
  console.log(short_date)

  useEffect(() => {

    const year = date.toLocaleString("default", { year: 'numeric' })
    const month = date.toLocaleString("default", { month: '2-digit' })
    const day = date.toLocaleString("default", { day: '2-digit' })
    const file = year + "\\" + month + "\\TPAProd_0_" + year + month + day + ".xml";
    const urls = locations.map( location => location + file)

    const fetchData = async() => {
      let items = []
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
                    type = "Kiti"

                    if (regex.test(filename.substring(0, 5))) type = "Gamyba"
                    if (filename.toUpperCase().substring(0,3) === "BR-") type = "Brokas"
                    if (filename.toUpperCase().includes("CINAVIM")) type = "Pagalbinė"
                    if (filename.toUpperCase().includes("NUTRAUKIM")) type = "Pagalbinė"
                    if (filename.includes("_J1C") || filename.includes("_J2C")) type="II darbas"

                    //console.log(filename, duration)
                    if (name.length > 0) items.push({ machine, name, start, end, duration, type })
                  }

                })
        )
      )

      setSynced(true)
      setData(items)

    }

    if (!synced) fetchData()

  }, [synced, data, date])

  function handleChange(e) {
    setDate(new Date(e.target.value))
    setSynced(false)
    e.target.blur()
  }

  console.log('items found', data.length)
  
  return (
    <>
      <input type="date" style={date_style} value={short_date} onChange={handleChange} />
      <ColumnChart items={data} />
      <PieChart machine={1} items={data} />
      <PieChart machine={2} items={data} />
      <PieChart machine={3} items={data} />
      <TableChart items={data} />
    </>
  );
}
