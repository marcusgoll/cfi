"use client"

import { useState } from "react"
import { Bell, Sun, Moon, Menu, User, Settings, LogOut, Shield, Users, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Sidebar } from "./Sidebar"
import { Badge } from "@/components/ui/badge"

export type UserRole = "none" | "student" | "instructor" | "admin" | "superadmin"

interface TopbarProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role?: UserRole
  } | null
  notifications?: {
    id: string
    title: string
    time: string
    read: boolean
  }[]
  onRoleChange?: (role: UserRole) => void
  currentRole?: UserRole
}

export function Topbar({ user, notifications = [], onRoleChange, currentRole = "none" }: TopbarProps) {
  const { setTheme, theme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  // Role configs with appropriate icons and labels
  const roleConfigs = {
    none: { icon: User, label: "Not Logged In", color: "bg-neutral-500" },
    student: { icon: User, label: "Student", color: "bg-blue-500" },
    instructor: { icon: Users, label: "Instructor", color: "bg-green-500" },
    admin: { icon: UserCog, label: "Admin", color: "bg-orange-500" },
    superadmin: { icon: Shield, label: "Super Admin", color: "bg-red-500" },
  }

  const handleRoleChange = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role)
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full flex h-14 items-center justify-between bg-white px-4 shadow-sm">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>

      <div className="lg:hidden">
        <Sidebar
          isMobile
          openMobile={sidebarOpen}
          setOpenMobile={setSidebarOpen}
          user={user}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Role Switcher for Development */}
      <div className="flex items-center justify-center mx-auto gap-2 px-4 py-1 rounded-full border bg-neutral-50">
        <span className="text-xs font-medium text-neutral-500 whitespace-nowrap">Dev Mode:</span>
        {Object.entries(roleConfigs).map(([role, config]) => (
          <Button
            key={role}
            size="sm"
            variant={currentRole === role ? "default" : "outline"}
            className="h-7 px-2 text-xs gap-1"
            onClick={() => handleRoleChange(role as UserRole)}
          >
            <config.icon className="h-3 w-3" />
            <span className="inline ml-1">{config.label}</span>
            {currentRole === role && (
              <span className={`h-2 w-2 rounded-full ${config.color}`} />
            )}
          </Button>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.time}</div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-3 text-center text-sm text-neutral-500">No notifications</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="pl-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex items-center gap-2">
              <span>My Account</span>
              {currentRole !== "none" && (
                <Badge variant="outline" className="ml-auto capitalize">
                  {currentRole}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
