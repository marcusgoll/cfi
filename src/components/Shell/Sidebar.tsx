"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Gauge,
  ListChecks,
  Settings,
  Search,
  Layers,
  UsersRound,
  LogOut,
  BarChart2,
  HelpCircle,
  Keyboard,
  KeyRound,
  User,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarItem } from "./SidebarItem"
import { type UserRole } from "./Topbar" // Import UserRole type

interface SidebarProps {
  isMobile?: boolean
  openMobile?: boolean
  setOpenMobile?: (open: boolean) => void
  user?: {
    name: string
    email: string
    avatar?: string
    role?: UserRole // Add role to user prop
  } | null
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({
  isMobile = false,
  openMobile = false,
  setOpenMobile,
  user,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const userRole = user?.role || "none"

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const mainLinks = [
    {
      title: "Dashboard",
      icon: Gauge,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
      roles: ["student", "instructor", "admin", "superadmin"],
    },
    {
      title: "Analytics",
      icon: BarChart2,
      href: "/analytics",
      isActive: pathname.startsWith("/analytics"),
      roles: ["instructor", "admin", "superadmin"], // Only for instructor and admin roles
    },
    {
      title: "Students",
      icon: UsersRound,
      href: "/students",
      isActive: pathname === "/students",
      roles: ["instructor", "admin", "superadmin"], // Usually for instructor/admin
    },
    {
      title: "Saved Reports",
      icon: ListChecks,
      href: "/reports",
      isActive: pathname === "/reports",
      roles: ["instructor", "admin", "superadmin"], // Usually for instructor/admin
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      isActive: pathname.startsWith("/settings"),
      roles: ["student", "instructor", "admin", "superadmin"],
    },
  ]

  const resourceLinks = [
    {
      title: "ACS Code Extractor",
      icon: Code,
      href: "/tools/extractor",
      isActive: pathname === "/tools/extractor",
      roles: ["student", "instructor", "admin", "superadmin"],
    },
    {
      title: "Simulations",
      icon: Search,
      href: "/simulations",
      isActive: pathname === "/simulations",
      badge: "soon" as const,
      roles: ["student", "instructor", "admin", "superadmin"],
    },
    {
      title: "Marketplace",
      icon: Layers,
      href: "/marketplace",
      isActive: pathname === "/marketplace",
      badge: "soon" as const,
      roles: ["student", "instructor", "admin", "superadmin"],
    },
    {
      title: "Community",
      icon: UsersRound,
      href: "/community",
      isActive: pathname === "/community",
      roles: ["student", "instructor", "admin", "superadmin"],
    },
  ]

  const SidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col bg-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className={cn(
          "flex items-center gap-2",
          isCollapsed ? "justify-center w-full" : ""
        )}>
          <div className="rounded-md bg-primary p-1">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && <span className="font-heading text-xl">CFIPros</span>}
        </Link>
        {/* Only show top toggle button when NOT collapsed */}
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse sidebar"
            aria-expanded={!isCollapsed}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-auto px-2 py-4">
        <nav className="space-y-1">
          {mainLinks
            .filter(link => link.roles.includes(userRole))
            .map((link) => (
              <SidebarItem
                key={link.title}
                icon={link.icon}
                title={link.title}
                href={link.href}
                isActive={link.isActive}
                isCollapsed={isCollapsed}
              />
            ))}
        </nav>

        {/* Resources section */}
        <div className="mt-6">
          {!isCollapsed && <h3 className="mb-2 pl-4 text-xs font-medium uppercase text-neutral-500">Resources</h3>}
          <nav className="space-y-1">
            {resourceLinks
              .filter(link => link.roles.includes(userRole))
              .map((link) => (
                <SidebarItem
                  key={link.href}
                  icon={link.icon}
                  title={link.title}
                  href={link.href}
                  isActive={link.isActive}
                  isCollapsed={isCollapsed}
                  badge={link.badge}
                />
              ))}
          </nav>
        </div>
      </div>

      {/* User section - DropdownMenu */}
      <div className={cn("border-t p-4 mt-auto")}>
        {/* Add toggle button above user avatar when collapsed */}
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 mx-auto flex h-8 w-8"
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand sidebar"
            aria-expanded={!isCollapsed}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          {!isCollapsed ? (
            // Expanded View Trigger
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-auto w-full items-center justify-start p-0 hover:bg-transparent">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="ml-2 text-left text-sm">
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-neutral-500">Pro Member</p> { /* TODO: Use actual role/status */}
                </div>
              </Button>
            </DropdownMenuTrigger>
          ) : (
            // Collapsed View Trigger
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex h-10 w-10 items-center justify-center rounded-full mx-auto">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent sideOffset={10} align={isCollapsed ? "start" : "end"} className="w-64">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/billing" className="flex items-center cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/support" className="flex items-center cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/api-keys" className="flex items-center cursor-pointer">{/* TODO: Update href */}
                <KeyRound className="mr-2 h-4 w-4" />
                <span>API Keys</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard shortcuts</span>
              {/* TODO: Add command palette trigger? <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/signout" className="flex items-center cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile} direction="left">
        <DrawerContent className="fixed inset-y-0 left-0 h-full w-64 p-0">
          <DrawerHeader className="p-0">
            <DrawerTitle className="sr-only">Navigation</DrawerTitle>
            <DrawerClose className="absolute right-2 top-2" />
          </DrawerHeader>
          {SidebarContent}
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop sidebar - Re-apply fixed positioning and height
  return (
    <aside
      className={cn(
        "hidden lg:block fixed top-0 left-0 h-screen z-40",
        isCollapsed ? "w-20" : "w-64",
        "transition-all duration-300 ease-in-out"
      )}
      aria-label="Sidebar"
    >
      {SidebarContent}
    </aside>
  )
}
