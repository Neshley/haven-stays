export type PropertyType = 'house' | 'apartment' | 'guesthouse' | 'hotel' | 'villa' | 'cabin';

export type PlaceType = 'any' | 'entire' | 'room';

export type ListingIntent = 'stay' | 'rent' | 'sale';

export interface Host {
  name: string;
  avatar: string;
  joinedDate: string;
  responseRate: string;
  isSuperhost: boolean;
  tagline: string;
  roleTitle?: string;
  phone?: string;
  licenseNumber?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Listing {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  propertyType: PropertyType;
  category: string;
  intent: ListingIntent; // 'stay' (vacation), 'rent' (long-term apartment), 'sale' (for purchase)
  location: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
    distance?: string;
    neighborhood?: string;
  };
  
  // Vacation Stay pricing
  pricePerNight: number;

  // Long-Term Rental specifics
  monthlyRent?: number;
  deposit?: number;
  leaseTerm?: string;
  furnishedStatus?: 'furnished' | 'unfurnished' | 'flexible';

  // Sale specifics
  salePrice?: number;
  sqft?: number;
  hoaFee?: number;
  yearBuilt?: number;
  propertyTaxAnnual?: number;
  parkingSpaces?: number;

  rating: number;
  reviewCount: number;
  isGuestFavorite: boolean;
  isSuperhost: boolean;
  images: string[];
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  instantBook: boolean;
  selfCheckIn: boolean;
  allowsPets: boolean;
  host: Host;
  reviews: Review[];
  availableDates: string;
}

export interface FilterState {
  intent: 'all' | 'stay' | 'rent' | 'sale';
  searchQuery: string;
  destination: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  minRent: number;
  maxRent: number;
  minSalePrice: number;
  maxSalePrice: number;
  minSqft: number;
  furnishedFilter: 'all' | 'furnished' | 'unfurnished';
  propertyTypes: PropertyType[];
  amenities: string[];
  bedrooms: number | 'any';
  beds: number | 'any';
  bathrooms: number | 'any';
  placeType: PlaceType;
  instantBook: boolean;
  selfCheckIn: boolean;
  allowsPets: boolean;
  checkInDate: string | null;
  checkOutDate: string | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  showTotalBeforeTaxes: boolean;
}

export type UserRole = 'traveler' | 'superhost' | 'local_guide' | 'digital_nomad';

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  location?: string;
  isOnline?: boolean;
}

export interface ListingAttachment {
  id: string;
  title: string;
  image: string;
  priceFormatted: string;
  intent: ListingIntent;
  city: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: ChatUser;
  content: string;
  timestamp: number;
  reactions?: Record<string, string[]>; // emoji -> array of user IDs
  listingAttachment?: ListingAttachment;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'community' | 'destinations' | 'topics';
  unreadCount?: number;
}

