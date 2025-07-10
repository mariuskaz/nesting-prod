import { useCallback, useState } from "react";

const initialStats = {
	on: "00:00:00",
	off: "00:00:00",
	panels: 0,
	programs: 0,
	meters: 0.0,
	working: "00:00:00"
};

export default function useStats(date) {
	const [stats, setStats] = useState(initialStats);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchStats = useCallback(async (signal) => {
		setIsLoading(true);
		setError(null);
		try {
			console.log(new Date().toLocaleTimeString(), "fetching stats");
			const shortDate = new Intl.DateTimeFormat("lt-LT").format(date).replaceAll("-", ".");
			const response = await fetch("http://192.168.100.102/nesting/akron/stats.asp?" + shortDate, { signal });
			const data = await response.json();
			setStats({
				on: data.on ?? "00:00:00",
				off: data.off ?? "00:00:00",
				working: data.working ?? "00:00:00",
				panels: data.panels ?? 0,
				programs: data.programs ?? 0,
				meters: data.meters ?? 0.0,
			});
		} catch (e) {
			if (e.name !== "AbortError") {
				console.error("Stats fetch error:", e);
				setError(e);
			}		
		} finally {
			setIsLoading(false);
		}
	}, [date]);

	return { stats, isLoading, error, fetchStats };
}