export enum Currency {
  USD = "USD",
  ZWL = "ZiG" // Standardized local currency (Zimbabwe Gold) or ZWL
}

export enum Condition {
  NEW = "New",
  LIKE_NEW = "Like New",
  GOOD = "Good",
  FAIR = "Fair",
  PARTS = "For Parts"
}

export enum Status {
  ACTIVE = "Active",
  PENDING_ESCROW = "Pending Escrow",
  SOLD = "Sold",
  EXPIRED = "Expired"
}

export enum PaymentMethod {
  ECOCASH = "EcoCash",
  ONEWALLET = "OneWallet",
  ZIPIT = "ZIPIT Bank Transfer",
  BANK_TRANSFER = "Manual Bank Transfer",
  CASH_ON_DELIVERY = "Cash on Delivery"
}

export enum ConnectionSpeed {
  ONLINE = "4G / Wi-Fi (Fast)",
  SLOW_3G = "3G (Low Bandwidth)",
  EXTREME_2G = "2G (Text Only)",
  OFFLINE = "Offline Mode"
}

export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  avatar: string;
  verified: boolean;
  verificationLevel: "Unverified" | "Verified" | "Trusted";
  rating: number;
  reviewCount: number;
  joinedDate: string;
  completenessScore: number; // 0-100%
  idDocumentSubmitted?: boolean;
  proofOfResidenceSubmitted?: boolean;
}

export interface Listing {
  id: string;
  userId: string;
  sellerName: string;
  title: string;
  description: string;
  category: string;
  priceUSD: number;
  priceZWL: number; // Local currency conversion
  images: string[];
  location: string; // Suburbs (e.g. Avondale, Borrowdale, Chitungwiza, Bulawayo CBD)
  condition: Condition;
  status: Status;
  views: number;
  likes: number;
  createdAt: string;
  expiresAt: string;
  shippingOptions: string[]; // "Pickup", "ZimMart Delivery", "Direct Seller Delivery"
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  content: string;
  isRead: boolean;
  timestamp: string;
  isSynced: boolean; // For offline buffer queue
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPriceUSD: number;
  otherUser: User;
  lastMessage?: Message;
  messages: Message[];
}

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  status: "Initiated" | "Escrow Hold" | "Completed" | "Disputed" | "Refunded";
  escrowStatus: "Inactive" | "Funds Held" | "Dispute Initiated" | "Released";
  createdAt: string;
  invoiceNumber: string;
  proofOfPaymentUrl?: string;
  bankReference?: string;
  receiverPhone?: string; // EcoCash phone
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewedId: string; // seller/buyer
  listingId: string;
  listingTitle: string;
  rating: number;
  comment: string;
  categories: {
    communication: number;
    accuracy: number;
    shipping: number;
    condition: number;
  };
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface SavedSearch {
  id: string;
  query: string;
  filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: Condition;
  };
  createdAt: string;
}

export interface ZimNotification {
  id: string;
  title: string;
  titleShona: string;
  titleNdebele: string;
  description: string;
  descriptionShona: string;
  descriptionNdebele: string;
  listingId?: string;
  createdAt: string;
  isRead: boolean;
  type: "info" | "new_product" | "escrow" | "message";
}

