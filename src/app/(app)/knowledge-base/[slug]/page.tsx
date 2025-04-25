"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Home, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useKnowledgeBaseMock } from "@/lib/hooks/use-knowledge-base-mock"

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const { articles, isLoading } = useKnowledgeBaseMock(slug)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const article = articles[0]

  const handleFeedback = (helpful: boolean) => {
    toast({
      title: helpful ? "Thank you for your feedback!" : "We're sorry to hear that",
      description: helpful
        ? "We're glad this article was helpful."
        : "We'll use your feedback to improve our documentation.",
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100" />
        <div className="mt-8 h-96 animate-pulse rounded-md bg-neutral-100" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Article not found</h1>
          <p className="mt-4 text-neutral-600">The article you're looking for doesn't exist or has been moved.</p>
          <Button className="mt-6" asChild>
            <Link href="/knowledge-base">Back to Knowledge Base</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center text-sm text-neutral-500">
        <Link href="/" className="flex items-center hover:text-primary">
          <Home className="mr-1 h-4 w-4" />
          <span>Home</span>
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link href="/knowledge-base" className="hover:text-primary">
          Knowledge Base
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <Link href={`/knowledge-base?category=${article.categoryId}`} className="hover:text-primary">
          {article.categoryTitle}
        </Link>
        <ChevronRight className="mx-2 h-4 w-4" />
        <span className="truncate font-medium text-neutral-900">{article.title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main content */}
        <div className="lg:col-span-8">
          <article className="prose prose-blue max-w-none">
            <h1>{article.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }} />
          </article>

          {/* Feedback */}
          <div className="mt-12 border-t pt-6">
            <h3 className="text-lg font-medium">Was this article helpful?</h3>
            <div className="mt-4 flex gap-4">
              <Button variant="outline" onClick={() => handleFeedback(true)}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Yes, it was helpful
              </Button>
              <Button variant="outline" onClick={() => handleFeedback(false)}>
                <ThumbsDown className="mr-2 h-4 w-4" />
                No, I need more help
              </Button>
            </div>
          </div>
        </div>

        {/* Table of contents */}
        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-8">
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-4 font-medium">On this page</h3>
                <nav className="space-y-1">
                  {article.toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`block rounded-md px-3 py-2 text-sm hover:bg-neutral-100 ${
                        item.level === 1 ? "font-medium" : "pl-6"
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
