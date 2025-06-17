import React from 'react';

export default function Stats({ stats, loaded }) {

    const resultsText = {
        color: loaded ? "inherit" : "#fafafa",
    }

    return (
    <>
        <div className="box">
            <p className="bold">KANTAVIMO STAKLĖS<br/>
            <small>BIESSE AKRON 1330-A S/N 1000061614</small></p>
        </div>
        <div className="box">
            <br/>
            <div className='inline'>Power On <span style={resultsText}>{stats.on}</span></div>
            <div className='inline'>Power Off <span style={resultsText}>{stats.off}</span></div>
            <br/>
        </div>
        <div className="box">
            <table className="stat-table">
                <tbody>
                    <tr>
                        <td>Apdirbtos plokštės</td>
                        <td style={resultsText}>{stats.panels}</td>
                    </tr>
                    <tr>
                        <td>Apdirbti tiesiniai metrai</td>
                        <td style={resultsText}>{stats.meters}</td>
                    </tr>
                    <tr>
                        <td>Programos paruošimo laikas</td>
                        <td style={resultsText}>00:00:00</td>
                    </tr>
                    <tr>
                        <td>Programos keitimų skaičius</td>
                        <td style={resultsText}>0</td>
                    </tr>
                    <tr>
                        <td>Rankinio paruošimo laikas</td>
                        <td style={resultsText}>00:00:00</td>
                    </tr>
                    <tr>
                        <td>Staklių techninės priežiūros laikas</td>
                        <td style={resultsText}>00:00:00</td>
                    </tr>
                    <tr>
                        <td>Staklių avarinės būsenos laikas</td>
                        <td style={resultsText}>00:00:00</td>
                    </tr>
                    <tr>
                        <td>Staklių darbo laikas</td>
                        <td style={resultsText}>{stats.working}</td>
                    </tr>
                    <tr>
                        <td>Tuščių staklių darbo laikas</td>
                        <td style={resultsText}>00:00:00</td>
                    </tr>
                    <tr></tr>
                </tbody>
            </table>
        </div>
    </>
    )
}
