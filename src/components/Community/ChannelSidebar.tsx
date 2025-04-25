"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Megaphone, Calendar, User, MessageSquare, LifeBuoy, MessageCircle, Hash, Plus, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Channel } from "@/lib/hooks/use-community-mock"
import type { UserRole } from "@/components/Shell/Topbar"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Map available icons to components
const iconMap: Record<string, React.ReactNode> = {
  Megaphone: <Megaphone className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  User: <User className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  LifeBuoy: <LifeBuoy className="h-4 w-4" />,
  MessageCircle: <MessageCircle className="h-4 w-4" />,
  Hash: <Hash className="h-4 w-4" />,
}

const availableIcons = Object.keys(iconMap); // Define available icons

interface ChannelSidebarProps {
  channels: Channel[]
  className?: string
  userRole?: UserRole // Add userRole prop
  onAddChannel?: (name: string, icon: string, category: string) => void // Add function props
  onAddCategory?: (name: string) => void
}

export function ChannelSidebar({
  channels,
  className,
  userRole = "student", // Add default value
  onAddChannel, // Add props to signature
  onAddCategory,
}: ChannelSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const [groupedChannels, setGroupedChannels] = useState<Record<string, Channel[]>>({})
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false) // State for channel modal
  const [newChannelName, setNewChannelName] = useState("") // State for new channel name
  const [newChannelIcon, setNewChannelIcon] = useState(availableIcons[0]) // State for icon
  const [newChannelCategory, setNewChannelCategory] = useState("") // State for category

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Group channels by category
  useEffect(() => {
    const grouped = channels.reduce<Record<string, Channel[]>>((acc, channel) => {
      const category = channel.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(channel)
      return acc
    }, {})

    setGroupedChannels(grouped)
  }, [channels])

  if (!mounted) return null

  // Handle add channel submission
  const handleAddChannelSubmit = () => {
    if (onAddChannel && newChannelName.trim() && newChannelCategory.trim()) {
      onAddChannel(newChannelName, newChannelIcon, newChannelCategory);
      setIsAddChannelModalOpen(false);
      setNewChannelName("");
      setNewChannelIcon(availableIcons[0]);
      setNewChannelCategory("");
    }
  };

  // Handle add category submission
  const handleAddCategorySubmit = () => {
    if (onAddCategory && newCategoryName.trim()) {
      onAddCategory(newCategoryName);
      setIsAddCategoryModalOpen(false);
      setNewCategoryName("");
    }
  };

  const canManageChannels = userRole === 'superadmin';
  const existingCategories = Object.keys(groupedChannels); // Get existing categories for select

  return (
    <div className={cn("w-64 border-r bg-white flex flex-col", className)}>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold">Community</h2>
        {canManageChannels && (
          <div className="flex items-center gap-1">
            {/* Add Channel Button & Dialog */}
            <Dialog open={isAddChannelModalOpen} onOpenChange={setIsAddChannelModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add Channel</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Channel</DialogTitle>
                  <DialogDescription>
                    Create a new channel within a category.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="channel-name">Channel Name</Label>
                    <Input
                      id="channel-name"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="e.g. general-discussion"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel-icon">Icon</Label>
                    <Select value={newChannelIcon} onValueChange={setNewChannelIcon}>
                      <SelectTrigger id="channel-icon">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map(iconKey => (
                          <SelectItem key={iconKey} value={iconKey} className="flex items-center">
                            <span className="mr-2">{iconMap[iconKey]}</span> {iconKey}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="channel-category">Category</Label>
                    <Select value={newChannelCategory} onValueChange={setNewChannelCategory}>
                      <SelectTrigger id="channel-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCategories.length > 0 ? (
                          existingCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground">No categories yet. Add one first!</div>
                        )}
                      </SelectContent>
                    </Select>
                    {/* Maybe add an "Add new category" option here later */}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddChannelModalOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleAddChannelSubmit}
                    disabled={!newChannelName.trim() || !newChannelCategory.trim() || existingCategories.length === 0}
                  >
                    Add Channel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Category Button & Dialog */}
            <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Add Category</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category to group channels.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. Flight Training"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddCategorySubmit} disabled={!newCategoryName.trim()}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
          <div key={category} className="mb-4">
            <h3 className="mb-1 px-2 text-xs font-medium uppercase text-neutral-500">{category}</h3>
            <ul className="space-y-1">
              {categoryChannels.map((channel) => (
                <li key={channel.id}>
                  <Link
                    href={`/community/${channel.id}`}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                      channel.isActive
                        ? "bg-primary/10 text-primary"
                        : "text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="flex h-5 w-5 items-center justify-center">
                        {iconMap[channel.icon] || <Hash className="h-4 w-4" />}
                      </div>
                      <span className="truncate">{channel.name}</span>
                    </div>
                    {channel.unreadCount > 0 && (
                      <Badge variant="outline" className="ml-auto bg-primary/10 text-primary">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
