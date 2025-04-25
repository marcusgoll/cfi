import type React from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change?: number
  loading?: boolean
  className?: string
}

export function StatsCard({ title, value, icon, change, loading = false, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {typeof change !== "undefined" && !loading && (
          <p className="text-xs text-muted-foreground">
            <span
              className={cn(
                "inline-flex items-center",
                change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "",
              )}
            >
              {change > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : change < 0 ? (
                <ArrowDown className="mr-1 h-3 w-3" />
              ) : null}
              {Math.abs(change)}%
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
