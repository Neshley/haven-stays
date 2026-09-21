import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, X, Plus, Minus, Sparkles, Building2, Key, Home, DollarSign } from 'lucide-react';
import { FilterState, ListingIntent } from '../types';
import { POPULAR_DESTINATIONS } from '../data/listings';

interface SearchBarExpandedProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
}

type TabType = 'where' | 'datesOrPrice' | 'whoOrSpecs';

export const SearchBarExpanded: React.FC<SearchBarExpandedProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('where');
  const [currentIntent, setCurrentIntent] = useState<FilterState['intent']>(filters.intent);
  const [destinationInput, setDestinationInput] = useState(filters.destination || filters.searchQuery || '');
  const [checkIn, setCheckIn] = useState(filters.checkInDate || '2026-10-14');
  const [checkOut, setCheckOut] = useState(filters.checkOutDate || '2026-10-19');
  const [guests, setGuests] = useState(filters.guests);
  
  // Rent & Sale state
  const [minRent, setMinRent] = useState(filters.minRent);
  const [maxRent, setMaxRent] = useState(filters.maxRent);
  const [maxSalePrice, setMaxSalePrice] = useState(filters.maxSalePrice);
  const [bedrooms, setBedrooms] = useState(filters.bedrooms);

  if (!isOpen) return null;

  const handleApplySearch = () => {
    onUpdateFilters({
      intent: currentIntent,
      destination: destinationInput,
      searchQuery: destinationInput,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: guests,
      minRent: minRent,
      maxRent: maxRent,
      maxSalePrice: maxSalePrice,
      bedrooms: bedrooms,
    });
    onClose();
  };

  const handleSelectPopular = (dest: typeof POPULAR_DESTINATIONS[0]) => {
    setDestinationInput(dest.query);
    setActiveTab('datesOrPrice');
  };

  const totalGuests = guests.adults + guests.children;

  const getTab2Label = () => {
    if (currentIntent === 'rent') return 'Monthly Rent';
    if (currentIntent === 'sale') return 'Price Budget';
    return 'When';
  };

  const getTab2Value = () => {
    if (currentIntent === 'rent') return `$${minRent} – $${maxRent}/mo`;
    if (currentIntent === 'sale') return `Up to $${(maxSalePrice / 1000).toFixed(0)}k`;
    return checkIn && checkOut ? `${checkIn} – ${checkOut}` : 'Any dates';
  };

  const getTab3Label = () => {
    if (currentIntent === 'rent' || currentIntent === 'sale') return 'Bedrooms';
    return 'Who';
  };

  const getTab3Value = () => {
    if (currentIntent === 'rent' || currentIntent === 'sale') {
      return bedrooms === 'any' ? 'Any bedrooms' : `${bedrooms}+ bedrooms`;
    }
    return totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col items-center pt-4 sm:pt-16 px-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with mode tabs and close button */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCurrentIntent('all')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                currentIntent === 'all'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Types</span>
            </button>

            <button
              onClick={() => setCurrentIntent('stay')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                currentIntent === 'stay'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#FF385C]" />
              <span>Vacation Stays</span>
            </button>

            <button
              onClick={() => setCurrentIntent('rent')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                currentIntent === 'rent'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>Apartments for Rent</span>
            </button>

            <button
              onClick={() => setCurrentIntent('sale')}
              className={`text-xs sm:text-sm font-semibold pb-2 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                currentIntent === 'sale'
                  ? 'border-neutral-900 text-neutral-900 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Properties for Sale</span>
            </button>
          </div>

          <button
            id="close-expanded-search"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Pill Bar */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-full border border-neutral-200 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 overflow-hidden">
            
            {/* Where Tab Button */}
            <button
              id="search-tab-where"
              onClick={() => setActiveTab('where')}
              className={`p-3 px-6 text-left transition rounded-full flex flex-col cursor-pointer ${
                activeTab === 'where' ? 'bg-neutral-100 shadow-inner' : 'hover:bg-neutral-50'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Location</span>
              <span className="text-sm font-medium text-neutral-900 truncate">
                {destinationInput || 'Search city, region, neighborhood'}
              </span>
            </button>

            {/* Dates / Price Tab Button */}
            <button
              id="search-tab-dates"
              onClick={() => setActiveTab('datesOrPrice')}
              className={`p-3 px-6 text-left transition rounded-full flex flex-col cursor-pointer ${
                activeTab === 'datesOrPrice' ? 'bg-neutral-100 shadow-inner' : 'hover:bg-neutral-50'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{getTab2Label()}</span>
              <span className="text-sm font-medium text-neutral-900 truncate">
                {getTab2Value()}
              </span>
            </button>

            {/* Who / Bedrooms Tab Button */}
            <button
              id="search-tab-who"
              onClick={() => setActiveTab('whoOrSpecs')}
              className={`p-3 px-6 text-left transition rounded-full flex flex-col cursor-pointer ${
                activeTab === 'whoOrSpecs' ? 'bg-neutral-100 shadow-inner' : 'hover:bg-neutral-50'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{getTab3Label()}</span>
              <span className="text-sm font-medium text-neutral-900 truncate">
                {getTab3Value()}
              </span>
            </button>

          </div>
        </div>

        {/* Tab Contents Area */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          
          {/* 1. WHERE TAB */}
          {activeTab === 'where' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Destination or Neighborhood
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    id="search-destination-input"
                    type="text"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    placeholder="Search by city (e.g. New York, London, Paris, Miami, Kyoto)..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-neutral-300 focus:border-neutral-900 focus:outline-none text-base font-semibold text-neutral-900 shadow-inner bg-neutral-50/50"
                  />
                  {destinationInput && (
                    <button
                      onClick={() => setDestinationInput('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Popular Destinations Cards */}
              <div>
                <h4 className="font-bold text-sm text-neutral-800 mb-3">
                  Featured Metros & Regions
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.name}
                      onClick={() => handleSelectPopular(dest)}
                      className={`p-3 rounded-2xl border text-left transition hover:border-neutral-900 cursor-pointer flex flex-col justify-between h-20 ${
                        destinationInput.toLowerCase() === dest.query.toLowerCase()
                          ? 'border-neutral-900 bg-neutral-50 font-bold'
                          : 'border-neutral-200'
                      }`}
                    >
                      <span className="text-xs font-bold text-neutral-900 line-clamp-1">{dest.name}</span>
                      <span className="text-[10px] text-neutral-500 line-clamp-2">{dest.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. DATES OR PRICE TAB */}
          {activeTab === 'datesOrPrice' && (
            <div className="space-y-6">
              {/* For Rent: Rent Range */}
              {currentIntent === 'rent' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-800">Desired Monthly Rent Range</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-neutral-300 rounded-2xl p-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block">Min Rent</label>
                      <div className="flex items-center text-sm font-bold text-neutral-900">
                        <span>$</span>
                        <input
                          type="number"
                          step={100}
                          value={minRent}
                          onChange={(e) => setMinRent(Number(e.target.value))}
                          className="w-full bg-transparent outline-hidden ml-1"
                        />
                      </div>
                    </div>
                    <div className="border border-neutral-300 rounded-2xl p-3">
                      <label className="text-[10px] uppercase font-bold text-neutral-500 block">Max Rent</label>
                      <div className="flex items-center text-sm font-bold text-neutral-900">
                        <span>$</span>
                        <input
                          type="number"
                          step={100}
                          value={maxRent}
                          onChange={(e) => setMaxRent(Number(e.target.value))}
                          className="w-full bg-transparent outline-hidden ml-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: 'Under $2,500', min: 1000, max: 2500 },
                      { label: '$2,500 – $4,000', min: 2500, max: 4000 },
                      { label: '$4,000+', min: 4000, max: 8000 },
                    ].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => { setMinRent(preset.min); setMaxRent(preset.max); }}
                        className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-semibold hover:border-neutral-400"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* For Sale: Purchase Budget */}
              {currentIntent === 'sale' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-neutral-800">Maximum Purchase Price</h4>
                  <div className="border border-neutral-300 rounded-2xl p-3">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 block">Budget Ceiling</label>
                    <div className="flex items-center text-base font-bold text-neutral-900">
                      <span>$</span>
                      <input
                        type="number"
                        step={50000}
                        value={maxSalePrice}
                        onChange={(e) => setMaxSalePrice(Number(e.target.value))}
                        className="w-full bg-transparent outline-hidden ml-1"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Under $1M', val: 1000000 },
                      { label: 'Under $1.5M', val: 1500000 },
                      { label: 'Under $2.5M', val: 2500000 },
                      { label: 'Any Budget', val: 5000000 },
                    ].map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => setMaxSalePrice(preset.val)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                          maxSalePrice === preset.val ? 'bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* For Stays or All: Date Picker */}
              {(currentIntent === 'stay' || currentIntent === 'all') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-neutral-300 rounded-2xl p-4 focus-within:border-neutral-900">
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-sm font-semibold text-neutral-900 focus:outline-none bg-transparent"
                      />
                    </div>

                    <div className="border border-neutral-300 rounded-2xl p-4 focus-within:border-neutral-900">
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        Checkout
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-sm font-semibold text-neutral-900 focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-neutral-500 block mb-2">Quick trip presets</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Weekend getaway (Oct 17 – Oct 19)', in: '2026-10-17', out: '2026-10-19' },
                        { label: '1 week vacation (Oct 18 – Oct 25)', in: '2026-10-18', out: '2026-10-25' },
                        { label: 'Extended retreat (Nov 1 – Nov 15)', in: '2026-11-01', out: '2026-11-15' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setCheckIn(preset.in);
                            setCheckOut(preset.out);
                          }}
                          className="px-3.5 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:border-neutral-400 transition"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. WHO OR SPECS TAB */}
          {activeTab === 'whoOrSpecs' && (
            <div>
              {/* For Rent & Sale: Bedrooms selection */}
              {(currentIntent === 'rent' || currentIntent === 'sale') ? (
                <div className="space-y-4 max-w-lg mx-auto py-2">
                  <h4 className="text-sm font-bold text-neutral-800">Minimum Bedrooms</h4>
                  <div className="flex gap-2">
                    {(['any', 1, 2, 3, 4] as (number | 'any')[]).map((num) => (
                      <button
                        key={num}
                        onClick={() => setBedrooms(num)}
                        className={`flex-1 py-3 rounded-2xl border text-xs font-bold transition ${
                          bedrooms === num
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {num === 'any' ? 'Any' : `${num}+ Beds`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* For Stays: Guests Counter */
                <div className="divide-y divide-neutral-100 max-w-lg mx-auto">
                  {/* Adults */}
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900 text-sm">Adults</div>
                      <div className="text-xs text-neutral-500">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={guests.adults <= 1}
                        onClick={() => setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-500 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-semibold text-sm">{guests.adults}</span>
                      <button
                        onClick={() => setGuests({ ...guests, adults: guests.adults + 1 })}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900 text-sm">Children</div>
                      <div className="text-xs text-neutral-500">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={guests.children <= 0}
                        onClick={() => setGuests({ ...guests, children: Math.max(0, guests.children - 1) })}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-500 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-semibold text-sm">{guests.children}</span>
                      <button
                        onClick={() => setGuests({ ...guests, children: guests.children + 1 })}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-neutral-900 text-sm">Pets</div>
                      <div className="text-xs text-neutral-500">Bringing pets along?</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={guests.pets <= 0}
                        onClick={() => setGuests({ ...guests, pets: Math.max(0, guests.pets - 1) })}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-500 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-semibold text-sm">{guests.pets}</span>
                      <button
                        onClick={() => setGuests({ ...guests, pets: guests.pets + 1 })}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-500 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={() => {
              setDestinationInput('');
              setCheckIn('');
              setCheckOut('');
              setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
              setBedrooms('any');
            }}
            className="text-sm font-semibold underline text-neutral-700 hover:text-neutral-900 cursor-pointer"
          >
            Clear all
          </button>
          <button
            onClick={handleApplySearch}
            className="bg-[#FF385C] hover:bg-[#E00B41] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search properties</span>
          </button>
        </div>
      </div>
    </div>
  );
};
