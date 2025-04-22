import { useState, useEffect } from 'react';
import { fetchMock, useIsMock } from '@/lib/mock';

interface Report {
    id: string;
    title: string;
    generated_date: string;
    type: string;
}

export function useReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const isMock = useIsMock();

    useEffect(() => {
        async function loadReports() {
            if (isMock) {
                try {
                    const data = await fetchMock<Report[]>('reports');
                    setReports(data);
                } catch (error) {
                    console.error("Failed to load mock reports:", error);
                    setReports([]);
                }
            } else {
                console.log("Fetching real report data (not implemented)");
                setReports([]);
            }
        }

        loadReports();
    }, [isMock]);

    return { reports };
} 