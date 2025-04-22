import { useState, useEffect } from 'react';
import { fetchMock, useIsMock } from '@/lib/mock';

interface Notification {
    id: string;
    message: string;
    read: boolean;
    timestamp: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const isMock = useIsMock();

    useEffect(() => {
        async function loadNotifications() {
            if (isMock) {
                try {
                    const data = await fetchMock<Notification[]>('notifications');
                    setNotifications(data);
                } catch (error) {
                    console.error("Failed to load mock notifications:", error);
                    setNotifications([]);
                }
            } else {
                console.log("Fetching real notification data (not implemented)");
                setNotifications([]);
            }
        }

        loadNotifications();
    }, [isMock]);

    return { notifications };
} 