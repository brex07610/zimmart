import React, { useState } from "react";
import { Listing, ConnectionSpeed, Currency } from "../types";
import { MapPin, Eye, ShieldCheck, ImageOff } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

interface ListingCardProps {
  key?: string;
  listing: Listing;
  lang: "en" | "shona" | "ndebele";
  connectionSpeed: ConnectionSpeed;
  onSelect: (id: string) => void;
  onLikeToggle: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
}

export default function ListingCard({
  listing,
  lang,
  connectionSpeed,
  onSelect,
  onLikeToggle,
  isLiked
}: ListingCardProps) {
  const isEn = lang === "en";
  const t = TRANSLATIONS[lang];
  
  // Local state to manually tap and download the image when in extreme data saving modes
  const [isForceLoaded, setIsForceLoaded] = useState(false);

  const isOffline = connectionSpeed === ConnectionSpeed.OFFLINE;
  const is2G = connectionSpeed === ConnectionSpeed.EXTREME_2G;
  const is3G = connectionSpeed === ConnectionSpeed.SLOW_3G;

  const handleCardClick = () => {
    onSelect(listing.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    onLikeToggle(listing.id, e);
  };

  return (
    <div 
      id={`listing-card-${listing.id}`}
      onClick={handleCardClick}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all group flex flex-col h-full cursor-pointer"
    >
      {/* Listing image display which checks data saving constraints */}
      <div className="relative aspect-video w-full bg-slate-50 overflow-hidden shrink-0">
        
        {is2G && !isForceLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-500">
            <ImageOff className="w-6 h-6 mb-1 text-slate-400" />
            <p className="text-[10px] text-slate-500 font-mono text-center font-bold">2G Text Saver Mode</p>
            <button
              id={`btn-preload-img-${listing.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsForceLoaded(true);
              }}
              className="mt-2 text-[9px] font-mono px-2.5 py-1 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Load Cover (135 KB)
            </button>
          </div>
        ) : (
          <img
            src={listing.images[0]}
            alt={listing.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
              is3G ? "filter blur-xs opacity-85" : ""
            }`}
          />
        )}

        {/* Data Saver Indicators */}
        {is3G && (
          <span className="absolute top-2 left-2 bg-blue-900/40 text-blue-300 border border-blue-800 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
            3G Compressed (50% Data Saved)
          </span>
        )}

        {/* Condition Tag */}
        <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg border border-slate-800 font-mono">
          {t[listing.condition] || listing.condition}
        </span>

        {/* Wishlist Heart */}
        <button
          id={`btn-like-${listing.id}`}
          onClick={handleLike}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/94 hover:bg-white text-rose-500 shadow-sm border border-slate-100 cursor-pointer"
        >
          <span className="text-sm font-bold">{isLiked ? "♥" : "♡"}</span>
        </button>
      </div>

      {/* Item summary details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono tracking-tight mb-1 text-slate-450 uppercase">
            <span>{listing.category}</span>
            <div className="flex items-center gap-0.5 font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>{listing.views}</span>
            </div>
          </div>

          <h3 className="font-extrabold text-sm text-slate-950 line-clamp-1 leading-snug group-hover:text-emerald-600 transition-colors">
            {listing.title}
          </h3>

          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-1 mb-2.5">
            {listing.description}
          </p>
        </div>

        {/* Footer info: Location & Prices */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center text-[10px] text-slate-400 font-medium mb-2 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-600 mr-1" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-emerald-700 font-black text-sm">$</span>
              <span className="text-emerald-700 font-black text-lg">{listing.priceUSD.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 uppercase font-semibold">USD</span>
            </div>
            
            <div className="text-right font-mono">
              <p className="text-xs font-bold text-blue-700">
                ZiG {listing.priceZWL.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
