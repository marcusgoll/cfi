"use client"

import { useState, useEffect } from "react"

export type Report = {
  id: string
  title: string
  studentId: string
  studentName: string
  score: number
  date: string
  status: "reviewed" | "pending"
  fileUrl?: string
  fileSize?: string
  deficiencies?: string[]
}

export type ReportsData = {
  reports: Report[]
  isLoading: boolean
  totalCount: number
}

export function useReportsMock(studentId?: string): ReportsData {
  const [data, setData] = useState<ReportsData>({
    reports: [],
    isLoading: true,
    totalCount: 0,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockReports: Report[] = [
        {
          id: "1",
          title: "Private Pilot Checkride",
          studentId: "1",
          studentName: "Alex Johnson",
          score: 92,
          date: "2023-06-15",
          status: "reviewed",
          fileUrl: "/reports/report1.pdf",
          fileSize: "2.4 MB",
          deficiencies: ["Emergency Procedures"],
        },
        {
          id: "2",
          title: "Instrument Rating Progress",
          studentId: "1",
          studentName: "Alex Johnson",
          score: 85,
          date: "2023-07-20",
          status: "reviewed",
          fileUrl: "/reports/report2.pdf",
          fileSize: "1.8 MB",
          deficiencies: ["Holding Patterns", "Approach Procedures"],
        },
        {
          id: "3",
          title: "Cross-Country Flight",
          studentId: "2",
          studentName: "Sarah Williams",
          score: 78,
          date: "2023-08-05",
          status: "reviewed",
          fileUrl: "/reports/report3.pdf",
          fileSize: "3.2 MB",
          deficiencies: ["Navigation", "Radio Communications"],
        },
        {
          id: "4",
          title: "Night Flying Evaluation",
          studentId: "3",
          studentName: "Michael Chen",
          score: 88,
          date: "2023-09-10",
          status: "reviewed",
          fileUrl: "/reports/report4.pdf",
          fileSize: "2.1 MB",
          deficiencies: ["Landings"],
        },
        {
          id: "5",
          title: "Commercial Pilot Progress",
          studentId: "4",
          studentName: "Emily Rodriguez",
          score: 90,
          date: "2023-10-15",
          status: "pending",
          fileUrl: "/reports/report5.pdf",
          fileSize: "4.5 MB",
        },
        {
          id: "6",
          title: "Emergency Procedures Training",
          studentId: "5",
          studentName: "David Kim",
          score: 82,
          date: "2023-11-20",
          status: "reviewed",
          fileUrl: "/reports/report6.pdf",
          fileSize: "1.9 MB",
          deficiencies: ["Engine Failure Procedures"],
        },
        {
          id: "7",
          title: "Instrument Proficiency Check",
          studentId: "1",
          studentName: "Alex Johnson",
          score: 89,
          date: "2023-12-05",
          status: "reviewed",
          fileUrl: "/reports/report7.pdf",
          fileSize: "2.7 MB",
          deficiencies: ["Partial Panel Flying"],
        },
        {
          id: "8",
          title: "Multi-Engine Rating Progress",
          studentId: "3",
          studentName: "Michael Chen",
          score: 85,
          date: "2024-01-10",
          status: "pending",
          fileUrl: "/reports/report8.pdf",
          fileSize: "3.5 MB",
        },
      ]

      if (studentId) {
        const filteredReports = mockReports.filter((report) => report.studentId === studentId)
        setData({
          reports: filteredReports,
          isLoading: false,
          totalCount: filteredReports.length,
        })
      } else {
        setData({
          reports: mockReports,
          isLoading: false,
          totalCount: mockReports.length,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [studentId])

  return data
}
