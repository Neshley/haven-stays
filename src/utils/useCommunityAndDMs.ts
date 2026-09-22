import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ForumThread,
  ForumReply,
  ForumTopicCategory,
  DirectConversation,
  DirectMessage,
  DirectMessageAttachment,
  ChatUser,
  Listing,
  ListingAttachment,
} from '../types';
import { INITIAL_FORUM_THREADS } from '../data/forumData';
import { INITIAL_DIRECT_CONVERSATIONS, INITIAL_DIRECT_MESSAGES } from '../data/directMessageData';
import { ACTIVE_COMMUNITY_USERS, DEFAULT_CURRENT_USER } from '../data/chatData';

// Play crisp subtle chime for direct messages
function playDmNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.14); // C6

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Audio context may be restricted before user gesture
  }
}

export function useCommunityAndDMs() {
  // Current logged in community user
  const [currentUser, setCurrentUser] = useState<ChatUser>(() => {
    try {
      const saved = localStorage.getItem('haven_chat_user');
      return saved ? JSON.parse(saved) : DEFAULT_CURRENT_USER;
    } catch {
      return DEFAULT_CURRENT_USER;
    }
  });

  // Privacy Control: Incognito status
  const [isIncognito, setIsIncognito] = useState<boolean>(() => {
    try {
      return localStorage.getItem('haven_user_incognito') === 'true';
    } catch {
      return false;
    }
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active Hub Tab: 'forum' | 'dms' | 'live'
  const [activeTab, setActiveTab] = useState<'forum' | 'dms' | 'live'>('forum');

  // ==========================================
  // 1. FORUM STATE
  // ==========================================
  const [threads, setThreads] = useState<ForumThread[]>(() => {
    try {
      const saved = localStorage.getItem('haven_forum_threads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FORUM_THREADS;
  });

  const [selectedCategory, setSelectedCategory] = useState<ForumTopicCategory>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Persist threads
  useEffect(() => {
    try {
      localStorage.setItem('haven_forum_threads', JSON.stringify(threads));
    } catch (e) {
      console.error(e);
    }
  }, [threads]);

  // Persist incognito preference
  useEffect(() => {
    try {
      localStorage.setItem('haven_user_incognito', String(isIncognito));
    } catch (e) {
      console.error(e);
    }
  }, [isIncognito]);

  // All unique tags extracted from threads
  const allTags = useMemo(() => {
    const set = new Set<string>();
    threads.forEach((t) => {
      t.tags.forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [threads]);

  // Filtered threads based on category, search, tag
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag && !t.tags.includes(selectedTag)) {
        return false;
      }
      // Search term filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesContent = t.content.toLowerCase().includes(q);
        const matchesAuthor = t.author.name.toLowerCase().includes(q);
        const matchesTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesReply = t.replies.some(
          (r) => r.content.toLowerCase().includes(q) || r.author.name.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesTag && !matchesReply) {
          return false;
        }
      }
      return true;
    });
  }, [threads, selectedCategory, selectedTag, searchQuery]);

  // Active thread object
  const activeThread = useMemo(() => {
    if (!activeThreadId) return null;
    return threads.find((t) => t.id === activeThreadId) || null;
  }, [threads, activeThreadId]);

  // Create new thread
  const createThread = useCallback(
    (
      title: string,
      category: ForumTopicCategory,
      content: string,
      tags: string[],
      listingAttachment?: ListingAttachment
    ) => {
      if (!title.trim() || !content.trim()) return;

      const newThread: ForumThread = {
        id: `thread-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        category: category === 'all' ? 'general' : category,
        tags: tags.map((t) => t.toLowerCase().replace(/^[#\s]+/, '')).filter(Boolean),
        author: currentUser,
        content: content.trim(),
        timestamp: Date.now(),
        replies: [],
        reactions: {},
        isPinned: false,
        isLocked: false,
        viewCount: 1,
        listingAttachment,
      };

      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThread.id);
      return newThread;
    },
    [currentUser]
  );

  // Add reply to thread (with support for nested parent reply)
  const addReply = useCallback(
    (threadId: string, content: string, parentReplyId?: string) => {
      if (!content.trim()) return;

      const newReply: ForumReply = {
        id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        threadId,
        author: currentUser,
        content: content.trim(),
        timestamp: Date.now(),
        reactions: {},
        parentReplyId,
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== threadId) return t;
          return {
            ...t,
            replies: [...t.replies, newReply],
          };
        })
      );
    },
    [currentUser]
  );

  // Toggle reaction on a thread
  const toggleThreadReaction = useCallback(
    (threadId: string, emoji: string) => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== threadId) return t;
          const currentReactions = { ...(t.reactions || {}) };
          const userList = currentReactions[emoji] || [];
          if (userList.includes(currentUser.id)) {
            currentReactions[emoji] = userList.filter((id) => id !== currentUser.id);
            if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = [...userList, currentUser.id];
          }
          return { ...t, reactions: currentReactions };
        })
      );
    },
    [currentUser.id]
  );

  // Toggle reaction on a reply
  const toggleReplyReaction = useCallback(
    (threadId: string, replyId: string, emoji: string) => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== threadId) return t;
          const updatedReplies = t.replies.map((r) => {
            if (r.id !== replyId) return r;
            const currentReactions = { ...(r.reactions || {}) };
            const userList = currentReactions[emoji] || [];
            if (userList.includes(currentUser.id)) {
              currentReactions[emoji] = userList.filter((id) => id !== currentUser.id);
              if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
            } else {
              currentReactions[emoji] = [...userList, currentUser.id];
            }
            return { ...r, reactions: currentReactions };
          });
          return { ...t, replies: updatedReplies };
        })
      );
    },
    [currentUser.id]
  );

  // Forum Moderation: Pin thread
  const togglePinThread = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, isPinned: !t.isPinned } : t))
    );
  }, []);

  // Forum Moderation: Lock thread
  const toggleLockThread = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, isLocked: !t.isLocked } : t))
    );
  }, []);

  // Forum Moderation: Report thread
  const reportThread = useCallback(
    (threadId: string, reason: string) => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== threadId) return t;
          const reports = t.reports || [];
          return {
            ...t,
            reports: [...reports, { userId: currentUser.id, reason, timestamp: Date.now() }],
          };
        })
      );
    },
    [currentUser.id]
  );

  // Forum Moderation: Delete thread
  const deleteThread = useCallback((threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    setActiveThreadId(null);
  }, []);

  // ==========================================
  // 2. DIRECT MESSAGES (DMs) STATE
  // ==========================================
  const [conversations, setConversations] = useState<DirectConversation[]>(() => {
    try {
      const saved = localStorage.getItem('haven_dm_conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DIRECT_CONVERSATIONS;
  });

  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('haven_dm_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DIRECT_MESSAGES;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Blocked users set
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('haven_blocked_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist DMs
  useEffect(() => {
    try {
      localStorage.setItem('haven_dm_conversations', JSON.stringify(conversations));
    } catch (e) {
      console.error(e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('haven_dm_messages', JSON.stringify(directMessages));
    } catch (e) {
      console.error(e);
    }
  }, [directMessages]);

  useEffect(() => {
    try {
      localStorage.setItem('haven_blocked_users', JSON.stringify(blockedUserIds));
    } catch (e) {
      console.error(e);
    }
  }, [blockedUserIds]);

  // Total unread DMs count
  const totalUnreadDMs = useMemo(() => {
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Active messages list
  const currentDirectMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return directMessages[activeConversationId] || [];
  }, [directMessages, activeConversationId]);

  // Open / Start conversation with a user (e.g. Host or Guest)
  const openDirectConversationWithUser = useCallback(
    (targetUser: ChatUser, initialAttachment?: DirectMessageAttachment) => {
      // Find existing conversation
      const existing = conversations.find((c) => c.otherUser.id === targetUser.id);
      if (existing) {
        setActiveConversationId(existing.id);
        setActiveTab('dms');
        // Mark as read
        if (existing.unreadCount > 0) {
          setConversations((prev) =>
            prev.map((c) => (c.id === existing.id ? { ...c, unreadCount: 0 } : c))
          );
        }
        return existing.id;
      }

      // Create new conversation
      const newConvId = `conv-${targetUser.id.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now().toString(36)}`;
      const newConv: DirectConversation = {
        id: newConvId,
        otherUser: targetUser,
        unreadCount: 0,
        isBlocked: blockedUserIds.includes(targetUser.id),
        isMuted: false,
        updatedAt: Date.now(),
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConvId);
      setActiveTab('dms');

      // Initialize empty messages
      setDirectMessages((prev) => ({
        ...prev,
        [newConvId]: [],
      }));

      return newConvId;
    },
    [conversations, blockedUserIds]
  );

  // Send Direct Message
  const sendDirectMessage = useCallback(
    (
      content: string,
      attachment?: DirectMessageAttachment
    ) => {
      if (!activeConversationId || (!content.trim() && !attachment)) return;
      const conv = conversations.find((c) => c.id === activeConversationId);
      if (!conv) return;

      if (blockedUserIds.includes(conv.otherUser.id)) {
        alert('You have blocked this user. Unblock them in privacy settings to send messages.');
        return;
      }

      const newMsg: DirectMessage = {
        id: `dm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conversationId: activeConversationId,
        senderId: currentUser.id,
        recipientId: conv.otherUser.id,
        content: content.trim(),
        timestamp: Date.now(),
        status: 'sent',
        attachment,
      };

      // Add to messages
      setDirectMessages((prev) => ({
        ...prev,
        [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
      }));

      // Update conversation lastMessage & updatedAt
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, lastMessage: newMsg, updatedAt: Date.now() }
            : c
        )
      );

      // Simulate realistic auto-reply from host after 2.5 seconds if talking to a seeded host
      if (['user-elena', 'user-liam', 'user-chloe', 'user-marcus'].includes(conv.otherUser.id)) {
        setTimeout(() => {
          const hostReplies: Record<string, string[]> = {
            'user-elena': [
              'Thank you for reaching out! I will check with our housekeeping team and get right back to you.',
              'Received! The caldera views from our terrace are breathtaking right now. Let me know if you need airport transfer!',
            ],
            'user-liam': [
              'Sounds great! The loft has gigabit fiber internet and we can certainly accommodate your schedule.',
              'Thanks for the inquiry Alex. I will review the escrow details and confirm shortly.',
            ],
            'user-chloe': [
              'Positano is lovely this time of year! The sea is calm and perfect for morning paddleboarding.',
            ],
            'user-marcus': [
              'Hey! Happy to connect. Let me know if you want to collaborate or need nomad recommendations in Kyoto.',
            ],
          };

          const possible = hostReplies[conv.otherUser.id] || ['Got your message, thanks!'];
          const replyText = possible[Math.floor(Math.random() * possible.length)];

          const hostMsg: DirectMessage = {
            id: `dm-reply-${Date.now()}`,
            conversationId: activeConversationId,
            senderId: conv.otherUser.id,
            recipientId: currentUser.id,
            content: replyText,
            timestamp: Date.now(),
            status: 'delivered',
          };

          setDirectMessages((prev) => ({
            ...prev,
            [activeConversationId]: [...(prev[activeConversationId] || []), hostMsg],
          }));

          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? { ...c, lastMessage: hostMsg, updatedAt: Date.now() }
                : c
            )
          );

          if (soundEnabled) {
            playDmNotificationChime();
          }
        }, 2200);
      }
    },
    [activeConversationId, conversations, currentUser.id, blockedUserIds, soundEnabled]
  );

  // Privacy: Toggle Block user
  const toggleBlockUser = useCallback(
    (userId: string) => {
      setBlockedUserIds((prev) => {
        const isBlocked = prev.includes(userId);
        const next = isBlocked ? prev.filter((id) => id !== userId) : [...prev, userId];
        // update conversation state
        setConversations((convs) =>
          convs.map((c) => (c.otherUser.id === userId ? { ...c, isBlocked: !isBlocked } : c))
        );
        return next;
      });
    },
    []
  );

  // Privacy: Report user
  const reportUser = useCallback(
    (userId: string, reason: string) => {
      // In a real backend, this would POST to /api/reports
      console.log(`[Haven Safety] User ${userId} reported for: ${reason}`);
    },
    []
  );

  // Mark active conversation read
  const selectConversation = useCallback((convId: string) => {
    setActiveConversationId(convId);
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isIncognito,
    setIsIncognito,
    soundEnabled,
    setSoundEnabled,
    activeTab,
    setActiveTab,

    // Forum exports
    threads: filteredThreads,
    allThreadsCount: threads.length,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    allTags,
    searchQuery,
    setSearchQuery,
    activeThreadId,
    setActiveThreadId,
    activeThread,
    createThread,
    addReply,
    toggleThreadReaction,
    toggleReplyReaction,
    togglePinThread,
    toggleLockThread,
    reportThread,
    deleteThread,

    // DMs exports
    conversations,
    activeConversationId,
    activeConversation,
    currentDirectMessages,
    totalUnreadDMs,
    blockedUserIds,
    selectConversation,
    openDirectConversationWithUser,
    sendDirectMessage,
    toggleBlockUser,
    reportUser,
  };
}
