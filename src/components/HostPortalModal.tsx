import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Building2,
  Key,
  Home,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  ExternalLink,
  DollarSign,
  MapPin,
  Sparkles,
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
  Check,
  AlertCircle,
  MessageSquare,
  Image as ImageIcon,
  ChevronDown,
  Info,
  Layers,
} from 'lucide-react';
import { Listing, ListingIntent, ListingStatus, PropertyType } from '../types';
import { AMENITY_OPTIONS, CATEGORIES } from '../data/listings';
import { CurrencyInfo, formatCurrency } from '../utils/currency';

interface HostPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onAddListing: (newListing: Listing) => void;
  onUpdateListing: (updatedListing: Listing) => void;
  onDeleteListing: (listingId: string) => void;
  onSelectListingToPreview: (listing: Listing) => void;
  onShareToChat?: (listing: Listing) => void;
  currentCurrency: CurrencyInfo;
  initialEditListingId?: string | null;
}

// Curated high-res photos for quick selection when adding properties
const PHOTO_PRESETS = [
  {
    label: 'Modern Luxury Apartment',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Downtown High-Rise Loft',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Waterfront Penthouse',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Tribeca Architectural Flat',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Minimalist Nordic Studio',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Coastal Mediterranean Villa',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  },
];

export const HostPortalModal: React.FC<HostPortalModalProps> = ({
  isOpen,
  onClose,
  listings,
  onAddListing,
  onUpdateListing,
  onDeleteListing,
  onSelectListingToPreview,
  onShareToChat,
  currentCurrency,
  initialEditListingId,
}) => {
  const [activeTab, setActiveTab] = useState<'my-listings' | 'create'>('my-listings');
  const [filterIntent, setFilterIntent] = useState<'all' | ListingIntent>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | ListingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Adding / Editing Listing
  const [formIntent, setFormIntent] = useState<ListingIntent>('rent');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPropertyType, setFormPropertyType] = useState<PropertyType>('apartment');
  const [formCategory, setFormCategory] = useState('apartments');
  const [formStatus, setFormStatus] = useState<ListingStatus>('available');

  // Location
  const [formCity, setFormCity] = useState('');
  const [formRegion, setFormRegion] = useState('');
  const [formCountry, setFormCountry] = useState('United States');
  const [formNeighborhood, setFormNeighborhood] = useState('');

  // Financials
  const [formPricePerNight, setFormPricePerNight] = useState(250);
  const [formMonthlyRent, setFormMonthlyRent] = useState(3200);
  const [formDeposit, setFormDeposit] = useState(3200);
  const [formLeaseTerm, setFormLeaseTerm] = useState('12-Month Lease');
  const [formFurnishedStatus, setFormFurnishedStatus] = useState<'furnished' | 'unfurnished' | 'flexible'>('furnished');

  const [formSalePrice, setFormSalePrice] = useState(950000);
  const [formSqft, setFormSqft] = useState(1200);
  const [formHoaFee, setFormHoaFee] = useState(450);
  const [formYearBuilt, setFormYearBuilt] = useState(2021);

  // Specs
  const [formBedrooms, setFormBedrooms] = useState(2);
  const [formBeds, setFormBeds] = useState(2);
  const [formBathrooms, setFormBathrooms] = useState(2);
  const [formMaxGuests, setFormMaxGuests] = useState(4);
  const [formAmenities, setFormAmenities] = useState<string[]>([
    'High-speed Wifi',
    'Dedicated workspace',
    'In-unit Washer & Dryer',
    'Air conditioning',
  ]);
  const [formImages, setFormImages] = useState<string[]>([PHOTO_PRESETS[0].url]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Host Info
  const [formHostName, setFormHostName] = useState('Haven Landlord Services');
  const [formHostRole, setFormHostRole] = useState('Property Owner & Landlord');
  const [formHostPhone, setFormHostPhone] = useState('+1 (555) 234-5678');

  // Load editing listing if initialEditListingId provided
  React.useEffect(() => {
    if (initialEditListingId) {
      const found = listings.find((l) => l.id === initialEditListingId);
      if (found) {
        startEditing(found);
      }
    }
  }, [initialEditListingId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startEditing = (listing: Listing) => {
    setEditingListing(listing);
    setFormIntent(listing.intent);
    setFormTitle(listing.title);
    setFormSubtitle(listing.subtitle || '');
    setFormDescription(listing.description || '');
    setFormPropertyType(listing.propertyType || 'apartment');
    setFormCategory(listing.category || 'apartments');
    setFormStatus(listing.status || 'available');

    setFormCity(listing.location.city);
    setFormRegion(listing.location.region);
    setFormCountry(listing.location.country);
    setFormNeighborhood(listing.location.neighborhood || '');

    setFormPricePerNight(listing.pricePerNight || 250);
    setFormMonthlyRent(listing.monthlyRent || 3200);
    setFormDeposit(listing.deposit || listing.monthlyRent || 3200);
    setFormLeaseTerm(listing.leaseTerm || '12-Month Lease');
    setFormFurnishedStatus(listing.furnishedStatus || 'furnished');

    setFormSalePrice(listing.salePrice || 950000);
    setFormSqft(listing.sqft || 1200);
    setFormHoaFee(listing.hoaFee || 450);
    setFormYearBuilt(listing.yearBuilt || 2021);

    setFormBedrooms(listing.bedrooms);
    setFormBeds(listing.beds || listing.bedrooms);
    setFormBathrooms(listing.bathrooms);
    setFormMaxGuests(listing.maxGuests || 4);
    setFormAmenities(listing.amenities || []);
    setFormImages(listing.images && listing.images.length > 0 ? listing.images : [PHOTO_PRESETS[0].url]);

    setFormHostName(listing.host.name);
    setFormHostRole(listing.host.roleTitle || 'Property Host');
    setFormHostPhone(listing.host.phone || '');

    setActiveTab('create');
  };

  const resetForm = () => {
    setEditingListing(null);
    setFormIntent('rent');
    setFormTitle('');
    setFormSubtitle('');
    setFormDescription('');
    setFormPropertyType('apartment');
    setFormCategory('apartments');
    setFormStatus('available');
    setFormCity('');
    setFormRegion('');
    setFormNeighborhood('');
    setFormMonthlyRent(3200);
    setFormSalePrice(950000);
    setFormPricePerNight(250);
    setFormImages([PHOTO_PRESETS[0].url]);
    setFormAmenities(['High-speed Wifi', 'Dedicated workspace', 'In-unit Washer & Dryer']);
  };

  const handleToggleAmenity = (name: string) => {
    setFormAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleAddPhotoUrl = () => {
    if (customImageUrl.trim()) {
      setFormImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleSelectPhotoPreset = (url: string) => {
    if (!formImages.includes(url)) {
      setFormImages((prev) => [...prev, url]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formCity.trim()) {
      showToast('Please provide at least a property title and city.');
      return;
    }

    const listingImages = formImages.length > 0 ? formImages : [PHOTO_PRESETS[0].url];

    const listingData: Listing = {
      id: editingListing ? editingListing.id : `${formIntent}-${Date.now()}`,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || `${formPropertyType.toUpperCase()} in ${formCity}`,
      description: formDescription.trim() || `Modern, beautifully maintained ${formPropertyType} located in ${formCity}.`,
      type: `${formPropertyType.charAt(0).toUpperCase() + formPropertyType.slice(1)} in ${formCity}`,
      propertyType: formPropertyType,
      category: formCategory,
      intent: formIntent,
      status: formStatus,
      managedByCurrentUser: true,
      location: {
        city: formCity.trim(),
        region: formRegion.trim() || formCity.trim(),
        country: formCountry.trim(),
        neighborhood: formNeighborhood.trim() || undefined,
        lat: editingListing ? editingListing.location.lat : 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: editingListing ? editingListing.location.lng : -74.006 + (Math.random() - 0.5) * 0.1,
      },
      pricePerNight: Number(formPricePerNight) || 250,
      monthlyRent: formIntent === 'rent' ? Number(formMonthlyRent) : undefined,
      deposit: formIntent === 'rent' ? Number(formDeposit) : undefined,
      leaseTerm: formIntent === 'rent' ? formLeaseTerm : undefined,
      furnishedStatus: formIntent === 'rent' ? formFurnishedStatus : undefined,
      salePrice: formIntent === 'sale' ? Number(formSalePrice) : undefined,
      sqft: Number(formSqft) || 1000,
      hoaFee: formIntent === 'sale' ? Number(formHoaFee) : undefined,
      yearBuilt: Number(formYearBuilt) || 2022,
      rating: editingListing ? editingListing.rating : 4.95,
      reviewCount: editingListing ? editingListing.reviewCount : 8,
      isGuestFavorite: editingListing ? editingListing.isGuestFavorite : true,
      isSuperhost: true,
      images: listingImages,
      bedrooms: Number(formBedrooms) || 1,
      beds: Number(formBeds) || 1,
      bathrooms: Number(formBathrooms) || 1,
      maxGuests: Number(formMaxGuests) || 2,
      amenities: formAmenities,
      instantBook: true,
      selfCheckIn: true,
      allowsPets: formAmenities.includes('Pet friendly'),
      availableDates: 'Available year-round',
      host: {
        name: formHostName.trim() || 'Verified Host',
        avatar: editingListing ? editingListing.host.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        joinedDate: editingListing ? editingListing.host.joinedDate : 'Host since 2023',
        responseRate: '100%',
        isSuperhost: true,
        tagline: 'Committed to outstanding guest and tenant service',
        roleTitle: formHostRole,
        phone: formHostPhone,
      },
      reviews: editingListing ? editingListing.reviews : [],
    };

    if (editingListing) {
      onUpdateListing(listingData);
      showToast(`Updated "${listingData.title}" successfully.`);
    } else {
      onAddListing(listingData);
      showToast(`Published "${listingData.title}" to Haven!`);
    }

    resetForm();
    setActiveTab('my-listings');
  };

  // Quick Status Toggle: e.g. Landlord marks apartment as Taken
  const handleQuickStatusChange = (listing: Listing, newStatus: ListingStatus) => {
    const updated: Listing = {
      ...listing,
      status: newStatus,
      managedByCurrentUser: true,
    };
    onUpdateListing(updated);

    const statusLabels = {
      taken: listing.intent === 'rent' ? 'Marked as Taken / Leased' : listing.intent === 'sale' ? 'Marked as Sold' : 'Marked as Booked',
      available: 'Marked as Available',
      pending: 'Marked as Application Pending',
    };
    showToast(`${statusLabels[newStatus]} for "${listing.title}".`);
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    if (filterIntent !== 'all' && item.intent !== filterIntent) return false;
    const currentStatus = item.status || 'available';
    if (filterStatus !== 'all' && currentStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.location.city.toLowerCase().includes(q) ||
        item.location.country.toLowerCase().includes(q) ||
        (item.location.neighborhood && item.location.neighborhood.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Analytics Metrics
  const totalCount = listings.length;
  const availableCount = listings.filter((l) => (l.status || 'available') === 'available').length;
  const takenCount = listings.filter((l) => l.status === 'taken').length;
  const pendingCount = listings.filter((l) => l.status === 'pending').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-neutral-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-neutral-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF385C] text-white flex items-center justify-center shadow-md shadow-rose-500/20 flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                  Host & Landlord Portal
                </h2>
                <span className="bg-rose-100 text-[#FF385C] text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Property Manager
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Manage listings, update occupancy status (taken/leased/sold), and list new apartments or homes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View / Add Tabs */}
            <div className="flex bg-neutral-200/80 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab('my-listings');
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'my-listings'
                    ? 'bg-white text-neutral-900 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                All Properties ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab('create');
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'create'
                    ? 'bg-[#FF385C] text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{editingListing ? 'Edit Property' : 'List New Property'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              title="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: ALL PROPERTIES & STATUS MANAGER */}
          {activeTab === 'my-listings' && (
            <div className="space-y-6">
              
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                    Total Properties
                  </div>
                  <div className="text-2xl font-black text-neutral-900 mt-1">{totalCount}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Vacation, rentals & sales</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Available</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{availableCount}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Ready for guests/tenants</div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                  <div className="text-[11px] font-bold text-[#FF385C] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
                    <span>Taken / Leased / Sold</span>
                  </div>
                  <div className="text-2xl font-black text-rose-950 mt-1">{takenCount}</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">Occupied or finalized</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Under Contract</span>
                  </div>
                  <div className="text-2xl font-black text-amber-950 mt-1">{pendingCount}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">Application in review</div>
                </div>
              </div>

              {/* Filters & Search Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-neutral-200 shadow-2xs">
                {/* Search query input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your properties by title, city, or neighborhood..."
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#FF385C]"
                  />
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Filter Intent */}
                  <div className="flex items-center gap-1 text-xs bg-neutral-100 p-1 rounded-xl">
                    <button
                      onClick={() => setFilterIntent('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterIntent === 'all' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterIntent('rent')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterIntent === 'rent' ? 'bg-blue-600 text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      Rentals
                    </button>
                    <button
                      onClick={() => setFilterIntent('stay')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterIntent === 'stay' ? 'bg-rose-600 text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      Stays
                    </button>
                    <button
                      onClick={() => setFilterIntent('sale')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterIntent === 'sale' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      For Sale
                    </button>
                  </div>

                  {/* Filter Status */}
                  <div className="flex items-center gap-1 text-xs bg-neutral-100 p-1 rounded-xl">
                    <button
                      onClick={() => setFilterStatus('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterStatus === 'all' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500'
                      }`}
                    >
                      Any Status
                    </button>
                    <button
                      onClick={() => setFilterStatus('available')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterStatus === 'available' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => setFilterStatus('taken')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        filterStatus === 'taken' ? 'bg-rose-600 text-white shadow-2xs' : 'text-neutral-500'
                      }`}
                    >
                      Taken
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Cards List */}
              {filteredListings.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <Building2 className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-neutral-800">No properties match your filter</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try adjusting your filters or click "+ List New Property" to add a new apartment or stay.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredListings.map((listing) => {
                    const status = listing.status || 'available';
                    const isTaken = status === 'taken';
                    const isPending = status === 'pending';

                    return (
                      <div
                        key={listing.id}
                        className={`rounded-2xl border transition-all p-4 flex flex-col justify-between gap-4 bg-white hover:shadow-md ${
                          isTaken
                            ? 'border-rose-200/90 bg-rose-50/10'
                            : isPending
                            ? 'border-amber-200/90 bg-amber-50/10'
                            : 'border-neutral-200'
                        }`}
                      >
                        <div className="flex gap-3.5">
                          {/* Thumbnail photo */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden relative flex-shrink-0 bg-neutral-100">
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className={`w-full h-full object-cover transition duration-300 ${
                                isTaken ? 'grayscale-40 contrast-90' : ''
                              }`}
                            />
                            {/* Intent tag overlay */}
                            <span
                              className={`absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider text-white ${
                                listing.intent === 'rent'
                                  ? 'bg-blue-600'
                                  : listing.intent === 'sale'
                                  ? 'bg-emerald-600'
                                  : 'bg-[#FF385C]'
                              }`}
                            >
                              {listing.intent === 'rent'
                                ? 'Rental'
                                : listing.intent === 'sale'
                                ? 'Sale'
                                : 'Stay'}
                            </span>
                          </div>

                          {/* Property Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-extrabold text-sm text-neutral-900 truncate" title={listing.title}>
                                {listing.title}
                              </h4>
                            </div>

                            <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                              <span>
                                {listing.location.city}
                                {listing.location.neighborhood ? `, ${listing.location.neighborhood}` : ''}
                              </span>
                            </div>

                            {/* Pricing specs */}
                            <div className="mt-2 flex items-baseline gap-2">
                              {listing.intent === 'rent' && listing.monthlyRent && (
                                <div className="text-sm font-black text-neutral-900">
                                  {formatCurrency(listing.monthlyRent, currentCurrency)}
                                  <span className="text-xs font-normal text-neutral-500">/month</span>
                                </div>
                              )}
                              {listing.intent === 'sale' && listing.salePrice && (
                                <div className="text-sm font-black text-neutral-900">
                                  {formatCurrency(listing.salePrice, currentCurrency)}
                                  <span className="text-[10px] font-normal text-neutral-500"> (Freehold)</span>
                                </div>
                              )}
                              {listing.intent === 'stay' && (
                                <div className="text-sm font-black text-neutral-900">
                                  {formatCurrency(listing.pricePerNight, currentCurrency)}
                                  <span className="text-xs font-normal text-neutral-500">/night</span>
                                </div>
                              )}
                            </div>

                            {/* Rooms / Sqft */}
                            <div className="mt-1 flex items-center gap-3 text-[11px] text-neutral-600 font-medium">
                              <span>{listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}</span>
                              <span>•</span>
                              <span>{listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}</span>
                              {listing.sqft && (
                                <>
                                  <span>•</span>
                                  <span>{listing.sqft} sq ft</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status Bar & Quick Actions */}
                        <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          {/* Current Status Pill with 1-Click Toggle */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-neutral-500">Status:</span>
                            <div className="inline-flex rounded-lg p-0.5 bg-neutral-100 border border-neutral-200/80 text-[11px] font-extrabold">
                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(listing, 'available')}
                                className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                                  status === 'available'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Available</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(listing, 'taken')}
                                className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                                  status === 'taken'
                                    ? 'bg-[#FF385C] text-white shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                                title="Mark as taken, leased, or sold"
                              >
                                <span className="w-2 h-2 rounded-full bg-current" />
                                <span>{listing.intent === 'sale' ? 'Sold' : 'Taken / Leased'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleQuickStatusChange(listing, 'pending')}
                                className={`px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                                  status === 'pending'
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                <span>Pending</span>
                              </button>
                            </div>
                          </div>

                          {/* Secondary actions: Edit, View Live, Delete */}
                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => startEditing(listing)}
                              className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-100 rounded-lg transition cursor-pointer flex items-center gap-1 border border-neutral-200"
                              title="Edit all property details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onSelectListingToPreview(listing);
                              }}
                              className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
                              title="View listing page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            {onShareToChat && (
                              <button
                                type="button"
                                onClick={() => {
                                  onShareToChat(listing);
                                  showToast(`Shared "${listing.title}" into Haven Community Chat.`);
                                }}
                                className="p-1.5 text-[#FF385C] hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Share into Community Chat"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setListingToDelete(listing)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CREATE OR EDIT PROPERTY FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleSaveListing} className="space-y-6 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-200 gap-3">
                <div>
                  <h3 className="text-lg font-black text-neutral-900">
                    {editingListing ? `Editing: ${editingListing.title}` : 'List a New Property on Haven'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Fill in property specifics for vacation stays, apartment rentals, or real estate sales.
                  </p>
                </div>

                {editingListing && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setListingToDelete(editingListing)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-98 shadow-2xs"
                      title="Permanently delete this property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Property</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer font-medium"
                    >
                      Cancel Editing
                    </button>
                  </div>
                )}
              </div>

              {/* Step 1: Choose Property Intent */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-3">
                <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider">
                  1. Transaction Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormIntent('rent')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      formIntent === 'rent'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <Key className={`w-5 h-5 mt-0.5 ${formIntent === 'rent' ? 'text-blue-600' : 'text-neutral-400'}`} />
                    <div>
                      <div className="font-extrabold text-sm">Long-term Rental</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">Apartment leases, studios & flatshares</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormIntent('sale')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      formIntent === 'sale'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mt-0.5 ${formIntent === 'sale' ? 'text-emerald-600' : 'text-neutral-400'}`} />
                    <div>
                      <div className="font-extrabold text-sm">Property For Sale</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">Freehold homes, condos & investments</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormIntent('stay')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      formIntent === 'stay'
                        ? 'border-[#FF385C] bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <Home className={`w-5 h-5 mt-0.5 ${formIntent === 'stay' ? 'text-[#FF385C]' : 'text-neutral-400'}`} />
                    <div>
                      <div className="font-extrabold text-sm">Vacation Stay</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">Nightly booking, villas & chalets</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Modern High-Rise Loft with Panoramic City Views"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="e.g. Designer 2-bedroom in Manhattan's historic district"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={formPropertyType}
                    onChange={(e) => setFormPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C] bg-white cursor-pointer"
                  >
                    <option value="apartment">Apartment / Condo</option>
                    <option value="house">House / Townhouse</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="cabin">Cabin / Chalet</option>
                    <option value="guesthouse">Guesthouse</option>
                    <option value="hotel">Boutique Hotel</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe the unit layout, nearby transit, sunlight, finishes, and building amenities..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>
              </div>

              {/* Step 3: Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. New York"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Neighborhood / District
                  </label>
                  <input
                    type="text"
                    value={formNeighborhood}
                    onChange={(e) => setFormNeighborhood(e.target.value)}
                    placeholder="e.g. Greenwich Village"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>
              </div>

              {/* Step 4: Pricing & Lease Specifics */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <div className="font-black text-xs text-neutral-800 uppercase tracking-wider">
                  Pricing & Financial Terms ({formIntent.toUpperCase()})
                </div>

                {formIntent === 'rent' && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Monthly Rent ($ USD) *
                      </label>
                      <input
                        type="number"
                        min={100}
                        required
                        value={formMonthlyRent}
                        onChange={(e) => setFormMonthlyRent(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Security Deposit ($ USD)
                      </label>
                      <input
                        type="number"
                        value={formDeposit}
                        onChange={(e) => setFormDeposit(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Lease Term
                      </label>
                      <input
                        type="text"
                        value={formLeaseTerm}
                        onChange={(e) => setFormLeaseTerm(e.target.value)}
                        placeholder="e.g. 12-Month Lease"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Furnishing
                      </label>
                      <select
                        value={formFurnishedStatus}
                        onChange={(e) => setFormFurnishedStatus(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C] bg-white cursor-pointer"
                      >
                        <option value="furnished">Fully Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                        <option value="flexible">Flexible Options</option>
                      </select>
                    </div>
                  </div>
                )}

                {formIntent === 'sale' && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Asking Sale Price ($ USD) *
                      </label>
                      <input
                        type="number"
                        min={10000}
                        required
                        value={formSalePrice}
                        onChange={(e) => setFormSalePrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Interior Sq Ft
                      </label>
                      <input
                        type="number"
                        value={formSqft}
                        onChange={(e) => setFormSqft(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        HOA Fee ($/month)
                      </label>
                      <input
                        type="number"
                        value={formHoaFee}
                        onChange={(e) => setFormHoaFee(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Year Built
                      </label>
                      <input
                        type="number"
                        value={formYearBuilt}
                        onChange={(e) => setFormYearBuilt(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>
                  </div>
                )}

                {formIntent === 'stay' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Nightly Price ($ USD) *
                      </label>
                      <input
                        type="number"
                        min={10}
                        required
                        value={formPricePerNight}
                        onChange={(e) => setFormPricePerNight(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Max Guest Capacity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formMaxGuests}
                        onChange={(e) => setFormMaxGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 5: Rooms, Beds & Initial Availability Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Beds
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formBeds}
                    onChange={(e) => setFormBeds(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ListingStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C] bg-white cursor-pointer"
                  >
                    <option value="available">Available (Active)</option>
                    <option value="taken">Taken / Leased / Sold</option>
                    <option value="pending">Application Pending</option>
                  </select>
                </div>
              </div>

              {/* Step 6: Amenities Checklist */}
              <div>
                <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider mb-2">
                  Key Amenities & Features
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AMENITY_OPTIONS.slice(0, 12).map((amenity) => {
                    const isChecked = formAmenities.includes(amenity.name);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity.name)}
                        className={`p-2 rounded-xl text-left text-xs font-medium border transition flex items-center gap-2 cursor-pointer ${
                          isChecked
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-2xs'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${isChecked ? 'text-white' : 'text-transparent'}`} />
                        <span className="truncate">{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 7: Photos & Presets */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <label className="block text-xs font-black text-neutral-800 uppercase tracking-wider">
                  Property Photos ({formImages.length})
                </label>

                {/* Preset Fast Picker */}
                <div>
                  <span className="text-[11px] text-neutral-500 mb-2 block">
                    Pick from curated high-resolution photography or paste your own image URLs:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_PRESETS.map((preset) => {
                      const isAdded = formImages.includes(preset.url);
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleSelectPhotoPreset(preset.url)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                            isAdded
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                              : 'border-neutral-300 bg-white hover:border-neutral-400'
                          }`}
                        >
                          {isAdded && <Check className="w-3 h-3 text-emerald-600" />}
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Photo URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or any photo URL"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-[#FF385C]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Thumbnails list */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full p-1 transition cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Host / Landlord Name
                  </label>
                  <input
                    type="text"
                    value={formHostName}
                    onChange={(e) => setFormHostName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#FF385C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Host Role / Title
                  </label>
                  <input
                    type="text"
                    value={formHostRole}
                    onChange={(e) => setFormHostRole(e.target.value)}
                    placeholder="e.g. Property Owner, Licensed Agent"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Contact Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formHostPhone}
                    onChange={(e) => setFormHostPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              {/* Submit & Delete Buttons */}
              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                {editingListing ? (
                  <button
                    id="edit-form-delete-button"
                    type="button"
                    onClick={() => setListingToDelete(editingListing)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-98 shadow-xs"
                    title="Permanently remove this listing from Haven"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Delete This Property</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('my-listings');
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    id="save-property-submit-button"
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingListing ? 'Save Changes' : 'Publish Property to Haven'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* In-App Delete Confirmation Modal (Safe for iframes, no window.confirm dependency) */}
      {listingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-black text-neutral-900">Delete Property Listing?</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-neutral-900">"{listingToDelete.title}"</strong>? This will remove it from your properties and all public search results. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                id="cancel-delete-property-button"
                type="button"
                onClick={() => setListingToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-property-button"
                type="button"
                onClick={() => {
                  const id = listingToDelete.id;
                  const title = listingToDelete.title;
                  onDeleteListing(id);
                  setListingToDelete(null);
                  if (editingListing && editingListing.id === id) {
                    resetForm();
                    setActiveTab('my-listings');
                  }
                  showToast(`"${title}" was permanently removed.`);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-98"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Listing</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
