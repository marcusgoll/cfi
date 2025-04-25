"use client"

import { useEffect, useState } from "react"
import { SearchBar } from "@/components/Help/SearchBar"
import { CategoryCard } from "@/components/Help/CategoryCard"
import { useKnowledgeBaseMock } from "@/lib/hooks/use-knowledge-base-mock"

export default function KnowledgeBasePage() {
  const { categories, isLoading } = useKnowledgeBaseMock()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCategories, setFilteredCategories] = useState(categories)
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (searchQuery) {
      setFilteredCategories(
        categories.filter(
          (category) =>
            category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredCategories(categories)
    }
  }, [searchQuery, categories])

  if (!mounted) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Knowledge Base</h1>
        <p className="mt-2 text-lg text-neutral-600">Find answers to common questions about CFIPros</p>
        <div className="mx-auto mt-6 max-w-xl">
          <SearchBar onSearch={setSearchQuery} placeholder="Search for help articles..." />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-neutral-100" />
          ))}
        </div>
      ) : (
        <>
          {filteredCategories.length === 0 ? (
            <div className="mt-12 text-center">
              <h2 className="text-xl font-semibold">No results found</h2>
              <p className="mt-2 text-neutral-600">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  articleCount={category.articleCount}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
