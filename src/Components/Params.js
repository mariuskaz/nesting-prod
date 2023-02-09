import React from 'react'
import CheckBox from "./CheckBox"

export default function Params({ params, toggleIdle }) {
  return (
    <div className="box">
        <p>PARAMETRAI</p>
        <CheckBox label={'Įtraukti staklių prastovas į rodiklius'} value={params.calcIdle} onChange={toggleIdle} />
        <br/>
      </div>
  )
}
