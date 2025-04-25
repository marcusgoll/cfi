"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  id: string
  title: string
  description: string
  price: number
  image: string
  author: string
  rating: number
  reviewCount: number
  onAddToCart?: (id: string) => void
  className?: string
}

export function ProductCard({
  id,
  title,
  description,
  price,
  image,
  author,
  rating,
  reviewCount,
  onAddToCart,
  className,
}: ProductCardProps) {
  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md", className)}>
      <div className="aspect-[3/2] w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">By {author}</p>
        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="text-lg font-bold text-primary">${price.toFixed(2)}</div>
        <Button size="sm" onClick={() => onAddToCart?.(id)}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
