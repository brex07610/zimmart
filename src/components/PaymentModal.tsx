import React, { useState } from "react";
import { Listing, PaymentMethod, Currency } from "../types";
import { CreditCard, Check, ShieldCheck, AlertCircle, Sparkles, Loader2, FileText, ArrowRight, Wallet, HelpCircle } from "lucide-react";

interface PaymentModalProps {
  listing: Listing;
  lang: "en" | "shona" | "ndebele";
  onClose: () => void;
  onPaymentSuccess: (method: PaymentMethod, invoiceRef: string) => void;
}

export default function PaymentModal({
  listing,
  lang,
  onClose,
  onPaymentSuccess
}: PaymentModalProps) {
  const isEn = lang === "en";
  const isShona = lang === "shona";
  const isNdebele = lang === "ndebele";

  const textLabel = (enVal: string, shVal: string, ndVal: string) => {
    if (isShona) return shVal;
    if (isNdebele) return ndVal;
    return enVal;
  };
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<"select" | "details" | "ussd" | "confirming" | "success">("select");
  const [phone, setPhone] = useState("0772123456");
  const [ussdPin, setUssdPin] = useState("");
  const [submittingInvoice, setSubmittingInvoice] = useState(false);
  const [bankRef, setBankRef] = useState("FBC-98317-ZW");
  const [proofImage, setProofImage] = useState<string | null>(null);

  const priceUSD = listing.priceUSD;
  const priceZWL = listing.priceZWL;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method === PaymentMethod.ECOCASH || method === PaymentMethod.ONEWALLET) {
      setStep("details");
    } else if (method === PaymentMethod.ZIPIT || method === PaymentMethod.BANK_TRANSFER) {
      setStep("details");
    } else if (method === PaymentMethod.CASH_ON_DELIVERY) {
      // Direct success
      setStep("confirming");
      setTimeout(() => {
        setStep("success");
      }, 1500);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("ussd");
  };

  const handleUssdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ussdPin) return;
    setStep("confirming");
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirming");
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  const finishPayment = () => {
    const refPrefix = selectedMethod === PaymentMethod.ECOCASH ? "ECO-" : "ZIP-";
    const refCode = refPrefix + Math.floor(100000 + Math.random() * 900000);
    if (selectedMethod) {
      onPaymentSuccess(selectedMethod, refCode);
    }
    onClose();
  };

  // EcoCash style CSS simulation container
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="payment-modal">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-white bg-slate-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">
                {textLabel("ZimMart Secure Escrow Payment", "Mashandiro emari muZimMart Escrow", "Ukubhadhala okuphephileyo ngeZimMart Escrow")}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Item: {listing.title.substring(0, 30)}...
              </p>
            </div>
          </div>
          <button
            id="btn-close-payment"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 font-semibold hover:bg-slate-800 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Panel */}
        <div className="p-5 text-slate-100">
          
          {step === "select" && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-900 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-200 leading-normal">
                  {textLabel(
                    "Escrow protection is active. The seller will only receive their payout once you inspect the item and click 'Confirm Delivery'.",
                    "Mari yako inochengetezwa neZimMart Escrow zvakachengeteka kusvika waongorora chinhu chawagashira.",
                    "Imbhalo ye-Escrow isebenza khona manje. Umthengisi uphiwa imali yakhe nxa usuhlolisise njalo wavuma ukuthi uyitholile impahla yakho."
                  )}
                </p>
              </div>

              {/* Price summary block */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-mono">{textLabel("To Pay (USD)", "Kubhadhara mudhora", "Ukubhadhala ngetshwana (USD)")}</span>
                  <p className="text-2xl font-bold font-mono text-emerald-400">${priceUSD.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase font-mono">{textLabel("Equiv (ZiG)", "Mari yeZiG", "I-ZiG Elingana layo")}</span>
                  <p className="text-lg font-bold font-mono text-blue-400">ZiG {priceZWL.toFixed(0)}</p>
                </div>
              </div>

              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                {textLabel("Select payment gateway:", "Sarudza mabhadharirwo:", "Khetha indlela yokubhadala:")}
              </h4>

              <div className="space-y-2">
                {/* EcoCash */}
                <button
                  id="pay-choice-ecocash"
                  onClick={() => handleMethodSelect(PaymentMethod.ECOCASH)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-90 text-left transition-all hover:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-900/60 border border-blue-700 flex items-center justify-center font-black text-amber-400 font-mono text-xs">
                      Eco
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">EcoCash Express</p>
                      <p className="text-[10px] text-slate-400">{textLabel("Instant USSD PIN trigger", "Ndokubvunza PIN pafoni ipapo", "Kuvezwa USSD PIN prompt kucingo lwakho")}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* ZIPIT */}
                <button
                  id="pay-choice-zipit"
                  onClick={() => handleMethodSelect(PaymentMethod.ZIPIT)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-90 text-left transition-all hover:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-900/60 border border-emerald-700 flex items-center justify-center font-bold text-emerald-400 text-xs">
                      ZIPIT
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">ZIPIT Bank Routing</p>
                      <p className="text-[10px] text-slate-400">{textLabel("Real-time bank transfers", "Kutakura mari neBank pakarepo", "Ukuthumela imali yebhanga ngalesosikhathi")}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Manual Bank */}
                <button
                  id="pay-choice-bank"
                  onClick={() => handleMethodSelect(PaymentMethod.BANK_TRANSFER)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-90 text-left transition-all hover:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-750 flex items-center justify-center font-bold text-slate-400 text-xs">
                      Bank
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{textLabel("Manual Bank Deposit & Pop", "Kuendesa kuBank nekurovera bumbiro", "Ukufaka Imali ngeBhanga ulethe isitifiketi")}</p>
                      <p className="text-[10px] text-slate-400">{textLabel("Upload proof of payment", "Isa chitambi chinoratidza payment", "Thumela ubufakazi bokubhadala")}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Cash on Delivery */}
                <button
                  id="pay-choice-cod"
                  onClick={() => handleMethodSelect(PaymentMethod.CASH_ON_DELIVERY)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-90 text-left transition-all hover:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-900/60 border border-orange-700 flex items-center justify-center font-bold text-orange-400 text-xs text-center">
                      COD
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{textLabel("Cash on Delivery", "Mari mumaoko pakusvika", "Imali esandleni nxa ifika")}</p>
                      <p className="text-[10px] text-slate-400">{textLabel("Hand over physical cash to driver", "Ipai mari mumaoko emutyairi", "Nika umtshayeli imali yakho ngesandla")}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {step === "details" && selectedMethod === PaymentMethod.ECOCASH && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center mb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase">EcoCash Gateway Request</span>
                <p className="text-xl font-extrabold text-amber-400 mt-1 font-mono">${priceUSD} USD equivalent</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  {textLabel("EcoCash Registered Mobile Number:", "Nhamba ye EcoCash yakanyoreswa:", "Inombolo Yefoni Ye-EcoCash Ebhalisiweyo:")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs font-mono">
                    +263
                  </div>
                  <input
                    id="input-payment-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="772123456"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-14 pr-4 text-sm font-semibold font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-1.5">
                  {textLabel(
                    "Enter your number (e.g. 772123456). A prompt will request your EcoCash security PIN on your screen.",
                    "Isa nhamba mbozha yako. Papassword ye EcoCash inozozvibvunza pafoni yako ikozvino.",
                    "Faka inombolo yefoni (e.g. 772123456). I-prompt izacela i-EcoCash PIN yakho kucingo lwakho."
                  )}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  id="btn-back-payment"
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex-1 py-3 text-xs bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 rounded-xl font-bold cursor-pointer"
                >
                  {textLabel("Back", "Kudzoka", "Emuva")}
                </button>
                <button
                  id="btn-trigger-ussd"
                  type="submit"
                  className="flex-1 py-3 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-extrabold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-spin" />
                  {textLabel("Trigger USSD Prompt", "Bvunza PIN pafoni", "Bvulela i-USSD Prompt")}
                </button>
              </div>
            </form>
          )}

          {step === "ussd" && (
            <div className="py-6 flex flex-col items-center justify-center relative">
              {/* Floating USSD popup box to replicate local mobile behavior */}
              <div className="bg-slate-100 text-slate-900 border-2 border-slate-300 rounded-2xl w-full max-w-xs shadow-2xl p-4 flex flex-col font-mono" id="ussd-prompt-box">
                <div className="text-xs text-slate-500 border-b border-slate-200 pb-1.5 mb-2 font-bold text-center">
                  📱 [ EcoCash Prompt ]
                </div>
                <p className="text-xs text-slate-800 font-bold leading-relaxed mb-3.5">
                  ZimMart Escrow: Pay ${priceUSD} USD (ZiG {priceZWL.toFixed(0)}) for "{listing.title.substring(0,25)}". Enter 4-digit PIN to confirm:
                </p>
                <form onSubmit={handleUssdSubmit} className="space-y-3">
                  <input
                    id="input-ussd-pin"
                    type="password"
                    maxLength={4}
                    required
                    placeholder="••••"
                    value={ussdPin}
                    onChange={e => setUssdPin(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-lg tracking-widest bg-white border-2 border-emerald-600 focus:border-emerald-700 rounded-lg py-1.5 font-bold focus:outline-none"
                    autoFocus
                  />
                  <div className="flex gap-2 text-xs font-bold pt-1">
                    <button
                      id="btn-ussd-cancel"
                      type="button"
                      onClick={() => setStep("details")}
                      className="flex-1 py-1.5 bg-slate-200 border border-slate-300 hover:bg-slate-300 text-slate-700 rounded-lg cursor-pointer"
                    >
                      {textLabel("Cancel", "Misa", "Misa")}
                    </button>
                    <button
                      id="btn-ussd-confirm"
                      type="submit"
                      disabled={ussdPin.length < 4}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg cursor-pointer"
                    >
                      {textLabel("Send PIN", "Maka PIN", "Thumela i-PIN")}
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-[10px] text-slate-400 mt-4 animate-pulse">
                {textLabel("Waiting for USSD PIN feedback...", "Kumirira mhinduro ye hand-held device...", "Kubululwe ukuthola impendulo ye-PIN...")}
              </p>
            </div>
          )}

          {step === "details" && selectedMethod === PaymentMethod.BANK_TRANSFER && (
            <form onSubmit={handleBankSubmit} className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">ZimMart FBC Bank Account</span>
                <div className="text-xs space-y-1 text-slate-300">
                  <p><strong>Bank:</strong> FBC Bank Limited</p>
                  <p><strong>Account Name:</strong> ZimMart Escrow Trust</p>
                  <p><strong>USD Account:</strong> 4839812-32984-USD</p>
                  <p><strong>ZiG Account:</strong> 4839812-32984-ZIG</p>
                  <p><strong>Branch Code:</strong> 4102 (Nelson Mandela Branch)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  {textLabel("Bank Transaction Reference Code:", "Reference ye Transaction:", "Inombolo Ye-Reference Ye-Bhanga:")}
                </label>
                <input
                  id="input-bank-ref"
                  type="text"
                  required
                  value={bankRef}
                  onChange={e => setBankRef(e.target.value)}
                  placeholder="e.g. FBC-98317-ZW"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  {textLabel("Upload Proof of Payment (POP):", "Kanda mufananidzo wechirango (Receipt):", "Thumela Ubufakazi Bokubhadala (POP):")}
                </label>
                <div className="border border-dashed border-slate-800 bg-slate-900/60 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-900" onClick={() => setProofImage("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400")}>
                  {proofImage ? (
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs">
                      <Check className="w-4 h-4" />
                      <span>{textLabel("POP attached successfully", "Chirango chakandwa!", "I-POP ifakwe kahle")}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <FileText className="w-5 h-5 mx-auto text-slate-500" />
                      <p className="text-[11px] text-slate-400">
                        {textLabel("Click to simulate attaching receipt photo", "Dzvanya kuti uise mufananidzo wechirango", "Dzvanya lapha ukuze ufake isitifiketi photo")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  id="btn-bank-back"
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex-1 py-3 text-xs bg-slate-900 border border-slate-800 text-slate-400 rounded-xl font-bold cursor-pointer"
                >
                  {textLabel("Back", "Kudzoka", "Emuva")}
                </button>
                <button
                  id="btn-bank-submit"
                  type="submit"
                  className="flex-1 py-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-extrabold cursor-pointer"
                >
                  {textLabel("Submit Audit POP", "Tumira Gwaro rekuti waBhadhara", "Thumela ubufakazi beBhanga")}
                </button>
              </div>
            </form>
          )}

          {step === "confirming" && (
            <div className="py-10 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <div className="text-center">
                <p className="font-bold text-sm tracking-tight">
                  {textLabel("Reconciling Ledger Ledger Gateway...", "Kutsandura kutengeserwa kuresiti...", "Ukuvumelanisa izinkokhelo kuleger...")}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {textLabel("Syncing Escrow Holds secure ledger...", "Kuvharira mari muZimMart Escrow Trust...", "Ukugcina imali ku-ZimMart Escrow...")}
                </p>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-950/80 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <Check className="w-10 h-10 animate-scale-up" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-lg text-white">
                  {textLabel("Payment Successfully Escrowed!", "Mari Yakachengetedzwa Zvakakwana!", "Imali Ifakwe Kahle Kwi-Escrow!")}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {textLabel(
                    "ZimMart has secured your funds in escrow trust. We have notified the seller to prepare your items for pickup/delivery!",
                    "ZimMart yachengetedza mari yako zvakachengeteka. Taudza mutengesi kuti agadzirire zvaunoda kutora kana kuburitsa!",
                    "I-ZimMart yagcina imali yakho ngokuphephileyo. Siyalele umthengisi ukuthi aqalise ukulungisa izinto zakho!"
                  )}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 max-w-xs mx-auto text-left font-mono text-[10px] text-slate-300 space-y-1">
                <p><strong>Invoice ID:</strong> ZM-INV-32890</p>
                <p><strong>Amount Escrowed:</strong> ${priceUSD} USD / ZiG {priceZWL.toFixed(0)}</p>
                <p><strong>Payment Status:</strong> FUNDS HELD TRUSTEE</p>
                <p><strong>Buyer Protection:</strong> 100% Guaranteed</p>
              </div>

              <button
                id="btn-finish-payment"
                onClick={finishPayment}
                className="w-full max-w-xs py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-md"
              >
                {textLabel("Return to Marketplace", "Kudzokera kuMusika", "Buyela emaketheni")}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
