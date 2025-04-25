"use client"

import { useState, useEffect } from "react"

export type Student = {
  id: string
  name: string
  email: string
  avatar?: string
  lastScore: number
  reportsCount: number
  avgScore: number
  weakAreas: string[]
  status: "active" | "inactive"
  createdAt: string
}

export type StudentsData = {
  students: Student[]
  isLoading: boolean
  totalCount: number
}

export function useStudentsMock(studentId?: string): StudentsData {
  const [data, setData] = useState<StudentsData>({
    students: [],
    isLoading: true,
    totalCount: 0,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockStudents: Student[] = [
        {
          id: "1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 92,
          reportsCount: 8,
          avgScore: 88,
          weakAreas: ["Emergency Procedures", "Radio Communications"],
          status: "active",
          createdAt: "2023-01-15",
        },
        {
          id: "2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 78,
          reportsCount: 5,
          avgScore: 76,
          weakAreas: ["Instrument Scanning", "Holding Patterns"],
          status: "active",
          createdAt: "2023-02-20",
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 85,
          reportsCount: 12,
          avgScore: 83,
          weakAreas: ["Crosswind Landings", "Emergency Procedures"],
          status: "active",
          createdAt: "2023-03-05",
        },
        {
          id: "4",
          name: "Emily Rodriguez",
          email: "emily@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 90,
          reportsCount: 7,
          avgScore: 89,
          weakAreas: ["Radio Communications"],
          status: "active",
          createdAt: "2023-04-10",
        },
        {
          id: "5",
          name: "David Kim",
          email: "david@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 82,
          reportsCount: 9,
          avgScore: 80,
          weakAreas: ["Instrument Approaches", "Holding Patterns"],
          status: "inactive",
          createdAt: "2023-05-15",
        },
      ]

      if (studentId) {
        const filteredStudents = mockStudents.filter((student) => student.id === studentId)
        setData({
          students: filteredStudents,
          isLoading: false,
          totalCount: filteredStudents.length,
        })
      } else {
        setData({
          students: mockStudents,
          isLoading: false,
          totalCount: mockStudents.length,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [studentId])

  return data
}

export function useStudentDetailsMock(id: string): { student: Student | null; isLoading: boolean } {
  const [data, setData] = useState<{ student: Student | null; isLoading: boolean }>({
    student: null,
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockStudents: Student[] = [
        {
          id: "1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 92,
          reportsCount: 8,
          avgScore: 88,
          weakAreas: ["Emergency Procedures", "Radio Communications"],
          status: "active",
          createdAt: "2023-01-15",
        },
        {
          id: "2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 78,
          reportsCount: 5,
          avgScore: 76,
          weakAreas: ["Instrument Scanning", "Holding Patterns"],
          status: "active",
          createdAt: "2023-02-20",
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 85,
          reportsCount: 12,
          avgScore: 83,
          weakAreas: ["Crosswind Landings", "Emergency Procedures"],
          status: "active",
          createdAt: "2023-03-05",
        },
        {
          id: "4",
          name: "Emily Rodriguez",
          email: "emily@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 90,
          reportsCount: 7,
          avgScore: 89,
          weakAreas: ["Radio Communications"],
          status: "active",
          createdAt: "2023-04-10",
        },
        {
          id: "5",
          name: "David Kim",
          email: "david@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          lastScore: 82,
          reportsCount: 9,
          avgScore: 80,
          weakAreas: ["Instrument Approaches", "Holding Patterns"],
          status: "inactive",
          createdAt: "2023-05-15",
        },
      ]

      const student = mockStudents.find((s) => s.id === id) || null
      setData({
        student,
        isLoading: false,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  return data
}
