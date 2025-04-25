"use client"

import { useState, useEffect } from "react"

export type AnalyticsData = {
  passRate: {
    passed: number
    failed: number
    percentage: number
  }
  averageScores: {
    labels: string[]
    data: number[]
  }
  topDeficiencies: {
    name: string
    count: number
    percentage: number
  }[]
  studentCounts: {
    total: number
    active: number
    inactive: number
  }
  isLoading: boolean
}

export function useAnalyticsMock(): AnalyticsData {
  const [data, setData] = useState<AnalyticsData>({
    passRate: {
      passed: 0,
      failed: 0,
      percentage: 0,
    },
    averageScores: {
      labels: [],
      data: [],
    },
    topDeficiencies: [],
    studentCounts: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData({
        passRate: {
          passed: 42,
          failed: 8,
          percentage: 84,
        },
        averageScores: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [82, 85, 83, 87, 89, 91],
        },
        topDeficiencies: [
          {
            name: "Emergency Procedures",
            count: 12,
            percentage: 28,
          },
          {
            name: "Radio Communications",
            count: 10,
            percentage: 24,
          },
          {
            name: "Instrument Scanning",
            count: 8,
            percentage: 19,
          },
          {
            name: "Crosswind Landings",
            count: 7,
            percentage: 17,
          },
          {
            name: "Holding Patterns",
            count: 5,
            percentage: 12,
          },
        ],
        studentCounts: {
          total: 50,
          active: 42,
          inactive: 8,
        },
        isLoading: false,
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return data
}
