import { ForumThread, ChatUser } from '../types';
import { ACTIVE_COMMUNITY_USERS } from './chatData';

const elena = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-elena')!;
const marcus = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-marcus')!;
const sophia = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-sophia')!;
const chloe = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-chloe')!;
const liam = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-liam')!;
const david = ACTIVE_COMMUNITY_USERS.find((u) => u.id === 'user-david')!;

export const FORUM_CATEGORIES = [
  { id: 'all', label: 'All Discussions', icon: 'Sparkles', count: 6 },
  { id: 'hosting', label: 'Hosting & Landlords', icon: 'Building', count: 2 },
  { id: 'travel-tips', label: 'Travel Tips & Nomads', icon: 'Compass', count: 1 },
  { id: 'accessibility', label: 'Accessibility & Inclusion', icon: 'Heart', count: 2 },
  { id: 'local-guides', label: 'Local Guides & Gems', icon: 'MapPin', count: 1 },
] as const;

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-1',
    title: 'Spotlight on Step-Free Stays: What guests with mobility needs actually look for in architectural homes',
    category: 'accessibility',
    tags: ['accessibility', 'step-free', 'wheelchair-friendly', 'inclusive-design'],
    author: {
      id: 'user-sarah',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=250&q=80',
      role: 'traveler',
      location: 'London, UK',
      isOnline: true,
    },
    content: `As an architect who uses a power wheelchair, I often see "accessible" listings that still have 2 steps at the front porch or heavy glass sliding doors that are impossible to open independently.\n\nHere are 4 small design details that make a sanctuary genuinely step-free:\n1. Zero-threshold flush entry transitions between outdoor deck and indoor slate floors.\n2. Minimum 85cm clear door clearance.\n3. Roll-in curbless rainfall shower with non-slip honed limestone.\n4. Clear under-counter knee clearance (at least 70cm) in the kitchen island.\n\nHosts: feel free to ask questions or share photos of your bathrooms if you want feedback on accessibility verification!`,
    timestamp: Date.now() - 1000 * 60 * 60 * 36, // 36 hours ago
    isPinned: true,
    viewCount: 342,
    reactions: { '❤️': ['user-elena', 'user-marcus', 'user-sophia'], '💡': ['user-liam', 'user_current', 'user-david'] },
    replies: [
      {
        id: 'reply-1-1',
        threadId: 'thread-1',
        author: elena,
        content: `Thank you for sharing this Sarah! We recently remodeled our Santorini cave suite with zero thresholds and installed flush magnetic door catches. Would love to have Haven certify our step-free floor plan badge!`,
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        reactions: { '👍': ['user-sarah', 'user-marcus'], '✨': ['user-sophia'] },
      },
      {
        id: 'reply-1-2',
        threadId: 'thread-1',
        author: marcus,
        content: `Seconding the shower threshold! In Japan, wet-room style bathrooms (ofuro) are naturally curbless and work wonderfully for universal accessibility.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 18,
        parentReplyId: 'reply-1-1',
        reactions: { '👏': ['user-sarah'] },
      },
      {
        id: 'reply-1-3',
        threadId: 'thread-1',
        author: david,
        content: `Also super helpful: clear photos showing the pathway from the parking/dropoff spot to the entrance door. That is usually the biggest unknown when arriving after dark.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 8,
        reactions: { '💡': ['user-sarah', 'user_current'] },
      },
    ],
  },
  {
    id: 'thread-2',
    title: 'How do you handle smart locks & emergency keypads when mountain WiFi drops out?',
    category: 'hosting',
    tags: ['hosting', 'superhost', 'smartlock', 'checkin', 'selfcheckin'],
    author: elena,
    content: `For any hosts running retreats in mountain or coastal areas with intermittent cellular or broadband: what is your most fail-safe self check-in protocol?\n\nWe switched from cloud-reliant WiFi smart locks to offline algorithmic keypad deadbolts (like Yale / Schlage with pre-computed timed PIN codes). Guests get a unique 6-digit PIN that validates cryptographically on the lock hardware even if our internet is down for 48 hours. What setup has worked best for your properties?`,
    timestamp: Date.now() - 1000 * 60 * 60 * 28,
    isPinned: false,
    viewCount: 215,
    reactions: { '💡': ['user-marcus', 'user-liam'], '👍': ['user-david'] },
    listingAttachment: {
      id: 'stay-1',
      title: 'Cliffside Caldera Villa with Heated Plunge Pool',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      priceFormatted: '$420/night',
      intent: 'stay',
      city: 'Santorini, Greece',
    },
    replies: [
      {
        id: 'reply-2-1',
        threadId: 'thread-2',
        author: liam,
        content: `Offline rolling PIN codes are an absolute lifesaver. We also keep a mechanical brass master key inside a heavy-duty Masterlock mechanical vault bolted near the utility shed as a 100% backup for power outages.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 14,
        reactions: { '🙌': ['user-elena', 'user_current'] },
      },
    ],
  },
  {
    id: 'thread-3',
    title: 'Kyoto Hidden Paths: 3 quiet bamboo groves and Zen gardens completely free of tour buses',
    category: 'local-guides',
    tags: ['local-guides', 'kyoto', 'japan', 'hidden-gems', 'walking-tour'],
    author: marcus,
    content: `Most tourists only visit Arashiyama bamboo forest at 11 AM and leave overwhelmed by selfie sticks. Here are 3 quiet architectural sanctuaries in Kyoto:\n\n1. **Adashino Nenbutsu-ji**: Just a 15-minute walk north of Saga-Arashiyama. It has its own secluded bamboo path that is nearly empty in the morning.\n2. **Murin-an Garden**: A Meiji-era villa near Nanzen-ji with flowing water fed from Lake Biwa Canal and pristine acoustic dampening.\n3. **Giō-ji Temple**: A tiny thatched-roof hermitage nestled inside a deep emerald moss garden under maple canopies.\n\nBest visited between 8:30 AM and 9:30 AM!`,
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    isPinned: false,
    viewCount: 480,
    reactions: { '🔥': ['user-sophia', 'user-chloe'], '❤️': ['user-elena', 'user-david', 'user_current'] },
    listingAttachment: {
      id: 'stay-3',
      title: 'Traditional Machiya Townhouse in Gion',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      priceFormatted: '$195/night',
      intent: 'stay',
      city: 'Kyoto, Japan',
    },
    replies: [
      {
        id: 'reply-3-1',
        threadId: 'thread-3',
        author: sophia,
        content: `Adashino Nenbutsu-ji is pure magic. I spent an entire morning sketching in the moss garden there last autumn. Thank you for this guide Marcus!`,
        timestamp: Date.now() - 1000 * 60 * 60 * 10,
        reactions: { '❤️': ['user-marcus'] },
      },
    ],
  },
  {
    id: 'thread-4',
    title: 'Starlink Mini vs 5G eSIM: Complete nomad connectivity checklist for off-grid sanctuaries',
    category: 'travel-tips',
    tags: ['travel-tips', 'digitalnomad', 'connectivity', 'starlink', 'wifi'],
    author: marcus,
    content: `A lot of remote Haven sanctuaries are in dramatic alpine or coastal locations where local wireline internet is either 10 Mbps copper or non-existent. Over 6 months of remote software engineering, here is my setup:\n\n- **Starlink Mini Dish**: DC-powered via 100W USB-C PD power bank. Consistently delivers 120-180 Mbps download and 20-30 Mbps upload with ~35ms latency even in the middle of Norwegian fjords.\n- **Dual eSIM router**: In Europe, Ubigi or Airalo with local unlimited data plans as automated multi-WAN failover.\n\nAnyone else working remotely from high-altitude sanctuaries?`,
    timestamp: Date.now() - 1000 * 60 * 60 * 15,
    isPinned: false,
    viewCount: 290,
    reactions: { '🔥': ['user-liam', 'user_current'], '👍': ['user-david'] },
    replies: [],
  },
  {
    id: 'thread-5',
    title: 'Sensory-Friendly Stays: Designing low-stimulation, acoustic retreats for neurodivergent guests',
    category: 'accessibility',
    tags: ['accessibility', 'neurodiversity', 'acoustic-comfort', 'sensory-friendly', 'wellness'],
    author: david,
    content: `Accessibility goes far beyond ramps and grab bars. Many modern travelers experience sensory overwhelm from harsh 5000K fluorescent downlights, buzzing AC compressors, and paper-thin drywall.\n\nIn our Haven listings, we have found three high-impact additions:\n1. 2700K warm diffused architectural lighting with tactile slide dimmers.\n2. Acoustic felt wall panels behind the headboard to cut ambient room reverberation.\n3. Weighted linen blankets and blackout linen drapes.\n\nSeveral guests have messaged us saying it was the first time they slept 8 unbroken hours while traveling!`,
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    isPinned: false,
    viewCount: 198,
    reactions: { '❤️': ['user-elena', 'user-sarah'], '✨': ['user-sophia', 'user_current'] },
    replies: [
      {
        id: 'reply-5-1',
        threadId: 'thread-5',
        author: chloe,
        content: `The 2700K lighting with physical tactile dimmers makes an unbelievable difference. Smart apps are frustrating when you are jetlagged; mechanical dimmers just work.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
        reactions: { '👍': ['user-david'] },
      },
    ],
  },
  {
    id: 'thread-6',
    title: 'Standardizing deposit escrow & lease terms for 1–12 month flexible apartment rentals',
    category: 'hosting',
    tags: ['hosting', 'leases', 'escrow', 'rentals', 'legal'],
    author: liam,
    content: `For landlords offering monthly executive leases through Haven: how do you structure security deposits across international borders?\n\nHaven’s built-in escrow holds the first month’s rent and damage deposit safely in neutral custody, which gives tenants reassurance that they won’t be ghosted by foreign landlords, while guaranteeing landlords 100% payout upon move-in inspection. Highly recommend sticking to Haven’s verified escrow flow rather than off-platform wire transfers!`,
    timestamp: Date.now() - 1000 * 60 * 60 * 7,
    isPinned: false,
    viewCount: 164,
    reactions: { '💡': ['user-elena', 'user_current'], '👏': ['user-marcus'] },
    listingAttachment: {
      id: 'rent-2',
      title: 'Industrial Loft with High Ceilings & Terrace',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      priceFormatted: '$2,400/mo',
      intent: 'rent',
      city: 'Berlin, Germany',
    },
    replies: [],
  },
];
