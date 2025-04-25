"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  const [step, setStep] = useState<"form" | "check-email" | "success">("form")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isIndependent, setIsIndependent] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate
    let hasErrors = false
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }))
      hasErrors = true
    }

    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }))
      hasErrors = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }))
      hasErrors = true
    }

    if (hasErrors) return

    // Submit form
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("check-email")
    }, 1000)
  }

  const handleResend = () => {
    // Simulate resending email
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
    }, 1000)
  }

  const handleGoToDashboard = () => {
    // In a real app, this would navigate to dashboard after email verification
    setStep("success")
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
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Get started with your flight training management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex justify-center">
              <div className="flex gap-2">
                {["form", "check-email", "success"].map((s, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full ${step === s ? "bg-primary" : "bg-neutral-200"}`} />
                ))}
              </div>
            </div>

            <Tabs value={step} className="w-full">
              <TabsContent value="form" className="mt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!errors.name}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="independent"
                      checked={isIndependent}
                      onCheckedChange={(checked) => setIsIndependent(checked as boolean)}
                    />
                    <label
                      htmlFor="independent"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I'm an independent instructor
                    </label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="check-email" className="mt-0 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a magic link to <strong>{email}</strong>
                  </p>
                  <div className="mt-4 rounded-lg bg-muted p-4">
                    <p className="text-sm">
                      Click the link in the email to sign in. If you don't see it, check your spam folder.
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleResend} disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Resend email"}
                </Button>
                <Button variant="link" className="w-full" onClick={handleGoToDashboard}>
                  Continue to dashboard (demo)
                </Button>
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
                    Your account has been created and you're ready to get started.
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
