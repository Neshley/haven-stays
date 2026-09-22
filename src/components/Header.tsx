import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Menu, User, Heart, Compass, Check, Home, Building2, Key, MessageSquare, Users } from 'lucide-react';
import { FilterState } from '../types';
import { CurrencyInfo } from '../utils/currency';

interface HeaderProps {
  filters: FilterState;
  onOpenSearch: () => void;
  onOpenFilters: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onResetFilters: () => void;
  onSelectIntent: (intent: 'all' | 'stay' | 'rent' | 'sale') => void;
  currentCurrency: CurrencyInfo;
  onOpenCurrencyModal: () => void;
  onOpenChat: () => void;
  onlineChatCount?: number;
  onOpenLandingPage?: () => void;
  onOpenHostPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onOpenSearch,
  onOpenFilters,
  wishlistCount,
  onOpenWishlist,
  onResetFilters,
  onSelectIntent,
  currentCurrency,
  onOpenCurrencyModal,
  onOpenChat,
  onlineChatCount = 6,
  onOpenLandingPage,
  onOpenHostPortal,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const locationDisplay = filters.destination || filters.searchQuery || 'Any destination';

  const getSubtextPill = () => {
    if (filters.intent === 'rent') {
      return {
        label1: 'Monthly rent',
        val1: `$${filters.minRent} – $${filters.maxRent}`,
        label2: 'Lease & beds',
        val2: filters.bedrooms === 'any' ? 'Any bedroom' : `${filters.bedrooms}+ beds`,
      };
    }
    if (filters.intent === 'sale') {
      return {
        label1: 'Budget',
        val1: filters.maxSalePrice >= 3000000 ? 'Any price' : `Up to $${(filters.maxSalePrice / 1000).toFixed(0)}k`,
        label2: 'Size & beds',
        val2: filters.bedrooms === 'any' ? 'Any beds' : `${filters.bedrooms}+ beds`,
      };
    }
    // Stays
    const datesDisplay = filters.checkInDate && filters.checkOutDate
      ? `${filters.checkInDate} – ${filters.checkOutDate}`
      : 'Any week';
    const totalGuests = filters.guests.adults + filters.guests.children;
    const guestsDisplay = totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';
    return {
      label1: 'When',
      val1: datesDisplay,
      label2: 'Who',
      val2: guestsDisplay,
    };
  };

  const sub = getSubtextPill();

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA] border-b border-neutral-200/80 transition-all duration-200 shadow-2xs">
      {/* Top Tagline & Trust Signal Announcement */}
      <div className="bg-[#1B4332] text-white text-[11px] py-1.5 px-4 border-b border-[#2D6A4F]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="hidden sm:inline-block font-extrabold uppercase tracking-wider text-[9px] bg-emerald-900/90 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
              Sanctuary
            </span>
            <span className="font-semibold text-emerald-100 truncate">
              <strong>Haven</strong> — Curated architectural stays and eco-design sanctuaries for modern explorers.
            </span>
          </div>

          <div className="flex items-center gap-3 text-emerald-200 text-[10px] sm:text-[11px] font-medium flex-shrink-0">
            <span className="flex items-center gap-1">
              <span className="text-amber-300">★</span>
              <span>4.94 Trust Score</span>
            </span>
            <span className="hidden sm:inline text-emerald-400/50">•</span>
            <span className="hidden sm:inline">100% Escrow Protection</span>
            {onOpenLandingPage && (
              <button
                onClick={onOpenLandingPage}
                className="ml-2 font-bold text-emerald-300 hover:text-white underline cursor-pointer"
              >
                Why Haven?
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo with Niche Subtitle */}
          <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={onResetFilters}>
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] flex items-center justify-center text-white shadow-sm shadow-emerald-950/20">
              <Compass className="w-5 h-5 stroke-[2.2] text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-neutral-900 font-display">
                haven<span className="text-emerald-700">.</span>
              </span>
              <span className="text-[9px] -mt-0.5 font-bold uppercase tracking-wider text-emerald-800">
                Architectural Sanctuaries
              </span>
            </div>
          </div>

          {/* Central Category Switcher + Search Pill Bar */}
          <div className="flex-1 max-w-2xl flex flex-col items-center gap-2 py-1">
            
            {/* NAVIGATION CLARITY: Segmented, High-Contrast Category Switcher */}
            <div className="flex items-center gap-1 sm:gap-2 p-1 bg-neutral-200/60 rounded-full border border-neutral-300/80">
              <button
                id="intent-tab-all"
                onClick={() => onSelectIntent('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'all'
                    ? 'text-neutral-900 bg-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>All Sanctuaries</span>
              </button>

              <button
                id="intent-tab-stay"
                onClick={() => onSelectIntent('stay')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'stay'
                    ? 'text-emerald-950 bg-emerald-50 border border-emerald-400 shadow-xs'
                    : 'text-neutral-600 hover:text-emerald-900'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-emerald-700" />
                <span>Short Stays</span>
                <span className="text-[10px] text-emerald-700 font-semibold hidden md:inline">Nightly</span>
              </button>

              <button
                id="intent-tab-rent"
                onClick={() => onSelectIntent('rent')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'rent'
                    ? 'text-blue-950 bg-blue-50 border border-blue-400 shadow-xs'
                    : 'text-neutral-600 hover:text-blue-900'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-blue-700" />
                <span>Monthly Rentals</span>
                <span className="text-[10px] text-blue-700 font-semibold hidden md:inline">1–12 Mo</span>
              </button>

              <button
                id="intent-tab-sale"
                onClick={() => onSelectIntent('sale')}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'sale'
                    ? 'text-amber-950 bg-amber-50 border border-amber-400 shadow-xs'
                    : 'text-neutral-600 hover:text-amber-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Properties for Sale</span>
                <span className="text-[10px] text-amber-700 font-semibold hidden md:inline">Freehold</span>
              </button>
            </div>

            {/* Central Search Pill Bar */}
            <button
              id="search-bar-trigger"
              onClick={onOpenSearch}
              className="group flex items-center divide-x divide-neutral-200 border border-neutral-300 hover:border-emerald-700/60 hover:shadow-md rounded-full px-4 py-1.5 bg-white text-sm transition shadow-2xs w-full max-w-md cursor-pointer"
            >
              <div className="flex-1 text-left px-2 truncate">
                <span className="font-bold text-neutral-800 text-[11px] block">Destination</span>
                <span className="text-neutral-500 text-xs font-normal truncate block">{locationDisplay}</span>
              </div>
              <div className="flex-1 text-left px-3 hidden sm:block truncate">
                <span className="font-bold text-neutral-800 text-[11px] block">{sub.label1}</span>
                <span className="text-neutral-500 text-xs font-normal truncate block">{sub.val1}</span>
              </div>
              <div className="flex-1 text-left px-3 flex items-center justify-between gap-2 truncate">
                <div className="truncate">
                  <span className="font-bold text-neutral-800 text-[11px] block">{sub.label2}</span>
                  <span className="text-neutral-500 text-xs font-normal truncate block">{sub.val2}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#2D6A4F] transition-colors">
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </button>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Currency & Language selector button */}
            <button
              id="language-currency-button"
              onClick={onOpenCurrencyModal}
              className="px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-neutral-200"
              title="Change currency and language"
            >
              <Globe className="w-4 h-4 text-neutral-600" />
              <span>{currentCurrency?.code || 'USD'} ({currentCurrency?.symbol || '$'})</span>
            </button>

            {/* Wishlist quick action */}
            <button
              id="wishlist-trigger-button"
              onClick={onOpenWishlist}
              className="relative p-2.5 text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-emerald-700 text-emerald-700' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Host & Landlord Portal Trigger */}
            {onOpenHostPortal && (
              <button
                id="host-portal-header-button"
                onClick={onOpenHostPortal}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100 border border-neutral-200/80 rounded-full transition cursor-pointer"
                title="Manage properties, mark taken/leased/sold, or list new apartments"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>Host Portal</span>
              </button>
            )}

            {/* Haven Community Group Chat Button */}
            <button
              id="community-chat-header-button"
              onClick={onOpenChat}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 rounded-full transition cursor-pointer shadow-2xs"
              title="Open Haven Community Group Chat"
            >
              <Users className="w-4 h-4 text-emerald-800" />
              <span className="hidden sm:inline">Community</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {onlineChatCount}
              </span>
            </button>

            {/* User Account Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                id="user-profile-menu-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 border border-neutral-300 rounded-full p-1.5 pl-3 hover:shadow-md transition cursor-pointer"
              >
                <Menu className="w-4 h-4 text-neutral-600" />
                <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-medium overflow-hidden">
                  <User className="w-4 h-4" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 text-sm z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-neutral-900 font-display">Welcome to Haven</p>
                      <p className="text-xs text-neutral-500">Curated architectural stays & rentals</p>
                    </div>
                    {onOpenLandingPage && (
                      <button
                        onClick={() => { onOpenLandingPage(); setUserMenuOpen(false); }}
                        className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    )}
                  </div>
                  
                  {onOpenHostPortal && (
                    <div className="p-2 border-b border-neutral-100 bg-emerald-50/40">
                      <button
                        onClick={() => { onOpenHostPortal(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-300 text-neutral-900 flex items-center justify-between text-xs font-bold shadow-2xs cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-800" />
                          <span>Host & Landlord Portal</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold">
                          Manage
                        </span>
                      </button>
                    </div>
                  )}

                  {onOpenLandingPage && (
                    <div className="p-2 border-b border-neutral-100 bg-neutral-50/60">
                      <button
                        onClick={() => { onOpenLandingPage(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 flex items-center justify-between text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        <span>Sanctuary Club & Sign In</span>
                        <span className="text-[10px] text-neutral-400">View Page →</span>
                      </button>
                    </div>
                  )}
                  
                  <div className="py-1">
                    <button
                      onClick={() => { onSelectIntent('stay'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2 text-xs font-medium"
                    >
                      <Home className="w-4 h-4 text-emerald-700" />
                      <span>Browse Vacation Stays</span>
                    </button>
                    <button
                      onClick={() => { onSelectIntent('rent'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2 text-xs font-medium"
                    >
                      <Key className="w-4 h-4 text-blue-700" />
                      <span>Browse Rental Apartments</span>
                    </button>
                    <button
                      onClick={() => { onSelectIntent('sale'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2 text-xs font-medium"
                    >
                      <Building2 className="w-4 h-4 text-amber-700" />
                      <span>Browse Properties for Sale</span>
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 my-1"></div>

                  <button
                    onClick={() => { onOpenChat(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center justify-between text-neutral-800 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-800" />
                      <span>Haven Community Chat</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                      Live
                    </span>
                  </button>

                  <button
                    onClick={() => { onOpenWishlist(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center justify-between text-neutral-700 text-xs font-medium"
                  >
                    <span>Saved Wishlists</span>
                    {wishlistCount > 0 && (
                      <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-full font-semibold">{wishlistCount}</span>
                    )}
                  </button>
                  <button
                    onClick={() => { onOpenFilters(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 text-xs font-medium"
                  >
                    All Filter Options
                  </button>
                  <button
                    onClick={() => { onResetFilters(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 text-xs font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
