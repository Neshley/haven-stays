import React from 'react';
import { X, Heart, Star, Trash2 } from 'lucide-react';
import { Listing } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedListings: Listing[];
  onRemoveFromWishlist: (id: string) => void;
  onSelectListing: (listing: Listing) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedListings,
  onRemoveFromWishlist,
  onSelectListing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#FF385C] text-[#FF385C]" />
            <h2 className="font-bold text-lg text-neutral-900">Your Wishlists ({wishlistedListings.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto divide-y divide-neutral-100">
          {wishlistedListings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-neutral-800 text-base">Your wishlist is empty</h3>
              <p className="text-neutral-500 text-xs max-w-xs mx-auto">
                As you search, click the heart icon on any stay to save your favorite destinations for later.
              </p>
            </div>
          ) : (
            wishlistedListings.map((listing) => (
              <div
                key={listing.id}
                className="py-4 flex items-center justify-between gap-4 group cursor-pointer hover:bg-neutral-50/60 rounded-2xl p-2 transition"
                onClick={() => {
                  onSelectListing(listing);
                  onClose();
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-neutral-900 text-sm truncate">{listing.title}</h4>
                    <p className="text-neutral-500 text-xs truncate">{listing.location.city}, {listing.location.country}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-neutral-900 text-xs">${listing.pricePerNight} / night</span>
                      <span>•</span>
                      <div className="flex items-center gap-0.5 text-xs text-neutral-700">
                        <Star className="w-3 h-3 fill-neutral-900 text-neutral-900" />
                        <span>{listing.rating.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(listing.id);
                  }}
                  className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition flex-shrink-0"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
