"use client"

import { useState, useEffect } from "react"

export type Product = {
  id: string
  title: string
  description: string
  price: number
  category: "study-guides" | "checklists" | "templates"
  image: string
  author: string
  rating: number
  reviewCount: number
  featured?: boolean
}

export type MarketplaceData = {
  products: Product[]
  categories: {
    id: string
    name: string
    count: number
  }[]
  isLoading: boolean
}

export function useMarketplaceMock(category?: string): MarketplaceData {
  const [data, setData] = useState<MarketplaceData>({
    products: [],
    categories: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockProducts: Product[] = [
        {
          id: "1",
          title: "Private Pilot ACS Study Guide",
          description: "Comprehensive study guide for the Private Pilot Airplane Airman Certification Standards",
          price: 29.99,
          category: "study-guides",
          image: "/placeholder.svg?height=200&width=300",
          author: "John Smith",
          rating: 4.8,
          reviewCount: 124,
          featured: true,
        },
        {
          id: "2",
          title: "Instrument Rating Study Guide",
          description: "Complete study materials for the Instrument Rating ACS",
          price: 34.99,
          category: "study-guides",
          image: "/placeholder.svg?height=200&width=300",
          author: "Sarah Johnson",
          rating: 4.7,
          reviewCount: 98,
        },
        {
          id: "3",
          title: "Cessna 172 Checklist",
          description: "Digital checklist for Cessna 172 operations",
          price: 9.99,
          category: "checklists",
          image: "/placeholder.svg?height=200&width=300",
          author: "Michael Chen",
          rating: 4.9,
          reviewCount: 56,
        },
        {
          id: "4",
          title: "Piper PA-28 Checklist",
          description: "Digital checklist for Piper PA-28 operations",
          price: 9.99,
          category: "checklists",
          image: "/placeholder.svg?height=200&width=300",
          author: "Emily Rodriguez",
          rating: 4.6,
          reviewCount: 42,
        },
        {
          id: "5",
          title: "Flight Training Syllabus Template",
          description: "Customizable flight training syllabus for flight schools",
          price: 49.99,
          category: "templates",
          image: "/placeholder.svg?height=200&width=300",
          author: "David Wilson",
          rating: 4.5,
          reviewCount: 37,
          featured: true,
        },
        {
          id: "6",
          title: "Student Progress Tracking Template",
          description: "Excel template for tracking student progress through training",
          price: 19.99,
          category: "templates",
          image: "/placeholder.svg?height=200&width=300",
          author: "Jessica Lee",
          rating: 4.4,
          reviewCount: 28,
        },
        {
          id: "7",
          title: "Commercial Pilot Study Guide",
          description: "Study guide for the Commercial Pilot ACS",
          price: 39.99,
          category: "study-guides",
          image: "/placeholder.svg?height=200&width=300",
          author: "Robert Taylor",
          rating: 4.7,
          reviewCount: 65,
        },
        {
          id: "8",
          title: "Cirrus SR22 Checklist",
          description: "Digital checklist for Cirrus SR22 operations",
          price: 12.99,
          category: "checklists",
          image: "/placeholder.svg?height=200&width=300",
          author: "Amanda Martinez",
          rating: 4.8,
          reviewCount: 31,
        },
        {
          id: "9",
          title: "Flight Instructor Lesson Plan Template",
          description: "Template for creating effective flight instructor lesson plans",
          price: 24.99,
          category: "templates",
          image: "/placeholder.svg?height=200&width=300",
          author: "James Wilson",
          rating: 4.6,
          reviewCount: 42,
        },
      ]

      const mockCategories = [
        {
          id: "study-guides",
          name: "Study Guides",
          count: mockProducts.filter((p) => p.category === "study-guides").length,
        },
        { id: "checklists", name: "Checklists", count: mockProducts.filter((p) => p.category === "checklists").length },
        { id: "templates", name: "Templates", count: mockProducts.filter((p) => p.category === "templates").length },
      ]

      if (category) {
        setData({
          products: mockProducts.filter((p) => p.category === category),
          categories: mockCategories,
          isLoading: false,
        })
      } else {
        setData({
          products: mockProducts,
          categories: mockCategories,
          isLoading: false,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [category])

  return data
}
