import React from 'react'

export default function TimeBox({ label, value, onChange }) {
  return (
    <div className="block">
        <div className="small gray">{label}</div>
        <input 
          type="search"
          className="short" 
          placeholder="00:00"
          defaultValue={value}  
          onChange={(e)=>onChange(e)}
        />
      </div>
  )
}
