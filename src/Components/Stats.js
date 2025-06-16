import { useState, useEffect } from "react"

export default function Stats({ date, updated, setUpdated}) {
    const [stats, setStats] = useState({ on:"00:00:00", off:"00:00:00", panels: 0, meters: 0.0, working: "00:00:00" })

    useEffect(() => {
        setUpdated(false)
        setStats({ on:"00:00:00", off:"00:00:00", panels: 0, meters: 0.0, working: "00:00:00" })
        const short_date = new Intl.DateTimeFormat('lt-LT').format(date).replaceAll("-", ".")
        const time = new Date().toLocaleTimeString()
        console.log(time, "fetching stats...")
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

    const blurText = {
        color: updated ? "inherit" : "#fafafa",
    }

    return (
    <>
        <div className="box">
            <p className="bold">KANTAVIMO STAKLĖS<br/>
            <small>BIESSE AKRON 1330-A S/N 1000061614</small></p>
        </div>
        <div className="box">
            <br/>
            <div className='inline'>Power On <span style={blurText}>{stats.on}</span></div>
            <div className='inline'>Power Off <span style={blurText}>{stats.off}</span></div>
            <br/>
        </div>
        <div className="box">
            <table className="stat-table">
                <tr>
                    <td>Apdirbtos plokštės</td>
                    <td style={blurText}>{stats.panels}</td>
                </tr>
                <tr>
                    <td>Apdirbti tiesiniai metrai</td>
                    <td style={blurText}>{stats.meters}</td>
                </tr>
                <tr>
                    <td>Programos paruošimo laikas</td>
                    <td style={blurText}>00:00:00</td>
                </tr>
                <tr>
                    <td>Programos keitimų skaičius</td>
                    <td style={blurText}>0</td>
                </tr>
                <tr>
                    <td>Rankinio paruošimo laikas</td>
                    <td style={blurText}>00:00:00</td>
                </tr>
                <tr>
                    <td>Staklių techninės priežiūros laikas</td>
                    <td style={blurText}>00:00:00</td>
                </tr>
                <tr>
                    <td>Staklių avarinės būsenos laikas</td>
                    <td style={blurText}>00:00:00</td>
                </tr>
                <tr>
                    <td>Staklių darbo laikas</td>
                    <td style={blurText}>{stats.working}</td>
                </tr>
                <tr>
                    <td>Tuščių staklių darbo laikas</td>
                    <td style={blurText}>00:00:00</td>
                </tr>
                <tr></tr>
            </table>
        </div>
    </>
    )
}
