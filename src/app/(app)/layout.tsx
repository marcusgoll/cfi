"use client" // Layouts often need client-side interactivity (state for sidebar, etc.)

import { Sidebar } from "@/components/Shell/Sidebar"
import { Topbar, type UserRole } from "@/components/Shell/Topbar"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { useDashboardMock } from "@/lib/hooks/use-dashboard-mock"
import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Removed unused notification data fetching
    // const { notifications } = useDashboardMock()
    const [currentRole, setCurrentRole] = useState<UserRole>("student")
    const [user, setUser] = useState<{
        name: string;
        email: string;
        avatar: string;
        role: UserRole;
    } | null>({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "student" as UserRole
    })

    const [isCollapsed, setIsCollapsed] = useState(false)

    const handleRoleChange = (role: UserRole) => {
        setCurrentRole(role)
        // Save role to localStorage for persistence and access from other components
        localStorage.setItem("userRole", role)

        // Update user data based on role
        if (role === "none") {
            setUser(null)
        } else {
            const userData = {
                name: role === "student" ? "John Student" :
                    role === "instructor" ? "Jane Instructor" :
                        role === "admin" ? "Admin User" :
                            "Super Admin",
                email: `${role}@example.com`,
                avatar: `/placeholder.svg?height=32&width=32`,
                role: role,
            }
            setUser(userData)
        }
    }

    // Set initial role in localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("userRole", currentRole)
        }
    }, [currentRole])

    return (
        <div className="flex min-h-screen flex-col">
            {/* Topbar - full width at the top */}
            <Topbar
                user={user}
                currentRole={currentRole}
                onRoleChange={handleRoleChange}
            />

            <div className="flex flex-1">
                {/* Sidebar is fixed with lg:w-64 or lg:w-20 */}
                <Sidebar user={user} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

                {/* Main content area with padding adjusted for the sidebar state */}
                <div className={cn(
                    "flex flex-1 flex-col bg-muted/30",
                    isCollapsed ? "lg:pl-20" : "lg:pl-64",
                    "transition-all duration-300 ease-in-out"
                )}>
                    {/* Apply gradient and padding to ScrollArea instead of main */}
                    <ScrollArea className="flex-1 w-full bg-gradient-to-br from-sky-50/95 via-blue-50/40 to-slate-50/80 p-4 pt-6 md:p-6 dark:bg-slate-950 dark:bg-none sm:pt-6">
                        {/* Remove classes from main, keep it simple or remove entirely if page root is main */}
                        <main className="flex-1">
                            {/* Page content is rendered here */}
                            {children}
                        </main>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
} 