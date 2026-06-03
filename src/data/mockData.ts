import { Listing, User, Condition, Status, Currency, Review } from "../types";

export const ZIM_CURRENCY_RATE = 25.12; // 1 USD = 25.12 ZiG (sample conversion rate)

export const CATEGORIES = [
  { id: "all", name: "All Categories", shona: "Zvese", ndebele: "Konke", icon: "Grid" },
  { id: "solar", name: "Solar & Power", shona: "Magetsi ezuva", ndebele: "Ezamagesi Elanga", icon: "Sun" },
  { id: "farming", name: "Farming & Livestock", shona: "Zvekurima", ndebele: "Ezolimo Lezifuyo", icon: "Sprout" },
  { id: "electronics", name: "Phones & Electronics", shona: "Nharembozha", ndebele: "Omakhalekhukhwini", icon: "Smartphone" },
  { id: "groceries", name: "Food & Essentials", shona: "Zvekudya", ndebele: "Ukudla leZidingo", icon: "ShoppingBag" },
  { id: "vehicles", name: "Vehicles & Spares", shona: "Motokari nezvikamu", ndebele: "Izimota lamaphathi", icon: "Car" },
  { id: "furniture", name: "Furniture & Gas Stoves", shona: "Zvemudzimba", ndebele: "Ifenitsha leZitofu zegasi", icon: "Flame" },
  { id: "clothing", name: "Clothing & Shoes", shona: "Zvekupfeka", ndebele: "Izembatho leZicathulo", icon: "UserRound" },
  { id: "services", name: "Community Services", shona: "Mabasa", ndebele: "Imisebenzi", icon: "Briefcase" }
];

export const SUBURBS = [
  // Harare
  { city: "Harare", suburbs: ["Avondale", "Borrowdale", "Mt Pleasant", "Chitungwiza", "Mbare", "Harare CBD", "Warren Park", "Westgate", "Hatfield"] },
  // Bulawayo
  { city: "Bulawayo", suburbs: ["Bulawayo CBD", "Kumalo", "Hillside", "Cowdray Park", "Makokoba"] },
  // Mutare
  { city: "Mutare", suburbs: ["Chikanga", "Sakubva", "Mutare CBD"] },
  // Gweru
  { city: "Gweru", suburbs: ["Mkoba", "Senga", "Gweru CBD"] }
];

// Helper to flatten suburbs for lists
export const ALL_LOCATIONS = SUBURBS.flatMap(cityGroup => 
  cityGroup.suburbs.map(suburb => `${suburb}, ${cityGroup.city}`)
);

export const MOCK_USERS: Record<string, User> = {
  "user-1": {
    id: "user-1",
    phone: "0772123456",
    email: "taona.m@zimmart.co.zw",
    name: "Taona Moyo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    verified: true,
    verificationLevel: "Trusted",
    rating: 4.9,
    reviewCount: 38,
    joinedDate: "Jan 2024",
    completenessScore: 100,
    idDocumentSubmitted: true,
    proofOfResidenceSubmitted: true
  },
  "user-2": {
    id: "user-2",
    phone: "0783987654",
    email: "chido.c@zimmart.co.zw",
    name: "Chido Chimonyo",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    verified: true,
    verificationLevel: "Verified",
    rating: 4.6,
    reviewCount: 19,
    joinedDate: "Mar 2024",
    completenessScore: 85,
    idDocumentSubmitted: true,
    proofOfResidenceSubmitted: false
  },
  "user-3": {
    id: "user-3",
    phone: "0712555666",
    email: "farai.g@zimmart.co.zw",
    name: "Farai Gumbo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    verified: true,
    verificationLevel: "Verified",
    rating: 4.2,
    reviewCount: 7,
    joinedDate: "Feb 2025",
    completenessScore: 75,
    idDocumentSubmitted: true,
    proofOfResidenceSubmitted: false
  },
  "user-4": {
    id: "user-4",
    phone: "0774222333",
    email: "tinashe.b@zimmart.co.zw",
    name: "Tinashe Bvute",
    avatar: "https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?auto=format&fit=crop&q=80&w=200",
    verified: false,
    verificationLevel: "Unverified",
    rating: 3.5,
    reviewCount: 3,
    joinedDate: "May 2026",
    completenessScore: 40,
    idDocumentSubmitted: false,
    proofOfResidenceSubmitted: false
  }
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    reviewerId: "user-2",
    reviewerName: "Chido Chimonyo",
    reviewerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    reviewedId: "user-1",
    listingId: "list-1",
    listingTitle: "5kVA Hybrid Solar Inverter System",
    rating: 5,
    comment: "Taona installed the system yesterday. Outstanding service! He even brought the EcoCash merchant code to verify payment on arrival.",
    categories: { communication: 5, accuracy: 5, shipping: 5, condition: 5 },
    createdAt: "2026-05-18T10:30:00Z",
    verifiedPurchase: true
  },
  {
    id: "rev-2",
    reviewerId: "user-3",
    reviewerName: "Farai Gumbo",
    reviewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    reviewedId: "user-1",
    listingId: "list-4",
    listingTitle: "Free-range Roadrunner Chickens (Month-old)",
    rating: 5,
    comment: "Very healthy roadrunners, highly recommended. Fast responses and neat cages. Met at Mbare Musika for pickup.",
    categories: { communication: 5, accuracy: 5, shipping: 4, condition: 5 },
    createdAt: "2026-05-25T14:15:00Z",
    verifiedPurchase: true
  },
  {
    id: "rev-3",
    reviewerId: "user-4",
    reviewerName: "Tinashe Bvute",
    reviewerAvatar: "https://images.unsplash.com/photo-1542103749-8ef59b94f4d3?auto=format&fit=crop&q=80&w=200",
    reviewedId: "user-2",
    listingId: "list-3",
    listingTitle: "Bulk Cooking Oil (12 x 2-Litre Pack)",
    rating: 4,
    comment: "Good wholesale deal. Transaction was quick. Delivery delayed slightly due to traffic in Chitungwiza, but great communication.",
    categories: { communication: 5, accuracy: 4, shipping: 3, condition: 4 },
    createdAt: "2026-06-01T08:00:00Z",
    verifiedPurchase: true
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "list-1",
    userId: "user-1",
    sellerName: "Taona Moyo",
    title: "5kVA Complete Hybrid Solar System (with Installation)",
    description: "Upgrade your power reliability with a complete 5kVA solar set up. Includes: 1x 5kVA Hybrid Growatt Inverter, 1x 4.8kWh Lithium Battery pack, 6x 455W Canadian Solar Monocrystalline Panels, mounting brackets, protection box with surge protectors, complete cable trunking and expert installation certificate. Perfect for power-shedding backup. 2 Years warranty on inverter, 5 years on battery.",
    category: "solar",
    priceUSD: 2450,
    priceZWL: 2450 * ZIM_CURRENCY_RATE,
    images: [
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1620021650175-cf1aa2af9df5?auto=format&fit=crop&q=80&w=400"
    ],
    location: "Avondale, Harare",
    condition: Condition.NEW,
    status: Status.ACTIVE,
    views: 342,
    likes: 54,
    createdAt: "2026-05-15T09:00:00Z",
    expiresAt: "2026-07-15T09:00:00Z",
    shippingOptions: ["ZimMart Delivery", "Pickup"],
    tags: ["solar", "inverter", "growatt", "harare", "magetsi", "lithium", "backup"]
  },
  {
    id: "list-2",
    userId: "user-1",
    sellerName: "Taona Moyo",
    title: "Eco-friendly Borehole Drilling & Casing Special",
    description: "Get clean, reliable water today! We offer standard 40-meter borehole drilling with robust casing. Standard package includes: Hydrogeological survey/siting, Drilling certificate, 40m drilling, high-quality 140mm PVC class 9 casing, and deep-well cap. Solar borehole pump installation also available. Available across Harare, Chitungwiza, and Ruwa.",
    category: "services",
    priceUSD: 1600,
    priceZWL: 1600 * ZIM_CURRENCY_RATE,
    images: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600"
    ],
    location: "Borrowdale, Harare",
    condition: Condition.NEW,
    status: Status.ACTIVE,
    views: 189,
    likes: 31,
    createdAt: "2026-05-20T11:45:00Z",
    expiresAt: "2026-07-20T11:45:00Z",
    shippingOptions: ["Pickup"],
    tags: ["borehole", "water", "drilling", "pump", "harare"]
  },
  {
    id: "list-3",
    userId: "user-2",
    sellerName: "Chido Chimonyo",
    title: "Bulk Cooking Oil (Case of 12 x 2-Litre Bottles)",
    description: "Pure vegetable cooking oil, locally refined. Price is per case containing twelve 2-Litre bottles. Ideal for tuckshops, community groups, or home storage. Strict quality check. Discount on 10+ cases. payment accepted via EcoCash, ZIPIT, or USD cash on delivery.",
    category: "groceries",
    priceUSD: 42,
    priceZWL: 42 * ZIM_CURRENCY_RATE,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600"
    ],
    location: "Chitungwiza, Harare",
    condition: Condition.NEW,
    status: Status.ACTIVE,
    views: 520,
    likes: 112,
    createdAt: "2026-06-01T14:00:00Z",
    expiresAt: "2026-08-01T14:00:00Z",
    shippingOptions: ["Pickup", "Direct Seller Delivery"],
    tags: ["bulk", "groceries", "cooking oil", "tuckshop", "chitungwiza"]
  },
  {
    id: "list-4",
    userId: "user-1",
    sellerName: "Taona Moyo",
    title: "Healthy Roadrunner Chickens (Sasso & Boschveld)",
    description: "Day-old to month-old chicks available. Very healthy, fully vaccinated for Newcastle and Gumboro diseases. Ideal for starting poultry projects in Zimbabwe. Month-old chicks are 100% off-brooder, feeding on growers mash. Very high survival rates and quick growth. Visit our cages in Mount Pleasant or we can arrange transport to Mbare Musika for regional pickups.",
    category: "farming",
    priceUSD: 3.5,
    priceZWL: 3.5 * ZIM_CURRENCY_RATE,
    images: [
      "https://images.unsplash.com/photo-1548550022-c14194096a60?auto=format&fit=crop&q=80&w=600"
    ],
    location: "Mt Pleasant, Harare",
    condition: Condition.NEW,
    status: Status.ACTIVE,
    views: 412,
    likes: 80,
    createdAt: "2026-05-10T15:30:00Z",
    expiresAt: "2026-07-10T15:30:00Z",
    shippingOptions: ["Pickup", "Direct Seller Delivery"],
    tags: ["poultry", "roadrunners", "chickens", "farming", "sasso", "boschveld", "huku"]
  },
  {
    id: "list-5",
    userId: "user-3",
    sellerName: "Farai Gumbo",
    title: "Toyota Hilux D4D Double Cabin Canopy (Slightly Used)",
    description: "Selling an original Beekman fiberglass canopy for Toyota Hilux Double Cabin (2012 to 2018 models). Painted white. Fully lockable rear glass hatch, operational side sliding tinted-windows with burglar bars, and interior felt lining. No scratches, excellent water seals. Perfect upgrade for agricultural deliveries or family trips. Mounting clamps are fully included.",
    category: "vehicles",
    priceUSD: 850,
    priceZWL: 850 * ZIM_CURRENCY_RATE,
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600"
    ],
    location: "Bulawayo CBD, Bulawayo",
    condition: Condition.GOOD,
    status: Status.ACTIVE,
    views: 98,
    likes: 12,
    createdAt: "2026-06-02T10:00:00Z",
    expiresAt: "2026-08-02T10:00:00Z",
    shippingOptions: ["Pickup"],
    tags: ["hilux", "toyota", "canopy", "car parts", "bulawayo"]
  },
  {
    id: "list-6",
    userId: "user-2",
    sellerName: "Chido Chimonyo",
    title: "4-Burner Gas Stove & Oven (Defy)",
    description: "Original Defy 4-burner gas stove with integrated spacious gas oven and grill. Includes robust auto-ignition spark, enamel pot stands, removable glass lid for splash safety, and 1x gas regulator with 1.2m hose. Perfect for cooking efficiently during electrical load shedding. Gas cylinder not included but compatible with standard CADAC cylinders.",
    category: "furniture",
    priceUSD: 299,
    priceZWL: 299 * ZIM_CURRENCY_RATE,
    images: [
      "https://images.unsplash.com/photo-1522012147041-30a112008767?auto=format&fit=crop&q=80&w=600"
    ],
    location: "Warren Park, Harare",
    condition: Condition.LIKE_NEW,
    status: Status.ACTIVE,
    views: 295,
    likes: 45,
    createdAt: "2026-05-28T08:15:00Z",
    expiresAt: "2026-07-28T08:15:00Z",
    shippingOptions: ["Pickup", "Direct Seller Delivery"],
    tags: ["defy", "gas stove", "oven", "load shedding", "kitchen", "gas"]
  }
];

export const MOCK_CHATS = [
  {
    id: "chat-1",
    listingId: "list-3",
    listingTitle: "Bulk Cooking Oil (Case of 12 x 2L)",
    listingImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200",
    listingPriceUSD: 42,
    otherUser: MOCK_USERS["user-1"], // Seller: Chido, Buyer: Taona
    messages: [
      {
        id: "msg-1",
        senderId: "user-1",
        receiverId: "user-2",
        listingId: "list-3",
        content: "Salibonani Chido, is this bulk cooking oil still available?",
        isRead: true,
        timestamp: "2026-06-03T12:00:00Z",
        isSynced: true
      },
      {
        id: "msg-2",
        senderId: "user-2",
        receiverId: "user-1",
        listingId: "list-3",
        content: "Mhoro Taona! Yes, I still have 15 cases left. How many do you need?",
        isRead: true,
        timestamp: "2026-06-03T12:05:00Z",
        isSynced: true
      },
      {
        id: "msg-3",
        senderId: "user-1",
        receiverId: "user-2",
        listingId: "list-3",
        content: "I need 5 cases for my family shop in Avondale. Can I pay with EcoCash on pickup tomorrow morning?",
        isRead: true,
        timestamp: "2026-06-03T12:10:00Z",
        isSynced: true
      },
      {
        id: "msg-4",
        senderId: "user-2",
        receiverId: "user-1",
        listingId: "list-3",
        content: "That's perfect. I accept EcoCash. I will keep 5 cases locked for you. I can give you my EcoCash merchant code to verify payment on arrival.",
        isRead: true,
        timestamp: "2026-06-03T12:15:00Z",
        isSynced: true
      }
    ]
  }
];
