"use client"

import { useState, useEffect } from "react"

export type DashboardStats = {
  students: {
    count: number
    change: number
  }
  reports: {
    count: number
    change: number
  }
  avgScore: {
    value: number
    change: number
  }
  weakAreas: {
    areas: string[]
    count: number
  }
  isLoading: boolean
}

export function useDashboardStatsMock(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    students: { count: 0, change: 0 },
    reports: { count: 0, change: 0 },
    avgScore: { value: 0, change: 0 },
    weakAreas: { areas: [], count: 0 },
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setStats({
        students: { count: 42, change: 8 },
        reports: { count: 156, change: -3 },
        avgScore: { value: 87, change: 2 },
        weakAreas: {
          areas: ["Emergency Procedures", "Radio Communications", "Instrument Scanning"],
          count: 3,
        },
        isLoading: false,
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return stats
}
