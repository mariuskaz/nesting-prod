import React from 'react'

export default function CheckBox({ label, value, onChange }) {
    return (
        <div className="header">
            <input className="checkmark" type="checkbox" checked={value} onChange={onChange} style={{ height:'18px', width:'18px', verticalAlign:'middle' }} />
            &nbsp;{label}
        </div>
    )
}
