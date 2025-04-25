"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronRight, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useStudentsMock, type Student } from "@/lib/hooks/use-students-mock"

// Placeholder for the actual server action
// import { inviteStudentByEmail } from "@/server/actions/student-actions";

export default function StudentsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { students, isLoading } = useStudentsMock()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteFirstName, setInviteFirstName] = useState("")
  const [inviteLastName, setInviteLastName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteFirstName || !inviteLastName || !inviteEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill out first name, last name, and email.",
        variant: "destructive",
      })
      return
    }

    setInviteLoading(true)

    try {
      // --- TODO: Replace mock logic with actual server action call ---
      console.log("Simulating invite for:", { inviteFirstName, inviteLastName, inviteEmail })
      // await inviteStudentByEmail({
      //   firstName: inviteFirstName,
      //   lastName: inviteLastName,
      //   email: inviteEmail,
      // });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // --- End TODO ---

      toast({
        title: "Invite Sent",
        description: `An invitation email has been sent to ${inviteEmail}.`,
      })

      // Reset form and close dialog
      setInviteFirstName("")
      setInviteLastName("")
      setInviteEmail("")
      setInviteOpen(false)
    } catch (error) {
      console.error("Invite failed:", error)
      toast({
        title: "Invite Failed",
        description:
          error instanceof Error ? error.message : "Could not send invite. Please try again.",
        variant: "destructive",
      })
    } finally {
      setInviteLoading(false)
    }
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const student = row.original
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{student.name}</div>
              <div className="text-xs text-muted-foreground">{student.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "lastScore",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Last Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const score = row.original.lastScore
        return (
          <Badge
            variant="outline"
            className={`${score >= 90
                ? "border-green-500 bg-green-50 text-green-700"
                : score >= 80
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : score >= 70
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-red-500 bg-red-50 text-red-700"
              }`}
          >
            {score}%
          </Badge>
        )
      },
    },
    {
      accessorKey: "reportsCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium"
        >
          Reports
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant="outline"
            className={`${status === "active"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-neutral-500 bg-neutral-50 text-neutral-700"
              }`}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/students/${student.id}`)}
            className="flex items-center gap-1"
          >
            View
            <ChevronRight className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your flight training students</p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Student</DialogTitle>
              <DialogDescription>
                Send an invitation to a student to join your flight training program.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      value={inviteFirstName}
                      onChange={(e) => setInviteFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={inviteLastName}
                      onChange={(e) => setInviteLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!inviteFirstName || !inviteLastName || !inviteEmail || inviteLoading}>
                  {inviteLoading ? "Sending invite..." : "Send Invite"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={students}
        isLoading={isLoading}
        searchPlaceholder="Search students..."
        searchColumn="name"
      />
    </div>
  )
}
