import React from "react";
import { Chart } from "react-google-charts";

export default function TableChart({ items }) {
  
  const options = { title: "Programos", width:'920px' }
  const style= { margin:'5px' }

  //const round2 = (num) => +(Math.round(num + "e+2")  + "e-2")
  const filter = (item, machine, type) => item.machine === machine && item.type === type
  const duration = (total, item) => Math.round(total + item.duration)

  const data = [
    ["Programos tipas", "Nest.#1, min", "Nest.#2, min", "Nest.#3, min"],
    ["Gamyba", 
      items.filter(item => filter(item, 1, "Gamyba")).reduce(duration, 0),
      items.filter(item => filter(item, 2, "Gamyba")).reduce(duration, 0),
      items.filter(item => filter(item, 3, "Gamyba")).reduce(duration, 0),
    ],
    ["Pagalbinės programos", 
    items.filter(item => filter(item, 1, "Pagalbinė")).reduce(duration, 0),
    items.filter(item => filter(item, 2, "Pagalbinė")).reduce(duration, 0),
    items.filter(item => filter(item, 3, "Pagalbinė")).reduce(duration, 0),
    ],
    ["Antras darbas", 
    items.filter(item => filter(item, 1, "II darbas")).reduce(duration, 0),
    items.filter(item => filter(item, 2, "II darbas")).reduce(duration, 0),
    items.filter(item => filter(item, 3, "II darbas")).reduce(duration, 0),
    ],
    ["Brokas", 
    items.filter(item => filter(item, 1, "Brokas")).reduce(duration, 0),
    items.filter(item => filter(item, 2, "Brokas")).reduce(duration, 0),
    items.filter(item => filter(item, 3, "Brokas")).reduce(duration, 0),
    ],
    ["Kitos programos", 
    items.filter(item => filter(item, 1, "Kiti")).reduce(duration, 0),
    items.filter(item => filter(item, 2, "Kiti")).reduce(duration, 0),
    items.filter(item => filter(item, 3, "Kiti")).reduce(duration, 0),
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
