import React from 'react'

export default function CheckBox({ label, value, onChange }) {
    return (
        <div className="content">
            <input type="checkbox" checked={value} onChange={onChange} />{' ' + label}
        </div>
    )
}
