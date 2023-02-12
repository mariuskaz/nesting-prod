import React from 'react'
import CheckBox from "./CheckBox"

export default function Params({ params, toggleIdle, toggleExpand }) {
  return (
    <div className="box">
        <p style={{marginBottom:'20px'}}>PARAMETRAI</p>
        <p>
          <CheckBox label={'Įtraukti staklių prastovas į rodiklius'} value={params.calcIdle} onChange={toggleIdle} />
          <CheckBox label={'Rodyti išskleistus filtrus'} value={params.expandAll} onChange={toggleExpand} />
        </p>
      </div>
  )
}
