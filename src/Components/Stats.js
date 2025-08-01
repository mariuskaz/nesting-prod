import React, { useEffect } from 'react';

function Title({ name, desc }) {
    return (
        <div className="box">
            <p className="bold">{name}<br />
                <small>{desc}</small></p>
        </div>
    );
}

function PowerStats({ style, on, off }) {
    return (
        <div className="box" style={{ padding: "20px 10px" }}>
            <div className='inline'>Power On <span style={style}>{on}</span></div>
            <div className='inline'>Power Off <span style={style}>{off}</span></div>
        </div>
    );
}   

function WorkingStats({ rows }) {
    return (
        <div className="box">
            <table className="stat-table">
                <tbody>{rows}</tbody>
            </table>
        </div>
    );
}

export default function Stats({ date, stats, loaded }) {
    const [synced, setSynced] = React.useState(false);
    const defaultTime = "00:00:00";

    useEffect(() => {
        if (loaded) setSynced(true);
    }, [loaded]);

    useEffect(() => setSynced(false), [date]);

    const name = "KANTAVIMO STAKLĖS";
    const desc = "BIESSE AKRON 1330-A S/N 1000061614";
    
    const values = {
        "Apdirbtos plokštės": stats.panels || 0,
        "Apdirbti tiesiniai metrai": stats.meters || 0,  
        "Programos paruošimo laikas": stats.prepare || defaultTime,
        "Programos keitimų skaičius": stats.programs || 0,
        "Rankinio paruošimo laikas": stats.manual || defaultTime,
        "Staklių techninės priežiūros laikas": stats.maintenance || defaultTime,
        "Staklių avarinės būsenos laikas": stats.alerts || defaultTime,
        "Staklių darbo laikas": stats.working || defaultTime,
        "Tuščių staklių darbo laikas": stats.empty || defaultTime,
    };

    const style = {
        color: synced ? "#808080" : "#fafafa",
        fontWeight: "600",
    };

    const StatRows = Object.entries(values).map(([key, value]) => (
        <tr key={key}>
            <td>{key}</td>
            <td style={style}>{value}</td>
        </tr>
    ));

    return (
        <>
            <Title name={name} desc={desc} />
            <PowerStats style={style} on={stats.on} off={stats.off} />
            <WorkingStats rows={StatRows} />
        </>
    )
}