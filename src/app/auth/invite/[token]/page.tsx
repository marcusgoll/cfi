"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export default function InvitePage() {
  const params = useParams()
  const token = params.token as string

  const [step, setStep] = useState<"confirm" | "name" | "success">("confirm")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock invite data - in a real app, this would be fetched from API using the token
  const inviteData = {
    email: "invited@example.com",
    organization: "Flight School Inc.",
    role: "Instructor",
  }

  const handleConfirm = () => {
    setStep("name")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error
    setError("")

    // Validate
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    // Submit form
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("success")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="rounded-md bg-primary p-1">
            <Gauge className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading text-2xl">CFIPros</span>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Accept Invitation</CardTitle>
            <CardDescription>You've been invited to join {inviteData.organization}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-center">
              <div className="flex gap-2">
                {["confirm", "name", "success"].map((s, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full ${step === s ? "bg-primary" : "bg-neutral-200"}`} />
                ))}
              </div>
            </div>

            <Tabs value={step} className="w-full">
              <TabsContent value="confirm" className="mt-0 space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm">
                    You've been invited to join <strong>{inviteData.organization}</strong> as a{" "}
                    <strong>{inviteData.role}</strong>.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={inviteData.email} readOnly disabled />
                </div>
                <Button className="w-full" onClick={handleConfirm}>
                  Accept Invitation
                </Button>
              </TabsContent>

              <TabsContent value="name" className="mt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!error}
                      className={error ? "border-red-500" : ""}
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="success" className="mt-0 space-y-4">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Account created successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    You've joined {inviteData.organization} as a {inviteData.role}.
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-medium text-primary underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
