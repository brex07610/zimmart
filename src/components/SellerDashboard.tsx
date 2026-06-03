import React, { useState } from "react";
import { Listing, User, Condition, Status, Currency, Review, PaymentMethod } from "../types";
import { 
  BarChart3, TrendingUp, Inbox, Tag, Layers, CheckCircle2, 
  HelpCircle, Sparkles, Sliders, AlertCircle, Trash2, Edit 
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

interface SellerDashboardProps {
  listings: Listing[];
  reviews: Review[];
  lang: "en" | "shona" | "ndebele";
  onDeleteListing: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onBulkAdjustRates: (exchangeRate: number) => void;
  onMarkSold: (id: string) => void;
  onRenewListing: (id: string) => void;
}

export default function SellerDashboard({
  listings,
  reviews,
  lang,
  onDeleteListing,
  onUpdateStatus,
  onBulkAdjustRates,
  onMarkSold,
  onRenewListing
}: SellerDashboardProps) {
  const isEn = lang === "en";
  const isShona = lang === "shona";
  const isNdebele = lang === "ndebele";
  const t = TRANSLATIONS[lang];

  const textLabel = (enVal: string, shVal: string, ndVal: string) => {
    if (isShona) return shVal;
    if (isNdebele) return ndVal;
    return enVal;
  };
  const [exchangeRateInput, setExchangeRateInput] = useState("25.12");
  const [customRateSuccess, setCustomRateSuccess] = useState(false);

  // Calculate statistics from mock listings
  const totalListingsCount = listings.length;
  const activeCount = listings.filter(l => l.status === Status.ACTIVE).length;
  const soldCount = listings.filter(l => l.status === Status.SOLD).length;

  // Let's assume some mock stats
  const totalRevenueUSD = listings
    .filter(l => l.status === Status.SOLD)
    .reduce((sum, current) => sum + current.priceUSD, 380); // $380 preset starting revenue for high fidelity

  const totalViews = listings.reduce((sum, l) => sum + l.views, 1542);
  const conversionRate = totalListingsCount > 0 ? ((soldCount / totalListingsCount) * 100).toFixed(1) : "22.5";

  const handleBulkRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(exchangeRateInput);
    if (!isNaN(rate) && rate > 0) {
      onBulkAdjustRates(rate);
      setCustomRateSuccess(true);
      setTimeout(() => {
        setCustomRateSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6" id="seller-dashboard">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
            {t.sellerMetrics}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {textLabel(
              "Track earnings, view listings traction, and update stock ratings.",
              "Ongorora mari yawakambowana nezvinhu zviri pamusika wako.",
              "Landela i-revenue yakho, ubonge lokho okudume kakhulu, uphinde uvuselele isimo sakho."
            )}
          </p>
        </div>

        {/* Currency rate shift adjuster */}
        <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-3 max-w-sm flex flex-col gap-2 shadow-md">
          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <Sliders className="w-4 h-4 shrink-0" />
            <span>{t.bulkRates}</span>
          </div>
          <form onSubmit={handleBulkRateSubmit} className="flex gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-500 font-mono text-[10px] uppercase font-bold">
                1 USD =
              </span>
              <input
                id="input-exchange-rate"
                type="number"
                step="0.01"
                value={exchangeRateInput}
                onChange={e => setExchangeRateInput(e.target.value)}
                className="bg-slate-950 text-slate-100 pl-[52px] pr-8 py-1.5 w-36 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 font-mono text-[10px] font-bold">
                ZiG
              </span>
            </div>
            <button
              id="btn-apply-bulk-adjust"
              type="submit"
              className="px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              {textLabel("Sync", "Shandura", "Lungisa")}
            </button>
          </form>
          {customRateSuccess && (
            <span className="text-[9px] font-mono text-emerald-400 font-semibold animate-pulse">
              ✓ {textLabel("All ZiG prices updated in cache!", "Mitengo yako yeZiG yagadziriswa zvizere!", "Inani ezidlulileyo ze-ZiG zilayishwe kahle!")}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Cards metric counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs" id="metric-revenue">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">{t.revenue}</span>
            <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-black font-mono text-slate-950">${totalRevenueUSD.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-mono font-bold mb-1">USD</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">
            +{(totalRevenueUSD * 25.12).toFixed(0)} ZiG equivalent
          </p>
        </div>

        {/* Action views count */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs" id="metric-views">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">{t.totalViews}</span>
            <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
          </div>
          <span className="text-2xl font-black font-mono text-slate-950">{totalViews}</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            {textLabel("Across 6 live products", "Pamberi pezvinhu zvitanhatu", "Kumikhiqizo engu-6 ephilayo")}
          </p>
        </div>

        {/* Responses speed ratings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs" id="metric-response">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">{t.responseRate}</span>
            <Inbox className="w-4.5 h-4.5 text-orange-600" />
          </div>
          <span className="text-2xl font-black font-mono text-slate-950">94%</span>
          <p className="text-[10px] text-orange-600 font-bold mt-1">
            🚀 {textLabel("Immediate Response badge", "Anopindura nekukurumidza", "Ikhadi Lokuphendula Masinyane")}
          </p>
        </div>

        {/* Conversion rates */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs" id="metric-conversion">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">{t.conversionRate}</span>
            <Tag className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <span className="text-2xl font-black font-mono text-slate-950">{conversionRate}%</span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            {soldCount} {textLabel("completed sales", "Zvatengeswa zvachose", "izinto ezithengiswe ngokupheleleyo")} / {totalListingsCount} total
          </p>
        </div>
      </div>

      {/* SVG Custom Histograms of views over time */}
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-5 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 mb-4 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          {textLabel("Weekly Views Trend (Aggregated Views)", "Huwandu hweVanhu vanoona pasvondo", "Isimo Sokubuka Nge-Vikili (Views)")}
        </h3>
        
        {/* Real responsive CSS Bar chart */}
        <div className="flex h-36 items-end gap-3 md:gap-5 pt-4 border-b border-slate-800 pb-2">
          {[
            { day: "Mon", val: 45 },
            { day: "Tue", val: 80 },
            { day: "Wed", val: 120 },
            { day: "Thu", val: 95 },
            { day: "Fri", val: 140 },
            { day: "Sat", val: 195 },
            { day: "Sun", val: 210 }
          ].map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full max-w-[28px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md hover:opacity-85 transition-opacity cursor-pointer relative group flex justify-center items-end"
                style={{ height: `${(bar.val / 225) * 100}%` }}
              >
                {/* Tooltip */}
                <span className="absolute bottom-full mb-1 bg-slate-950 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono mt-1 pt-1">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Listings Management & Reviews feedback list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Current listings manager */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-7">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase mb-4 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Layers className="w-4.5 h-4.5 text-slate-800" />
            {t.listingsTitle} ({listings.length})
          </h3>

          <div className="space-y-3">
            {listings.map(item => (
              <div 
                id={`dash-listing-${item.id}`}
                key={item.id} 
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-150 hover:bg-slate-50/50 transition-colors"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                />
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{item.title}</h4>
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.2 rounded shrink-0 ${
                      item.status === Status.ACTIVE 
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === Status.SOLD 
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
                    <span className="font-mono text-emerald-700">${item.priceUSD} USD</span> • 
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.status === Status.ACTIVE && (
                    <button
                      id={`btn-dash-sold-${item.id}`}
                      onClick={() => onMarkSold(item.id)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-md transition-colors cursor-pointer"
                    >
                      {t.btnMarkSold}
                    </button>
                  )}
                  {item.status === Status.EXPIRED && (
                    <button
                      id={`btn-dash-renew-${item.id}`}
                      onClick={() => onRenewListing(item.id)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-md transition-colors cursor-pointer"
                    >
                      {t.btnRenew}
                    </button>
                  )}
                  <button
                    id={`btn-dash-delete-${item.id}`}
                    onClick={() => onDeleteListing(item.id)}
                    className="p-1 bg-rose-50 text-rose-600 hover:bg-rose-100/80 rounded-md transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews history list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-5">
          <h3 className="font-extrabold text-sm text-slate-900 uppercase mb-4 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            {t.reviewsTitle}
          </h3>

          <div className="space-y-4">
            {reviews.map(rev => (
              <div id={`review-item-${rev.id}`} key={rev.id} className="space-y-1.5 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{rev.reviewerName}</h4>
                      <p className="text-[9px] text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-xs">★</span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-emerald-700 font-semibold truncate leading-none">
                  Item: {rev.listingTitle}
                </p>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.verifiedPurchase && (
                  <span className="inline-block text-[8px] font-mono font-bold bg-emerald-50 text-emerald-750 border border-emerald-100 py-0.5 px-1.5 rounded-md mt-1">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
