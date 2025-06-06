import { useState, useEffect } from "react"

export default function Stats({ date, setUpdated}) {
    const [stats, setStats] = useState({ on:"00:00:00", off:"00:00:00", panels: 0, meters: 0.0, working: "00:00:00" })

    useEffect(() => {
        setUpdated(false)
        setStats({ on:"00:00:00", off:"00:00:00", panels: 0, meters: 0.0, working: "00:00:00" })
        const short_date = new Intl.DateTimeFormat('lt-LT').format(date).replaceAll("-", ".")
        console.log("Fetching stats...")
        fetch("http://192.168.100.102/nesting/akron/stats.asp?" + short_date)
            .then(res => res.json())
            .then(data => {
                setStats({
                    on: data.on ?? "00:00:00",
                    off: data.off ?? "00:00:00",
                    working: data.working ?? "00:00:00",
                    panels: data.panels ?? 0,
                    meters: data.meters ?? 0.0
                })
                setUpdated(true)
            })
            .catch((e) => {
                setStats({ panels: 0, meters: 0.0, working: "00:00:00" })
                console.log("Klaida: " + e)
            })
    }, [date])

    return (
    <>
        <div className="box">
            <p className="bold">KANTAVIMO STAKLĖS<br/>
            <small>BIESSE AKRON 1330-A S/N 1000061614</small></p>
        </div>
        <div className="box">
            <br/>
            <div className='inline'>Power On <span>{stats.on}</span></div>
            <div className='inline'>Power Off <span>{stats.off}</span></div>
            <br/>
        </div>
        <div className="box">
            <table className="stat-table">
                <tr>
                    <td>Apdirbtos plokštės</td>
                    <td>{stats.panels}</td>
                </tr>
                <tr>
                    <td>Apdirbti tiesiniai metrai</td>
                    <td>{stats.meters}</td>
                </tr>
                <tr>
                    <td>Programos paruošimo laikas</td>
                    <td>00:00:00</td>
                </tr>
                <tr>
                    <td>Programos keitimų skaičius</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Rankinio paruošimo laikas</td>
                    <td>00:00:00</td>
                </tr>
                <tr>
                    <td>Staklių techninės priežiūros laikas</td>
                    <td>00:00:00</td>
                </tr>
                <tr>
                    <td>Staklių avarinės būsenos laikas</td>
                    <td>00:00:00</td>
                </tr>
                <tr>
                    <td>Staklių darbo laikas</td>
                    <td>{stats.working}</td>
                </tr>
                <tr>
                    <td>Tuščių staklių darbo laikas</td>
                    <td>00:00:00</td>
                </tr>
                <tr></tr>
            </table>
        </div>
    </>
    )
}
