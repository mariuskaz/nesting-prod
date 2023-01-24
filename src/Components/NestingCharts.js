import React from 'react'
import ColumnChart from "./ColumnChart"
import PieChart from "./PieChart"
import TableChart from "./TableChart"

export default function NestingCharts({ date, items, change }) {

  const short_date = new Intl.DateTimeFormat('lt-LT').format(date)
  const date_style = {
    padding:'4px', margin:'10px 10px 0', border:'1px solid lightgray'
  }

  const today = new Intl.DateTimeFormat('lt-LT').format(new Date())
  const title = short_date === today ? "Realaus laiko rezultatai" : short_date + " d. rezultatai"

  return (
    <>
      <input type="date" style={date_style} value={short_date} onChange={change} />
      <ColumnChart title={title} items={items} />
      <PieChart machine={1} items={items} />
      <PieChart machine={2} items={items} />
      <PieChart machine={3} items={items} />
      {items.length > 0 && <TableChart items={items} />}
    </>
  )
}
