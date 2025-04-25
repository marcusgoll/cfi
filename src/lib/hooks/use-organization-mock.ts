"use client"

import { useState, useEffect } from "react"

export type Instructor = {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "instructor"
  status: "active" | "pending"
  joinedAt: string
}

export type OrganizationData = {
  name: string
  plan: "free" | "pro"
  instructors: Instructor[]
  pendingInvites: {
    email: string
    role: "admin" | "instructor"
    invitedAt: string
    token: string
  }[]
  invoices: {
    id: string
    date: string
    amount: string
    status: "paid" | "pending"
  }[]
  isLoading: boolean
}

export function useOrganizationMock(): OrganizationData {
  const [data, setData] = useState<OrganizationData>({
    name: "",
    plan: "free",
    instructors: [],
    pendingInvites: [],
    invoices: [],
    isLoading: true,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setData({
        name: "Flight School Inc.",
        plan: "free",
        instructors: [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "admin",
            status: "active",
            joinedAt: "2023-01-01",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "instructor",
            status: "active",
            joinedAt: "2023-02-15",
          },
          {
            id: "3",
            name: "Robert Johnson",
            email: "robert@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "instructor",
            status: "active",
            joinedAt: "2023-03-20",
          },
        ],
        pendingInvites: [
          {
            email: "mark@example.com",
            role: "instructor",
            invitedAt: "2023-06-10",
            token: "invite_token_123",
          },
          {
            email: "lisa@example.com",
            role: "instructor",
            invitedAt: "2023-06-15",
            token: "invite_token_456",
          },
        ],
        invoices: [
          {
            id: "INV-001",
            date: "2023-05-01",
            amount: "$0.00",
            status: "paid",
          },
          {
            id: "INV-002",
            date: "2023-06-01",
            amount: "$0.00",
            status: "paid",
          },
          {
            id: "INV-003",
            date: "2023-07-01",
            amount: "$0.00",
            status: "pending",
          },
        ],
        isLoading: false,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return data
}
