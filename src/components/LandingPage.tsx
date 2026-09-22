import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Home,
  Key,
  Building2,
  Users,
  MessageSquare,
  ShieldCheck,
  Globe,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Star,
  CheckCircle2,
  Sparkles,
  MapPin,
  Heart,
  ShieldAlert,
  Award,
  Volume2,
  Leaf,
  Check,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';
import { CurrencyInfo } from '../utils/currency';
import { ListingIntent } from '../types';

interface LandingPageProps {
  onEnterApp: (intent?: ListingIntent) => void;
  onOpenCurrencyModal: () => void;
  currentCurrency: CurrencyInfo;
  onlineChatCount: number;
}

export function LandingPage({
  onEnterApp,
  onOpenCurrencyModal,
  currentCurrency,
  onlineChatCount,
}: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'traveler' | 'host' | 'investor'>('traveler');
  const [rememberMe, setRememberMe] = useState(true);
  const [authToast, setAuthToast] = useState<string | null>(null);

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actionText = authMode === 'signin' ? 'Signed in successfully' : 'Account created';
    setAuthToast(`${actionText}! Welcome to Haven.`);
    setTimeout(() => {
      onEnterApp();
    }, 700);
  };

  const handleSocialSignIn = (provider: string) => {
    setAuthToast(`Signed in with ${provider}! Welcome to Haven.`);
    setTimeout(() => {
      onEnterApp();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-neutral-900 flex flex-col selection:bg-emerald-800/20 selection:text-emerald-900">
      {/* Toast Notification */}
      <AnimatePresence>
        {authToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-neutral-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{authToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP TAGLINE & TRUST ANNOUNCEMENT BAR */}
      <div className="bg-[#1B4332] text-white text-[11px] py-2 px-4 border-b border-[#2D6A4F]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px] tracking-wider uppercase">
              <Leaf className="w-3 h-3 text-emerald-400" />
              Sanctuary Niche
            </span>
            <span className="font-medium text-emerald-100">
              <strong>Haven</strong> — Curated architectural stays & eco-design sanctuaries for modern explorers.
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-200/90 text-[11px] font-semibold">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>4.94/5 Guest Trust</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Escrow Protection</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-emerald-300">Hand-Verified Design</span>
          </div>
        </div>
      </div>

      {/* TOP MAIN NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Editorial Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] flex items-center justify-center text-white shadow-md shadow-emerald-950/20">
              <Compass className="w-5 h-5 stroke-[2.2] text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-neutral-900 font-display">
                  haven<span className="text-emerald-700">.</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                  Architectural Stays
                </span>
              </div>
              <p className="text-[10px] font-medium text-neutral-500 hidden sm:block">
                Curated sanctuaries for mindful living
              </p>
            </div>
          </div>

          {/* Center Direct Category Shortlinks */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-100/80 p-1 rounded-full border border-neutral-200/80">
            <button
              onClick={() => onEnterApp('stay')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-emerald-900 hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-emerald-700" />
              <span>Short Stays</span>
            </button>
            <button
              onClick={() => onEnterApp('rent')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-blue-900 hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-blue-700" />
              <span>Monthly Rentals</span>
            </button>
            <button
              onClick={() => onEnterApp('sale')}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-neutral-700 hover:text-amber-900 hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Freehold Sales</span>
            </button>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <button
              onClick={onOpenCurrencyModal}
              className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 rounded-full transition flex items-center gap-1.5 border border-neutral-200 cursor-pointer"
              title="Select currency"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <span>{currentCurrency.code} ({currentCurrency.symbol})</span>
            </button>

            {/* Live Community Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{onlineChatCount} explorers online</span>
            </div>

            {/* Direct Guest Access Button */}
            <button
              onClick={() => onEnterApp()}
              className="px-4 py-2 text-xs font-bold text-neutral-800 hover:text-emerald-800 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Stays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Jump to Sign In Form */}
            <a
              href="#auth-section"
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xs hover:shadow transition cursor-pointer"
            >
              Sign In
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH ATMOSPHERIC SANCTUARY IMAGE BACKGROUND */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        {/* Serene Background Image with High-Contrast Calming Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=85"
            alt="Haven Architectural Sanctuary"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          {/* Calming deep sanctuary vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-stone-900/60" />
          <div className="absolute inset-0 bg-radial-at-t from-transparent via-emerald-950/30 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Brand Story, Niche, & Clear Category Exploration */}
            <div className="lg:col-span-7 space-y-7 text-white">
              
              {/* Niche Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>ARCHITECTURAL SANCTUARIES & ECO-DESIGN HOMES</span>
              </div>

              {/* Tagline & Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] font-display text-white">
                  Curated stays for <br />
                  <span className="font-serif-display italic font-normal text-emerald-200">
                    modern explorers.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed font-normal">
                  Escape generic booking noise. Haven hand-verifies architecturally significant homes, biophilic nature pavilions, and design-forward urban lofts across 15+ premier destinations — each inspected for stillness, sustainable craftsmanship, and acoustic comfort.
                </p>
              </div>

              {/* NAVIGATION CLARITY: 3 DISTINCT, HIGH-CONTRAST CATEGORY CARDS */}
              <div className="pt-2">
                <div className="text-xs uppercase tracking-widest font-extrabold text-stone-400 mb-3 flex items-center gap-2">
                  <span>Explore By Category</span>
                  <span className="h-px flex-1 bg-stone-700/60" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Category 1: Short Stays */}
                  <button
                    type="button"
                    onClick={() => onEnterApp('stay')}
                    className="p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-900 border border-emerald-500/40 hover:border-emerald-400 backdrop-blur-md text-left transition-all duration-200 group cursor-pointer shadow-lg hover:shadow-emerald-900/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-900/90 text-emerald-300 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700/50">
                          Nightly
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white group-hover:text-emerald-200 transition-colors">
                        Vacation Stays
                      </div>
                      <div className="text-[11px] text-stone-300 mt-1 leading-snug">
                        Villas, glass cabins & nature sanctuaries
                      </div>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] font-bold text-emerald-300">
                      <span>From $185 / night</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Category 2: Monthly Rentals */}
                  <button
                    type="button"
                    onClick={() => onEnterApp('rent')}
                    className="p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-900 border border-blue-500/40 hover:border-blue-400 backdrop-blur-md text-left transition-all duration-200 group cursor-pointer shadow-lg hover:shadow-blue-900/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-950/90 text-blue-300 flex items-center justify-center border border-blue-500/30 group-hover:scale-105 transition-transform">
                          <Key className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-700/50">
                          1–12 Mo
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white group-hover:text-blue-200 transition-colors">
                        Monthly Rentals
                      </div>
                      <div className="text-[11px] text-stone-300 mt-1 leading-snug">
                        Furnished architectural lofts & city flats
                      </div>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] font-bold text-blue-300">
                      <span>From $2,800 / mo</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  {/* Category 3: Freehold Sales */}
                  <button
                    type="button"
                    onClick={() => onEnterApp('sale')}
                    className="p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-900 border border-amber-500/40 hover:border-amber-400 backdrop-blur-md text-left transition-all duration-200 group cursor-pointer shadow-lg hover:shadow-amber-900/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-950/90 text-amber-300 flex items-center justify-center border border-amber-500/30 group-hover:scale-105 transition-transform">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-700/50">
                          Freehold
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white group-hover:text-amber-200 transition-colors">
                        Properties for Sale
                      </div>
                      <div className="text-[11px] text-stone-300 mt-1 leading-snug">
                        Design estates, townhomes & penthouses
                      </div>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] font-bold text-amber-300">
                      <span>Verified Ownership</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              {/* TRUST SIGNALS STRIP */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium">Verified Architect Hosts</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium">100% Escrow Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium">Acoustic Rest Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium">4.94/5 Real Guest Rating</span>
                </div>
              </div>

            </div>

            {/* Right Column: Calm, Refined Guest & Member Access Card */}
            <div id="auth-section" className="lg:col-span-5">
              <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-300/80 relative overflow-hidden text-neutral-900">
                {/* Subtle top accent ribbon */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600" />

                {/* Trust Badge at card top */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Haven Secure Access</span>
                  </div>
                  <span className="text-[10px] font-semibold text-neutral-500">
                    256-Bit Encrypted
                  </span>
                </div>

                {/* Mode Toggle Pills */}
                <div className="flex bg-neutral-200/80 p-1 rounded-2xl mb-5">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Join Sanctuary Club
                  </button>
                </div>

                {/* Header Title */}
                <div className="mb-4">
                  <h2 className="text-lg font-black text-neutral-900 font-display">
                    {authMode === 'signin' ? 'Welcome back to Haven' : 'Begin your sanctuary journey'}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {authMode === 'signin'
                      ? 'Access your curated wishlists, reservations, and community channels.'
                      : 'Unlock handpicked architectural retreats and member-only properties.'}
                  </p>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-2 mb-3.5">
                  <button
                    type="button"
                    onClick={() => handleSocialSignIn('Google')}
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-100/70 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2.5 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialSignIn('Apple')}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2.5 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-1 .04-2.1.66-2.73 1.41-.56.64-.99 1.7-1 2.76 1.13.09 2.16-.57 2.72-1.3" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-[#FBFBFA] px-2 text-neutral-400 font-bold tracking-wider">
                      or with email
                    </span>
                  </div>
                </div>

                {/* Interactive Form */}
                <form onSubmit={handleSimulateSubmit} className="space-y-3">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Maya Lin"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-neutral-700">
                        Password
                      </label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setAuthToast("Reset instructions sent to your email.")}
                          className="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Your Interest in Haven
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole('traveler')}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition cursor-pointer ${
                            role === 'traveler'
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                              : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          Modern Explorer
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('host')}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition cursor-pointer ${
                            role === 'host'
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                              : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          Design Host
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('investor')}
                          className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition cursor-pointer ${
                            role === 'investor'
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                              : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          Estate Buyer
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-700 rounded"
                    />
                    <label htmlFor="remember-me" className="text-xs text-neutral-600 font-medium">
                      Keep me signed in on this device
                    </label>
                  </div>

                  {/* Primary Submit Action */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-1"
                  >
                    <span>{authMode === 'signin' ? 'Sign In & Enter Haven' : 'Create Sanctuary Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Direct Guest Link */}
                  <button
                    type="button"
                    onClick={() => onEnterApp()}
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-100/80 text-neutral-700 text-xs font-semibold transition cursor-pointer text-center block"
                  >
                    Continue as Guest Explorer →
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THE HAVEN DIFFERENCE: WHY WE'RE NOT AIRBNB */}
      <section className="bg-white border-b border-neutral-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>THE HAVEN STANDARD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 font-display">
              Built for stillness, architecture, and trust.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed">
              We started Haven because generic short-term rental platforms became flooded with sterile, cookie-cutter apartments and unpredictable quality. Here is our promise to modern explorers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pillar 1: Architectural Distinction */}
            <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 font-display mb-1.5">
                Architectural Distinction
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Only the top 5% of submitted homes are selected. We prioritize natural light, honest materials (stone, timber, linen), and unique spatial character.
              </p>
            </div>

            {/* Pillar 2: Eco-Conscious Sanctuaries */}
            <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 font-display mb-1.5">
                Eco-Conscious & Biophilic
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Passive cooling, solar power, organic amenities, and seamless indoor-outdoor connections designed to restore your nervous system.
              </p>
            </div>

            {/* Pillar 3: Verified Acoustic Rest */}
            <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 font-display mb-1.5">
                Acoustic Rest Guarantee
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every bedroom is vetted for peaceful ambient noise levels (&lt;35dB), blackout shading, non-toxic organic mattresses, and restful stillness.
              </p>
            </div>

            {/* Pillar 4: 100% Escrow & Verified Deeds */}
            <div className="p-6 rounded-3xl bg-[#FBFBFA] border border-neutral-200/80 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="font-bold text-base text-neutral-900 font-display mb-1.5">
                Verified Deeds & Escrow
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hosts undergo biometric ID and title verification. Rental security deposits and stay funds are protected in municipal-grade escrow accounts.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* VERIFIED GUEST REVIEWS & SOCIAL TRUST */}
      <section className="py-16 bg-[#F6F6F2] border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Verified Traveler Experiences</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-display">
                Loved by architects, writers, and mindful travelers.
              </h2>
            </div>
            
            <div className="flex items-center gap-4 bg-white px-4 py-2.5 rounded-2xl border border-neutral-200/80 shadow-2xs">
              <div>
                <span className="text-lg font-black text-neutral-900">4.94</span>
                <span className="text-xs text-neutral-400 font-medium"> / 5.0</span>
              </div>
              <div className="h-6 w-px bg-neutral-200" />
              <div className="text-xs text-neutral-600">
                <strong>24,800+</strong> verified stay reviews
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Verified Stay
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  "Finding a rental that genuinely values architectural serenity is impossible on mainstream apps. Haven's Big Sur Pavilion was breathtaking — silence, cedar timber scent, and zero noise. Completed my book draft in pure focus."
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Elena Rostova"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Elena Rostova</div>
                  <div className="text-[11px] text-neutral-500">Architect & Author • Stayed 12 nights</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Verified 6-Mo Lease
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  "I needed a 6-month furnished loft in Tribeca while directing a documentary. Haven handled the lease contract, verified the deed, and protected my deposit in escrow. Truly professional compared to Craigslist or Airbnb."
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Marcus Vance"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Marcus Vance</div>
                  <div className="text-[11px] text-neutral-500">Filmmaker • Tribeca Loft Tenant</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Verified Stay
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  "The Kyoto Machiya Sanctuary was a masterpiece of Japanese minimalism. The host was an interior restoration master and provided hand-brewed organic green tea. We will never book standard hotels again."
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                  alt="Chloe & Liam"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-neutral-900">Chloe & Liam Chen</div>
                  <div className="text-[11px] text-neutral-500">Design Directors • Stayed in Kyoto</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-14 bg-[#1B4332] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Ready to experience a true sanctuary?
          </h2>
          <p className="text-emerald-200 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
            Browse hand-verified short stays, flexible design rentals, and freehold properties worldwide.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onEnterApp('stay')}
              className="px-6 py-3 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <span>Explore Vacation Stays</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEnterApp('rent')}
              className="px-6 py-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-500/50 font-bold text-xs transition cursor-pointer"
            >
              <span>Browse Monthly Rentals</span>
            </button>
            <button
              onClick={() => onEnterApp('sale')}
              className="px-6 py-3 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-500/50 font-bold text-xs transition cursor-pointer"
            >
              <span>Properties for Sale</span>
            </button>
          </div>
        </div>
      </section>

      {/* MINIMAL SANCTUARY FOOTER */}
      <footer className="py-8 bg-[#FBFBFA] border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 font-display">Haven Sanctuaries</span>
            <span>•</span>
            <span>Curated stays for modern explorers</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onEnterApp()}
              className="font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer flex items-center gap-1"
            >
              <span>Enter Haven Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
