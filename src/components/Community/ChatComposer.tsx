"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ChatComposerProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  className?: string
}

export function ChatComposer({
  onSendMessage,
  placeholder = "Type a message...",
  className
}: ChatComposerProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      e.preventDefault()
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <Button type="button" variant="ghost" size="sm" className="flex-shrink-0">
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Attach file</span>
      </Button>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
        size={30}
      />
      <Button type="submit" size="sm" disabled={!message.trim()} className="flex-shrink-0">
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
