import React from 'react'
import ColumnChart from "./ColumnChart"
import PieChart from "./PieChart"
import TableChart from "./TableChart"

export default function NestingCharts({ date, items }) {

  const short_date = new Intl.DateTimeFormat('lt-LT').format(date)
  const today = new Intl.DateTimeFormat('lt-LT').format(new Date())
  const title = short_date === today ? "Realaus laiko rezultatai" : short_date + " d. rezultatai"

  return (
    <>
      <ColumnChart title={title} items={items} />
      <PieChart machine={1} items={items} />
      <PieChart machine={2} items={items} />
      <PieChart machine={3} items={items} />
      {items.length > 0 && <TableChart items={items} />}
    </>
  )
}
