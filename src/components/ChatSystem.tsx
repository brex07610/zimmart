import React, { useState, useEffect, useRef } from "react";
import { Conversation, Message, User, ConnectionSpeed } from "../types";
import { Send, Image, ShieldAlert, Check, Clock, AlertCircle, Sparkles, Languages, AlertTriangle } from "lucide-react";
import { TRANSLATIONS } from "../data/translations";

interface ChatSystemProps {
  conversations: Conversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  currentUser: User;
  connectionSpeed: ConnectionSpeed;
  lang: "en" | "shona" | "ndebele";
  onSendMessage: (listingId: string, content: string) => void;
  onSimulateReply: (listingId: string) => void;
}

export default function ChatSystem({
  conversations,
  activeChatId,
  onSelectChat,
  currentUser,
  connectionSpeed,
  lang,
  onSendMessage,
  onSimulateReply
}: ChatSystemProps) {
  const isEn = lang === "en";
  const isShona = lang === "shona";
  const isNdebele = lang === "ndebele";
  const t = TRANSLATIONS[lang];

  const textLabel = (enVal: string, shVal: string, ndVal: string) => {
    if (isShona) return shVal;
    if (isNdebele) return ndVal;
    return enVal;
  };
  const [typedMessage, setTypedMessage] = useState("");
  const [isTypingSim, setIsTypingSim] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find(c => c.id === activeChatId);
  const isOffline = connectionSpeed === ConnectionSpeed.OFFLINE;
  const is2G = connectionSpeed === ConnectionSpeed.EXTREME_2G;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;
    onSendMessage(activeChat.listingId, typedMessage);
    setTypedMessage("");
  };

  const handleTemplateClick = (templateText: string) => {
    if (!activeChat) return;
    onSendMessage(activeChat.listingId, templateText);
  };

  // Scroll to bottom when conversation messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages.length, activeChatId]);

  // Simulate typing indicator briefly when simulation is triggered
  const triggerAutoReplySim = () => {
    if (!activeChat) return;
    setIsTypingSim(true);
    setTimeout(() => {
      setIsTypingSim(false);
      onSimulateReply(activeChat.listingId);
    }, 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[550px]" id="chat-system">
      {/* Conversation List */}
      <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/55">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">{t.tabMessages}</span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isOffline ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
              {isOffline ? t.offline : "Gateway Connected"}
            </span>
          </div>
          {isOffline && (
            <div className="px-2 py-0.5 bg-rose-955 text-rose-400 text-[9px] rounded-md font-mono flex items-center gap-0.5 border border-rose-900">
              <AlertCircle className="w-3 h-3" />
              Offline Buffer Active
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-slate-150/50">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 leading-relaxed">
              No conversations started yet. Go to Browse and click "Message Seller" to start chatting!
            </div>
          ) : (
            conversations.map(chat => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const isSelected = chat.id === activeChatId;
              
              return (
                <button
                  id={`chat-item-${chat.id}`}
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left p-3.5 flex gap-3 transition-colors ${
                    isSelected ? "bg-emerald-50/40 border-l-4 border-emerald-600" : "hover:bg-slate-100/50"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.otherUser.avatar}
                      alt={chat.otherUser.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-slate-100 shadow-sm">
                      <img
                        src={chat.listingImage}
                        alt="Product"
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-md object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {chat.otherUser.name}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-600 mb-1 truncate">
                      {chat.listingTitle} ({t.category}: {chat.listingId.startsWith("list-") ? "USD $" + chat.listingPriceUSD : "USD"})
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMessage ? lastMessage.content : "Mhoroi, I'm interested..."}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeChat.otherUser.avatar}
                alt={activeChat.otherUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-bold text-sm text-slate-900">{activeChat.otherUser.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    activeChat.otherUser.verificationLevel === "Trusted" 
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}>
                    {activeChat.otherUser.verificationLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Selling: <strong className="text-slate-800">{activeChat.listingTitle}</strong> • <span className="text-emerald-700 font-semibold">${activeChat.listingPriceUSD} USD</span> / <span className="text-blue-700 font-semibold">ZiG {(activeChat.listingPriceUSD * 25.12).toFixed(0)}</span>
                </p>
              </div>
            </div>

            {/* Quick Simulation Reply button */}
            <button
              id="btn-simulate-partner-reply"
              onClick={triggerAutoReplySim}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              {textLabel("Simulate Client Reply", "Mhinduro yeMuchengeti", "Phendula Njengomthengi")}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30">
            {activeChat.messages.map((msg, index) => {
              const isMine = msg.senderId === currentUser.id;
              
              return (
                <div key={msg.id || index} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl p-3 shadow-xs ${
                    isMine 
                      ? "bg-slate-900 text-slate-100 rounded-tr-none" 
                      : "bg-emerald-50 text-slate-900 border border-emerald-100 rounded-tl-none"
                  }`}>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMine && (
                        <span>
                          {msg.isSynced ? (
                            <Check className="w-3 h-3 text-emerald-400 inline" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-400 inline animate-pulse" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTypingSim && (
              <div className="flex justify-start">
                <div className="bg-emerald-50 text-slate-500 rounded-2xl p-3 shadow-xs rounded-tl-none flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-mono">{textLabel("Chido is typing...", "Chido ari kunyora...", "UChido uyaloba...")}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Network offline warning inside chat */}
          {isOffline && (
            <div className="bg-rose-50 border-t border-b border-rose-100 px-4 py-2 flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0 shrink" />
              <p className="text-[10px]">
                {t.chatIsOffline}
              </p>
            </div>
          )}

          {/* Chat templates */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5">
            <button
              id="template-still-available"
              onClick={() => handleTemplateClick(textLabel("Is this still available?", "Ichipo muHarare?", "Kusekhona yini lokhu?"))}
              className="text-[10px] border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 py-1 px-2.5 rounded-full transition-colors cursor-pointer"
            >
              {textLabel("Is this still available?", "Ichipo?", "Kusekhona yini?")}
            </button>
            <button
              id="template-lowest-price"
              onClick={() => handleTemplateClick(textLabel("What's your lowest USD price?", "Pane musiyano pane mari muUSD?", "Yimalini yakho yokugcina ngeUSD?"))}
              className="text-[10px] border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 py-1 px-2.5 rounded-full transition-colors cursor-pointer"
            >
              {textLabel("What's the lowest price?", "Musiyano pane mari?", "Yimalini yokugcina?")}
            </button>
            <button
              id="template-where-meet"
              onClick={() => handleTemplateClick(textLabel("Can we meet at a public place in Harare?", "Togona kusangana kupi munharaunda?", "Sihlangane phi endaweni evulekileyo?"))}
              className="text-[10px] border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 py-1 px-2.5 rounded-full transition-colors cursor-pointer"
            >
              {textLabel("Where can we meet?", "Kusangana kupi?", "Sihlangane phi?")}
            </button>
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2" id="chat-form">
            <input
              id="input-chat-content"
              type="text"
              placeholder={textLabel("Write a message...", "Nyora mhinduro pano...", "Bhala umlayezo...")}
              value={typedMessage}
              onChange={e => setTypedMessage(e.target.value)}
              className="flex-1 bg-slate-100 hover:bg-slate-200/60 focus:bg-white border-0 focus:ring-2 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs text-slate-950 transition-colors focus:outline-none"
            />
            <button
              id="btn-chat-send"
              type="submit"
              disabled={!typedMessage.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-slate-50/20">
          <Languages className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-slate-900 mb-1">{textLabel("Interactive Negotiation Center", "Hurukuro dzeMusika", "Ikhasi Lezingxoxo")}</p>
          <p className="text-xs text-slate-500 max-w-xs">{t.chatBlank}</p>
        </div>
      )}
    </div>
  );
}
