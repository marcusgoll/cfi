import { useState, useEffect } from 'react';
import { fetchMock, useIsMock } from '@/lib/mock';

// Define a basic Student type (adjust as needed based on actual data)
interface Student {
    id: string;
    name: string;
    grade: string;
    last_login: string;
}

export function useStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const isMock = useIsMock();

    useEffect(() => {
        async function loadStudents() {
            if (isMock) {
                try {
                    const data = await fetchMock<Student[]>('students');
                    setStudents(data);
                } catch (error) {
                    console.error("Failed to load mock students:", error);
                    setStudents([]); // Set empty on error
                }
            } else {
                // TODO: Implement real API fetch
                console.log("Fetching real student data (not implemented)");
                setStudents([]); // Placeholder
            }
        }

        loadStudents();
    }, [isMock]); // Re-run if mock status changes

    return { students };
} 