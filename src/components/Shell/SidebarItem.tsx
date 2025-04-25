"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarItemProps {
  icon: LucideIcon
  title: string
  href: string
  isActive?: boolean
  isCollapsed?: boolean
  badge?: "new" | "soon"
  onClick?: () => void
}

export function SidebarItem({
  icon: Icon,
  title,
  href,
  isActive = false,
  isCollapsed = false,
  badge,
  onClick,
}: SidebarItemProps) {
  // Determine if link should be disabled (when badge is "soon")
  const isDisabled = badge === "soon"

  const linkContent = (
    <div
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
        isCollapsed && "justify-center",
        isDisabled && "opacity-60 cursor-not-allowed hover:bg-transparent"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed ? "mr-0" : "mr-2")} />
      {!isCollapsed && (
        <div className="flex flex-1 items-center justify-between">
          <span className="truncate">{title}</span>
          {badge && (
            <span
              className={cn(
                "ml-2 flex h-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] uppercase",
                badge === "new"
                  ? "bg-primary/10 text-primary"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
              )}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {isDisabled ? (
              <div className="block">{linkContent}</div>
            ) : (
              <Link href={href} aria-current={isActive ? "page" : undefined} className="block">
                {linkContent}
              </Link>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" align="start" className="flex items-center gap-2">
            {title}
            {badge && (
              <span
                className={cn(
                  "flex h-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] uppercase",
                  badge === "new"
                    ? "bg-primary/10 text-primary"
                    : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
                )}
              >
                {badge}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Render a div instead of a Link when disabled
  if (isDisabled) {
    return <div className="block">{linkContent}</div>
  }

  return (
    <Link href={href} aria-current={isActive ? "page" : undefined} className="block">
      {linkContent}
    </Link>
  )
}
