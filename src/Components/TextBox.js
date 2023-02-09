import React from 'react'

export default function TextBox({ label, value, onChange }) {
  return (
    <div className="block">
        <div className="small gray">{label}</div>
        <input defaultValue={value} type="search" className="long" onChange={(e)=>onChange(e)}/>
      </div>
  )
}
