"use client"

import type React from "react"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Copy, Mail, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/components/data-table"
import { useToast } from "@/components/ui/use-toast"
import { useOrganizationMock, type Instructor } from "@/lib/hooks/use-organization-mock"

export default function OrganizationSettingsPage() {
  const { toast } = useToast()
  const { name: orgName, instructors, pendingInvites, isLoading } = useOrganizationMock()
  const [name, setName] = useState(orgName)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Organization updated",
        description: "Your organization settings have been updated successfully.",
      })
    }, 1000)
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail) return

    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      // Generate a mock token
      const token = btoa(`invite_${inviteEmail}_${Date.now()}`)

      // Copy invite link to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/auth/invite/${token}`)

      toast({
        title: "Invite link copied to clipboard",
        description: `You can now share the invite link with ${inviteEmail}`,
      })

      setIsSending(false)
      setInviteEmail("")
    }, 1000)
  }

  const instructorColumns: ColumnDef<Instructor>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const instructor = row.original
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} />
              <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{instructor.name}</div>
              <div className="text-xs text-muted-foreground">{instructor.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role
        return (
          <Badge variant="outline" className="capitalize">
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant="outline"
            className={`${
              status === "active"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-yellow-500 bg-yellow-50 text-yellow-700"
            }`}
          >
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organization Settings</h1>
        <p className="text-muted-foreground">Manage your organization details and team members</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Update your organization name and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Flight School Inc."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage instructors and administrators in your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleInvite} className="flex items-end gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="invite-email">Invite Instructor</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="instructor@example.com"
              />
            </div>
            <Button type="submit" disabled={!inviteEmail || isSending}>
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invite
                </>
              )}
            </Button>
          </form>

          {pendingInvites.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Pending Invites</h3>
              <div className="space-y-2">
                {pendingInvites.map((invite, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{invite.email}</span>
                      <Badge variant="outline" className="capitalize">
                        {invite.role}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/auth/invite/${invite.token}`)
                        toast({
                          title: "Invite link copied",
                          description: "The invite link has been copied to your clipboard.",
                        })
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DataTable
            columns={instructorColumns}
            data={instructors}
            isLoading={isLoading}
            searchPlaceholder="Search team members..."
            searchColumn="name"
          />
        </CardContent>
      </Card>
    </div>
  )
}
