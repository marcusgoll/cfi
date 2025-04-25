import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: number
  subtitle?: string
  loading?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  subtitle,
  loading = false,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow-xs", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        {loading ? (
          <div className="mt-2 h-9 w-24 animate-pulse rounded-md bg-neutral-100" />
        ) : (
          <div className="mt-1">
            <div className="text-3xl font-bold text-primary">{value}</div>
            {subtitle && <div className="text-sm text-neutral-500">{subtitle}</div>}
            {typeof change !== "undefined" && (
              <p className="mt-2 text-xs text-neutral-600">
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
                  {change > 0 ? "+" : ""}
                  {change}
                </span>{" "}
                from last period
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
