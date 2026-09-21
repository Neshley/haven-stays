export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // 1 USD = rate units of this currency
  flag: string;
}

export const DEFAULT_SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'United States Dollar', rateAgainstUSD: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateAgainstUSD: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateAgainstUSD: 0.79, flag: '🇬🇧' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateAgainstUSD: 155.0, flag: '🇯🇵' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateAgainstUSD: 1.36, flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rateAgainstUSD: 1.52, flag: '🇦🇺' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rateAgainstUSD: 0.90, flag: '🇨🇭' },
  SGD: { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', rateAgainstUSD: 1.35, flag: '🇸🇬' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateAgainstUSD: 3.67, flag: '🇦🇪' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rateAgainstUSD: 130.0, flag: '🇰🇪' },
};

export const SUPPORTED_CURRENCIES: Record<string, CurrencyInfo> = { ...DEFAULT_SUPPORTED_CURRENCIES };

export const DEFAULT_CURRENCY_CODE = 'USD';

export interface ExchangeRatesResult {
  currencies: Record<string, CurrencyInfo>;
  isLive: boolean;
  lastUpdated?: string;
}

/**
 * Fetches real live exchange rates from public open rates endpoints.
 * Automatically falls back to bundled baseline rates if offline or network fails.
 */
export async function fetchLiveExchangeRates(forceRefresh: boolean = false): Promise<ExchangeRatesResult> {
  const CACHE_KEY = 'haven_live_rates_cache';
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (cached && cached.timestamp && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.rates) {
          const merged = mergeRates(cached.rates);
          return {
            currencies: merged,
            isLive: true,
            lastUpdated: cached.lastUpdated || new Date(cached.timestamp).toLocaleTimeString(),
          };
        }
      }
    } catch {
      // LocalStorage error or parse failure, continue to fetch
    }
  }

  // Primary API: open.er-api.com (No API key, free, fast, global CDN)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result === 'success' && data.rates) {
        const formattedDate = data.time_last_update_utc
          ? new Date(data.time_last_update_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              rates: data.rates,
              lastUpdated: formattedDate,
            })
          );
        } catch {
          // ignore storage quota errors
        }

        const merged = mergeRates(data.rates);
        return {
          currencies: merged,
          isLive: true,
          lastUpdated: formattedDate,
        };
      }
    }
  } catch (err) {
    console.warn('Primary exchange rates endpoint failed, trying backup...', err);
  }

  // Backup API: exchangerate-api v4
  try {
    const backupRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (backupRes.ok) {
      const backupData = await backupRes.json();
      if (backupData && backupData.rates) {
        const formattedDate = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const merged = mergeRates(backupData.rates);
        return {
          currencies: merged,
          isLive: true,
          lastUpdated: formattedDate,
        };
      }
    }
  } catch (err) {
    console.warn('Backup exchange rates endpoint failed, using default baseline rates.', err);
  }

  return {
    currencies: { ...DEFAULT_SUPPORTED_CURRENCIES },
    isLive: false,
    lastUpdated: 'Baseline rates',
  };
}

function mergeRates(liveRates: Record<string, number>): Record<string, CurrencyInfo> {
  const updated: Record<string, CurrencyInfo> = {};
  for (const [code, info] of Object.entries(DEFAULT_SUPPORTED_CURRENCIES)) {
    const liveRate = liveRates[code];
    if (typeof liveRate === 'number' && liveRate > 0) {
      updated[code] = {
        ...info,
        rateAgainstUSD: Number(liveRate.toFixed(liveRate >= 10 ? 2 : 4)),
      };
    } else {
      updated[code] = { ...info };
    }
  }
  return updated;
}

/**
 * Converts a base USD amount into the target currency and formats it.
 * @param amountInUSD - numeric amount in USD
 * @param currency - active CurrencyInfo object
 * @param compact - whether to format large numbers compactly (e.g. 1.2M, 450k)
 */
export function formatCurrency(
  amountInUSD: number | undefined | null,
  currency?: CurrencyInfo | null,
  compact: boolean = false
): string {
  const activeCurrency = currency && currency.code
    ? currency
    : (SUPPORTED_CURRENCIES[DEFAULT_CURRENCY_CODE] || {
        code: 'USD',
        symbol: '$',
        name: 'United States Dollar',
        rateAgainstUSD: 1.0,
        flag: '🇺🇸',
      });

  if (amountInUSD === undefined || amountInUSD === null || isNaN(amountInUSD)) {
    return `${activeCurrency.symbol}0`;
  }

  const converted = Math.round(amountInUSD * activeCurrency.rateAgainstUSD);

  if (compact) {
    if (converted >= 1_000_000_000) {
      return `${activeCurrency.symbol}${(converted / 1_000_000_000).toFixed(1)}B`;
    }
    if (converted >= 1_000_000) {
      return `${activeCurrency.symbol}${(converted / 1_000_000).toFixed(1)}M`;
    }
    if (converted >= 100_000) {
      return `${activeCurrency.symbol}${Math.round(converted / 1_000)}k`;
    }
    if (converted >= 10_000) {
      return `${activeCurrency.symbol}${(converted / 1_000).toFixed(1)}k`;
    }
  }

  return `${activeCurrency.symbol}${converted.toLocaleString()}`;
}
