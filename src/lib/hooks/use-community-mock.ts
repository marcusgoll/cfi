"use client"

import { useState, useEffect, useCallback } from "react"
import type { UserRole } from "@/components/Shell/Topbar" // Import UserRole

export type Channel = {
  id: string
  name: string
  icon: string
  unreadCount: number
  isActive?: boolean
  category?: string
}

export type ReportedMessageInfo = {
  reasons: string[];
  reportCount: number;
}

export type Message = {
  id: string
  channelId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: string
  isPinned?: boolean
  replyToId?: string
  replyToUserName?: string
  reactions?: {
    emoji: string
    count: number
    userIds: string[]
  }[]
  reportData?: ReportedMessageInfo // Add field for moderation channel
}

export type CommunityData = {
  channels: Channel[]
  messages: Message[]
  pinnedMessages: Message[]
  isLoading: boolean
}

const MODERATION_CHANNEL_ID = "cfi-moderation-queue";

export function useCommunityMock(channelId?: string, userRole: UserRole = "student"): CommunityData & {
  sendMessage: (content: string, replyToId?: string) => void
  togglePin: (messageId: string) => void
  addReaction: (messageId: string, emoji: string) => void
  editMessage: (messageId: string, newContent: string) => void
  deleteMessage: (messageId: string) => void
  addChannel: (name: string, icon: string, category: string) => void
  addChannelCategory: (name: string) => void
  reportMessage: (messageId: string, reason: string) => void
  approveMessage: (messageId: string) => void
  rejectMessage: (messageId: string) => void
} {
  const [data, setData] = useState<CommunityData>({
    channels: [],
    messages: [],
    pinnedMessages: [],
    isLoading: true,
  })
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [reportedMessages, setReportedMessages] = useState<Map<string, ReportedMessageInfo>>(new Map());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Flag for initial load

  // Effect 1: Load initial static data (channels, messages)
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockChannelsData: Channel[] = [
        { id: "announcements", name: "Announcements", icon: "Megaphone", unreadCount: 2, category: "Community" },
        { id: "events", name: "Events", icon: "Calendar", unreadCount: 0, category: "Community" },
        { id: "introductions", name: "Introductions", icon: "User", unreadCount: 3, category: "Community" },
        { id: "general", name: "General Chat", icon: "MessageSquare", unreadCount: 0, category: "Community" }, // Removed isActive here
        { id: "support", name: "Support", icon: "LifeBuoy", unreadCount: 1, category: "Help" },
        { id: "feedback", name: "Feedback", icon: "MessageCircle", unreadCount: 0, category: "Help" },
      ]

      const mockMessagesData: Message[] = [
        { id: "1", channelId: "general", userId: "1", userName: "John Smith", content: "Hey everyone! google.com", timestamp: "2025-04-22T14:30:00Z", reactions: [{ emoji: "👋", count: 3, userIds: ["2", "3", "4"] }] },
        { id: "2", channelId: "general", userId: "2", userName: "Sarah Johnson", content: "Welcome John! CFIPros is great.", timestamp: "2025-04-22T14:35:00Z", replyToId: "1", replyToUserName: "John Smith" },
        { id: "3", channelId: "general", userId: "3", userName: "Michael Chen", content: "Batch analysis question?", timestamp: "2025-04-22T15:10:00Z", isPinned: true },
        { id: "4", channelId: "general", userId: "4", userName: "Emily Rodriguez", content: "@Michael Chen, I can help!", timestamp: "2025-04-22T15:15:00Z", replyToId: "3", replyToUserName: "Michael Chen" },
        { id: "5", channelId: "general", userId: "5", userName: "David Wilson", content: "Virtual meetup next Friday! www.example.com", timestamp: "2025-04-22T16:00:00Z", reactions: [{ emoji: "👍", count: 5, userIds: ["1", "2", "3", "4", "6"] }, { emoji: "🎉", count: 2, userIds: ["1", "4"] }] },
        // Add a message reported multiple times for testing
        { id: "6", channelId: "general", userId: "6", userName: "Report Target", content: "This might be inappropriate?", timestamp: "2025-04-23T10:00:00Z" },
      ]

      setAllMessages(mockMessagesData);

      // Set initial reported messages for testing
      const initialReported = new Map<string, ReportedMessageInfo>();
      initialReported.set("1", { reasons: ["Spam link"], reportCount: 1 });
      initialReported.set("6", { reasons: ["Inappropriate", "Rude"], reportCount: 2 });
      setReportedMessages(initialReported);

      // Set initial channels (without moderation channel yet)
      setData(prev => ({ ...prev, channels: mockChannelsData, isLoading: false }));
      setInitialLoadComplete(true); // Mark initial load as complete

    }, 500)

    return () => clearTimeout(timer)
  }, []) // Run only once on mount

  // Effect 2: Update channels and messages based on role, active channel, and reports
  useEffect(() => {
    // Wait for initial data and userRole to be potentially updated from localStorage
    if (!initialLoadComplete || !userRole) return;

    setData(prev => {
      // Start with the base channels loaded in Effect 1
      let currentChannels = [...prev.channels];

      // Add moderation channel if superadmin
      if (userRole === 'superadmin' && !currentChannels.some(ch => ch.id === MODERATION_CHANNEL_ID)) {
        currentChannels.push({
          id: MODERATION_CHANNEL_ID,
          name: "Moderation Queue",
          icon: "AlertTriangle",
          category: "Admin",
          unreadCount: reportedMessages.size,
          isActive: false, // Will be set below
        });
      } else if (userRole !== 'superadmin') {
        // Remove moderation channel if user is not superadmin
        currentChannels = currentChannels.filter(ch => ch.id !== MODERATION_CHANNEL_ID);
      }

      // Determine the active channel ID (use passed channelId or default to general)
      const targetChannelId = channelId || 'general';
      // Make sure the target channel exists, otherwise default to first available
      const finalActiveChannelId = currentChannels.some(ch => ch.id === targetChannelId)
        ? targetChannelId
        : currentChannels[0]?.id;

      // Update isActive status for all channels
      const updatedChannels = currentChannels.map(channel => ({
        ...channel,
        isActive: channel.id === finalActiveChannelId,
        // Update moderation queue count
        unreadCount: channel.id === MODERATION_CHANNEL_ID ? reportedMessages.size : channel.unreadCount,
      }));

      // Filter messages based on the *final* active channel
      let displayedMessages: Message[] = [];
      if (finalActiveChannelId === MODERATION_CHANNEL_ID) {
        // Show only reported messages, sorted by report count
        displayedMessages = allMessages
          .filter(msg => reportedMessages.has(msg.id))
          .map(msg => ({
            ...msg,
            reportData: reportedMessages.get(msg.id) // Attach report data
          }))
          .sort((a, b) => (b.reportData?.reportCount ?? 0) - (a.reportData?.reportCount ?? 0));
      } else {
        // Show messages for the current channel (DO NOT filter out reported messages here)
        displayedMessages = allMessages.filter(msg =>
          msg.channelId === finalActiveChannelId
        );
      }

      const displayedPinnedMessages = displayedMessages.filter(msg => msg.isPinned);

      return {
        ...prev,
        channels: updatedChannels,
        messages: displayedMessages,
        pinnedMessages: displayedPinnedMessages,
      };
    });
    // Rerun when initial load finishes, userRole changes, channelId prop changes, or reports change
  }, [initialLoadComplete, userRole, channelId, allMessages, reportedMessages]);

  const sendMessage = useCallback(
    (content: string, replyToId?: string) => {
      const activeChannel = data.channels.find((c) => c.isActive)
      if (!activeChannel) return

      const newMessage: Message = {
        id: `new-${Date.now()}`,
        channelId: activeChannel.id,
        userId: "current-user",
        userName: "You",
        userAvatar: "/placeholder.svg?height=40&width=40",
        content,
        timestamp: new Date().toISOString(),
        isPinned: false,
        replyToId,
        replyToUserName: replyToId ? data.messages.find((m) => m.id === replyToId)?.userName : undefined,
      }

      setData((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        pinnedMessages: replyToId ? [...prev.pinnedMessages, newMessage] : prev.pinnedMessages,
      }))
    },
    [data.channels, data.messages]
  )

  const togglePin = useCallback(
    (messageId: string) => {
      setData((prev) => {
        const updatedMessages = prev.messages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              isPinned: !message.isPinned,
            }
          }
          return message
        })

        const updatedPinnedMessages = updatedMessages.filter((message) => message.isPinned)

        return {
          ...prev,
          messages: updatedMessages,
          pinnedMessages: updatedPinnedMessages,
        }
      })
    },
    []
  )

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      const currentUserId = "current-user"; // In a real app, this would be the actual user ID

      setData((prev) => {
        const updatedMessages = prev.messages.map((message) => {
          if (message.id === messageId) {
            const existingReactionIndex = message.reactions?.findIndex((r) => r.emoji === emoji) ?? -1;
            let updatedReactions = message.reactions || [];

            if (existingReactionIndex >= 0 && updatedReactions[existingReactionIndex]) {
              // Check if user already reacted with this emoji
              const reaction = updatedReactions[existingReactionIndex];
              const userReacted = reaction.userIds.includes(currentUserId);

              if (userReacted) {
                // Remove user's reaction
                const updatedUserIds = reaction.userIds.filter(id => id !== currentUserId);

                if (updatedUserIds.length === 0) {
                  // Remove the reaction entirely if no users left
                  updatedReactions = updatedReactions.filter((_, index) => index !== existingReactionIndex);
                } else {
                  // Update the reaction with user removed
                  updatedReactions = updatedReactions.map((reaction, index) => {
                    if (index === existingReactionIndex) {
                      return {
                        ...reaction,
                        count: reaction.count - 1,
                        userIds: updatedUserIds,
                      };
                    }
                    return reaction;
                  });
                }
              } else {
                // Add user's reaction to existing emoji
                updatedReactions = updatedReactions.map((reaction, index) => {
                  if (index === existingReactionIndex) {
                    return {
                      ...reaction,
                      count: reaction.count + 1,
                      userIds: [...reaction.userIds, currentUserId],
                    };
                  }
                  return reaction;
                });
              }
            } else {
              // Add new reaction
              updatedReactions = [
                ...(message.reactions || []),
                {
                  emoji,
                  count: 1,
                  userIds: [currentUserId],
                },
              ];
            }

            return {
              ...message,
              reactions: updatedReactions,
            };
          }
          return message;
        });

        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    },
    []
  );

  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      setData((prev) => {
        const updatedMessages = prev.messages.map((message) => {
          if (message.id === messageId && message.userId === "current-user") {
            return {
              ...message,
              content: newContent,
              // Optionally add an "edited" flag or timestamp
            };
          }
          return message;
        });

        // Update pinned messages if the edited message was pinned
        const updatedPinnedMessages = prev.pinnedMessages.map((message) => {
          if (message.id === messageId && message.userId === "current-user") {
            return {
              ...message,
              content: newContent,
            };
          }
          return message;
        });

        return {
          ...prev,
          messages: updatedMessages,
          pinnedMessages: updatedPinnedMessages,
        };
      });
    },
    []
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      setData((prev) => {
        // Only allow deleting your own messages
        const canDelete = prev.messages.some(
          (message) => message.id === messageId && message.userId === "current-user"
        );

        if (!canDelete) return prev;

        // Remove the message
        const updatedMessages = prev.messages.filter((message) => message.id !== messageId);

        // Remove from pinned messages if it was pinned
        const updatedPinnedMessages = prev.pinnedMessages.filter((message) => message.id !== messageId);

        // Also consider - should replies to this message be orphaned or deleted?
        // For simplicity, we'll keep the replies but they'll be orphaned
        // A more complex implementation could handle this differently

        return {
          ...prev,
          messages: updatedMessages,
          pinnedMessages: updatedPinnedMessages,
        };
      });
    },
    []
  );

  const addChannel = useCallback(
    (name: string, icon: string, category: string) => {
      const newChannel: Channel = {
        id: `channel-${Date.now()}`,
        name,
        icon,
        category,
        unreadCount: 0,
        isActive: false, // New channels are not active by default
      };

      setData((prev) => ({
        ...prev,
        channels: [...prev.channels, newChannel],
      }));
    },
    []
  );

  const addChannelCategory = useCallback(
    (name: string) => {
      // This function might need to interact with how categories are managed.
      // For this mock, we'll just add a placeholder channel to represent the category
      // or rely on the addChannel function to create categories implicitly.
      // A better approach would be to manage categories separately.
      console.log(`Adding channel category: ${name}`);
      // Example: Add a first channel under the new category
      addChannel(`general-${name.toLowerCase()}`, "Hash", name);
    },
    [addChannel] // Depend on addChannel
  );

  // Function to report a message
  const reportMessage = useCallback((messageId: string, reason: string) => {
    setReportedMessages(prev => {
      const newMap = new Map(prev);
      const existingReport = newMap.get(messageId);
      if (existingReport) {
        newMap.set(messageId, {
          reasons: [...existingReport.reasons, reason].filter((v, i, a) => a.indexOf(v) === i),
          reportCount: existingReport.reportCount + 1,
        });
      } else {
        newMap.set(messageId, { reasons: [reason], reportCount: 1 });
      }
      console.log(`Reported message ${messageId}. New map size: ${newMap.size}`); // Debug log
      return newMap;
    });
    // NO immediate data update here - rely on the useEffect filter
  }, []);

  // Function to approve a message (remove from reported list)
  const approveMessage = useCallback((messageId: string) => {
    setReportedMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(messageId);
      console.log(`Approved message ${messageId}. New map size: ${newMap.size}`); // Debug log
      return newMap;
    });
    // NO immediate data update here - rely on the useEffect filter
  }, []);

  // Function to reject a message (remove from reported AND delete original)
  const rejectMessage = useCallback((messageId: string) => {
    // 1. Remove from reported list first
    let messageWasReported = false;
    setReportedMessages(prev => {
      const newMap = new Map(prev);
      if (newMap.has(messageId)) {
        messageWasReported = true;
        newMap.delete(messageId);
        console.log(`Rejected message ${messageId}. Removing from reports. New map size: ${newMap.size}`); // Debug log
      }
      return newMap;
    });

    // 2. Only remove from allMessages if it was actually in the reported list 
    //    (prevents accidental deletion if state updates overlap weirdly)
    //    OR if superadmin wants to delete directly (future enhancement?)
    if (messageWasReported) { // For now, only delete if it was rejected from queue
      setAllMessages(prev => prev.filter(msg => msg.id !== messageId));
      console.log(`Deleted message ${messageId} from allMessages.`); // Debug log
    }
    // NO immediate data update here - rely on the useEffect filter
  }, []);

  return {
    ...data,
    sendMessage,
    togglePin,
    addReaction,
    editMessage,
    deleteMessage,
    addChannel,
    addChannelCategory,
    reportMessage,
    approveMessage,
    rejectMessage,
  }
}
