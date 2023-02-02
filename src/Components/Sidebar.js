import React from 'react'

export default function Sidebar({ view, change }) {

    // https://fonts.google.com/icons?icon.query=data&icon.set=Material+Symbols

    return (
        <div className="sidebar">
            <div
                className={`material-symbols-sharp side-icon ${view === 0 ? 'side-icon-active' : ''}`}
                onClick={()=>change(0)}
            >leaderboard</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 1 ? 'side-icon-active' : ''}`}
                onClick={()=>change(1)}
            >text_snippet</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 2 ? 'side-icon-active' : ''}`}
                onClick={()=>change(2)}
            >warning</div>
            <div
                className={`material-symbols-sharp side-icon ${view === 3 ? 'side-icon-active' : ''} bottom`}
                onClick={()=>change(3)}
            >settings</div>
        </div>
    )
}