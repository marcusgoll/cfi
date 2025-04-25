"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { MessageSquare, Pin, Smile, CornerDownRight, Flag, AlertTriangle, Pencil, Trash2, Check, X, ThumbsUp, ThumbsDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Message, ReportedMessageInfo } from "@/lib/hooks/use-community-mock"
import type { UserRole } from "@/components/Shell/Topbar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface MessageItemProps {
  message: Message
  onTogglePin?: (messageId: string) => void
  onAddReaction?: (messageId: string, emoji: string) => void
  onReply?: (messageId: string) => void
  replyingActive?: boolean
  className?: string
  isThreadReply?: boolean
  replyCount?: number
  isThreadExpanded?: boolean
  onThreadToggle?: () => void
  userRole?: UserRole
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
  onReport?: (messageId: string, reason: string) => void
  activeChannelId?: string
  onApprove?: (messageId: string) => void
  onReject?: (messageId: string) => void
}

const MODERATION_CHANNEL_ID = "cfi-moderation-queue";

export function MessageItem({
  message,
  onTogglePin,
  onAddReaction,
  onReply,
  replyingActive = false,
  className,
  isThreadReply = false,
  replyCount = 0,
  isThreadExpanded = false,
  onThreadToggle,
  userRole = "student",
  onEdit,
  onDelete,
  onReport,
  activeChannelId,
  onApprove,
  onReject,
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false)
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false)

  const editInputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus edit input when edit mode is activated
  useEffect(() => {
    if (isEditMode && editInputRef.current) {
      editInputRef.current.focus()
      // Place cursor at the end of the text
      const length = editInputRef.current.value.length
      editInputRef.current.setSelectionRange(length, length)
    }
  }, [isEditMode])

  const formattedTime = message.timestamp ? format(new Date(message.timestamp), "h:mm a") : ""
  const formattedDate = message.timestamp ? format(new Date(message.timestamp), "MMM d, yyyy") : ""

  const commonEmojis = ["👍", "❤️", "😂", "😮", "👏", "🎉"]

  // Check if content is long (more than ~150 characters)
  const isLongContent = message.content.length > 150

  // Check if user can pin messages (only superadmin)
  const canPinMessages = userRole === "superadmin"

  // Check if the current user is the message author (for edit/delete)
  const isAuthor = message.userId === "current-user"

  // Check if this message is a reply to another message
  const isReply = message.replyToId !== undefined && message.replyToId !== null;

  // Handler to stop event propagation for action buttons
  const handleActionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handler for thread toggle button
  const handleThreadToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onThreadToggle?.();
  };

  // Handle report submission
  const handleReportSubmit = () => {
    if (reportReason.trim() && onReport) {
      onReport(message.id, reportReason.trim());
      setIsReportModalOpen(false);
      setReportReason("");
    } else {
      console.error("Report reason is empty or onReport function not provided");
    }
  };

  // Handle edit submission
  const handleEditSubmit = () => {
    if (onEdit && editedContent.trim()) {
      onEdit(message.id, editedContent.trim());
      setIsEditMode(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditMode(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(message.id);
      setIsDeleteModalOpen(false);
    }
  };

  const isModerationChannel = activeChannelId === MODERATION_CHANNEL_ID;

  // --- Re-added Helper Functions --- 
  const hasUserReacted = (reaction: { userIds: string[] }) => {
    return reaction.userIds.includes("current-user")
  }

  const renderLinkedContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g
    const parts = content.split(urlRegex)
    return parts.map((part, index) => {
      if (!part) return null
      if (urlRegex.test(part)) {
        let url = part
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url
        }
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  const handleEmojiSelect = (emoji: string) => {
    if (onAddReaction) {
      onAddReaction(message.id, emoji);
    }
  };
  // --- End Re-added Helper Functions ---

  return (
    <div
      className={cn(
        "group relative rounded-lg p-3 hover:bg-neutral-50",
        replyingActive && "bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/20",
        isThreadReply && "bg-muted/5 hover:bg-muted/10 pl-4",
        isModerationChannel && "border border-yellow-400 bg-yellow-50/50 hover:bg-yellow-50",
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        if (!isEmojiMenuOpen && !isMoreOptionsOpen && !isReportModalOpen && !isDeleteModalOpen) {
          setShowActions(false);
        }
      }}
    >
      {/* Reply indicator for direct replies */}
      {isReply && !isThreadReply && (
        <div className="absolute -left-2 top-3 text-muted-foreground">
          <CornerDownRight className="h-4 w-4" />
        </div>
      )}

      <div className={cn("flex gap-3", isReply && !isThreadReply && "ml-3")}>
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={message.userAvatar || "/placeholder.svg"} alt={message.userName} />
          <AvatarFallback className="bg-gradient-to-br from-primary/60 to-primary text-white">
            {message.userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{message.userName}</span>
            <span className="text-xs text-neutral-500" title={formattedDate}>
              {formattedTime}
            </span>
            {message.isPinned && (
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                <Pin className="h-3 w-3" />
                <span>Pinned</span>
              </div>
            )}
            {isReply && (
              <div className="text-xs text-muted-foreground">
                replying to {message.replyToUserName || "someone"}
              </div>
            )}
          </div>

          {/* Show report info if in moderation channel */}
          {isModerationChannel && message.reportData && (
            <div className="mb-2 p-2 rounded bg-yellow-100 border border-yellow-300 text-xs">
              <p className="font-medium">Reported ({message.reportData.reportCount} times)</p>
              <ul className="list-disc list-inside text-yellow-800 mt-1">
                {message.reportData.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
              </ul>
            </div>
          )}

          {/* Message content - edit mode or display mode */}
          {isEditMode ? (
            <div className="edit-container">
              <Textarea
                ref={editInputRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[80px] resize-none"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="h-8 px-2"
                >
                  <X className="h-3.5 w-3.5 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={!editedContent.trim() || editedContent === message.content}
                  className="h-8 px-2"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm break-words">
              {isLongContent && !isContentExpanded ? (
                <>
                  <div>{renderLinkedContent(message.content.substring(0, 150))}...</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsContentExpanded(true);
                    }}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    Show more
                  </button>
                </>
              ) : (
                <>
                  <div>{renderLinkedContent(message.content)}</div>
                  {isLongContent && isContentExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsContentExpanded(false);
                      }}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Show less
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Reactions and Reply count in the same row */}
          <div className="mt-2 flex items-center justify-between gap-2">
            {/* Reactions on left */}
            <div className="flex flex-wrap gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
              {message.reactions && message.reactions.length > 0 ? (
                message.reactions.map((reaction, index) => (
                  <button
                    key={index}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                      hasUserReacted(reaction)
                        ? "bg-primary/20 hover:bg-primary/30"
                        : "bg-neutral-100 hover:bg-neutral-200"
                    )}
                    onClick={() => onAddReaction?.(message.id, reaction.emoji)}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))
              ) : (
                <span></span>
              )}
            </div>

            {/* Reply count on right */}
            {replyCount > 0 && (
              <button
                className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium hover:bg-primary/20 transition-colors flex-shrink-0"
                onClick={handleThreadToggle}
              >
                <MessageSquare className="h-3 w-3" />
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                <span className="text-xs ml-1 hidden sm:inline">
                  {isThreadExpanded ? '(hide)' : '(show)'}
                </span>
              </button>
            )}
          </div>

          {/* Moderation Actions (only in moderation channel) */}
          {isModerationChannel && (
            <div className="mt-2 flex justify-end gap-2" onClick={handleActionsClick}>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject?.(message.id)}
              >
                <ThumbsDown className="h-4 w-4 mr-1" /> Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => onApprove?.(message.id)}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> Approve
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Message actions */}
      {(showActions || isEmojiMenuOpen || isMoreOptionsOpen) && !isEditMode && !isModerationChannel && (
        <div
          className="absolute -right-2 -top-2 flex items-center gap-1"
          onClick={handleActionsClick}
        >
          {/* Pin button - only visible to superadmin */}
          {canPinMessages && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-sm"
              onClick={() => onTogglePin?.(message.id)}
            >
              <Pin className="h-4 w-4" />
              <span className="sr-only">{message.isPinned ? "Unpin message" : "Pin message"}</span>
            </Button>
          )}

          {/* Reply button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full bg-white shadow-sm",
              replyingActive && "ring-2 ring-primary/60 bg-primary/5"
            )}
            onClick={() => onReply?.(message.id)}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Reply</span>
          </Button>

          {/* Emoji reactions menu */}
          <DropdownMenu open={isEmojiMenuOpen} onOpenChange={setIsEmojiMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full bg-white shadow-sm",
                  isEmojiMenuOpen && "ring-2 ring-primary/50"
                )}
              >
                <Smile className="h-4 w-4" />
                <span className="sr-only">Add reaction</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="flex flex-wrap gap-1 p-2"
              style={{ width: "200px" }}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              {commonEmojis.map((emoji) => (
                <DropdownMenuItem
                  key={emoji}
                  className="cursor-pointer p-2 text-lg hover:bg-neutral-100"
                  onClick={() => handleEmojiSelect(emoji)}
                  onSelect={(e) => e.preventDefault()} // Prevent auto-closing
                >
                  {emoji}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit and Delete - only for message author */}
          {isAuthor && (
            <DropdownMenu open={isMoreOptionsOpen} onOpenChange={setIsMoreOptionsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-sm"
                >
                  <span className="font-bold text-xs">⋯</span>
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem
                  className="cursor-pointer flex items-center"
                  onClick={() => {
                    setIsEditMode(true);
                    setEditedContent(message.content);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer flex items-center text-red-600 hover:text-red-700"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Report button - don't show if this is your own message */}
          {!isAuthor && (
            <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white shadow-sm"
                >
                  <Flag className="h-4 w-4 text-red-500" />
                  <span className="sr-only">Report message</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Report Message
                  </DialogTitle>
                  <DialogDescription>
                    Please describe why you're reporting this message. Our moderators will review it.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for reporting</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please explain why this message should be reviewed..."
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="bg-muted p-2 rounded-md">
                    <p className="text-xs text-muted-foreground">Reported message:</p>
                    <p className="text-sm mt-1">{message.content}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>Cancel</Button>
                  <Button
                    type="submit"
                    onClick={handleReportSubmit}
                    disabled={!reportReason.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Submit Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Message
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-3 rounded-md my-4">
            <p className="text-sm">{message.content}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
