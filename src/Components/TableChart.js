import React from "react";
import { Chart } from "react-google-charts";

export default function TableChart({ items }) {
  
  const options = { title: "Programos", width:'920px' }
  const style= { margin:'5px' }

  const data = [
    ["Programos tipas", "Nestingas #1", "Nestingas #2", "Nestingas #3"],
    ["Gamyba", 
      items.filter( item => item.machine === 1 && item.type === "Gamyba").length,
      items.filter( item => item.machine === 2 && item.type === "Gamyba").length,
      items.filter( item => item.machine === 3 && item.type === "Gamyba").length
    ],
    ["Pagalbinės programos", 
      items.filter( item => item.machine === 1 && item.type === "Pagalbinė").length,
      items.filter( item => item.machine === 2 && item.type === "Pagalbinė").length,
      items.filter( item => item.machine === 3 && item.type === "Pagalbinė").length
    ],
    ["Antras darbas", 
      items.filter( item => item.machine === 1 && item.type === "II darbas").length,
      items.filter( item => item.machine === 2 && item.type === "II darbas").length,
      items.filter( item => item.machine === 3 && item.type === "II darbas").length
    ],
    ["Brokas", 
      items.filter( item => item.machine === 1 && item.type === "Brokas").length,
      items.filter( item => item.machine === 2 && item.type === "Brokas").length,
      items.filter( item => item.machine === 3 && item.type === "Brokas").length
    ],
    ["Kitos", 
      items.filter( item => item.machine === 1 && item.type === "Kiti").length,
      items.filter( item => item.machine === 2 && item.type === "Kiti").length,
      items.filter( item => item.machine === 3 && item.type === "Kiti").length
    ],
    ["Prastova", 0, 0, 0],
  ]
  
  return (
    <Chart
      chartType="Table"
      data={data}
      options={options}
      style={style}
    />
  );
}
