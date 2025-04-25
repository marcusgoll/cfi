"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Users } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTeachSessionMock } from "@/lib/hooks/use-teach-session-mock"

export function JoinSessionModal() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sessionCode, setSessionCode] = useState("")
  const [open, setOpen] = useState(false)
  const { joinSession } = useTeachSessionMock()

  // Check if we need to show the join dialog
  useEffect(() => {
    const isJoinMode = searchParams.get("join") === "true"
    const hasSession = !!searchParams.get("session")

    if (isJoinMode && !hasSession) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [searchParams])

  const handleJoin = () => {
    if (!sessionCode.trim()) return

    // Format validation (ABC-123)
    const sessionRegex = /^[A-Z]{3}-\d{3}$/
    if (!sessionRegex.test(sessionCode)) {
      alert("Please enter a valid session code (e.g., ABC-123)")
      return
    }

    joinSession(sessionCode)

    // Navigate to simulation with session param
    const url = new URL(window.location.href)
    url.searchParams.delete("join")
    url.searchParams.set("session", sessionCode)

    router.push(url.toString())
    setOpen(false)
  }

  const handleCancel = () => {
    router.push(window.location.pathname)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Instructor Session</DialogTitle>
          <DialogDescription>
            Enter the session code provided by your instructor to join their live simulation session.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="session-code">Session Code</Label>
            <Input
              id="session-code"
              placeholder="ABC-123"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              className="font-mono"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleJoin} disabled={!sessionCode}>
            <Users className="mr-2 h-4 w-4" />
            Join Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
