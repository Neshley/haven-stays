import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatChannel, ChatMessage, ChatUser, ListingAttachment } from '../types';
import { CHAT_CHANNELS, INITIAL_CHAT_MESSAGES, DEFAULT_CURRENT_USER } from '../data/chatData';

// Subtle Web Audio synthesizer chime for incoming messages
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.16); // D6

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  } catch {
    // AudioContext blocked by browser policy until gesture
  }
}

export function useChat() {
  // Current user customization stored in localStorage
  const [currentUser, setCurrentUser] = useState<ChatUser>(() => {
    try {
      const saved = localStorage.getItem('haven_chat_user');
      return saved ? JSON.parse(saved) : DEFAULT_CURRENT_USER;
    } catch {
      return DEFAULT_CURRENT_USER;
    }
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('haven-lounge');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('haven_chat_messages');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  const [onlineCount, setOnlineCount] = useState<number>(7);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const typingTimerRef = useRef<any>(null);

  // Persist current user changes
  useEffect(() => {
    try {
      localStorage.setItem('haven_chat_user', JSON.stringify(currentUser));
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  // Persist messages backup
  useEffect(() => {
    try {
      localStorage.setItem('haven_chat_messages', JSON.stringify(messages.slice(-100)));
    } catch (err) {
      console.error(err);
    }
  }, [messages]);

  // Connect to WebSocket server with fallback
  useEffect(() => {
    let isSubscribed = true;

    function connect() {
      if (typeof window === 'undefined') return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          if (!isSubscribed) return;
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          if (!isSubscribed) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'init') {
              if (Array.isArray(data.payload?.messages) && data.payload.messages.length > 0) {
                setMessages((prev) => {
                  const existingIds = new Set(prev.map((m) => m.id));
                  const combined = [...prev];
                  data.payload.messages.forEach((m: ChatMessage) => {
                    if (!existingIds.has(m.id)) {
                      combined.push(m);
                    }
                  });
                  return combined;
                });
              }
              if (typeof data.payload?.onlineCount === 'number') {
                setOnlineCount(data.payload.onlineCount);
              }
            } else if (data.type === 'message:new') {
              const newMsg: ChatMessage = data.payload;
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              if (newMsg.sender.id !== currentUser.id && soundEnabled) {
                playNotificationChime();
              }
            } else if (data.type === 'reaction:updated') {
              const { messageId, reactions } = data.payload;
              setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
              );
            } else if (data.type === 'presence:update') {
              if (typeof data.payload?.onlineCount === 'number') {
                setOnlineCount(data.payload.onlineCount);
              }
            } else if (data.type === 'typing') {
              const { userName, channelId } = data.payload;
              if (channelId === activeChannelId && userName !== currentUser.name) {
                setTypingUsers((prev) => Array.from(new Set([...prev, userName])));
                clearTimeout(typingTimerRef.current);
                typingTimerRef.current = setTimeout(() => {
                  setTypingUsers([]);
                }, 3000);
              }
            }
          } catch (err) {
            console.error('Error handling WS message:', err);
          }
        };

        ws.onclose = () => {
          if (!isSubscribed) return;
          setIsConnected(false);
          // Try reconnecting after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isSubscribed) connect();
          }, 3000);
        };

        ws.onerror = () => {
          // Silent fallback to local/HTTP mode
          ws.close();
        };
      } catch (err) {
        setIsConnected(false);
      }
    }

    connect();

    // Also fetch messages once via HTTP in case WS is upgrading or offline
    fetch(`/api/chat/messages?channelId=${activeChannelId}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (isSubscribed && Array.isArray(data) && data.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const merged = [...prev];
            data.forEach((m: ChatMessage) => {
              if (!existingIds.has(m.id)) merged.push(m);
            });
            return merged;
          });
        }
      })
      .catch(() => {
        // Fallback already uses initial/saved messages
      });

    return () => {
      isSubscribed = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [activeChannelId, currentUser.id, soundEnabled]);

  // Send message
  const sendMessage = useCallback(
    async (content: string, listingAttachment?: ListingAttachment) => {
      if (!content.trim() && !listingAttachment) return;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        channelId: activeChannelId,
        sender: currentUser,
        content: content.trim(),
        timestamp: Date.now(),
        reactions: {},
        listingAttachment,
      };

      // 1. Optimistic local update
      setMessages((prev) => [...prev, newMsg]);

      // 2. Broadcast via WebSocket if open
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'message:send',
            payload: {
              channelId: activeChannelId,
              sender: currentUser,
              content: content.trim(),
              listingAttachment,
            },
          })
        );
      } else {
        // 3. Fallback to HTTP POST
        try {
          await fetch('/api/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              channelId: activeChannelId,
              sender: currentUser,
              content: content.trim(),
              listingAttachment,
            }),
          });
        } catch {
          // Optimistic local state already applied
        }
      }
    },
    [activeChannelId, currentUser]
  );

  // Toggle reaction
  const toggleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      // Optimistic update
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = { ...(m.reactions || {}) };
          const userList = currentReactions[emoji] || [];
          if (userList.includes(currentUser.id)) {
            currentReactions[emoji] = userList.filter((id) => id !== currentUser.id);
            if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = [...userList, currentUser.id];
          }
          return { ...m, reactions: currentReactions };
        })
      );

      // Send to server
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'reaction:toggle',
            payload: { messageId, emoji, userId: currentUser.id },
          })
        );
      } else {
        try {
          await fetch('/api/chat/reactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, emoji, userId: currentUser.id }),
          });
        } catch {
          // fallback maintained
        }
      }
    },
    [currentUser.id]
  );

  // Send typing event
  const sendTyping = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'typing',
          payload: { userName: currentUser.name, channelId: activeChannelId },
        })
      );
    }
  }, [currentUser.name, activeChannelId]);

  const activeChannel =
    CHAT_CHANNELS.find((c) => c.id === activeChannelId) || CHAT_CHANNELS[0];

  const currentChannelMessages = messages.filter((m) => m.channelId === activeChannelId);

  return {
    currentUser,
    setCurrentUser,
    channels: CHAT_CHANNELS,
    activeChannel,
    activeChannelId,
    setActiveChannelId,
    messages: currentChannelMessages,
    allMessagesCount: messages.length,
    onlineCount,
    isConnected,
    typingUsers,
    soundEnabled,
    setSoundEnabled,
    sendMessage,
    toggleReaction,
    sendTyping,
  };
}
