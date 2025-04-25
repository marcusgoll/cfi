"use client"

import { useState, useEffect } from "react"

export type BatchReport = {
  id: string
  studentName: string
  examTitle: string
  score: number
  passingScore: number
  weakestArea: string
  date: string
}

export type BatchData = {
  id: string
  title: string
  date: string
  reportCount: number
  metrics: {
    averageScore: number
    highestScore: number
    lowestScore: number
    passRate: number
  }
  reports: BatchReport[]
  isLoading: boolean
}

export function useBatchMock(batchId?: string): BatchData {
  const [data, setData] = useState<BatchData>({
    id: "",
    title: "",
    date: "",
    reportCount: 0,
    metrics: {
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0,
    },
    reports: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockReports: BatchReport[] = [
        {
          id: "1",
          studentName: "Alex Johnson",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 82,
          passingScore: 70,
          weakestArea: "Airspace",
          date: "2025-04-15",
        },
        {
          id: "2",
          studentName: "Sarah Williams",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 90,
          passingScore: 70,
          weakestArea: "Weather Information",
          date: "2025-04-15",
        },
        {
          id: "3",
          studentName: "Michael Chen",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 75,
          passingScore: 70,
          weakestArea: "Emergency Operations",
          date: "2025-04-15",
        },
        {
          id: "4",
          studentName: "Emily Rodriguez",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 68,
          passingScore: 70,
          weakestArea: "Aeronautical Decision-Making",
          date: "2025-04-15",
        },
        {
          id: "5",
          studentName: "David Kim",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 85,
          passingScore: 70,
          weakestArea: "Performance and Limitations",
          date: "2025-04-15",
        },
        {
          id: "6",
          studentName: "Jessica Lee",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 92,
          passingScore: 70,
          weakestArea: "Navigation Systems",
          date: "2025-04-15",
        },
        {
          id: "7",
          studentName: "Robert Taylor",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 78,
          passingScore: 70,
          weakestArea: "Airport Operations",
          date: "2025-04-15",
        },
        {
          id: "8",
          studentName: "Amanda Martinez",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 65,
          passingScore: 70,
          weakestArea: "Airspace",
          date: "2025-04-15",
        },
        {
          id: "9",
          studentName: "James Wilson",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 88,
          passingScore: 70,
          weakestArea: "Weight and Balance",
          date: "2025-04-15",
        },
        {
          id: "10",
          studentName: "Sophia Garcia",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 72,
          passingScore: 70,
          weakestArea: "Night Operations",
          date: "2025-04-15",
        },
        {
          id: "11",
          studentName: "Daniel Brown",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 95,
          passingScore: 70,
          weakestArea: "Postflight Procedures",
          date: "2025-04-15",
        },
        {
          id: "12",
          studentName: "Olivia Thompson",
          examTitle: "Private Pilot - Airplane (PAR)",
          score: 63,
          passingScore: 70,
          weakestArea: "Aeronautical Decision-Making",
          date: "2025-04-15",
        },
      ]

      // Calculate metrics
      const scores = mockReports.map((report) => report.score)
      const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
      const highestScore = Math.max(...scores)
      const lowestScore = Math.min(...scores)
      const passCount = mockReports.filter((report) => report.score >= report.passingScore).length
      const passRate = (passCount / mockReports.length) * 100

      const mockBatch: BatchData = {
        id: batchId || "1",
        title: "Private Pilot Class Batch",
        date: "April 2025",
        reportCount: mockReports.length,
        metrics: {
          averageScore: Math.round(averageScore * 10) / 10,
          highestScore,
          lowestScore,
          passRate: Math.round(passRate),
        },
        reports: mockReports,
        isLoading: false,
      }

      setData(mockBatch)
    }, 1000)

    return () => clearTimeout(timer)
  }, [batchId])

  return data
}
