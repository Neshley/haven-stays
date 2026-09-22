import React, { useState } from 'react';
import { Globe, Heart, ShieldCheck, HelpCircle, X, CheckCircle2, FileText, Lock, Users, Sparkles, Building2, Phone } from 'lucide-react';
import { CurrencyInfo } from '../utils/currency';

interface FooterProps {
  currentCurrency?: CurrencyInfo;
  onOpenCurrencyModal?: () => void;
  onOpenLandingPage?: () => void;
  onOpenHostPortal?: () => void;
}

interface FooterModalContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
  currentCurrency,
  onOpenCurrencyModal,
  onOpenLandingPage,
  onOpenHostPortal,
}) => {
  const [activeInfoSection, setActiveInfoSection] = useState<string | null>(null);

  const getSectionContent = (sectionKey: string): FooterModalContent => {
    switch (sectionKey) {
      case 'help':
        return {
          title: 'Haven Help Centre',
          category: 'Support & Guest Services',
          body: (
            <div className="space-y-4 text-xs text-neutral-600">
              <p className="leading-relaxed">
                Our global support team is available 24 hours a day, 7 days a week to help with reservations, lease questions, or inquiries.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#FF385C]" />
                    <span>Emergency Guest Assistance</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">+1 (800) 428-3678 (Toll-Free)</p>
                </div>
                <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-1">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Help Desk & Chat</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">support@havenstays.com</p>
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <h5 className="font-bold text-neutral-800">Frequently Asked Questions</h5>
                <details className="border border-neutral-200 rounded-xl p-3">
                  <summary className="font-semibold text-neutral-800 cursor-pointer">How do security deposits work for apartment rentals?</summary>
                  <p className="mt-2 text-neutral-500">Deposits are held in escrow according to local municipal leasing laws and returned within 14 days of lease completion.</p>
                </details>
                <details className="border border-neutral-200 rounded-xl p-3">
                  <summary className="font-semibold text-neutral-800 cursor-pointer">What happens if a stay is cancelled by the host?</summary>
                  <p className="mt-2 text-neutral-500">You are covered by HavenCover with 100% full refund or comparable accommodation rebooking credit.</p>
                </details>
              </div>
            </div>
          ),
        };
      case 'aircover':
      case 'aircover-host':
        return {
          title: sectionKey === 'aircover-host' ? 'HavenCover for Hosts' : 'HavenCover for Guests',
          category: 'Guaranteed Booking Protection',
          body: (
            <div className="space-y-4 text-xs text-neutral-600">
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-neutral-900">
                <div className="flex items-center gap-2 font-black text-sm text-[#FF385C]">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Comprehensive Protection Included Free</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  Every booking on Haven includes HavenCover protection against host cancellations, listing inaccuracies, and lockouts.
                </p>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-neutral-900">Booking Protection Guarantee</div>
                    <div className="text-neutral-500">If a host cancels within 30 days of check-in, we will find you a comparable or better stay.</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-neutral-900">Get-What-You-Booked Guarantee</div>
                    <div className="text-neutral-500">If the property is substantially different than advertised, you receive a full refund.</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-neutral-900">$3,000,000 Host Damage Protection</div>
                    <div className="text-neutral-500">Comprehensive coverage for unexpected property damage, art, and pet incidentals.</div>
                  </div>
                </div>
              </div>
            </div>
          ),
        };
      case 'safety':
        return {
          title: 'Anti-Discrimination & Community Safety',
          category: 'Community Values',
          body: (
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p>
                Haven is committed to building a world where anyone can feel at home anywhere. We prohibit discrimination based on race, religion, national origin, ethnicity, disability, sex, gender identity, or sexual orientation.
              </p>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <h6 className="font-bold text-neutral-900 mb-1">Our Non-Discrimination Policy:</h6>
                <ul className="list-disc pl-4 space-y-1 text-neutral-500">
                  <li>Zero tolerance for biased host denials or refusal of service.</li>
                  <li>Accommodations for service animals are strictly protected without additional fees.</li>
                  <li>Identity verification requirements apply equally to all community members.</li>
                </ul>
              </div>
            </div>
          ),
        };
      case 'disability':
        return {
          title: 'Disability & Accessibility Support',
          category: 'Inclusive Design',
          body: (
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p>
                We review step-free guest entrances, wide doorways (32"+), illuminated pathways, and accessible roll-in showers across all listings.
              </p>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="font-bold text-neutral-900">Have specific accessibility requirements?</p>
                <p className="text-neutral-500 mt-1">
                  Contact our dedicated Accessibility Team at <span className="font-semibold text-neutral-800">accessibility@havenstays.com</span> for direct verification with property hosts before booking.
                </p>
              </div>
            </div>
          ),
        };
      case 'cancellation':
        return {
          title: 'Cancellation Policies & Options',
          category: 'Reservations & Leases',
          body: (
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <div className="space-y-2">
                <div className="p-3 rounded-xl border border-neutral-200">
                  <div className="font-bold text-neutral-900">Flexible Policy (Vacation Stays)</div>
                  <div className="text-neutral-500 mt-0.5">Full refund up to 24 hours before check-in.</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200">
                  <div className="font-bold text-neutral-900">Moderate Policy (Vacation Stays)</div>
                  <div className="text-neutral-500 mt-0.5">Full refund up to 5 days before check-in.</div>
                </div>
                <div className="p-3 rounded-xl border border-neutral-200">
                  <div className="font-bold text-neutral-900">Rental Lease Termination Policy</div>
                  <div className="text-neutral-500 mt-0.5">Standard 30-day written notice for monthly apartment leases.</div>
                </div>
              </div>
            </div>
          ),
        };
      case 'resources':
        return {
          title: 'Hosting & Landlord Resources',
          category: 'Property Management',
          body: (
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p>
                Access tools to price your stays competitively, screen rental applicants, and manage occupancy.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveInfoSection(null);
                    if (onOpenHostPortal) onOpenHostPortal();
                  }}
                  className="w-full text-left p-3 rounded-xl bg-rose-50 border border-rose-200 text-[#FF385C] font-bold hover:bg-rose-100 transition cursor-pointer flex items-center justify-between"
                >
                  <span>Open Host & Landlord Portal</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ),
        };
      case 'privacy':
      case 'terms':
        return {
          title: sectionKey === 'privacy' ? 'Privacy Policy' : 'Terms of Service',
          category: 'Legal & Compliance',
          body: (
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p>
                Haven Stays, Inc. respects your privacy and ensures that your identity, payment instruments, and communication channels remain encrypted and secure.
              </p>
              <p>
                By using Haven, you agree to fair-housing guidelines, verified identity terms, and honest booking behavior.
              </p>
            </div>
          ),
        };
      default:
        return {
          title: 'Haven Information',
          category: 'Platform Overview',
          body: (
            <div className="space-y-3 text-xs text-neutral-600 leading-relaxed">
              <p>
                Haven is a unified marketplace for unique vacation stays, flexible monthly apartment leases, and verified freehold real estate properties.
              </p>
              <p>
                Equipped with live community channels and real-time multi-currency exchange rates.
              </p>
            </div>
          ),
        };
    }
  };

  const modalContent = activeInfoSection ? getSectionContent(activeInfoSection) : null;

  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 mt-20 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200">
          
          {/* Column 1: Support */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('help')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Help Centre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('aircover')}
                  className="hover:underline cursor-pointer text-left"
                >
                  AirCover for guests
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('safety')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Anti-discrimination
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('disability')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Disability support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('cancellation')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Cancellation options
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Hosting & Landlords */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Hosting & Landlords</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={onOpenHostPortal}
                  className="font-bold text-[#FF385C] hover:underline cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Host & Landlord Portal</span>
                  <span className="text-[10px] bg-rose-100 text-[#FF385C] px-1.5 py-0.2 rounded font-extrabold">Open</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenHostPortal}
                  className="hover:underline cursor-pointer text-left text-neutral-600"
                >
                  Manage Occupancy & Taken Units
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenHostPortal}
                  className="hover:underline cursor-pointer text-left text-neutral-600"
                >
                  List a New Apartment or Stay
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('aircover-host')}
                  className="hover:underline cursor-pointer text-left"
                >
                  AirCover for Hosts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('resources')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Hosting resources
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Haven Stays */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Haven Platform</h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('help')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Newsroom & Updates
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('help')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Release Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('safety')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Careers at Haven
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('safety')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Investor Relations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveInfoSection('help')}
                  className="hover:underline cursor-pointer text-left"
                >
                  Haven.org Emergency Stays
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Inspiration */}
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Inspiration</h4>
            <p className="text-neutral-500 leading-relaxed mb-3">
              Discover unique chalets, clifftop Mediterranean villas, Japanese machiya gardens, and secluded architectural wonders across 6 continents.
            </p>
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <Heart className="w-4 h-4 text-[#FF385C] fill-[#FF385C]" />
              <span>Crafted for modern explorers</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-neutral-500">
            <span>© {new Date().getFullYear()} Haven Stays, Inc.</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveInfoSection('privacy')}
              className="hover:underline cursor-pointer"
            >
              Privacy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveInfoSection('terms')}
              className="hover:underline cursor-pointer"
            >
              Terms
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActiveInfoSection('help')}
              className="hover:underline cursor-pointer"
            >
              Support
            </button>
            {onOpenLandingPage && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={onOpenLandingPage}
                  className="font-bold text-neutral-800 hover:text-[#FF385C] cursor-pointer underline"
                >
                  Sign in / Welcome
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-6 font-semibold text-neutral-800">
            <button
              type="button"
              onClick={onOpenCurrencyModal}
              className="flex items-center gap-2 hover:underline cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </button>
            <button
              type="button"
              id="footer-currency-button"
              onClick={onOpenCurrencyModal}
              className="hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentCurrency ? `${currentCurrency.symbol} ${currentCurrency.code}` : '$ USD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Footer Info Modal */}
      {activeInfoSection && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF385C] block">
                  {modalContent.category}
                </span>
                <h3 className="text-lg font-black text-neutral-900 mt-0.5">
                  {modalContent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveInfoSection(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-1">
              {modalContent.body}
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveInfoSection(null)}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};

