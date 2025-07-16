import React, { useEffect } from 'react';

const Title = ({name, desc}) => (
    <div className="box">
        <p className="bold">{name}<br/>
        <small>{desc}</small></p>
    </div>
)

const PowerStats = ({style, on, off}) => (
    <div className="box" style={{ padding: "20px 10px" }}>
        <div className='inline'>Power On <span style={style}>{on}</span></div>
        <div className='inline'>Power Off <span style={style}>{off}</span></div>
    </div>
)   

const WorkingStats = ({rows}) => (
    <div className="box">
        <table className="stat-table">
            <tbody>{rows}</tbody>
        </table>
    </div>
);

export default function Stats({date, stats, loaded}) {
    const [synced, setSynced] = React.useState(false);
    const defaultTimes = "00:00:00";

    useEffect(() => {
        if (loaded) setSynced(true);
    }, [loaded]);

    useEffect(() => setSynced(false), [date]);

    const name = "KANTAVIMO STAKLĖS";
    const desc = "BIESSE AKRON 1330-A S/N 1000061614";
    
    const values = {
        "Apdirbtos plokštės": stats.panels,
        "Apdirbti tiesiniai metrai": stats.meters,  
        "Programos paruošimo laikas": defaultTimes,
        "Programos keitimų skaičius": stats.programs,
        "Rankinio paruošimo laikas": defaultTimes,
        "Staklių techninės priežiūros laikas": defaultTimes,
        "Staklių avarinės būsenos laikas": defaultTimes,
        "Staklių darbo laikas": stats.working,
        "Tuščių staklių darbo laikas": defaultTimes,
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