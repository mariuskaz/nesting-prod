import { useCallback, useState } from "react";

const LOCATIONS = [
    "http://192.168.100.102/nesting/snovar%2001/tpaprod/",
    "http://192.168.100.102/nesting/snovar%2002/tpaprod/",
    "http://192.168.100.102/nesting/snovar%2003/tpaprod/",
];

const PROGRAM_TYPE_MAP = {
    PRODUCTION:  /^\d{4}[-+]$|^SR\d+|^BF\d+/i,
    MAINTENANCE: /CINAVIM|NUTRAUKIM/i,
    BROKEN: /BR/i,
    SECOND_WORK: /_J[12]C/
};

export default function useNestingResults(date, params) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
        if (PROGRAM_TYPE_MAP.MAINTENANCE.test(filename)) return "Pagalbinė";
        if (PROGRAM_TYPE_MAP.BROKEN.test(filename)) return "Brokas";
        if (PROGRAM_TYPE_MAP.SECOND_WORK.test(filename)) return "II darbas";
        return "Kiti darbai";
    }, []);

    const fetchResults = useCallback(async (signal) => {
        setIsLoading(true);
        setError(null);
        const urls = getFileUrl();
        let data = [];

        try {
            await Promise.all(urls.map(async (url, index) => {
            try {
                const response = await fetch(url, { cache: "no-store", signal });
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
                if (e.name !== "AbortError") {
                    console.error("Data fetch error for", url, e);
                    setError(e);
                }
            }
            }));

            const fixedData = data.map(item => {
                if (item.type !== "Gamyba") return item;
                const same = data.filter(i => i.type === "Gamyba" && i.name === item.name);
                return { ...item, status: same.length === 1 ? "0" : item.status };
            });

            setResults(fixedData);
            console.log(new Date().toLocaleTimeString(), "nesting results:", fixedData.length);

        } catch (e) {
            if (e.name !== "AbortError") {
                setError(e);
                console.error("Fetch results error:", e);
            }

        } finally {
            setIsLoading(false);
        }

    }, [getFileUrl, getProgramType, params.calcIdleTime]);

  return { results, isLoading, error, fetchResults };
}