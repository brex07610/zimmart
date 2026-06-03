import React, { useState, useEffect } from "react";
import { 
  User, Listing, Conversation, Message, Condition, Status, 
  Currency, PaymentMethod, ConnectionSpeed, Review, SavedSearch,
  ZimNotification
} from "./types";
import { 
  CATEGORIES, SUBURBS, ALL_LOCATIONS, MOCK_USERS, MOCK_REVIEWS, 
  INITIAL_LISTINGS, MOCK_CHATS, ZIM_CURRENCY_RATE 
} from "./data/mockData";
import { TRANSLATIONS } from "./data/translations";

// Components
import ConnectionSimulator from "./components/ConnectionSimulator";
import ChatSystem from "./components/ChatSystem";
import PaymentModal from "./components/PaymentModal";
import SellerDashboard from "./components/SellerDashboard";
import ListingCard from "./components/ListingCard";
import ListingDetail from "./components/ListingDetail";

// Icons
import { 
  Search, Sliders, Globe, Signal, Award, ShieldCheck, 
  Plus, MessageSquare, LayoutDashboard, HelpCircle, 
  UserCheck, AlertCircle, ShoppingBag, Eye, Heart, ListFilter,
  CheckCircle, ArrowUpRight, Camera, HelpCircle as HelpIcon, Sparkles,
  Bell, BellOff, X, Trash2
} from "lucide-react";

const INITIAL_NOTIFICATIONS: ZimNotification[] = [
  {
    id: "notif-1",
    title: "Welcome to ZimMart!",
    titleShona: "Tikugamuchirai kuZimMart!",
    titleNdebele: "Siyalamukela kuZimMart!",
    description: "Your local trusted community marketplace built optimized for low data.",
    descriptionShona: "Musika wenzvimbo yenyu wakasimbiswa kushanda nedata shoma.",
    descriptionNdebele: "Imakethe yendawo yenu eyakhelwe ukonga idata nxa isetshenziswa.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    isRead: false,
    type: "info"
  },
  {
    id: "notif-2",
    title: "EcoCash Escrow Active",
    titleShona: "ZimMart Escrow Inoshanda",
    titleNdebele: "I-Escrow ye-ZimMart iyasebenza",
    description: "Secure your transactions today. Try purchasing a Solar panel in high trust.",
    descriptionShona: "Dzivirirai kutenga kwenyu nhasi neZimMart Escrow payo.",
    descriptionNdebele: "Vikela ukuthenga kwakho lalamuhla ngeZimMart Escrow.",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    isRead: true,
    type: "escrow"
  }
];

const SIMULATED_NEW_POSTS = [
  {
    title: "Decko 150W Solar Panel (Pre-wired)",
    titleShona: "Decko 150W Solar Panel (Kubatanidza Magetsi)",
    titleNdebele: "I-Decko 150W Solar Panel",
    description: "Brand new high-efficiency solar panels. Excellent for load shedding backup systems and rural installation.",
    descriptionShona: "Magetsi ezuva (Solar panel) matsva anozunza mashandiro asina matambudziko mumusha.",
    descriptionNdebele: "Amaphanyela e-solar amatsha alungele ukukhanyisa emakhaya nxa kumnyama.",
    category: "solar",
    priceUSD: 45,
    location: "Borrowdale, Harare",
    condition: Condition.NEW,
    sellerName: "Tinashe",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Fresh Farm Grade-A Cabbages (Crate of 50)",
    titleShona: "Makabichi Matsva Kubva Kumunda (Crate ye 50)",
    titleNdebele: "Amakhabhishi Amatsha avela eSivandeni (Khreyithi ye 50)",
    description: "Harvested this morning. Direct from field. Discount for bulk purchase of 5 crates or more.",
    descriptionShona: "Makabichi akachekwa mangwanani anhasi kubva kumunda emuriwo wedu.",
    descriptionNdebele: "Amakhabhishi asikwe lamuhla ekuseni avela ensimini, kumnandi mpo.",
    category: "farming",
    priceUSD: 18,
    location: "Chitungwiza, Harare",
    condition: Condition.GOOD,
    sellerName: "Mercy",
    image: "https://images.unsplash.com/photo-1548550022-c14194096a60?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Toyota Hilux D4D Fuel Filter (Double Cab)",
    titleShona: "Toyota Hilux D4D Fuel Filter (Sefa Yemafuta)",
    titleNdebele: "Hilux D4D Fuel Filter eya Toyota",
    description: "Genuine OEM replacement filter. Packaged, never opened. Leftover from my fleet service.",
    descriptionShona: "Sefa yepasina kushandiswa yemafuta. Yakachengetedzeka mubhokisi rayo.",
    descriptionNdebele: "Isefa yamafutha entsha yedha ya-Toyota Hilux, isemgqonyeni wayo.",
    category: "vehicles",
    priceUSD: 25,
    location: "Bulawayo CBD",
    condition: Condition.NEW,
    sellerName: "Farai",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "EcoStar 2-Burner Tabletop Gas Stove",
    titleShona: "Chitofu cheGasi chemitsetse miviri (Tabletop)",
    titleNdebele: "Isitofu seGasi esilama-Burner amabili",
    description: "Saves high-cost pre-paid electricity. Works perfectly, including hose and 5kg gas tank accessory bundle.",
    descriptionShona: "Inochengetedza magetsi anodhura muZimbabwe. Inoshanda zvakanaka chaizvo netangi yegasi.",
    descriptionNdebele: "Silondoloza amagesi abiza imali enengi. Sisebenza kuhle kakhulu sile-cylinder yegasi.",
    category: "furniture",
    priceUSD: 65,
    location: "Avondale, Harare",
    condition: Condition.GOOD,
    sellerName: "Chipo",
    image: "https://images.unsplash.com/photo-1522012147041-30a112008767?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Farm Fresh Large Eggs (Crate of 30)",
    titleShona: "Mazai Matsva Mumuzi (Crate ye 30)",
    titleNdebele: "Amaqanda Amatsha avela eKhaya (Khreyithi ye 30)",
    description: "High quality protein direct from local poultry project in Westgate.",
    descriptionShona: "Mazai emhando yepamusoro-soro anotengeswa kubva pane re Westgate.",
    descriptionNdebele: "Amaqanda amnandi avela kuphurojekithi yapasitomu e-Westgate.",
    category: "farming",
    priceUSD: 4,
    location: "Westgate, Harare",
    condition: Condition.NEW,
    sellerName: "Rufaro",
    image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=400"
  }
];

export default function App() {
  // Locale state
  const [lang, setLang] = useState<"en" | "shona" | "ndebele">("en");
  const t = TRANSLATIONS[lang];
  const isEn = lang === "en";

  // Base state databases (hydrated from localStorage if available, else mocks)
  const [listings, setListings] = useState<Listing[]>(() => {
    const cached = localStorage.getItem("zimmart_listings");
    return cached ? JSON.parse(cached) : INITIAL_LISTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const cached = localStorage.getItem("zimmart_chats");
    return cached ? JSON.parse(cached) : MOCK_CHATS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const cached = localStorage.getItem("zimmart_user");
    return cached ? JSON.parse(cached) : MOCK_USERS["user-1"]; // Logged in as User 1 by default
  });

  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  // Connection throttle state
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>(ConnectionSpeed.ONLINE);
  const [dataSavedKB, setDataSavedKB] = useState(0);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"shop" | "sell" | "messages" | "dashboard" | "help">("shop");
  
  // Selection states
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Search & Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<Condition | "">("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "priceLow" | "priceHigh" | "views">("newest");
  const [showFilters, setShowFilters] = useState(false);

  // User details verification drawer
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Liked/Wishlisted Items state
  const [likedList, setLikedList] = useState<string[]>(["list-1", "list-4"]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Listing form draft states
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("solar");
  const [formPriceUSD, setFormPriceUSD] = useState("");
  const [formCondition, setFormCondition] = useState<Condition>(Condition.NEW);
  const [formLocation, setFormLocation] = useState("Avondale, Harare");
  const [formShipping, setFormShipping] = useState<string[]>(["Pickup"]);
  const [formUploadedImage, setFormUploadedImage] = useState<string | null>(null);

  // Auto-save notification for drafts
  const [draftSavedAlert, setDraftSavedAlert] = useState(false);

  // Trigger toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize localStorage when Listings change
  useEffect(() => {
    localStorage.setItem("zimmart_listings", JSON.stringify(listings));
  }, [listings]);

  // Synchronize localStorage when Chats change
  useEffect(() => {
    localStorage.setItem("zimmart_chats", JSON.stringify(conversations));
  }, [conversations]);

  // Synchronize User profile details
  useEffect(() => {
    localStorage.setItem("zimmart_user", JSON.stringify(currentUser));
  }, [currentUser]);

  // Notifications state
  const [notifications, setNotifications] = useState<ZimNotification[]>(() => {
    const cached = localStorage.getItem("zimmart_notifications");
    return cached ? JSON.parse(cached) : INITIAL_NOTIFICATIONS;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<"all" | "new_product" | "system">("all");

  // Synchronize notifications to localStorage
  useEffect(() => {
    localStorage.setItem("zimmart_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Notifications logic helper
  const addNotification = (
    title: string,
    titleShona: string,
    titleNdebele: string,
    desc: string,
    descShona: string,
    descNdebele: string,
    type: "info" | "new_product" | "escrow" | "message" = "info",
    listingId?: string
  ) => {
    const newNotif: ZimNotification = {
      id: "notif-" + Date.now() + Math.random().toString(36).substr(2, 4),
      title,
      titleShona,
      titleNdebele,
      description: desc,
      descriptionShona: descShona,
      descriptionNdebele: descNdebele,
      listingId,
      createdAt: new Date().toISOString(),
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Simulate other user listing dynamic publication
  const simulateOtherUserPost = () => {
    const randomProduct = SIMULATED_NEW_POSTS[Math.floor(Math.random() * SIMULATED_NEW_POSTS.length)];
    const randomId = "list-sim-" + Date.now();
    
    const newListing: Listing = {
      id: randomId,
      userId: "user-sim-" + Math.random().toString(36).substr(2, 4),
      sellerName: randomProduct.sellerName,
      title: randomProduct.title,
      description: randomProduct.description,
      category: randomProduct.category,
      priceUSD: randomProduct.priceUSD,
      priceZWL: randomProduct.priceUSD * ZIM_CURRENCY_RATE,
      images: [randomProduct.image],
      location: randomProduct.location,
      condition: randomProduct.condition,
      status: Status.ACTIVE,
      views: Math.floor(Math.random() * 5) + 1,
      likes: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1050).toISOString(),
      shippingOptions: ["Pickup", "Direct Seller Delivery"],
      tags: [randomProduct.category, randomProduct.location.split(",")[0].toLowerCase().trim()]
    };

    setListings(prev => [newListing, ...prev]);

    addNotification(
      "New Product Alert!",
      "Kune Chinhu Chitsva Mumusika!",
      "Kulempahla Entsha Emaketheni!",
      `${randomProduct.sellerName} just posted: '${randomProduct.title}' in ${randomProduct.location} for $${randomProduct.priceUSD}.`,
      `${randomProduct.sellerName} aisa chinhu: '${randomProduct.titleShona}' mu${randomProduct.location} nemari inosvika $${randomProduct.priceUSD}. Dzvanya kuti uone!`,
      `U${randomProduct.sellerName} ufake impahla: '${randomProduct.titleNdebele}' e${randomProduct.location} ngentengo ye $${randomProduct.priceUSD}. Dzvanya lapha!`,
      "new_product",
      randomId
    );

    const toastMsgs = {
      en: `🔔 New Notification: ${randomProduct.sellerName} just listed '${randomProduct.title}'!`,
      shona: `🔔 Kune Chitsva: ${randomProduct.sellerName} aisa '${randomProduct.titleShona}'!`,
      ndebele: `🔔 Isaziso Esitsha: U${randomProduct.sellerName} ufake '${randomProduct.titleNdebele}'!`
    };
    
    triggerToast(toastMsgs[lang] || toastMsgs["en"]);
  };

  // Background automated postings simulator
  useEffect(() => {
    if (connectionSpeed === ConnectionSpeed.OFFLINE) return;
    
    // Auto post every 70 seconds
    const interval = setInterval(() => {
      simulateOtherUserPost();
    }, 70000);
    
    return () => clearInterval(interval);
  }, [connectionSpeed, lang, listings]);

  const renderNotificationDropdown = (placement: "desktop" | "mobile") => {
    return (
      <div 
        id={`notif-dropdown-${placement}`} 
        className={`absolute mt-3 w-[280px] xs:w-[330px] sm:w-[400px] bg-slate-950 border border-slate-850 rounded-2xl shadow-2xl z-50 text-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200 ${
          placement === "desktop" ? "right-0" : "-right-12 xs:right-0"
        }`}
      >
        <div className="p-3 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="font-semibold text-[10px] uppercase tracking-wider font-mono">
              {lang === "en" ? "Live Alerts" : lang === "shona" ? "Yambiro" : "Izaziso Zalomuhla"}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                triggerToast(lang === "en" ? "All alerts marked read" : "Zvese zvaverengwa!");
              }}
              className="text-[10px] text-emerald-450 hover:underline font-bold cursor-pointer"
            >
              {lang === "en" ? "Mark all read" : lang === "shona" ? "Maka zvese" : "Khombisa konke kufundwe"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(false);
              }}
              className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Simulation triggers inside dropdown with Zimbabwe context */}
        <div className="p-2 bg-slate-900/40 border-b border-slate-900 flex items-center justify-between gap-1">
          <span className="text-[9px] text-slate-405 font-medium font-mono leading-none">
            {lang === "en" ? "🇿🇼 Simulate peer listings:" : "🇿🇼 Edza kuona vamwe vachitengesa:"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              simulateOtherUserPost();
            }}
            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-[9px] font-bold text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Sparkles className="w-2.5 h-2.5" />
            {lang === "en" ? "Trigger Post" : "Tumira Chinhu"}
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto divide-y divide-slate-900/60 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <BellOff className="w-8 h-8 mx-auto mb-2 opacity-35" />
              <p className="text-[10px] font-medium leading-normal">
                {lang === "en" ? "No new notifications. Items listed by peers will show up here." : "Hapana yambiro itsva panguva ino."}
              </p>
            </div>
          ) : (
            notifications.map(notif => {
              const isUnread = !notif.isRead;
              const notifTitle = lang === "shona" ? notif.titleShona : lang === "ndebele" ? notif.titleNdebele : notif.title;
              const notifDesc = lang === "shona" ? notif.descriptionShona : lang === "ndebele" ? notif.descriptionNdebele : notif.description;
              
              return (
                <div 
                  key={notif.id} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                    if (notif.listingId) {
                      setSelectedListingId(notif.listingId);
                      setActiveTab("shop");
                      setShowNotifications(false);
                    }
                  }}
                  className={`p-2.5 text-left transition-colors cursor-pointer flex items-start gap-2 ${
                    isUnread ? "bg-slate-900/50 font-medium border-l-2 border-emerald-500" : "bg-transparent hover:bg-slate-900/30"
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {notif.type === "new_product" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" />
                    ) : notif.type === "escrow" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 block" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-[10.5px] leading-tight ${isUnread ? "text-white font-bold" : "text-slate-300"}`}>
                        {notifTitle}
                      </p>
                      <span className="text-[8px] text-slate-500 font-mono shrink-0">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {notifDesc}
                    </p>
                    
                    {notif.listingId && (
                      <span className="inline-block text-[9px] text-emerald-400 hover:underline font-bold pt-0.5">
                        {lang === "en" ? "View listing →" : lang === "shona" ? "Dzvanya uone →" : "Dzvanya lapha →"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-2 border-t border-slate-900 text-center bg-slate-950">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotifications([]);
                triggerToast(lang === "en" ? "Cleared notifications history" : "Zvese zvabviswa padhesiki!");
              }}
              className="text-[10px] text-rose-450 hover:text-rose-400 font-bold transition-all cursor-pointer"
            >
              {lang === "en" ? "Clear all history" : "Tsvaira zvese nhoroondo"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Connection transition sync logic!
  // Triggered when connection toggles back from OFFLINE/SLOW speeds to ONLINE
  useEffect(() => {
    if (connectionSpeed === ConnectionSpeed.ONLINE) {
      // Find unsynced messages and flush them
      let unsyncedCount = 0;
      const updatedConversations = conversations.map(c => {
        const updatedMsgs = c.messages.map(m => {
          if (!m.isSynced) {
            unsyncedCount++;
            return { ...m, isSynced: true };
          }
          return m;
        });
        return { ...c, messages: updatedMsgs };
      });

      if (unsyncedCount > 0) {
        setConversations(updatedConversations);
        triggerToast(
          lang === "en" 
            ? `📶 Connection Restored! Sent ${unsyncedCount} cached offline message(s) successfully.` 
            : `📶 Netiweki Madzoka! Meseji ${unsyncedCount} zvangatumirwa zvakanaka kubva muQueue.`
        );
      }
    }

    // Accumulate synthetic data savings counter based on connection speed selections
    if (connectionSpeed === ConnectionSpeed.SLOW_3G) {
      setDataSavedKB(prev => prev + 184); // Adding synthetic data savings
    } else if (connectionSpeed === ConnectionSpeed.EXTREME_2G) {
      setDataSavedKB(prev => prev + 512);
    }
  }, [connectionSpeed]);

  // Auto-save Draft simulation when posting listing
  useEffect(() => {
    if (formTitle.trim() || formDesc.trim()) {
      const timer = setTimeout(() => {
        setDraftSavedAlert(true);
        setTimeout(() => setDraftSavedAlert(false), 2000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [formTitle, formDesc, formCategory, formPriceUSD]);

  // --- Handlers ---

  // Handle Likes Wishlist
  const handleLikeToggle = (listingId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedList(prev => {
      const exists = prev.includes(listingId);
      if (exists) {
        triggerToast(lang === "en" ? "Removed from Wishlist" : "Zvakabviswa mune Unofarira");
        return prev.filter(id => id !== listingId);
      } else {
        triggerToast(lang === "en" ? "Saved to local Wishlist" : "Zvaturwa mune Unofarira!");
        return [...prev, listingId];
      }
    });
  };

  // Handle Messaging Sender Channel
  const handleSendMessage = (listingId: string, content: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    const newMessage: Message = {
      id: "msg-" + Date.now(),
      senderId: currentUser.id,
      receiverId: listing.userId,
      listingId: listingId,
      content: content,
      isRead: false,
      timestamp: new Date().toISOString(),
      // Message is synced immediately if online, else buffered offline
      isSynced: connectionSpeed !== ConnectionSpeed.OFFLINE
    };

    // Find if conversation already exists
    const existingConvIdx = conversations.findIndex(c => c.listingId === listingId && c.otherUser.id === listing.userId);

    const updatedConversations = [...conversations];

    if (existingConvIdx > -1) {
      updatedConversations[existingConvIdx].messages.push(newMessage);
      updatedConversations[existingConvIdx].lastMessage = newMessage;
    } else {
      const otherSeller = MOCK_USERS[listing.userId] || {
        id: listing.userId,
        name: listing.sellerName,
        avatar: "https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?auto=format&fit=crop&q=80&w=200",
        phone: "0772111222",
        email: "seller@zimmart.co.zw",
        verified: true,
        verificationLevel: "Verified",
        rating: 4.5,
        reviewCount: 4,
        joinedDate: "Feb 2025",
        completenessScore: 70
      };

      const newConv: Conversation = {
        id: "chat-" + Date.now(),
        listingId: listingId,
        listingTitle: listing.title,
        listingImage: listing.images[0],
        listingPriceUSD: listing.priceUSD,
        otherUser: otherSeller,
        messages: [newMessage],
        lastMessage: newMessage
      };
      updatedConversations.push(newConv);
      setActiveChatId(newConv.id);
    }

    setConversations(updatedConversations);

    if (connectionSpeed === ConnectionSpeed.OFFLINE) {
      triggerToast(
        lang === "en" 
          ? "📬 Offline! Message saved securely to Outbox sync queue." 
          : "📬 Hausi paNetiweki! Meseji yachengetwa muOutbox sync queue."
      );
    }
  };

  // Simulate other party counter reply directly (Simulation control center!)
  const handleSimulateReply = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    const repliesList = [
      lang === "en" 
        ? "Mhoroi! Yes, the item has full warranties. I accept payment either on EcoCash or ZIPIT." 
        : "Salibonani! Ichipo chose. Ndinogashira EcoCash kana ZIPIT zvikuru.",
      lang === "en"
        ? "The price is competitive but I can adjust it slightly. Let's arrange meetup at Chitungwiza town center."
        : "Tinogona kudzikisa mutengo zvishoma. Togona kusangana pachitoro kuChitungwiza.",
      lang === "en"
        ? "Perfect transfer received! I will lock this in escrow status and ship to you tonight."
        : "Ndaona payment ye EcoCash! Ndiri kugadzirira kutumira parizvano."
    ];

    const randomWord = repliesList[Math.floor(Math.random() * repliesList.length)];

    const simulatedMessage: Message = {
      id: "msg-sim-" + Date.now(),
      senderId: listing.userId, // From seller
      receiverId: currentUser.id,
      listingId: listingId,
      content: randomWord,
      isRead: false,
      timestamp: new Date().toISOString(),
      isSynced: true
    };

    const updatedConversations = conversations.map(c => {
      if (c.listingId === listingId) {
        return {
          ...c,
          messages: [...c.messages, simulatedMessage],
          lastMessage: simulatedMessage
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    triggerToast(lang === "en" ? "📩 New message received!" : "📩 Une meseji itsva!");
  };

  // Chat initiation shortcut from Detail view
  const handleInitiateChat = (sellerId: string, listingId: string) => {
    const existing = conversations.find(c => c.listingId === listingId);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      // Build mock baseline conversation
      const listing = listings.find(l => l.id === listingId);
      if (!listing) return;

      const baseMessage: Message = {
        id: "msg-init-" + Date.now(),
        senderId: currentUser.id,
        receiverId: sellerId,
        listingId: listingId,
        content: lang === "en" ? "Mhoro, I am interested in this item. Is it available?" : "Mhoroi, ndiri kufarira chinhu ichi. Ichipo?",
        isRead: true,
        timestamp: new Date().toISOString(),
        isSynced: true
      };

      const otherSeller = MOCK_USERS[sellerId] || {
        id: sellerId,
        name: listing.sellerName,
        avatar: "https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?auto=format&fit=crop&q=80&w=200",
        phone: "0772483120",
        email: "seller@zimmart.co.zw",
        verified: true,
        verificationLevel: "Verified",
        rating: 4.8,
        reviewCount: 9,
        joinedDate: "Mar 2024",
        completenessScore: 80
      };

      const newConv: Conversation = {
        id: "chat-init-" + Date.now(),
        listingId: listingId,
        listingTitle: listing.title,
        listingImage: listing.images[0],
        listingPriceUSD: listing.priceUSD,
        otherUser: otherSeller,
        messages: [baseMessage],
        lastMessage: baseMessage
      };

      setConversations(prev => [...prev, newConv]);
      setActiveChatId(newConv.id);
    }
    setActiveTab("messages");
  };

  // Payment triggers escrow update
  const handlePaymentSuccess = (method: PaymentMethod, invoiceRef: string) => {
    if (!selectedListingId) return;

    // Set listing in local listings database to SOLD or PENDING_ESCROW to preserve workflow
    const updatedListings = listings.map(l => {
      if (l.id === selectedListingId) {
        return { ...l, status: Status.PENDING_ESCROW };
      }
      return l;
    });
    setListings(updatedListings);
    
    triggerToast(
      lang === "en" 
        ? `🎉 Payment Secured! Invoice ${invoiceRef} held in secure escrow trust.` 
        : `🎉 Badhadharo Yakachengetedzwa! Invoice ${invoiceRef} yavharirwa zvakazara muEscrow.`
    );
  };

  // Interactive Verification documentation uploader triggers completeness score increase
  const toggleDocVerification = (docType: "id" | "residence") => {
    setCurrentUser(prev => {
      const isIdUploaded = docType === "id" ? !prev.idDocumentSubmitted : prev.idDocumentSubmitted;
      const isResUploaded = docType === "residence" ? !prev.proofOfResidenceSubmitted : prev.proofOfResidenceSubmitted;
      
      // Calculate completeness score
      let score = 40; // Base score
      if (isIdUploaded) score += 30;
      if (isResUploaded) score += 30;

      const level = score === 100 ? "Trusted" : score >= 70 ? "Verified" : "Unverified";

      return {
        ...prev,
        idDocumentSubmitted: isIdUploaded,
        proofOfResidenceSubmitted: isResUploaded,
        completenessScore: score,
        verified: score >= 70,
        verificationLevel: level
      };
    });

    triggerToast(lang === "en" ? "Profile completeness score updated!" : "Chikamu cheProfile chawedzera!");
  };

  // Bulk rate ZiG prices multiplier adjusting tool from seller dashboard
  const handleBulkAdjustRates = (exchangeRate: number) => {
    const updated = listings.map(item => {
      // Multiply USD base price by current exchange rate input
      return {
        ...item,
        priceZWL: item.priceUSD * exchangeRate
      };
    });
    setListings(updated);
    triggerToast(
      lang === "en" 
        ? `Currency adjustment complete at 1 USD = ${exchangeRate} ZiG!` 
        : `Mitengo yashandurwa zvizere kuita 1 USD = ${exchangeRate} ZiG!`
    );
  };

  // Direct sellers listing indicators: Mark sold / delete / renew
  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    triggerToast(lang === "en" ? "Listing removed from ZimMart database." : "Chinhu chabviswa mumusika.");
  };

  const handleMarkSold = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: Status.SOLD } : l));
    triggerToast(lang === "en" ? "Awesome! Marked as sold." : "Maka kuti Zvatengeswa!");
  };

  const handleRenewListing = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: Status.ACTIVE } : l));
    triggerToast(lang === "en" ? "Listing extended for 60-day window." : "Nguva yeMazuva makumi matanhatu yawedzerwa.");
  };

  // Create Listing Submit Action Handler
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formPriceUSD) {
      triggerToast("Error: Missing title or price.");
      return;
    }

    // Set dynamic thumbnail based on folder selection
    let assetImg = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400";
    if (formCategory === "solar") assetImg = "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400";
    if (formCategory === "farming") assetImg = "https://images.unsplash.com/photo-1548550022-c14194096a60?auto=format&fit=crop&q=80&w=400";
    if (formCategory === "electronics") assetImg = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400";
    if (formCategory === "groceries") assetImg = "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400";
    if (formCategory === "vehicles") assetImg = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400";
    if (formCategory === "furniture") assetImg = "https://images.unsplash.com/photo-1522012147041-30a112008767?auto=format&fit=crop&q=80&w=400";

    const newListing: Listing = {
      id: "list-" + Date.now(),
      userId: currentUser.id,
      sellerName: currentUser.name,
      title: formTitle,
      description: formDesc || "No full description added.",
      category: formCategory,
      priceUSD: parseFloat(formPriceUSD),
      priceZWL: parseFloat(formPriceUSD) * ZIM_CURRENCY_RATE,
      images: [formUploadedImage || assetImg],
      location: formLocation,
      condition: formCondition,
      status: Status.ACTIVE,
      views: 1,
      likes: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      shippingOptions: formShipping,
      tags: [formCategory, formLocation.split(",")[0].toLowerCase().trim()]
    };

    setListings(prev => [newListing, ...prev]);
    triggerToast(lang === "en" ? "🎉 Listing published live to the platform!" : "🎉 Chinhu chaburitswa live padhesiki reMusika!");
    
    addNotification(
      "Your Listing is Live!",
      "Chinhu chako chapinda live!",
      "Impahla yakho isiphumile emaketheni!",
      `You successfully listed '${formTitle}' in '${formLocation}' for $${parseFloat(formPriceUSD).toLocaleString()} USD.`,
      `Mabuda mave nekutengesa kwe '${formTitle}' mu '${formLocation}' nemutengo we $${parseFloat(formPriceUSD).toLocaleString()} USD.`,
      `Ufaka kuhle impahla '${formTitle}' e '${formLocation}' ngentengo ye $${parseFloat(formPriceUSD).toLocaleString()} USD.`,
      "new_product",
      newListing.id
    );

    // Clear form
    setFormTitle("");
    setFormDesc("");
    setFormPriceUSD("");
    
    // Redirect to Shop main view
    setActiveTab("shop");
  };

  // --- Filtering & Sorting computation ---
  const filteredListings = listings.filter(item => {
    // Fulltext matches Title or Description or tags
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchTags = item.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    // Category
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;

    // Location (suburb/city)
    if (selectedLocation && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;

    // Condition
    if (selectedCondition && item.condition !== selectedCondition) return false;

    // Min price
    if (priceMin && item.priceUSD < parseFloat(priceMin)) return false;

    // Max price
    if (priceMax && item.priceUSD > parseFloat(priceMax)) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "priceLow") {
      return a.priceUSD - b.priceUSD;
    }
    if (sortBy === "priceHigh") {
      return b.priceUSD - a.priceUSD;
    }
    if (sortBy === "views") {
      return b.views - a.views;
    }
    return 0;
  });

  const selectedListing = listings.find(l => l.id === selectedListingId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900" id="app-root">
      
      {/* Toast Overlay alert popup */}
      {toastMessage && (
        <div id="toast-notification" className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-900 text-slate-100 px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-slate-800 z-50 animate-bounce cursor-pointer" onClick={() => setToastMessage(null)}>
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Primary Header Area */}
      <header className="bg-slate-950 border-b border-slate-900 sticky top-0 z-40 text-slate-100" id="main-header">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-xl flex items-center justify-center font-black text-slate-950 font-display text-lg shadow-md border border-emerald-500">
                ZM
              </div>
              <div>
                <h1 className="font-display font-extrabold text-lg text-white leading-none">
                  {t.appName}
                </h1>
                <p className="text-[9px] text-slate-400 font-medium font-mono lowercase tracking-tight mt-0.5">
                  {t.appSlogan}
                </p>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="btn-lang-toggle-mobile"
                onClick={() => setLang(prev => prev === "en" ? "shona" : prev === "shona" ? "ndebele" : "en")}
                className="p-1 px-2 border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 transition-colors text-[10px] font-bold font-mono tracking-wide"
              >
                {lang === "en" ? "🇿🇼 Shona" : lang === "shona" ? "🇿🇼 Ndebele" : "🇬🇧 English"}
              </button>

              {/* Mobile Notification Bell */}
              <div className="relative">
                <button
                  id="btn-notif-bell-mobile"
                  onClick={() => setShowNotifications(prev => !prev)}
                  className="relative p-1 px-2 border border-slate-800 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[8px] px-1 py-0.5 rounded-full animate-pulse">
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>
                {showNotifications && renderNotificationDropdown("mobile")}
              </div>
              
              <button
                id="btn-profile-trigger-mobile"
                onClick={() => setShowProfileModal(true)}
                className="relative cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950" />
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Switch */}
            <button
              id="btn-lang-toggle-desktop"
              onClick={() => setLang(prev => prev === "en" ? "shona" : prev === "shona" ? "ndebele" : "en")}
              className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-855 rounded-xl text-xs font-bold text-slate-300 font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{lang === "en" ? "Mitauro: Shona" : lang === "shona" ? "Ulimi: Ndebele" : "Language: English"}</span>
            </button>

            {/* Connectivity Speed status pill */}
            <div className="px-3 py-1 bg-slate-900 border border-slate-800/80 rounded-xl flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  connectionSpeed === ConnectionSpeed.OFFLINE ? "bg-rose-400" : "bg-emerald-400"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  connectionSpeed === ConnectionSpeed.OFFLINE ? "bg-rose-500" : "bg-emerald-500"
                }`}></span>
              </span>
              <span className="text-[10px] font-mono text-slate-350">{connectionSpeed}</span>
            </div>

            {/* Desktop Notification Bell */}
            <div className="relative">
              <button
                id="btn-notif-bell-desktop"
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative p-2 bg-slate-900 border border-slate-800 hover:bg-slate-855 rounded-xl text-slate-350 transition-colors flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              >
                <Bell className="w-3.5 h-3.5" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full ring-1 ring-slate-950 animate-pulse">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              {showNotifications && renderNotificationDropdown("desktop")}
            </div>

            {/* Profile trigger card wrapper */}
            <button
              id="btn-profile-trigger-desktop"
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 p-1.5 pl-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-855 rounded-xl transition-colors cursor-pointer text-left"
            >
              <div className="text-right">
                <p className="text-xs font-bold text-white tracking-tight">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[9px] text-slate-400 uppercase font-mono">{currentUser.verificationLevel}</span>
                  <span className="text-[9px] text-emerald-400 font-bold">({currentUser.completenessScore}%)</span>
                </div>
              </div>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
              />
            </button>
          </div>

        </div>
      </header>

      {/* Primary Layout Wrapper */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-5 flex-1 flex flex-col gap-6" id="app-main">
        
        {/* Core Layout: Grid of Throttler & Navigation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left Column: Connectivity Sim + Sub Navigation tabs */}
          <div className="space-y-4 lg:col-span-1">
            
            {/* Simulation Widget */}
            <ConnectionSimulator
              currentSpeed={connectionSpeed}
              onChangeSpeed={setConnectionSpeed}
              lang={lang}
              dataSavedKB={dataSavedKB}
            />

            {/* Suburb / City filtering mini widget inside Shop tab only */}
            {activeTab === "shop" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs" id="quick-filters">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                    {isEn ? "Community Filters" : "Masefa emuNharaunda"}
                  </span>
                  <button
                    id="btn-toggle-filters"
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Category select */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">{t.category}</label>
                    <select
                      id="select-category-filter"
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-slate-800 transition-colors focus:outline-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {lang === "en" ? cat.name : cat.shona}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Suburb select */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">{t.location}</label>
                    <select
                      id="select-suburb-filter"
                      value={selectedLocation}
                      onChange={e => setSelectedLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-slate-800 transition-colors focus:outline-none"
                    >
                      <option value="">{isEn ? "All Suburbs (Mutare/Harare)" : "Nharaunda dzose"}</option>
                      {ALL_LOCATIONS.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  {showFilters && (
                    <div className="space-y-3 pt-2.5 border-t border-slate-100 animate-slide-down">
                      {/* Conditions */}
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">{t.condition}</label>
                        <select
                          id="select-condition-filter"
                          value={selectedCondition}
                          onChange={e => setSelectedCondition(e.target.value as Condition)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-2 px-3 text-xs text-slate-800 transition-colors focus:outline-none"
                        >
                          <option value="">{isEn ? "Any Condition" : "Pasinei nemamiriro"}</option>
                          <option value={Condition.NEW}>Brand New</option>
                          <option value={Condition.LIKE_NEW}>Like New</option>
                          <option value={Condition.GOOD}>Good</option>
                          <option value={Condition.FAIR}>Fair</option>
                        </select>
                      </div>

                      {/* Price limits */}
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">{t.priceRange} (USD)</label>
                        <div className="flex items-center gap-2">
                          <input
                            id="input-price-min"
                            type="number"
                            placeholder="Min"
                            value={priceMin}
                            onChange={e => setPriceMin(e.target.value)}
                            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                          />
                          <input
                            id="input-price-max"
                            type="number"
                            placeholder="Max"
                            value={priceMax}
                            onChange={e => setPriceMax(e.target.value)}
                            className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reset Filters action */}
                  <button
                    id="btn-reset-filters"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedLocation("");
                      setSelectedCondition("");
                      setPriceMin("");
                      setPriceMax("");
                      setSearchQuery("");
                      triggerToast("Filters cleared");
                    }}
                    className="w-full mt-1.5 py-2 text-center border border-slate-150 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {isEn ? "Reset Filters" : "Gadzirisa zvakare sefa"}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Dynamic central workspace based on Tab selection */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Desktop Navigation menu bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-2.5 flex flex-wrap gap-1 md:gap-2 shadow-md shrink-0" id="navbar-tabs">
              <button
                id="tab-button-shop"
                onClick={() => { setActiveTab("shop"); setSelectedListingId(null); }}
                className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "shop" ? "bg-emerald-600 shadow-sm text-slate-950 scale-102 font-extrabold" : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.tabShop}</span>
              </button>

              <button
                id="tab-button-sell"
                onClick={() => { setActiveTab("sell"); setSelectedListingId(null); }}
                className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "sell" ? "bg-emerald-600 shadow-sm text-slate-950 scale-102 font-extrabold" : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{t.tabSell}</span>
              </button>

              <button
                id="tab-button-messages"
                onClick={() => { setActiveTab("messages"); setSelectedListingId(null); }}
                className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "messages" ? "bg-emerald-600 shadow-sm text-slate-950 scale-102 font-extrabold" : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.tabMessages}</span>
              </button>

              <button
                id="tab-button-dashboard"
                onClick={() => { setActiveTab("dashboard"); setSelectedListingId(null); }}
                className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "dashboard" ? "bg-emerald-600 shadow-sm text-slate-950 scale-102 font-extrabold" : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t.tabDashboard}</span>
              </button>

              <button
                id="tab-button-help"
                onClick={() => { setActiveTab("help"); setSelectedListingId(null); }}
                className={`flex-1 py-3 px-4 rounded-xl text-center font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "help" ? "bg-emerald-600 shadow-sm text-slate-950 scale-102 font-extrabold" : "hover:bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>{t.tabHelp}</span>
              </button>
            </div>

            {/* TAB: BROWSE SHOP */}
            {activeTab === "shop" && (
              <div className="space-y-6" id="panel-shop">
                
                {/* Search Bar / full-text indexing panel */}
                {!selectedListingId && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2 shadow-xs" id="search-bar-wrap">
                    <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <input
                      id="input-main-search"
                      type="text"
                      className="flex-1 text-slate-900 border-0 focus:outline-none focus:ring-0 text-xs text-slate-850"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                    
                    {searchQuery && (
                      <button
                        id="btn-clear-search"
                        onClick={() => setSearchQuery("")}
                        className="text-slate-400 hover:text-slate-900 font-bold px-2 text-xs"
                      >
                        ✕
                      </button>
                    )}

                    {/* Sorting criteria */}
                    <div className="border-l border-slate-150 pl-3 hidden sm:flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">{t.sortBy}</span>
                      <select
                        id="select-sort-order"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="bg-transparent border-0 font-bold text-[11px] text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="newest">{t.newest}</option>
                        <option value="priceLow">{t.priceLowHigh}</option>
                        <option value="priceHigh">{t.priceHighLow}</option>
                        <option value="views">{t.viewsDesc}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Listing Workspaces */}
                {selectedListingId && selectedListing ? (
                  <ListingDetail
                    listing={selectedListing}
                    seller={MOCK_USERS[selectedListing.userId] || MOCK_USERS["user-1"]}
                    currentUser={currentUser}
                    lang={lang}
                    connectionSpeed={connectionSpeed}
                    onBack={() => setSelectedListingId(null)}
                    onInitiateChat={handleInitiateChat}
                    onOpenPayment={() => setIsPaymentOpen(true)}
                    isLiked={likedList.includes(selectedListing.id)}
                    onLikeToggle={() => handleLikeToggle(selectedListing.id)}
                  />
                ) : (
                  <div className="space-y-4">
                    
                    {/* Category Carousel filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" id="category-carousel">
                      {CATEGORIES.map(cat => {
                        const isSel = selectedCategory === cat.id;
                        return (
                          <button
                            id={`btn-cat-carousel-${cat.id}`}
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                              isSel 
                                ? "bg-slate-900 border-slate-800 text-white" 
                                : "bg-white border-slate-150 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span>{lang === "en" ? cat.name : cat.shona}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Grid List */}
                    {filteredListings.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-xs">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-pulse" />
                        <p className="font-bold text-slate-800 text-sm">
                          {isEn ? "No listings found matching your search." : "Hatina kuwana zvinhu zvawatsvaga."}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                          {isEn 
                            ? "Try adjusting filters or checking the suburb selectors for surrounding community listings." 
                            : "Gadzirisai dhesiki resefa renharaunda kuti muone zvimwe zviri pamusika."}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="listings-grid">
                        {filteredListings.map(item => (
                          <ListingCard
                            key={item.id}
                            listing={item}
                            lang={lang}
                            connectionSpeed={connectionSpeed}
                            onSelect={setSelectedListingId}
                            onLikeToggle={handleLikeToggle}
                            isLiked={likedList.includes(item.id)}
                          />
                        ))}
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* TAB: POST A LISTING (Farming, solar panel system, gas stoves) */}
            {activeTab === "sell" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs" id="panel-sell">
                
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-950 uppercase">{t.tabSell}</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {isEn ? "Sell to the wider community of Chitungwiza, Harare or Bulawayo CBD." : "Tengesera vagari vemumatunhu muZimbabwe zviri nyore."}
                    </p>
                  </div>
                  {draftSavedAlert && (
                    <span className="text-[10px] uppercase font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 animate-pulse font-bold">
                      ✓ Auto-saved Draft
                    </span>
                  )}
                </div>

                <form onSubmit={handlePublishListing} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">
                        {isEn ? "Product / Service Title:" : "Zita reChinhu chiri kuTengeswa:"}
                      </label>
                      <input
                        id="input-form-title"
                        type="text"
                        required
                        maxLength={80}
                        placeholder={isEn ? "e.g. Day-old Boschveld Roadrunner Chicks" : "Mabiki eHuku dzeroadrunners..."}
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">
                        {isEn ? "Description & Specifications:" : "Tsananguro yakajeka:"}
                      </label>
                      
                      {/* Interactive generator prefill */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <button
                          id="btn-auto-draft-description"
                          type="button"
                          onClick={() => {
                            setFormDesc(
                              lang === "en" 
                                ? `Premium condition, highly reliable for load shedding. Fully checked and authentic. Sourced locally in Zimbabwe. Delivery is fully available upon escrow holding clearance. Star rating highly respected.` 
                                : `Mamiriro akanaka chose, akakwana kutengwa nekuparidza mutengo. Tinoendesa mumawoko emutungamiriri panongovhurika payment ye escrow.`
                            );
                            triggerToast("Prefilled authentic template!");
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] rounded-lg tracking-wide uppercase font-mono flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                          {isEn ? "Autofill Description AI Tool" : "Pedzisa manyorero neAI"}
                        </button>
                      </div>

                      <textarea
                        id="textarea-form-desc"
                        rows={4}
                        placeholder={isEn ? "Describe specs, condition, weight, measurements, or installation support..." : "Tsanangurai zvese nezvechinhu ichi pano..."}
                        value={formDesc}
                        onChange={e => setFormDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">{t.category}</label>
                      <select
                        id="select-form-category"
                        value={formCategory}
                        onChange={e => setFormCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none transition-colors"
                      >
                        <option value="solar">Solar & Power Systems</option>
                        <option value="farming">Farming & Livestock</option>
                        <option value="electronics">Phones & Electronics</option>
                        <option value="groceries">Food & Bulk groceries</option>
                        <option value="vehicles">Vehicles & Parts</option>
                        <option value="furniture">Furniture & Home Gas</option>
                        <option value="clothing">Boutique & Shoes</option>
                        <option value="services">Custom Services</option>
                      </select>
                    </div>

                    {/* Condition */}
                    <div>
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">{t.condition}</label>
                      <select
                        id="select-form-condition"
                        value={formCondition}
                        onChange={e => setFormCondition(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none transition-colors"
                      >
                        <option value={Condition.NEW}>Brand New (Itsva)</option>
                        <option value={Condition.LIKE_NEW}>Like New (Inenge Itsva)</option>
                        <option value={Condition.GOOD}>Good (Yakanaka)</option>
                        <option value={Condition.FAIR}>Fair (Inoshanda mamiriro)</option>
                        <option value={Condition.PARTS}>For Parts/Repair (Zvikamu chete)</option>
                      </select>
                    </div>

                    {/* Numeric USD Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">
                        {isEn ? "USD Price Target:" : "Mutengo paUSD:"}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold font-mono text-xs">$</span>
                        <input
                          id="input-form-price"
                          type="number"
                          required
                          placeholder="e.g. 150"
                          value={formPriceUSD}
                          onChange={e => setFormPriceUSD(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl py-2.5 pl-8 pr-12 text-xs text-slate-900 font-mono focus:outline-none transition-colors"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 text-[10px] font-bold">USD</span>
                      </div>
                      {formPriceUSD && (
                        <p className="text-[10px] text-blue-700 font-bold mt-1">
                          ZiG equivalent: ~{(parseFloat(formPriceUSD) * ZIM_CURRENCY_RATE).toFixed(0)} ZiG (at current rate)
                        </p>
                      )}
                    </div>

                    {/* Suburd Location */}
                    <div>
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">{t.location} suburb:</label>
                      <select
                        id="select-form-location"
                        value={formLocation}
                        onChange={e => setFormLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none transition-colors"
                      >
                        {ALL_LOCATIONS.map(suburb => (
                          <option key={suburb} value={suburb}>{suburb}</option>
                        ))}
                      </select>
                    </div>

                    {/* Logistics choices checkboxes */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-2">
                        {isEn ? "Logistics/Delivery Support:" : "Mabasa ekutakura zvinhu:"}
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 font-semibold text-slate-650">
                        {["Pickup", "ZimMart Delivery", "Direct Seller Delivery"].map(opt => {
                          const hasOpt = formShipping.includes(opt);
                          return (
                            <button
                              id={`btn-shipping-opt-${opt.replace(/\s+/g, '-').toLowerCase()}`}
                              key={opt}
                              type="button"
                              onClick={() => {
                                if (hasOpt) {
                                  setFormShipping(prev => prev.filter(p => p !== opt));
                                } else {
                                  setFormShipping(prev => [...prev, opt]);
                                }
                              }}
                              className={`p-2 border rounded-xl flex items-center justify-center text-center transition-all cursor-pointer text-[11px] ${
                                hasOpt 
                                  ? "bg-slate-900 border-slate-900 text-white font-bold" 
                                  : "bg-slate-50 border-slate-250 text-slate-500 hover:bg-slate-100"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Photo upload simulator */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-650 uppercase mb-1">
                        {isEn ? "Item Pictures (Max 5, low bandwidth auto-compressed):" : "Mifananidzo yeChinhu:"}
                      </label>
                      <div 
                        id="photo-uploader-drag-zone"
                        onClick={() => {
                          setFormUploadedImage("https://images.unsplash.com/photo-1620021650175-cf1aa2af9df5?auto=format&fit=crop&q=80&w=400");
                          triggerToast("High-quality compressed placeholder photo attached.");
                        }}
                        className="border-2 border-dashed border-slate-250 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        {formUploadedImage ? (
                          <div className="flex flex-col items-center gap-2">
                            <img src={formUploadedImage} alt="Uploaded" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                            <span className="text-[11px] text-emerald-600 font-bold">✓ Picture Attached & Compressed (74 KB instead of 2.1 MB!)</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Camera className="w-7 h-7 mx-auto text-slate-400" />
                            <p className="text-xs font-bold text-slate-700">{isEn ? "Simulate Photo Upload" : "Simudzira mufananidzo wepanharaunda"}</p>
                            <p className="text-[10px] text-slate-400 leading-normal">
                              {isEn ? "Drag & drop or click. ZimMart compresses assets by 85% automatically to save your prepaid cell data budgets." : "ZimMart inosvinanisa mifananidzo ne 85% kudzivirira kuparadzwa kwe data."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2 flex-col sm:flex-row">
                    <button
                      id="btn-form-publish"
                      type="submit"
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t.btnPublish}</span>
                    </button>
                    <button
                      id="btn-form-draft"
                      type="button"
                      onClick={() => {
                        triggerToast("Draft saved inside local memory storage successfully.");
                      }}
                      className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
                    >
                      {t.btnDraft}
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB: MESSAGING (ChatSystem implementation) */}
            {activeTab === "messages" && (
              <ChatSystem
                conversations={conversations}
                activeChatId={activeChatId}
                onSelectChat={setActiveChatId}
                currentUser={currentUser}
                connectionSpeed={connectionSpeed}
                lang={lang}
                onSendMessage={handleSendMessage}
                onSimulateReply={handleSimulateReply}
              />
            )}

            {/* TAB: SELLER DASHBOARD */}
            {activeTab === "dashboard" && (
              <SellerDashboard
                listings={listings.filter(l => l.userId === currentUser.id)}
                reviews={reviews}
                lang={lang}
                onDeleteListing={handleDeleteListing}
                onUpdateStatus={(id, newStatus) => {
                  setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
                  triggerToast(`Status updated to ${newStatus}`);
                }}
                onBulkAdjustRates={handleBulkAdjustRates}
                onMarkSold={handleMarkSold}
                onRenewListing={handleRenewListing}
              />
            )}

            {/* TAB: FAQ HELP */}
            {activeTab === "help" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-6" id="panel-help">
                <div>
                  <h2 className="text-lg font-extrabold tracking-tight text-slate-950 uppercase">{t.helpTitle}</h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {isEn ? "Learn how ZimMart fights scams with secure escrow hold guidelines & offline communication outboxes." : "Dzidzai kushandisa dhesiki reZimMart kudzivirira makoronyera mazuva ano."}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-3">
                    <HelpIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 mb-1 leading-snug uppercase tracking-tight">
                        {t.helpQ1}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.helpA1}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-3">
                    <HelpIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 mb-1 leading-snug uppercase tracking-tight">
                        {t.helpQ2}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.helpA2}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-start gap-3">
                    <HelpIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 mb-1 leading-snug uppercase tracking-tight">
                        {t.helpQ3}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {t.helpA3}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submitting user support reports */}
                <div className="border-t border-slate-150 pt-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-950 uppercase">
                      {isEn ? "Submit Support Ticket / Dispute Alert" : "Kumbira Ruponeso kana Chityisidzo"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isEn ? "Our Harare-based customer mediators resolve local transaction disputes within 24 hours." : "Vatongi veZimMart vanogadzirisa matambudziko enyu pasina siri 24 hrs."}
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); triggerToast("Ticket submitted. ID: TKT-18920"); }} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        id="input-ticket-email"
                        type="email"
                        required
                        placeholder="My Email Address"
                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                      <input
                        id="input-ticket-topic"
                        type="text"
                        required
                        placeholder="Issue Topic / Transaction ID"
                        className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      />
                    </div>
                    <textarea
                      id="input-ticket-message"
                      rows={3}
                      required
                      placeholder="Explain details of the dispute or report abusive users..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none"
                    />
                    <button
                      id="btn-ticket-submit"
                      type="submit"
                      className="py-2 px-4 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-850 cursor-pointer transition-colors"
                    >
                      {isEn ? "Submit Alert" : "Tumira Gwaro"}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-medium" id="main-footer">
        <p>© 2026 ZimMart Community Marketplace. Developed for safe ecommerce in Zimbabwe. Harare, Bulawayo & regional towns.</p>
      </footer>

      {/* DIALOGS */}

      {/* Secure Payment Escrow simulation modal */}
      {isPaymentOpen && selectedListing && (
        <PaymentModal
          listing={selectedListing}
          lang={lang}
          onClose={() => setIsPaymentOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Verification & Profile Completeness detail drawer */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in" id="profile-modal">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
            
            <div className="p-4 border-b border-slate-100 bg-slate-950 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">
                  {isEn ? "ZimMart Verification Center" : "Chiratidzo cheZimMart"}
                </h3>
              </div>
              <button
                id="btn-close-profile-modal"
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 font-semibold hover:bg-slate-850 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5">
              
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full border border-slate-200 object-cover"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-slate-900 leading-none">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-tight font-bold">
                    Profile Verification Level: <span className="text-emerald-600">{currentUser.verificationLevel}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">Joined: {currentUser.joinedDate}</p>
                </div>
              </div>

              {/* Progress bar completeness score */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">{t.completeness}:</span>
                  <span className="font-mono font-bold text-slate-800">{currentUser.completenessScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentUser.completenessScore}%` }}
                  />
                </div>
              </div>

              {/* Interactive ID document simulation toggles */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                  {t.submitDocs}
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  {t.submitDocsDesc}
                </p>

                <div className="space-y-2">
                  <button
                    id="btn-toggle-id-doc"
                    onClick={() => toggleDocVerification("id")}
                    className={`w-full p-3 border rounded-xl flex items-center justify-between text-left cursor-pointer transition-all ${
                      currentUser.idDocumentSubmitted 
                        ? "bg-emerald-50 border-emerald-350 text-emerald-800 font-bold" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">📂 {t.nationalId}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold">
                      {currentUser.idDocumentSubmitted ? "Submitted (Akatambirwa)" : "Tap to Attach (Dzvanya pano)"}
                    </span>
                  </button>

                  <button
                    id="btn-toggle-residence-doc"
                    onClick={() => toggleDocVerification("residence")}
                    className={`w-full p-3 border rounded-xl flex items-center justify-between text-left cursor-pointer transition-all ${
                      currentUser.proofOfResidenceSubmitted 
                        ? "bg-slate-90 text-emerald-800 font-bold bg-emerald-50 border-emerald-350" 
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🏠 {t.residenceProof}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono font-bold">
                      {currentUser.proofOfResidenceSubmitted ? "Submitted (Akatambirwa)" : "Tap to Attach (Dzvanya pano)"}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
