"use client"

import { useState, useEffect } from "react"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: {
    name: string
    avatar: string
    bio: string
    social: {
      twitter?: string
      linkedin?: string
      website?: string
    }
  }
  publishedAt: string
  featured?: boolean
  toc?: {
    id: string
    title: string
    level: number
  }[]
}

export type BlogData = {
  posts: BlogPost[]
  categories: string[]
  isLoading: boolean
}

export function useBlogMock(slug?: string, category?: string): BlogData {
  const [data, setData] = useState<BlogData>({
    posts: [],
    categories: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockPosts: BlogPost[] = [
        {
          id: "1",
          slug: "maximizing-student-success-with-data-driven-flight-training",
          title: "Maximizing Student Success with Data-Driven Flight Training",
          excerpt:
            "Learn how to use data analytics to improve your flight training program and increase student success rates.",
          content: `
# Maximizing Student Success with Data-Driven Flight Training

In today's competitive aviation training environment, flight schools and independent CFIs are constantly looking for ways to improve their training programs and increase student success rates. One of the most effective approaches is to implement data-driven flight training methods.

## What is Data-Driven Flight Training?

Data-driven flight training involves collecting, analyzing, and acting upon student performance data to optimize training outcomes. Instead of relying solely on instructor intuition or traditional methods, data-driven approaches use objective metrics to identify patterns, strengths, and weaknesses in student performance.

### Key Benefits

- **Personalized Training Plans**: Tailor instruction to address specific student weaknesses
- **Improved Pass Rates**: Focus on areas commonly failed in checkrides
- **Reduced Training Time**: Eliminate unnecessary repetition of mastered skills
- **Enhanced Student Confidence**: Provide clear evidence of progress and improvement

## Implementing Data-Driven Methods

### 1. Establish Clear Metrics

The first step in implementing data-driven flight training is to establish clear, measurable metrics for student performance. These might include:

- Knowledge test scores and missed question categories
- Maneuver proficiency ratings
- Time to solo
- Checkride pass rates
- Common areas of difficulty

### 2. Collect Comprehensive Data

Consistent data collection is essential. Consider using:

- Digital logbooks and training records
- Standardized grading rubrics for maneuvers
- Regular knowledge assessments
- Student self-evaluations
- CFI observations and notes

### 3. Analyze Performance Patterns

Look for patterns in the data that can inform your training approach:

- Are certain concepts consistently challenging for multiple students?
- Do specific maneuvers require more practice time than others?
- Are there correlations between ground knowledge deficiencies and flight performance?
- How do weather conditions affect student progress?

### 4. Develop Targeted Interventions

Based on your analysis, develop targeted interventions:

- Create supplemental study materials for commonly missed knowledge areas
- Adjust the sequence of flight maneuvers based on difficulty patterns
- Implement specialized training exercises for challenging concepts
- Develop pre-flight preparation checklists for areas of weakness

## Case Study: Western Flight Academy

Western Flight Academy implemented a data-driven approach to their private pilot training program and saw remarkable results:

- 15% increase in first-time checkride pass rates
- 12% reduction in average training time to checkride
- 25% improvement in student satisfaction scores
- 20% growth in new student enrollments due to improved reputation

## Tools for Data-Driven Flight Training

Several tools can help implement data-driven flight training:

- **CFIPros**: Comprehensive analytics for FAA knowledge test results
- **Digital logbook platforms**: Track flight time and maneuver proficiency
- **Learning management systems**: Organize and track ground school progress
- **Student progress dashboards**: Visualize improvement over time

## Conclusion

Data-driven flight training represents the future of aviation education. By collecting and analyzing student performance data, flight schools and CFIs can create more effective, efficient, and personalized training experiences. The result is higher pass rates, reduced training costs, and more confident, competent pilots.

Start small by implementing one or two data collection methods, then gradually expand your approach as you become more comfortable with data analysis. Your students—and your business—will thank you for it.
          `,
          coverImage: "/placeholder.svg?height=400&width=800",
          category: "Aviation Training",
          author: {
            name: "John Smith",
            avatar: "/placeholder.svg?height=80&width=80",
            bio: "John is a Master CFI with over 5,000 hours of instruction given. He specializes in using technology to improve flight training outcomes.",
            social: {
              twitter: "https://twitter.com/johnsmith",
              linkedin: "https://linkedin.com/in/johnsmith",
            },
          },
          publishedAt: "2025-04-15",
          featured: true,
          toc: [
            { id: "1", title: "Maximizing Student Success with Data-Driven Flight Training", level: 1 },
            { id: "2", title: "What is Data-Driven Flight Training?", level: 2 },
            { id: "3", title: "Key Benefits", level: 3 },
            { id: "4", title: "Implementing Data-Driven Methods", level: 2 },
            { id: "5", title: "Establish Clear Metrics", level: 3 },
            { id: "6", title: "Collect Comprehensive Data", level: 3 },
            { id: "7", title: "Analyze Performance Patterns", level: 3 },
            { id: "8", title: "Develop Targeted Interventions", level: 3 },
            { id: "9", title: "Case Study: Western Flight Academy", level: 2 },
            { id: "10", title: "Tools for Data-Driven Flight Training", level: 2 },
            { id: "11", title: "Conclusion", level: 2 },
          ],
        },
        {
          id: "2",
          slug: "five-ways-to-improve-your-ground-instruction",
          title: "Five Ways to Improve Your Ground Instruction",
          excerpt:
            "Effective ground instruction is crucial for student success. Here are five proven methods to enhance your teaching.",
          content: "Full blog post content here...",
          coverImage: "/placeholder.svg?height=400&width=800",
          category: "Tips",
          author: {
            name: "Sarah Johnson",
            avatar: "/placeholder.svg?height=80&width=80",
            bio: "Sarah is a flight instructor and educational consultant specializing in aviation training methodologies.",
            social: {
              twitter: "https://twitter.com/sarahjohnson",
              website: "https://sarahjohnson.com",
            },
          },
          publishedAt: "2025-04-10",
        },
        {
          id: "3",
          slug: "introducing-batch-analysis-for-flight-schools",
          title: "Introducing Batch Analysis for Flight Schools",
          excerpt:
            "Our new batch analysis feature helps flight schools process multiple test reports at once. Learn how it works.",
          content: "Full blog post content here...",
          coverImage: "/placeholder.svg?height=400&width=800",
          category: "Product",
          author: {
            name: "Michael Chen",
            avatar: "/placeholder.svg?height=80&width=80",
            bio: "Michael is the product manager for CFIPros and a private pilot.",
            social: {
              linkedin: "https://linkedin.com/in/michaelchen",
            },
          },
          publishedAt: "2025-04-05",
        },
        {
          id: "4",
          slug: "preparing-students-for-checkride-success",
          title: "Preparing Students for Checkride Success",
          excerpt:
            "A comprehensive guide to preparing your students for their checkride, from knowledge test to practical exam.",
          content: "Full blog post content here...",
          coverImage: "/placeholder.svg?height=400&width=800",
          category: "Aviation Training",
          author: {
            name: "Emily Rodriguez",
            avatar: "/placeholder.svg?height=80&width=80",
            bio: "Emily is a DPE and former chief instructor with over 10,000 hours of flight time.",
            social: {
              linkedin: "https://linkedin.com/in/emilyrodriguez",
              website: "https://emilyrodriguez.com",
            },
          },
          publishedAt: "2025-03-28",
        },
        {
          id: "5",
          slug: "cfipros-spring-update-new-features",
          title: "CFIPros Spring Update: New Features and Improvements",
          excerpt: "Check out the latest features and improvements we've added to CFIPros this spring.",
          content: "Full blog post content here...",
          coverImage: "/placeholder.svg?height=400&width=800",
          category: "Product",
          author: {
            name: "David Wilson",
            avatar: "/placeholder.svg?height=80&width=80",
            bio: "David is the CEO of CFIPros and a commercial pilot.",
            social: {
              twitter: "https://twitter.com/davidwilson",
              linkedin: "https://linkedin.com/in/davidwilson",
            },
          },
          publishedAt: "2025-03-20",
        },
      ]

      const categories = Array.from(new Set(mockPosts.map((post) => post.category)))

      if (slug) {
        const post = mockPosts.find((p) => p.slug === slug)
        setData({
          posts: post ? [post] : [],
          categories,
          isLoading: false,
        })
      } else if (category && category !== "All") {
        setData({
          posts: mockPosts.filter((p) => p.category === category),
          categories,
          isLoading: false,
        })
      } else {
        setData({
          posts: mockPosts,
          categories,
          isLoading: false,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [slug, category])

  return data
}
