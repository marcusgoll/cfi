"use client"

import { useState, useEffect } from "react"

export type Testimonial = {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  quote: string
  rating: number
}

export type TestimonialsData = {
  testimonials: Testimonial[]
  isLoading: boolean
}

export function useTestimonialsMock(): TestimonialsData {
  const [data, setData] = useState<TestimonialsData>({
    testimonials: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockTestimonials: Testimonial[] = [
        {
          id: "1",
          name: "John Smith",
          role: "Chief Flight Instructor",
          company: "Skyward Flight Academy",
          avatar: "/placeholder.svg?height=80&width=80",
          quote:
            "CFIPros has revolutionized how we track student progress. The insights from test reports have helped us tailor our training programs and improve our pass rates by 15%.",
          rating: 5,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          role: "Independent CFI",
          company: "Johnson Flight Training",
          avatar: "/placeholder.svg?height=80&width=80",
          quote:
            "As an independent instructor, CFIPros has saved me countless hours of paperwork and analysis. I can focus more on teaching and less on administrative tasks.",
          rating: 5,
        },
        {
          id: "3",
          name: "Michael Chen",
          role: "Director of Operations",
          company: "Pacific Aviation Academy",
          avatar: "/placeholder.svg?height=80&width=80",
          quote:
            "The batch analysis feature is a game-changer for our flight school. We can quickly identify trends across multiple students and adjust our curriculum accordingly.",
          rating: 4,
        },
        {
          id: "4",
          name: "Emily Rodriguez",
          role: "Flight School Owner",
          company: "Altitude Flight School",
          avatar: "/placeholder.svg?height=80&width=80",
          quote:
            "CFIPros has become an essential tool for our instructors. The detailed analytics help us provide targeted training to our students, resulting in higher first-time pass rates.",
          rating: 5,
        },
        {
          id: "5",
          name: "David Wilson",
          role: "Aviation Department Chair",
          company: "Midwest Aviation College",
          avatar: "/placeholder.svg?height=80&width=80",
          quote:
            "We've integrated CFIPros into our collegiate aviation program with great success. The data-driven insights have helped us refine our curriculum and better prepare students for their careers.",
          rating: 4,
        },
      ]

      setData({
        testimonials: mockTestimonials,
        isLoading: false,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return data
}
