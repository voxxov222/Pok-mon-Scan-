export type EnergyType = 'Fire' | 'Water' | 'Grass' | 'Lightning' | 'Psychic' | 'Fighting' | 'Darkness' | 'Metal' | 'Dragon' | 'Colorless';

export interface GradeSubScores {
  centering: { score: number; note: string };
  edges: { score: number; note: string };
  surface: { score: number; note: string };
  corners: { score: number; note: string };
}

export interface PriceSource {
  name: string;
  url: string;
  price: number;
  type: 'sold' | 'listing' | 'market';
  date?: string;
}

export interface CardData {
  id: string;
  name: string;
  set: string;
  cardNumber: string;
  rarity: string;
  energyType?: EnergyType;
  condition?: string;
  lowPrice: number;
  highPrice: number;
  medianPrice?: number;
  sourceUrl: string;
  sources?: PriceSource[];
  imageUrl?: string;
  dateScanned: number;
  userId: string;
  estimatedGrade?: number; // e.g. 9.5
  subGrades?: GradeSubScores;
  gradeReasoning?: string;
  isForTrade?: boolean;
  tradeWants?: string;
}

export interface TradeListing {
  id: string;
  userId: string;
  userDisplayName: string;
  card: CardData;
  lookingFor: string;
  status: 'active' | 'pending' | 'completed';
  createdAt: number;
}

export interface TradeMessage {
  id: string;
  tradeId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  commentCount: number;
  createdAt: number;
}

export interface ForumComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: number;
}

export interface PriceAlert {
  id: string;
  cardName: string;
  oldPrice: number;
  newPrice: number;
  percentageChange: number;
  timestamp: number;
  read: boolean;
}
