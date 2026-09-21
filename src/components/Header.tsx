import React, { useState, useRef, useEffect } from 'react';
import { Search, Globe, Menu, User, Heart, Compass, Check, Home, Building2, Key } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={onResetFilters}>
            <div className="w-10 h-10 rounded-full bg-[#FF385C] flex items-center justify-center text-white shadow-sm">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#FF385C]">haven</span>
              <span className="text-[10px] -mt-1 font-bold uppercase tracking-wider text-neutral-400">
                stays • rentals • sales
              </span>
            </div>
          </div>

          {/* Central Mode Switcher + Search Pill Bar */}
          <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5 py-1">
            
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                id="intent-tab-all"
                onClick={() => onSelectIntent('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'all'
                    ? 'text-neutral-900 bg-neutral-100 font-bold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>All Properties</span>
              </button>

              <button
                id="intent-tab-stay"
                onClick={() => onSelectIntent('stay')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'stay'
                    ? 'text-neutral-900 bg-neutral-100 font-bold ring-1 ring-neutral-300'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-[#FF385C]" />
                <span>Vacation Stays</span>
              </button>

              <button
                id="intent-tab-rent"
                onClick={() => onSelectIntent('rent')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'rent'
                    ? 'text-neutral-900 bg-neutral-100 font-bold ring-1 ring-neutral-300'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Rent Apartments</span>
              </button>

              <button
                id="intent-tab-sale"
                onClick={() => onSelectIntent('sale')}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  filters.intent === 'sale'
                    ? 'text-neutral-900 bg-neutral-100 font-bold ring-1 ring-neutral-300'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Buy / For Sale</span>
              </button>
            </div>

            {/* Central Search Pill Bar */}
            <button
              id="search-bar-trigger"
              onClick={onOpenSearch}
              className="group flex items-center divide-x divide-neutral-200 border border-neutral-300 hover:shadow-md rounded-full px-4 py-1.5 bg-white text-sm transition shadow-sm w-full max-w-md cursor-pointer"
            >
              <div className="flex-1 text-left px-2 truncate">
                <span className="font-semibold text-neutral-800 text-[11px] block">Location</span>
                <span className="text-neutral-500 text-xs font-normal truncate block">{locationDisplay}</span>
              </div>
              <div className="flex-1 text-left px-3 hidden sm:block truncate">
                <span className="font-semibold text-neutral-800 text-[11px] block">{sub.label1}</span>
                <span className="text-neutral-500 text-xs font-normal truncate block">{sub.val1}</span>
              </div>
              <div className="flex-1 text-left px-3 flex items-center justify-between gap-2 truncate">
                <div className="truncate">
                  <span className="font-semibold text-neutral-800 text-[11px] block">{sub.label2}</span>
                  <span className="text-neutral-500 text-xs font-normal truncate block">{sub.val2}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#FF385C] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-[#E00B41] transition-colors">
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </button>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              id="host-button"
              onClick={() => alert("Haven Partner Portal: List your vacation home for nightly guests, rent your apartment long-term, or market your property for sale with 0% hidden closing fees.")}
              className="hidden lg:block px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
            >
              List your property
            </button>

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
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#FF385C] text-[#FF385C]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF385C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                id="user-profile-menu-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 border border-neutral-300 rounded-full p-1.5 pl-3 hover:shadow-md transition cursor-pointer"
              >
                <Menu className="w-4 h-4 text-neutral-600" />
                <div className="w-7 h-7 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs font-medium overflow-hidden">
                  <User className="w-4 h-4" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 text-sm z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="font-semibold text-neutral-900">Welcome to Haven</p>
                    <p className="text-xs text-neutral-500">Stays, rentals & properties for sale</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => { onSelectIntent('stay'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2 text-xs font-medium"
                    >
                      <Home className="w-4 h-4 text-[#FF385C]" />
                      <span>Browse Vacation Stays</span>
                    </button>
                    <button
                      onClick={() => { onSelectIntent('rent'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2 text-xs font-medium"
                    >
                      <Key className="w-4 h-4 text-blue-600" />
                      <span>Browse Rental Apartments</span>
                    </button>
                    <button
                      onClick={() => { onSelectIntent('sale'); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 flex items-center gap-2 text-xs font-medium"
                    >
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Browse Properties for Sale</span>
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 my-1"></div>

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
