import React from 'react';
import { X, Check, RefreshCw, Radio } from 'lucide-react';
import { CurrencyInfo, DEFAULT_SUPPORTED_CURRENCIES } from '../utils/currency';

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: CurrencyInfo;
  onSelectCurrency: (currency: CurrencyInfo) => void;
  currencies?: Record<string, CurrencyInfo>;
  ratesStatus?: { isLive: boolean; lastUpdated?: string; isLoading: boolean };
  onRefreshRates?: () => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency,
  onSelectCurrency,
  currencies = DEFAULT_SUPPORTED_CURRENCIES,
  ratesStatus = { isLive: true, isLoading: false, lastUpdated: 'Just now' },
  onRefreshRates,
}) => {
  if (!isOpen) return null;
  const currencyList = Object.values(currencies);
  const activeCurrency = selectedCurrency?.code && currencies[selectedCurrency.code]
    ? currencies[selectedCurrency.code]
    : selectedCurrency?.code
    ? selectedCurrency
    : (currencies['USD'] || currencyList[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-neutral-900">Select your currency</h3>
              {ratesStatus.isLive && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Real-time rates
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
              <span>Prices automatically convert from base USD.</span>
              {ratesStatus.lastUpdated && (
                <span className="text-neutral-400">• Updated {ratesStatus.lastUpdated}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onRefreshRates && (
              <button
                type="button"
                id="refresh-rates-button"
                onClick={onRefreshRates}
                disabled={ratesStatus.isLoading}
                title="Refresh exchange rates"
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${ratesStatus.isLoading ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}
            <button
              id="close-currency-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 max-h-[60vh] overflow-y-auto pr-1">
          {currencyList.map((curr) => {
            const isSelected = activeCurrency.code === curr.code;
            return (
              <button
                key={curr.code}
                id={`currency-select-${curr.code}`}
                onClick={() => {
                  onSelectCurrency(curr);
                  onClose();
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{curr.flag}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">{curr.code}</span>
                      <span className={`text-xs ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        ({curr.symbol})
                      </span>
                    </div>
                    <div className={`text-xs line-clamp-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {curr.name}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <Check className="w-4 h-4 text-white shrink-0" />
                ) : (
                  <span className="text-xs text-neutral-400 shrink-0 font-medium">
                    1 USD = {curr.rateAgainstUSD} {curr.code}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>Active currency: <strong className="text-neutral-900">{activeCurrency.name} ({activeCurrency.code})</strong></span>
          <button
            onClick={onClose}
            className="font-bold text-neutral-900 hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
