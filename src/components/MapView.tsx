import React, { useState, useEffect, useRef } from 'react';
import { Listing } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Star, X, MapPin, Building2, Key, Home, LocateFixed, RotateCcw, Loader2, ChevronDown, ChevronUp, Layers, Maximize2, Minimize2 } from 'lucide-react';
import { CurrencyInfo, formatCurrency } from '../utils/currency';

interface MapViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  selectedListingId: string | null;
  userLocation?: { lat: number; lng: number } | null;
  centerCoords?: { lat: number; lng: number } | null;
  zoom?: number;
  onZoomChange?: (newZoom: number) => void;
  onResetCenter?: () => void;
  onTriggerNearMe?: () => void;
  isLocating?: boolean;
  currentCurrency: CurrencyInfo;
  isFullscreen?: boolean;
  onToggleFullscreen?: (fullscreen: boolean) => void;
}

function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export const MapView: React.FC<MapViewProps> = ({
  listings,
  onSelectListing,
  selectedListingId,
  userLocation,
  centerCoords,
  zoom = 1,
  onZoomChange,
  onResetCenter,
  onTriggerNearMe,
  isLocating = false,
  currentCurrency,
  isFullscreen: propIsFullscreen,
  onToggleFullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const isFullscreen = propIsFullscreen !== undefined ? propIsFullscreen : internalFullscreen;

  const setIsFullscreen = (nextVal: boolean) => {
    if (onToggleFullscreen) {
      onToggleFullscreen(nextVal);
    } else {
      setInternalFullscreen(nextVal);
    }
  };

  const toggleFullscreen = () => {
    const nextVal = !isFullscreen;
    setIsFullscreen(nextVal);

    if (nextVal) {
      try {
        if (containerRef.current && !document.fullscreenElement && containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback gracefully to CSS fixed fullscreen
      }
    } else {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  // Keyboard shortcut: ESC to exit fullscreen & handle body overflow
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        try {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        } catch {
          // ignore
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = originalOverflow;
    };
  }, [isFullscreen]);

  const [internalZoom, setInternalZoom] = useState(zoom);
  const currentZoom = onZoomChange ? zoom : internalZoom;
  const setZoom = (valOrFn: number | ((prev: number) => number)) => {
    const nextVal = typeof valOrFn === 'function' ? valOrFn(currentZoom) : valOrFn;
    const clamped = Math.min(1.8, Math.max(0.85, nextVal));
    if (onZoomChange) {
      onZoomChange(clamped);
    } else {
      setInternalZoom(clamped);
    }
  };

  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);

  const stayCount = listings.filter((l) => l.intent === 'stay').length;
  const rentCount = listings.filter((l) => l.intent === 'rent').length;
  const saleCount = listings.filter((l) => l.intent === 'sale').length;

  // Normalize coordinates across the canvas
  const minLat = 20;
  const maxLat = 65;
  const minLng = -125;
  const maxLng = 140;

  const getCoordinates = (lat: number, lng: number) => {
    const normLng = Math.max(minLng, Math.min(maxLng, lng));
    const normLat = Math.max(minLat, Math.min(maxLat, lat));
    const x = ((normLng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = (1 - (normLat - minLat) / (maxLat - minLat)) * 75 + 12;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(8, Math.min(92, y)) };
  };

  // Center offset calculations based on centerCoords
  const targetCenter = centerCoords
    ? getCoordinates(centerCoords.lat, centerCoords.lng)
    : { x: 50, y: 50 };

  const panOffset = centerCoords
    ? {
        x: 50 - targetCenter.x,
        y: 50 - targetCenter.y,
      }
    : { x: 0, y: 0 };

  const formatPinPrice = (listing: Listing) => {
    if (listing.intent === 'sale' && listing.salePrice) {
      return formatCurrency(listing.salePrice, currentCurrency, true);
    }
    if (listing.intent === 'rent' && listing.monthlyRent) {
      return `${formatCurrency(listing.monthlyRent, currentCurrency, true)}/mo`;
    }
    return formatCurrency(listing.pricePerNight, currentCurrency, false);
  };

  return (
    <div 
      ref={containerRef}
      id="interactive-map-canvas-container"
      className={`relative overflow-hidden bg-sky-50 select-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none shadow-none'
          : 'w-full h-[700px] rounded-3xl border border-neutral-200 shadow-inner'
      }`}
    >
      
      {/* Stylized Vector World Map Grid Background */}
      <div 
        className="absolute inset-0 bg-[#e8ecef] transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${panOffset.x}%, ${panOffset.y}%) scale(${currentZoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* SVG stylized world landmass paths */}
        <svg className="w-full h-full opacity-40" preserveAspectRatio="none" viewBox="0 0 1000 600">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5dbe0" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="1000" height="600" fill="url(#grid)" />
          {/* North America shape */}
          <path d="M 120,100 Q 220,130 260,240 Q 220,320 180,300 Q 140,240 100,180 Z" fill="#d0d7dd" />
          {/* Europe shape */}
          <path d="M 480,120 Q 560,110 590,190 Q 540,230 480,200 Z" fill="#d0d7dd" />
          {/* Asia shape */}
          <path d="M 600,100 Q 820,110 880,240 Q 800,340 680,280 Q 640,200 600,100 Z" fill="#d0d7dd" />
          {/* Africa shape */}
          <path d="M 490,240 Q 570,250 560,380 Q 520,440 480,360 Z" fill="#d0d7dd" />
        </svg>

        {/* User Geolocation Marker if available */}
        {userLocation && (() => {
          const userCoords = getCoordinates(userLocation.lat, userLocation.lng);
          return (
            <div
              key="user-location-marker"
              id="user-location-marker"
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-auto group cursor-pointer"
              style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg ring-2 ring-blue-500/30" />
                <div className="absolute top-5 whitespace-nowrap bg-neutral-900/90 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>Your Location</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Map Price Pins */}
        {listings.map((listing) => {
          const { x, y } = getCoordinates(listing.location.lat, listing.location.lng);
          const isSelected = selectedListingId === listing.id;
          const isHovered = hoveredListing?.id === listing.id;

          const getPinColor = () => {
            if (isSelected || isHovered) return 'bg-neutral-900 text-white ring-4 ring-neutral-900/20 z-30 scale-110';
            if (listing.intent === 'sale') return 'bg-white text-emerald-950 border-2 border-emerald-600 hover:scale-105 shadow-md shadow-emerald-950/10';
            if (listing.intent === 'rent') return 'bg-white text-blue-950 border-2 border-blue-600 hover:scale-105 shadow-md shadow-blue-950/10';
            return 'bg-white text-rose-950 border-2 border-[#FF385C] hover:scale-105 shadow-md shadow-rose-950/10';
          };

          const distance = userLocation
            ? getDistanceMiles(userLocation.lat, userLocation.lng, listing.location.lat, listing.location.lng)
            : null;

          return (
            <div
              key={listing.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredListing(listing)}
            >
              <button
                id={`map-pin-${listing.id}`}
                onClick={() => onSelectListing(listing)}
                className={`px-3 py-1.5 rounded-full font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-1 ${getPinColor()}`}
              >
                {listing.intent === 'sale' && <Building2 className="w-3 h-3 text-emerald-600" />}
                {listing.intent === 'rent' && <Key className="w-3 h-3 text-blue-600" />}
                {listing.intent === 'stay' && <Home className="w-3 h-3 text-[#FF385C]" />}
                <span>{formatPinPrice(listing)}</span>
                {distance !== null && distance < 100 && (
                  <span className="text-[10px] opacity-75 font-normal ml-0.5">({distance}mi)</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Mode Top Bar */}
      {isFullscreen && (
        <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
          <button
            id="map-exit-fullscreen-badge-btn"
            onClick={toggleFullscreen}
            className="bg-neutral-900/95 hover:bg-neutral-900 text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-2 transition hover:scale-105 cursor-pointer"
            title="Exit full screen view (Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Fullscreen</span>
            <kbd className="text-[10px] text-neutral-400 font-mono bg-neutral-800 px-1.5 py-0.5 rounded ml-0.5">ESC</kbd>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-sm text-xs font-semibold text-neutral-700">
            <Layers className="w-3.5 h-3.5 text-neutral-500" />
            <span>{listings.length} places mapped</span>
          </div>
        </div>
      )}

      {/* Floating Zoom, Fullscreen, and Location Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
        <button
          id="map-fullscreen-toggle-control"
          onClick={toggleFullscreen}
          className="p-3 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer group"
          title={isFullscreen ? 'Exit full screen (Esc)' : 'Expand to full screen'}
          aria-label={isFullscreen ? 'Exit full screen' : 'Expand to full screen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-neutral-900 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize2 className="w-4 h-4 text-neutral-700 group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button
          id="map-zoom-in-control"
          onClick={() => setZoom((z) => Math.min(1.8, z + 0.18))}
          className="p-3 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          id="map-zoom-out-control"
          onClick={() => setZoom((z) => Math.max(0.85, z - 0.18))}
          className="p-3 text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        {onTriggerNearMe && (
          <button
            id="map-near-me-control"
            onClick={onTriggerNearMe}
            className="p-3 text-blue-600 hover:bg-blue-50 transition cursor-pointer"
            title="Locate me"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
          </button>
        )}
        {centerCoords && onResetCenter && (
          <button
            id="map-reset-center-control"
            onClick={onResetCenter}
            className="p-3 text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
            title="Reset to world view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Small Collapsible Map Legend */}
      <div 
        id="map-intent-legend-container"
        className="absolute bottom-4 left-4 z-30 pointer-events-auto"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLegendCollapsed ? (
            <motion.button
              key="legend-collapsed"
              id="expand-map-legend-btn"
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsLegendCollapsed(false)}
              className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-neutral-200/90 shadow-md text-xs font-bold text-neutral-800 flex items-center gap-2 hover:bg-white hover:shadow-lg transition-all cursor-pointer group"
              title="Expand property type legend"
            >
              <div className="flex items-center -space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF385C] ring-1.5 ring-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-1.5 ring-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-1.5 ring-white" />
              </div>
              <span className="font-extrabold text-[12px] text-neutral-900">Legend</span>
              <span className="text-[11px] text-neutral-400 font-medium">({listings.length})</span>
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform" />
            </motion.button>
          ) : (
            <motion.div
              key="legend-expanded"
              id="collapsible-map-legend"
              initial={{ opacity: 0, scale: 0.94, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              transition={{ duration: 0.2 }}
              className="w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200/90 shadow-xl overflow-hidden text-xs"
            >
              {/* Header */}
              <div className="px-3.5 py-2.5 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF385C] ring-1 ring-white" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 ring-1 ring-white" />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 ring-1 ring-white" />
                  </div>
                  <span className="font-extrabold text-neutral-900 text-[12px]">Property Types</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-neutral-400 font-medium">{listings.length} places</span>
                  <button
                    id="collapse-map-legend-btn"
                    onClick={() => setIsLegendCollapsed(true)}
                    className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition cursor-pointer"
                    title="Collapse legend"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Intent Color Legend Rows */}
              <div className="p-2 space-y-1">
                {/* Stays: Red */}
                <div 
                  id="legend-item-stay"
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF385C] ring-2 ring-[#FF385C]/25 shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 font-bold text-neutral-900 text-[11px]">
                        <Home className="w-3 h-3 text-[#FF385C]" />
                        <span>Stays</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">Nightly vacation stays</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                    {stayCount}
                  </span>
                </div>

                {/* Rentals: Blue */}
                <div 
                  id="legend-item-rent"
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-600/25 shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 font-bold text-neutral-900 text-[11px]">
                        <Key className="w-3 h-3 text-blue-600" />
                        <span>Rentals</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">Monthly apartment lease</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {rentCount}
                  </span>
                </div>

                {/* Sales: Emerald */}
                <div 
                  id="legend-item-sale"
                  className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-600/25 shrink-0" />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 font-bold text-neutral-900 text-[11px]">
                        <Building2 className="w-3 h-3 text-emerald-600" />
                        <span>For Sale</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">Real estate purchase</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {saleCount}
                  </span>
                </div>

                {/* Near me indicator if active */}
                {userLocation && (
                  <div 
                    id="legend-item-nearme"
                    className="pt-1.5 mt-1 border-t border-neutral-100 flex items-center justify-between px-2 py-1 text-[11px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                      <span className="font-bold text-blue-700 text-[11px]">Near Me active</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">GPS center</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hovered Listing Popup Preview Card */}
      {hoveredListing && (
        <div
          className="absolute bottom-6 right-6 z-40 w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 cursor-pointer"
          onClick={() => onSelectListing(hoveredListing)}
        >
          <div className="relative h-36 w-full">
            <img
              src={hoveredListing.images[0]}
              alt={hoveredListing.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 left-2">
              {hoveredListing.intent === 'sale' && (
                <span className="bg-emerald-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">For Sale</span>
              )}
              {hoveredListing.intent === 'rent' && (
                <span className="bg-blue-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Apartment Rent</span>
              )}
              {hoveredListing.intent === 'stay' && (
                <span className="bg-white/95 text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Vacation Stay</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHoveredListing(null);
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 text-sm truncate">
                {hoveredListing.location.neighborhood || hoveredListing.location.city}
              </span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-neutral-900">
                <Star className="w-3 h-3 fill-neutral-900" />
                <span>{hoveredListing.rating.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-neutral-500 text-xs truncate mt-0.5">{hoveredListing.title}</p>
            {userLocation && (
              <div className="mt-1 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                <LocateFixed className="w-3 h-3" />
                <span>{getDistanceMiles(userLocation.lat, userLocation.lng, hoveredListing.location.lat, hoveredListing.location.lng)} miles away from you</span>
              </div>
            )}
            <div className="mt-2 text-xs">
              {hoveredListing.intent === 'sale' ? (
                <span className="font-extrabold text-neutral-900 text-sm">{formatCurrency(hoveredListing.salePrice, currentCurrency)}</span>
              ) : hoveredListing.intent === 'rent' ? (
                <div>
                  <span className="font-extrabold text-neutral-900 text-sm">{formatCurrency(hoveredListing.monthlyRent, currentCurrency)}</span>
                  <span className="text-neutral-500 font-normal"> / month</span>
                </div>
              ) : (
                <div>
                  <span className="font-extrabold text-neutral-900 text-sm">{formatCurrency(hoveredListing.pricePerNight, currentCurrency)}</span>
                  <span className="text-neutral-500 font-normal"> / night</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
