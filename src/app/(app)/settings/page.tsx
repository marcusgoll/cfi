"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    Banknote, Bell, Building2, Shield, User, Mail,
    UserPlus, Copy, ArrowUpRight, Check, CreditCard, Download,
    MapPin, Phone, Globe, Plus, X, Upload
} from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useSessionMock } from "@/lib/hooks/use-session-mock"
import { useOrganizationMock, type Instructor } from "@/lib/hooks/use-organization-mock"
import { DataTable } from "@/components/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type React from "react"
import type { ColumnDef } from "@tanstack/react-table"

export default function SettingsPage() {
    const { toast } = useToast()
    const { user } = useSessionMock()
    const { name: orgName, instructors, pendingInvites, plan, invoices, isLoading } = useOrganizationMock()

    // Profile state
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "")

    // Organization state
    const [organizationName, setOrganizationName] = useState(orgName)
    const [address, setAddress] = useState("123 Airport Road")
    const [city, setCity] = useState("Skyville")
    const [state, setState] = useState("CA")
    const [zipCode, setZipCode] = useState("90210")
    const [phoneNumber, setPhoneNumber] = useState("(555) 123-4567")
    const [website, setWebsite] = useState("https://skywardflight.com")
    const [organizationLogo, setOrganizationLogo] = useState("")
    const [inviteEmail, setInviteEmail] = useState("")

    // Add team member modal state
    const [addTeamModalOpen, setAddTeamModalOpen] = useState(false)
    const [newMemberName, setNewMemberName] = useState("")
    const [newMemberEmail, setNewMemberEmail] = useState("")
    const [newMemberRole, setNewMemberRole] = useState("instructor")

    // Billing state
    const [upgradeOpen, setUpgradeOpen] = useState(false)

    // Shared state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [isAddingMember, setIsAddingMember] = useState(false)

    const handleSave = () => {
        setIsSubmitting(true)
        // simulate save
        setTimeout(() => {
            setIsSubmitting(false)
            toast({
                title: "Changes saved",
                description: "Your changes have been saved successfully.",
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

    const handleAddTeamMember = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMemberName || !newMemberEmail) return

        setIsAddingMember(true)

        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Team member added",
                description: `${newMemberName} has been added to your organization.`,
            })

            setIsAddingMember(false)
            setAddTeamModalOpen(false)
            setNewMemberName("")
            setNewMemberEmail("")
            setNewMemberRole("instructor")
        }, 1000)
    }

    const handleUpgrade = () => {
        setIsUpgrading(true)

        // Simulate API call
        setTimeout(() => {
            setIsUpgrading(false)
            setUpgradeOpen(false)
            toast({
                title: "Upgrade successful",
                description: "Your account has been upgraded to Pro plan.",
            })
        }, 1500)
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // In a real app, you would upload the file to a server
            // For now, we'll just create a local URL
            const url = URL.createObjectURL(file)
            setAvatarUrl(url)
        }
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // In a real app, you would upload the file to a server
            // For now, we'll just create a local URL
            const url = URL.createObjectURL(file)
            setOrganizationLogo(url)
        }
    }

    const proFeatures = [
        "Unlimited students",
        "Advanced analytics",
        "Custom report templates",
        "API access",
        "Priority support",
    ]

    const instructorColumns: ColumnDef<Instructor>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const instructor = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} />
                            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-xs font-medium">{instructor.name}</div>
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
                    <Badge variant="outline" className="capitalize text-xs">
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
                        className={`text-xs ${status === "active"
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
            cell: ({ row }) => (
                <span className="text-xs">{row.original.joinedAt}</span>
            )
        },
    ]

    return (
        <div className="space-y-4">
            <header className="space-y-1 mb-2">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage account, organization & notifications</p>
            </header>

            <Tabs defaultValue="profile" className="w-full">
                <div className="relative">
                    <ScrollArea className="w-full whitespace-nowrap pb-2">
                        <TabsList className="inline-flex h-9 w-auto">
                            <TabsTrigger value="profile" className="flex items-center gap-1.5 px-3 text-sm">
                                <User className="h-3.5 w-3.5" /> Profile
                            </TabsTrigger>
                            <TabsTrigger value="organization" className="flex items-center gap-1.5 px-3 text-sm">
                                <Building2 className="h-3.5 w-3.5" /> Organization
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="flex items-center gap-1.5 px-3 text-sm">
                                <Bell className="h-3.5 w-3.5" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-1.5 px-3 text-sm">
                                <Shield className="h-3.5 w-3.5" /> Security
                            </TabsTrigger>
                            <TabsTrigger value="billing" className="flex items-center gap-1.5 px-3 text-sm">
                                <Banknote className="h-3.5 w-3.5" /> Billing
                            </TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" className="invisible" />
                    </ScrollArea>
                </div>

                {/* Profile */}
                <TabsContent value="profile" className="space-y-4 pt-4 mt-0">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Your Profile</CardTitle>
                            <CardDescription className="text-xs">Update your personal information and profile picture</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4 space-y-4">
                            <div className="flex flex-col items-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <div className="relative">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                                        <AvatarFallback className="text-base">
                                            {name ? name.charAt(0) : <User className="h-8 w-8" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-0 -right-1">
                                        <Label
                                            htmlFor="avatar-upload"
                                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
                                        >
                                            +<span className="sr-only">Upload avatar</span>
                                        </Label>
                                        <Input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="text-sm font-medium">{name || "Your Name"}</h3>
                                    <p className="text-xs text-muted-foreground">{email || "your.email@example.com"}</p>
                                    <p className="text-xs text-muted-foreground">Recommended size: 256x256px. Max: 5MB</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="name" className="text-xs">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="h-8 text-sm"
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="email" className="text-xs">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="h-8 text-sm"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end py-3">
                            <Button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                size="sm"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Organization */}
                <TabsContent value="organization" className="space-y-4 pt-4 mt-0">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Organization Details</CardTitle>
                            <CardDescription className="text-xs">Update your flight school information</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4 space-y-4">
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center border overflow-hidden">
                                        {organizationLogo ? (
                                            <img
                                                src={organizationLogo}
                                                alt="Organization logo"
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <Building2 className="h-10 w-10 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 -right-1">
                                        <Label
                                            htmlFor="logo-upload"
                                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary/90"
                                        >
                                            <Upload className="h-3 w-3" />
                                            <span className="sr-only">Upload logo</span>
                                        </Label>
                                        <Input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleLogoChange}
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1 text-center sm:text-left">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="orgName" className="text-xs">Organization Name</Label>
                                        <Input
                                            id="orgName"
                                            value={organizationName}
                                            onChange={(e) => setOrganizationName(e.target.value)}
                                            placeholder="Flight School Inc."
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="col-span-full">
                                    <Label htmlFor="address" className="text-xs">Street Address</Label>
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="123 Airport Road"
                                        className="h-8 text-sm mt-1.5"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="city" className="text-xs">City</Label>
                                    <Input
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Skyville"
                                        className="h-8 text-sm mt-1.5"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="state" className="text-xs">State</Label>
                                        <Input
                                            id="state"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            placeholder="CA"
                                            className="h-8 text-sm mt-1.5"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="zipCode" className="text-xs">ZIP Code</Label>
                                        <Input
                                            id="zipCode"
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                            placeholder="90210"
                                            className="h-8 text-sm mt-1.5"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                        <Label htmlFor="phoneNumber" className="text-xs">Phone Number</Label>
                                    </div>
                                    <Input
                                        id="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="(555) 123-4567"
                                        className="h-8 text-sm mt-1.5"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <Globe className="h-3 w-3 text-muted-foreground" />
                                        <Label htmlFor="website" className="text-xs">Website</Label>
                                    </div>
                                    <Input
                                        id="website"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        placeholder="https://example.com"
                                        className="h-8 text-sm mt-1.5"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end py-3">
                            <Button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                size="sm"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader className="py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base">Team Members</CardTitle>
                                    <CardDescription className="text-xs">Manage instructors and administrators</CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => setAddTeamModalOpen(true)}
                                    className="h-7"
                                >
                                    <Plus className="mr-1 h-3.5 w-3.5" />
                                    Add Member
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-4 space-y-4">
                            <form onSubmit={handleInvite} className="flex items-end gap-2">
                                <div className="grid flex-1 gap-1.5">
                                    <Label htmlFor="invite-email" className="text-xs">Invite by Email</Label>
                                    <Input
                                        id="invite-email"
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="instructor@example.com"
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <Button type="submit" disabled={!inviteEmail || isSending} size="sm">
                                    {isSending ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            <UserPlus className="mr-1 h-3.5 w-3.5" />
                                            Send
                                        </>
                                    )}
                                </Button>
                            </form>

                            {pendingInvites.length > 0 && (
                                <div>
                                    <h3 className="mb-2 text-xs font-medium">Pending Invites</h3>
                                    <div className="space-y-2">
                                        {pendingInvites.map((invite, i) => (
                                            <div key={i} className="flex items-center justify-between rounded-md border p-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                    <span>{invite.email}</span>
                                                    <Badge variant="outline" className="capitalize text-xs">
                                                        {invite.role}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-xs"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${window.location.origin}/auth/invite/${invite.token}`)
                                                        toast({
                                                            title: "Invite link copied",
                                                            description: "The invite link has been copied to your clipboard.",
                                                        })
                                                    }}
                                                >
                                                    <Copy className="mr-1 h-3.5 w-3.5" />
                                                    Copy
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="rounded-md border">
                                <DataTable
                                    columns={instructorColumns}
                                    data={instructors}
                                    isLoading={isLoading}
                                    searchPlaceholder="Search team members..."
                                    searchColumn="name"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Team Member Modal */}
                    <Dialog open={addTeamModalOpen} onOpenChange={setAddTeamModalOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleAddTeamMember}>
                                <DialogHeader>
                                    <DialogTitle>Add Team Member</DialogTitle>
                                    <DialogDescription className="text-xs">
                                        Add a new instructor or administrator to your organization.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-3 py-4">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="new-name" className="text-xs">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="new-name"
                                            value={newMemberName}
                                            onChange={(e) => setNewMemberName(e.target.value)}
                                            placeholder="Jane Smith"
                                            className="h-8 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="new-email" className="text-xs">
                                            Email
                                        </Label>
                                        <Input
                                            id="new-email"
                                            type="email"
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            placeholder="jane@example.com"
                                            className="h-8 text-sm"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="new-role" className="text-xs">
                                            Role
                                        </Label>
                                        <Select
                                            value={newMemberRole}
                                            onValueChange={setNewMemberRole}
                                        >
                                            <SelectTrigger id="new-role" className="h-8 text-sm">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="instructor">Instructor</SelectItem>
                                                <SelectItem value="admin">Administrator</SelectItem>
                                                <SelectItem value="owner">Owner</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="new-message" className="text-xs">
                                            Welcome Message (Optional)
                                        </Label>
                                        <Textarea
                                            id="new-message"
                                            placeholder="Add a personal message..."
                                            className="resize-none text-sm"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAddTeamModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" size="sm" disabled={isAddingMember}>
                                        {isAddingMember ? "Adding..." : "Add Member"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-4 pt-4 mt-0">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Email Notifications</CardTitle>
                            <CardDescription className="text-xs">Select which email notifications you wish to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Weekly performance summary</span>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs">New student enrollments</span>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs">Upcoming test expirations</span>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end py-3">
                            <Button onClick={handleSave} disabled={isSubmitting} size="sm">
                                {isSubmitting ? "Saving..." : "Save preferences"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security" className="space-y-4 pt-4 mt-0">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Password</CardTitle>
                            <CardDescription className="text-xs">Update your account password.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 pb-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="currentPassword" className="text-xs">Current password</Label>
                                <Input id="currentPassword" type="password" className="h-8 text-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="newPassword" className="text-xs">New password</Label>
                                <Input id="newPassword" type="password" className="h-8 text-sm" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end py-3">
                            <Button onClick={handleSave} disabled={isSubmitting} size="sm">
                                {isSubmitting ? "Saving..." : "Update password"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Billing */}
                <TabsContent value="billing" className="space-y-4 pt-4 mt-0">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Subscription Plan</CardTitle>
                            <CardDescription className="text-xs">Manage your plan & payment method</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-4">
                            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xs font-medium">Current Plan:</h3>
                                        <Badge variant={plan === "pro" ? "default" : "outline"} className="uppercase text-xs">
                                            {plan}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {plan === "free"
                                            ? "Limited to 10 students and basic features"
                                            : "Unlimited students and all premium features"}
                                    </p>
                                </div>
                                {plan === "free" && (
                                    <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm">Upgrade to Pro</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Upgrade to Pro Plan</DialogTitle>
                                                <DialogDescription>Get access to all premium features</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <Card>
                                                    <CardHeader className="pb-2">
                                                        <CardTitle className="text-base">Pro Plan</CardTitle>
                                                        <CardDescription className="text-xs">$49/month</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ul className="space-y-2">
                                                            {proFeatures.map((feature, i) => (
                                                                <li key={i} className="flex items-center gap-2 text-xs">
                                                                    <Check className="h-3.5 w-3.5 text-primary" />
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" size="sm" onClick={() => setUpgradeOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button size="sm" onClick={handleUpgrade} disabled={isUpgrading}>
                                                    {isUpgrading ? "Processing..." : "Upgrade Now"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>

                            <div>
                                <h3 className="mb-3 text-xs font-medium">Billing History</h3>
                                {isLoading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="h-8 animate-pulse rounded-md bg-neutral-100" />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-neutral-50">
                                                <TableRow className="h-8">
                                                    <TableHead className="text-xs">Invoice</TableHead>
                                                    <TableHead className="text-xs">Date</TableHead>
                                                    <TableHead className="text-xs">Amount</TableHead>
                                                    <TableHead className="text-xs">Status</TableHead>
                                                    <TableHead className="text-xs text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {invoices.map((invoice) => (
                                                    <TableRow key={invoice.id} className="h-8">
                                                        <TableCell className="text-xs">{invoice.id}</TableCell>
                                                        <TableCell className="text-xs">{invoice.date}</TableCell>
                                                        <TableCell className="text-xs">{invoice.amount}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${invoice.status === "paid"
                                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                                    : "border-yellow-500 bg-yellow-50 text-yellow-700"
                                                                    }`}
                                                            >
                                                                {invoice.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                                <Download className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex py-3 flex-col items-start gap-2 sm:flex-row sm:justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CreditCard className="h-3.5 w-3.5" />
                                <span>Secure payment processing by Stripe</span>
                            </div>
                            <Button variant="link" className="h-auto gap-1 p-0 text-xs">
                                <span>Billing FAQ</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
