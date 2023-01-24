import React from "react";
import { Chart } from "react-google-charts";

export default function TableChart({ items }) {

  const cssClassNames = { headerRow:'table-header' }
  const options = { title: "Programos", width:'920px', allowHtml: true, cssClassNames }
  const style= { margin:'5px' }

  //const round2 = (num) => +(Math.round(num + "e+2")  + "e-2")
  const filter = (item, machine, type) => item.machine === machine && item.type === type
  const duration = (total, item) => Math.round(total + item.duration)

  const data = [
    [" ", "Veikla", "Nestingas #1", "Nestingas #2", "Nestingas #3"],
    [1, "Gamyba",
      items.filter(item => filter(item, 1, "Gamyba")).reduce(duration, 0)+":00 min",
      items.filter(item => filter(item, 2, "Gamyba")).reduce(duration, 0)+":00 min",
      items.filter(item => filter(item, 3, "Gamyba")).reduce(duration, 0)+":00 min",
    ],
    [2, "Pagalbinės programos", 
    items.filter(item => filter(item, 1, "Pagalbinė")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 2, "Pagalbinė")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 3, "Pagalbinė")).reduce(duration, 0)+":00 min",
    ],
    [3, "Antras darbas", 
    items.filter(item => filter(item, 1, "II darbas")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 2, "II darbas")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 3, "II darbas")).reduce(duration, 0)+":00 min",
    ],
    [4, "Kitos programos", 
    items.filter(item => filter(item, 1, "Kiti")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 2, "Kiti")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 3, "Kiti")).reduce(duration, 0)+":00 min",
    ],
    [5, "Brokas", 
    items.filter(item => filter(item, 1, "Brokas")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 2, "Brokas")).reduce(duration, 0)+":00 min",
    items.filter(item => filter(item, 3, "Brokas")).reduce(duration, 0)+":00 min",
    ],
    [null, "Prastova",  0+":00 min", 0+":00 min", 0+":00 min"],
  ]

  const formatters = [
    {
      type: "ColorFormat",
      column: 0,
      options: {
        width: 50,
      },
      ranges: [
        [0, 2, "#3366CC", "#3366CC"],
        [1, 3, "#FF9900", "#FF9900"],
        [2, 4, "#109618", "#109618"],
        [3, 5, "#990099", "#990099"],
        [4, 6, "#DC3912", "#DC3912"],
      ],
    },
  ];

  return (
    <Chart
      chartType="Table"
      data={data}
      options={options}
      style={style}
      formatters={formatters}
    />
  );
}
