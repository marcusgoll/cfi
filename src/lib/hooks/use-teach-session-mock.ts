"use client"

import { useCallback, useEffect, useState } from "react"

// Simple event types for the teach session
export type TeachEventType = "play" | "pause" | "reset" | "speed" | "position" | "join" | "leave"

export interface TeachEvent {
  type: TeachEventType
  data?: any
  timestamp: number
}

type EventCallback = (event: TeachEvent) => void

export interface TeachSessionState {
  sessionId: string
  active: boolean
  students: number
  syncEnabled: boolean
}

export function useTeachSessionMock(sessionId?: string) {
  const [state, setState] = useState<TeachSessionState>({
    sessionId: sessionId || generateSessionId(),
    active: !!sessionId,
    students: 0,
    syncEnabled: true,
  })

  // Generate a random session ID (format: ABC-123)
  function generateSessionId(): string {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const chars = Array(3)
      .fill(0)
      .map(() => letters.charAt(Math.floor(Math.random() * letters.length)))
      .join("")
    const nums = Array(3)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join("")
    return `${chars}-${nums}`
  }

  // Simulate students joining the session
  useEffect(() => {
    if (state.active) {
      // Simulate 1-3 students joining over time
      const joinInterval = setInterval(() => {
        if (state.students < 3) {
          setState((prev) => ({ ...prev, students: prev.students + 1 }))
          console.log(`Student joined session ${state.sessionId}. Total: ${state.students + 1}`)
        } else {
          clearInterval(joinInterval)
        }
      }, 5000)

      return () => clearInterval(joinInterval)
    }
  }, [state.active, state.sessionId, state.students])

  // Broadcast an event to students
  const broadcast = useCallback(
    (type: TeachEventType, data?: any) => {
      if (!state.active || !state.syncEnabled) return

      const event: TeachEvent = {
        type,
        data,
        timestamp: Date.now(),
      }

      console.log(`Broadcasting to ${state.students} students:`, event)
      return event
    },
    [state.active, state.students, state.syncEnabled],
  )

  // Subscribe to events (for student mode)
  const on = useCallback((eventType: TeachEventType, callback: EventCallback) => {
    console.log(`Subscribed to ${eventType} events`)

    // Cleanup function
    return () => {
      console.log(`Unsubscribed from ${eventType} events`)
    }
  }, [])

  // Create a session
  const createSession = useCallback(() => {
    const newSessionId = generateSessionId()
    setState({
      sessionId: newSessionId,
      active: true,
      students: 0,
      syncEnabled: true,
    })
    console.log(`Created new teaching session: ${newSessionId}`)
    return newSessionId
  }, [])

  // Join a session (for student mode)
  const joinSession = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sessionId: id,
      active: true,
    }))
    console.log(`Joined session ${id}`)
  }, [])

  // Toggle sync controls
  const toggleSync = useCallback((enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      syncEnabled: enabled,
    }))
    console.log(`Sync controls ${enabled ? "enabled" : "disabled"}`)
  }, [])

  return {
    state,
    broadcast,
    on,
    createSession,
    joinSession,
    toggleSync,
  }
}
