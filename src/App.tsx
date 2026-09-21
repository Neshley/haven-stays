import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_LISTINGS } from './data/listings';
import { Listing, FilterState } from './types';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { SearchBarExpanded } from './components/SearchBarExpanded';
import { FilterModal } from './components/FilterModal';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { MapView } from './components/MapView';
import { WishlistModal } from './components/WishlistModal';
import { Footer } from './components/Footer';
import { Map, List, RotateCcw, X, SlidersHorizontal, Sparkles, Building2, Key, Home, LocateFixed, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  intent: 'all',
  searchQuery: '',
  destination: '',
  category: null,
  minPrice: 50,
  maxPrice: 900,
  minRent: 1500,
  maxRent: 6000,
  minSalePrice: 500000,
  maxSalePrice: 3000000,
  minSqft: 0,
  furnishedFilter: 'all',
  propertyTypes: [],
  amenities: [],
  bedrooms: 'any',
  beds: 'any',
  bathrooms: 'any',
  placeType: 'any',
  instantBook: false,
  selfCheckIn: false,
  allowsPets: false,
  checkInDate: null,
  checkOutDate: null,
  guests: {
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  },
  showTotalBeforeTaxes: false,
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Geolocation & Map Centering State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationToast, setLocationToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setLocationToast({
        type: 'error',
        message: 'Geolocation is not supported by your browser.',
      });
      setTimeout(() => setLocationToast(null), 5000);
      return;
    }

    setIsLocating(true);
    setLocationToast({
      type: 'info',
      message: 'Locating your current coordinates...',
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        setMapCenterCoords({ lat, lng });
        setMapZoom(1.4);
        setLocationToast({
          type: 'success',
          message: `Centered on your location (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
        });
        setTimeout(() => setLocationToast(null), 5000);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === 1) {
          errorMsg = 'Location permission was denied by browser settings.';
        } else if (error.code === 2) {
          errorMsg = 'Location position is currently unavailable.';
        } else if (error.code === 3) {
          errorMsg = 'Location request timed out. Please try again.';
        }
        setLocationToast({
          type: 'error',
          message: errorMsg,
        });
        setTimeout(() => setLocationToast(null), 7000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Load wishlists from localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('haven_wishlist');
      return saved ? JSON.parse(saved) : ['stay-1', 'rent-1', 'sale-1'];
    } catch {
      return ['stay-1', 'rent-1', 'sale-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('haven_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.intent !== 'all') count++;
    if (filters.intent === 'rent') {
      if (filters.minRent > 1500 || filters.maxRent < 6000) count++;
      if (filters.furnishedFilter !== 'all') count++;
    } else if (filters.intent === 'sale') {
      if (filters.minSalePrice > 500000 || filters.maxSalePrice < 3000000) count++;
      if (filters.minSqft > 0) count++;
    } else {
      if (filters.minPrice > 50 || filters.maxPrice < 900) count++;
    }

    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.bedrooms !== 'any') count++;
    if (filters.bathrooms !== 'any') count++;
    if (filters.allowsPets) count++;
    if (filters.selfCheckIn) count++;
    return count;
  }, [filters]);

  // Comprehensive Multi-Intent Filtering Engine
  const filteredListings = useMemo(() => {
    return INITIAL_LISTINGS.filter((listing) => {
      // 1. Transaction Intent (Stays vs Rentals vs For Sale)
      if (filters.intent !== 'all' && listing.intent !== filters.intent) {
        return false;
      }

      // 2. Destination / Text Search
      const searchTarget = `${listing.title} ${listing.subtitle} ${listing.location.city} ${listing.location.region} ${listing.location.country} ${listing.location.neighborhood || ''} ${listing.description}`.toLowerCase();
      
      if (filters.destination) {
        const destTerm = filters.destination.toLowerCase().trim();
        if (!searchTarget.includes(destTerm)) return false;
      } else if (filters.searchQuery) {
        const qTerm = filters.searchQuery.toLowerCase().trim();
        if (!searchTarget.includes(qTerm)) return false;
      }

      // 3. Category Filter
      if (filters.category && filters.category !== 'all') {
        if (listing.category !== filters.category) return false;
      }

      // 4. Intent-specific pricing
      if (listing.intent === 'stay') {
        if (listing.pricePerNight < filters.minPrice || listing.pricePerNight > filters.maxPrice) {
          return false;
        }
      } else if (listing.intent === 'rent' && listing.monthlyRent) {
        if (listing.monthlyRent < filters.minRent || listing.monthlyRent > filters.maxRent) {
          return false;
        }
        if (filters.furnishedFilter !== 'all' && listing.furnishedStatus !== filters.furnishedFilter) {
          return false;
        }
      } else if (listing.intent === 'sale' && listing.salePrice) {
        if (listing.salePrice < filters.minSalePrice || listing.salePrice > filters.maxSalePrice) {
          return false;
        }
        if (filters.minSqft > 0 && (listing.sqft || 0) < filters.minSqft) {
          return false;
        }
      }

      // 5. Property Types Filter
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(listing.propertyType)) return false;
      }

      // 6. Amenities Filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((am) => listing.amenities.includes(am));
        if (!hasAllAmenities) return false;
      }

      // 7. Rooms & Beds
      if (filters.bedrooms !== 'any' && listing.bedrooms < filters.bedrooms) return false;
      if (filters.bathrooms !== 'any' && listing.bathrooms < filters.bathrooms) return false;

      // 8. Pet Policy & Self Checkin
      if (filters.allowsPets && !listing.allowsPets) return false;
      if (filters.selfCheckIn && !listing.selfCheckIn) return false;

      return true;
    });
  }, [filters]);

  const wishlistedListings = useMemo(() => {
    return INITIAL_LISTINGS.filter((l) => wishlist.includes(l.id));
  }, [wishlist]);

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Quick destinations across metros
  const quickLocations = ['All', 'New York', 'London', 'Paris', 'Miami', 'Berlin', 'Kyoto', 'Amalfi Coast', 'Lake Tahoe', 'Santorini', 'Barcelona'];

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-[#FF385C]/20 selection:text-[#FF385C]">
      
      {/* 1. Top Navbar Header */}
      <Header
        filters={filters}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onResetFilters={handleResetFilters}
        onSelectIntent={(intent) => handleUpdateFilters({ intent })}
      />

      {/* 2. Horizontal Category Bar with Filter trigger & Tax toggle */}
      <CategoryBar
        selectedCategory={filters.category}
        onSelectCategory={(catId) => handleUpdateFilters({ category: catId })}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
        showTotalBeforeTaxes={filters.showTotalBeforeTaxes}
        onToggleTotalBeforeTaxes={() =>
          handleUpdateFilters({ showTotalBeforeTaxes: !filters.showTotalBeforeTaxes })
        }
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
        
        {/* Destination Quick-Chips & Filter Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          
          {/* Quick Destination Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {quickLocations.map((loc) => {
              const isAll = loc === 'All' && !filters.destination;
              const isSelected = isAll || filters.destination.toLowerCase().includes(loc.toLowerCase());

              return (
                <button
                  key={loc}
                  onClick={() => {
                    handleUpdateFilters({
                      destination: loc === 'All' ? '' : loc,
                      searchQuery: loc === 'All' ? '' : loc,
                    });
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          {/* Results Count & View Mode Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 text-xs">
            <span className="font-semibold text-neutral-500">
              <strong className="text-neutral-900 font-bold">{filteredListings.length}</strong>{' '}
              {filters.intent === 'rent'
                ? 'rental apartments'
                : filters.intent === 'sale'
                ? 'properties for sale'
                : filters.intent === 'stay'
                ? 'vacation stays'
                : 'properties'} found
            </span>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 font-semibold text-[#FF385C] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Applied Filter Badges */}
        {(activeFilterCount > 0 || Boolean(filters.destination)) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs">
            <span className="font-bold text-neutral-600 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filtered by:
            </span>

            {filters.intent !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 font-bold text-neutral-900">
                {filters.intent === 'stay' && <Home className="w-3 h-3 text-[#FF385C]" />}
                {filters.intent === 'rent' && <Key className="w-3 h-3 text-blue-600" />}
                {filters.intent === 'sale' && <Building2 className="w-3 h-3 text-emerald-600" />}
                <span>
                  {filters.intent === 'stay' ? 'Vacation Stays' : filters.intent === 'rent' ? 'Apartments for Rent' : 'Properties for Sale'}
                </span>
                <button
                  onClick={() => handleUpdateFilters({ intent: 'all' })}
                  className="hover:text-neutral-900 ml-1 text-neutral-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.destination && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 font-semibold text-neutral-800">
                Location: {filters.destination}
                <button onClick={() => handleUpdateFilters({ destination: '', searchQuery: '' })} className="hover:text-neutral-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.intent === 'rent' && (filters.minRent > 1500 || filters.maxRent < 6000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 font-semibold text-neutral-800">
                Rent: ${filters.minRent} – ${filters.maxRent}/mo
                <button onClick={() => handleUpdateFilters({ minRent: 1500, maxRent: 6000 })} className="hover:text-neutral-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.intent === 'sale' && (filters.minSalePrice > 500000 || filters.maxSalePrice < 3000000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 font-semibold text-neutral-800">
                Sale: ${filters.minSalePrice.toLocaleString()} – ${filters.maxSalePrice.toLocaleString()}
                <button onClick={() => handleUpdateFilters({ minSalePrice: 500000, maxSalePrice: 3000000 })} className="hover:text-neutral-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.amenities.map((amenity) => (
              <span key={amenity} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 font-semibold text-neutral-800 capitalize">
                {amenity.replace('_', ' ')}
                <button
                  onClick={() =>
                    handleUpdateFilters({
                      amenities: filters.amenities.filter((a) => a !== amenity),
                    })
                  }
                  className="hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filters.propertyTypes.map((pt) => (
              <span key={pt} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 font-semibold text-neutral-800 capitalize">
                {pt}
                <button
                  onClick={() =>
                    handleUpdateFilters({
                      propertyTypes: filters.propertyTypes.filter((t) => t !== pt),
                    })
                  }
                  className="hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-bold underline ml-auto cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* 4. Display Area: Listings Grid OR Map View */}
        <AnimatePresence mode="wait" initial={false}>
          {viewMode === 'map' ? (
            <motion.div
              key="map-view"
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Interactive Map Explorer</h2>
                  <p className="text-xs text-neutral-500">
                    {userLocation ? 'Map centered on your location • Click any pin to inspect' : 'Click "Near Me" or any price pin to inspect details'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {userLocation && (
                    <button
                      id="reset-map-center-btn"
                      onClick={() => {
                        setMapCenterCoords(null);
                        setMapZoom(1);
                      }}
                      className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1 cursor-pointer transition hover:bg-neutral-50"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset center</span>
                    </button>
                  )}
                  <button
                    id="switch-to-list-header-btn"
                    onClick={() => setViewMode('grid')}
                    className="text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer transition hover:bg-neutral-50"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Show list</span>
                  </button>
                </div>
              </div>
              <MapView
                listings={filteredListings}
                onSelectListing={(listing) => setSelectedListing(listing)}
                selectedListingId={selectedListing?.id || null}
                userLocation={userLocation}
                centerCoords={mapCenterCoords}
                zoom={mapZoom}
                onZoomChange={(z) => setMapZoom(z)}
                onResetCenter={() => {
                  setMapCenterCoords(null);
                  setMapZoom(1);
                }}
                onTriggerNearMe={handleNearMe}
                isLocating={isLocating}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 10, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {filteredListings.length === 0 ? (
                /* Empty State */
                <div className="py-20 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                    <Sparkles className="w-8 h-8 text-neutral-500" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">No exact matches found</h3>
                  <p className="text-sm text-neutral-500">
                    Try switching categories (Vacation Stays, Rentals, or For Sale), widening your budget, or clearing some filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 bg-neutral-900 text-white font-bold px-6 py-3 rounded-2xl text-sm hover:bg-black transition cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                /* Listings Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      isWishlisted={wishlist.includes(listing.id)}
                      onToggleWishlist={toggleWishlist}
                      onSelect={(l) => setSelectedListing(l)}
                      showTotalBeforeTaxes={filters.showTotalBeforeTaxes}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 5. Sticky Floating Toggle Button (Show map / Near Me / Show list) */}
      <div className="fixed bottom-8 inset-x-0 flex flex-col items-center justify-center z-30 pointer-events-none">
        
        {/* Geolocation status notification toast */}
        <AnimatePresence>
          {locationToast && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              className={`mb-3 pointer-events-auto px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border backdrop-blur-md ${
                locationToast.type === 'error'
                  ? 'bg-rose-50/95 text-rose-800 border-rose-200'
                  : locationToast.type === 'success'
                  ? 'bg-emerald-50/95 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50/95 text-blue-800 border-blue-200'
              }`}
            >
              {locationToast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {locationToast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {locationToast.type === 'info' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />}
              <span>{locationToast.message}</span>
              {locationToast.type === 'error' && (
                <button
                  onClick={() => {
                    const demoLat = 40.7128;
                    const demoLng = -74.006;
                    setUserLocation({ lat: demoLat, lng: demoLng });
                    setMapCenterCoords({ lat: demoLat, lng: demoLng });
                    setMapZoom(1.4);
                    setLocationToast({
                      type: 'success',
                      message: 'Simulated coordinates set (New York: 40.71°, -74.01°)',
                    });
                    setTimeout(() => setLocationToast(null), 4000);
                  }}
                  className="ml-1 underline text-xs font-extrabold hover:text-rose-950 cursor-pointer"
                >
                  Try demo
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2.5">
          {/* If in map mode, provide dedicated "Show list" toggle button */}
          <AnimatePresence>
            {viewMode === 'map' && (
              <motion.button
                id="toggle-list-view-button"
                initial={{ opacity: 0, scale: 0.88, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.88, x: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                transition={{
                  layout: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                  scale: { type: 'spring', stiffness: 400, damping: 25 },
                }}
                onClick={() => setViewMode('grid')}
                className="pointer-events-auto bg-white/95 hover:bg-white text-neutral-900 px-4 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer border border-neutral-300 backdrop-blur-xs"
              >
                <List className="w-4 h-4" />
                <span>Show list</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Primary #toggle-map-view-button:
              - In grid mode: switches to map view
              - In map mode: 'Near Me' feature that geolocates user and centers map */}
          <motion.button
            id="toggle-map-view-button"
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{
              layout: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
              scale: { type: 'spring', stiffness: 400, damping: 25 },
            }}
            onClick={() => {
              if (viewMode === 'map') {
                handleNearMe();
              } else {
                setViewMode('map');
              }
            }}
            className="pointer-events-auto bg-neutral-900 hover:bg-black text-white px-5 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer border border-neutral-800"
          >
            <AnimatePresence mode="wait" initial={false}>
              {viewMode === 'grid' ? (
                <motion.span
                  key="show-map"
                  initial={{ opacity: 0, scale: 0.88, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="flex items-center gap-2"
                >
                  <span>Show map</span>
                  <Map className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="near-me"
                  initial={{ opacity: 0, scale: 0.88, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="flex items-center gap-2"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      <LocateFixed className="w-4 h-4 text-blue-400" />
                      <span>Near Me</span>
                    </>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Modals */}
      {/* Expanded Interactive Search Bar Modal */}
      <SearchBarExpanded
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
      />

      {/* Price & Amenities Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        totalFilteredCount={filteredListings.length}
      />

      {/* Stay / Rental / Sale Inspection & Inquiry Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isWishlisted={selectedListing ? wishlist.includes(selectedListing.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* Wishlist Drawer */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistedListings={wishlistedListings}
        onRemoveFromWishlist={toggleWishlist}
        onSelectListing={(l) => setSelectedListing(l)}
      />

    </div>
  );
}
