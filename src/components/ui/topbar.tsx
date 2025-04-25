"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useSessionMock } from "@/lib/hooks/use-session-mock"

export function Topbar() {
  const { user } = useSessionMock()
  const [notificationCount] = useState(3)

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New student report submitted",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      title: "Student John Smith completed checkride",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "New instructor joined your organization",
      time: "Yesterday",
      read: false,
    },
  ]

  return (
    <div className="flex h-14 items-center justify-between border-b bg-white px-4">
      <div className="lg:w-60">
        {/* Mobile logo - shown only on mobile when sidebar is hidden */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="rounded-md bg-primary p-1">
            <Link href="/dashboard">
              <span className="sr-only">CFIPros Dashboard</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" />
              </svg>
            </Link>
          </div>
          <span className="font-heading text-xl">CFIPros</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-secondary p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                <div className="font-medium">{notification.title}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link href="/dashboard/notifications" className="w-full text-center text-sm font-medium text-primary">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-sm md:flex">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.organizationName}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
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
    </div>
  )
}
