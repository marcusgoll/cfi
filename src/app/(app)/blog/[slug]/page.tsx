"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Twitter, Linkedin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useBlogMock } from "@/lib/hooks/use-blog-mock"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { posts, isLoading } = useBlogMock(slug)
  const [showToc, setShowToc] = useState(false)
  const [activeHeading, setActiveHeading] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Show/hide TOC based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setShowToc(scrollPosition > 300)

      // Update active heading based on scroll position
      if (contentRef.current && posts[0]?.toc) {
        const headings = contentRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")

        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i]
          const rect = heading.getBoundingClientRect()

          if (rect.top <= 100) {
            setActiveHeading(heading.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [posts])

  if (!mounted) return null

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-64 animate-pulse rounded-md bg-neutral-100" />
        <div className="mt-8 h-96 animate-pulse rounded-md bg-neutral-100" />
      </div>
    )
  }

  const post = posts[0]

  if (!post) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <p className="mt-4 text-neutral-600">The post you're looking for doesn't exist or has been moved.</p>
          <Button className="mt-6" asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero banner */}
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <div className="relative">
          {/* Main content */}
          <article className="prose prose-lg mx-auto max-w-3xl pb-16">
            <h1>{post.title}</h1>

            <div className="flex items-center gap-2 text-sm text-neutral-500 not-prose">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>

            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br />") }} />

            {/* Author bio */}
            <div className="mt-12 rounded-xl border p-6 not-prose">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{post.author.name}</h3>
                  <p className="text-neutral-600">{post.author.bio}</p>

                  <div className="mt-2 flex gap-2">
                    {post.author.social.twitter && (
                      <a
                        href={post.author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-primary"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                    {post.author.social.linkedin && (
                      <a
                        href={post.author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-primary"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                    {post.author.social.website && (
                      <a
                        href={post.author.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-500 hover:text-primary"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Table of contents */}
          {post.toc && showToc && (
            <div className="fixed right-8 top-32 hidden xl:block">
              <Card className="w-64">
                <CardContent className="p-4">
                  <h3 className="mb-4 font-medium">On this page</h3>
                  <nav className="space-y-1">
                    {post.toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className={`block rounded-md px-3 py-2 text-sm hover:bg-neutral-100 ${
                          activeHeading === item.title.toLowerCase().replace(/\s+/g, "-")
                            ? "bg-primary/10 text-primary"
                            : ""
                        } ${item.level === 1 ? "font-medium" : item.level === 2 ? "" : "pl-6 text-sm"}`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
