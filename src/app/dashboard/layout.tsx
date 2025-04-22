import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-neutral-900">
            {/* Static Sidebar for larger screens */}
            <div className="hidden md:flex md:flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Topbar includes mobile navigation toggle */}
                <Topbar />
                {/* Main content area */}
                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 