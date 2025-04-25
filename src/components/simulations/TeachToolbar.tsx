"use client"

import { useState } from "react"
import { Copy, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useTeachSessionMock } from "@/lib/hooks/use-teach-session-mock"

export function TeachToolbar() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isTeachMode = searchParams.get("mode") === "teach"

  const [copied, setCopied] = useState(false)

  const { state, toggleSync } = useTeachSessionMock(isTeachMode ? undefined : searchParams.get("session") || undefined)

  // Don't show if not in teach mode and not in a session
  if (!isTeachMode && !searchParams.get("session")) {
    return null
  }

  const copySessionLink = () => {
    const url = new URL(window.location.href)
    url.searchParams.delete("mode")
    url.searchParams.set("session", state.sessionId)

    navigator.clipboard
      .writeText(url.toString())
      .then(() => {
        setCopied(true)
        toast({
          title: "Link copied",
          description: "Share this link with your students to join the session",
        })

        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        toast({
          title: "Failed to copy",
          description: "Please copy the session code manually",
          variant: "destructive",
        })
      })
  }

  const endSession = () => {
    router.push(window.location.pathname)
  }

  return (
    <div className="fixed top-14 left-64 right-0 h-12 bg-white border-b z-10 flex items-center px-4 gap-4">
      <div className="flex items-center">
        <Badge variant="outline" className="bg-blue-50 mr-2 cursor-default">
          {isTeachMode ? "Instructor Mode" : "Student Mode"}
        </Badge>

        <span className="text-sm font-medium mr-2">Session: </span>
        <Badge variant="secondary" className="mr-3 font-mono">
          {state.sessionId}
        </Badge>

        <Button
          size="sm"
          variant="outline"
          onClick={copySessionLink}
          className={copied ? "bg-green-50 text-green-600" : ""}
        >
          <Copy className="h-3.5 w-3.5 mr-1" />
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {isTeachMode && (
        <>
          <div className="flex items-center ml-auto space-x-2">
            <Badge variant="outline" className="flex items-center">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>{state.students} Students</span>
            </Badge>
          </div>

          <div className="flex items-center">
            <Switch id="sync-controls" checked={state.syncEnabled} onCheckedChange={toggleSync} />
            <Label htmlFor="sync-controls" className="ml-2">
              Sync Controls
            </Label>
          </div>

          <Button variant="outline" size="sm" onClick={endSession}>
            End Session
          </Button>
        </>
      )}
    </div>
  )
}
