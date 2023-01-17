import React, { useState, useEffect } from "react";
import ColumnChart from "./Components/ColumnChart";
import PieChart from "./Components/PieChart";
import TableChart from "./Components/TableChart";

export default function App() {
  const [ date, setDate ] = useState(new Date("2022-12-19"))
  const [ synced, setSynced ] = useState(false)
  const [ data, setData ] = useState([])


  const blue_color = "color:rgb(51, 102, 204)"

  useEffect(() => {

    console.log(date)
    const year = date.toLocaleString("default", { year: 'numeric' })
    const month = date.toLocaleString("default", { month: '2-digit' })
    const day = date.toLocaleString("default", { day: '2-digit' })
    const file = year + "\\" + month + "\\TPAProd_0_" + year + month + day + ".xml";

    const urls = [
      "http://192.168.100.102/nesting/SNOVAR%2001/TPAProd/" + file,
      "http://192.168.100.102/nesting/SNOVAR%2002/TPAProd/" + file,
      "http://192.168.100.102/nesting/SNOVAR%2003/TPAProd/" + file,
    ]

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

  const sheets = [
    ["Nestingas", "Lapai", { role: "style" }],
    ["Nestingas #1", data.filter( item => item.machine === 1 && item.type === "Gamyba").length, blue_color],
    ["Nestingas #2", data.filter( item => item.machine === 2 && item.type === "Gamyba").length, blue_color], 
    ["Nestingas #3", data.filter( item => item.machine === 3 && item.type === "Gamyba").length, blue_color],
  ]

  const nest1 = [
    ["Programa", "Valandos"],
    ["Gamyba", data.filter( item => item.machine === 1 && item.type === "Gamyba").length],
    ["Pagalbinės", data.filter( item => item.machine === 1 && item.type === "Pagalbinė").length],
    ["II darbas", data.filter( item => item.machine === 1 && item.type === "II darbas").length],
    ["Brokas", data.filter( item => item.machine === 1 && item.type === "Brokas").length],
    ["Kitos", data.filter( item => item.machine === 1 && item.type === "Kiti").length],
    ["Prastova", 0],
  ]

  console.log("nest1:", nest1)

  const nest2 = [
    ["Programos", "Valandos"],
    ["Gamyba", data.filter( item => item.machine === 2 && item.type === "Gamyba").length],
    ["Pagalbinės", data.filter( item => item.machine === 2 && item.type === "Pagalbinės").length],
    ["II darbas", data.filter( item => item.machine === 2 && item.type === "II darbas").length],
    ["Brokas", data.filter( item => item.machine === 2 && item.type === "Brokas").length],
    ["Kitos", data.filter( item => item.machine === 2 && item.type === "Kiti").length],
    ["Prastova", 0],
  ]

  const nest3 = [
    ["Programos", "Valandos"],
    ["Gamyba", data.filter( item => item.machine === 3 && item.type === "Gamyba").length],
    ["Pagalbinės", data.filter( item => item.machine === 3 && item.type === "Pagalbinės").length],
    ["II darbas", data.filter( item => item.machine === 3 && item.type === "II darbas").length],
    ["Brokas", data.filter( item => item.machine === 3 && item.type === "Brokas").length],
    ["Kitos", data.filter( item => item.machine === 3 && item.type === "Kiti").length],
    ["Prastova", 0],
  ]


  function update(e) {
    setDate(new Date(e.target.value))
    setSynced(false)
    e.target.blur()
  }
  
  return (
    <>
      <input
        type="date" 
        style={{ padding:'1px', margin:'10px 10px 0', border:'1px solid lightgray' }} onChange={update}
        value={date.toLocaleString("default", { dateStyle:"short" })}/>
      <ColumnChart data={sheets}/>
      <PieChart title={"Nestingas #1"} data={nest1} />
      <PieChart title={"Nestingas #2"} data={nest2} />
      <PieChart title={"Nestingas #3"} data={nest3} />
      <TableChart data={nest1} />
    </>
  );
}
