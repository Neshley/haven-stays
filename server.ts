import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  role: 'traveler' | 'superhost' | 'local_guide' | 'digital_nomad';
  location?: string;
  isOnline?: boolean;
}

interface ChatMessage {
  id: string;
  channelId: string;
  sender: ChatUser;
  content: string;
  timestamp: number;
  reactions?: Record<string, string[]>;
  listingAttachment?: {
    id: string;
    title: string;
    image: string;
    priceFormatted: string;
    intent: 'stay' | 'rent' | 'sale';
    city: string;
  };
}

// In-memory chat store (seeded with realistic community messages)
let messages: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'haven-lounge',
    sender: {
      id: 'user-elena',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      role: 'superhost',
      location: 'Santorini, Greece',
      isOnline: true,
    },
    content: 'Welcome everyone to Haven Community! 🌅 If anyone is visiting the Aegean islands this month, the sunset from Imerovigli has been spectacular this week.',
    timestamp: Date.now() - 1000 * 60 * 180,
    reactions: { '❤️': ['user-marcus', 'user-chloe'], '✨': ['user-david'] },
  },
  {
    id: 'msg-2',
    channelId: 'haven-lounge',
    sender: {
      id: 'user-marcus',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      role: 'digital_nomad',
      location: 'Kyoto, Japan',
      isOnline: true,
    },
    content: 'Just checked into an antique Machiya townhouse here in Kyoto. Fiber internet speed is blazing fast (350 Mbps), perfect for working US hours! Anyone else currently in Kansai?',
    timestamp: Date.now() - 1000 * 60 * 110,
    reactions: { '👍': ['user-elena'], '🔥': ['user-sophia'] },
    listingAttachment: {
      id: 'stay-3',
      title: 'Traditional Machiya Townhouse in Gion',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      priceFormatted: '$195/night',
      intent: 'stay',
      city: 'Kyoto, Japan',
    },
  },
  {
    id: 'msg-3',
    channelId: 'haven-lounge',
    sender: {
      id: 'user-sophia',
      name: 'Sophia Laurent',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
      role: 'local_guide',
      location: 'Paris, France',
      isOnline: true,
    },
    content: 'Tip for travelers in Paris right now: the small bakeries in the 11th arrondissement are doing seasonal pistachio brioches this morning. Highly recommend Boulangerie Utopie!',
    timestamp: Date.now() - 1000 * 60 * 45,
    reactions: { '🥐': ['user-marcus'], '❤️': ['user-elena', 'user_current'] },
  },
  {
    id: 'msg-4',
    channelId: 'haven-lounge',
    sender: {
      id: 'user-david',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      role: 'traveler',
      location: 'Lake Tahoe, CA',
      isOnline: false,
    },
    content: 'Looking at booking a mountain cabin in Lake Tahoe for a 4-person ski retreat. How are snow conditions on the north shore right now?',
    timestamp: Date.now() - 1000 * 60 * 20,
    reactions: { '⛷️': ['user-chloe'] },
  },
  {
    id: 'msg-5',
    channelId: 'local-gems',
    sender: {
      id: 'user-chloe',
      name: 'Chloe Bennett',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      role: 'local_guide',
      location: 'Amalfi, Italy',
      isOnline: true,
    },
    content: 'Do NOT miss the Path of the Gods (Sentiero degli Dei) hike if you are staying anywhere near Positano. Start early at 8 AM from Bomerano to beat the midday sun and catch the panoramic coastal views.',
    timestamp: Date.now() - 1000 * 60 * 150,
    reactions: { '❤️': ['user-sophia'], '👏': ['user-marcus'] },
  },
  {
    id: 'msg-6',
    channelId: 'roommates-rentals',
    sender: {
      id: 'user-liam',
      name: 'Liam Gallagher',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
      role: 'digital_nomad',
      location: 'Berlin, Germany',
      isOnline: true,
    },
    content: 'Looking for a flatmate for a sunny 2-bedroom loft in Friedrichshain starting next month! Fully furnished with dedicated desks and balcony. Drop a message if interested.',
    timestamp: Date.now() - 1000 * 60 * 95,
    reactions: { '🙌': ['user-marcus'] },
    listingAttachment: {
      id: 'rent-2',
      title: 'Industrial Loft with High Ceilings & Terrace',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      priceFormatted: '$2,400/mo',
      intent: 'rent',
      city: 'Berlin, Germany',
    },
  },
  {
    id: 'msg-7',
    channelId: 'travel-meetups',
    sender: {
      id: 'user-marcus',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      role: 'digital_nomad',
      location: 'Kyoto, Japan',
      isOnline: true,
    },
    content: 'Hosting a casual co-working afternoon at a coffee roastery in Sanjo on Thursday at 2 PM. Everyone in town is welcome to bring a laptop and join!',
    timestamp: Date.now() - 1000 * 60 * 60,
    reactions: { '☕': ['user-sophia', 'user-elena'] },
  },
  {
    id: 'msg-8',
    channelId: 'ask-a-host',
    sender: {
      id: 'user-elena',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      role: 'superhost',
      location: 'Santorini, Greece',
      isOnline: true,
    },
    content: 'Pro-host tip for newcomers: Always leave a handwritten neighborhood map with your personal top 3 dining spots for arriving guests. It gets mentioned in almost 90% of our 5-star reviews!',
    timestamp: Date.now() - 1000 * 60 * 200,
    reactions: { '🌟': ['user-chloe', 'user-liam'], '💡': ['user-marcus'] },
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Get messages for a channel
  app.get('/api/chat/messages', (req, res) => {
    const channelId = (req.query.channelId as string) || 'haven-lounge';
    const channelMessages = messages.filter((m) => m.channelId === channelId);
    res.json(channelMessages);
  });

  // Post a new message
  app.post('/api/chat/messages', (req, res) => {
    const { channelId, sender, content, listingAttachment } = req.body;
    if (!content || !sender || !channelId) {
      return res.status(400).json({ error: 'Missing required message fields' });
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channelId,
      sender,
      content,
      timestamp: Date.now(),
      reactions: {},
      listingAttachment,
    };

    messages.push(newMessage);

    // Keep last 300 messages to prevent infinite growth
    if (messages.length > 300) {
      messages = messages.slice(-300);
    }

    // Broadcast to WebSockets
    broadcast({
      type: 'message:new',
      payload: newMessage,
    });

    res.status(201).json(newMessage);
  });

  // Add reaction
  app.post('/api/chat/reactions', (req, res) => {
    const { messageId, emoji, userId } = req.body;
    if (!messageId || !emoji || !userId) {
      return res.status(400).json({ error: 'Missing reaction parameters' });
    }

    const message = messages.find((m) => m.id === messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (!message.reactions) {
      message.reactions = {};
    }

    const userList = message.reactions[emoji] || [];
    if (userList.includes(userId)) {
      // Toggle off
      message.reactions[emoji] = userList.filter((id) => id !== userId);
      if (message.reactions[emoji].length === 0) {
        delete message.reactions[emoji];
      }
    } else {
      // Toggle on
      message.reactions[emoji] = [...userList, userId];
    }

    broadcast({
      type: 'reaction:updated',
      payload: {
        messageId,
        reactions: message.reactions,
      },
    });

    res.json({ success: true, reactions: message.reactions });
  });

  const server = http.createServer(app);

  // 2. WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });
  let connectedClients = 0;

  function broadcast(data: any, excludeWs?: WebSocket) {
    const raw = JSON.stringify(data);
    wss.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(raw);
      }
    });
  }

  wss.on('connection', (ws) => {
    connectedClients++;
    // Send initial sync
    ws.send(
      JSON.stringify({
        type: 'init',
        payload: {
          messages,
          onlineCount: Math.max(connectedClients, 6), // include seeded community users
        },
      })
    );

    // Broadcast updated presence
    broadcast({
      type: 'presence:update',
      payload: { onlineCount: Math.max(connectedClients, 6) },
    });

    ws.on('message', (raw) => {
      try {
        const event = JSON.parse(raw.toString());
        if (event.type === 'message:send') {
          const { channelId, sender, content, listingAttachment } = event.payload;
          if (content && sender && channelId) {
            const newMessage: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              channelId,
              sender,
              content,
              timestamp: Date.now(),
              reactions: {},
              listingAttachment,
            };
            messages.push(newMessage);
            if (messages.length > 300) {
              messages = messages.slice(-300);
            }
            broadcast({ type: 'message:new', payload: newMessage });
          }
        } else if (event.type === 'reaction:toggle') {
          const { messageId, emoji, userId } = event.payload;
          const message = messages.find((m) => m.id === messageId);
          if (message) {
            if (!message.reactions) message.reactions = {};
            const userList = message.reactions[emoji] || [];
            if (userList.includes(userId)) {
              message.reactions[emoji] = userList.filter((id) => id !== userId);
              if (message.reactions[emoji].length === 0) {
                delete message.reactions[emoji];
              }
            } else {
              message.reactions[emoji] = [...userList, userId];
            }
            broadcast({
              type: 'reaction:updated',
              payload: { messageId, reactions: message.reactions },
            });
          }
        } else if (event.type === 'typing') {
          broadcast(
            {
              type: 'typing',
              payload: event.payload,
            },
            ws
          );
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      connectedClients = Math.max(0, connectedClients - 1);
      broadcast({
        type: 'presence:update',
        payload: { onlineCount: Math.max(connectedClients, 6) },
      });
    });
  });

  // 3. Vite Middleware Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Haven community & chat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
