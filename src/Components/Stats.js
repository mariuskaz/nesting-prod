export default function Stats() {
    return (
    <>
        <div className="box">
            <p className="bold">KANTAVIMO STAKLĖS<br/>
            <small>BIESSE AKRON 1330 S/N 1000061614</small></p>
        </div>
        <div className="box">
            <br/>
            <div className='inline'>Power On <span>00:00:00</span></div>
            <div className='inline'>Power Off <span>00:00:00</span></div>
            <br/>
        </div>
        <div className="box">
            <table className="stat-table">
                <tr>
                    <td>Apdirbtos plokštės</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>Apdirbti tiesiniai metrai</td>
                    <td>0.0</td>
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
                    <td>00:00:00</td>
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
