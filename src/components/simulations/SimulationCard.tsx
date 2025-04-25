import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SimulationMeta } from "@/lib/hooks/use-simulations-mock"

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800 hover:bg-green-200",
  Intermediate: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  Advanced: "bg-red-100 text-red-800 hover:bg-red-200",
}

export function SimulationCard({ simulation }: { simulation: SimulationMeta }) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={simulation.coverImage || "/placeholder.svg"}
          alt={`Illustration for ${simulation.title}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold">{simulation.title}</h3>
          <Badge variant="outline" className={difficultyColors[simulation.difficulty] || "bg-gray-100"}>
            {simulation.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3">{simulation.description}</p>
        <div className="flex flex-wrap gap-2">
          {simulation.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button asChild className="flex-1">
          <Link href={`/simulations/${simulation.slug}`}>
            Launch
            <ArrowUpRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/simulations/${simulation.slug}?mode=teach`}>
            <Users className="mr-1.5 h-4 w-4" />
            Teach
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
