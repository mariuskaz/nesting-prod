import React from 'react'

export default function Sidebar({ change }) {

    // https://fonts.google.com/icons?icon.query=data&icon.set=Material+Symbols

    return (
        <div className="sidebar">
            <div className="material-symbols-sharp side-icon" onClick={()=>change(0)}>leaderboard</div>
            <div className="material-symbols-sharp side-icon" onClick={()=>change(1)}>text_snippet</div>
        </div>
    )
}
