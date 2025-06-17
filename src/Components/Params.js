import React from 'react'
import CheckBox from "./CheckBox"

export default function Params({ params, toggleIdle, toggleExpand, items }) {

  function time(t) { 
    if (t.length > 0) return new Date(t).toLocaleTimeString("lt-LT")
    return "00:00:00"
  }

  function PowerState({ machineId }) {
    const machine = items.filter(item => item.status === '220' && item.name === `Nestingas #${machineId}`)[0]
    const powerOn = machine ? time(machine.start) : "00:00:00"
    const powerOff = machine ? time(machine.end) : "00:00:00"
    return (
      <div className="box">
        <p className="bold">NESTINGAS #{machineId}</p>
        <div className='inline'>Power On <span>{powerOn}</span></div>
        <div className='inline'>Power Off <span>{powerOff}</span></div>
        <br/>
      </div>
    )
  }

  return (
    <>
      <div className="box">
        <p className="bold">PARAMETRAI</p>
        <CheckBox label={'Įtraukti staklių prastovas į rodiklius'} value={params.calcIdleTime} onChange={toggleIdle} />
        <CheckBox label={'Rodyti išskleistus filtrus'} value={params.expandAll} onChange={toggleExpand} />
        <br/>
      </div>
      <PowerState machineId={1} />
      <PowerState machineId={2} />
      <PowerState machineId={3} />
    </>
    
  )
}
