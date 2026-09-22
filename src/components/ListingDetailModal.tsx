import React, { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Award,
  Building2,
  Key,
  Calculator,
  Phone,
  Mail,
  Clock,
  Car,
  Home,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { Listing } from '../types';
import { AMENITY_OPTIONS } from '../data/listings';
import { DynamicIcon } from './DynamicIcon';
import { CurrencyInfo, formatCurrency } from '../utils/currency';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  currentCurrency: CurrencyInfo;
  onShareToChat?: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isWishlisted,
  onToggleWishlist,
  currentCurrency,
  onShareToChat,
}) => {
  // Stay states
  const [nights, setNights] = useState(5);
  const [guestsCount, setGuestsCount] = useState(2);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Rental & Sale states
  const [activeActionTab, setActiveActionTab] = useState<'tour' | 'apply' | 'mortgage' | 'inquire'>('tour');
  const [tourDate, setTourDate] = useState('Tomorrow, 2:00 PM');
  const [tourConfirmed, setTourConfirmed] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Mortgage states
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [loanYears, setLoanYears] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);

  if (!listing) return null;

  // Stays calculation
  const basePrice = listing.pricePerNight * nights;
  const cleaningFee = Math.round(listing.pricePerNight * 0.28);
  const serviceFee = Math.round(basePrice * 0.12);
  const grandTotal = basePrice + cleaningFee + serviceFee;

  // Mortgage calculation
  const homePrice = listing.salePrice || 1000000;
  const downPaymentAmount = Math.round(homePrice * (downPaymentPct / 100));
  const principal = homePrice - downPaymentAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = loanYears * 12;
  const monthlyPrincipalAndInterest = Math.round(
    (principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
  ) || 0;
  const monthlyTax = Math.round((listing.propertyTaxAnnual || homePrice * 0.012) / 12);
  const monthlyHoa = listing.hoaFee || 0;
  const totalMonthlyMortgage = monthlyPrincipalAndInterest + monthlyTax + monthlyHoa;

  const handleReserve = () => {
    setBookingConfirmed(true);
    setTimeout(() => setBookingConfirmed(false), 4500);
  };

  const handleRequestTour = (e: React.FormEvent) => {
    e.preventDefault();
    setTourConfirmed(true);
    setTimeout(() => setTourConfirmed(false), 4500);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4500);
  };

  const handleApplyLease = (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationSubmitted(true);
    setTimeout(() => setApplicationSubmitted(false), 4500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Property link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[94vh] shadow-2xl flex flex-col overflow-hidden border border-neutral-200 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Action Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="close-listing-detail-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition cursor-pointer"
              title="Close detail"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-neutral-800 truncate hidden sm:inline">
              {listing.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {onShareToChat && (
              <button
                onClick={() => onShareToChat(listing)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-full transition cursor-pointer"
                title="Discuss this listing in Haven Community Chat"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#FF385C]" />
                <span>Ask Group</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={() => onToggleWishlist(listing.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-[#FF385C] text-[#FF385C]' : ''}`}
              />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* Header Title & Subheading */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {listing.intent === 'sale' && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Property For Sale
                </span>
              )}
              {listing.intent === 'rent' && (
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-blue-600" />
                  Apartment For Long-Term Rent
                </span>
              )}
              {listing.intent === 'stay' && (
                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-[#FF385C]" />
                  Vacation Stay
                </span>
              )}
              {listing.isGuestFavorite && (
                <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF385C]" />
                  Guest favourite
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {listing.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-sm text-neutral-600">
              <div className="flex items-center gap-1 font-semibold text-neutral-900">
                <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                <span>{listing.rating.toFixed(2)}</span>
                <span className="underline cursor-pointer font-medium ml-1">
                  ({listing.reviewCount} reviews)
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span className="font-medium text-neutral-800">
                  {listing.location.neighborhood ? `${listing.location.neighborhood}, ` : ''}
                  {listing.location.city}, {listing.location.country}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden max-h-[460px]">
            <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto h-full">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover hover:scale-102 transition duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden md:grid col-span-2 grid-cols-2 gap-3">
              {listing.images.slice(1, 5).map((img, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                  <img
                    src={img}
                    alt={`${listing.title} photo ${i + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Core Specs & Layout Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column: Details & Specs */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Host / Listing Agent Overview */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {listing.type} • {listing.location.city}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} • {listing.beds} bed{listing.beds > 1 ? 's' : ''} • {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
                    {listing.sqft ? ` • ${listing.sqft.toLocaleString()} sq ft` : ''}
                    {listing.maxGuests ? ` • Up to ${listing.maxGuests} occupants` : ''}
                  </p>
                  {listing.host.roleTitle && (
                    <p className="text-xs font-semibold text-neutral-500 mt-1">
                      Represented by: <span className="text-neutral-800">{listing.host.name}</span> ({listing.host.roleTitle})
                    </p>
                  )}
                </div>
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-neutral-100 flex-shrink-0">
                  <img
                    src={listing.host.avatar}
                    alt={listing.host.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Property Specs Table (Ideal for Rentals and Sales) */}
              {(listing.intent === 'rent' || listing.intent === 'sale') && (
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                  <h3 className="font-bold text-neutral-900 text-sm mb-3 uppercase tracking-wider text-xs">
                    Property Specifications & Terms
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    {listing.sqft && (
                      <div>
                        <span className="text-neutral-400 block font-medium">Total Area</span>
                        <span className="text-neutral-900 font-bold text-sm">{listing.sqft.toLocaleString()} sq ft</span>
                      </div>
                    )}
                    {listing.yearBuilt && (
                      <div>
                        <span className="text-neutral-400 block font-medium">Year Built</span>
                        <span className="text-neutral-900 font-bold text-sm">{listing.yearBuilt}</span>
                      </div>
                    )}
                    {listing.parkingSpaces !== undefined && (
                      <div>
                        <span className="text-neutral-400 block font-medium">Parking</span>
                        <span className="text-neutral-900 font-bold text-sm">{listing.parkingSpaces > 0 ? `${listing.parkingSpaces} assigned space` : 'Street parking'}</span>
                      </div>
                    )}
                    {listing.leaseTerm && (
                      <div>
                        <span className="text-neutral-400 block font-medium">Lease Term</span>
                        <span className="text-neutral-900 font-bold text-sm">{listing.leaseTerm}</span>
                      </div>
                    )}
                    {listing.deposit && (
                      <div>
                        <span className="text-neutral-400 block font-medium">Security Deposit</span>
                        <span className="text-neutral-900 font-bold text-sm">${listing.deposit.toLocaleString()}</span>
                      </div>
                    )}
                    {listing.hoaFee && (
                      <div>
                        <span className="text-neutral-400 block font-medium">HOA Monthly</span>
                        <span className="text-neutral-900 font-bold text-sm">${listing.hoaFee} / mo</span>
                      </div>
                    )}
                    {listing.furnishedStatus && (
                      <div>
                        <span className="text-neutral-400 block font-medium">Furnishing</span>
                        <span className="text-neutral-900 font-bold text-sm capitalize">{listing.furnishedStatus}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-neutral-400 block font-medium">Pet Policy</span>
                      <span className="text-neutral-900 font-bold text-sm">{listing.allowsPets ? 'Pets Welcomed' : 'No Pets'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Highlights & Guarantees */}
              <div className="space-y-4 pb-6 border-b border-neutral-200">
                <div className="flex gap-4">
                  <Award className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 text-sm">
                      {listing.intent === 'sale' ? 'Title deed verified' : listing.intent === 'rent' ? 'Verified property & landlord' : 'Top 5% of vacation homes'}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {listing.intent === 'sale'
                        ? 'Clear ownership history verified by licensed real estate legal counsel.'
                        : 'Property has undergone inspection for quality, safety, and operational standards.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-neutral-900 text-sm">Haven Buyer & Tenant Protection</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Every transaction is insured with escrow payment handling and verified move-in guarantees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 pb-6 border-b border-neutral-200">
                <h3 className="font-bold text-neutral-900 text-lg">About this property</h3>
                <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-4 pb-6 border-b border-neutral-200">
                <h3 className="font-bold text-neutral-900 text-lg">What this place offers</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {listing.amenities.map((amenityId) => {
                    const opt = AMENITY_OPTIONS.find((a) => a.id === amenityId);
                    if (!opt) return null;
                    return (
                      <div key={amenityId} className="flex items-center gap-3 text-sm text-neutral-700">
                        <DynamicIcon name={opt.icon} className="w-5 h-5 text-neutral-700" />
                        <span>{opt.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Reviews */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-neutral-900 text-neutral-900" />
                  <h3 className="font-bold text-neutral-900 text-lg">
                    {listing.rating.toFixed(2)} • {listing.reviewCount} reviews
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listing.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-9 h-9 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">{rev.author}</p>
                          <p className="text-[11px] text-neutral-500">{rev.date}</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-700 line-clamp-3 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Transaction Action Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-3xl p-6 border border-neutral-300 shadow-xl space-y-5">
                
                {/* 1. VACATION STAYS BOOKING WIDGET */}
                {listing.intent === 'stay' && (
                  <>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-neutral-900">
                          {formatCurrency(listing.pricePerNight, currentCurrency)}
                        </span>
                        <span className="text-neutral-500 text-sm font-normal"> / night</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900">
                        <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
                        <span>{listing.rating.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border border-neutral-300 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs">
                      <div className="grid grid-cols-2 divide-x divide-neutral-200">
                        <div className="p-2.5">
                          <label className="font-bold text-[10px] text-neutral-500 uppercase block">Check-in</label>
                          <input
                            type="date"
                            defaultValue="2026-10-14"
                            className="w-full text-xs font-semibold text-neutral-800 bg-transparent outline-hidden"
                          />
                        </div>
                        <div className="p-2.5">
                          <label className="font-bold text-[10px] text-neutral-500 uppercase block">Checkout</label>
                          <input
                            type="date"
                            defaultValue="2026-10-19"
                            className="w-full text-xs font-semibold text-neutral-800 bg-transparent outline-hidden"
                          />
                        </div>
                      </div>
                      <div className="p-2.5 flex items-center justify-between">
                        <div>
                          <label className="font-bold text-[10px] text-neutral-500 uppercase block">Guests</label>
                          <span className="font-semibold text-neutral-800">{guestsCount} guests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                            className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center font-bold text-neutral-700 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            onClick={() => setGuestsCount(Math.min(listing.maxGuests, guestsCount + 1))}
                            className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center font-bold text-neutral-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {bookingConfirmed ? (
                      <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-center space-y-1">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                        <p className="font-bold text-sm">Reservation Requested!</p>
                        <p className="text-xs text-emerald-700">Check your inbox for confirmation.</p>
                      </div>
                    ) : (
                      <button
                        id="reserve-action-button"
                        onClick={handleReserve}
                        className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold py-3.5 rounded-xl shadow-md transition cursor-pointer active:scale-98 text-sm"
                      >
                        Reserve stay
                      </button>
                    )}

                    <div className="space-y-2 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                      <div className="flex justify-between">
                        <span className="underline">{formatCurrency(listing.pricePerNight, currentCurrency)} x {nights} nights</span>
                        <span>{formatCurrency(basePrice, currentCurrency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="underline">Cleaning fee</span>
                        <span>{formatCurrency(cleaningFee, currentCurrency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="underline">Haven service fee</span>
                        <span>{formatCurrency(serviceFee, currentCurrency)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-neutral-900 pt-2 border-t border-neutral-200">
                        <span>Total</span>
                        <span>{formatCurrency(grandTotal, currentCurrency)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. APARTMENT LONG-TERM RENTAL ACTION WIDGET */}
                {listing.intent === 'rent' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-neutral-900">
                          {formatCurrency(listing.monthlyRent, currentCurrency)}
                        </span>
                        <span className="text-neutral-500 text-sm font-medium"> / month</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Deposit: {formatCurrency(listing.deposit, currentCurrency)} • {listing.leaseTerm}
                      </p>
                    </div>

                    {/* Action Selector: Tour vs Apply */}
                    <div className="flex rounded-xl bg-neutral-100 p-1 text-xs font-bold text-neutral-600">
                      <button
                        onClick={() => setActiveActionTab('tour')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          activeActionTab === 'tour' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
                        }`}
                      >
                        Schedule a Tour
                      </button>
                      <button
                        onClick={() => setActiveActionTab('apply')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          activeActionTab === 'apply' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
                        }`}
                      >
                        Apply Online
                      </button>
                    </div>

                    {activeActionTab === 'tour' && (
                      <form onSubmit={handleRequestTour} className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-neutral-700 block mb-1">
                            Select Tour Type & Date
                          </label>
                          <select
                            value={tourDate}
                            onChange={(e) => setTourDate(e.target.value)}
                            className="w-full text-xs font-medium border border-neutral-300 rounded-xl p-2.5 bg-white text-neutral-800"
                          >
                            <option value="Tomorrow, 2:00 PM">Tomorrow at 2:00 PM (In-person)</option>
                            <option value="Tomorrow, 5:30 PM">Tomorrow at 5:30 PM (In-person)</option>
                            <option value="Saturday, 11:00 AM">Saturday at 11:00 AM (Open House)</option>
                            <option value="Virtual Live Video Tour">Live Video Walkthrough (Zoom)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-neutral-700 block mb-1">
                            Your Contact Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            required
                            className="w-full text-xs border border-neutral-300 rounded-xl p-2.5"
                          />
                        </div>

                        {tourConfirmed ? (
                          <div className="bg-blue-50 border border-blue-300 text-blue-900 p-3 rounded-xl text-center text-xs font-bold">
                            Tour Confirmed for {tourDate}! An agent will contact you shortly.
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition cursor-pointer"
                          >
                            Confirm Free Tour Appointment
                          </button>
                        )}
                      </form>
                    )}

                    {activeActionTab === 'apply' && (
                      <form onSubmit={handleApplyLease} className="space-y-3 text-xs">
                        <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1">
                          <p className="font-bold text-neutral-800 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            Pre-Lease Requirements
                          </p>
                          <p className="text-neutral-500 text-[11px]">
                            • Proof of 3x monthly income or guarantor<br />
                            • Government issued photo ID<br />
                            • Standard tenant credit check
                          </p>
                        </div>

                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">Target Move-in Date</label>
                          <input type="date" defaultValue="2026-10-01" className="w-full border border-neutral-300 rounded-xl p-2" />
                        </div>

                        {applicationSubmitted ? (
                          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-center font-bold">
                            Application Started! Form link dispatched to your email.
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 rounded-xl transition cursor-pointer"
                          >
                            Submit Online Rental Application
                          </button>
                        )}
                      </form>
                    )}

                    {listing.host.phone && (
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                        <span className="flex items-center gap-1 font-medium text-neutral-700">
                          <Phone className="w-3.5 h-3.5 text-blue-600" />
                          {listing.host.phone}
                        </span>
                        <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full">
                          Lic. {listing.host.licenseNumber || 'Active'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PROPERTY FOR SALE WIDGET */}
                {listing.intent === 'sale' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-neutral-400 text-xs font-bold uppercase tracking-wider block">List Price</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-neutral-900">
                          {formatCurrency(listing.salePrice, currentCurrency)}
                        </span>
                        {listing.sqft && (
                          <span className="text-neutral-500 text-xs font-semibold">
                            {formatCurrency(Math.round((listing.salePrice || 0) / listing.sqft), currentCurrency)} / sq ft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Selector: Mortgage vs Viewing */}
                    <div className="flex rounded-xl bg-neutral-100 p-1 text-xs font-bold text-neutral-600">
                      <button
                        onClick={() => setActiveActionTab('mortgage')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          activeActionTab === 'mortgage' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
                        }`}
                      >
                        Mortgage Calculator
                      </button>
                      <button
                        onClick={() => setActiveActionTab('inquire')}
                        className={`flex-1 py-1.5 rounded-lg transition ${
                          activeActionTab === 'inquire' ? 'bg-white text-neutral-900 shadow-xs' : 'hover:text-neutral-900'
                        }`}
                      >
                        Private Viewing
                      </button>
                    </div>

                    {activeActionTab === 'mortgage' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
                          <span className="text-[11px] text-emerald-800 font-semibold block">Est. Total Monthly Payment</span>
                          <span className="text-2xl font-black text-emerald-950 block mt-0.5">
                            {formatCurrency(totalMonthlyMortgage, currentCurrency)}
                            <span className="text-xs font-normal text-emerald-800"> / mo</span>
                          </span>
                          <div className="mt-2 text-[11px] text-emerald-800 divide-y divide-emerald-200/60">
                            <div className="flex justify-between py-0.5">
                              <span>Principal & Interest:</span>
                              <span className="font-bold">{formatCurrency(monthlyPrincipalAndInterest, currentCurrency)}</span>
                            </div>
                            <div className="flex justify-between py-0.5">
                              <span>Property Taxes:</span>
                              <span className="font-bold">{formatCurrency(monthlyTax, currentCurrency)}</span>
                            </div>
                            {listing.hoaFee && (
                              <div className="flex justify-between py-0.5">
                                <span>HOA Dues:</span>
                                <span className="font-bold">{formatCurrency(listing.hoaFee, currentCurrency)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Sliders */}
                        <div>
                          <div className="flex justify-between text-neutral-700 font-semibold mb-1 text-[11px]">
                            <span>Down Payment: {downPaymentPct}%</span>
                            <span>{formatCurrency(downPaymentAmount, currentCurrency)}</span>
                          </div>
                          <div className="flex gap-2">
                            {[10, 20, 30].map(pct => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => setDownPaymentPct(pct)}
                                className={`flex-1 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                                  downPaymentPct === pct ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700'
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-neutral-700 font-semibold mb-1 text-[11px]">
                            <span>Interest Rate</span>
                            <span>{interestRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="4.0"
                            max="9.0"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                            className="w-full accent-neutral-900"
                          />
                        </div>
                      </div>
                    )}

                    {activeActionTab === 'inquire' && (
                      <form onSubmit={handleSendInquiry} className="space-y-3 text-xs">
                        <div>
                          <label className="text-neutral-700 font-semibold block mb-1">Your Full Name</label>
                          <input type="text" required placeholder="e.g. Eleanor Vance" className="w-full border border-neutral-300 rounded-xl p-2" />
                        </div>
                        <div>
                          <label className="text-neutral-700 font-semibold block mb-1">Direct Phone or Email</label>
                          <input type="text" required placeholder="name@domain.com" className="w-full border border-neutral-300 rounded-xl p-2" />
                        </div>
                        <div>
                          <label className="text-neutral-700 font-semibold block mb-1">Financing Status</label>
                          <select className="w-full border border-neutral-300 rounded-xl p-2 bg-white text-neutral-800">
                            <option>Pre-Approved Mortgage</option>
                            <option>All-Cash Buyer</option>
                            <option>Exploring Financing</option>
                          </select>
                        </div>

                        {inquirySent ? (
                          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-center font-bold">
                            Viewing Request Received! Listing agent will reach out in &lt;1 hour.
                          </div>
                        ) : (
                          <button
                            type="submit"
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition cursor-pointer"
                          >
                            Schedule Private Viewing
                          </button>
                        )}
                      </form>
                    )}

                    {listing.host.phone && (
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                        <span className="flex items-center gap-1 font-medium text-neutral-700">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {listing.host.phone}
                        </span>
                        <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-full">
                          Lic. {listing.host.licenseNumber || 'Verified'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
