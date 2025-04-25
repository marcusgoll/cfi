"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useBlogMock } from "@/lib/hooks/use-blog-mock"

export default function BlogPage() {
  const { posts, categories, isLoading } = useBlogMock()
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter posts when category changes
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredPosts(posts)
    } else {
      setFilteredPosts(posts.filter((post) => post.category === activeCategory))
    }
  }, [posts, activeCategory])

  if (!mounted) return null

  const featuredPost = posts.find((post) => post.featured)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Insights & Updates</h1>
        <p className="mt-2 text-lg text-neutral-600">The latest news and articles from CFIPros</p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={activeCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("All")}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-xl bg-neutral-100" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold">No posts found</h2>
          <p className="mt-2 text-neutral-600">Try selecting a different category</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured post */}
          {featuredPost && activeCategory === "All" && (
            <Link href={`/blog/${featuredPost.slug}`} className="block">
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-[21/9] w-full overflow-hidden">
                  <img
                    src={featuredPost.coverImage || "/placeholder.svg"}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-2">{featuredPost.category}</Badge>
                  <h2 className="mb-2 text-2xl font-bold">{featuredPost.title}</h2>
                  <p className="mb-4 text-neutral-600">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Post grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts
              .filter((post) => (activeCategory === "All" ? !post.featured : true))
              .map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full">
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.coverImage || "/placeholder.svg"}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="flex h-[calc(100%-33.33%)] flex-col p-4">
                      <Badge className="mb-2 w-fit">{post.category}</Badge>
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold">{post.title}</h3>
                      <p className="mb-4 flex-1 text-sm text-neutral-600 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
