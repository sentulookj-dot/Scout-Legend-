export interface CardStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export type CardType = 
  | "Standard Gold"
  | "Standard Silver"
  | "Rare gold"
  | "Holographic Elite"
  | "Retro Legend"
  | "Futuristic Icon";

export interface Card {
  id: string;
  name: string;
  position: string; // ST, LW, RW, CAM, CM, CDM, CB, LB, RB, GK
  nationality: string;
  club: string;
  rating: number;
  stats: CardStats;
  cardType: CardType;
  isHolographic: boolean;
  isCustom: boolean; // Flag if created by user via GenAI prompt
  specialPower?: string;
  powerDescription?: string;
  shortBio?: string;
  originalCreator?: string; // Player name/email or "AI Generator"
  avatarStyle?: "avataaars" | "notionists" | "pixel-art" | "bottts" | "adventurer";
  avatarSeed?: string;
  imageUrl?: string;
  marketPrice?: number; // Price if listed on the marketplace
  marketItemId?: string; // Unique listing ID
}

export interface UserProgress {
  coins: number;
  gems: number;
  collection: Card[];
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  dailyStreak: number;
  lastLoginDate?: string; // ISO string of last daily login claim
  consecutiveDays: number;
}

export interface MarketItem {
  id: string;
  card: Card;
  sellerName: string;
  price: number;
  currency: "coins" | "gems";
  isSimulated: boolean; // True if listed by simulated other players
}

export interface TradeOffer {
  id: string;
  traderName: string;
  traderAvatar: string;
  offeredCard: Card;
  requestedCardType: CardType | "Any Gold" | "Rating 85+";
  requestedPosition?: string;
  coinsBonus?: number; // Optional gold coins offered/requested
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  collectionCount: number;
  holographicCount: number;
  maxRating: number;
  coins: number;
  isCurrentUser: boolean;
}

export interface CommentaryEvent {
  minute: number;
  event: string;
  score: string;
}

export interface BattleResult {
  scoreLine: string;
  winner: "player" | "ai" | "draw";
  commentaryEvents: CommentaryEvent[];
  matchSummary: string;
}
