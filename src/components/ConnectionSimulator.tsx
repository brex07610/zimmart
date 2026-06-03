import React from "react";
import { ConnectionSpeed } from "../types";
import { Wifi, Signal, Award, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

interface ConnectionSimulatorProps {
  currentSpeed: ConnectionSpeed;
  onChangeSpeed: (speed: ConnectionSpeed) => void;
  lang: "en" | "shona" | "ndebele";
  dataSavedKB: number;
}

export default function ConnectionSimulator({
  currentSpeed,
  onChangeSpeed,
  lang,
  dataSavedKB
}: ConnectionSimulatorProps) {
  const isEn = lang === "en";
  const isShona = lang === "shona";
  const isNdebele = lang === "ndebele";

  // Helper translations for inline text
  const textLabel = (enVal: string, shVal: string, ndVal: string) => {
    if (isShona) return shVal;
    if (isNdebele) return ndVal;
    return enVal;
  };

  const speedConfigs = [
    {
      speed: ConnectionSpeed.ONLINE,
      label: "4G / Wi-Fi",
      desc: textLabel(
        "High speed, uncompressed media",
        "Sanganisa nekukurumidza, pasina kuvharwa",
        "Isivinini esikhulu, izithombe zonke mpo"
      ),
      color: "bg-emerald-500",
      icon: Wifi,
      textClass: "text-emerald-400"
    },
    {
      speed: ConnectionSpeed.SLOW_3G,
      label: textLabel("3G Saver", "3G Data Saver", "3G Data Saver"),
      desc: textLabel(
        "50% image quality, moderate latency",
        "Svinanisa mifananidzo neimwe hafu",
        "Izithombe zincozi ngezansi, londoloza idata"
      ),
      color: "bg-blue-500",
      icon: Signal,
      textClass: "text-blue-400"
    },
    {
      speed: ConnectionSpeed.EXTREME_2G,
      label: textLabel("2G Text Saver", "2G Yakanyanya", "2G Encomise lolulotshwe"),
      desc: textLabel(
        "Skeletal text, click-to-load images",
        "Mavara chete, vhura mifananidzo nemaoko",
        "Izinto zokubhala kuphela, ulayishe isithombe ngesandla"
      ),
      color: "bg-amber-500",
      icon: Zap,
      textClass: "text-amber-400"
    },
    {
      speed: ConnectionSpeed.OFFLINE,
      label: textLabel("Offline Mode", "Offline zvachose", "Offline Mode"),
      desc: textLabel(
        "Local memory storage, outbox queue",
        "Inochengeta mubato dzozoendesa",
        "Gcina kucingo lwakho, kuthunyelwe nxa une connection"
      ),
      color: "bg-rose-500",
      icon: AlertTriangle,
      textClass: "text-rose-400"
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-xl" id="connection-simulator">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-800 text-amber-500 rounded-lg">
            <Signal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white">
              {textLabel("ZIMBABWE CONNECTIVITY LAB", "MAMIRIRO ENETIWEKI LAB", "IZIMBABWE CONNECTIVITY LAB")}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {textLabel("Live Throttling Simulator", "Mukana wekuedza Netiweki", "Isilinganisi se-Network Sim")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Award className="w-3 h-3" />
            {textLabel("Data Saver Active", "Data yakachengeteka", "Idata eyokulondoloza isebenza")}
          </span>
          {dataSavedKB > 0 && (
            <span className="text-xs font-mono text-emerald-400 mt-1 font-semibold">
              +{dataSavedKB.toFixed(0)} KB {textLabel("Saved", "Yakachenurika", "Ilondolozwe")}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        {textLabel(
          "Toggle network speeds to test how our platform dynamically compresses resources, saves expensive mobile data bundles, and stores offline transactions.",
          "Shandura mamiriro anotevera uone masanganisiro emuseji nemifananidzo kuti isapedze data rako rinodhura muZimbabwe.",
          "Shitsha isivinini senetwork ukuze ubone ukuthi isistimu yethu ilondoloza njani idata yebundle, iyeze i-compress izithombe nemilayezo."
        )}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {speedConfigs.map(item => {
          const isSelected = currentSpeed === item.speed;
          const Icon = item.icon;
          return (
            <button
               id={`btn-speed-${item.speed.replace(/\s+/g, '-').toLowerCase()}`}
              key={item.speed}
              onClick={() => onChangeSpeed(item.speed)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? "bg-slate-800 border-slate-700 ring-2 ring-emerald-500"
                  : "bg-slate-950 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="font-bold text-xs text-white">{item.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal mb-auto">{item.desc}</p>
              <div className="absolute right-2 bottom-2 text-slate-800 group-hover:text-slate-700 transition-colors">
                <Icon className="w-8 h-8 opacity-45" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[10px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">
            {textLabel("Smart Cache System:", "Mukana weCache:", "Isistimu ye-Cache:")}
          </strong>{" "}
          {textLabel(
            "When set to Offline, outward messages are kept safely in a Local IndexedDB buffer and instantly flushed when transitioning back to 4G/Wi-Fi.",
            "Kana uri offline, mameseji ako anochengetwa zvakgakanyatsodzivirirwa pafoni, ozoendesa ega kana netiweki ye 4G/Wi-Fi yadzoka.",
            "Nxa umakwe ngokuthi Offline, izinkulumo zakho zizabugcinwa ngokuphepha kucingo lwakho zize zithunyelwe nxa usuxhumeke ku-4G/Wi-Fi."
          )}
        </div>
      </div>
    </div>
  );
}
