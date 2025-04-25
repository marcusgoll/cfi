"use client"

import { useState, useEffect } from "react"

export type RecentReport = {
  id: string
  title: string
  date: string
  status: "Completed" | "Pending" | "In Progress"
  category: string
}

export type Notification = {
  id: string
  title: string
  time: string
  read: boolean
}

export type DashboardData = {
  metrics: {
    timeSaved: {
      value: number
      change: number
    }
    tokensSaved: {
      value: number
      change: number
    }
    projectsCompleted: {
      value: number
      count: number
    }
  }
  recentReports: RecentReport[]
  notifications: Notification[]
  isLoading: boolean
}

export function useDashboardMock(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    metrics: {
      timeSaved: { value: 0, change: 0 },
      tokensSaved: { value: 0, change: 0 },
      projectsCompleted: { value: 0, count: 0 },
    },
    recentReports: [],
    notifications: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData({
        metrics: {
          timeSaved: { value: 14.0, change: 3.5 },
          tokensSaved: { value: 3.6, change: 0.4 },
          projectsCompleted: { value: 1, count: 9 },
        },
        recentReports: [
          {
            id: "1",
            title: "PPL Checkride Preparation",
            date: "Apr 14, 2025",
            status: "Completed",
            category: "Flight Training",
          },
          {
            id: "2",
            title: "IFR Cross-Country Planning",
            date: "Apr 10, 2025",
            status: "Completed",
            category: "Navigation",
          },
          {
            id: "3",
            title: "Emergency Procedures Review",
            date: "Apr 8, 2025",
            status: "Pending",
            category: "Safety",
          },
          {
            id: "4",
            title: "Radio Communications Guide",
            date: "Apr 5, 2025",
            status: "In Progress",
            category: "Communications",
          },
        ],
        notifications: [
          {
            id: "1",
            title: "New student report submitted",
            time: "Just now",
            read: false,
          },
          {
            id: "2",
            title: "Student John Smith completed checkride",
            time: "2 hours ago",
            read: false,
          },
          {
            id: "3",
            title: "New instructor joined your organization",
            time: "Yesterday",
            read: true,
          },
        ],
        isLoading: false,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return data
}
