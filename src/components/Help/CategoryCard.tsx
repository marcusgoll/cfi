import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookOpen, Upload, CreditCard, BarChart, Users, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  id: string
  title: string
  description: string
  icon: string
  articleCount: number
  className?: string
}

export function CategoryCard({ id, title, description, icon, articleCount, className }: CategoryCardProps) {
  const iconMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen className="h-6 w-6 text-primary" />,
    Upload: <Upload className="h-6 w-6 text-primary" />,
    CreditCard: <CreditCard className="h-6 w-6 text-primary" />,
    BarChart: <BarChart className="h-6 w-6 text-primary" />,
    Users: <Users className="h-6 w-6 text-primary" />,
    HelpCircle: <HelpCircle className="h-6 w-6 text-primary" />,
  }

  return (
    <Link href={`/knowledge-base/${id}`} className="block">
      <Card className={cn("h-full bg-white transition-shadow hover:shadow-sm", className)}>
        <CardContent className="flex flex-col p-6">
          <div className="mb-4">{iconMap[icon] || <BookOpen className="h-6 w-6 text-primary" />}</div>
          <h3 className="mb-2 text-lg font-semibold">{title}</h3>
          <p className="mb-4 flex-1 text-sm text-neutral-600">{description}</p>
          <div className="text-xs text-neutral-500">{articleCount} articles</div>
        </CardContent>
      </Card>
    </Link>
  )
}
