import { Listing } from '../types';

export const AMENITY_OPTIONS = [
  { id: 'wifi', name: 'High-speed Wifi', icon: 'Wifi', category: 'Essentials' },
  { id: 'kitchen', name: 'Gourmet Kitchen', icon: 'UtensilsCrossed', category: 'Essentials' },
  { id: 'ac', name: 'Air conditioning', icon: 'Wind', category: 'Essentials' },
  { id: 'heating', name: 'Heating', icon: 'Flame', category: 'Essentials' },
  { id: 'washer', name: 'In-unit Washer & Dryer', icon: 'Shirt', category: 'Essentials' },
  { id: 'workspace', name: 'Dedicated workspace', icon: 'Laptop', category: 'Essentials' },
  
  { id: 'pool', name: 'Pool', icon: 'Waves', category: 'Features' },
  { id: 'hottub', name: 'Hot tub', icon: 'Sparkles', category: 'Features' },
  { id: 'parking', name: 'Garage / Assigned Parking', icon: 'Car', category: 'Features' },
  { id: 'ev_charger', name: 'EV charger', icon: 'Zap', category: 'Features' },
  { id: 'bbq', name: 'BBQ / Outdoor Terrace', icon: 'Utensils', category: 'Features' },
  { id: 'gym', name: 'Fitness Center / Gym', icon: 'Dumbbell', category: 'Features' },
  { id: 'doorman', name: '24/7 Concierge / Doorman', icon: 'Shield', category: 'Features' },
  { id: 'balcony', name: 'Private Balcony', icon: 'Maximize', category: 'Features' },
  
  { id: 'beachfront', name: 'Beachfront', icon: 'Sun', category: 'Location' },
  { id: 'waterfront', name: 'Waterfront', icon: 'Compass', category: 'Location' },
  { id: 'ski', name: 'Ski-in/ski-out', icon: 'MountainSnow', category: 'Location' },
  { id: 'lake_access', name: 'Lake access', icon: 'Anchor', category: 'Location' },
  
  { id: 'pets', name: 'Pet friendly', icon: 'Dog', category: 'Rules' },
  { id: 'self_checkin', name: 'Keyless entry / Self check-in', icon: 'KeyRound', category: 'Rules' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Listings', icon: 'Sparkles' },
  { id: 'apartments', label: 'Apartments & Condos', icon: 'Building' },
  { id: 'beachfront', label: 'Beachfront', icon: 'Palmtree' },
  { id: 'mansions', label: 'Luxury & Penthouses', icon: 'Castle' },
  { id: 'cabins', label: 'Cabins & Chalets', icon: 'Tent' },
  { id: 'trending', label: 'Trending Properties', icon: 'Flame' },
  { id: 'pools', label: 'Amazing pools', icon: 'Waves' },
  { id: 'lakefront', label: 'Lakefront', icon: 'Sailboat' },
  { id: 'countryside', label: 'Countryside', icon: 'TreePine' },
  { id: 'design', label: 'Design icons', icon: 'Gem' },
];

export const POPULAR_DESTINATIONS = [
  { name: "I'm flexible", query: "", desc: "Explore all global locations" },
  { name: "New York, USA", query: "New York", desc: "Manhattan lofts & Brooklyn townhouses" },
  { name: "Amalfi Coast, Italy", query: "Amalfi", desc: "Clifftop villas & azure waters" },
  { name: "Miami, Florida", query: "Miami", desc: "Brickell luxury waterfront condos" },
  { name: "Paris, France", query: "Paris", desc: "Haussmannian flats & historic pied-à-terres" },
  { name: "Kyoto, Japan", query: "Kyoto", desc: "Machiya homes & contemporary garden residences" },
  { name: "London, UK", query: "London", desc: "Kensington mews & Thames riverside flats" },
  { name: "Lake Tahoe, California", query: "Tahoe", desc: "Alpine cabins & pristine lakeside" },
  { name: "Santorini, Greece", query: "Santorini", desc: "Caldera cliff estates & cave suites" },
  { name: "Berlin, Germany", query: "Berlin", desc: "Mitte design lofts & Kreuzberg apartments" },
];

export const INITIAL_LISTINGS: Listing[] = [
  // ==========================================
  // SECTION 1: APARTMENTS FOR LONG-TERM RENT
  // ==========================================
  {
    id: 'rent-1',
    title: 'The Tribeca Cast-Iron Corner Loft',
    subtitle: 'High ceilings, original columns, and keyed elevator',
    description: 'A classic 1,850 sq ft corner loft in landmarked Tribeca. Features 13-foot timber ceilings, 9 oversized west-facing windows, wide-plank white oak flooring, chef kitchen with Sub-Zero appliances, and direct keyed elevator access. Available for 12 to 24 month residential lease.',
    type: 'Luxury Rental Apartment',
    propertyType: 'apartment',
    category: 'apartments',
    intent: 'rent',
    monthlyRent: 4850,
    deposit: 4850,
    leaseTerm: '12-Month Lease',
    furnishedStatus: 'furnished',
    sqft: 1850,
    parkingSpaces: 1,
    location: {
      city: 'New York',
      region: 'New York',
      country: 'United States',
      neighborhood: 'Tribeca, Manhattan',
      lat: 40.7163,
      lng: -74.0086,
      distance: 'Tribeca Historic District'
    },
    pricePerNight: 280,
    rating: 4.97,
    reviewCount: 42,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'ac', 'heating', 'washer', 'workspace', 'doorman', 'gym', 'pets'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: true,
    host: {
      name: 'Douglas & Co. Properties',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Managing stays since 2017',
      responseRate: '100% within 15 mins',
      isSuperhost: true,
      tagline: 'Licensed New York residential leasing directors',
      roleTitle: 'Exclusive Leasing Agent',
      phone: '+1 (212) 555-0192',
      licenseNumber: 'NY-RE-492019'
    },
    reviews: [
      {
        id: 'rev-r1',
        author: 'Julian',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        date: 'August 2024',
        rating: 5,
        comment: 'Pristine loft with natural light all afternoon. Responsive building management and doorman team.'
      }
    ],
    availableDates: 'Available Oct 1'
  },
  {
    id: 'rent-2',
    title: 'Kensington Garden Mews Apartment',
    subtitle: 'Quiet cobblestone lane off High Street Kensington',
    description: 'A beautifully renovated two-level mews flat featuring French doors leading to a private walled garden terrace. Herringbone parquet, radiant floor heating, bespoke joinery, and private carport with EV charging. Pet friendly upon request.',
    type: 'Mews Rental Flat',
    propertyType: 'apartment',
    category: 'apartments',
    intent: 'rent',
    monthlyRent: 3950,
    deposit: 3950,
    leaseTerm: 'Flexible 6 – 18 Months',
    furnishedStatus: 'furnished',
    sqft: 1320,
    parkingSpaces: 1,
    location: {
      city: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      neighborhood: 'Royal Borough of Kensington',
      lat: 51.5014,
      lng: -0.1919,
      distance: 'Kensington Gardens'
    },
    pricePerNight: 230,
    rating: 4.95,
    reviewCount: 38,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 3,
    amenities: ['wifi', 'kitchen', 'heating', 'washer', 'parking', 'ev_charger', 'balcony', 'pets', 'self_checkin'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: true,
    host: {
      name: 'Harrington Residential',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Established 2012',
      responseRate: '99% within an hour',
      isSuperhost: true,
      tagline: 'Prime Central London lettings & management',
      roleTitle: 'Senior Lettings Director'
    },
    reviews: [
      {
        id: 'rev-r2',
        author: 'Charlotte',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        date: 'July 2024',
        rating: 5,
        comment: 'Peaceful oasis right in the heart of Kensington. The private courtyard garden is exceptional.'
      }
    ],
    availableDates: 'Available Immediately'
  },
  {
    id: 'rent-3',
    title: 'Mitte Industrial Minimalist Studio & 1BR',
    subtitle: 'Polished concrete, gallery walls, and floor-to-ceiling glass',
    description: 'Designed by renowned Berlin architects, this sun-drenched Mitte apartment offers an open-concept flow with custom steel partitions, integrated bulthaup kitchen, rain shower bathroom, and south-facing loggia balcony. Steps from Torstraße cafés.',
    type: 'Designer Rental Flat',
    propertyType: 'apartment',
    category: 'apartments',
    intent: 'rent',
    monthlyRent: 2250,
    deposit: 4500,
    leaseTerm: '12-Month Minimum',
    furnishedStatus: 'unfurnished',
    sqft: 980,
    parkingSpaces: 0,
    location: {
      city: 'Berlin',
      region: 'Berlin',
      country: 'Germany',
      neighborhood: 'Mitte / Torstraße',
      lat: 52.5294,
      lng: 13.3986,
      distance: 'Mitte Cultural District'
    },
    pricePerNight: 135,
    rating: 4.92,
    reviewCount: 29,
    isGuestFavorite: false,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['wifi', 'kitchen', 'heating', 'washer', 'workspace', 'balcony', 'self_checkin'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: false,
    host: {
      name: 'Stefan K.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined April 2018',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Berlin architect and property caretaker',
      roleTitle: 'Private Landlord'
    },
    reviews: [
      {
        id: 'rev-r3',
        author: 'Florian',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        date: 'September 2024',
        rating: 5,
        comment: 'Flawless architectural finishes and quiet courtyard positioning in the best part of Berlin.'
      }
    ],
    availableDates: 'Available Nov 1'
  },

  // ==========================================
  // SECTION 2: APARTMENTS & REAL ESTATE FOR SALE
  // ==========================================
  {
    id: 'sale-1',
    title: 'The Brickell Waterfront Sky Penthouse',
    subtitle: 'Double-height glass with Biscayne Bay panoramas',
    description: 'An architectural trophy penthouse perched on the 54th floor in Miami’s premier financial corridor. Features 3,200 sq ft interior with private elevator vestibule, Calacatta marble island, wraparound sunrise-to-sunset balcony, summer kitchen, and 2 private garage spaces with EV charging. Full five-star amenities including rooftop infinity pool, spa, and 24/7 concierge.',
    type: 'Penthouse Condominium',
    propertyType: 'apartment',
    category: 'mansions',
    intent: 'sale',
    salePrice: 1650000,
    sqft: 3200,
    hoaFee: 920,
    propertyTaxAnnual: 18400,
    yearBuilt: 2022,
    parkingSpaces: 2,
    location: {
      city: 'Miami',
      region: 'Florida',
      country: 'United States',
      neighborhood: 'Brickell Financial District',
      lat: 25.7617,
      lng: -80.1918,
      distance: 'Biscayne Bay waterfront'
    },
    pricePerNight: 950,
    rating: 4.99,
    reviewCount: 19,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 3,
    beds: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    amenities: ['wifi', 'kitchen', 'ac', 'pool', 'hottub', 'parking', 'ev_charger', 'gym', 'doorman', 'balcony', 'waterfront'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: true,
    host: {
      name: 'Vanguard Luxury Realty',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Member since 2015',
      responseRate: '100% within 10 mins',
      isSuperhost: true,
      tagline: 'Leading Florida coastal luxury real estate brokerage',
      roleTitle: 'Listing Broker Associate',
      phone: '+1 (305) 555-8392',
      licenseNumber: 'FL-BK-918231'
    },
    reviews: [
      {
        id: 'rev-s1',
        author: 'Alexander M.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        date: 'August 2024',
        rating: 5,
        comment: 'The highest quality finishing on the bay. Sunset views over the Miami skyline are unmatched.'
      }
    ],
    availableDates: 'Active Listing • Private Tours Available'
  },
  {
    id: 'sale-2',
    title: 'Saint-Germain Historic Bourgeois Apartment',
    subtitle: 'Classic 1890s stone facade with French ironwork balconies',
    description: 'Situated on Rue de Grenelle in the prestigious 7th Arrondissement, this 1,520 sq ft classic residence features 3.4-meter ceilings, original Point de Hongrie chevron oak parquetry, marble mantels in every salon, moldings, and elevator service. Includes a private 150 sq ft subterranean wine cellar.',
    type: 'Historic Parisian Apartment',
    propertyType: 'apartment',
    category: 'design',
    intent: 'sale',
    salePrice: 1380000,
    sqft: 1520,
    hoaFee: 410,
    propertyTaxAnnual: 5200,
    yearBuilt: 1894,
    parkingSpaces: 0,
    location: {
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      neighborhood: 'Saint-Germain-des-Prés, 7e',
      lat: 48.8556,
      lng: 2.3275,
      distance: 'Left Bank Heritage'
    },
    pricePerNight: 550,
    rating: 4.96,
    reviewCount: 31,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'heating', 'washer', 'workspace', 'balcony'],
    instantBook: false,
    selfCheckIn: false,
    allowsPets: true,
    host: {
      name: 'Maison & Héritage Immobilier',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Member since 2016',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Curators of authentic Parisian architectural monuments',
      roleTitle: 'Directeur Associé'
    },
    reviews: [
      {
        id: 'rev-s2',
        author: 'Henri',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        date: 'July 2024',
        rating: 5,
        comment: 'Authentic 19th-century Parisian charm preserved with modern plumbing and electrics.'
      }
    ],
    availableDates: 'For Sale • Open House Saturdays'
  },
  {
    id: 'sale-3',
    title: 'Barcelona Eixample Stained-Glass Penthouse',
    subtitle: 'Gaudí-era modernist architecture with rooftop plunge pool',
    description: 'A 2,100 sq ft Modernisme gem on Rambla de Catalunya. Features vaulted Catalan brick ceilings, hand-painted encaustic hydraulic tile floors, restored stained-glass bay windows, and a private 800 sq ft private rooftop terrace with heated plunge pool and Sagrada Família views.',
    type: 'Penthouse Apartment',
    propertyType: 'apartment',
    category: 'design',
    intent: 'sale',
    salePrice: 980000,
    sqft: 2100,
    hoaFee: 280,
    propertyTaxAnnual: 3400,
    yearBuilt: 1912,
    parkingSpaces: 1,
    location: {
      city: 'Barcelona',
      region: 'Catalonia',
      country: 'Spain',
      neighborhood: 'Eixample Golden Square',
      lat: 41.3879,
      lng: 2.1699,
      distance: 'Passeig de Gràcia'
    },
    pricePerNight: 410,
    rating: 4.94,
    reviewCount: 47,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 3,
    beds: 3,
    bathrooms: 2.5,
    maxGuests: 6,
    amenities: ['wifi', 'kitchen', 'ac', 'heating', 'pool', 'balcony', 'workspace', 'washer'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: true,
    host: {
      name: 'Catalan Estates Direct',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Member since 2018',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Eixample historic restorations',
      roleTitle: 'Senior Partner'
    },
    reviews: [
      {
        id: 'rev-s3',
        author: 'Mateo',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        date: 'September 2024',
        rating: 5,
        comment: 'The hydraulic tiles and terrace views are extraordinary works of art.'
      }
    ],
    availableDates: 'Active Listing • Title Deed Verified'
  },

  // ==========================================
  // SECTION 3: VACATION STAYS (SHORT-TERM RENTALS)
  // ==========================================
  {
    id: 'stay-1',
    title: 'Villa Positano Cliffside Vista',
    subtitle: 'Overlooking the Tyrrhenian Sea',
    description: 'Carved directly into the sheer cliffs of Positano, this breathtaking Mediterranean villa offers panoramic sea views, a private lemon terrace, and custom terracotta interiors. Steps away from Spiaggia Grande.',
    type: 'Entire luxury villa',
    propertyType: 'villa',
    category: 'beachfront',
    intent: 'stay',
    location: {
      city: 'Positano',
      region: 'Amalfi Coast',
      country: 'Italy',
      lat: 40.6281,
      lng: 14.4850,
      distance: 'Coastal retreat'
    },
    pricePerNight: 485,
    rating: 4.98,
    reviewCount: 142,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    maxGuests: 6,
    amenities: ['wifi', 'kitchen', 'ac', 'pool', 'hottub', 'beachfront', 'waterfront', 'self_checkin', 'bbq'],
    instantBook: true,
    selfCheckIn: true,
    allowsPets: false,
    host: {
      name: 'Elena & Matteo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined May 2017',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Architects preserving historic Campania homes'
    },
    reviews: [
      {
        id: 'r1',
        author: 'Julianne',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        date: 'August 2024',
        rating: 5,
        comment: 'Unbelievable sunset views from the terrace. The hosts arranged luggage transport and the finest local limoncello. Absolute perfection.'
      },
      {
        id: 'r2',
        author: 'Marcus',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        date: 'July 2024',
        rating: 5,
        comment: 'Even more stunning than the photographs! The infinity plunge pool overlooking Positano is unforgettable.'
      }
    ],
    availableDates: 'Oct 14 – 19'
  },
  {
    id: 'stay-2',
    title: 'The Glass House at Lake Tahoe',
    subtitle: 'Floor-to-ceiling pines & alpine water',
    description: 'Modernist cedar and glass architecture nestled beneath towering sugar pines. Enjoy a private pier, cedar hot tub, custom stone fireplace, and radiant heated concrete floors.',
    type: 'Entire residential home',
    propertyType: 'house',
    category: 'lakefront',
    intent: 'stay',
    location: {
      city: 'Tahoe City',
      region: 'California',
      country: 'United States',
      lat: 39.1677,
      lng: -120.1452,
      distance: 'Lakefront private beach'
    },
    pricePerNight: 520,
    rating: 4.96,
    reviewCount: 98,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 4,
    beds: 5,
    bathrooms: 3.5,
    maxGuests: 8,
    amenities: ['wifi', 'kitchen', 'heating', 'hottub', 'parking', 'ev_charger', 'lake_access', 'bbq', 'washer', 'self_checkin'],
    instantBook: true,
    selfCheckIn: true,
    allowsPets: true,
    host: {
      name: 'David',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined January 2019',
      responseRate: '99% within 2 hours',
      isSuperhost: true,
      tagline: 'Lifelong Tahoe backcountry guide'
    },
    reviews: [
      {
        id: 'r3',
        author: 'Samantha',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
        date: 'September 2024',
        rating: 5,
        comment: 'Sitting in the cedar hot tub while stargazing through towering pines is an experience our family will cherish forever.'
      }
    ],
    availableDates: 'Nov 2 – 7'
  },
  {
    id: 'stay-3',
    title: 'Historic Kyoto Machiya Garden House',
    subtitle: 'Traditional wooden architecture in Gion',
    description: 'Immerse yourself in authentic Japanese craftsmanship. Featuring hinoki cedar ofuro bath, tatami tea rooms, moss rock garden, and heated shoji screen living quarters.',
    type: 'Entire guesthouse',
    propertyType: 'guesthouse',
    category: 'design',
    intent: 'stay',
    location: {
      city: 'Kyoto',
      region: 'Kansai',
      country: 'Japan',
      lat: 35.0037,
      lng: 135.7772,
      distance: 'Historic Gion district'
    },
    pricePerNight: 290,
    rating: 4.99,
    reviewCount: 215,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 2,
    beds: 3,
    bathrooms: 1.5,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'ac', 'heating', 'washer', 'workspace', 'self_checkin'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: false,
    host: {
      name: 'Kenji & Aoi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined March 2016',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Kyoto preservationists and tea ceremony hosts'
    },
    reviews: [
      {
        id: 'r4',
        author: 'Claire',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        date: 'October 2024',
        rating: 5,
        comment: 'The scent of hinoki wood and the sound of rain on the moss courtyard was so peaceful. Best stay in Japan.'
      }
    ],
    availableDates: 'Nov 18 – 23'
  },
  {
    id: 'stay-4',
    title: 'Santorini Caldera Infinity Cave Suite',
    subtitle: 'High above Oia with sunset plunge pool',
    description: 'Traditional whitewashed Cycladic cave dwelling renovated with organic curved walls, heated infinity pool hanging over the caldera edge, and panoramic Aegean views.',
    type: 'Entire cave suite',
    propertyType: 'villa',
    category: 'pools',
    intent: 'stay',
    location: {
      city: 'Oia',
      region: 'Santorini',
      country: 'Greece',
      lat: 36.4618,
      lng: 25.3753,
      distance: 'Caldera cliffside'
    },
    pricePerNight: 640,
    rating: 4.97,
    reviewCount: 180,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: ['wifi', 'ac', 'pool', 'hottub', 'beachfront', 'waterfront', 'self_checkin'],
    instantBook: true,
    selfCheckIn: true,
    allowsPets: false,
    host: {
      name: 'Nikos',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined April 2018',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Born in Oia, dedicated hospitality purveyor'
    },
    reviews: [
      {
        id: 'r5',
        author: 'Liam',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        date: 'September 2024',
        rating: 5,
        comment: 'You do not need to fight the crowds for the sunset. You have the best seat in the entire Mediterranean right on your private terrace.'
      }
    ],
    availableDates: 'Oct 20 – 25'
  },
  {
    id: 'stay-5',
    title: 'Zermatt Matterhorn Timber Chalet',
    subtitle: 'Ski-in ski-out luxury with sauna',
    description: 'Five-star timber and granite chalet with unobstructed direct views of the Matterhorn. Complete with private Finnish sauna, outdoor hot tub, boot warmers, and stone fireplace.',
    type: 'Entire alpine chalet',
    propertyType: 'cabin',
    category: 'cabins',
    intent: 'stay',
    location: {
      city: 'Zermatt',
      region: 'Valais',
      country: 'Switzerland',
      lat: 45.9765,
      lng: 7.7491,
      distance: 'Slope-side access'
    },
    pricePerNight: 780,
    rating: 4.95,
    reviewCount: 76,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548625361-196144e05680?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 4,
    beds: 6,
    bathrooms: 4,
    maxGuests: 8,
    amenities: ['wifi', 'kitchen', 'heating', 'hottub', 'ski', 'gym', 'bbq', 'washer', 'self_checkin'],
    instantBook: false,
    selfCheckIn: true,
    allowsPets: false,
    host: {
      name: 'Beatrix',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined February 2015',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Swiss ski mountaineering enthusiast'
    },
    reviews: [
      {
        id: 'r6',
        author: 'Frederik',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        date: 'January 2024',
        rating: 5,
        comment: 'Ski straight into the boot room after a day on the glacier. The sauna and Matterhorn backdrop are unmatched.'
      }
    ],
    availableDates: 'Dec 5 – 10'
  },
  {
    id: 'stay-6',
    title: 'Eco Bamboo Sanctuary & River Pool',
    subtitle: 'Architectural bamboo haven in Ubud jungle',
    description: 'A structural marvel crafted entirely from sustainable local bamboo. Featuring a private natural spring pool, open-air living space immersed in tropical foliage, and daily yoga deck.',
    type: 'Entire architectural villa',
    propertyType: 'villa',
    category: 'trending',
    intent: 'stay',
    location: {
      city: 'Ubud',
      region: 'Bali',
      country: 'Indonesia',
      lat: -8.5069,
      lng: 115.2625,
      distance: 'Ayung river valley'
    },
    pricePerNight: 230,
    rating: 4.93,
    reviewCount: 310,
    isGuestFavorite: true,
    isSuperhost: true,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    ],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    amenities: ['wifi', 'kitchen', 'pool', 'parking', 'bbq', 'self_checkin'],
    instantBook: true,
    selfCheckIn: true,
    allowsPets: true,
    host: {
      name: 'Wayan & Made',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      joinedDate: 'Joined September 2016',
      responseRate: '100% within an hour',
      isSuperhost: true,
      tagline: 'Sustainable architectural designers in Bali'
    },
    reviews: [
      {
        id: 'r7',
        author: 'Hannah',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        date: 'August 2024',
        rating: 5,
        comment: 'Sleeping with the sound of the jungle river is pure bliss. The floating breakfast in the private pool was extraordinary.'
      }
    ],
    availableDates: 'Nov 12 – 17'
  }
];
