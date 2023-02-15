import React from "react";
import { Chart } from "react-google-charts";

export default function TableChart({ items }) {

  const cssClassNames = { headerRow:'table-header' }
  const options = { title: "Programos", width:'940px', allowHtml: true, cssClassNames }
  const style= { margin:'5px 5px 20px' }

  const filter = (item, machine, type) => item.machine === machine && item.type === type && item.status !== "1"
  const duration = (total, item) => Math.round(total + item.duration)

  const format = time => {
    return new Date(time * 60 * 1000).toISOString().substring(11, 11 + 8)
  }

  const data = [
    [" ", "Veikla", "Nestingas #1", "Nestingas #2", "Nestingas #3"],
    [1, "Gamyba",
    format(items.filter(item => filter(item, 1, "Gamyba")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 2, "Gamyba")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 3, "Gamyba")).reduce(duration, 0)),
    ],
    [2, "Pagalbinės programos", 
    format(items.filter(item => filter(item, 1, "Pagalbinė")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 2, "Pagalbinė")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 3, "Pagalbinė")).reduce(duration, 0)),
    ],
    [3, "Antras darbas", 
    format(items.filter(item => filter(item, 1, "II darbas")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 2, "II darbas")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 3, "II darbas")).reduce(duration, 0)),
    ],
    [4, "Kiti darbai", 
    format(items.filter(item => filter(item, 1, "Kiti darbai")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 2, "Kiti darbai")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 3, "Kiti darbai")).reduce(duration, 0)),
    ],
    [5, "Broko taisymas", 
    format(items.filter(item => filter(item, 1, "Brokas")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 2, "Brokas")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 3, "Brokas")).reduce(duration, 0)),
    ],
    [6, "Prastova",  
    format(items.filter(item => filter(item, 1, "Idle time")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 2, "Idle time")).reduce(duration, 0)),
    format(items.filter(item => filter(item, 3, "Idle time")).reduce(duration, 0)),
    ],
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
        [5, 7, "#DDD", "#DDD"],
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
