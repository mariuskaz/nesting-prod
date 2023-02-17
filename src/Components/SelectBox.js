import React from 'react'

export default function SelectBox({label, value, options, onChange}) {
  return (
    <div className="block">
        <div className="small gray">{label}</div>
        <select value={value} onChange={(e) => onChange(e)}>
          {options.map( option => <option key={option.key} value={option.key}>{option.value}</option>)}
        </select>
      </div>
  )
}
