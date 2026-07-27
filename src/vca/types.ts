export type TabType = 'dashboard' | 'portfolio' | 'grading' | 'vault' | 'marketplace' | 'track' | 'support' | 'account' | 'pokevault';

export interface CardItem {
  id: string; // VCA-882194
  title: string;
  set: string;
  year: number;
  category: 'Pokemon' | 'Sports' | 'Magic: The Gathering' | 'Yu-Gi-Oh!' | 'One Piece' | 'Lorcana' | 'Other';
  grade: string;
  score: number;
  condition: string;
  nfcStatus: 'ACTIVE' | 'STANDBY' | 'LOCKED';
  tamperStatus: 'SECURE' | 'WARNING' | 'BREACHED';
  authStatus: 'PASSED' | 'PENDING' | 'FLAGGED';
  owner: string;
  lastScan: string;
  estimatedValue: number;
  valueChange30d: number;
  imageBg: string;
  artwork: string;
  imageUrl?: string;
  backImageUrl?: string;
  subgrades: {
    centering: number;
    corners: number;
    edges: number;
    surface: number;
  };
  history: Array<{
    date: string;
    event: string;
    status: string;
  }>;
}

export interface MarketplaceListing {
  id: string;
  cardId: string;
  title: string;
  set: string;
  grade: string;
  score: number;
  price: number;
  estimatedValue: number;
  seller: string;
  category: 'Pokemon' | 'Sports' | 'Magic: The Gathering' | 'Yu-Gi-Oh!' | 'One Piece' | 'Lorcana';
  isAuction: boolean;
  currentBid?: number;
  bidsCount?: number;
  auctionEnds?: string;
  imageBg: string;
  artwork: string;
  imageUrl?: string;
  backImageUrl?: string;
  nfcVerified: boolean;
}

export interface LedgerEvent {
  id: string;
  timestamp: string;
  type: 'NFC_SCAN' | 'QR_VIEW' | 'OWNERSHIP_VERIFY' | 'VAULT_ADD' | 'CERT_ISSUED' | 'TAMPER_CHECK';
  description: string;
  status: 'verified' | 'warning' | 'info';
  serial: string;
  device: string;
  signature: string;
}
