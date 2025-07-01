import React, { useState, useEffect, useCallback } from "react";
import NestingCharts from "./Components/NestingCharts";
import DataTable from "./Components/DataTable";
import Sidebar from "./Components/Sidebar";
import Params from "./Components/Params";
import Stats from "./Components/Stats";

const locations = [
  "http://192.168.100.102/nesting/snovar%2001/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2002/tpaprod/",
  "http://192.168.100.102/nesting/snovar%2003/tpaprod/",
];

export default function App() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ on: "00:00:00", off: "00:00:00", panels: 0, programs: 0, meters: 0.0, working: "00:00:00" });
  const [params, setParams] = useState({ calcIdleTime: true, expandAll: true });

  const getFileUrl = useCallback(() => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const fileName = `TPAProd_0_${year}${month}${day}.xml`;
    return locations.map(loc => `${loc}${year}\\${month}\\${fileName}`);
  }, [date]);

  const fetchResults = useCallback(async () => {
    const urls = getFileUrl();
    let data = [];
    await Promise.all(urls.map(async (url, index) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        const text = await response.text();
        const xml = new DOMParser().parseFromString(text, "application/xml");
        const machine = index + 1;
        const name = `Nestingas #${machine}`;
        const powerStarts = xml.getElementsByTagName("Start");
        const powerEnds = xml.getElementsByTagName("End");
        const start = powerStarts[1]?.textContent || "";
        const end = powerEnds[powerEnds.length - 1]?.textContent || "";
        const duration = (new Date(end) - new Date(start)) / 60000 || 0;

        if (powerStarts.length > 0 && params.calcIdleTime)
          data.push({ machine, name, start, end, duration, status: "220", type: "Power on/off", material: "" });

        const programs = xml.getElementsByTagName("Program");
        const regex = /^\d{4}[-+]$/;
        let idle = duration;

        Array.from(programs).forEach(program => {
          const progName = program.getElementsByTagName("Name")[0]?.textContent || "";
          const progStart = program.getElementsByTagName("Start")[0]?.textContent || "";
          const progEnd = program.getElementsByTagName("End")[0]?.textContent || "";
          const progDuration = (new Date(progEnd) - new Date(progStart)) / 60000 || 0;
          const filename = progName.substring(progName.lastIndexOf("\\") + 1);
          let type = "Kiti darbai";

          if (regex.test(filename.substring(0, 5))) type = "Gamyba";
          if (/CINAVIM|NUTRAUKIM/i.test(filename)) type = "Pagalbinė";
          if (filename.toUpperCase().includes("BR")) type = "Brokas";
          else if (/_J[12]C/.test(filename)) type = "II darbas";

          const material = program.getAttribute("Product") || "";
          const status = program.getElementsByTagName("Interrupted")[0]?.textContent || "0";

          if (progName) {
            data.push({ machine, name: progName, start: progStart, end: progEnd, duration: progDuration, status, type, material });
            idle -= progDuration;
          }
        });

        if (powerStarts.length > 0 && params.calcIdleTime) 
          data.push({ machine, name, start: "", end: "", duration: idle, status: "220", type: "Idle time", material: "" });
        
      } catch (e) {
        console.error("Data fetch error for", url, e);
      }
    }));

    // Fix duplicate gamyba items
    const fixedData = data.map(item => {
      if (item.type !== "Gamyba") return item;
      const same = data.filter(i => i.type === "Gamyba" && i.name === item.name);
      return { ...item, status: same.length === 1 ? "0" : item.status };
    });

    setResults(fixedData);
    console.log(new Date().toLocaleTimeString(), "nesting results:", fixedData.length);
    
    setLoaded(true);
    setUpdated(true);

  }, [params.calcIdleTime, getFileUrl]);

  const fetchStats = useCallback(() => {
    console.log(new Date().toLocaleTimeString(), "fetching stats");
    const shortDate = new Intl.DateTimeFormat("lt-LT").format(date).replaceAll("-", ".");
    fetch("http://192.168.100.102/nesting/akron/stats.asp?" + shortDate)
      .then(res => res.json())
      .then(data => {

        setStats({
          on: data.on ?? "00:00:00",
          off: data.off ?? "00:00:00",
          working: data.working ?? "00:00:00",
          panels: data.panels ?? 0,
          programs: data.programs ?? 0,
          meters: data.meters ?? 0.0,
        });

        setLoaded(true);
        setUpdated(true);
      })
      .catch(e => {
        console.error("Stats fetch error:", e);
      });
  }, [date]);

  useEffect(() => {
    if (!loaded || !updated)
      view === 4 ? fetchStats() : fetchResults();

    const interval = setInterval(() => {
      const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
      if (isToday) setUpdated(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [date, view, loaded, updated, fetchResults, fetchStats]);

  function handleDateChange(event) {
    const newDate = new Date(event.target.value);
    if (!isNaN(newDate)) {
      setDate(newDate);
      setLoaded(false);
    }
    event.target.blur();
  };

  function handleViewChange(value) {
    if (view === 4 || value === 4) setLoaded(false);
    setView(value);
  };

  function toggleIdleTime() {
    setParams(p => ({ ...p, calcIdleTime: !p.calcIdleTime }));
    setLoaded(false);
  };

  function toggleExpandAll() {
    setParams(p => ({ ...p, expandAll: !p.expandAll }));
  };

  const Spinner = () => {
    if (!loaded || !updated) return <div className="dot-pulse" />
    return null;
  };

  const DatePicker = ({ value, onChange }) => {
    const formatted = value.toISOString().split("T")[0];
    return <input type="date" className="date-picker" value={formatted} onChange={onChange} />;
  };

  const Dashboard = () => {
    switch (view) {
      case 0: return <Params params={params} items={results} toggleIdle={toggleIdleTime} toggleExpand={toggleExpandAll} />;
      case 1: return <NestingCharts date={date} items={results} />;
      case 2: return <DataTable title="Įvykdytos programos" date={date} items={results.filter(i => i.status === "0")} expand={params.expandAll} />;
      case 3: return <DataTable title="Sutrikimai" date={date} items={results.filter(i => i.status === "1")} expand={params.expandAll} />;
      case 4: return <Stats stats={stats} loaded={loaded} />;
      default: return null;
    }
  };

  return (
    <>
      <Spinner />
      <Sidebar view={view} onChange={handleViewChange} />
      <DatePicker value={date} onChange={handleDateChange} />
      <Dashboard />
    </>
  );
}
