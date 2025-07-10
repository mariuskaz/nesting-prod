import { useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import useNestingResults from "./Hooks/useNestingResults";
import useStats from "./Hooks/useStats";
import NestingCharts from "./Components/NestingCharts";
import DataTable from "./Components/DataTable";
import Sidebar from "./Components/Sidebar";
import Params from "./Components/Params";
import Stats from "./Components/Stats";

const ROUTES = ["/params", "/charts", "/programs", "/alerts", "/stats"];
const STATS = 4;

const initialParams = {
	calcIdleTime: true,
	expandAll: true   
};

export default function App() {
	const [date, setDate] = useState(new Date());
	const [updated, setUpdated] = useState(false);
	const [params, setParams] = useState(initialParams);

	const navigate = useNavigate();
	const location = useLocation();

	const { results, isLoading: isLoadingResults, fetchResults } = useNestingResults(date, params);
	const { stats, isLoading: isLoadingStats, fetchStats } = useStats(date);

	const loaded = !isLoadingResults && !isLoadingStats;

	const getViewIndex = useCallback(() => {
		const i = ROUTES.indexOf(location.pathname);
		return i === -1 ? 1 : i;
	}, [location.pathname]);

	const view = getViewIndex();
	const previousView = useRef();

	useEffect(() => {
		if (location.pathname === "/")
			navigate("/charts", { replace: true });
	}, [location.pathname, navigate]);

	useEffect(() => {
		if (view === STATS || previousView.current === STATS) setUpdated(false);
		previousView.current = view;
	}, [view]);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		const fetchData = async () => {
			view === STATS ? await fetchStats(signal) : await fetchResults();
			setUpdated(true);
		};

		if (!updated) fetchData();

		const interval = setInterval(() => {
			const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
			if (isToday) setUpdated(false);
		}, 5 * 60 * 1000);

		return () => {
			clearInterval(interval);
			controller.abort();
		};
	}, [date, view, updated, fetchResults, fetchStats]);

	const programResults = results.filter(i => i.status === "0");
	const alertResults = results.filter(i => i.status === "1");

	function handleDateChange(event) {
		const currentDate = new Date(event.target.value);
		if (!isNaN(currentDate)) {
			setDate(currentDate);
			setUpdated(false);
		}
		event.target.blur();
	};

	function handleSidebarChange(i) {
		navigate(ROUTES[i]);
	}

	function toggleIdleTime() {
		setParams(p => ({ ...p, calcIdleTime: !p.calcIdleTime }));
		setUpdated(false);
	};

	function toggleExpandAll() {
		setParams(p => ({ ...p, expandAll: !p.expandAll }));
	};

	const Loader = () => {
		return (!updated) ? <div className="dot-pulse" /> : null;
	};

	const DatePicker = ({ value, onChange }) => {
		const shortDate = value.toISOString().split("T")[0];
		return <input type="date" className="date-picker" value={shortDate} onChange={onChange} />;
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