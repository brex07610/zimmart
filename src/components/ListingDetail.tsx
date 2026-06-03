import React, { useState } from "react";
import { Listing, User, ConnectionSpeed } from "../types";
import { 
  MapPin, Phone, MessageSquare, ShieldCheck, Tag, Info, 
  Trash2, Flame, Award, Heart, LayoutGrid, Check, Truck, ArrowLeft 
} from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

interface ListingDetailProps {
  listing: Listing;
  seller: User;
  currentUser: User;
  lang: "en" | "shona" | "ndebele";
  connectionSpeed: ConnectionSpeed;
  onBack: () => void;
  onInitiateChat: (sellerId: string, listingId: string) => void;
  onOpenPayment: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
}

export default function ListingDetail({
  listing,
  seller,
  currentUser,
  lang,
  connectionSpeed,
  onBack,
  onInitiateChat,
  onOpenPayment,
  isLiked,
  onLikeToggle
}: ListingDetailProps) {
  const isEn = lang === "en";
  const isShona = lang === "shona";
  const isNdebele = lang === "ndebele";
  const t = TRANSLATIONS[lang];

  const textLabel = (enVal: string, shVal: string, ndVal: string) => {
    if (isShona) return shVal;
    if (isNdebele) return ndVal;
    return enVal;
  };
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [revealPhone, setRevealPhone] = useState(false);

  const is2G = connectionSpeed === ConnectionSpeed.EXTREME_2G;
  const is3G = connectionSpeed === ConnectionSpeed.SLOW_3G;

  const handleMessageClick = () => {
    onInitiateChat(seller.id, listing.id);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs p-4 md:p-6 space-y-6" id="listing-detail">
      
      {/* Back button and title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <button
          id="btn-back-to-browse"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors uppercase font-mono cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {textLabel("Back to Browse", "Kudzoka kuMusika", "Buyela Emuva")}
        </button>

        <button
          id="btn-detail-like"
          onClick={onLikeToggle}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer ${
            isLiked ? "bg-rose-50 text-rose-600 border-rose-200 font-bold" : "hover:bg-slate-100"
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>{isLiked ? textLabel("Wishlisted", "Inofarirwa", "Kufakwe Ku-Wishlist") : textLabel("Add Wishlist", "Kufarira", "Faka Wishlist")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Gallery column */}
        <div className="md:col-span-6 space-y-3">
          <div className="relative aspect-video w-full rounded-xl bg-slate-50 overflow-hidden border border-slate-200">
            <img
              src={listing.images[activeImageIdx]}
              alt={listing.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${
                is3G ? "filter blur-xs opacity-90" : ""
              }`}
            />
            {is3G && (
              <span className="absolute top-2 left-2 bg-blue-900/50 text-blue-300 border border-blue-800 text-[8px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                3G Low bandwidth compression active
              </span>
            )}
          </div>

          {/* Thumbnail slides preview */}
          {listing.images.length > 1 && (
            <div className="flex gap-2">
              {listing.images.map((img, i) => (
                <button
                  id={`btn-thumb-idx-${i}`}
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === i ? "border-emerald-600 ring-1 ring-emerald-500" : "border-slate-200 hover:border-slate-350"
                  }`}
                >
                  <img src={img} alt="Thumb" loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product specs column */}
        <div className="md:col-span-6 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                {listing.category}
              </span>
              <span className="text-[10px] uppercase font-bold bg-slate-900 text-white font-mono px-2 py-0.5 rounded">
                {t[listing.condition] || listing.condition}
              </span>
            </div>
            
            <h1 className="text-xl md:text-2xl font-black font-sans tracking-tight text-slate-950 leading-tight">
              {listing.title}
            </h1>

            <div className="flex items-center text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
              <span>{listing.location}</span>
            </div>
          </div>

          {/* Core Prices */}
          <div className="flex justify-between items-center bg-slate-950 text-slate-100 px-4 py-3 rounded-2xl border border-slate-800/80 shadow-md">
            <div className="font-mono">
              <span className="text-[10px] text-slate-400 block uppercase font-bold mb-0.5">{textLabel("USD Price", "Mutengo paUSD", "Intengo yeUSD")}</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                ${listing.priceUSD.toLocaleString()}
              </p>
            </div>
            <div className="text-right font-mono border-l border-slate-800 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase font-bold mb-0.5">{textLabel("Local equivalence", "Mari yeZiG", "I-ZiG Elingana layo")}</span>
              <p className="text-lg font-bold text-blue-400">
                ZiG {listing.priceZWL.toFixed(0)}
              </p>
              <p className="text-[9px] text-slate-500">
                {textLabel("Based on standard rates", "Kubata chiyero chanhasi", "Kusiya ngezinga lalamuhla (Rates)")}
              </p>
            </div>
          </div>

          {/* Secure Escrow protection details */}
          <div className="bg-emerald-950/45 border border-emerald-900 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{textLabel("Secure Escrow Shield", "ZimMart Escrow inodzivirira", "ZimMart Escrow Shield evikelekileyo")}</h4>
              <p className="text-[11px] text-emerald-200 leading-normal">
                {t.escrowNote}
              </p>
            </div>
          </div>

          {/* Action trigger buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              id="btn-detail-pay-escrow"
              onClick={onOpenPayment}
              className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer leading-none uppercase"
            >
              <ShieldCheck className="w-4 h-4 animate-pulse" />
              {t.btnBuy}
            </button>

            <button
              id="btn-detail-message"
              onClick={handleMessageClick}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none uppercase"
            >
              <MessageSquare className="w-4 h-4" />
              {t.btnMessage}
            </button>
          </div>
        </div>
      </div>

      {/* Description & specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-100">
        
        {/* Left pane: description */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-sm tracking-wide text-slate-800 uppercase">
              {textLabel("Product Details", "Tsananguro nezvechinhu ichi", "Ubufakazi ngempahla")}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Tags */}
          {listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {listing.tags.map(tag => (
                <span key={tag} className="text-[9px] font-mono font-bold bg-slate-150 text-slate-600 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Shipping choices */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm tracking-wide text-slate-800 uppercase flex items-center gap-1">
              <Truck className="w-4.5 h-4.5 text-slate-500" />
              <span>{textLabel("Logistics & Pickup Options", "Kugashira neMapeg", "Ukuthwala lokuthathela")}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listing.shippingOptions?.map(opt => (
                <div key={opt} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-150 text-xs text-slate-600 font-semibold bg-slate-50/50">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: Owner profile details */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-2xl p-4.5 space-y-4 self-start">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-1 leading-none">
            {textLabel("Seller Identification", "Zvemashoko eMutengesi", "Ubufakazi bomthengisi")}
          </h3>

          <div className="flex items-center gap-3">
            <img
              src={seller.avatar}
              alt={seller.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-bold text-sm text-slate-950">{seller.name}</h4>
                {seller.verified && (
                  <span className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold" title="Verified Seller Identity">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-450 font-mono mt-0.5">
                {t.joined}: {seller.joinedDate}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 border-t border-slate-150 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{t.verifiedStatus}:</span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                seller.verificationLevel === "Trusted"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-250"
              }`}>
                {seller.verificationLevel}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{t.reputation}:</span>
              <div className="flex items-center gap-1 font-bold">
                <span className="text-amber-500">★ {seller.rating}</span>
                <span className="text-slate-400">({seller.reviewCount} {textLabel("reviews", "ratings", "imibiko")})</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{t.completeness}:</span>
              <span className="font-mono font-bold text-slate-750">{seller.completenessScore}%</span>
            </div>
          </div>

          {/* Manual phone call reveal button */}
          <div className="pt-2 border-t border-slate-150">
            {revealPhone ? (
              <a
                id={`lnk-call-phone`}
                href={`tel:${seller.phone}`}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{seller.phone} (Call Now)</span>
              </a>
            ) : (
              <button
                id="btn-reveal-seller-phone"
                onClick={() => setRevealPhone(true)}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{t.btnCall}</span>
              </button>
            )}
            <p className="text-[9px] text-slate-400 text-center mt-1 leading-normal">
              {textLabel(
                "Verify condition details or location logistics via voice call.",
                "Bvunzai mibvunzo yese yepanyama kune runhare zviri nyore.",
                "Qinisekisa isimo sempahla kucingo olulula lamazwi."
              )}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
