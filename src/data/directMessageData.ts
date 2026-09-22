import { DirectConversation, DirectMessage, ChatUser } from '../types';
import { ACTIVE_COMMUNITY_USERS, DEFAULT_CURRENT_USER } from './chatData';

const elena = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-elena')!;
const liam = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-liam')!;
const chloe = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-chloe')!;
const marcus = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-marcus')!;

export const INITIAL_DIRECT_CONVERSATIONS: DirectConversation[] = [
  {
    id: 'conv-elena',
    otherUser: elena,
    unreadCount: 1,
    isBlocked: false,
    isMuted: false,
    updatedAt: Date.now() - 1000 * 60 * 12,
    lastMessage: {
      id: 'dm-1-3',
      conversationId: 'conv-elena',
      senderId: 'user-elena',
      recipientId: 'user_current',
      content: 'Yes, early luggage drop-off is completely fine starting from 11:30 AM! Our house concierge Nikos will meet you at the gate.',
      timestamp: Date.now() - 1000 * 60 * 12,
      status: 'delivered',
    },
  },
  {
    id: 'conv-liam',
    otherUser: liam,
    unreadCount: 0,
    isBlocked: false,
    isMuted: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    lastMessage: {
      id: 'dm-2-2',
      conversationId: 'conv-liam',
      senderId: 'user_current',
      recipientId: 'user-liam',
      content: 'Thanks Liam! I submitted the 3-month lease inquiry with the Haven Escrow option for November through January.',
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      status: 'read',
    },
  },
  {
    id: 'conv-chloe',
    otherUser: chloe,
    unreadCount: 0,
    isBlocked: false,
    isMuted: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
    lastMessage: {
      id: 'dm-3-2',
      conversationId: 'conv-chloe',
      senderId: 'user-chloe',
      recipientId: 'user_current',
      content: 'For Positano, ask for Captain Marco at the marina dock. He has a handcrafted wooden gozzo boat that is perfect for private cove swimming.',
      timestamp: Date.now() - 1000 * 60 * 60 * 26,
      status: 'read',
    },
  },
];

export const INITIAL_DIRECT_MESSAGES: Record<string, DirectMessage[]> = {
  'conv-elena': [
    {
      id: 'dm-1-1',
      conversationId: 'conv-elena',
      senderId: 'user_current',
      recipientId: 'user-elena',
      content: 'Hello Elena! We are traveling to Santorini next month and are eyeing your Cliffside Caldera Villa.',
      timestamp: Date.now() - 1000 * 60 * 45,
      status: 'read',
      attachment: {
        type: 'listing',
        listing: {
          id: 'stay-1',
          title: 'Cliffside Caldera Villa with Heated Plunge Pool',
          image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
          priceFormatted: '$420/night',
          intent: 'stay',
          city: 'Santorini, Greece',
        },
      },
    },
    {
      id: 'dm-1-2',
      conversationId: 'conv-elena',
      senderId: 'user_current',
      recipientId: 'user-elena',
      content: 'Our ferry arrives at Athinios port around 11 AM. Would it be possible to drop off our baggage early before 3 PM check-in?',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'read',
    },
    {
      id: 'dm-1-3',
      conversationId: 'conv-elena',
      senderId: 'user-elena',
      recipientId: 'user_current',
      content: 'Yes, early luggage drop-off is completely fine starting from 11:30 AM! Our house concierge Nikos will meet you at the gate.',
      timestamp: Date.now() - 1000 * 60 * 12,
      status: 'delivered',
    },
  ],
  'conv-liam': [
    {
      id: 'dm-2-1',
      conversationId: 'conv-liam',
      senderId: 'user-liam',
      recipientId: 'user_current',
      content: 'Hi Alex! I saw you were inquiring about the Friedrichshain industrial loft for a multi-month stay.',
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      status: 'read',
      attachment: {
        type: 'listing',
        listing: {
          id: 'rent-2',
          title: 'Industrial Loft with High Ceilings & Terrace',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
          priceFormatted: '$2,400/mo',
          intent: 'rent',
          city: 'Berlin, Germany',
        },
      },
    },
    {
      id: 'dm-2-2',
      conversationId: 'conv-liam',
      senderId: 'user_current',
      recipientId: 'user-liam',
      content: 'Thanks Liam! I submitted the 3-month lease inquiry with the Haven Escrow option for November through January.',
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
      status: 'read',
      attachment: {
        type: 'booking_inquiry',
        inquiryDetails: {
          dates: 'Nov 1, 2026 – Jan 31, 2027 (3 Months)',
          guests: 2,
          offerAmount: '$2,200/mo ($6,600 Total in Escrow)',
          note: 'Remote engineers, non-smokers, looking for high-speed fiber.',
        },
      },
    },
  ],
  'conv-chloe': [
    {
      id: 'dm-3-1',
      conversationId: 'conv-chloe',
      senderId: 'user_current',
      recipientId: 'user-chloe',
      content: 'Ciao Chloe! Loved your community forum post about the Amalfi hidden boat coves. Any specific captain you recommend near Positano?',
      timestamp: Date.now() - 1000 * 60 * 60 * 28,
      status: 'read',
    },
    {
      id: 'dm-3-2',
      conversationId: 'conv-chloe',
      senderId: 'user-chloe',
      recipientId: 'user_current',
      content: 'For Positano, ask for Captain Marco at the marina dock. He has a handcrafted wooden gozzo boat that is perfect for private cove swimming.',
      timestamp: Date.now() - 1000 * 60 * 60 * 26,
      status: 'read',
    },
  ],
};
