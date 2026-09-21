import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES } from '../data/listings';
import { DynamicIcon } from './DynamicIcon';

interface CategoryBarProps {
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  showTotalBeforeTaxes: boolean;
  onToggleTotalBeforeTaxes: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenFilters,
  activeFilterCount,
  showTotalBeforeTaxes,
  onToggleTotalBeforeTaxes,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-neutral-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3">
          
          {/* Scrollable Categories List */}
          <div className="relative flex-1 min-w-0 flex items-center">
            
            {/* Left Scroll Arrow */}
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-0 z-10 w-7 h-7 rounded-full border border-neutral-300 bg-white shadow-md items-center justify-center text-neutral-700 hover:scale-105 transition cursor-pointer"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Category Items */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-7 overflow-x-auto no-scrollbar scroll-smooth px-1 md:px-8"
            >
              {CATEGORIES.map((cat) => {
                const isActive = (cat.id === 'all' && !selectedCategory) || selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    id={`category-tab-${cat.id}`}
                    onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
                    className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 transition flex-shrink-0 cursor-pointer group ${
                      isActive
                        ? 'border-neutral-900 text-neutral-900 font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300 font-medium'
                    }`}
                  >
                    <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-neutral-900' : 'text-neutral-500 group-hover:text-neutral-800'}`}>
                      <DynamicIcon name={cat.icon} className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-xs whitespace-nowrap">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-0 z-10 w-7 h-7 rounded-full border border-neutral-300 bg-white shadow-md items-center justify-center text-neutral-700 hover:scale-105 transition cursor-pointer"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Controls: Filters Button & Tax Toggle */}
          <div className="flex items-center gap-3 flex-shrink-0">
            
            {/* Filters Trigger Button with Active Count Badge */}
            <button
              id="filter-modal-trigger-button"
              onClick={onOpenFilters}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer shadow-2xs ${
                activeFilterCount > 0
                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                  : 'border-neutral-300 hover:border-neutral-900 text-neutral-800 bg-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF385C] text-white flex items-center justify-center text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Display total before taxes toggle (signature Airbnb feature) */}
            <div className="hidden xl:flex items-center gap-3 border border-neutral-300 rounded-xl px-3.5 py-2">
              <span className="text-xs font-semibold text-neutral-800 whitespace-nowrap">Display total before taxes</span>
              <button
                id="toggle-tax-display"
                onClick={onToggleTotalBeforeTaxes}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  showTotalBeforeTaxes ? 'bg-neutral-900' : 'bg-neutral-300'
                }`}
                role="switch"
                aria-checked={showTotalBeforeTaxes}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showTotalBeforeTaxes ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
