import React from 'react'

export default function Sidebar({ view, onChange }) {

    return (
        <div className="sidebar">
            <div
                className={`material-symbols-sharp side-icon ${view === 1 ? 'side-icon-active' : ''}`}
                onClick={()=>onChange(1)}
            >leaderboard</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 2 ? 'side-icon-active' : ''}`}
                onClick={()=>onChange(2)}
            >text_snippet</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 3 ? 'side-icon-active' : ''}`}
                onClick={()=>onChange(3)}
            >warning</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 4 ? 'side-icon-active' : ''}`}
                onClick={()=>onChange(4)}
            >straighten</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 0 ? 'side-icon-active' : ''} bottom`}
                onClick={()=>onChange(0)}
            >settings</div>
        </div>
    )
}