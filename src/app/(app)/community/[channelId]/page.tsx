"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { Pin, ArrowDown, ExternalLink, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatComposer } from "@/components/Community/ChatComposer"
import { MessageItem } from "@/components/Community/MessageItem"
import { ChannelSidebar } from "@/components/Community/ChannelSidebar"
import { useCommunityMock } from "@/lib/hooks/use-community-mock"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { type UserRole } from "@/components/Shell/Topbar"
import { useParams } from "next/navigation"

// Import Message type from mock
import { Message } from "@/lib/hooks/use-community-mock"

/**
 * CommunityPage – single‑column chat with sidebar
 * Adapts to being placed within AppLayout's ScrollArea
 */
export default function CommunityPage() {
  // Get userRole first
  const [userRole, setUserRole] = useState<UserRole>("student")
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem("userRole") as UserRole || "student"
      setUserRole(storedRole)
    }
  }, [])

  // Get channelId from route params
  const params = useParams()
  const channelId = params.channelId as string

  // Pass params.channelId and userRole to the hook
  const {
    channels,
    messages,
    pinnedMessages,
    sendMessage,
    togglePin,
    addReaction,
    editMessage,
    deleteMessage,
    addChannel,
    addChannelCategory,
    reportMessage,    // Get new functions
    approveMessage,
    rejectMessage,
  } = useCommunityMock(channelId, userRole)

  // refs
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Types
  type ThreadedMessage = {
    message: Message;
    replies: Message[];
  }

  // local state
  const [showFab, setShowFab] = useState(false)
  const [isPinnedModalOpen, setIsPinnedModalOpen] = useState(false)
  const [selectedPinnedMessage, setSelectedPinnedMessage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    userName: string;
    content: string;
  } | null>(null)

  // Track which threads are expanded
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  // Toggle thread expansion
  const toggleThreadExpansion = useCallback((threadId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  }, []);

  /* ----------------------------- helpers ----------------------------- */
  // Organize messages into thread structure
  const threadedMessages = useMemo(() => {
    // Create maps for messages and their children
    const messageMap = new Map<string, Message>();
    const childrenMap = new Map<string, Message[]>();

    // First pass: index all messages and prepare the children map
    messages.forEach(message => {
      messageMap.set(message.id, message);
    });

    // Second pass: organize messages into parent-child relationships
    messages.forEach(message => {
      if (message.replyToId && messageMap.has(message.replyToId)) {
        const children = childrenMap.get(message.replyToId) || [];
        children.push(message);
        childrenMap.set(message.replyToId, children);
      }
    });

    // Find root messages (those without a replyToId or with a replyToId that doesn't exist)
    const rootMessages = messages.filter(message =>
      !message.replyToId || !messageMap.has(message.replyToId)
    );

    // Build hierarchical structure
    const threads = rootMessages
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(rootMsg => {
        const directReplies = childrenMap.get(rootMsg.id) || [];
        directReplies.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return {
          message: rootMsg,
          replies: directReplies
        };
      });

    return {
      threads: threads,
      childrenMap: childrenMap
    };
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const openPinnedModal = useCallback((content: string) => {
    setSelectedPinnedMessage(content)
    setIsPinnedModalOpen(true)
  }, [])

  const handleReply = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setReplyingTo({
        id: message.id,
        userName: message.userName,
        content: message.content
      })
    }
  }, [messages])

  const cancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  const handleSendMessage = useCallback((content: string) => {
    // We can add reply metadata here if needed
    sendMessage(content, replyingTo?.id)
    // Clear reply after sending
    setReplyingTo(null)
  }, [sendMessage, replyingTo])

  /* --------------------------- side effects -------------------------- */
  // 1) Auto‑scroll to newest msg
  useEffect(scrollToBottom, [messages, scrollToBottom])

  // 2) Toggle FAB visibility
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
      setShowFab(!nearBottom)
    }
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  /* ----------------------------- render ------------------------------ */
  const activeChannel = channels.find((c) => c.isActive)

  // Determine active channel ID for passing to MessageItem
  const activeChannelId = useMemo(() => {
    return channels.find(c => c.isActive)?.id;
  }, [channels]);

  return (
    <>
      <div className="flex flex-col overflow-hidden bg-background border h-[calc(100vh-7.5rem)]">
        {/* --- Header --- */}
        <header className="flex h-12 flex-shrink-0 items-center border-b px-4">
          <h2 className="truncate text-lg font-semibold">{activeChannel?.name ?? "Channel"}</h2>
        </header>

        {/* --- Main layout --- */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <ChannelSidebar
            channels={channels}
            userRole={userRole}
            onAddChannel={addChannel}
            onAddCategory={addChannelCategory}
          />

          {/* Chat column */}
          <section className="flex flex-1 flex-col border-l">
            {/* Pinned banner - reduced padding */}
            {pinnedMessages.length > 0 && (
              <PinnedBanner
                content={pinnedMessages[0].content}
                onViewClick={() => openPinnedModal(pinnedMessages[0].content)}
              />
            )}

            {/* 
              Messages container with threaded view
            */}
            <div
              ref={containerRef}
              className="relative flex-1 overflow-y-auto px-3 pt-3 pb-1"
            >
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-6">
                  {threadedMessages.threads.map((thread) => (
                    <div key={thread.message.id} className="thread-container pb-4">
                      {/* Parent message with reply count indicator */}
                      <div
                        className={cn(
                          "relative",
                          thread.replies.length > 0 && "cursor-pointer"
                        )}
                        onClick={() => thread.replies.length > 0 && toggleThreadExpansion(thread.message.id)}
                      >
                        <MessageItem
                          key={thread.message.id}
                          message={thread.message}
                          onTogglePin={togglePin}
                          onAddReaction={addReaction}
                          onReply={handleReply}
                          replyingActive={replyingTo?.id === thread.message.id}
                          replyCount={thread.replies.length}
                          isThreadExpanded={expandedThreads.has(thread.message.id)}
                          onThreadToggle={() => toggleThreadExpansion(thread.message.id)}
                          userRole={userRole}
                          onEdit={editMessage}
                          onDelete={deleteMessage}
                          onReport={reportMessage}
                          activeChannelId={activeChannelId}
                          onApprove={approveMessage}
                          onReject={rejectMessage}
                        />
                      </div>

                      {/* Replies - only shown when expanded */}
                      {thread.replies.length > 0 && expandedThreads.has(thread.message.id) && (
                        <ThreadReplies
                          replies={thread.replies}
                          childrenMap={threadedMessages.childrenMap}
                          onTogglePin={togglePin}
                          onAddReaction={addReaction}
                          onReply={handleReply}
                          replyingToId={replyingTo?.id}
                          level={1}
                          expandedThreads={expandedThreads}
                          toggleThreadExpansion={toggleThreadExpansion}
                          userRole={userRole}
                          onEdit={editMessage}
                          onDelete={deleteMessage}
                          onReport={reportMessage}
                          activeChannelId={activeChannelId}
                          onApprove={approveMessage}
                          onReject={rejectMessage}
                        />
                      )}
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>
              )}
              {showFab && <ScrollFab onClick={scrollToBottom} />}
            </div>

            {/* Reply context (if replying) */}
            {replyingTo && (
              <div className="flex-shrink-0 bg-muted/20 px-3 py-2 border-t flex items-center justify-between">
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs text-muted-foreground">
                    Replying to <span className="font-medium">{replyingTo.userName}</span>
                  </div>
                  <div className="text-sm text-ellipsis line-clamp-2 overflow-hidden">{replyingTo.content}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 flex-shrink-0 ml-2"
                  onClick={cancelReply}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel reply</span>
                </Button>
              </div>
            )}

            {/* Composer - minimal padding */}
            <footer className="flex-shrink-0 border-t py-2 px-3">
              <ChatComposer
                onSendMessage={handleSendMessage}
                placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Type a message..."}
              />
            </footer>
          </section>
        </div>
      </div>

      {/* Pinned Message Modal */}
      <Dialog open={isPinnedModalOpen} onOpenChange={setIsPinnedModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pin className="h-4 w-4 text-yellow-600" />
              Pinned Message
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-foreground">
            {selectedPinnedMessage}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Reusable inline sub‑components                                       */
/* ------------------------------------------------------------------ */
const EmptyState = () => (
  <div className="flex h-full items-center justify-center text-neutral-500">
    No messages yet. Start the conversation!
  </div>
)

const ScrollFab = ({ onClick }: { onClick: () => void }) => (
  <div className="absolute bottom-14 right-4 z-10">
    <Button
      size="icon"
      className="rounded-full shadow-md"
      onClick={onClick}
      aria-label="Scroll to latest"
    >
      <ArrowDown className="h-5 w-5" />
    </Button>
  </div>
)

interface PinnedBannerProps {
  content: string;
  onViewClick: () => void;
}

const PinnedBanner = ({ content, onViewClick }: PinnedBannerProps) => (
  <div className="flex-shrink-0 border-b bg-yellow-50 py-2 px-3" aria-live="polite">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Pin className="h-4 w-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">Pinned Message</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onViewClick}
        className="h-7 px-2 text-xs text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
      >
        View <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
    </div>
    <p className="mt-1 text-sm text-yellow-700 line-clamp-2 overflow-hidden">{content}</p>
  </div>
)

interface ThreadRepliesProps {
  replies: Message[];
  childrenMap: Map<string, Message[]>;
  onTogglePin?: (messageId: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
  replyingToId?: string;
  level: number;
  expandedThreads: Set<string>;
  toggleThreadExpansion: (threadId: string) => void;
  userRole: UserRole;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onReport?: (messageId: string, reason: string) => void;
  activeChannelId?: string;
  onApprove?: (messageId: string) => void;
  onReject?: (messageId: string) => void;
}

const ThreadReplies = ({
  replies,
  childrenMap,
  onTogglePin,
  onAddReaction,
  onReply,
  replyingToId,
  level,
  expandedThreads,
  toggleThreadExpansion,
  userRole,
  onEdit,
  onDelete,
  onReport,
  activeChannelId,
  onApprove,
  onReject,
}: ThreadRepliesProps) => {
  // Maximum nesting level (to prevent too deep nesting)
  const MAX_NESTING = 3;

  // Recursive component that renders replies at any level
  const RenderReplies = ({ replyList, nestingLevel }: { replyList: Message[], nestingLevel: number }) => {
    const atMaxNesting = nestingLevel >= MAX_NESTING;
    const indentClass = nestingLevel === 1
      ? "ml-8 border-l-2 border-muted/60 pl-3 pt-1 pb-1"
      : "ml-4 border-l-2 border-muted/40 pl-3";

    return (
      <div className={cn("space-y-4 mt-2", indentClass)}>
        {replyList.map(reply => {
          const hasReplies = childrenMap.has(reply.id) && childrenMap.get(reply.id)!.length > 0;
          const isExpanded = expandedThreads.has(reply.id);
          const replyCount = hasReplies ? childrenMap.get(reply.id)!.length : 0;

          return (
            <div key={reply.id} className="pb-2">
              {/* Reply with conditional click handler for toggling */}
              <div
                className={cn(
                  "relative",
                  hasReplies && "cursor-pointer"
                )}
                onClick={() => hasReplies && toggleThreadExpansion(reply.id)}
              >
                <MessageItem
                  message={reply}
                  onTogglePin={onTogglePin}
                  onAddReaction={onAddReaction}
                  onReply={onReply}
                  replyingActive={replyingToId === reply.id}
                  isThreadReply={true}
                  className={cn(
                    "bg-muted/5 hover:bg-muted/10",
                    nestingLevel > 1 && "border-l-2 border-muted/10"
                  )}
                  replyCount={replyCount}
                  isThreadExpanded={isExpanded}
                  onThreadToggle={() => toggleThreadExpansion(reply.id)}
                  userRole={userRole}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReport={onReport}
                  activeChannelId={activeChannelId}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              </div>

              {/* Show nested replies if expanded */}
              {hasReplies && isExpanded && (
                <RenderReplies
                  replyList={childrenMap.get(reply.id)!}
                  nestingLevel={atMaxNesting ? MAX_NESTING : nestingLevel + 1}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return <RenderReplies replyList={replies} nestingLevel={level} />;
};
