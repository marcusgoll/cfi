"use client"

import { useState, useEffect } from "react"

export type User = {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "instructor" | "student"
  organizationId?: string
  organizationName?: string
}

export type SessionData = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useSessionMock(): SessionData {
  const [session, setSession] = useState<SessionData>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setSession({
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "admin",
          organizationId: "1",
          organizationName: "Flight School Inc.",
        },
        isLoading: false,
        isAuthenticated: true,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return session
}
