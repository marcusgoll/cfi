import Link from "next/link";
import {
    LayoutDashboard, // Dashboard
    Users,          // Students
    BarChart3,      // Reports
    AreaChart,      // Analytics
    Settings,       // Settings
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/students", label: "Students", icon: Users },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    { href: "/dashboard/analytics", label: "Analytics", icon: AreaChart },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    // TODO: Add active link styling based on current route
    // TODO: Implement mobile collapse logic (AC3) - Handled in Topbar Sheet
    return (
        <div className="flex flex-col w-64 h-full bg-white dark:bg-neutral-800 border-r dark:border-neutral-700">
            <div className="flex items-center justify-center h-16 border-b dark:border-neutral-700 flex-shrink-0">
                <span className="text-xl font-semibold text-gray-800 dark:text-white">CFI Pros</span>
                {/* Placeholder for Logo */}
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                ))}
            </nav>
            {/* Optional Footer? */}
        </div>
    );
} 