"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProductCard } from "@/components/ProductCard"
import { useMarketplaceMock } from "@/lib/hooks/use-marketplace-mock"
import { useToast } from "@/components/ui/use-toast"

export default function MarketplacePage() {
  const { toast } = useToast()
  const { products, categories, isLoading } = useMarketplaceMock()
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [priceRange, setPriceRange] = useState([0, 100])
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter products when category or price range changes
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }

    // Filter by price range
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    setFilteredProducts(filtered)
  }, [products, activeCategory, priceRange])

  const handleAddToCart = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      })
    }
  }

  if (!mounted) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketplace</h1>

        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="mb-4 text-sm font-medium">Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-mobile"
                      checked={activeCategory === "all"}
                      onCheckedChange={() => setActiveCategory("all")}
                    />
                    <Label htmlFor="all-mobile">All</Label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${category.id}-mobile`}
                        checked={activeCategory === category.id}
                        onCheckedChange={() => setActiveCategory(category.id)}
                      />
                      <Label htmlFor={`${category.id}-mobile`}>
                        {category.name} ({category.count})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-medium">Price Range</h3>
                <Slider
                  defaultValue={[0, 100]}
                  max={100}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-sm font-medium">Categories</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="all"
                    checked={activeCategory === "all"}
                    onCheckedChange={() => setActiveCategory("all")}
                  />
                  <Label htmlFor="all">All</Label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={activeCategory === category.id}
                      onCheckedChange={() => setActiveCategory(category.id)}
                    />
                    <Label htmlFor={category.id}>
                      {category.name} ({category.count})
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium">Price Range</h3>
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange[0]}</span>
                <span className="text-sm">${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="study-guides" className="mb-8">
            <TabsList className="mx-auto flex w-full max-w-md justify-between">
              <TabsTrigger value="study-guides">Study Guides</TabsTrigger>
              <TabsTrigger value="checklists">Checklists</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-neutral-100" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold">No products found</h2>
              <p className="mt-2 text-neutral-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  author={product.author}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
