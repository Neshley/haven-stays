import React, { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, Building2, Key, Sparkles, ShieldCheck } from 'lucide-react';
import { Listing } from '../types';
import { CurrencyInfo, formatCurrency } from '../utils/currency';

interface ListingCardProps {
  listing: Listing;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onSelect: (listing: Listing) => void;
  showTotalBeforeTaxes: boolean;
  currentCurrency: CurrencyInfo;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isWishlisted,
  onToggleWishlist,
  onSelect,
  showTotalBeforeTaxes,
  currentCurrency,
}) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(listing.id);
  };

  const renderBadge = () => {
    if (listing.intent === 'sale') {
      return (
        <span className="bg-[#1B4332]/95 backdrop-blur-xs text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-wide flex items-center gap-1 border border-emerald-400/30">
          <Building2 className="w-3 h-3 text-amber-300" />
          Freehold Sale
        </span>
      );
    }
    if (listing.intent === 'rent') {
      return (
        <span className="bg-slate-900/95 backdrop-blur-xs text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-wide flex items-center gap-1 border border-blue-400/30">
          <Key className="w-3 h-3 text-blue-300" />
          Monthly Lease
        </span>
      );
    }
    if (listing.isGuestFavorite) {
      return (
        <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-wide flex items-center gap-1 border border-neutral-200">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Sanctuary Choice
        </span>
      );
    }
    if (listing.isSuperhost) {
      return (
        <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md tracking-wide flex items-center gap-1 border border-neutral-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Verified Host
        </span>
      );
    }
    return null;
  };

  const renderPricing = () => {
    if (listing.intent === 'sale' && listing.salePrice) {
      const estMortgage = Math.round(listing.salePrice * 0.0055);
      const pricePerSqft = listing.sqft ? Math.round(listing.salePrice / listing.sqft) : null;

      return (
        <div className="mt-2 flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-neutral-900 text-base">
              {formatCurrency(listing.salePrice, currentCurrency)}
            </span>
            {pricePerSqft && (
              <span className="text-neutral-500 text-xs font-normal">
                ({formatCurrency(pricePerSqft, currentCurrency)}/sq ft)
              </span>
            )}
          </div>
          <span className="text-neutral-500 text-[11px]">
            Est. {formatCurrency(estMortgage, currentCurrency)}/mo mortgage
          </span>
        </div>
      );
    }

    if (listing.intent === 'rent' && listing.monthlyRent) {
      return (
        <div className="mt-2 flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold text-neutral-900 text-base">
              {formatCurrency(listing.monthlyRent, currentCurrency)}
            </span>
            <span className="text-neutral-600 text-xs font-normal">/ month</span>
          </div>
          <span className="text-neutral-500 text-[11px]">
            {listing.leaseTerm || '12-month lease'} • {listing.furnishedStatus ? `${listing.furnishedStatus}` : 'Unfurnished'}
          </span>
        </div>
      );
    }

    // Stays
    const nights = 5;
    const totalPrice = Math.round(listing.pricePerNight * nights * 1.14);

    return (
      <div className="mt-2 text-sm flex items-baseline gap-1">
        {showTotalBeforeTaxes ? (
          <div>
            <span className="font-bold text-neutral-900">{formatCurrency(totalPrice, currentCurrency)}</span>
            <span className="text-neutral-600 text-xs font-normal"> total before taxes</span>
          </div>
        ) : (
          <div>
            <span className="font-extrabold text-neutral-900 text-[15px]">{formatCurrency(listing.pricePerNight, currentCurrency)}</span>
            <span className="text-neutral-600 font-normal text-xs"> night</span>
          </div>
        )}
      </div>
    );
  };

  const renderSpecsSubtitle = () => {
    if (listing.intent === 'sale' || listing.intent === 'rent') {
      return (
        <p className="text-neutral-600 text-xs truncate mt-0.5 font-medium">
          {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''} • {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
          {listing.sqft ? ` • ${listing.sqft.toLocaleString()} sq ft` : ''}
        </p>
      );
    }
    return <p className="text-neutral-500 text-xs truncate mt-0.5 font-normal">{listing.subtitle}</p>;
  };

  return (
    <div
      id={`listing-card-${listing.id}`}
      onClick={() => onSelect(listing)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col transition-all duration-200"
    >
      {/* Photo Container */}
      <div className="relative aspect-[20/19] w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-2xs">
        <img
          src={listing.images[currentImageIdx]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {renderBadge()}
          {listing.status === 'taken' && (
            <span className="bg-neutral-900/90 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg tracking-wide uppercase flex items-center gap-1 border border-neutral-700">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              {listing.intent === 'rent' ? 'Taken / Leased' : listing.intent === 'sale' ? 'Sold' : 'Booked'}
            </span>
          )}
          {listing.status === 'pending' && (
            <span className="bg-amber-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg tracking-wide uppercase">
              Application Pending
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          id={`wishlist-button-${listing.id}`}
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full text-white hover:scale-110 active:scale-95 transition-transform"
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-6 h-6 stroke-white stroke-[2] transition-colors ${
              isWishlisted ? 'fill-emerald-600 text-emerald-600' : 'fill-black/30'
            }`}
          />
        </button>

        {/* Prev / Next Photo Arrow Controls */}
        {isHovered && listing.images.length > 1 && (
          <div className="absolute inset-x-2.5 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-10">
            <button
              onClick={handlePrevPhoto}
              className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="pointer-events-auto w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-md flex items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Photo indicator dots */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none z-10">
          {listing.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Listing Content & Pricing Info */}
      <div className="mt-3 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-neutral-900 text-[15px] truncate">
            {listing.location.neighborhood || `${listing.location.city}, ${listing.location.country}`}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 text-sm font-semibold text-neutral-900">
            <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
            <span>{listing.rating.toFixed(2)}</span>
            <span className="text-neutral-400 font-normal text-xs">({listing.reviewCount})</span>
          </div>
        </div>

        {renderSpecsSubtitle()}

        <p className="text-neutral-500 text-xs mt-0.5 truncate">{listing.availableDates}</p>

        {renderPricing()}
      </div>
    </div>
  );
};
