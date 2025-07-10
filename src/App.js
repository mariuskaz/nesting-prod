import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import NestingCharts from "./Components/NestingCharts";
import DataTable from "./Components/DataTable";
import Sidebar from "./Components/Sidebar";
import Params from "./Components/Params";
import Stats from "./Components/Stats";

const LOCATIONS = [
	"http://192.168.100.102/nesting/snovar%2001/tpaprod/",
	"http://192.168.100.102/nesting/snovar%2002/tpaprod/",
	"http://192.168.100.102/nesting/snovar%2003/tpaprod/",
];

const ROUTES = ["/params", "/charts", "/programs", "/alerts", "/stats"];

const PROGRAM_TYPE_MAP = {
	PRODUCTION: /^\d{4}[-+]$/,
	AUXILIARY: /CINAVIM|NUTRAUKIM/i,
	BROKEN: /BR/i,
	SECOND_WORK: /_J[12]C/
};

const initialStats = {
	on: "00:00:00",
	off: "00:00:00",
	panels: 0,
	programs: 0,
	meters: 0.0,
	working: "00:00:00"
};

const initialParams = {
	calcIdleTime: true,
	expandAll: true   
};

export default function App() {
	const [date, setDate] = useState(new Date());
	const [loaded, setLoaded] = useState(false);
	const [updated, setUpdated] = useState(false);
	const [results, setResults] = useState([]);
	const [stats, setStats] = useState(initialStats);
	const [params, setParams] = useState(initialParams);

	const navigate = useNavigate();
	const location = useLocation();

	const getViewIndex = () => {
		const idx = ROUTES.indexOf(location.pathname);
		return idx === -1 ? 1 : idx;
	};

	const view = getViewIndex();
	const prView = useRef(view);

	useEffect(() => {
		if (location.pathname === "/")
			navigate("/charts", { replace: true });
	}, [location.pathname, navigate]);

	useEffect(() => {
		if (view === 4 || prView.current === 4) setLoaded(false);
		prView.current = view;
	}, [view]);

	const getFileUrl = useCallback(() => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const fileName = `TPAProd_0_${year}${month}${day}.xml`;
		return LOCATIONS.map(loc => `${loc}${year}\\${month}\\${fileName}`);
	}, [date]);

	const getProgramType = useCallback((filename) => {
		const name = filename.substring(0, 5);
		if (PROGRAM_TYPE_MAP.PRODUCTION.test(name)) return "Gamyba";
		if (PROGRAM_TYPE_MAP.AUXILIARY.test(filename)) return "Pagalbinė";
		if (PROGRAM_TYPE_MAP.BROKEN.test(filename)) return "Brokas";
		if (PROGRAM_TYPE_MAP.SECOND_WORK.test(filename)) return "II darbas";
		return "Kiti darbai";
	}, []);

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
				let idle = duration;

				Array.from(programs).forEach(program => {
					const progName = program.getElementsByTagName("Name")[0]?.textContent || "";
					const progStart = program.getElementsByTagName("Start")[0]?.textContent || "";
					const progEnd = program.getElementsByTagName("End")[0]?.textContent || "";
					const progDuration = (new Date(progEnd) - new Date(progStart)) / 60000 || 0;
					const filename = progName.substring(progName.lastIndexOf("\\") + 1);
					const type = getProgramType(filename);
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

		const fixedData = data.map(item => {
			if (item.type !== "Gamyba") return item;
			const same = data.filter(i => i.type === "Gamyba" && i.name === item.name);
			return { ...item, status: same.length === 1 ? "0" : item.status };
		});

		setResults(fixedData);
		console.log(new Date().toLocaleTimeString(), "nesting results:", fixedData.length);
		
		setLoaded(true);
		setUpdated(true);

	}, [getFileUrl, getProgramType, params.calcIdleTime]);

	const programResults = results.filter(i => i.status === "0")
	const alertResults = results.filter(i => i.status === "1")

	const fetchStats = useCallback((signal) => {
		console.log(new Date().toLocaleTimeString(), "fetching stats");
		const shortDate = new Intl.DateTimeFormat("lt-LT").format(date).replaceAll("-", ".");
		fetch("http://192.168.100.102/nesting/akron/stats.asp?" + shortDate, { signal })
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
			if (e.name !== "AbortError") {
				console.error("Stats fetch error:", e);
			}
		});
	}, [date]);

	useEffect(() => {
		const controller = new AbortController();
		if (!loaded || !updated) {
			if (view === 4) fetchStats(controller.signal);
			else fetchResults(controller.signal);
		}

		const interval = setInterval(() => {
			const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
			if (isToday) setUpdated(false);
		}, 5 * 60 * 1000);

		return () => {
			clearInterval(interval);
			controller.abort();
		};
	}, [date, view, loaded, updated, fetchResults, fetchStats]);

	function handleDateChange(event) {
		const newDate = new Date(event.target.value);
		if (!isNaN(newDate)) {
			setDate(newDate);
			setLoaded(false);
		}
		event.target.blur();
	};

	function handleSidebarChange(idx) {
		navigate(ROUTES[idx]);
	}

	function toggleIdleTime() {
		setParams(p => ({ ...p, calcIdleTime: !p.calcIdleTime }));
		setLoaded(false);
	};

	function toggleExpandAll() {
		setParams(p => ({ ...p, expandAll: !p.expandAll }));
	};

	const Loader = () => {
		return (!loaded || !updated) ? <div className="dot-pulse" /> : null;
	};

	const DatePicker = ({ value, onChange }) => {
		const date = value.toISOString().split("T")[0];
		return <input type="date" className="date-picker" value={date} onChange={onChange} />;
	};

	return (
		<>
			<Loader />
			<Sidebar view={view} onChange={handleSidebarChange} />
			<DatePicker value={date} onChange={handleDateChange} />
			<Routes>
				<Route path="/params" element={
					<Params params={params} items={results} toggleIdle={toggleIdleTime} toggleExpand={toggleExpandAll} />
				} />
				<Route path="/charts" element={
					<NestingCharts date={date} items={results} />
				} />
				<Route path="/programs" element={
					<DataTable title="Įvykdytos programos" date={date} items={programResults} expand={params.expandAll} />
				} />
				<Route path="/alerts" element={
					<DataTable title="Sutrikimai" date={date} items={alertResults} expand={params.expandAll} />
				} />
				<Route path="/stats" element={
					<Stats stats={stats} loaded={loaded} />
				} />
			</Routes>
		</>
	);
}