import React, { useState, useMemo } from 'react';
import { X, Check, Building2, Key, Home, Sparkles } from 'lucide-react';
import { FilterState, PropertyType, PlaceType } from '../types';
import { AMENITY_OPTIONS } from '../data/listings';
import { DynamicIcon } from './DynamicIcon';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  totalFilteredCount: number;
}

const PROPERTY_TYPES: { type: PropertyType; label: string; icon: string }[] = [
  { type: 'apartment', label: 'Apartment & Flat', icon: 'Building' },
  { type: 'house', label: 'Single-Family House', icon: 'Home' },
  { type: 'villa', label: 'Luxury Villa', icon: 'Castle' },
  { type: 'cabin', label: 'Cabin & Chalet', icon: 'Tent' },
  { type: 'guesthouse', label: 'Guesthouse', icon: 'Warehouse' },
  { type: 'hotel', label: 'Boutique Hotel', icon: 'Hotel' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalFilteredCount,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // Sync state when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  // Histogram mock data for visual price curve
  const priceHistogram = useMemo(() => [
    { height: 18, price: 100 },
    { height: 35, price: 200 },
    { height: 60, price: 300 },
    { height: 90, price: 400 },
    { height: 75, price: 500 },
    { height: 50, price: 600 },
    { height: 40, price: 700 },
    { height: 25, price: 800 },
    { height: 15, price: 900 },
  ], []);

  if (!isOpen) return null;

  const handleToggleAmenity = (amenityId: string) => {
    const exists = localFilters.amenities.includes(amenityId);
    setLocalFilters({
      ...localFilters,
      amenities: exists
        ? localFilters.amenities.filter((a) => a !== amenityId)
        : [...localFilters.amenities, amenityId],
    });
  };

  const handleTogglePropertyType = (pt: PropertyType) => {
    const exists = localFilters.propertyTypes.includes(pt);
    setLocalFilters({
      ...localFilters,
      propertyTypes: exists
        ? localFilters.propertyTypes.filter((t) => t !== pt)
        : [...localFilters.propertyTypes, pt],
    });
  };

  const handleClearAll = () => {
    setLocalFilters({
      ...localFilters,
      intent: 'all',
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
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-neutral-900">Property & Stays Filter</h2>
          <div className="w-8" />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 divide-y divide-neutral-200">
          
          {/* 1. Transaction Scope (Stays vs Rentals vs Sale) */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Listing Category</h3>
            <p className="text-xs text-neutral-500 mb-4">Choose vacation stays, long-term apartment leases, or properties for purchase</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200 gap-1 text-center text-xs font-bold">
              <button
                onClick={() => setLocalFilters({ ...localFilters, intent: 'all' })}
                className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  localFilters.intent === 'all'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>All Options</span>
              </button>

              <button
                onClick={() => setLocalFilters({ ...localFilters, intent: 'stay' })}
                className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  localFilters.intent === 'stay'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-[#FF385C]" />
                <span>Vacation Stays</span>
              </button>

              <button
                onClick={() => setLocalFilters({ ...localFilters, intent: 'rent' })}
                className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  localFilters.intent === 'rent'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Apartments For Rent</span>
              </button>

              <button
                onClick={() => setLocalFilters({ ...localFilters, intent: 'sale' })}
                className={`py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  localFilters.intent === 'sale'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Properties For Sale</span>
              </button>
            </div>
          </div>

          {/* 2. ADAPTIVE PRICING CONTROLS */}
          <div className="pt-6">
            
            {/* If Rental Mode */}
            {localFilters.intent === 'rent' && (
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Monthly Rent Range</h3>
                <p className="text-xs text-neutral-500 mb-4">Set your monthly budget for residential apartment leases</p>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-300 rounded-2xl p-3 focus-within:border-neutral-900">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Min Monthly Rent
                    </label>
                    <div className="flex items-center text-base font-semibold text-neutral-900">
                      <span className="mr-1 text-neutral-500">$</span>
                      <input
                        type="number"
                        min={1000}
                        max={localFilters.maxRent - 200}
                        step={100}
                        value={localFilters.minRent}
                        onChange={(e) => setLocalFilters({ ...localFilters, minRent: Number(e.target.value) })}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="border border-neutral-300 rounded-2xl p-3 focus-within:border-neutral-900">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Max Monthly Rent
                    </label>
                    <div className="flex items-center text-base font-semibold text-neutral-900">
                      <span className="mr-1 text-neutral-500">$</span>
                      <input
                        type="number"
                        min={localFilters.minRent + 200}
                        max={10000}
                        step={100}
                        value={localFilters.maxRent}
                        onChange={(e) => setLocalFilters({ ...localFilters, maxRent: Number(e.target.value) })}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Furnished Status Filter */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-neutral-700 block mb-2">Furnishing Preference</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'All Units' },
                      { id: 'furnished', label: 'Furnished Only' },
                      { id: 'unfurnished', label: 'Unfurnished Only' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setLocalFilters({ ...localFilters, furnishedFilter: f.id as any })}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                          localFilters.furnishedFilter === f.id
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If Sale Mode */}
            {localFilters.intent === 'sale' && (
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Purchase Price Range</h3>
                <p className="text-xs text-neutral-500 mb-4">Set your purchase budget for apartments, condos, and estates</p>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-300 rounded-2xl p-3 focus-within:border-neutral-900">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Min Purchase Price
                    </label>
                    <div className="flex items-center text-base font-semibold text-neutral-900">
                      <span className="mr-1 text-neutral-500">$</span>
                      <input
                        type="number"
                        min={300000}
                        max={localFilters.maxSalePrice - 100000}
                        step={50000}
                        value={localFilters.minSalePrice}
                        onChange={(e) => setLocalFilters({ ...localFilters, minSalePrice: Number(e.target.value) })}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="border border-neutral-300 rounded-2xl p-3 focus-within:border-neutral-900">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Max Purchase Price
                    </label>
                    <div className="flex items-center text-base font-semibold text-neutral-900">
                      <span className="mr-1 text-neutral-500">$</span>
                      <input
                        type="number"
                        min={localFilters.minSalePrice + 100000}
                        max={5000000}
                        step={50000}
                        value={localFilters.maxSalePrice}
                        onChange={(e) => setLocalFilters({ ...localFilters, maxSalePrice: Number(e.target.value) })}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Min Square Footage */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-neutral-700 block mb-2">Minimum Square Footage (sq ft)</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { val: 0, label: 'Any size' },
                      { val: 1000, label: '1,000+ sq ft' },
                      { val: 1500, label: '1,500+ sq ft' },
                      { val: 2000, label: '2,000+ sq ft' },
                      { val: 3000, label: '3,000+ sq ft' },
                    ].map(sq => (
                      <button
                        key={sq.val}
                        onClick={() => setLocalFilters({ ...localFilters, minSqft: sq.val })}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          localFilters.minSqft === sq.val
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        {sq.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* If Stays or All Mode */}
            {(localFilters.intent === 'stay' || localFilters.intent === 'all') && (
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">Nightly Price Range</h3>
                <p className="text-xs text-neutral-500 mb-6">Nightly prices for vacation stays</p>

                {/* Histogram */}
                <div className="h-16 flex items-end gap-1.5 px-4 mb-4">
                  {priceHistogram.map((bar, i) => {
                    const inRange = bar.price >= localFilters.minPrice && bar.price <= localFilters.maxPrice;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className={`w-full rounded-t-sm transition-colors ${
                            inRange ? 'bg-neutral-800' : 'bg-neutral-200'
                          }`}
                          style={{ height: `${bar.height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="border border-neutral-300 rounded-2xl p-3 focus-within:border-neutral-900">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Min Nightly
                    </label>
                    <div className="flex items-center text-base font-semibold text-neutral-900">
                      <span className="mr-1 text-neutral-500">$</span>
                      <input
                        type="number"
                        min={20}
                        max={localFilters.maxPrice - 10}
                        value={localFilters.minPrice}
                        onChange={(e) => setLocalFilters({ ...localFilters, minPrice: Number(e.target.value) })}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="border border-neutral-300 rounded-2xl p-3 focus-within:border-neutral-900">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Max Nightly
                    </label>
                    <div className="flex items-center text-base font-semibold text-neutral-900">
                      <span className="mr-1 text-neutral-500">$</span>
                      <input
                        type="number"
                        min={localFilters.minPrice + 10}
                        max={1200}
                        value={localFilters.maxPrice}
                        onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) })}
                        className="w-full focus:outline-none bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Rooms and beds */}
          <div className="pt-6 space-y-5">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Rooms and beds</h3>

            {/* Bedrooms */}
            <div>
              <span className="text-sm font-semibold text-neutral-800 block mb-2">Bedrooms</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['any', 1, 2, 3, 4, 5] as (number | 'any')[]).map((val) => (
                  <button
                    key={val}
                    onClick={() => setLocalFilters({ ...localFilters, bedrooms: val })}
                    className={`px-5 py-2.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                      localFilters.bedrooms === val
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-800'
                    }`}
                  >
                    {val === 'any' ? 'Any' : `${val}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <span className="text-sm font-semibold text-neutral-800 block mb-2">Bathrooms</span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['any', 1, 2, 3, 4] as (number | 'any')[]).map((val) => (
                  <button
                    key={val}
                    onClick={() => setLocalFilters({ ...localFilters, bathrooms: val })}
                    className={`px-5 py-2.5 rounded-full border text-xs font-semibold transition cursor-pointer ${
                      localFilters.bathrooms === val
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-800'
                    }`}
                  >
                    {val === 'any' ? 'Any' : `${val}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Property Types */}
          <div className="pt-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Property type</h3>
            <p className="text-xs text-neutral-500 mb-4">Select one or more architectural styles</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map((pt) => {
                const isSelected = localFilters.propertyTypes.includes(pt.type);
                return (
                  <button
                    key={pt.type}
                    onClick={() => handleTogglePropertyType(pt.type)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    <DynamicIcon name={pt.icon} className="w-6 h-6 text-neutral-800" />
                    <span className="text-xs font-bold text-neutral-900">{pt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Amenities Filter */}
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Amenities & Features</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const checked = localFilters.amenities.includes(amenity.id);
                return (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 cursor-pointer transition select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleAmenity(amenity.id)}
                      className="w-4 h-4 rounded text-neutral-900 border-neutral-300 focus:ring-0 accent-neutral-900 cursor-pointer"
                    />
                    <DynamicIcon name={amenity.icon} className="w-4 h-4 text-neutral-600" />
                    <span className="text-xs font-semibold text-neutral-800">{amenity.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 6. Booking & Rules Options */}
          <div className="pt-6 space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Booking & Policies</h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                <div>
                  <span className="font-semibold text-sm text-neutral-900 block">Pet friendly</span>
                  <span className="text-xs text-neutral-500">Allows cats and dogs</span>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.allowsPets}
                  onChange={(e) => setLocalFilters({ ...localFilters, allowsPets: e.target.checked })}
                  className="w-5 h-5 rounded text-neutral-900 border-neutral-300 accent-neutral-900 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
                <div>
                  <span className="font-semibold text-sm text-neutral-900 block">Self check-in / Keyless entry</span>
                  <span className="text-xs text-neutral-500">Easy access via smart lock or lockbox</span>
                </div>
                <input
                  type="checkbox"
                  checked={localFilters.selfCheckIn}
                  onChange={(e) => setLocalFilters({ ...localFilters, selfCheckIn: e.target.checked })}
                  className="w-5 h-5 rounded text-neutral-900 border-neutral-300 accent-neutral-900 cursor-pointer"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-white flex items-center justify-between">
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-neutral-900 underline hover:text-neutral-600 transition cursor-pointer"
          >
            Clear all
          </button>

          <button
            id="apply-filters-button"
            onClick={handleApply}
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            Show {totalFilteredCount} propert{totalFilteredCount === 1 ? 'y' : 'ies'}
          </button>
        </div>

      </div>
    </div>
  );
};
