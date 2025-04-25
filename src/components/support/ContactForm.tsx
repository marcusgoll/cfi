"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useSupportMock } from "@/lib/hooks/use-support-mock"

export function ContactForm() {
  const { submitTicket } = useSupportMock()
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !description) return

    setIsSubmitting(true)

    try {
      const ticket = await submitTicket({
        subject,
        description,
        attachments: file ? [file] : undefined,
      })

      setTicketId(ticket.id)
      setIsSuccess(true)
    } catch (error) {
      console.error("Error submitting ticket:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Ticket Submitted</h2>
        <p className="mb-4 text-neutral-600">
          Your support ticket has been submitted successfully. We'll get back to you as soon as possible.
        </p>
        <p className="font-medium">Ticket ID: {ticketId}</p>
        <Button
          className="mt-6"
          onClick={() => {
            setIsSuccess(false)
            setSubject("")
            setDescription("")
            setFile(null)
          }}
        >
          Submit Another Ticket
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select value={subject} onValueChange={setSubject} required>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="account">Account Issue</SelectItem>
            <SelectItem value="billing">Billing Question</SelectItem>
            <SelectItem value="technical">Technical Support</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe your issue in detail..."
          className="min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">Attachment (Optional)</Label>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Input id="attachment" type="file" onChange={handleFileChange} className="hidden" />

            {file ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-md bg-neutral-100 p-2">
                  <div className="rounded-md bg-primary/10 p-1">
                    <Upload className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="mb-2 text-sm font-medium">Click to upload a file</p>
                <p className="text-xs text-neutral-500">PDF, PNG, JPG up to 10MB</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById("attachment")?.click()}
                >
                  Browse Files
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Ticket"
        )}
      </Button>
    </form>
  )
}
