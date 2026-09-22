import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Users,
  Compass,
  Calendar,
  Sparkles,
  X,
  Send,
  Smile,
  Share2,
  Volume2,
  VolumeX,
  Check,
  Edit3,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Flame,
  Heart,
  ThumbsUp,
  Coffee,
  Building,
} from 'lucide-react';
import { ChatChannel, ChatMessage, ChatUser, Listing, ListingAttachment, UserRole } from '../types';
import { INITIAL_LISTINGS } from '../data/listings';
import { ACTIVE_COMMUNITY_USERS } from '../data/chatData';

interface CommunityChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ChatUser;
  onUpdateCurrentUser: (user: ChatUser) => void;
  channels: ChatChannel[];
  activeChannel: ChatChannel;
  onSelectChannel: (channelId: string) => void;
  messages: ChatMessage[];
  onlineCount: number;
  isConnected: boolean;
  typingUsers: string[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSendMessage: (content: string, attachment?: ListingAttachment) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onSendTyping: () => void;
  onSelectListingToView?: (listing: Listing) => void;
  pendingListingToShare?: Listing | null;
  onClearPendingListing?: () => void;
}

const EMOJI_REACTIONS = ['❤️', '👍', '🔥', '✨', '☕', '🥐', '⛷️', '🏡'];

const QUICK_ICEBREAKERS: Record<string, string[]> = {
  'haven-lounge': [
    '👋 Just joined Haven from London! Where is everyone exploring this month?',
    '☕ Any digital nomads currently working from Kyoto or Tokyo?',
    '✈️ Packing for a 2-week Mediterranean trip—what is your #1 carry-on essential?',
  ],
  'local-gems': [
    '🥐 What is the best hidden pastry shop in Paris that tourists miss?',
    '🌅 Best viewpoint for watching the sunset in Santorini without the huge crowds?',
    '🍜 Top ramen recommendation in Kyoto near Gion?',
  ],
  'roommates-rentals': [
    '🔑 Looking for a co-living flatmate in Berlin for a 3-month sublet!',
    '🏢 Anyone looking to split a 2-bedroom loft in Manhattan or Brooklyn?',
    '📋 What are standard deposit terms for 6-month European leases?',
  ],
  'travel-meetups': [
    '☕ Anyone in Kyoto free for a casual coworking coffee session on Thursday?',
    '🥾 Planning a hike along the Amalfi cliffs this Saturday morning, who wants to join?',
    '🍕 Hosting a traveler dinner table in Rome this Friday night!',
  ],
  'ask-a-host': [
    '🌟 Hosts: What welcome amenities do your guests appreciate the most?',
    '🗝️ What is the most seamless self-check-in keypad setup you recommend?',
    '💡 How do you handle flexible early check-in requests politely?',
  ],
};

const ROLE_BADGES: Record<UserRole, { label: string; color: string; icon: string }> = {
  traveler: { label: 'Traveler', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🎒' },
  superhost: { label: 'Superhost', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🌟' },
  local_guide: { label: 'Local Guide', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🗺️' },
  digital_nomad: { label: 'Nomad', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '💻' },
};

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  MessageSquare,
  Compass,
  Users,
  Calendar,
  Sparkles,
};

export function CommunityChatModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateCurrentUser,
  channels,
  activeChannel,
  onSelectChannel,
  messages,
  onlineCount,
  isConnected,
  typingUsers,
  soundEnabled,
  onToggleSound,
  onSendMessage,
  onToggleReaction,
  onSendTyping,
  onSelectListingToView,
  pendingListingToShare,
  onClearPendingListing,
}: CommunityChatModalProps) {
  const [inputText, setInputText] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileRole, setProfileRole] = useState<UserRole>(currentUser.role);
  const [profileLocation, setProfileLocation] = useState(currentUser.location || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser.avatar);

  const [isShareListingOpen, setIsShareListingOpen] = useState(false);
  const [attachedListing, setAttachedListing] = useState<ListingAttachment | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-fill attached listing if user clicked "Share in Chat" from listing modal
  useEffect(() => {
    if (pendingListingToShare) {
      setAttachedListing({
        id: pendingListingToShare.id,
        title: pendingListingToShare.title,
        image: pendingListingToShare.images[0],
        priceFormatted:
          pendingListingToShare.intent === 'stay'
            ? `$${pendingListingToShare.pricePerNight}/night`
            : pendingListingToShare.intent === 'rent'
            ? `$${pendingListingToShare.monthlyRent}/mo`
            : `$${(pendingListingToShare.salePrice! / 1000).toFixed(0)}k`,
        intent: pendingListingToShare.intent,
        city: `${pendingListingToShare.location.city}, ${pendingListingToShare.location.country}`,
      });
      if (onClearPendingListing) onClearPendingListing();
    }
  }, [pendingListingToShare, onClearPendingListing]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeChannel.id]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedListing) return;

    onSendMessage(inputText, attachedListing || undefined);
    setInputText('');
    setAttachedListing(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onSendTyping();
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCurrentUser({
      ...currentUser,
      name: profileName.trim() || 'Traveler',
      role: profileRole,
      location: profileLocation.trim(),
      avatar: profileAvatar,
    });
    setIsProfileModalOpen(false);
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
  ];

  return (
    <div
      id="community-chat-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        id="community-chat-modal-container"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl shadow-2xl border border-neutral-200/80 w-full max-w-5xl h-[92vh] max-h-[820px] flex flex-col overflow-hidden text-neutral-900"
      >
        {/* 1. Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF385C] flex items-center justify-center text-white shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-neutral-900 tracking-tight">
                  Haven Community Chat
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {onlineCount} Online
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Connect, ask advice, find roommates, and discuss stays in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute notification sound' : 'Unmute sound'}
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600 transition cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-neutral-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {/* Edit Current User Profile */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 shadow-2xs hover:shadow-xs transition text-xs font-semibold text-neutral-700 cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
              <Edit3 className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Main Content Split: Channels Sidebar + Chat Feed */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: Channels & Community */}
          <aside className="w-64 border-r border-neutral-100 flex flex-col bg-neutral-50/40 hidden md:flex">
            <div className="p-3 border-b border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-2">
                Channels
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {channels.map((channel) => {
                const IconComponent = CHANNEL_ICONS[channel.icon] || MessageSquare;
                const isSelected = channel.id === activeChannel.id;

                return (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-2xl text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-100/90'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        isSelected ? 'text-[#FF385C]' : 'text-neutral-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{channel.name}</span>
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {channel.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Community Members Preview */}
            <div className="p-3 border-t border-neutral-100 bg-white/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Community Members
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {onlineCount} active
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {ACTIVE_COMMUNITY_USERS.map((user) => {
                  const isCurrent = user.id === currentUser.id;
                  const roleConfig = ROLE_BADGES[user.role] || ROLE_BADGES.traveler;

                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-neutral-100/80"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={isCurrent ? currentUser.avatar : user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                              user.isOnline ? 'bg-emerald-500' : 'bg-neutral-300'
                            }`}
                          />
                        </div>
                        <span className="font-semibold text-neutral-800 truncate text-[11px]">
                          {isCurrent ? `${currentUser.name} (You)` : user.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {roleConfig.icon}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center Chat View */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Mobile Channel Selector Pills */}
            <div className="md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar p-2.5 border-b border-neutral-100 bg-neutral-50/50">
              {channels.map((channel) => {
                const isSelected = channel.id === activeChannel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    #{channel.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Channel Banner */}
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                  <span>#{activeChannel.name}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{activeChannel.description}</p>
              </div>

              <button
                onClick={() => setIsShareListingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                <span>Share a Stay</span>
              </button>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Channel Welcome Note */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center max-w-lg mx-auto mb-4">
                <div className="w-10 h-10 rounded-full bg-neutral-200/80 mx-auto flex items-center justify-center text-neutral-700 mb-2">
                  <MessageSquare className="w-5 h-5 text-[#FF385C]" />
                </div>
                <h4 className="font-bold text-sm text-neutral-900">
                  Welcome to #{activeChannel.name}
                </h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {activeChannel.description} Be respectful, share real experiences, and help fellow
                  travelers explore the world!
                </p>

                {/* Icebreaker Suggestions */}
                <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-wrap justify-center gap-1.5">
                  <span className="text-[11px] font-semibold text-neutral-400 w-full mb-1">
                    ✨ Suggested Conversation Starters:
                  </span>
                  {(QUICK_ICEBREAKERS[activeChannel.id] || QUICK_ICEBREAKERS['haven-lounge']).map(
                    (prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputText(prompt);
                          textareaRef.current?.focus();
                        }}
                        className="text-left text-[11px] px-2.5 py-1 rounded-full bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
                      >
                        {prompt}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Message List */}
              {messages.map((msg) => {
                const isMine = msg.sender.id === currentUser.id;
                const roleConfig = ROLE_BADGES[msg.sender.role] || ROLE_BADGES.traveler;
                const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-start gap-3 group ${isMine ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <img
                      src={isMine ? currentUser.avatar : msg.sender.avatar}
                      alt={msg.sender.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5 border border-neutral-200"
                    />

                    {/* Message Bubble & Meta */}
                    <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                      {/* Sender Meta */}
                      <div className="flex items-center gap-2 mb-1 px-1 text-xs">
                        <span className="font-bold text-neutral-900">
                          {isMine ? 'You' : msg.sender.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-semibold border ${roleConfig.color}`}
                        >
                          <span>{roleConfig.icon}</span>
                          <span>{roleConfig.label}</span>
                        </span>
                        {msg.sender.location && (
                          <span className="text-[10px] text-neutral-400 hidden sm:inline">
                            • {msg.sender.location}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400">• {formattedTime}</span>
                      </div>

                      {/* Content Bubble */}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? 'bg-neutral-900 text-white rounded-tr-xs'
                            : 'bg-neutral-100 text-neutral-900 rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                        {/* Optional Listing Attachment Card */}
                        {msg.listingAttachment && (
                          <div className="mt-2.5 p-2 rounded-xl bg-white text-neutral-900 border border-neutral-200/80 shadow-2xs overflow-hidden max-w-sm">
                            <div className="flex gap-2.5">
                              <img
                                src={msg.listingAttachment.image}
                                alt={msg.listingAttachment.title}
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF385C]">
                                      {msg.listingAttachment.intent === 'stay'
                                        ? 'Vacation Stay'
                                        : msg.listingAttachment.intent === 'rent'
                                        ? 'Apartment'
                                        : 'For Sale'}
                                    </span>
                                    <span className="text-xs font-bold text-neutral-900">
                                      {msg.listingAttachment.priceFormatted}
                                    </span>
                                  </div>
                                  <h5 className="font-bold text-xs truncate mt-0.5">
                                    {msg.listingAttachment.title}
                                  </h5>
                                  <p className="text-[11px] text-neutral-500 truncate flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5" />
                                    {msg.listingAttachment.city}
                                  </p>
                                </div>

                                {onSelectListingToView && (
                                  <button
                                    onClick={() => {
                                      const matched = INITIAL_LISTINGS.find(
                                        (l) => l.id === msg.listingAttachment?.id
                                      );
                                      if (matched) {
                                        onSelectListingToView(matched);
                                        onClose();
                                      }
                                    }}
                                    className="text-[11px] text-left font-bold text-[#FF385C] hover:underline flex items-center gap-1 cursor-pointer mt-1"
                                  >
                                    <span>View property details</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reactions & Hover Actions */}
                      <div className="flex items-center gap-1 mt-1 px-1">
                        {/* Render Existing Reactions */}
                        {msg.reactions &&
                          Object.entries(msg.reactions).map(([emoji, userIds]) => {
                            if (!userIds || userIds.length === 0) return null;
                            const hasReacted = userIds.includes(currentUser.id);
                            return (
                              <button
                                key={emoji}
                                onClick={() => onToggleReaction(msg.id, emoji)}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition cursor-pointer ${
                                  hasReacted
                                    ? 'bg-rose-50 border-rose-200 text-rose-700 font-bold'
                                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span className="text-[11px]">{userIds.length}</span>
                              </button>
                            );
                          })}

                        {/* Quick Reaction Tray (Hover or Always Accessible) */}
                        <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5 bg-white border border-neutral-200 rounded-full px-1.5 py-0.5 shadow-2xs">
                          {EMOJI_REACTIONS.slice(0, 4).map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => onToggleReaction(msg.id, emoji)}
                              className="text-xs hover:scale-125 transition px-0.5 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 italic px-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.3s]" />
                  </span>
                  <span>{typingUsers.join(', ')} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Composer */}
            <div className="p-3 sm:p-4 border-t border-neutral-100 bg-white">
              {/* Attached Listing Preview in Composer */}
              {attachedListing && (
                <div className="mb-2 p-2 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={attachedListing.image}
                      alt={attachedListing.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-[#FF385C] uppercase">
                        Sharing property
                      </div>
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {attachedListing.title}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {attachedListing.priceFormatted} • {attachedListing.city}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAttachedListing(null)}
                    className="p-1 rounded-full hover:bg-neutral-200 text-neutral-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-end gap-2">
                <div className="flex-1 relative bg-neutral-100 rounded-2xl border border-neutral-200 focus-within:border-neutral-400 focus-within:bg-white transition">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message #${activeChannel.name}...`}
                    className="w-full px-4 py-3 text-sm bg-transparent outline-none resize-none max-h-32 text-neutral-900 placeholder:text-neutral-400"
                  />

                  {/* Composer Utilities (Share Listing & Quick Emojis) */}
                  <div className="flex items-center justify-between px-3 pb-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setIsShareListingOpen(true)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-200/80 text-neutral-600 transition cursor-pointer"
                        title="Attach a stay or apartment to your message"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium hidden sm:inline">Attach stay</span>
                      </button>

                      {/* Quick Emoji Buttons */}
                      <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-neutral-200">
                        {EMOJI_REACTIONS.slice(0, 5).map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setInputText((prev) => `${prev} ${emoji}`)}
                            className="hover:scale-125 transition px-0.5 cursor-pointer text-xs"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <span className="text-[10px] text-neutral-400 hidden sm:inline">
                      Press <kbd className="px-1 py-0.5 rounded bg-neutral-200 font-mono text-[9px]">Enter</kbd> to send
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() && !attachedListing}
                  className={`p-3.5 rounded-2xl flex items-center justify-center transition cursor-pointer shadow-xs ${
                    inputText.trim() || attachedListing
                      ? 'bg-[#FF385C] hover:bg-[#E00B41] text-white'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. Share Listing Picker Modal */}
      {isShareListingOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-neutral-900">Share a Property to Chat</h3>
              <button
                onClick={() => setIsShareListingOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              Select any listing from Haven to attach it directly into your conversation.
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {INITIAL_LISTINGS.slice(0, 10).map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => {
                    setAttachedListing({
                      id: listing.id,
                      title: listing.title,
                      image: listing.images[0],
                      priceFormatted:
                        listing.intent === 'stay'
                          ? `$${listing.pricePerNight}/night`
                          : listing.intent === 'rent'
                          ? `$${listing.monthlyRent}/mo`
                          : `$${(listing.salePrice! / 1000).toFixed(0)}k`,
                      intent: listing.intent,
                      city: `${listing.location.city}, ${listing.location.country}`,
                    });
                    setIsShareListingOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-100 text-left transition cursor-pointer border border-transparent hover:border-neutral-200"
                >
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-neutral-900 truncate">{listing.title}</h5>
                    <p className="text-[11px] text-neutral-500 truncate">
                      {listing.location.city}, {listing.location.country}
                    </p>
                    <span className="text-[11px] font-bold text-[#FF385C]">
                      {listing.intent === 'stay'
                        ? `$${listing.pricePerNight}/night`
                        : listing.intent === 'rent'
                        ? `$${listing.monthlyRent}/mo`
                        : `$${(listing.salePrice! / 1000).toFixed(0)}k`}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit User Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-2xs">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-neutral-900">Your Community Profile</h3>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:border-neutral-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Your Role in Haven</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ROLE_BADGES) as UserRole[]).map((roleKey) => {
                    const badge = ROLE_BADGES[roleKey];
                    const isSelected = profileRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => setProfileRole(roleKey)}
                        className={`p-2.5 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="text-base">{badge.icon}</span>
                        <span className="font-bold text-xs">{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Location / Tagline</label>
                <input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  placeholder="e.g. Traveling in Kyoto or Local in Paris"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:border-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Select Avatar</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {sampleAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProfileAvatar(url)}
                      className={`relative rounded-full p-0.5 border-2 transition cursor-pointer flex-shrink-0 ${
                        profileAvatar === url ? 'border-[#FF385C]' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={url}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {profileAvatar === url && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF385C] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-neutral-100 font-semibold text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold cursor-pointer shadow-xs"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
