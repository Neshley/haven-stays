import React from 'react';
import { Globe, Heart } from 'lucide-react';
import { CurrencyInfo } from '../utils/currency';

interface FooterProps {
  currentCurrency?: CurrencyInfo;
  onOpenCurrencyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentCurrency,
  onOpenCurrencyModal,
}) => {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 mt-20 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200">
          
          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Support</h4>
            <ul className="space-y-2.5">
              <li><a href="#help" onClick={(e) => { e.preventDefault(); alert("Haven Help Centre: 24/7 guest support assistance"); }} className="hover:underline">Help Centre</a></li>
              <li><a href="#aircover" onClick={(e) => { e.preventDefault(); alert("HavenCover: Comprehensive damage and liability protection"); }} className="hover:underline">AirCover for guests</a></li>
              <li><a href="#safety" onClick={(e) => { e.preventDefault(); alert("Safety guidelines and emergency response"); }} className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#disability" onClick={(e) => { e.preventDefault(); alert("Accessibility support features"); }} className="hover:underline">Disability support</a></li>
              <li><a href="#cancellation" onClick={(e) => { e.preventDefault(); alert("Flexible cancellation options policy"); }} className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Hosting</h4>
            <ul className="space-y-2.5">
              <li><a href="#list" onClick={(e) => { e.preventDefault(); alert("Airbnb your home with top-tier protection"); }} className="hover:underline">Airbnb your home</a></li>
              <li><a href="#aircover-host" onClick={(e) => { e.preventDefault(); alert("AirCover for Hosts: $3M damage protection"); }} className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#resources" onClick={(e) => { e.preventDefault(); alert("Hosting resources and community guides"); }} className="hover:underline">Hosting resources</a></li>
              <li><a href="#forum" onClick={(e) => { e.preventDefault(); alert("Community forum and host meetups"); }} className="hover:underline">Community forum</a></li>
              <li><a href="#responsible" onClick={(e) => { e.preventDefault(); alert("Responsible hosting guidelines"); }} className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 text-sm mb-3">Haven Stays</h4>
            <ul className="space-y-2.5">
              <li><a href="#news" onClick={(e) => { e.preventDefault(); alert("Haven Newsroom: Summer Release updates"); }} className="hover:underline">Newsroom</a></li>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); alert("Explore new release features"); }} className="hover:underline">New features</a></li>
              <li><a href="#careers" onClick={(e) => { e.preventDefault(); alert("Careers at Haven"); }} className="hover:underline">Careers</a></li>
              <li><a href="#investors" onClick={(e) => { e.preventDefault(); alert("Investor Relations"); }} className="hover:underline">Investors</a></li>
              <li><a href="#emergency" onClick={(e) => { e.preventDefault(); alert("Haven.org emergency stays"); }} className="hover:underline">Haven.org emergency stays</a></li>
            </ul>
          </div>

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
            <span>© 2026 Haven Stays, Inc.</span>
            <span>•</span>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">Privacy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">Terms</a>
            <span>•</span>
            <a href="#sitemap" onClick={(e) => e.preventDefault()} className="hover:underline">Sitemap</a>
            <span>•</span>
            <a href="#company" onClick={(e) => e.preventDefault()} className="hover:underline">Company details</a>
          </div>

          <div className="flex items-center gap-6 font-semibold text-neutral-800">
            <button
              onClick={onOpenCurrencyModal}
              className="flex items-center gap-2 hover:underline cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </button>
            <button
              id="footer-currency-button"
              onClick={onOpenCurrencyModal}
              className="hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentCurrency ? `${currentCurrency.symbol} ${currentCurrency.code}` : '$ USD'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
